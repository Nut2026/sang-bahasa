// ============================================================
// Sang Bahasa API Configuration
// Central place for all API endpoint definitions.
// Swap PUBLIC_API_BASE_URL in .env to migrate to a new backend.
// ============================================================

import { getSupabaseClient } from "../utils/supabase";

const BASE_URL =
  (import.meta.env.PUBLIC_API_BASE_URL || "http://localhost:8000").replace(
    /\/$/,
    ""
  );

// Supabase configuration
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Flag to use Supabase directly instead of backend API
// Set to true if you want to bypass the backend and use Supabase directly
export const USE_SUPABASE_DIRECTLY = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const API_BASE_URL = BASE_URL;

// Export Supabase config for direct usage
export const SUPABASE_CONFIG = {
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  isConfigured: USE_SUPABASE_DIRECTLY,
};

export const ENDPOINTS = {
  // Search
  search: (query: string, page = 1, pageSize = 20, wordType = "peribahasa") =>
    `${BASE_URL}/api/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&word_type=${wordType}`,

  searchWithFilters: (
    query: string,
    category?: string,
    tags?: string[],
    page = 1,
    pageSize = 20,
    wordType = "peribahasa"
  ) => {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      page_size: String(pageSize),
    });
    if (category) params.append("category", category);
    if (tags) tags.forEach((t) => params.append("tags", t));
    params.append("word_type", wordType);
    return `${BASE_URL}/api/search?${params.toString()}`;
  },

  suggestions: (query: string, limit = 5, wordType = "peribahasa") =>
    `${BASE_URL}/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}&word_type=${wordType}`,

  similar: (query: string, limit = 5, wordType = "peribahasa") =>
    `${BASE_URL}/api/search/similar?q=${encodeURIComponent(query)}&limit=${limit}&word_type=${wordType}`,

  // Entries
  entries: (page = 1, pageSize = 20, wordType = "peribahasa") =>
    `${BASE_URL}/api/entries?page=${page}&page_size=${pageSize}&word_type=${wordType}`,

  entriesByCategory: (category: string, page = 1, pageSize = 20, wordType = "peribahasa") =>
    `${BASE_URL}/api/entries?category=${category}&page=${page}&page_size=${pageSize}&word_type=${wordType}`,

  entry: (slug: string, wordType = "peribahasa") =>
    `${BASE_URL}/api/entries/${slug}?word_type=${wordType}`,

  featured: (limit = 8, wordType = "peribahasa") =>
    `${BASE_URL}/api/entries/featured?limit=${limit}&word_type=${wordType}`,

  random: (limit = 5, wordType = "peribahasa") =>
    `${BASE_URL}/api/entries/random?limit=${limit}&word_type=${wordType}`,

  newest: (limit = 5) =>
    `${BASE_URL}/api/entries/newest?limit=${limit}`,

  // Categories
  categories: () => `${BASE_URL}/api/sitemap/categories`,

  // Sitemap
  sitemap: () => `${BASE_URL}/api/sitemap`,

  // Admin
  adminEntries: (page = 1, pageSize = 20) =>
    `${BASE_URL}/api/admin/entries?page=${page}&page_size=${pageSize}`,

  adminCreate: () => `${BASE_URL}/api/admin/entries`,

  adminUpdate: (id: string) => `${BASE_URL}/api/admin/entries/${id}`,

  adminDelete: (id: string) => `${BASE_URL}/api/admin/entries/${id}`,

  // Health
  health: () => `${BASE_URL}/health`,

  // Analytics
  hotToday: (limit = 5) => `${BASE_URL}/api/analytics/hot-today?limit=${limit}`,
  trackClick: (slug: string, wordType = "peribahasa") =>
    `${BASE_URL}/api/analytics/click?slug=${encodeURIComponent(slug)}&word_type=${encodeURIComponent(wordType)}`,
} as const;

// ============================================================
// Typed API fetcher with automatic retry for transient errors
// ============================================================

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  retries: number = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        // Don't retry client errors (4xx)
        if (response.status >= 400 && response.status < 500) {
          const errorBody = await response.text();
          throw new ApiError(response.status, errorBody);
        }
        // Retry server errors (5xx)
        if (attempt < retries - 1 && response.status >= 500) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        const errorBody = await response.text();
        throw new ApiError(response.status, errorBody);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      // Retry network errors
      if (attempt < retries - 1 && error instanceof TypeError) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API error ${status}: ${body}`);
    this.name = "ApiError";
  }
}

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
