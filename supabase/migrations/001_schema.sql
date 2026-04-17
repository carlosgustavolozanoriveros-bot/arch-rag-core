-- ============================================
-- AEC Conversational Agent — Database Schema
-- ============================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. AEC Resources (Product Catalog)
CREATE TABLE aec_resources (
  id TEXT PRIMARY KEY,
  nombre_ui TEXT NOT NULL,
  chunk_semantico TEXT NOT NULL,
  nombre_archivo TEXT,
  tipo_recurso TEXT NOT NULL,
  categoria TEXT NOT NULL,
  subcategoria TEXT NOT NULL,
  version_revit TEXT DEFAULT '2020',
  es_parametrico BOOLEAN DEFAULT true,
  url_thumbnail TEXT,
  url_accion TEXT,
  etiquetas_duras TEXT[],
  precio_usd NUMERIC(10,2) DEFAULT 8.00,
  embedding VECTOR(3072),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. User Profiles (extends Supabase Auth)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'free' CHECK (role IN ('free', 'subscriber', 'admin')),
  subscription_expires_at TIMESTAMPTZ,
  anonymous_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Purchases
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES aec_resources(id),
  payment_ref TEXT,
  payment_method TEXT,
  amount_usd NUMERIC(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- 5. Chats (Long-term memory)
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content TEXT NOT NULL,
  tool_calls JSONB,
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. HNSW Index for fast vector search
CREATE INDEX idx_aec_resources_embedding ON aec_resources 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- 8. Performance indexes
CREATE INDEX idx_chats_session ON chats(session_id);
CREATE INDEX idx_chats_user ON chats(user_id);
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- 9. RPC: Semantic Search
CREATE OR REPLACE FUNCTION match_resources(
  query_embedding vector(3072),
  match_threshold FLOAT DEFAULT 0.80,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  nombre_ui TEXT,
  chunk_semantico TEXT,
  tipo_recurso TEXT,
  categoria TEXT,
  subcategoria TEXT,
  version_revit TEXT,
  es_parametrico BOOLEAN,
  url_thumbnail TEXT,
  precio_usd NUMERIC,
  etiquetas_duras TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ar.id,
    ar.nombre_ui,
    ar.chunk_semantico,
    ar.tipo_recurso,
    ar.categoria,
    ar.subcategoria,
    ar.version_revit,
    ar.es_parametrico,
    ar.url_thumbnail,
    ar.precio_usd,
    ar.etiquetas_duras,
    1 - (ar.embedding <=> query_embedding) AS similarity
  FROM aec_resources ar
  WHERE 1 - (ar.embedding <=> query_embedding) > match_threshold
  ORDER BY ar.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 10. RLS Policies
ALTER TABLE aec_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read resources" ON aec_resources FOR SELECT USING (true);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own chats" ON chats FOR SELECT 
  USING (auth.uid() = user_id OR session_id = current_setting('app.session_id', true));
CREATE POLICY "Anyone can insert chats" ON chats FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own chats" ON chats FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own messages" ON messages FOR SELECT 
  USING (chat_id IN (SELECT c.id FROM chats c WHERE c.user_id = auth.uid()));
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

-- 11. Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', '')
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 12. Function to sync anonymous session to user
CREATE OR REPLACE FUNCTION sync_anonymous_session(
  p_session_id TEXT,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update chats to link to the user
  UPDATE chats SET user_id = p_user_id WHERE session_id = p_session_id AND user_id IS NULL;
  -- Save session reference in profile
  UPDATE user_profiles SET anonymous_session_id = p_session_id WHERE id = p_user_id;
END;
$$;
