// ============================================================
// Tren Dunia — daily counts in Supabase `tren_dunia`
// Storage slug format: daily|YYYY-MM-DD|wordType|entrySlug
// (MY calendar day via Asia/Kuala_Lumpur). Rows from other
// days are removed on read/write so counts reset at midnight MY.
// ============================================================

import type { PeribahasaSummary } from "../config/apiConfig";
import { mapRowToSummary } from "./kamus";
import {
  getBahasaKlasikBySlug,
  getPeribahasaBySlug,
  getSupabaseClient,
} from "./supabase";

const TREN_PREFIX = "daily";

const ALLOWED_WORD_TYPES = new Set([
  "peribahasa",
  "bahasa-klasik",
  "bahasa-istana",
]);

export function getMalaysiaCalendarDateString(date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function normalizeTrenWordType(wordType: string): string | null {
  const t = String(wordType ?? "").trim().toLowerCase().replace(/_/g, "-");
  return ALLOWED_WORD_TYPES.has(t) ? t : null;
}

export function buildTrenDuniaRowSlug(
  myDate: string,
  wordType: string,
  entrySlug: string
): string {
  const wt = normalizeTrenWordType(wordType);
  const safeSlug = String(entrySlug ?? "").trim();
  if (!myDate || !wt || !safeSlug) {
    throw new Error("[tren_dunia] Invalid slug parts");
  }
  return `${TREN_PREFIX}|${myDate}|${wt}|${safeSlug}`;
}

export function parseTrenDuniaRowSlug(rowSlug: string): {
  myDate: string;
  wordType: string;
  entrySlug: string;
} | null {
  if (!rowSlug.startsWith(`${TREN_PREFIX}|`)) return null;
  const parts = rowSlug.split("|");
  if (parts.length < 4) return null;
  const myDate = parts[1];
  const wordType = String(parts[2] ?? "").trim().toLowerCase().replace(/_/g, "-");
  const entrySlug = parts.slice(3).join("|");
  if (!ALLOWED_WORD_TYPES.has(wordType)) return null;
  return { myDate, wordType, entrySlug };
}

function toSummary(
  m: ReturnType<typeof mapRowToSummary>,
  wordTypeForUrl: string
): PeribahasaSummary {
  return {
    id: m.id,
    phrase: m.phrase,
    slug: m.slug,
    meaning_ms: m.meaning_ms,
    category: m.category,
    word_type: wordTypeForUrl,
    created_at: m.created_at ?? null,
    _type: m._type,
  };
}

async function resolveEntryToSummary(
  wordType: string,
  entrySlug: string
): Promise<PeribahasaSummary | null> {
  if (wordType === "peribahasa") {
    const row = await getPeribahasaBySlug(entrySlug);
    if (!row) return null;
    return toSummary(mapRowToSummary(row, "peribahasa"), "peribahasa");
  }

  if (wordType === "bahasa-klasik" || wordType === "bahasa-istana") {
    const row = await getBahasaKlasikBySlug(entrySlug);
    if (!row) return null;
    const m = mapRowToSummary(row, "bahasa-klasik");
    return toSummary(m, wordType);
  }

  return null;
}

/** Remove rows not belonging to the given Malaysia calendar day. */
export async function pruneTrenDuniaOutsideMalaysiaDay(
  myDate: string
): Promise<void> {
  const client = getSupabaseClient();
  const pattern = `${TREN_PREFIX}|${myDate}|%`;
  const { error } = await client.from("tren_dunia").delete().not("slug", "like", pattern);
  if (error) {
    throw new Error(`[tren_dunia:prune] ${error.message}`);
  }
}

export async function incrementTrenDuniaClick(
  wordType: string,
  entrySlug: string
): Promise<void> {
  const wt = normalizeTrenWordType(wordType);
  const slug = String(entrySlug ?? "").trim();
  if (!wt || !slug) {
    throw new Error("[tren_dunia] Bad wordType or slug");
  }

  const myDate = getMalaysiaCalendarDateString();
  await pruneTrenDuniaOutsideMalaysiaDay(myDate);

  const fullSlug = buildTrenDuniaRowSlug(myDate, wt, slug);
  const client = getSupabaseClient();
  const nowIso = new Date().toISOString();

  const { data: existing, error: readErr } = await client
    .from("tren_dunia")
    .select("count")
    .eq("slug", fullSlug)
    .maybeSingle();

  if (readErr) {
    throw new Error(`[tren_dunia] ${readErr.message}`);
  }

  if (!existing) {
    const { error: insErr } = await client.from("tren_dunia").insert({
      slug: fullSlug,
      count: 1,
      last_updated: nowIso,
      created_at: nowIso,
    });
    if (insErr?.code === "23505") {
      await bumpExistingCount(fullSlug, nowIso);
      return;
    }
    if (insErr) {
      throw new Error(`[tren_dunia] ${insErr.message}`);
    }
    return;
  }

  await bumpExistingCount(fullSlug, nowIso, Number(existing.count));
}

async function bumpExistingCount(
  fullSlug: string,
  nowIso: string,
  knownCount?: number
): Promise<void> {
  const client = getSupabaseClient();
  let next = (knownCount ?? 0) + 1;
  if (knownCount === undefined) {
    const { data: row, error } = await client
      .from("tren_dunia")
      .select("count")
      .eq("slug", fullSlug)
      .maybeSingle();
    if (error) throw new Error(`[tren_dunia] ${error.message}`);
    if (!row) {
      const { error: insErr } = await client.from("tren_dunia").insert({
        slug: fullSlug,
        count: 1,
        last_updated: nowIso,
        created_at: nowIso,
      });
      if (insErr) throw new Error(`[tren_dunia] ${insErr.message}`);
      return;
    }
    next = Number(row.count) + 1;
  }

  const { error: updErr } = await client
    .from("tren_dunia")
    .update({ count: next, last_updated: nowIso })
    .eq("slug", fullSlug);

  if (updErr) {
    throw new Error(`[tren_dunia] ${updErr.message}`);
  }
}

export async function getTopTrenDuniaSummaries(
  limit = 5,
  filterWordType?: string
): Promise<PeribahasaSummary[]> {
  const myDate = getMalaysiaCalendarDateString();
  await pruneTrenDuniaOutsideMalaysiaDay(myDate);

  const client = getSupabaseClient();
  const pattern = `${TREN_PREFIX}|${myDate}|%`;

  const { data: rows, error } = await client
    .from("tren_dunia")
    .select("slug, count")
    .like("slug", pattern)
    .order("count", { ascending: false })
    .limit(limit * 3); // Fetch more to account for filtering

  if (error) {
    throw new Error(`[tren_dunia] ${error.message}`);
  }

  const summaries: PeribahasaSummary[] = [];
  for (const row of rows ?? []) {
    const parsed = parseTrenDuniaRowSlug(String(row.slug));
    if (!parsed) continue;
    
    // Filter by word type if specified and not "all"
    if (filterWordType && filterWordType !== "all") {
      const normalized = normalizeTrenWordType(filterWordType);
      if (normalized !== parsed.wordType) continue;
    }
    
    const sum = await resolveEntryToSummary(parsed.wordType, parsed.entrySlug);
    if (sum) summaries.push(sum);
    
    if (summaries.length >= limit) break;
  }

  return summaries;
}
