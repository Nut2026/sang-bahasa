import { c as createComponent } from './astro-component_Rz2ymryl.mjs';
import 'piccolore';
import { n as renderComponent, r as renderTemplate, m as maybeRenderHead, o as Fragment, h as addAttribute } from './entrypoint_IgdAE7NG.mjs';
import { r as resolveSearchResults, $ as $$SearchBar } from './searchResults_CsU4H_Uy.mjs';
import { $ as $$BaseLayout, a as $$ResultCard } from './BaseLayout_tD9nsf-j.mjs';
import { n as normalizeTag } from './kamus_CcPSdIwT.mjs';

const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const PAGE_SIZE = 10;
  const WORD_TYPE = "all";
  const LIST_BASE = "/kamus";
  const url = Astro2.url;
  const query = url.searchParams.get("q")?.trim() || "";
  const selectedType = normalizeTag(url.searchParams.get("type") || "");
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  let results = null;
  let error = "";
  let suggestions = [];
  let similarEntries = [];
  try {
    const resolved = await resolveSearchResults({
      query,
      type: selectedType || void 0,
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
    if (selectedType) params.set("type", selectedType);
    params.set("page", String(nextPage));
    return `${LIST_BASE}?${params.toString()}`;
  }
  const pageTitle = query ? `Hasil carian Semua: "${displayQuery}"` : "Semua Entri";
  const metaDesc = query ? `${total} entri dijumpai untuk carian "${displayQuery}".` : "Semak imbas koleksi lengkap Peribahasa dan Bahasa Klasik Melayu dengan makna dan contoh ayat.";
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": pageTitle, "description": metaDesc }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div style="padding: var(--space-8) 0 var(--space-4);"> <div class="container"> <div style="margin-bottom: var(--space-6);"> ${renderComponent($$result2, "SearchBar", $$SearchBar, { "initialValue": query, "autofocus": !query, "placeholder": "Cari sesuatu...", "wordType": WORD_TYPE })} </div> </div> </div> <div style="padding-bottom: var(--space-16);"> <div class="container"> ${error && renderTemplate`<div class="error-banner" role="alert"> ${error} </div>`} ${!error && renderTemplate`<div class="results-header"> <p class="results-count"> ${query ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <strong>${total}</strong> keputusan untuk "${displayQuery}"
` })}` : renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`
Menunjukkan <strong>${entries.length}</strong> daripada${" "}<strong>${total}</strong> entri
` })}`} </p> </div>`} ${entries.length > 0 && !error && renderTemplate`<div class="results-grid"> ${entries.map((entry) => renderTemplate`${renderComponent($$result2, "ResultCard", $$ResultCard, { "entry": entry, "wordType": entry.word_type || "peribahasa" })}`)} </div>`} ${showNoMatch && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <div class="empty-state"> <div class="empty-state__icon">🔎</div> <h2 class="empty-state__title">
Tiada padanan tepat dijumpai
</h2> <p class="empty-state__text"> ${query ? renderTemplate`${renderComponent($$result3, "Fragment", Fragment, {}, { "default": async ($$result4) => renderTemplate`
Tiada carian tepat untuk "<span class="truncated-query">${displayQuery}</span>". Cuba semak ejaan atau <a href="https://forms.gle/EEKuNwG3V1ZPGhTT6" class="lihat-semua" target="_blank" rel="noopener noreferrer">hantar cadangan anda</a> di Google Forms.
` })}` : "Oops! Maaf, Sang Bahasa belum cukup 'tech' membaca minda anda. Cuba taip sesuatu untuk melihat ajaib."} </p> </div> ${closestMatches.length > 0 && renderTemplate`<div class="closest-matches" style="margin-top: var(--space-6);"> <p style="font-weight: 600; margin-bottom: var(--space-3);">Adakah anda mencari satu daripada ini?</p> <div class="results-grid"> ${closestMatches.map((entry) => renderTemplate`${renderComponent($$result3, "ResultCard", $$ResultCard, { "entry": entry, "wordType": entry.word_type || "peribahasa" })}`)} </div> </div>`}<div class="no-match-actions" style="margin-top:var(--space-5);"> <a${addAttribute(LIST_BASE, "href")} class="btn btn--secondary">
Lihat semua entri
</a> <button type="button" class="btn btn--secondary" data-cari-lagi>
Cari lagi
</button> </div> ` })}`} ${totalPages > 1 && renderTemplate`<nav class="pagination" aria-label="Pagination"> ${page > 1 && renderTemplate`<a${addAttribute(buildUrl(page - 1), "href")} class="pagination__link pagination__link--prev">
&larr; Sebelumnya
</a>`} <span class="pagination__info">
Halaman ${page} daripada ${totalPages} </span> ${page < totalPages && renderTemplate`<a${addAttribute(buildUrl(page + 1), "href")} class="pagination__link pagination__link--next">
Seterusnya &rarr;
</a>`} </nav>`} ${showNoMatch && renderTemplate`<div class="no-match-actions" style="margin-top:var(--space-5);"> <a${addAttribute(LIST_BASE, "href")} class="btn btn--secondary">
Lihat semua entri
</a> <button type="button" class="btn btn--secondary" data-cari-lagi>
Cari lagi
</button> </div>`} </div> </div> ` })}`;
}, "D:/4-dev/sangbahasa/src/pages/kamus/index.astro", void 0);

const $$file = "D:/4-dev/sangbahasa/src/pages/kamus/index.astro";
const $$url = "/kamus";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
