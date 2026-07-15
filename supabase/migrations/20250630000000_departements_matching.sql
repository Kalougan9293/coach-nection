-- Migration : colonnes departements text[] + fonction de matching n8n
-- À exécuter dans Supabase SQL Editor ou via CLI.

-- ─── COACHS : ville (texte) → departements (text[]) ───
ALTER TABLE public.coachs
  ADD COLUMN IF NOT EXISTS departements text[];

UPDATE public.coachs
SET departements = (
  SELECT COALESCE(
    array_agg(DISTINCT trim(d) ORDER BY trim(d)),
    '{}'::text[]
  )
  FROM unnest(string_to_array(ville, ',')) AS d
  WHERE trim(d) <> ''
)
WHERE (departements IS NULL OR departements = '{}')
  AND ville IS NOT NULL
  AND trim(ville) <> '';

ALTER TABLE public.coachs
  DROP COLUMN IF EXISTS ville;

CREATE INDEX IF NOT EXISTS idx_coachs_departements ON public.coachs USING GIN (departements);
CREATE INDEX IF NOT EXISTS idx_coachs_specialites ON public.coachs USING GIN (specialites);
CREATE INDEX IF NOT EXISTS idx_coachs_type_cours ON public.coachs USING GIN (type_cours);

-- ─── DEMANDES : ajout departements (ville libre conservée pour affichage) ───
ALTER TABLE public.demandes
  ADD COLUMN IF NOT EXISTS departements text[];

CREATE INDEX IF NOT EXISTS idx_demandes_departements ON public.demandes USING GIN (departements);

-- ─── RPC : matching automatique pour n8n / webhooks ───
CREATE OR REPLACE FUNCTION public.match_coachs_for_demande(p_demande_id uuid)
RETURNS SETOF public.coachs
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.*
  FROM coachs c
  INNER JOIN demandes d ON d.id = p_demande_id
  WHERE c.specialites && d.specialites
    AND c.type_cours && d.type_cours
    AND c.departements @> d.departements
    AND d.departements IS NOT NULL
    AND cardinality(d.departements) > 0;
$$;

COMMENT ON FUNCTION public.match_coachs_for_demande(uuid) IS
  'Retourne les coachs compatibles : specialites && demande.specialites AND type_cours && demande.type_cours AND departements @> demande.departements';

GRANT EXECUTE ON FUNCTION public.match_coachs_for_demande(uuid) TO anon, authenticated, service_role;
