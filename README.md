# Sang Bahasa

### Kamus Bahasa Melayu yang paling dekat di hati.

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-BC52EE.svg?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![Uses TypeScript](https://img.shields.io/badge/Uses-TypeScript-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Backend: Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000.svg?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com/)

## Tentang Sang Bahasa

Sang Bahasa ialah kamus peribahasa dan bahasa klasik Melayu yang memfokuskan carian pantas, paparan yang kemas, dan kandungan sepenuhnya dalam Bahasa Melayu. Setiap entri bukan sekadar senarai maksud — ia datang dengan contoh ayat, kategori, entri berkaitan dan laluan bacaan yang membolehkan anda terus melompat dari satu peribahasa ke peribahasa yang lain.

Matlamat saya membina Sang Bahasa adalah mudah: menjadikan rujukan bahasa Melayu sesuatu yang laju, tenang dan menyenangkan untuk dibuka berulang kali — sama ada anda sedang menyiapkan karangan, mengajar di kelas, atau sekadar ingin tahu maksud pepatah yang disebut nenek.

## Ciri-ciri

### Laman Utama
- Carian hero yang terus memberi cadangan sambil anda menaip
- **Tren Dunia Hari Ini**: entri yang paling banyak dibuka hari ini, dikira merentas peranti
- **Yang Terbaharu**: entri terbaru daripada kedua-dua kamus, digabungkan dan disusun mengikut tarikh
- **Cuba Kad Misteri**: lompat ke entri rawak lengkap dengan confetti

### Carian
- Cadangan langsung (autocomplete) dengan nyahduplikasi dan susunan "bermula dengan" didahulukan
- Enjin kedudukan tersendiri: padanan frasa, padanan maksud, token bertindih dan similariti trigram gaya `pg_trgm`
- Carian tahan silap: jika tiada padanan tepat, Sang Bahasa mencadangkan entri terdekat di bawah "Adakah anda mencari satu daripada ini?"
- Penapis kategori, penomboran halaman dan butang "Cari lagi" yang memfokus semula kotak carian

### Kamus
- Tiga pintu masuk: **Semua**, **Peribahasa** dan **Bahasa Klasik**
- Peribahasa dipecahkan kepada pepatah, bidalan dan perumpamaan; Bahasa Klasik menandakan entri klasik dan istana
- Penapis kategori dan jenis terus daripada kad entri
- Senarai sentiasa disusun mengikut abjad Melayu

### Halaman Entri
- Maksud, contoh ayat dan tarikh entri ditambah
- Untuk bahasa klasik: padanan **Bahasa Standard** dan ayat terjemahannya
- Butang **Salin** yang menyalin entri lengkap bersama kredit Sang Bahasa
- Navigasi entri sebelumnya/seterusnya mengikut susunan kamus
- Entri berkaitan daripada kategori yang sama

### Tren Dunia
- Kiraan harian yang disimpan dalam Supabase dan diset semula pada tengah malam waktu Malaysia
- Tiada akaun, tiada log masuk — hanya pengenal entri dan kiraan lawatan
- Digunakan di laman utama, pada halaman kamus, dan sebagai "juara" apabila carian langsung tidak menemui apa-apa

### Kandungan & Privasi
- Dasar Privasi, Penafian dan halaman Hubungi Kami sepenuhnya dalam Bahasa Melayu
- Emel hubungan yang boleh disalin dengan satu klik
- Borang Google untuk sumbangan perkataan baharu, cadangan, dan laporan ralat

### SEO & Prestasi
- Sitemap automatik dengan laluan carian dikecualikan
- Metadata kanonikal, Open Graph dan Twitter untuk setiap halaman
- Cache-control tersusun untuk `/kamus`, `/search` dan API cadangan
- Vercel Analytics dan Speed Insights

Semua kandungan disimpan dalam Supabase, jadi setiap lawatan melihat koleksi yang sama.

## Jalankan Secara Tempatan

### Keperluan
- Node.js 18 atau lebih baharu
- Projek Supabase dengan jadual `peribahasa`, `bahasa_klasik`, `categories` dan `tren_dunia`

### Persediaan

```bash
npm install
cp .env.example .env
```

Isi nilai dalam `.env`:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_SITE_URL` (pilihan, digunakan untuk sitemap dan URL kanonik)
- `PUBLIC_CONTACT_EMAIL` (pilihan, dipaparkan pada halaman Hubungi Kami)

Data permulaan dan polisi bacaan awam ada dalam folder `database/`:

```bash
database/seed/peribahasa.sql
database/seed/bahasa_klasik.sql
database/supabase_anon_select_policies.sql
database/tren_dunia_anon_policies.sql
```

### Pembangunan

```bash
npm run dev      # http://localhost:4321
```

### Binaan

```bash
npm run build
npm run preview
```

Binaan menggunakan adapter Vercel (`output: "server"`), jadi halaman kamus dan API dijana di pelayan. Semak `astro.config.mjs` untuk konfigurasi laman, sitemap dan aset.

## Hak Cipta & Kandungan

Semua kandungan dalam Sang Bahasa adalah hak milik pengendali tapak atau digunakan dengan izin. Sila rujuk halaman Penafian (`src/pages/penafian.astro`) untuk butiran penuh mengenai ketepatan maklumat, had liabiliti dan penggunaan kandungan.

## Hala Tuju

- [ ] Kamus Simpulan Bahasa sebagai kategori ketiga yang lengkap
- [ ] Mod gelap dan pilihan saiz fon untuk pembacaan yang lebih selesa
- [ ] Sejarah carian dan entri yang dibuka baru-baru ini pada peranti anda
- [ ] Laman kategori yang boleh dikongsi dengan senarai entri penuh
- [ ] Statistik tren mingguan dan bulanan, bukan hanya harian

Dan banyak lagi melalui eksperimen, maklum balas dan detik "oh, patutlah!" yang kecil.

## 🎉 Sokong Sang Bahasa

Jika anda rasa Sang Bahasa berguna, boleh:
- ⭐ Beri bintang pada repositori
- 🍴 Fork untuk meneroka dan menambah baik
- 👀 Watch untuk melihat kemas kini
- 📢 Kongsikan dengan rakan yang selalu tertanya-tanya maksud sesuatu peribahasa
- ✍️ Hantar perkataan baharu atau laporan ralat melalui halaman Hubungi Kami

---

> **Dibina dengan 💚 untuk bahasa Melayu — Sang Bahasa ~ Bangga cipta Malaysia**
