// ============================================================
// Sang Bahasa — client-side search ranking
// Normalises input like DB pipelines (trim, lower case, collapse
// spaces, strip punctuation) and ranks entries using token overlap
// (tsvector-style) plus trigram similarity (pg_trgm-style).
// ============================================================

import type { KamusEntrySummary } from "./kamus";

/** Strip combining marks after NFKD (helps match typed Latin variants). */
function stripCombiningMarks(value: string): string {
  return value.replace(/\p{M}+/gu, "");
}

/**
 * Normalise user search input for matching: trim, lowercase, strip
 * punctuation to spaces, collapse whitespace.
 */
export function normalizeSearchInput(raw: string): string {
  const folded = String(raw ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD");
  return stripCombiningMarks(folded)
    .replace(/\p{P}+/gu, " ")
    .replace(/\p{S}+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchTokens(normalized: string): string[] {
  return normalized.split(" ").filter(Boolean);
}

function trigramSet(s: string): Set<string> {
  const padded = `  ${s}  `;
  const set = new Set<string>();
  for (let i = 0; i < padded.length - 2; i++) {
    set.add(padded.slice(i, i + 3));
  }
  return set;
}

/** PostgreSQL-compatible trigram similarity: |X∩Y| / (|X|+|Y|−|X∩Y|). */
export function pgTrigramSimilarity(a: string, b: string): number {
  const A = trigramSet(a);
  const B = trigramSet(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const t of A) {
    if (B.has(t)) inter++;
  }
  const denom = A.size + B.size - inter;
  return denom > 0 ? inter / denom : 0;
}

export interface RankedKamusEntry {
  entry: KamusEntrySummary;
  score: number;
}

/** Minimum score to count as a primary search hit. */
export const SEARCH_MAIN_SCORE_THRESHOLD = 14;

/** Softer threshold for “Adakah anda mencari…” when nothing clears the bar. */
export const SEARCH_FALLBACK_SCORE_THRESHOLD = 7;

export function rankKamusEntries(
  entries: KamusEntrySummary[],
  rawQuery: string
): RankedKamusEntry[] {
  const normalized = normalizeSearchInput(rawQuery);
  if (!normalized) {
    return entries.map((entry) => ({ entry, score: 0 }));
  }

  const tokens = searchTokens(normalized);

  const scored = entries.map((entry) => {
    const phraseNorm = normalizeSearchInput(entry.phrase);
    const meaningNorm = normalizeSearchInput(entry.meaning_ms);
    const hay = `${phraseNorm} ${meaningNorm}`;

    let score = 0;

    if (phraseNorm === normalized) score += 130;
    else if (phraseNorm.startsWith(normalized)) score += 75;
    else if (phraseNorm.includes(normalized)) score += 58;

    if (meaningNorm.includes(normalized)) score += 38;

    if (tokens.length >= 2) {
      const allInHay = tokens.every((t) => hay.includes(t));
      if (allInHay) score += 48;
    }

    for (const t of tokens) {
      if (t.length >= 2 && hay.includes(t)) score += 14;
    }

    const phraseSim = pgTrigramSimilarity(normalized, phraseNorm);
    const meaningSim = pgTrigramSimilarity(normalized, meaningNorm);
    score += phraseSim * 62;
    score += meaningSim * 28;

    const maxSim = Math.max(phraseSim, meaningSim);
    if (maxSim >= 0.35) score += 10;
    if (maxSim >= 0.5) score += 12;

    return { entry, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.entry.phrase.localeCompare(b.entry.phrase, "ms", {
      sensitivity: "base",
    });
  });

  return scored;
}

export function partitionRankedSearch(
  ranked: RankedKamusEntry[],
  mainThreshold = SEARCH_MAIN_SCORE_THRESHOLD,
  fallbackThreshold = SEARCH_FALLBACK_SCORE_THRESHOLD,
  fallbackLimit = 5
): {
  matches: KamusEntrySummary[];
  fallbackSuggestions: KamusEntrySummary[];
} {
  const main = ranked.filter((r) => r.score >= mainThreshold);
  if (main.length > 0) {
    return {
      matches: main.map((r) => r.entry),
      fallbackSuggestions: [],
    };
  }

  const fallback = ranked
    .filter((r) => r.score >= fallbackThreshold && r.score > 0)
    .slice(0, fallbackLimit)
    .map((r) => r.entry);

  return {
    matches: [],
    fallbackSuggestions: fallback,
  };
}
