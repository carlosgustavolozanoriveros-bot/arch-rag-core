export interface AecResource {
  id: string;
  nombre_ui: string;
  chunk_semantico: string;
  nombre_archivo: string | null;
  tipo_recurso: string;
  categoria: string;
  subcategoria: string;
  version_revit: string;
  es_parametrico: boolean;
  url_thumbnail: string | null;
  url_accion: string | null;
  etiquetas_duras: string[];
  precio_usd: number;
  embedding?: number[];
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'free' | 'subscriber' | 'admin';
  subscription_expires_at: string | null;
  anonymous_session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  resource_id: string;
  payment_ref: string | null;
  payment_method: string | null;
  amount_usd: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Chat {
  id: string;
  session_id: string;
  user_id: string | null;
  title: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  tool_calls: Record<string, unknown> | null;
  token_count: number | null;
  created_at: string;
}

export interface MatchedResource {
  id: string;
  nombre_ui: string;
  nombre_archivo: string | null;
  chunk_semantico: string;
  tipo_recurso: string;
  categoria: string;
  subcategoria: string;
  version_revit: string;
  es_parametrico: boolean;
  url_thumbnail: string | null;
  precio_usd: number;
  etiquetas_duras: string[];
  similarity: number;
}
