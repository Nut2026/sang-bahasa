import { c as createComponent } from './astro-component_Rz2ymryl.mjs';
import 'piccolore';
import { m as maybeRenderHead, h as addAttribute, r as renderTemplate } from './entrypoint_IgdAE7NG.mjs';
import 'clsx';
import { r as renderScript } from './BaseLayout_tD9nsf-j.mjs';
import { a as getEntriesByWordType, b as filterEntries, p as paginateEntries } from './kamus_CcPSdIwT.mjs';

const $$SearchBar = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SearchBar;
  const {
    initialValue = "",
    placeholder = "Cari sesuatu...",
    hero = false,
    autofocus = false,
    wordType = "all"
  } = Astro2.props;
  const searchUrl = wordType === "all" ? "/kamus/search" : wordType === "peribahasa" ? "/kamus/peribahasa/search" : wordType === "simpulan-bahasa" ? "/kamus/simpulan-bahasa/search" : wordType === "bahasa-klasik" ? "/kamus/bahasa-klasik/search" : "/kamus/search";
  return renderTemplate`${maybeRenderHead()}<div class="search-container" data-search-root${addAttribute(wordType, "data-word-type")}> <form class="search-form"${addAttribute(searchUrl, "action")} method="get" role="search" data-search-form> <div class="search-row"> <input type="search" name="q" class="search-input"${addAttribute(placeholder, "placeholder")}${addAttribute(initialValue, "value")} autocomplete="off" spellcheck="false" aria-label="Cari peribahasa" aria-autocomplete="list" aria-controls="search-results-listbox" data-search-input${addAttribute(autofocus, "autofocus")}> <button type="submit" class="search-submit">
Cari
</button> </div> <div id="search-results-listbox" class="search-suggestions" role="listbox" aria-label="Cadangan carian" data-search-suggestions></div> </form> </div>  ${renderScript($$result, "D:/4-dev/sangbahasa/src/components/SearchBar.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/4-dev/sangbahasa/src/components/SearchBar.astro", void 0);

function stripCombiningMarks(value) {
  return value.replace(/\p{M}+/gu, "");
}
function normalizeSearchInput(raw) {
  const folded = String(raw ?? "").trim().toLowerCase().normalize("NFKD");
  return stripCombiningMarks(folded).replace(/\p{P}+/gu, " ").replace(/\p{S}+/gu, " ").replace(/\s+/g, " ").trim();
}
function searchTokens(normalized) {
  return normalized.split(" ").filter(Boolean);
}
function trigramSet(s) {
  const padded = `  ${s}  `;
  const set = /* @__PURE__ */ new Set();
  for (let i = 0; i < padded.length - 2; i++) {
    set.add(padded.slice(i, i + 3));
  }
  return set;
}
function pgTrigramSimilarity(a, b) {
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
const SEARCH_MAIN_SCORE_THRESHOLD = 14;
const SEARCH_FALLBACK_SCORE_THRESHOLD = 7;
function rankKamusEntries(entries, rawQuery) {
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
      sensitivity: "base"
    });
  });
  return scored;
}
function partitionRankedSearch(ranked, mainThreshold = SEARCH_MAIN_SCORE_THRESHOLD, fallbackThreshold = SEARCH_FALLBACK_SCORE_THRESHOLD, fallbackLimit = 5) {
  const main = ranked.filter((r) => r.score >= mainThreshold);
  if (main.length > 0) {
    return {
      matches: main.map((r) => r.entry),
      fallbackSuggestions: []
    };
  }
  const fallback = ranked.filter((r) => r.score >= fallbackThreshold && r.score > 0).slice(0, fallbackLimit).map((r) => r.entry);
  return {
    matches: [],
    fallbackSuggestions: fallback
  };
}

function toCardSummary(entry) {
  return {
    id: entry.id,
    phrase: entry.phrase,
    slug: entry.slug,
    meaning_ms: entry.meaning_ms,
    category: entry.category,
    tags: [],
    word_type: entry.word_type,
    created_at: entry.created_at,
    _type: entry._type
  };
}
function toSearchResult(query, page, pageSize, entries) {
  const pageSlice = paginateEntries(entries, page, pageSize);
  return {
    query,
    total: entries.length,
    page,
    page_size: pageSize,
    results: pageSlice.map(toCardSummary)
  };
}
async function resolveSearchResults({
  query,
  page,
  pageSize,
  wordType = "peribahasa",
  category,
  type
}) {
  const trimmedQuery = query.trim();
  const resolvedWordType = wordType === "peribahasa" || wordType === "bahasa-klasik" || wordType === "all" ? wordType : "peribahasa";
  const entries = await getEntriesByWordType(resolvedWordType);
  const pool = filterEntries(entries, {
    query: "",
    category,
    type
  });
  if (!trimmedQuery) {
    return {
      result: toSearchResult(trimmedQuery, page, pageSize, pool),
      usedFallbackResults: false,
      suggestions: [],
      similarEntries: []
    };
  }
  const ranked = rankKamusEntries(pool, trimmedQuery);
  const { matches, fallbackSuggestions } = partitionRankedSearch(ranked);
  if (matches.length > 0) {
    const suggestionSlice = matches.slice(0, 5).map(toCardSummary);
    return {
      result: toSearchResult(trimmedQuery, page, pageSize, matches),
      usedFallbackResults: false,
      suggestions: suggestionSlice,
      similarEntries: []
    };
  }
  return {
    result: toSearchResult(trimmedQuery, page, pageSize, []),
    usedFallbackResults: fallbackSuggestions.length > 0,
    suggestions: [],
    similarEntries: fallbackSuggestions.map(toCardSummary)
  };
}

export { $$SearchBar as $, resolveSearchResults as r };
