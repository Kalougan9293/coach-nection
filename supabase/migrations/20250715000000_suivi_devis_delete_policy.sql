-- Autoriser la suppression des devis depuis l'admin (client anon).
-- Sans policy DELETE, Supabase renvoie succès mais ne supprime aucune ligne.

ALTER TABLE public.suivi_devis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public delete on suivi_devis" ON public.suivi_devis;
CREATE POLICY "Allow public delete on suivi_devis"
  ON public.suivi_devis
  FOR DELETE
  TO anon, authenticated
  USING (true);
