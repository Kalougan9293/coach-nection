/** Départements métropolitains + Corse (aligné formulaire coach). */
export const DEPARTEMENTS_LIST = [
  ...Array.from({ length: 95 }, (_, i) => (i + 1).toString().padStart(2, "0")),
  "2A",
  "2B",
] as const;

/** Villes / mots-clés courants → code département. */
const VILLE_TO_DEPARTEMENT: Record<string, string> = {
  paris: "75",
  lyon: "69",
  marseille: "13",
  toulouse: "31",
  nice: "06",
  nantes: "44",
  montpellier: "34",
  strasbourg: "67",
  bordeaux: "33",
  lille: "59",
  rennes: "35",
  reims: "51",
  "saint-étienne": "42",
  "saint etienne": "42",
  toulon: "83",
  grenoble: "38",
  dijon: "21",
  angers: "49",
  nîmes: "30",
  nimes: "30",
  villeurbanne: "69",
  "le havre": "76",
  "saint-denis": "93",
  "saint denis": "93",
  clermont: "63",
  "clermont-ferrand": "63",
  aix: "13",
  "aix-en-provence": "13",
  brest: "29",
  tours: "37",
  amiens: "80",
  limoges: "87",
  perpignan: "66",
  metz: "57",
  besançon: "25",
  besancon: "25",
  orléans: "45",
  orleans: "45",
  rouen: "76",
  mulhouse: "68",
  caen: "14",
  nancy: "54",
  argenteuil: "95",
  montreuil: "93",
  roubaix: "59",
  tourcoing: "59",
  nanterre: "92",
  "boulogne-billancourt": "92",
  versailles: "78",
  courbevoie: "92",
  vitry: "94",
  "vitry-sur-seine": "94",
  colombes: "92",
  asnieres: "92",
  "asnieres-sur-seine": "92",
  aubervilliers: "93",
  "aulnay-sous-bois": "93",
  "rueil-malmaison": "92",
  antibes: "06",
  cannes: "06",
  avignon: "84",
  poitiers: "86",
  dunkerque: "59",
  béziers: "34",
  beziers: "34",
};

export function normalizeDepartementCode(raw: string): string | null {
  const val = raw.trim().toUpperCase();
  if (/^2[AB]$/.test(val)) return val;
  if (/^\d{1,2}$/.test(val)) {
    const padded = val.padStart(2, "0");
    if ((DEPARTEMENTS_LIST as readonly string[]).includes(padded)) return padded;
  }
  return null;
}

function deptFromPostalCode(cp: string): string | null {
  if (!/^\d{5}$/.test(cp)) return null;
  if (cp.startsWith("20")) {
    const num = parseInt(cp, 10);
    return num < 20200 ? "2A" : "2B";
  }
  if (cp.startsWith("97") || cp.startsWith("98")) {
    return cp.slice(0, 3);
  }
  return normalizeDepartementCode(cp.slice(0, 2));
}

function lookupVilleKey(key: string): string | null {
  const normalized = key
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+\d{1,2}(e|er|eme|eme)?\b/gi, "")
    .replace(/\b\d{1,2}(e|er|eme|eme)\b/gi, "")
    .trim();
  if (!normalized) return null;
  if (VILLE_TO_DEPARTEMENT[normalized]) return VILLE_TO_DEPARTEMENT[normalized];
  const first = normalized.split(/\s+/)[0];
  return first ? VILLE_TO_DEPARTEMENT[first] ?? null : null;
}

/**
 * Extrait les codes département depuis un libellé ville libre
 * (ex. "Paris 15e" → ["75"], "Lyon, 69" → ["69"]).
 */
export function extractDepartementsFromVille(ville: string): string[] {
  const found = new Set<string>();
  const text = ville.trim();
  if (!text) return [];

  for (const m of text.matchAll(/\b(\d{5})\b/g)) {
    const d = deptFromPostalCode(m[1]);
    if (d) found.add(d);
  }

  for (const m of text.matchAll(/\b(\d{2}|2[AB])\b/gi)) {
    const n = normalizeDepartementCode(m[1]);
    if (n) found.add(n);
  }

  if (/\bparis\b/i.test(text)) {
    found.add("75");
  }

  for (const segment of text.split(/[,;/]/)) {
    const d = lookupVilleKey(segment);
    if (d) found.add(d);
  }

  return Array.from(found).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** Parse l'ancienne colonne `ville` des coachs ("75, 92"). */
export function parseDepartementsFromLegacyVille(ville: string | null | undefined): string[] {
  if (!ville?.trim()) return [];
  return ville
    .split(",")
    .map((p) => normalizeDepartementCode(p.trim()))
    .filter((d): d is string => d !== null);
}

export function formatDepartementsLabel(
  departements: string[] | null | undefined,
  legacyVille?: string | null
): string {
  const depts =
    departements && departements.length > 0
      ? departements
      : parseDepartementsFromLegacyVille(legacyVille);
  if (depts.length === 0) return "—";
  return depts.map((d) => `Dép. ${d}`).join(", ");
}

export function mergeDepartements(...lists: string[][]): string[] {
  const set = new Set<string>();
  for (const list of lists) {
    for (const d of list) {
      const n = normalizeDepartementCode(d);
      if (n) set.add(n);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/**
 * Garantit un `text[]` Postgres pour Supabase (jamais une chaîne concaténée).
 * Accepte un tableau ou l'ancien format "75, 92".
 */
export function toDepartementsArray(
  value: string[] | string | null | undefined
): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return mergeDepartements(value);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed) as unknown;
        if (Array.isArray(parsed)) {
          return mergeDepartements(parsed.map(String));
        }
      } catch {
        /* format libre ci-dessous */
      }
    }
    if (trimmed.includes(",")) {
      return parseDepartementsFromLegacyVille(trimmed);
    }
    const code = normalizeDepartementCode(trimmed);
    if (code) return [code];
    return extractDepartementsFromVille(trimmed);
  }
  return [];
}

/** Lit `departements` depuis Supabase (text[]) avec repli optionnel sur `ville`. */
export function resolveDepartementsForRow(
  departements: string[] | string | null | undefined,
  options?: { fallbackVille?: string | null }
): string[] {
  const arr = toDepartementsArray(departements);
  if (arr.length > 0) return arr;
  if (options?.fallbackVille?.trim()) {
    return extractDepartementsFromVille(options.fallbackVille);
  }
  return [];
}

/**
 * Format final pour insertion Supabase (`text[]` Postgres).
 * Retourne toujours un tableau JavaScript distinct, ex. `["75", "92"]`.
 */
export function prepareDepartementsForSupabase(
  value: string[] | string | null | undefined
): string[] {
  const normalized = toDepartementsArray(value);
  return normalized.length > 0 ? [...normalized] : [];
}
