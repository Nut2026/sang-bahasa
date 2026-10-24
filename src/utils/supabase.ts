// ============================================================
// Sang Bahasa — Supabase Client (Astro-safe, production-ready)
// ============================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ============================================================
// Environment (Astro)
// ============================================================

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "[Supabase] Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_ANON_KEY in .env"
  );
}

// ============================================================
// Singleton client
// ============================================================

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabase;
}

// ============================================================
// Shared types (MATCHING YOUR SQL SCHEMA)
// ============================================================

type UUID = string;

export interface BahasaKlasikRow {
  id: UUID;
  phrase: string;
  slug: string;
  s_meaning_ms?: string | null;
  meaning_ms: string;
  example_ms: string | null;
  s_example_ms?: string | null;
  _type?: string | null;
  category: string | null;
  is_published: boolean;
  world?: number | null;
  created_at?: string;
}

export interface PeribahasaRow {
  id: UUID;
  phrase: string;
  slug: string;
  meaning_ms: string;
  example_ms: string | null;
  _type?: string | null;
  category: string | null;
  is_published?: boolean;
  world?: number | null;
  created_at?: string;
}

// ============================================================
// Generic fetch helper
// ============================================================

async function fetchFromTable<T>(
  table: string,
  filters?: {
    search?: string;
    searchColumn?: string;
    eq?: { column: string; value: string | number };
    order?: { column: string; ascending?: boolean };
    limit?: number;
    offset?: number;
  }
): Promise<T[]> {
  const client = getSupabaseClient();

  let query = client.from(table).select("*");

  if (filters?.search && filters?.searchColumn) {
    query = query.ilike(filters.searchColumn, `%${filters.search}%`);
  }

  if (filters?.eq) {
    query = query.eq(filters.eq.column, filters.eq.value);
  }

  if (filters?.order) {
    query = query.order(filters.order.column, {
      ascending: filters.order.ascending ?? true,
    });
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset !== undefined) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit ?? 20) - 1
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`[Supabase:${table}] ${error.message}`);
  }

  return (data ?? []) as T[];
}

const FETCH_ALL_BATCH_SIZE = 1000;
const FETCH_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const fetchCache = new Map<string, { data: unknown; expiry: number }>();

function cacheKey(table: string, filters?: any): string {
  return `${table}:${JSON.stringify(filters ?? {})}`;
}

async function fetchAllFromTable<T>(
  table: string,
  filters?: {
    search?: string;
    searchColumn?: string;
    eq?: { column: string; value: string | number };
    order?: { column: string; ascending?: boolean };
  }
): Promise<T[]> {
  const key = cacheKey(table, filters);
  const hit = fetchCache.get(key);
  if (hit && hit.expiry > Date.now()) {
    return hit.data as T[];
  }

  const rows: T[] = [];
  let offset = 0;

  while (true) {
    const batch = await fetchFromTable<T>(table, {
      ...filters,
      limit: FETCH_ALL_BATCH_SIZE,
      offset,
    });

    rows.push(...batch);

    if (batch.length < FETCH_ALL_BATCH_SIZE) {
      break;
    }

    offset += FETCH_ALL_BATCH_SIZE;
  }

  fetchCache.set(key, { data: rows, expiry: Date.now() + FETCH_CACHE_TTL_MS });
  return rows;
}

// ============================================================
// PERIBAHASA
// ============================================================

