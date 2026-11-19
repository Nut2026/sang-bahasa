ALTER TABLE public.tren_dunia ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous read tren_dunia" ON public.tren_dunia;
CREATE POLICY "Allow anonymous read tren_dunia"
  ON public.tren_dunia
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert tren_dunia" ON public.tren_dunia;
CREATE POLICY "Allow anonymous insert tren_dunia"
  ON public.tren_dunia
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update tren_dunia" ON public.tren_dunia;
CREATE POLICY "Allow anonymous update tren_dunia"
  ON public.tren_dunia
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete tren_dunia" ON public.tren_dunia;
CREATE POLICY "Allow anonymous delete tren_dunia"
  ON public.tren_dunia
  FOR DELETE
  TO anon, authenticated
  USING (true);
