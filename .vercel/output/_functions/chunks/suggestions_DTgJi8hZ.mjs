import { b as getSupabaseClient } from './supabase_Du-GE-Q2.mjs';

const DEFAULT_LIMIT = 5;
const prerender = false;
function escapeLike(value) {
  return value.replace(/%/g, "\\%").replace(/_/g, "\\_");
}
const GET = async ({ url }) => {
  const rawQuery = url.searchParams.get("q") ?? "";
  const requestedWordType = url.searchParams.get("word_type") ?? "all";
  const limit = Math.max(
    1,
    Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT) || DEFAULT_LIMIT
  );
  if (rawQuery.trim().length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { "Content-Type": "application/json" }
    });
  }
  try {
    const client = getSupabaseClient();
    const query = rawQuery.trim();
    const likePattern = `%${escapeLike(query)}%`;
    let peribahasaData = null;
    let bahasaKlasikData = null;
    if (requestedWordType === "all" || requestedWordType === "peribahasa") {
      const { data, error } = await client.from("peribahasa").select("phrase, slug").ilike("phrase", likePattern).limit(limit * 2);
      if (error) throw error;
      peribahasaData = (data ?? []).map((row) => ({
        phrase: row.phrase,
        slug: row.slug,
        word_type: "peribahasa"
      }));
    }
    if (requestedWordType === "all" || requestedWordType === "bahasa-klasik") {
      const { data, error } = await client.from("bahasa_klasik").select("phrase, slug").ilike("phrase", likePattern).limit(limit * 2);
      if (error) throw error;
      bahasaKlasikData = (data ?? []).map((row) => ({
        phrase: row.phrase,
        slug: row.slug,
        word_type: "bahasa-klasik"
      }));
    }
    const allResults = [
      ...peribahasaData ?? [],
      ...bahasaKlasikData ?? []
    ];
    const seen = /* @__PURE__ */ new Set();
    const unique = allResults.filter((item) => {
      const key = item.phrase.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    unique.sort((a, b) => {
      const aStarts = a.phrase.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      const bStarts = b.phrase.toLowerCase().startsWith(query.toLowerCase()) ? 1 : 0;
      if (bStarts !== aStarts) return bStarts - aStarts;
      return a.phrase.localeCompare(b.phrase, "ms");
    });
    const slice = unique.slice(0, limit);
    return new Response(JSON.stringify(slice), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to load suggestions"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
