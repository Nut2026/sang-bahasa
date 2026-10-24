-- ============================================================
-- Sang Bahasa — Row Level Security for public website reads
-- The Astro frontend uses the Supabase anon key + PostgREST. Without
-- SELECT policies for role "anon", every query returns zero rows
-- even though data exists (the FastAPI DB user bypasses RLS).
--
-- Apply in Supabase: Dashboard → SQL Editor → Run, or:
--   psql "$DATABASE_URL" -f database/supabase_anon_select_policies.sql
-- ============================================================

ALTER TABLE public.peribahasa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read peribahasa" ON public.peribahasa;
CREATE POLICY "Allow anonymous read peribahasa"
  ON public.peribahasa
  FOR SELECT
  TO anon, authenticated
  USING (true);

ALTER TABLE public.bahasa_klasik ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous read bahasa_klasik" ON public.bahasa_klasik;
CREATE POLICY "Allow anonymous read bahasa_klasik"
  ON public.bahasa_klasik
  FOR SELECT
  TO anon, authenticated
  USING (true);
