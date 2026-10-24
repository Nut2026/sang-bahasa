import { c as createComponent } from './astro-component_Rz2ymryl.mjs';
import 'piccolore';
import { m as maybeRenderHead, n as renderComponent, o as Fragment, r as renderTemplate, h as addAttribute } from './entrypoint_IgdAE7NG.mjs';
import { g as getListingUrl, b as getWordTypeLabel, r as renderScript, c as getEntryUrl } from './BaseLayout_tD9nsf-j.mjs';
import { f as formatMalayLabel, n as normalizeTag, a as getEntriesByWordType } from './kamus_CcPSdIwT.mjs';
import 'clsx';

const $$PeribahasaHeader = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PeribahasaHeader;
  const { phrase, category, tags, wordType = "peribahasa" } = Astro2.props;
  const safeTags = Array.isArray(tags) ? tags : [];
  const categoryLabel = formatMalayLabel(category);
  function truncateBreadcrumb(text, maxLen = 3) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + "...";
  }
  const breadcrumbData = [
    { label: "Laman Utama", url: "/" },
    { label: "Kamus", url: "/kamus" },
    { label: getWordTypeLabel(wordType), url: getListingUrl(wordType) },
    { label: truncateBreadcrumb(phrase) }
  ];
  return renderTemplate`${maybeRenderHead()}<div class="entry-header"> <nav class="entry-breadcrumb" aria-label="Breadcrumb"> ${breadcrumbData.map((item, index) => renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${item.url ? renderTemplate`<a${addAttribute(item.url, "href")}>${item.label}</a>` : renderTemplate`<span aria-current="page">${item.label}</span>`}${index < breadcrumbData.length - 1 && renderTemplate`<span class="entry-breadcrumb__sep" aria-hidden="true">&rsaquo;</span>`}` })}`)} </nav> <h1 class="entry-phrase">${phrase}</h1> <div class="entry-meta"> <span class="entry-category-badge">${categoryLabel}</span> ${safeTags.slice(0, 5).map((tag) => renderTemplate`<span class="tag">${tag}</span>`)} </div> </div>`;
}, "D:/4-dev/sangbahasa/src/components/PeribahasaHeader.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$EntryDetail = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$EntryDetail;
  const {
    entry,
    wordType = "peribahasa",
    showBackToAll = true,
    navigation = { previous: null, next: null }
  } = Astro2.props;
  const wordTypeData = {
    label: getWordTypeLabel(wordType) || "Kamus",
    url: getListingUrl(wordType)
  };
  const MALAY_MONTHS = [
    "Januari",
    "Februari",
    "Mac",
    "April",
    "Mei",
    "Jun",
    "Julai",
    "Ogos",
    "September",
    "Oktober",
    "November",
    "Disember"
  ];
  function formatMalayDate(dateInput) {
    if (!dateInput) return "";
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(d.getTime())) return "";
    const day = d.getDate();
    const month = MALAY_MONTHS[d.getMonth()] ?? "";
    const year = d.getFullYear();
    return `${day} ${month} ${year}`.trim();
  }
  const createdAtFormatted = formatMalayDate(entry.created_at);
  const isBahasaKlasik = wordType === "bahasa-klasik";
  const klasikKind = normalizeTag(entry._type);
  const isIstana = isBahasaKlasik && klasikKind === "istana";
  const isKlasikKind = isBahasaKlasik && klasikKind === "klasik";
  return renderTemplate(_a || (_a = __template(["", '<div class="entry-body" data-astro-cid-tq7oqkre> ', " ", ' <div class="entry-section" data-astro-cid-tq7oqkre> <p class="entry-section__label" data-astro-cid-tq7oqkre>Maksud</p> <p class="entry-section__content" data-astro-cid-tq7oqkre>', "</p> </div> ", " ", ' <div style="\n      display:flex;\n      gap: var(--space-3);\n      align-items:center;\n      padding-top: var(--space-4);\n      flex-wrap: wrap;\n      flex-direction: column;\n      align-items: flex-start;\n    " data-astro-cid-tq7oqkre> <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;" data-astro-cid-tq7oqkre> <a', ' class="btn btn--secondary btn--sm" data-astro-cid-tq7oqkre>\n&larr; Kembali ke ', " </a> ", ' <button class="btn btn--secondary btn--sm" id="copy-btn"', "", "", "", "", "", " data-astro-cid-tq7oqkre>\n⿻ Salin\n</button> </div> ", ' </div> </div>  <script>\n  const copyBtn = document.getElementById("copy-btn");\n\n  if (copyBtn) {\n    copyBtn.addEventListener("click", () => {\n      const phrase = copyBtn.dataset.phrase ?? "";\n      const meaning = copyBtn.dataset.meaning ?? "";\n      const example = copyBtn.dataset.example ?? "";\n      const sMeaning = copyBtn.dataset.sMeaning ?? "";\n      const sExample = copyBtn.dataset.sExample ?? "";\n      const entryKind = copyBtn.dataset.entryKind ?? "peribahasa";\n\n      let label = "Peribahasa";\n      if (entryKind === "klasik" || entryKind === "istana") {\n        label = "Bahasa Klasik";\n      }\n\n      const parts = [`${label}: ${phrase}`];\n      if (entryKind === "klasik" && sMeaning) {\n        parts.push(`Bahasa Standard: ${sMeaning}`);\n      }\n      parts.push(`Maksud: ${meaning}`);\n      if (example) {\n        const ayatLabel = entryKind === "peribahasa" ? "Contoh Ayat" : "Ayat";\n        parts.push(`${ayatLabel}: ${example}`);\n      }\n      if (entryKind === "klasik" && sExample) {\n        parts.push(`Ayat dalam Bahasa Standard: ${sExample}`);\n      }\n      parts.push("", "— Sang Bahasa");\n      const text = parts.join("\\n");\n\n      navigator.clipboard.writeText(text).then(() => {\n        const original = copyBtn.textContent ?? "";\n        copyBtn.textContent = "🗎 Disalin!";\n\n        setTimeout(() => {\n          copyBtn.textContent = original;\n        }, 2000);\n      }).catch(() => {\n        copyBtn.textContent = "Gagal menyalin";\n      });\n    });\n  }\n<\/script>'], ["", '<div class="entry-body" data-astro-cid-tq7oqkre> ', " ", ' <div class="entry-section" data-astro-cid-tq7oqkre> <p class="entry-section__label" data-astro-cid-tq7oqkre>Maksud</p> <p class="entry-section__content" data-astro-cid-tq7oqkre>', "</p> </div> ", " ", ' <div style="\n      display:flex;\n      gap: var(--space-3);\n      align-items:center;\n      padding-top: var(--space-4);\n      flex-wrap: wrap;\n      flex-direction: column;\n      align-items: flex-start;\n    " data-astro-cid-tq7oqkre> <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;" data-astro-cid-tq7oqkre> <a', ' class="btn btn--secondary btn--sm" data-astro-cid-tq7oqkre>\n&larr; Kembali ke ', " </a> ", ' <button class="btn btn--secondary btn--sm" id="copy-btn"', "", "", "", "", "", " data-astro-cid-tq7oqkre>\n⿻ Salin\n</button> </div> ", ' </div> </div>  <script>\n  const copyBtn = document.getElementById("copy-btn");\n\n  if (copyBtn) {\n    copyBtn.addEventListener("click", () => {\n      const phrase = copyBtn.dataset.phrase ?? "";\n      const meaning = copyBtn.dataset.meaning ?? "";\n      const example = copyBtn.dataset.example ?? "";\n      const sMeaning = copyBtn.dataset.sMeaning ?? "";\n      const sExample = copyBtn.dataset.sExample ?? "";\n      const entryKind = copyBtn.dataset.entryKind ?? "peribahasa";\n\n      let label = "Peribahasa";\n      if (entryKind === "klasik" || entryKind === "istana") {\n        label = "Bahasa Klasik";\n      }\n\n      const parts = [\\`\\${label}: \\${phrase}\\`];\n      if (entryKind === "klasik" && sMeaning) {\n        parts.push(\\`Bahasa Standard: \\${sMeaning}\\`);\n      }\n      parts.push(\\`Maksud: \\${meaning}\\`);\n      if (example) {\n        const ayatLabel = entryKind === "peribahasa" ? "Contoh Ayat" : "Ayat";\n        parts.push(\\`\\${ayatLabel}: \\${example}\\`);\n      }\n      if (entryKind === "klasik" && sExample) {\n        parts.push(\\`Ayat dalam Bahasa Standard: \\${sExample}\\`);\n      }\n      parts.push("", "— Sang Bahasa");\n      const text = parts.join("\\\\n");\n\n      navigator.clipboard.writeText(text).then(() => {\n        const original = copyBtn.textContent ?? "";\n        copyBtn.textContent = "🗎 Disalin!";\n\n        setTimeout(() => {\n          copyBtn.textContent = original;\n        }, 2000);\n      }).catch(() => {\n        copyBtn.textContent = "Gagal menyalin";\n      });\n    });\n  }\n<\/script>'])), maybeRenderHead(), createdAtFormatted && renderTemplate`<p class="entry-added-date" data-astro-cid-tq7oqkre>
Ditambah pada: ${createdAtFormatted} </p>`, isKlasikKind && entry.s_meaning_ms && renderTemplate`<div class="entry-section" data-astro-cid-tq7oqkre> <p class="entry-section__label" data-astro-cid-tq7oqkre>Bahasa Standard</p> <p class="entry-section__content" data-astro-cid-tq7oqkre>${entry.s_meaning_ms}</p> </div>`, entry.meaning_ms, entry.example_ms && renderTemplate`<div class="entry-section" data-astro-cid-tq7oqkre> <p class="entry-section__label" data-astro-cid-tq7oqkre>${isBahasaKlasik ? "Ayat" : "Contoh Ayat"}</p> <div class="entry-example" data-astro-cid-tq7oqkre> <p class="entry-example__ms" data-astro-cid-tq7oqkre>"${entry.example_ms}"</p> </div> </div>`, isKlasikKind && entry.s_example_ms && renderTemplate`<div class="entry-section" data-astro-cid-tq7oqkre> <p class="entry-section__label" data-astro-cid-tq7oqkre>Ayat dalam Bahasa Standard</p> <div class="entry-example" data-astro-cid-tq7oqkre> <p class="entry-example__ms" data-astro-cid-tq7oqkre>"${entry.s_example_ms}"</p> </div> </div>`, addAttribute(wordTypeData.url, "href"), wordTypeData.label, showBackToAll && renderTemplate`<a href="/kamus" class="btn btn--secondary btn--sm" data-astro-cid-tq7oqkre>
&larr; Kembali ke Semua
</a>`, addAttribute(entry.phrase, "data-phrase"), addAttribute(entry.meaning_ms, "data-meaning"), addAttribute(entry.example_ms || "", "data-example"), addAttribute(entry.s_meaning_ms || "", "data-s-meaning"), addAttribute(entry.s_example_ms || "", "data-s-example"), addAttribute(isKlasikKind ? "klasik" : isIstana ? "istana" : "peribahasa", "data-entry-kind"), (navigation.previous || navigation.next) && renderTemplate`<div class="entry-nav" data-astro-cid-tq7oqkre> ${navigation.previous ? renderTemplate`<a${addAttribute(navigation.previous.url, "href")} class="entry-nav__button entry-nav__button--previous" data-astro-cid-tq7oqkre> <span class="entry-nav__label" data-astro-cid-tq7oqkre>&larr;</span> <span class="entry-nav__preview" data-astro-cid-tq7oqkre>${navigation.previous.preview}</span> </a>` : renderTemplate`<div class="entry-nav__spacer" aria-hidden="true" data-astro-cid-tq7oqkre></div>`} ${navigation.next ? renderTemplate`<a${addAttribute(navigation.next.url, "href")} class="entry-nav__button entry-nav__button--next" data-astro-cid-tq7oqkre> <span class="entry-nav__label" data-astro-cid-tq7oqkre>&rarr;</span> <span class="entry-nav__preview" data-astro-cid-tq7oqkre>${navigation.next.preview}</span> </a>` : renderTemplate`<div class="entry-nav__spacer" aria-hidden="true" data-astro-cid-tq7oqkre></div>`} </div>`);
}, "D:/4-dev/sangbahasa/src/components/EntryDetail.astro", void 0);

const $$Confetti = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<canvas id="confetti-canvas" hidden data-astro-cid-cekib34r></canvas>  ${renderScript($$result, "D:/4-dev/sangbahasa/src/components/Confetti.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/4-dev/sangbahasa/src/components/Confetti.astro", void 0);

function createPreview(phrase) {
  const trimmed = String(phrase ?? "").trim();
  if (!trimmed) return "";
  return `${trimmed.slice(0, 4)}...`;
}
function toNavLink(wordType, entry) {
  if (!entry) return null;
  return {
    label: getWordTypeLabel(wordType),
    preview: createPreview(entry.phrase),
    url: getEntryUrl(wordType, entry.slug)
  };
}
async function fetchAllEntries(wordType) {
  return getEntriesByWordType(wordType);
}
async function getEntryNavigation(wordType, slug) {
  const entries = await fetchAllEntries(wordType);
  const currentIndex = entries.findIndex((entry) => entry.slug === slug);
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: toNavLink(wordType, entries[currentIndex - 1]),
    next: toNavLink(wordType, entries[currentIndex + 1])
  };
}

export { $$Confetti as $, $$PeribahasaHeader as a, $$EntryDetail as b, getEntryNavigation as g };
