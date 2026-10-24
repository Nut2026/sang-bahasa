# Sang Bahasa - Seni Bina Sistem

## Ringkasan

- `frontend/`: Astro untuk halaman awam dan admin
- `backend/`: FastAPI untuk API carian, entri, sitemap, dan admin
- `database/`: skema PostgreSQL dan seed data

## Aliran Carian

1. Pengguna menaip pada komponen `SearchBar`
2. Frontend memanggil `GET /api/search/suggestions`
3. Halaman carian memanggil `GET /api/search`
4. Jika tiada padanan tepat, frontend memanggil `GET /api/search/similar`

## Fokus Kandungan

Sang Bahasa kini menyimpan dan memaparkan kandungan Bahasa Melayu sahaja.
