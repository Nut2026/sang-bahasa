import { c as createComponent } from './astro-component_S0B6rbTO.mjs';
import 'piccolore';
import { r as renderTemplate, n as renderComponent, m as maybeRenderHead, h as addAttribute, o as Fragment } from './entrypoint_L8jLJ3IM.mjs';
import { $ as $$BaseLayout, a as $$ResultCard } from './BaseLayout_CkSMOw68.mjs';
import { $ as $$SearchNoMatchChampion } from './SearchNoMatchChampion_D6huIWfA.mjs';
import { r as resolveSearchResults, $ as $$SearchBar } from './searchResults__MseF5F6.mjs';
import { g as getTopTrenDuniaSummaries } from './trenDunia_BYov0Uub.mjs';
import { b as getSupabaseClient } from './supabase_Du-GE-Q2.mjs';
import { a as getEntriesByWordType, b as filterEntries, p as paginateEntries } from './kamus_CcPSdIwT.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Search;
  const url = Astro2.url;
  const rawQueryParam = url.searchParams.get("q");
  const isSearch = rawQueryParam !== null;
  const query = (rawQueryParam ?? "").trim();
  const category = url.searchParams.get("category") || "";
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const PAGE_SIZE = 20;
  let allEntries = null;
  let categories = [];
  let error = "";
  let similarEntries = [];
  try {
    const client = getSupabaseClient();
    const { data, error: catError } = await client.from("categories").select("id, slug, name_ms, description_ms").order("name_ms", { ascending: true });
    if (catError) throw catError;
    categories = data ?? [];
  } catch {
    categories = [];
  }
  try {
    if (isSearch) {
      if (query.length > 0) {
        const resolved = await resolveSearchResults({
          query,
          category,
          page,
          pageSize: PAGE_SIZE,
          wordType: "all"
        });
        allEntries = resolved.result;
        similarEntries = resolved.similarEntries;
      } else {
        allEntries = {
          query,
          total: 0,
          page,
          page_size: PAGE_SIZE,
          results: []
        };
      }
    } else {
      const entries2 = await getEntriesByWordType("all");
      const filtered = filterEntries(entries2, { category });
      const pageSlice = paginateEntries(filtered, page, PAGE_SIZE);
      allEntries = {
        query: "",
        total: filtered.length,
        page,
        page_size: PAGE_SIZE,
        results: pageSlice.map((e) => ({
          id: e.id,
          phrase: e.phrase,
          slug: e.slug,
          meaning_ms: e.meaning_ms,
          category: e.category,
          tags: [],
          word_type: e.word_type,
          created_at: e.created_at,
          _type: e._type
        }))
      };
    }
  } catch {
    error = "Tidak dapat menghubungi pelayan. Sila cuba sebentar lagi.";
  }
  const total = allEntries?.total ?? 0;
  const entries = allEntries?.results ?? [];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showNoMatch = isSearch && query.length > 0 && entries.length === 0 && !error;
  const closestMatches = similarEntries.slice(0, 5);
  let championsWhenNoMatch = [];
  if (showNoMatch && closestMatches.length === 0) {
    try {
      const tops = await getTopTrenDuniaSummaries(3, "all");
      championsWhenNoMatch = tops;
    } catch {
      championsWhenNoMatch = [];
    }
  }
  function buildUrl(nextPage) {
    const params = new URLSearchParams();
    if (isSearch) params.set("q", query);
    if (category) params.set("category", category);
    params.set("page", String(nextPage));
    return `/search?${params.toString()}`;
  }
  const pageTitle = isSearch ? `Hasil carian${query ? `: "${query}"` : ""}` : category ? `Kategori: ${category}` : "Kamus";
  const metaDesc = isSearch ? `${total} entri Melayu dijumpai untuk carian${query ? ` "${query}"` : ""}.` : "Semak imbas koleksi Peribahasa, Simpulan Bahasa, dan Bahasa Klasik Melayu.";
  return renderTemplate(_a || (_a = __template(["", '  <script>\n  document.addEventListener("click", (e) => {\n    const btn = e.target?.closest?.("[data-cari-lagi]");\n    if (!btn) return;\n\n    window.scrollTo({ top: 0, behavior: "smooth" });\n\n    window.setTimeout(() => {\n      const root = document.querySelector("[data-search-root]");\n      const input = root?.querySelector("[data-search-input]");\n      if (!input) return;\n\n      if (typeof root?.focusSearchInput === "function") {\n        root.focusSearchInput();\n      }\n\n      input.focus();\n\n      const len = input.value?.length ?? 0;\n      try {\n        input.setSelectionRange(len, len);\n      } catch {\n        input.value = input.value;\n      }\n    }, 250);\n  });\n<\/script>'])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": metaDesc, "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div data-search-root style="padding: var(--space-8) 0 var(--space-4);" data-astro-cid-ipsxrsrh> <div class="container" data-astro-cid-ipsxrsrh> <div style="margin-bottom: var(--space-6);" data-astro-cid-ipsxrsrh> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "initialValue": query, "autofocus": !query, "data-astro-cid-ipsxrsrh": true })} </div> <div class="category-pills" data-astro-cid-ipsxrsrh> ${categories.map((cat) => renderTemplate`<a${addAttribute(`/search?category=${cat.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`, "href")}${addAttribute(`category-pill ${category === cat.slug ? "category-pill--active" : ""}`, "class")} data-astro-cid-ipsxrsrh> ${cat.name_ms} </a>`)} </div> </div> </div> <div style="padding-bottom: var(--space-16);" data-astro-cid-ipsxrsrh> <div class="container" data-astro-cid-ipsxrsrh> ${error && renderTemplate`<div class="error-banner" role="alert" data-astro-cid-ipsxrsrh> ${error} </div>`} ${!error && renderTemplate`<div class="results-header" data-astro-cid-ipsxrsrh> <p class="results-count" data-astro-cid-ipsxrsrh> ${isSearch ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result3) => renderTemplate` <strong data-astro-cid-ipsxrsrh>${total}</strong> keputusan untuk "${query}"
` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result3) => renderTemplate`
Menunjukkan <strong data-astro-cid-ipsxrsrh>${entries.length}</strong> daripada${" "}<strong data-astro-cid-ipsxrsrh>${total}</strong> entri
` })}`} </p> </div>`}  ${entries.length > 0 && !error && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result3) => renderTemplate` <div class="results-grid" data-astro-cid-ipsxrsrh> ${entries.map((entry) => renderTemplate`${renderComponent($$result3, "ResultCard", $$ResultCard, { "entry": entry, "wordType": entry.word_type || "peribahasa", "data-astro-cid-ipsxrsrh": true })}`)} </div> <div class="search-actions search-actions--all" style="margin-top: var(--space-10); margin-bottom: var(--space-4);" data-astro-cid-ipsxrsrh> <a href="/kamus" class="btn btn--secondary" data-astro-cid-ipsxrsrh>
&larr; Kembali ke Semua
</a> <button type="button" class="btn btn--secondary" data-cari-lagi data-astro-cid-ipsxrsrh>
Cari lagi
</button> </div> ` })}`}  ${showNoMatch && !error && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "data-astro-cid-ipsxrsrh": true }, { "default": async ($$result3) => renderTemplate` <div class="empty-state" data-astro-cid-ipsxrsrh> <div class="empty-state__icon" data-astro-cid-ipsxrsrh>🔎</div> <h2 class="empty-state__title" data-astro-cid-ipsxrsrh>
Tiada padanan tepat dijumpai
</h2> <p class="empty-state__text" data-astro-cid-ipsxrsrh> ${query ? `Tiada carian tepat untuk "${query}". Cuba semak ejaan atau hantar cadangan anda di Google Forms.` : "Oops! Maaf, Sang Bahasa belum cukup 'tech' membaca minda anda. Cuba taip sesuatu untuk melihat ajaib."} </p> </div> ${closestMatches.length > 0 && renderTemplate`<div class="closest-matches" style="margin-top: var(--space-2); margin-bottom: var(--space-10);" data-astro-cid-ipsxrsrh> <p style="font-weight: 600; margin-bottom: var(--space-3);" data-astro-cid-ipsxrsrh>Adakah anda mencari satu daripada ini?</p> <div class="results-grid" data-astro-cid-ipsxrsrh> ${closestMatches.map((entry) => renderTemplate`${renderComponent($$result3, "ResultCard", $$ResultCard, { "entry": entry, "wordType": entry.word_type || "peribahasa", "data-astro-cid-ipsxrsrh": true })}`)} </div> </div>`}<div style="margin-top: var(--space-2); margin-bottom: var(--space-10);" data-astro-cid-ipsxrsrh> ${renderComponent($$result3, "SearchNoMatchChampion", $$SearchNoMatchChampion, { "champions": championsWhenNoMatch, "showSection": closestMatches.length === 0, "data-astro-cid-ipsxrsrh": true })} </div> <div class="search-actions search-actions--all" style="margin-top: var(--space-2); margin-bottom: var(--space-4);" data-astro-cid-ipsxrsrh> <a href="/kamus" class="btn btn--secondary" data-astro-cid-ipsxrsrh>
&larr; Kembali ke Semua
</a> <button type="button" class="btn btn--secondary" data-cari-lagi data-astro-cid-ipsxrsrh>
Cari lagi
</button> </div> ` })}`}  ${totalPages > 1 && renderTemplate`<nav class="pagination" aria-label="Pagination" data-astro-cid-ipsxrsrh> ${page > 1 && renderTemplate`<a${addAttribute(buildUrl(page - 1), "href")} class="pagination__link pagination__link--prev" data-astro-cid-ipsxrsrh>
&larr; Sebelumnya
</a>`} <span class="pagination__info" data-astro-cid-ipsxrsrh>
Halaman ${page} daripada ${totalPages} </span> ${page < totalPages && renderTemplate`<a${addAttribute(buildUrl(page + 1), "href")} class="pagination__link pagination__link--next" data-astro-cid-ipsxrsrh>
Seterusnya &rarr;
</a>`} </nav>`} </div> </div> ` }));
}, "D:/4-dev/sangbahasa/src/pages/search.astro", void 0);

const $$file = "D:/4-dev/sangbahasa/src/pages/search.astro";
const $$url = "/search";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Search,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
