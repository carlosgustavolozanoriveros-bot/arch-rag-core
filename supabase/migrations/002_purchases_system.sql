-- Migration: 002_purchases_system
-- Purchases table, drive_file_id, and access control function

-- 1. Crear tabla purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  resource_id TEXT REFERENCES aec_resources(id),
  payment_ref TEXT UNIQUE,
  payment_method TEXT,
  amount_cop NUMERIC(12,0) NOT NULL,
  purchase_type TEXT NOT NULL DEFAULT 'single'
    CHECK (purchase_type IN ('single', 'subscription')),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'voided')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_unique
  ON purchases(user_id, resource_id)
  WHERE purchase_type = 'single' AND status = 'approved';

CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_ref ON purchases(payment_ref);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Agregar drive_file_id a aec_resources
ALTER TABLE aec_resources ADD COLUMN IF NOT EXISTS drive_file_id TEXT;

UPDATE aec_resources
SET drive_file_id = substring(url_accion from 'id=([a-zA-Z0-9_-]+)')
WHERE url_accion IS NOT NULL AND drive_file_id IS NULL;

-- 3. Función de verificación de acceso
CREATE OR REPLACE FUNCTION user_has_access(p_user_id UUID, p_resource_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM user_profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN true;
  END IF;
  IF EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = p_user_id AND role = 'subscriber' AND subscription_expires_at > NOW()
  ) THEN
    RETURN true;
  END IF;
  IF EXISTS (
    SELECT 1 FROM purchases
    WHERE user_id = p_user_id AND resource_id = p_resource_id
      AND purchase_type = 'single' AND status = 'approved'
  ) THEN
    RETURN true;
  END IF;
  RETURN false;
END;
$$;
