import type { SupabaseClient } from "@supabase/supabase-js";

/** Critères de matching alignés sur les requêtes SQL n8n / Postgres. */
export type DemandeMatchingCriteria = {
  specialites: string[];
  type_cours: string[];
  departements: string[];
};

export type CoachMatchRow = Record<string, unknown> & { id: string };

/**
 * Filtre les coachs avec la logique SQL :
 *   specialites && ARRAY[...]
 *   AND type_cours && ARRAY[...]
 *   AND departements @> ARRAY[...]
 */
export function buildMatchingCoachsQuery(
  supabase: SupabaseClient,
  criteria: DemandeMatchingCriteria
) {
  let query = supabase.from("coachs").select("*");

  if (criteria.specialites.length > 0) {
    query = query.overlaps("specialites", criteria.specialites);
  }
  if (criteria.type_cours.length > 0) {
    query = query.overlaps("type_cours", criteria.type_cours);
  }
  if (criteria.departements.length > 0) {
    query = query.contains("departements", criteria.departements);
  }

  return query;
}

export async function findMatchingCoachs(
  supabase: SupabaseClient,
  criteria: DemandeMatchingCriteria
) {
  return buildMatchingCoachsQuery(supabase, criteria);
}

export async function findMatchingCoachsForDemandeId(
  supabase: SupabaseClient,
  demandeId: string
) {
  const { data: demande, error } = await supabase
    .from("demandes")
    .select("specialites, type_cours, departements")
    .eq("id", demandeId)
    .single();

  if (error) throw error;
  if (!demande) return { data: [] as CoachMatchRow[], error: null };

  const criteria: DemandeMatchingCriteria = {
    specialites: (demande.specialites as string[] | null) ?? [],
    type_cours: (demande.type_cours as string[] | null) ?? [],
    departements: (demande.departements as string[] | null) ?? [],
  };

  return findMatchingCoachs(supabase, criteria);
}

/** SQL brut pour n8n (node Postgres) — paramètres nommés. */
export const MATCH_COACHS_SQL = `
SELECT c.*
FROM coachs c
WHERE
  (cardinality($1::text[]) = 0 OR c.specialites && $1::text[])
  AND (cardinality($2::text[]) = 0 OR c.type_cours && $2::text[])
  AND (cardinality($3::text[]) = 0 OR c.departements @> $3::text[]);
`;

/** SQL pour matcher à partir d'une demande existante (RPC équivalente). */
export const MATCH_COACHS_FOR_DEMANDE_SQL = `
SELECT c.*
FROM coachs c
INNER JOIN demandes d ON d.id = $1::uuid
WHERE
  c.specialites && d.specialites
  AND c.type_cours && d.type_cours
  AND c.departements @> d.departements
  AND d.departements IS NOT NULL
  AND cardinality(d.departements) > 0;
`;
