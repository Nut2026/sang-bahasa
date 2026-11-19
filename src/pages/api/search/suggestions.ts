import type { APIRoute } from "astro";
import type { KamusWordType } from "../../../utils/kamus";
import { getSupabaseClient } from "../../../utils/supabase";

const DEFAULT_LIMIT = 5;

export const prerender = false;

function escapeLike(value: string): string {
  return value.replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export const GET: APIRoute = async ({ url }) => {
  const rawQuery = url.searchParams.get("q") ?? "";
  const requestedWordType = (url.searchParams.get("word_type") ??
    "all") as KamusWordType;
  const limit = Math.max(
    1,
    Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT) || DEFAULT_LIMIT
  );

  if (rawQuery.trim().length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const client = getSupabaseClient();
    const query = rawQuery.trim();
    const likePattern = `%${escapeLike(query)}%`;

    // Fetch suggestions directly from Supabase using ilike for speed
    let peribahasaData: { phrase: string; slug: string; word_type?: string }[] | null = null;
    let bahasaKlasikData: { phrase: string; slug: string; word_type?: string }[] | null = null;

    if (requestedWordType === "all" || requestedWordType === "peribahasa") {
      const { data, error } = await client
        .from("peribahasa")
        .select("phrase, slug")
        .ilike("phrase", likePattern)
        .limit(limit * 2);
      if (error) throw error;
      peribahasaData = (data ?? []).map((row) => ({
        phrase: row.phrase,
        slug: row.slug,
        word_type: "peribahasa",
      }));
    }

    if (requestedWordType === "all" || requestedWordType === "bahasa-klasik") {
      const { data, error } = await client
        .from("bahasa_klasik")
        .select("phrase, slug")
        .ilike("phrase", likePattern)
        .limit(limit * 2);
      if (error) throw error;
      bahasaKlasikData = (data ?? []).map((row) => ({
        phrase: row.phrase,
        slug: row.slug,
        word_type: "bahasa-klasik",
      }));
    }

    // Merge results, deduplicate by phrase, and return top matches
    const allResults = [
      ...(peribahasaData ?? []),
      ...(bahasaKlasikData ?? []),
    ];

    // Deduplicate by phrase (case-insensitive)
    const seen = new Set<string>();
    const unique = allResults.filter((item) => {
      const key = item.phrase.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by phrase match quality (starts with is better than contains)
    unique.sort((a, b) => {
      const aStarts = a.phrase.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      const bStarts = b.phrase.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      if (bStarts !== aStarts) return bStarts - aStarts;
      return a.phrase.localeCompare(b.phrase, "ms");
    });

    const slice = unique.slice(0, limit);

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
