-- ============================================================
-- intake_submissions table
-- ============================================================
CREATE TABLE IF NOT EXISTS intake_submissions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id          uuid NOT NULL,
  document_type     text NOT NULL CHECK (document_type IN ('id', 'invoice', 'document')),
  storage_path      text,
  pdf_storage_path  text,
  form_data         jsonb NOT NULL DEFAULT '{}',
  ocr_raw           text,
  ocr_confidence    jsonb,
  status            text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'complete', 'error')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS intake_submissions_user_id_idx  ON intake_submissions (user_id);
CREATE INDEX IF NOT EXISTS intake_submissions_draft_id_idx ON intake_submissions (draft_id);

-- updated_at trigger (reuses function from 0001_initial.sql)
CREATE TRIGGER intake_submissions_updated_at
  BEFORE UPDATE ON intake_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON intake_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON intake_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON intake_submissions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Storage buckets (run in Supabase dashboard or via CLI)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('intake-documents', 'intake-documents', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('intake-pdfs', 'intake-pdfs', false) ON CONFLICT DO NOTHING;

-- Storage RLS policies (apply after creating buckets in dashboard)
-- CREATE POLICY "Users can upload their own documents"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'intake-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can read their own documents"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'intake-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can upload their own PDFs"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'intake-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can read their own PDFs"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'intake-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
