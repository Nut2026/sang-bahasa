// ============================================================
// Sang Bahasa API Configuration
// Types shared by the Astro frontend.
// ============================================================

// ============================================================
// Types
// ============================================================

export interface PeribahasaSummary {
  id: string;
  phrase: string;
  slug: string;
  meaning_ms: string;
  category: string;
  tags?: string[];
  word_type: string;
  created_at?: string | null;
  /** DB `_type`: peribahasa kinds or klasik / istana */
  _type?: string | null;
}

export interface PeribahasaFull extends PeribahasaSummary {
  example_ms: string | null;
  s_meaning_ms?: string | null;
  s_example_ms?: string | null;
  meta_title_ms: string | null;
  meta_description_ms: string | null;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface SearchResult {
  query: string;
  total: number;
  page: number;
  page_size: number;
  results: PeribahasaSummary[];
}

export interface PaginatedResponse {
  total: number;
  page: number;
  page_size: number;
  items: PeribahasaFull[];
}

export interface CategoryInfo {
  id: number;
  slug: string;
  name_ms: string;
  description_ms: string | null;
}
