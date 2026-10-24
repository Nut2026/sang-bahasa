# Sang Bahasa

Sang Bahasa ialah kamus peribahasa dan bahasa klasik Melayu yang memfokuskan carian pantas, paparan yang kemas, dan kandungan sepenuhnya dalam Bahasa Melayu.

## Jalankan Secara Tempatan

### Frontend

```bash
npm install
npm run dev
```

### Pembolehubah persekitaran

Salin `.env.example` ke `.env` dan isi nilai yang sepadan:

```bash
cp .env.example .env
```

Nilai yang diperlukan:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_SITE_URL` (pilihan, digunakan untuk sitemap dan URL kanonik)

### Binaan statik

```bash
npm run build
npm run preview
```

Binaan statik biasanya dijana dengan `npm run build`. Semak `astro.config.mjs` untuk konfigurasi laman dan sitemap.
