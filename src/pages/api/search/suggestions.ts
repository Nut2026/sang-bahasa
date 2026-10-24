import type { APIRoute } from "astro";
import {
  filterEntries,
  getEntriesByWordType,
  type KamusWordType,
} from "../../../utils/kamus";
import {
  normalizeSearchInput,
  partitionRankedSearch,
  rankKamusEntries,
} from "../../../utils/searchRank";

const DEFAULT_LIMIT = 5;

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const rawQuery = url.searchParams.get("q") ?? "";
  const requestedWordType = (url.searchParams.get("word_type") ??
    "all") as KamusWordType;
  const limit = Math.max(
    1,
    Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT) || DEFAULT_LIMIT
  );

  const normalized = normalizeSearchInput(rawQuery);
  if (normalized.length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const entries = await getEntriesByWordType(requestedWordType);
    const pool = filterEntries(entries, { query: "" });
    const ranked = rankKamusEntries(pool, rawQuery.trim());
    const { matches, fallbackSuggestions } = partitionRankedSearch(ranked);

    const ordered = matches.length > 0 ? matches : fallbackSuggestions;
    const slice = ordered.slice(0, limit);

    return new Response(JSON.stringify(slice), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : "Failed to load suggestions",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
