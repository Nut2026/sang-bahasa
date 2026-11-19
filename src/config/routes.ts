export const WORD_TYPE_CONFIG: Record<string, { label: string; listingUrl: string }> = {
  peribahasa: { label: "Peribahasa", listingUrl: "/kamus/peribahasa" },
  "bahasa-klasik": { label: "Bahasa Klasik", listingUrl: "/kamus/bahasa-klasik" }
};

export function getListingUrl(wordType: string) {
  return WORD_TYPE_CONFIG[wordType]?.listingUrl ?? "/kamus";
}

export function getEntryUrl(wordType: string, slug: string) {
  return `${getListingUrl(wordType)}/${slug}`;
}

export function getWordTypeLabel(wordType: string) {
  return WORD_TYPE_CONFIG[wordType]?.label ?? wordType;
}
