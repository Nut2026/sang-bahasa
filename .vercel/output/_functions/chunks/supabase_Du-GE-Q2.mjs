import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dtixhzmuvmvpuepkgueb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0aXhoem11dm12cHVlcGtndWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyODcxODAsImV4cCI6MjA5Mjg2MzE4MH0.4LwxBnxwRani99MGJcY-iWRVYfgcHxuGm0hvVhvYRf0";
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  return supabase;
}
async function fetchFromTable(table, filters) {
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
      ascending: filters.order.ascending ?? true
    });
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset !== void 0) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit ?? 20) - 1
    );
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`[Supabase:${table}] ${error.message}`);
  }
  return data ?? [];
}
const FETCH_ALL_BATCH_SIZE = 1e3;
const FETCH_CACHE_TTL_MS = 10 * 60 * 1e3;
const fetchCache = /* @__PURE__ */ new Map();
function cacheKey(table, filters) {
  return `${table}:${JSON.stringify(filters ?? {})}`;
}
async function fetchAllFromTable(table, filters) {
  const key = cacheKey(table, filters);
  const hit = fetchCache.get(key);
  if (hit && hit.expiry > Date.now()) {
    return hit.data;
  }
  const rows = [];
  let offset = 0;
  while (true) {
    const batch = await fetchFromTable(table, {
      ...filters,
      limit: FETCH_ALL_BATCH_SIZE,
      offset
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
async function getAllPeribahasa(options) {
  {
    return fetchAllFromTable("peribahasa", {
      order: { column: "phrase", ascending: true }
    });
  }
}
async function getPeribahasaBySlug(slug) {
  const client = getSupabaseClient();
  const { data, error } = await client.from("peribahasa").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    throw new Error(`[Supabase:peribahasa] ${error.message}`);
  }
  return data;
}
async function getPeribahasaByCategory(category, limit = 20, offset = 0) {
  return fetchFromTable("peribahasa", {
    eq: { column: "category", value: category },
    limit,
    offset,
    order: { column: "phrase", ascending: true }
  });
}
async function getAllBahasaKlasik(options) {
  {
    return fetchAllFromTable("bahasa_klasik", {
      order: { column: "phrase", ascending: true }
    });
  }
}
async function getBahasaKlasikBySlug(slug) {
  const client = getSupabaseClient();
  const { data, error } = await client.from("bahasa_klasik").select("*").eq("slug", slug).maybeSingle();
  if (error) {
    throw new Error(`[Supabase:bahasa_klasik] ${error.message}`);
  }
  return data;
}
async function getBahasaKlasikByCategory(category, limit = 20, offset = 0) {
  return fetchFromTable("bahasa_klasik", {
    eq: { column: "category", value: category },
    limit,
    offset,
    order: { column: "phrase", ascending: true }
  });
}

export { getAllBahasaKlasik as a, getSupabaseClient as b, getBahasaKlasikBySlug as c, getBahasaKlasikByCategory as d, getPeribahasaBySlug as e, getPeribahasaByCategory as f, getAllPeribahasa as g };
