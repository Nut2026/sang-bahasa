import {
  getAllBahasaKlasik,
  getAllPeribahasa,
  type BahasaKlasikRow,
  type PeribahasaRow,
} from "./supabase";

export type KamusWordType =
  | "all"
  | "peribahasa"
  | "bahasa-klasik";

export interface KamusEntrySummary {
  id: string;
  phrase: string;
  slug: string;
  meaning_ms: string;
  category: string;
  _type: string;
  world: number;
  word_type: Exclude<KamusWordType, "all">;
  created_at?: string | null;
}

type SourceRow = PeribahasaRow | BahasaKlasikRow;
type ConcreteWordType = Exclude<KamusWordType, "all">;

function fallbackSlug(phrase: string) {
  return String(phrase ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function formatMalayLabel(value: string | null | undefined) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "";

  return normalized
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeTag(value: string | null | undefined) {
  return String(value ?? "").trim().toLowerCase();
}

/** Uppercase display label for entry `_type` tags on cards (e.g. PERUMPAMAAN, KLASIK). */
export function formatEntryTypeDisplayLabel(
  _type: string | null | undefined,
  wordType: KamusWordType | string
): string {
  const t = normalizeTag(_type);
  if (!t) {
    return wordType === "bahasa-klasik" ? "KLASIK" : "PERIBAHASA";
  }
  return formatMalayLabel(t).toUpperCase();
}

export function getListingPathForWordType(
  wordType: KamusEntrySummary["word_type"] | string
): string {
  if (wordType === "bahasa-klasik") return "/kamus/bahasa-klasik";
  if (wordType === "bahasa-istana") return "/kamus/bahasa-istana";
  return "/kamus/peribahasa";
}

export function buildTypeFilterHref(
  listingPath: string,
  _type: string | null | undefined
): string {
  const t = normalizeTag(_type);
  if (!t) return listingPath;
  return `${listingPath}?type=${encodeURIComponent(t)}`;
}

export function buildCategoryFilterHref(
  listingPath: string,
  category: string | null | undefined
): string {
  const c = normalizeTag(category);
  if (!c) return listingPath;
  return `${listingPath}?category=${encodeURIComponent(c)}`;
}

export function mapRowToSummary(
  row: SourceRow,
  wordType: ConcreteWordType
): KamusEntrySummary {
  return {
    id: row.id,
    phrase: row.phrase,
    slug: (row as { slug?: string | null }).slug || fallbackSlug(row.phrase),
    meaning_ms: row.meaning_ms,
    category: row.category || "",
    _type: String((row as { _type?: string | null })._type ?? "").trim(),
    world: Number((row as { world?: number | null }).world ?? 0),
    word_type: wordType,
    created_at: row.created_at,
  };
}

function sortEntries(entries: KamusEntrySummary[]) {
  return [...entries].sort((left, right) =>
    left.phrase.localeCompare(right.phrase, "ms", { sensitivity: "base" })
  );
}

export async function getEntriesByWordType(
  wordType: KamusWordType
): Promise<KamusEntrySummary[]> {
  if (wordType === "all") {
    const [peribahasa, bahasaKlasik] = await Promise.all([
      getEntriesByWordType("peribahasa"),
      getEntriesByWordType("bahasa-klasik"),
    ]);

    return sortEntries([
      ...peribahasa,
      ...bahasaKlasik,
    ]);
  }

  if (wordType === "peribahasa") {
    const rows = await getAllPeribahasa();
    return sortEntries(rows.map((row) => mapRowToSummary(row, wordType)));
  }

  const rows = await getAllBahasaKlasik();
  return sortEntries(rows.map((row) => mapRowToSummary(row, wordType)));
}

export function filterEntries(
  entries: KamusEntrySummary[],
  options?: { query?: string; category?: string; tag?: string; type?: string }
) {
  const query = String(options?.query ?? "").trim().toLowerCase();
  const selectedCategory = normalizeTag(options?.category ?? options?.tag);
  const selectedType = normalizeTag(options?.type);

  return entries.filter((entry) => {
    const matchesQuery =
      !query ||
      entry.phrase.toLowerCase().includes(query) ||
      entry.meaning_ms.toLowerCase().includes(query);

    const matchesCategory =
      !selectedCategory ||
      normalizeTag(entry.category) === selectedCategory;

    const matchesType =
      !selectedType || normalizeTag(entry._type) === selectedType;

    return matchesQuery && matchesCategory && matchesType;
  });
}

export function paginateEntries<T>(
  entries: T[],
  page: number,
  pageSize: number
) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;

  return entries.slice(start, start + pageSize);
}

export function getAvailableTags(entries: KamusEntrySummary[]) {
  return [...new Set(entries.map((entry) => normalizeTag(entry.category)))]
    .filter(Boolean)
    .sort((left, right) =>
      formatMalayLabel(left).localeCompare(formatMalayLabel(right), "ms", {
        sensitivity: "base",
      })
    );
}

export function getEntriesByKeys(
  entries: KamusEntrySummary[],
  keys: Array<{ slug: string; word_type: ConcreteWordType }>
) {
  const keySet = new Set(
    keys.map(({ slug, word_type }) => `${word_type}:${slug}`)
  );

  return entries.filter((entry) =>
    keySet.has(`${entry.word_type}:${entry.slug}`)
  );
}
