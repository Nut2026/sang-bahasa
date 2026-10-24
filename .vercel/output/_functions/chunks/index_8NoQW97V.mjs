import { c as createComponent } from './astro-component_S0B6rbTO.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, h as addAttribute, o as Fragment } from './entrypoint_L8jLJ3IM.mjs';
import { r as resolveSearchResults, $ as $$SearchBar } from './searchResults__MseF5F6.mjs';
import { $ as $$BaseLayout, a as $$ResultCard } from './BaseLayout_CkSMOw68.mjs';
import { n as normalizeTag, g as getAvailableTags, a as getEntriesByWordType, f as formatMalayLabel } from './kamus_CcPSdIwT.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const PAGE_SIZE = 10;
  const WORD_TYPE = "peribahasa";
  const BASE_URL = "/kamus/peribahasa";
  const url = Astro2.url;
  const query = url.searchParams.get("q")?.trim() || "";
  const selectedTag = url.searchParams.get("tag") || url.searchParams.get("category") || "";
  const selectedCategory = normalizeTag(selectedTag);
  const selectedType = normalizeTag(url.searchParams.get("type") || "");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const availableTags = getAvailableTags(await getEntriesByWordType(WORD_TYPE));
  let results = null;
  let error = "";
  let suggestions = [];
  let similarEntries = [];
  try {
    const resolved = await resolveSearchResults({
      query,
      category: selectedCategory,
      page,
      pageSize: PAGE_SIZE,
      wordType: WORD_TYPE
    });
    results = resolved.result;
    suggestions = resolved.suggestions;
    similarEntries = resolved.similarEntries;
  } catch {
    error = "Tidak dapat menghubungi pelayan. Sila cuba sebentar lagi.";
  }
  const entries = results?.results ?? [];
  const total = results?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const showNoMatch = query.length > 0 && entries.length === 0 && !error;
  const closestMatches = similarEntries.slice(0, 5);
  function truncateQuery(q, maxLen = 27) {
    if (q.length <= maxLen) return q;
    return q.slice(0, maxLen) + "...";
  }
  const displayQuery = truncateQuery(query);
  function buildUrl(nextPage) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedType) params.set("type", selectedType);
    params.set("page", String(nextPage));
    return `${BASE_URL}?${params.toString()}`;
  }
  function buildFilterUrl(tag) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (tag) params.set("category", normalizeTag(tag));
    if (selectedType) params.set("type", selectedType);
    return params.toString() ? `${BASE_URL}?${params.toString()}` : BASE_URL;
  }
  const pageTitle = query ? `Hasil carian Peribahasa: "${displayQuery}"` : "Peribahasa";
  const metaDesc = query ? `${total} Peribahasa dijumpai untuk carian "${displayQuery}".` : "Semak imbas koleksi Peribahasa Melayu dengan makna dan contoh ayat.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": metaDesc }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="padding: var(--space-8) 0 var(--space-4);"> <div class="container"> <div style="margin-bottom: var(--space-6);"> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "initialValue": query, "autofocus": !query, "placeholder": "Cari peribahasa...", "wordType": WORD_TYPE })} </div> <div class="category-pills"> <a${addAttribute(buildFilterUrl(""), "href")}${addAttribute(`category-pill ${selectedCategory ? "" : "category-pill--active"}`, "class")}>
Semua
</a> ${availableTags.map((tag) => renderTemplate`<a${addAttribute(buildFilterUrl(tag), "href")}${addAttribute(`category-pill ${selectedCategory === normalizeTag(tag) ? "category-pill--active" : ""}`, "class")}> ${formatMalayLabel(tag)} </a>`)} </div> </div> </div> <div style="padding-bottom: var(--space-16);"> <div class="container"> ${error && renderTemplate`<div class="error-banner" role="alert"> ${error} </div>`} ${!error && renderTemplate`<div class="results-header"> <p class="results-count"> ${query ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <strong>${total}</strong> keputusan untuk "${displayQuery}"
` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`
Menunjukkan <strong>${entries.length}</strong> daripada${" "}<strong>${total}</strong> peribahasa
` })}`} </p> </div>`} ${entries.length > 0 && !error && renderTemplate`<div class="results-grid"> ${entries.map((entry) => renderTemplate`${renderComponent($$result2, "ResultCard", $$ResultCard, { "entry": entry, "wordType": WORD_TYPE })}`)} </div>`} ${showNoMatch && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="empty-state"> <div class="empty-state__icon">🔎</div> <h2 class="empty-state__title">
Tiada padanan tepat dijumpai
</h2> <p class="empty-state__text"> ${query ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`
Tiada carian tepat untuk "<span class="truncated-query">${displayQuery}</span>". Cuba semak ejaan atau <a href="https://forms.gle/EEKuNwG3V1ZPGhTT6" class="lihat-semua" target="_blank" rel="noopener noreferrer">hantar cadangan anda</a> di Google Forms.
` })}` : "Oops! Maaf, Sang Bahasa belum cukup 'tech' membaca minda anda. Cuba taip sesuatu untuk melihat ajaib."} </p> </div> ${closestMatches.length > 0 && renderTemplate`<div class="closest-matches" style="margin-top: var(--space-6);"> <p style="font-weight: 600; margin-bottom: var(--space-3);">Adakah anda mencari satu daripada ini?</p> <div class="results-grid"> ${closestMatches.map((entry) => renderTemplate`${renderComponent($$result3, "ResultCard", $$ResultCard, { "entry": entry, "wordType": WORD_TYPE })}`)} </div> </div>`}<div class="no-match-actions" style="margin-top:var(--space-5);"> <a${addAttribute(BASE_URL, "href")} class="btn btn--secondary">
Lihat semua entri
</a> <button type="button" class="btn btn--secondary" data-cari-lagi>
Cari lagi
</button> </div> ` })}`} ${totalPages > 1 && renderTemplate`<nav class="pagination" aria-label="Pagination"> ${page > 1 && renderTemplate`<a${addAttribute(buildUrl(page - 1), "href")} class="pagination__link pagination__link--prev">
&larr; Sebelumnya
</a>`} <span class="pagination__info">
Halaman ${page} daripada ${totalPages} </span> ${page < totalPages && renderTemplate`<a${addAttribute(buildUrl(page + 1), "href")} class="pagination__link pagination__link--next">
Seterusnya &rarr;
</a>`} </nav>`} <div style="margin-top: var(--space-8);"> <a href="/kamus" class="btn btn--secondary">
&larr; Kembali ke Semua
</a> </div> </div> </div> ` })}`;
}, "D:/4-dev/sangbahasa/src/pages/kamus/peribahasa/index.astro", void 0);

const $$file = "D:/4-dev/sangbahasa/src/pages/kamus/peribahasa/index.astro";
const $$url = "/kamus/peribahasa";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
