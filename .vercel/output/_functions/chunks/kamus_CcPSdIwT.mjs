import { g as getAllPeribahasa, a as getAllBahasaKlasik } from './supabase_Du-GE-Q2.mjs';

function fallbackSlug(phrase) {
  return String(phrase ?? "").trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}
function formatMalayLabel(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) return "";
  return normalized.replace(/[_-]+/g, " ").split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function normalizeTag(value) {
  return String(value ?? "").trim().toLowerCase();
}
function formatEntryTypeDisplayLabel(_type, wordType) {
  const t = normalizeTag(_type);
  if (!t) {
    return wordType === "bahasa-klasik" ? "KLASIK" : "PERIBAHASA";
  }
  return formatMalayLabel(t).toUpperCase();
}
function getListingPathForWordType(wordType) {
  if (wordType === "bahasa-klasik") return "/kamus/bahasa-klasik";
  if (wordType === "bahasa-istana") return "/kamus/bahasa-istana";
  return "/kamus/peribahasa";
}
function buildTypeFilterHref(listingPath, _type) {
  const t = normalizeTag(_type);
  if (!t) return listingPath;
  return `${listingPath}?type=${encodeURIComponent(t)}`;
}
function buildCategoryFilterHref(listingPath, category) {
  const c = normalizeTag(category);
  if (!c) return listingPath;
  return `${listingPath}?category=${encodeURIComponent(c)}`;
}
function mapRowToSummary(row, wordType) {
  return {
    id: row.id,
    phrase: row.phrase,
    slug: row.slug || fallbackSlug(row.phrase),
    meaning_ms: row.meaning_ms,
    category: row.category || "",
    _type: String(row._type ?? "").trim(),
    world: Number(row.world ?? 0),
    word_type: wordType,
    created_at: row.created_at
  };
}
function sortEntries(entries) {
  return [...entries].sort(
    (left, right) => left.phrase.localeCompare(right.phrase, "ms", { sensitivity: "base" })
  );
}
async function getEntriesByWordType(wordType) {
  if (wordType === "all") {
    const [peribahasa, bahasaKlasik] = await Promise.all([
      getEntriesByWordType("peribahasa"),
      getEntriesByWordType("bahasa-klasik")
    ]);
    return sortEntries([
      ...peribahasa,
      ...bahasaKlasik
    ]);
  }
  if (wordType === "peribahasa") {
    const rows2 = await getAllPeribahasa();
    return sortEntries(rows2.map((row) => mapRowToSummary(row, wordType)));
  }
  const rows = await getAllBahasaKlasik();
  return sortEntries(rows.map((row) => mapRowToSummary(row, wordType)));
}
function filterEntries(entries, options) {
  const query = String(options?.query ?? "").trim().toLowerCase();
  const selectedCategory = normalizeTag(options?.category ?? options?.tag);
  const selectedType = normalizeTag(options?.type);
  return entries.filter((entry) => {
    const matchesQuery = !query || entry.phrase.toLowerCase().includes(query) || entry.meaning_ms.toLowerCase().includes(query);
    const matchesCategory = !selectedCategory || normalizeTag(entry.category) === selectedCategory;
    const matchesType = !selectedType || normalizeTag(entry._type) === selectedType;
    return matchesQuery && matchesCategory && matchesType;
  });
}
function paginateEntries(entries, page, pageSize) {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return entries.slice(start, start + pageSize);
}
function getAvailableTags(entries) {
  return [...new Set(entries.map((entry) => normalizeTag(entry.category)))].filter(Boolean).sort(
    (left, right) => formatMalayLabel(left).localeCompare(formatMalayLabel(right), "ms", {
      sensitivity: "base"
    })
  );
}

export { getEntriesByWordType as a, filterEntries as b, formatEntryTypeDisplayLabel as c, buildTypeFilterHref as d, buildCategoryFilterHref as e, formatMalayLabel as f, getAvailableTags as g, getListingPathForWordType as h, mapRowToSummary as m, normalizeTag as n, paginateEntries as p };
