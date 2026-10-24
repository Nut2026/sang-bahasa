import { getEntriesByWordType } from "./kamus";
import { getEntryUrl, getWordTypeLabel } from "../config/routes";

export interface EntryNavLink {
  label: string;
  preview: string;
  url: string;
}

export interface EntryNavigation {
  previous: EntryNavLink | null;
  next: EntryNavLink | null;
}

function createPreview(phrase: string) {
  const trimmed = String(phrase ?? "").trim();
  if (!trimmed) return "";
  return `${trimmed.slice(0, 4)}...`;
}

interface SummaryEntry {
  id: string;
  phrase: string;
  slug: string;
  meaning_ms: string;
  category: string;
  word_type: string;
  created_at?: string | null;
  _type?: string;
}

function toNavLink(wordType: string, entry: SummaryEntry | undefined): EntryNavLink | null {
  if (!entry) return null;

  return {
    label: getWordTypeLabel(wordType),
    preview: createPreview(entry.phrase),
    url: getEntryUrl(wordType, entry.slug),
  };
}

async function fetchAllEntries(wordType: string): Promise<SummaryEntry[]> {
  return getEntriesByWordType(wordType as "all" | "peribahasa" | "bahasa-klasik");
}

export async function getEntryNavigation(wordType: string, slug: string): Promise<EntryNavigation> {
  const entries = await fetchAllEntries(wordType);
  const currentIndex = entries.findIndex((entry) => entry.slug === slug);

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: toNavLink(wordType, entries[currentIndex - 1]),
    next: toNavLink(wordType, entries[currentIndex + 1]),
  };
}
