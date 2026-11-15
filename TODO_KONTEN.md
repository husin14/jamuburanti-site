# TODO Konten: data yang masih harus diisi

Semua data di bawah ini **belum tersedia** dan tidak boleh dikarang. Di website, bagian ini
disembunyikan atau diberi tanda `[ISI: ...]` sampai datanya ada.

> Sejak Fase 3, link ojol, email, TikTok, Facebook, dan Instagram diisi di tabel
> `site_settings` (Supabase → Table Editor), tidak perlu mengubah kode.

## Kontak & tautan
- [ ] `[ISI: email resmi]` (proposal menulis "www.jamuburanti.com", itu domain, bukan email) → `lib/site.ts` › `email`
- [ ] `[ISI: link TikTok]` → `lib/site.ts` › `tiktokUrl` (ikon footer muncul otomatis setelah diisi)
- [ ] `[ISI: link Facebook]` → `lib/site.ts` › `facebookUrl`
- [ ] `[ISI: link GoFood]`, `[ISI: link GrabFood]`, `[ISI: link ShopeeFood]` (dipakai mulai Fase 2)
- [ ] Pastikan URL Instagram benar: `https://www.instagram.com/jamuburanti`

## Aset visual
- [x] **Logo asli** Jamu Tradisional Bu Ranti terpasang (`public/images/logo/logo-jamu-bu-ranti.png`, PNG transparan) + ikon tab browser (`app/icon.png`, `app/apple-icon.png`).
- [ ] Opsional: file logo vektor (SVG/AI) dari desainer, agar tajam di semua ukuran & bisa dicetak.
- [ ] Foto produk **Beras Kencur** (satu-satunya produk terlaris yang belum punya foto sendiri).

## Produk (dipakai mulai Fase 2)
- [ ] Harga per produk (sementara ditampilkan "Mulai Rp6 ribu")
- [ ] Komposisi bahan tiap produk
- [ ] Ukuran kemasan tiap produk
- [ ] Isi dan harga tiap paket hampers (yang diketahui baru rentang Rp40–90 ribu)

## Berita (dipakai mulai Fase 2)
- [ ] `[ISI: tanggal]` terbit artikel Kompasiana, Espos, dan Times Indonesia
- [ ] Judul resmi artikel Times Indonesia (slug URL-nya tidak memuat judul)

- [ ] Cek ulang video `NLUoiAHZvms`: judul aslinya di YouTube tertulis "Jamu Tradisional bu **Kanti**". Pastikan video ini memang tentang Jamu Bu Ranti (sementara ditampilkan sebagai "Jamu Tradisional - Segmen 4" di `lib/data/berita.ts`).
- [ ] Tanggal terbit artikel internal ("Dari Gendongan ke Digital", "Panduan memilih jamu"), sementara tidak ditampilkan.
- [x] Tanggal & judul liputan media sudah diisi dari halaman aslinya (Espos 4 Jul 2026, Kompasiana 20 Jun 2026, Udinus 19 Mar 2026 & 5 Jan 2023, TIMES 10 Jan 2022).

## Galeri & foto
- [x] 15 foto dokumentasi asli sudah dipasang (`public/images/foto/`, katalog di `lib/data/foto.ts`).
- [ ] Foto **Aktivitas Produksi** dan **Pameran UMKM** belum ada (kategorinya otomatis tersembunyi sampai ada foto).
- [ ] Foto produk satuan baru ada untuk Kunir Asem, Temulawak, dan Jahe Merah. 17 produk lain masih memakai ilustrasi botol.
- [ ] Konfirmasi: foto "Paket Free Bag" = paket jamu dengan bonus tas anyaman? Bila ya, isi syarat & harganya (sementara hanya ditampilkan di galeri).
- [ ] Konfirmasi ukuran kemasan yang tersedia per varian (foto menunjukkan 250 ml, 500 ml, 1 liter).

## Testimoni
- [ ] **8 TESTIMONI DI `lib/data/testimoni.ts` ADALAH CONTOH (DUMMY)** atas permintaan pemilik project, untuk keperluan desain/presentasi. Nama dan ulasannya karangan. Di website sudah diberi label "Contoh" + keterangan. **Wajib dihapus atau diganti testimoni asli sebelum website dipublikasikan.**
- [ ] Testimoni asli akan masuk lewat form dan disetujui admin (Fase 3).
