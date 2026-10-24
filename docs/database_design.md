# Sang Bahasa - Database Design

## Jadual `peribahasa`

| Kolum | Jenis | Nota |
|---|---|---|
| `id` | UUID | Primary key |
| `phrase` | TEXT | Peribahasa |
| `slug` | TEXT | Pengenal URL unik |
| `meaning_ms` | TEXT | Maksud dalam Bahasa Melayu |
| `example_ms` | TEXT | Contoh penggunaan |
| `category` | ENUM | Kategori peribahasa |
| `tags` | TEXT[] | Tag carian |
| `meta_title_ms` | TEXT | Tajuk SEO |
| `meta_description_ms` | TEXT | Penerangan SEO |
| `search_vector` | TSVECTOR | Medan FTS |
| `is_published` | BOOLEAN | Status terbit |
| `is_featured` | BOOLEAN | Status pilihan |
| `created_at` | TIMESTAMPTZ | Tarikh cipta |
| `updated_at` | TIMESTAMPTZ | Tarikh kemas kini |

## Jadual `categories`

Semua nama dan keterangan kategori disimpan dalam Bahasa Melayu.

## Carian

`search_vector` dibina daripada:

- `phrase`
- `meaning_ms`
- `example_ms`

Pendekatan ini memastikan carian kekal fokus pada kandungan Bahasa Melayu.
