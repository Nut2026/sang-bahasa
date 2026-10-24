# Sang Bahasa - API Reference

Base URL pembangunan: `http://localhost:8000`

## Endpoints Utama

### `GET /health`

Memulangkan status aplikasi.

### `GET /api/search`

Parameter:

- `q`: teks carian
- `category`: penapis kategori
- `page`
- `page_size`

Respons:

```json
{
  "query": "alah bisa",
  "total": 1,
  "page": 1,
  "page_size": 20,
  "results": [
    {
      "id": "uuid",
      "phrase": "Alah bisa, tegal biasa",
      "slug": "alah-bisa-tegal-biasa",
      "meaning_ms": "Sesuatu yang sukar akan menjadi mudah apabila sudah biasa dilakukan.",
      "category": "nasihat",
      "tags": ["kebiasaan", "latihan", "tabah"],
      "is_featured": true
    }
  ]
}
```

### `GET /api/search/suggestions`

Cadangan masa nyata untuk bar carian.

### `GET /api/search/similar`

Cadangan peribahasa yang hampir sama apabila tiada padanan tepat.

### `GET /api/entries`

Senarai entri diterbitkan dengan paginasi.

### `GET /api/entries/{slug}`

Butiran penuh sesuatu entri.

### `GET /api/entries/featured`

Senarai entri pilihan.

### `GET /api/entries/random`

Senarai entri rawak.

### `GET /api/sitemap`

Data slug untuk penjanaan sitemap.

### `GET /api/sitemap/categories`

Metadata kategori dalam Bahasa Melayu.

### `GET /api/admin/entries`
### `POST /api/admin/entries`
### `PUT /api/admin/entries/{id}`
### `DELETE /api/admin/entries/{id}`

Semua endpoint admin memerlukan header `X-Admin-Token`.
