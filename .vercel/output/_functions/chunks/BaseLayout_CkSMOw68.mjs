import { c as createComponent } from './astro-component_S0B6rbTO.mjs';
import 'piccolore';
import { q as createRenderInstruction, m as maybeRenderHead, h as addAttribute, r as renderTemplate, n as renderComponent, v as renderSlot, w as renderHead } from './entrypoint_L8jLJ3IM.mjs';
import 'clsx';
import { c as formatEntryTypeDisplayLabel, f as formatMalayLabel, d as buildTypeFilterHref, e as buildCategoryFilterHref, h as getListingPathForWordType } from './kamus_CcPSdIwT.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

const WORD_TYPE_CONFIG = {
  peribahasa: { label: "Peribahasa", listingUrl: "/kamus/peribahasa" },
  "bahasa-klasik": { label: "Bahasa Klasik", listingUrl: "/kamus/bahasa-klasik" }
};
function getListingUrl(wordType) {
  return WORD_TYPE_CONFIG[wordType]?.listingUrl ?? "/kamus";
}
function getEntryUrl(wordType, slug) {
  return `${getListingUrl(wordType)}/${slug}`;
}
function getWordTypeLabel(wordType) {
  return WORD_TYPE_CONFIG[wordType]?.label ?? wordType;
}

const $$ResultCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ResultCard;
  const { entry, wordType: wordTypeProp } = Astro2.props;
  const wordType = entry.word_type || wordTypeProp || "peribahasa";
  const listingPath = getListingPathForWordType(
    wordType === "bahasa-klasik" ? "bahasa-klasik" : "peribahasa"
  );
  const typeLabel = formatEntryTypeDisplayLabel(entry._type, wordType);
  const categoryLabel = formatMalayLabel(entry.category);
  const entryUrl = getEntryUrl(wordType, entry.slug);
  const typeHref = buildTypeFilterHref(listingPath, entry._type);
  const categoryHref = buildCategoryFilterHref(listingPath, entry.category);
  const entryTags = Array.isArray(entry.tags) ? entry.tags : [];
  return renderTemplate`${maybeRenderHead()}<div class="result-card" data-astro-cid-vzlgdarb> <a${addAttribute(entryUrl, "href")} class="result-card__overlay"${addAttribute(`Buka entri: ${entry.phrase}`, "aria-label")} data-tren-card="1"${addAttribute(wordType, "data-tren-word-type")}${addAttribute(entry.slug, "data-tren-entry-slug")} data-astro-cid-vzlgdarb> <span class="sr-only" data-astro-cid-vzlgdarb>${entry.phrase}</span> </a> <div class="result-card__body" data-astro-cid-vzlgdarb> <div class="result-card__header" data-astro-cid-vzlgdarb> <div class="result-card__phrase" data-astro-cid-vzlgdarb>${entry.phrase}</div> <div class="result-card__title-labels" data-astro-cid-vzlgdarb> <a${addAttribute(typeHref, "href")} class="result-card__label result-card__label--type result-card__label--link" data-astro-prefetch data-astro-cid-vzlgdarb> ${typeLabel} </a> <a${addAttribute(categoryHref, "href")} class="result-card__label result-card__label--category result-card__label--link" data-astro-prefetch data-astro-cid-vzlgdarb> ${categoryLabel} </a> </div> </div> <div class="result-card__divider" data-astro-cid-vzlgdarb></div> <p class="result-card__meaning" data-astro-cid-vzlgdarb>${entry.meaning_ms}</p> ${entryTags.length > 0 && renderTemplate`<div class="result-card__tags" data-astro-cid-vzlgdarb> ${entryTags.slice(0, 3).map((tag) => renderTemplate`<span class="result-card__tag" data-astro-cid-vzlgdarb>${formatMalayLabel(tag)}</span>`)} </div>`} </div> </div>`;
}, "D:/4-dev/sangbahasa/src/components/ResultCard.astro", void 0);