export async function getAllPeribahasa(options?: {
  limit?: number;
  offset?: number;
  orderBy?: string;
}): Promise<PeribahasaRow[]> {
  if (options?.limit === undefined && options?.offset === undefined) {
    return fetchAllFromTable<PeribahasaRow>("peribahasa", {
      order: { column: options?.orderBy || "phrase", ascending: true },
    });
  }

  return fetchFromTable<PeribahasaRow>("peribahasa", {
    order: { column: options?.orderBy || "phrase", ascending: true },
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function searchPeribahasa(
  query: string,
  limit = 20
): Promise<PeribahasaRow[]> {
  return fetchFromTable<PeribahasaRow>("peribahasa", {
    search: query,
    searchColumn: "phrase",
    limit,
  });
}

export async function getPeribahasaByPhrase(
  phrase: string
): Promise<PeribahasaRow | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("peribahasa")
    .select("*")
    .eq("phrase", phrase)
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase:peribahasa] ${error.message}`);
  }

  return data as PeribahasaRow | null;
}

export async function getPeribahasaBySlug(
  slug: string
): Promise<PeribahasaRow | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("peribahasa")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase:peribahasa] ${error.message}`);
  }

  return data as PeribahasaRow | null;
}

export async function getPeribahasaByCategory(
  category: string,
  limit = 20,
  offset = 0
): Promise<PeribahasaRow[]> {
  return fetchFromTable<PeribahasaRow>("peribahasa", {
    eq: { column: "category", value: category },
    limit,
    offset,
    order: { column: "phrase", ascending: true },
  });
}

export async function getRandomPeribahasa(
  limit = 5
): Promise<PeribahasaRow[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("peribahasa")
    .select("*")
    .limit(limit);

  if (error) {
    throw new Error(`[Supabase:peribahasa] ${error.message}`);
  }

  // Shuffle the results
  const shuffled = (data ?? []).sort(() => Math.random() - 0.5);
  return shuffled as PeribahasaRow[];
}

export async function getNewestPeribahasa(
  limit = 5
): Promise<PeribahasaRow[]> {
  return fetchFromTable<PeribahasaRow>("peribahasa", {
    order: { column: "created_at", ascending: false },
    limit,
  });
}

export async function getNewestBahasaKlasik(
  limit = 5
): Promise<BahasaKlasikRow[]> {
  return fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
    order: { column: "created_at", ascending: false },
    limit,
  });
}

export async function getTrendingWorldPeribahasa(limit = 5): Promise<PeribahasaRow[]> {
  return fetchFromTable<PeribahasaRow>("peribahasa", {
    order: { column: "world", ascending: false },
    limit,
  });
}

// ============================================================
// BAHASA KLASIK
// ============================================================

export async function getAllBahasaKlasik(options?: {
  limit?: number;
  offset?: number;
}): Promise<BahasaKlasikRow[]> {
  if (options?.limit === undefined && options?.offset === undefined) {
    return fetchAllFromTable<BahasaKlasikRow>("bahasa_klasik", {
      order: { column: "phrase", ascending: true },
    });
  }

  return fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
    order: { column: "phrase", ascending: true },
    limit: options?.limit,
    offset: options?.offset,
  });
}

export async function searchBahasaKlasik(
  query: string,
  limit = 20
): Promise<BahasaKlasikRow[]> {
  return fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
    search: query,
    searchColumn: "phrase",
    limit,
  });
}

export async function getBahasaKlasikBySlug(
  slug: string
): Promise<BahasaKlasikRow | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from("bahasa_klasik")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase:bahasa_klasik] ${error.message}`);
  }

  return data as BahasaKlasikRow | null;
}

export async function getBahasaKlasikByCategory(
  category: string,
  limit = 20,
  offset = 0
): Promise<BahasaKlasikRow[]> {
  return fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
    eq: { column: "category", value: category },
    limit,
    offset,
    order: { column: "phrase", ascending: true },
  });
}

export async function getTrendingWorldBahasaKlasik(limit = 5): Promise<BahasaKlasikRow[]> {
  return fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
    order: { column: "world", ascending: false },
    limit,
  });
}

// ============================================================
// GLOBAL SEARCH
// ============================================================

export async function searchAll(query: string, limit = 10) {
  const [peribahasa, klasik] = await Promise.all([
    searchPeribahasa(query, limit),
    fetchFromTable<BahasaKlasikRow>("bahasa_klasik", {
      search: query,
      searchColumn: "phrase",
      limit,
    }),
  ]);

  return {
    peribahasa,
    bahasa_klasik: klasik,
  };
}