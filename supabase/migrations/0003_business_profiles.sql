-- ============================================================
-- business_profiles table
-- Stores company / onboarding data collected on first login.
-- One row per user — enforced by the unique constraint on user_id.
-- ============================================================
CREATE TABLE IF NOT EXISTS business_profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name     text NOT NULL CHECK (char_length(company_name) <= 200),
  industry         text NOT NULL CHECK (industry IN (
                     'healthcare', 'legal', 'finance', 'hr', 'government', 'other'
                   )),
  company_size     text NOT NULL CHECK (company_size IN (
                     '1-10', '11-50', '51-200', '200+'
                   )),
  job_title        text NOT NULL CHECK (char_length(job_title) <= 100),
  company_website  text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT business_profiles_user_id_key UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS business_profiles_user_id_idx ON business_profiles (user_id);

-- updated_at trigger (reuses function from 0001_initial.sql)
CREATE TRIGGER business_profiles_updated_at
  BEFORE UPDATE ON business_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON business_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON business_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON business_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
