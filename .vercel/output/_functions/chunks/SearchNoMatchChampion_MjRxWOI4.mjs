import { c as createComponent } from './astro-component_Rz2ymryl.mjs';
import 'piccolore';
import { m as maybeRenderHead, n as renderComponent, r as renderTemplate } from './entrypoint_IgdAE7NG.mjs';
import { a as $$ResultCard } from './BaseLayout_tD9nsf-j.mjs';

const $$SearchNoMatchChampion = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$SearchNoMatchChampion;
  const { champions = [], showSection = false } = Astro2.props;
  return renderTemplate`${showSection && renderTemplate`${maybeRenderHead()}<div class="search-no-match-champion" data-astro-cid-ganawkx4><p class="search-no-match-champion__title" data-astro-cid-ganawkx4>
Atau lawati Juara Hari Ini
</p>${champions.length > 0 ? renderTemplate`<div class="results-grid search-no-match-champion__cards" data-astro-cid-ganawkx4>${champions.map((entry) => renderTemplate`${renderComponent($$result, "ResultCard", $$ResultCard, { "entry": entry, "wordType": entry.word_type || "peribahasa", "data-astro-cid-ganawkx4": true })}`)}</div>` : renderTemplate`<p class="search-no-match-champion__empty" data-astro-cid-ganawkx4>
Ayo, tiada aktiviti hari ini! Cuba klik pada entri yang paling menarik untuk cipta rekod.
</p>`}</div>`}`;
}, "D:/4-dev/sangbahasa/src/components/SearchNoMatchChampion.astro", void 0);

export { $$SearchNoMatchChampion as $ };
