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