const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "D:/4-dev/sangbahasa/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/4-dev/sangbahasa/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-speed-insights", "vercel-speed-insights", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "D:/4-dev/sangbahasa/node_modules/@vercel/speed-insights/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "D:/4-dev/sangbahasa/node_modules/@vercel/speed-insights/dist/astro/index.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title,
    description = "Kamus peribahasa Melayu dan bahasa Melayu klasik yang lengkap dengan makna, contoh ayat, dan carian yang mudah digunakan.",
    ogImage = "/og-default.png",
    canonicalUrl,
    noIndex = false
  } = Astro2.props;
  const siteUrl = "http://localhost:4321";
  const canonical = canonicalUrl || new URL(Astro2.url.pathname, siteUrl).href;
  const fullTitle = title.includes("Sang Bahasa") ? title : `${title} — Sang Bahasa`;
  const pathname = Astro2.url.pathname;
  const isKamusRoute = pathname.startsWith("/kamus");
  const isKamusAll = pathname === "/kamus" || pathname.startsWith("/kamus/search");
  const isKamusPeribahasa = pathname.startsWith("/kamus/peribahasa");
  const isKamusBahasaKlasik = pathname.startsWith("/kamus/bahasa-klasik");
  return renderTemplate(_a || (_a = __template(['<html lang="ms"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>', '</title><meta name="description"', ">", '<link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:locale" content="ms_MY"><meta property="og:site_name" content="Sang Bahasa"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', `><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap.xml"><meta name="theme-color" content="#2d6a4f"><meta name="author" content="Sang Bahasa"><meta name="keywords" content="kamus, peribahasa, bahasa melayu, bahasa klasik, kamus peribahasa, kamus bahasa melayu"><style>
      .footer-tooltip {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-family: Georgia, 'Times New Roman', Times, serif;
        color: #9c9188;
        font-size: 13px;
        cursor: default;
        line-height: 1.3;
      }

      .footer-tooltip__panel {
        display: none;
        position: absolute;
        left: -20px;
        bottom: calc(100% + 10px);
        width: min(200px, 80vw);
        padding: 0.5rem 0.8rem;
        background: rgb(255, 255, 255);
        color: #2d6a4f;
        border-radius: 12px;
        border: 1px solid #d3d3d3; /* Thin grey border */
        box-shadow: 0 20px 38px rgba(0, 0, 0, 0.22);
        white-space: normal;
        line-height: 1.5;
        font-size: 12.75px;
        text-align: left;
        z-index: 10;
      }

      .footer-tooltip:hover .footer-tooltip__panel,
      .footer-tooltip:focus-within .footer-tooltip__panel {
        display: block;
      }
    </style><script>
      // Check screen size and show warning popup if needed
      function checkScreenSize() {
        const minWidth = 350; // Minimum comfortable width
        const screenWidth = window.innerWidth;
        
        if (screenWidth < minWidth && !sessionStorage.getItem('screenSizeWarningShown')) {
          const isPortrait = window.matchMedia('(orientation: portrait)').matches;
          const message = isPortrait 
            ? 'Laman web ini mungkin tidak papar dengan baik pada skrin yang sangat kecil. Sila pusingkan peranti anda ke orientasi landskap atau besarkan tetingkap penyemak imbas anda untuk pengalaman yang lebih baik.'
            : '\\nMaaf, Sang Bahasa mungkin tidak papar dengan baik pada dimensi yang sempit.';
          
          if (confirm(message + '\\n\\nSila pusingkan peranti anda ke orientasi landskap (disyorkan) atau luaskan penyemak imbas anda untuk pengalaman yang lebih baik. Terima kasih!')) {
            sessionStorage.setItem('screenSizeWarningShown', 'true');
          }
        }
      }
      
      // Check on load and resize
      window.addEventListener('load', checkScreenSize);
      window.addEventListener('resize', () => {
        if (!sessionStorage.getItem('screenSizeWarningShown')) {
          checkScreenSize();
        }
      });
    </script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5305624494969897" crossorigin="anonymous" title="Google Adsense"></script><meta name="google-site-verification" content="8byTqO1tCJEM1IxvmnBaBb7Y7GFpXTpH-g22Jktbotg">`, '</head> <body> <a href="#main-content" class="skip-link">Skip to content</a> <header class="site-header"> <div class="container"> <div class="site-header__inner"> <a href="/" class="site-logo" aria-label="Sang Bahasa Laman Utama">\nSang Bahasa\n</a> <nav class="site-nav" aria-label="Main navigation"> <a href="/"', ' aria-label="Laman Utama">\nLaman Utama\n</a> <div class="nav-dropdown-wrapper"> <button class="nav-kamus-btn" aria-expanded="false" aria-haspopup="true" aria-controls="kamus-menu" aria-label="Buka menu kamus"', '>\nKamus\n</button> <ul id="kamus-menu" class="nav-dropdown-menu" role="menu" aria-label="Submenu Kamus"> <li role="none"> <a href="/kamus" role="menuitem" aria-label="Semua Kamus"', '>Semua</a> </li> <li role="none"> <a href="/kamus/peribahasa" role="menuitem" aria-label="Kamus Peribahasa"', '>Peribahasa</a> </li> <li role="none"> <a href="/kamus/bahasa-klasik" role="menuitem" aria-label="Kamus Bahasa Klasik"', '>Bahasa Klasik</a> </li> </ul> </div> </nav> </div> </div> </header> <main id="main-content"> ', ' </main> <footer class="site-footer"> <div class="container"> <div class="site-footer__inner"> <div class="site-footer__left"> <p class="site-footer__tagline site-footer__tagline--footer">\nSang Bahasa ~ Bangga cipta Malaysia\n</p> <p class="site-footer__copy">\n&copy; ', ` Sang Bahasa. Hak cipta terpelihara.
</p> </div> <nav class="site-footer__links" aria-label="Pautan tapak" style="display: grid; grid-template-columns: auto auto; gap: 5px 25px; justify-content: start;"> <span class="footer-tooltip">
Kenali Sang Bahasa
<span class="footer-tooltip__panel"><strong>Sang Bahasa</strong><br>— Kamus Bahasa Melayu yang paling dekat di hati</span> </span> <a href="/dasar-privasi" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Dasar Privasi</a> <a href="/hubungi-kami" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Hubungi Kami</a> <a href="/penafian" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Penafian</a> </nav> </div> </div> </footer> <script>
      // Global tracking function
      window.trackTrenDuniaView = function(wordType, slug) {
        const url = "/api/tren-dunia/track";
        const body = JSON.stringify({ wordType, slug });
        try {
          if (navigator.sendBeacon) {
            navigator.sendBeacon(
              url,
              new Blob([body], { type: "application/json" })
            );
          } else {
            fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
              keepalive: true,
            });
          }
        } catch (_) {}
      };

      // Handle Kamus dropdown navigation
      document.addEventListener("DOMContentLoaded", () => {
        const kamusBtn = document.querySelector(".nav-kamus-btn");
        const dropdownMenu = document.querySelector(".nav-dropdown-menu");
        
        if (!kamusBtn || !dropdownMenu) return;

        // Toggle dropdown on button click only
        kamusBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const isOpen = kamusBtn.getAttribute("aria-expanded") === "true";
          
          if (isOpen) {
            // Close dropdown if already open
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          } else {
            // Open dropdown on click
            kamusBtn.setAttribute("aria-expanded", "true");
            dropdownMenu.classList.add("active");
          }
        });

        // Close dropdown when a menu item is clicked
        document.querySelectorAll(".dropdown-item").forEach((item) => {
          item.addEventListener("click", () => {
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          });
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          const target = e.target instanceof Element ? e.target : null;
          if (!target?.closest(".nav-dropdown-wrapper")) {
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          }
        });
      });
    </script> `, " ", " </body></html>"], ['<html lang="ms"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>', '</title><meta name="description"', ">", '<link rel="canonical"', '><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:locale" content="ms_MY"><meta property="og:site_name" content="Sang Bahasa"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', `><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="sitemap" href="/sitemap.xml"><meta name="theme-color" content="#2d6a4f"><meta name="author" content="Sang Bahasa"><meta name="keywords" content="kamus, peribahasa, bahasa melayu, bahasa klasik, kamus peribahasa, kamus bahasa melayu"><style>
      .footer-tooltip {
        position: relative;
        display: inline-flex;
        align-items: center;
        font-family: Georgia, 'Times New Roman', Times, serif;
        color: #9c9188;
        font-size: 13px;
        cursor: default;
        line-height: 1.3;
      }

      .footer-tooltip__panel {
        display: none;
        position: absolute;
        left: -20px;
        bottom: calc(100% + 10px);
        width: min(200px, 80vw);
        padding: 0.5rem 0.8rem;
        background: rgb(255, 255, 255);
        color: #2d6a4f;
        border-radius: 12px;
        border: 1px solid #d3d3d3; /* Thin grey border */
        box-shadow: 0 20px 38px rgba(0, 0, 0, 0.22);
        white-space: normal;
        line-height: 1.5;
        font-size: 12.75px;
        text-align: left;
        z-index: 10;
      }

      .footer-tooltip:hover .footer-tooltip__panel,
      .footer-tooltip:focus-within .footer-tooltip__panel {
        display: block;
      }
    </style><script>
      // Check screen size and show warning popup if needed
      function checkScreenSize() {
        const minWidth = 350; // Minimum comfortable width
        const screenWidth = window.innerWidth;
        
        if (screenWidth < minWidth && !sessionStorage.getItem('screenSizeWarningShown')) {
          const isPortrait = window.matchMedia('(orientation: portrait)').matches;
          const message = isPortrait 
            ? 'Laman web ini mungkin tidak papar dengan baik pada skrin yang sangat kecil. Sila pusingkan peranti anda ke orientasi landskap atau besarkan tetingkap penyemak imbas anda untuk pengalaman yang lebih baik.'
            : '\\\\nMaaf, Sang Bahasa mungkin tidak papar dengan baik pada dimensi yang sempit.';
          
          if (confirm(message + '\\\\n\\\\nSila pusingkan peranti anda ke orientasi landskap (disyorkan) atau luaskan penyemak imbas anda untuk pengalaman yang lebih baik. Terima kasih!')) {
            sessionStorage.setItem('screenSizeWarningShown', 'true');
          }
        }
      }
      
      // Check on load and resize
      window.addEventListener('load', checkScreenSize);
      window.addEventListener('resize', () => {
        if (!sessionStorage.getItem('screenSizeWarningShown')) {
          checkScreenSize();
        }
      });
    </script><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5305624494969897" crossorigin="anonymous" title="Google Adsense"></script><meta name="google-site-verification" content="8byTqO1tCJEM1IxvmnBaBb7Y7GFpXTpH-g22Jktbotg">`, '</head> <body> <a href="#main-content" class="skip-link">Skip to content</a> <header class="site-header"> <div class="container"> <div class="site-header__inner"> <a href="/" class="site-logo" aria-label="Sang Bahasa Laman Utama">\nSang Bahasa\n</a> <nav class="site-nav" aria-label="Main navigation"> <a href="/"', ' aria-label="Laman Utama">\nLaman Utama\n</a> <div class="nav-dropdown-wrapper"> <button class="nav-kamus-btn" aria-expanded="false" aria-haspopup="true" aria-controls="kamus-menu" aria-label="Buka menu kamus"', '>\nKamus\n</button> <ul id="kamus-menu" class="nav-dropdown-menu" role="menu" aria-label="Submenu Kamus"> <li role="none"> <a href="/kamus" role="menuitem" aria-label="Semua Kamus"', '>Semua</a> </li> <li role="none"> <a href="/kamus/peribahasa" role="menuitem" aria-label="Kamus Peribahasa"', '>Peribahasa</a> </li> <li role="none"> <a href="/kamus/bahasa-klasik" role="menuitem" aria-label="Kamus Bahasa Klasik"', '>Bahasa Klasik</a> </li> </ul> </div> </nav> </div> </div> </header> <main id="main-content"> ', ' </main> <footer class="site-footer"> <div class="container"> <div class="site-footer__inner"> <div class="site-footer__left"> <p class="site-footer__tagline site-footer__tagline--footer">\nSang Bahasa ~ Bangga cipta Malaysia\n</p> <p class="site-footer__copy">\n&copy; ', ` Sang Bahasa. Hak cipta terpelihara.
</p> </div> <nav class="site-footer__links" aria-label="Pautan tapak" style="display: grid; grid-template-columns: auto auto; gap: 5px 25px; justify-content: start;"> <span class="footer-tooltip">
Kenali Sang Bahasa
<span class="footer-tooltip__panel"><strong>Sang Bahasa</strong><br>— Kamus Bahasa Melayu yang paling dekat di hati</span> </span> <a href="/dasar-privasi" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Dasar Privasi</a> <a href="/hubungi-kami" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Hubungi Kami</a> <a href="/penafian" style="font-family: Georgia, 'Times New Roman', Times, serif; color: #9c9188; font-size: 13px;" data-astro-prefetch>Penafian</a> </nav> </div> </div> </footer> <script>
      // Global tracking function
      window.trackTrenDuniaView = function(wordType, slug) {
        const url = "/api/tren-dunia/track";
        const body = JSON.stringify({ wordType, slug });
        try {
          if (navigator.sendBeacon) {
            navigator.sendBeacon(
              url,
              new Blob([body], { type: "application/json" })
            );
          } else {
            fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body,
              keepalive: true,
            });
          }
        } catch (_) {}
      };

      // Handle Kamus dropdown navigation
      document.addEventListener("DOMContentLoaded", () => {
        const kamusBtn = document.querySelector(".nav-kamus-btn");
        const dropdownMenu = document.querySelector(".nav-dropdown-menu");
        
        if (!kamusBtn || !dropdownMenu) return;

        // Toggle dropdown on button click only
        kamusBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const isOpen = kamusBtn.getAttribute("aria-expanded") === "true";
          
          if (isOpen) {
            // Close dropdown if already open
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          } else {
            // Open dropdown on click
            kamusBtn.setAttribute("aria-expanded", "true");
            dropdownMenu.classList.add("active");
          }
        });

        // Close dropdown when a menu item is clicked
        document.querySelectorAll(".dropdown-item").forEach((item) => {
          item.addEventListener("click", () => {
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          });
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
          const target = e.target instanceof Element ? e.target : null;
          if (!target?.closest(".nav-dropdown-wrapper")) {
            kamusBtn.setAttribute("aria-expanded", "false");
            dropdownMenu.classList.remove("active");
          }
        });
      });
    </script> `, " ", " </body></html>"])), fullTitle, addAttribute(description, "content"), noIndex && renderTemplate`<meta name="robots" content="noindex, nofollow">`, addAttribute(canonical, "href"), addAttribute(canonical, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(`${siteUrl}${ogImage}`, "content"), addAttribute(fullTitle, "content"), addAttribute(description, "content"), addAttribute(`${siteUrl}${ogImage}`, "content"), renderHead(), addAttribute(pathname === "/" ? "page" : void 0, "aria-current"), addAttribute(isKamusRoute ? "page" : void 0, "aria-current"), addAttribute(`dropdown-item ${isKamusAll ? "dropdown-item--active" : ""}`, "class"), addAttribute(`dropdown-item ${isKamusPeribahasa ? "dropdown-item--active" : ""}`, "class"), addAttribute(`dropdown-item ${isKamusBahasaKlasik ? "dropdown-item--active" : ""}`, "class"), renderSlot($$result, $$slots["default"]), (/* @__PURE__ */ new Date()).getFullYear(), renderComponent($$result, "Analytics", $$Index$1, {}), renderComponent($$result, "SpeedInsights", $$Index, {}));
}, "D:/4-dev/sangbahasa/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $, $$ResultCard as a, getWordTypeLabel as b, getEntryUrl as c, getListingUrl as g, renderScript as r };
