# Website Jamu Bu Ranti

Corporate website Jamu Bu Ranti (UMKM jamu tradisional, Semarang).
"Nikmat Rasanya, Terjaga Khasiatnya".

Dibuat dengan Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Supabase.

## Menjalankan di komputer

Butuh Node.js 20 atau lebih baru.

```bash
npm install
cp .env.example .env.local   # Windows (PowerShell): copy .env.example .env.local
npm run dev                  # buka http://localhost:3000
```

Tanpa isian Supabase di `.env.local`, website tetap jalan memakai data statis di `lib/data/`.

Pemeriksaan sebelum lanjut fase berikutnya:

```bash
npm run build
npm run lint
```

## Database (Supabase)

1. Buat project di [supabase.com](https://supabase.com) (region Singapore).
   Matikan *Automatically expose new tables*; hak akses sudah diatur di skrip.
2. Buka **SQL Editor → New query**, tempel seluruh isi `supabase/pasang-sekaligus.sql`, lalu **Run**.
   (Isinya = `supabase/migrations/…_skema_awal.sql` + `supabase/seed.sql`. Cukup dijalankan sekali.)
3. Opsional untuk presentasi: jalankan `supabase/seed-contoh-testimoni.sql` (testimoni contoh berlabel "Contoh").
   Hapus sebelum go-live: `delete from public.testimonials where is_sample;`
4. Isi `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project Settings → Data API)
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Project Settings → API Keys, `sb_publishable_…`)

Jangan pernah membagikan *secret key* atau password database.

### Struktur data

| Tabel | Isi | Akses pengunjung |
|---|---|---|
| `products` | 20 jamu + desain botol (`visual`) | baca yang terbit |
| `articles` | artikel internal & liputan media | baca yang terbit |
| `gallery` | foto dokumentasi | baca yang terbit |
| `testimonials` | ulasan pelanggan | baca yang disetujui; kirim (selalu menunggu persetujuan) |
| `promos` | banner promo (default: hampers) | baca yang aktif |
| `messages` | pesan form kontak | hanya kirim |
| `site_settings` | link ojol, sosmed, email | baca |
| `admins` | daftar admin (Fase 4) | tidak ada |

Semua tabel memakai Row Level Security. Anti-spam ada di dua lapis: pembatas per IP di server
dan trigger database (`batasi_pesan`, `batasi_testimoni`).

Halaman dirender statis dan diperbarui otomatis tiap 5 menit dari database.

## Panel admin

Buka `/admin`. Menambah admin:

1. Supabase → **Authentication → Users → Add user → Create new user** (centang *Auto Confirm User*).
2. Jalankan `supabase/tambah-admin.sql` di SQL Editor (ganti email-nya).
3. Disarankan: **Authentication → Sign In / Providers** → matikan *Allow new users to sign up*.

Lupa kata sandi: reset dari Authentication → Users.

## Status pengerjaan

- [x] Fase 1: Setup, design tokens, layout global, 404
- [x] Fase 2: Halaman publik + foto dokumentasi asli
- [x] Fase 3: Supabase (database, RLS, form kontak & testimoni)
- [x] Fase 4: Panel admin (`/admin`)
- [ ] Fase 5: SEO, performa, aksesibilitas
- [ ] Fase 6: Uji & deploy ke Vercel

## Dokumen pendukung

- `TODO_KONTEN.md`: data yang masih harus diisi (email, tautan ojol, foto, harga, dsb.)
- `CATATAN_AI.md`: catatan bagian buatan AI dan keputusan manusia (untuk presentasi UTS)
