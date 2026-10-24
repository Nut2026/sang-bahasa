import {
  filterEntries,
  getEntriesByWordType,
  paginateEntries,
  type KamusEntrySummary,
  type KamusWordType,
} from "./kamus";
import { partitionRankedSearch, rankKamusEntries } from "./searchRank";
import type { PeribahasaSummary, SearchResult } from "../config/apiConfig";

export type { PeribahasaSummary, SearchResult };

interface ResolveSearchResultsOptions {
  query: string;
  page: number;
  pageSize: number;
  wordType?: KamusWordType | string;
  category?: string;
  type?: string;
}

interface ResolveSearchResultsResult {
  result: SearchResult;
  usedFallbackResults: boolean;
  suggestions: PeribahasaSummary[];
  similarEntries: PeribahasaSummary[];
}

function toCardSummary(entry: KamusEntrySummary): PeribahasaSummary {
  return {
    id: entry.id,
    phrase: entry.phrase,
    slug: entry.slug,
    meaning_ms: entry.meaning_ms,
    category: entry.category,
    tags: [],
    word_type: entry.word_type,
    created_at: entry.created_at,
    _type: entry._type,
  };
}

function toSearchResult(
  query: string,
  page: number,
  pageSize: number,
  entries: KamusEntrySummary[],
) {
  const pageSlice = paginateEntries(entries, page, pageSize);
  return {
    query,
    total: entries.length,
    page,
    page_size: pageSize,
    results: pageSlice.map(toCardSummary),
  };
}

export async function resolveSearchResults({
  query,
  page,
  pageSize,
  wordType = "peribahasa",
  category,
  type,
}: ResolveSearchResultsOptions): Promise<ResolveSearchResultsResult> {
  const trimmedQuery = query.trim();
  const resolvedWordType: KamusWordType =
    wordType === "peribahasa" ||
    wordType === "bahasa-klasik" ||
    wordType === "all"
      ? wordType
      : "peribahasa";

  const entries = await getEntriesByWordType(resolvedWordType);
  const pool = filterEntries(entries, {
    query: "",
    category,
    type,
  });

  if (!trimmedQuery) {
    return {
      result: toSearchResult(trimmedQuery, page, pageSize, pool),
      usedFallbackResults: false,
      suggestions: [],
      similarEntries: [],
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
      similarEntries: [],
    };
  }

  return {
    result: toSearchResult(trimmedQuery, page, pageSize, []),
    usedFallbackResults: fallbackSuggestions.length > 0,
    suggestions: [],
    similarEntries: fallbackSuggestions.map(toCardSummary),
  };
}
