import { c as createComponent } from './astro-component_S0B6rbTO.mjs';
import 'piccolore';
import { r as renderTemplate, p as defineScriptVars, n as renderComponent, m as maybeRenderHead, h as addAttribute } from './entrypoint_L8jLJ3IM.mjs';
import { $ as $$BaseLayout, a as $$ResultCard } from './BaseLayout_CkSMOw68.mjs';
import { g as getEntryNavigation, $ as $$Confetti, a as $$PeribahasaHeader, b as $$EntryDetail } from './entryNavigation_BwZshcIK.mjs';
import { c as getBahasaKlasikBySlug, d as getBahasaKlasikByCategory } from './supabase_Du-GE-Q2.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const { slug } = Astro2.params;
  const WORD_TYPE = "bahasa-klasik";
  const BASE_URL = "/kamus/bahasa-klasik";
  function toFullEntry(row) {
    return {
      id: row.id,
      phrase: row.phrase,
      slug: row.slug || row.phrase.toLowerCase().replace(/\s+/g, "-"),
      meaning_ms: row.meaning_ms,
      example_ms: row.example_ms,
      s_meaning_ms: row.s_meaning_ms ?? null,
      s_example_ms: row.s_example_ms ?? null,
      category: row.category || "",
      tags: [],
      is_published: row.is_published ?? true,
      word_type: WORD_TYPE,
      meta_title_ms: null,
      meta_description_ms: null,
      created_at: row.created_at || "",
      _type: row._type ?? null
    };
  }
  function toSummary(row) {
    return {
      id: row.id,
      phrase: row.phrase,
      slug: row.slug || row.phrase.toLowerCase().replace(/\s+/g, "-"),
      meaning_ms: row.meaning_ms,
      category: row.category || "",
      word_type: WORD_TYPE,
      created_at: row.created_at,
      _type: row._type ?? null
    };
  }
  let entry = null;
  let related = [];
  let navigation = { previous: null, next: null };
  let notFound = false;
  try {
    const row = await getBahasaKlasikBySlug(slug);
    if (row) {
      entry = toFullEntry(row);
    } else {
      notFound = true;
    }
  } catch (err) {
    console.error("Error fetching bahasa klasik:", err);
    notFound = true;
  }
  if (notFound || !entry) {
    return Astro2.redirect(BASE_URL, 302);
  }
  try {
    const categoryEntries = await getBahasaKlasikByCategory(entry.category, 20, 0);
    related = categoryEntries.filter((item) => (item.slug || item.phrase.toLowerCase().replace(/\s+/g, "-")) !== slug).slice(0, 5).map(toSummary);
  } catch {
    related = [];
  }
  try {
    navigation = await getEntryNavigation(WORD_TYPE, slug);
  } catch {
    navigation = { previous: null, next: null };
  }
  const siteUrl = "http://localhost:4321";
  const canonicalUrl = `${siteUrl}${BASE_URL}/${slug}`;
  const metaTitle = entry.meta_title_ms || `${entry.phrase} - Maksud dan Contoh`;
  const metaDesc = entry.meta_description_ms || `Maksud "${entry.phrase}": ${entry.meaning_ms.slice(0, 140)}`;
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", '\n  // Track view when page loads\n  document.addEventListener("DOMContentLoaded", () => {\n    if (window.trackTrenDuniaView) {\n      window.trackTrenDuniaView(wordType, slug);\n    }\n  });\n})();</script>'])), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": metaTitle, "description": metaDesc, "canonicalUrl": canonicalUrl }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Confetti", $$Confetti, {})} ${maybeRenderHead()}<div class="entry-page"> <div class="container container--narrow"> ${renderComponent($$result2, "PeribahasaHeader", $$PeribahasaHeader, { "phrase": entry.phrase, "category": entry.category, "tags": [], "wordType": WORD_TYPE })} ${renderComponent($$result2, "EntryDetail", $$EntryDetail, { "entry": entry, "wordType": WORD_TYPE, "showBackToAll": true, "navigation": navigation })} </div> ${related.length > 0 && renderTemplate`<div class="section section--alt" style="margin-top: var(--space-12);"> <div class="container"> <div class="section__header"> <h2 class="section__title">Bahasa Klasik Berkaitan</h2> <a${addAttribute(`${BASE_URL}?category=${entry.category}`, "href")} class="section__link">
Lihat kategori &rarr;
</a> </div> <div class="results-grid"> ${related.map((item) => renderTemplate`${renderComponent($$result2, "ResultCard", $$ResultCard, { "entry": item, "wordType": WORD_TYPE })}`)} </div> </div> </div>`} </div> ` }), defineScriptVars({ wordType: WORD_TYPE, slug: entry.slug }));
}, "D:/4-dev/sangbahasa/src/pages/kamus/bahasa-klasik/[slug].astro", void 0);
const $$file = "D:/4-dev/sangbahasa/src/pages/kamus/bahasa-klasik/[slug].astro";
const $$url = "/kamus/bahasa-klasik/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
