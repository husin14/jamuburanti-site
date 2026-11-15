# Catatan Penggunaan AI

Dokumen ini mencatat bagian mana yang dibuat dengan bantuan AI (Claude) dan bagian mana yang
merupakan keputusan manusia. Dipakai untuk presentasi UTS Cyber PR.

## Keputusan manusia (dari proposal & brief)
- Konsep usaha, nama, tagline, target audiens, domain.
- Struktur 7 menu: Beranda, Tentang Kami, Produk, Berita, Galeri, Testimoni, Kontak.
- Seluruh fakta: sejarah, visi, misi, daftar produk dan khasiat, rentang harga, alamat, nomor WhatsApp, jam buka, tautan liputan media dan video.
- Arah desain "Warisan Nenek, Gaya Masa Kini", palet warna, dan pilihan font (Fraunces + Plus Jakarta Sans).
- Pilihan teknologi: Next.js, Tailwind CSS, Supabase, Vercel.
- Tindakan utama situs: "Pesan via WhatsApp".

## Dibuat dengan bantuan AI

### Fase 1: Setup (14 November 2026)
- Kerangka project Next.js (App Router) + TypeScript + Tailwind, ditulis manual oleh AI (tanpa `create-next-app`).
- Design tokens di `tailwind.config.ts` (warna, font, bentuk blob, bayangan, animasi) dan gaya dasar di `app/globals.css` (tekstur grain, fokus keyboard, dukungan `prefers-reduced-motion`).
- Komponen layout: `Navbar` (sticky, menu mobile layar penuh), `Footer`, `TombolWaMelayang` (tombol melayang + bottom bar ponsel).
- Komponen UI: `Logo` sementara (wordmark + ikon lumpang SVG), `Tombol`, ikon & ornamen SVG (daun, rimpang, WhatsApp, Instagram, TikTok, Facebook) digambar sendiri oleh AI.
- Helper `buildWaLink` dan templat pesan WhatsApp.
- Halaman 404 kustom dan section Hero Beranda (ilustrasi botol SVG sebagai placeholder foto produk).
- Teks UI pendukung (mis. "Wah, gelasnya kosong." di halaman 404, label tombol, teks alternatif).

### Keputusan teknis yang diambil AI (perlu diketahui manusia)
| Keputusan | Alasan |
|---|---|
| ~~Tailwind CSS v3 (bukan v4)~~ Diganti ke v4, lihat "Upgrade paket" | Keputusan awal: konfigurasi token lewat `tailwind.config.ts` lebih mapan dan mudah dijelaskan. |
| Ikon merek digambar sendiri sebagai SVG | Pustaka `lucide-react` tidak lagi menyediakan ikon merek. |
| Di ponsel, akses WhatsApp memakai bottom bar; tombol bulat melayang hanya di tablet/desktop | Menghindari dua tombol WhatsApp bertumpuk di layar kecil. |
| Ikon TikTok & Facebook disembunyikan sampai tautannya diisi | Tidak boleh ada tombol mati atau tautan karangan. |
| Framer Motion belum dipasang; animasi Fase 1 memakai CSS | Cukup untuk animasi sederhana; Framer Motion ditambahkan di Fase 2 bila perlu. |
| Klaim khasiat memakai framing "secara tradisional dipercaya..." + disclaimer | Menghindari klaim medis (mengobati/menyembuhkan). |
| Mockup lama ("sejak 1960", 0812-3456-7890, Jl. Melati No. 10) diabaikan | Itu data contoh; yang dipakai adalah data proposal. |

### Upgrade paket ke versi terbaru (14 November 2026)
Keputusan manusia: semua paket di-update ke versi mayor terbaru. Pelaksanaan migrasi oleh AI.

| Paket | Sebelum | Sesudah |
|---|---|---|
| next, eslint-config-next | 15.5 | 16.4.6 |
| react, react-dom | 19.1 | 19.3.1 |
| tailwindcss | 3.4 | 4.3.5 (+ `@tailwindcss/postcss`) |
| eslint | 9.39 | 10.15.0 |
| typescript | 5.9 | 6.0.3 |
| lucide-react | 0.460 | 1.73.0 |
| @types/node | 22 | 26 |

Perubahan kode akibat upgrade:
- Design tokens pindah dari `tailwind.config.ts` (dihapus) ke blok `@theme` di `app/globals.css`. Nilai warna, font, blob, bayangan, dan animasi tidak berubah.
- `.wadah` sekarang ditulis sebagai `@utility wadah`.
- `postcss.config.mjs` memakai `@tailwindcss/postcss`; `autoprefixer` dihapus (sudah bawaan Tailwind 4).
- `eslint.config.mjs` memakai config flat bawaan `eslint-config-next` 16; `@eslint/eslintrc` dihapus.
- Class `backdrop-blur` diganti `backdrop-blur-sm` (nama skala blur berubah di Tailwind 4, nilainya tetap 8px).
- `tsconfig.json` disesuaikan otomatis oleh Next 16 (`jsx: react-jsx`).

| Keputusan AI | Alasan |
|---|---|
| TypeScript 6.0.3, bukan 7.0.2 | `typescript-eslint` (dipakai `eslint-config-next`) belum mendukung TS 7, sehingga lint gagal total. |
| ESLint 10 tetap dipakai | Plugin bawaan Next secara resmi baru mendukung ESLint 9 (muncul peringatan `ERESOLVE`), tapi lint terbukti berjalan normal. |

Perbaikan tampilan setelah dicek di browser (360px, 768px, 1024px, desktop):
| Masalah | Penyebab | Perbaikan |
|---|---|---|
| Di ponsel, tombol "Pesan Sekarang" muncul di header dan logo patah tiga baris | Tailwind 4 mengubah urutan CSS, sehingga `inline-flex` dari gaya dasar tombol mengalahkan `hidden` | `cn()` di `lib/utils/cn.ts` kini memakai `tailwind-merge` agar kelas yang ditulis belakangan selalu menang |
| Menu hamburger terbuka tapi panelnya tidak terlihat (tinggi 0) | `backdrop-blur` pada `<header>` membuat menu `position: fixed` terkurung setinggi header. Kemungkinan sudah ada sejak Fase 1 | Efek blur dipindah ke lapisan latar terpisah di dalam header |
| Di lebar 1024px, menu "Tentang Kami", logo, dan tombol "Pesan Sekarang" patah dua baris | Ruang header sempit | `whitespace-nowrap`, ukuran teks/padding menu sedikit lebih kecil di bawah 1280px |

### Fase 2: Halaman publik dengan data statis (14 November 2026)
Keputusan manusia (permintaan pemilik project):
- Produk "didesainkan semaksimal mungkin" selama foto asli belum ada.
- Berita dikumpulkan dari pencarian dengan kata kunci "jamu bu ranti berita semarang".
- Testimoni memakai data **dummy** dengan nama Indonesia acak.

Dibuat dengan bantuan AI:
- 7 halaman publik + detail produk (20 halaman) + detail artikel (2 halaman), semua dirender statis.
- Data statis di `lib/data/`: kategori, produk, berita, testimoni, galeri.
- **Desain produk**: ilustrasi botol SVG (`components/produk/BotolJamu.tsx`) dengan warna cairan sesuai jamunya, label bermerek, dan 7 ilustrasi bahan buatan sendiri (rimpang, daun, sirih, bunga, sereh, asam, beras) di `IlustrasiBahan.tsx`. Kombinasi warna & bahan tiap produk adalah keputusan desain AI, ditebak dari nama racikan, bukan komposisi resmi.
- Filter "Cari Jamu Sesuai Kebutuhanmu" + pencarian nama, tautan `?kategori=` bisa dibagikan.
- **Berita**: Google memblokir pencarian otomatis (CAPTCHA), sehingga pencarian dilakukan lewat mesin pencari web dengan kata kunci yang sama. Ditemukan 5 artikel yang membahas Jamu Bu Ranti (Espos, Kompasiana, Udinus ×2, TIMES Indonesia). Judul, tanggal, dan penulis diambil dari halaman aslinya; ringkasan ditulis ulang oleh AI dan kartu menautkan ke sumber. Sampul memakai ilustrasi, bukan foto media (hak cipta). 2 artikel internal ditulis AI hanya dari fakta proposal & data produk.
- 3 video YouTube dengan embed ringan (thumbnail dulu, iframe youtube-nocookie saat diklik).
- **Testimoni dummy**: 8 nama & ulasan karangan AI, ditandai "Contoh" di website, tanpa klaim medis.
- Galeri masonry + lightbox (panah, swipe, keyboard, fokus kembali), isinya placeholder ilustrasi.
- Kontak: Google Maps embed, "Buka sekarang/Tutup" berbasis WIB, form pesan dengan validasi + honeypot yang (sementara) meneruskan pesan ke WhatsApp.
- Form testimoni dengan rating bintang 3 aspek + persetujuan; belum menyimpan (mode pratinjau, ditulis jelas di pesan sukses).
- Animasi muncul-saat-scroll dengan Motion (Framer Motion), otomatis tanpa gerak geser bila pengguna memilih "kurangi gerakan".

| Keputusan AI | Alasan |
|---|---|
| Testimoni dummy diberi label "Contoh" | Menampilkan ulasan karangan sebagai ulasan asli menyesatkan calon pembeli; label mudah dihapus bersama datanya nanti. |
| Form kontak diteruskan ke WhatsApp dulu | Database baru ada di Fase 3; dengan cara ini form sudah berguna dan jujur. |
| Chip GoFood/GrabFood/ShopeeFood tanpa tautan | Link toko belum ada; ditampilkan sebagai ajakan mencari "Jamu Bu Ranti" di aplikasi, bukan tombol mati. Otomatis jadi tautan saat URL diisi di `lib/site.ts`. |
| Label "Varian Baru" untuk Rosella & Sereh Telang | Artikel Udinus menyebut keduanya sebagai varian yang ditambahkan. |
| Fakta tambahan dari berita (omzet, 1970-an, ratusan pesanan) tidak dimasukkan ke halaman Tentang | Halaman Tentang tetap memakai data proposal; fakta media hanya muncul sebagai ringkasan artikel bersumber. |
| Thumbnail YouTube `unoptimized` | Gambar kecil dari CDN YouTube; tidak perlu diproses ulang server. |

### Fase 2 revisi: foto dokumentasi asli (14 November 2026)
Keputusan manusia: memakai 15 foto dari folder "FOTO PRODUK JAMU BU RANTI" dan mengemasnya dengan menarik.

Dibuat dengan bantuan AI:
- Foto diperkecil (maks. 1600px), diputar sesuai orientasi, dan **metadata EXIF/GPS dihapus** (privasi lokasi), disimpan di `public/images/foto/` dengan nama deskriptif. Foto asli tidak diubah.
- Katalog `lib/data/foto.ts` dengan import statis (placeholder blur, AVIF/WebP, ukuran responsif otomatis) dan alt text deskriptif untuk setiap foto.
- Hero Beranda: komposisi foto Temulawak + Jahe Merah dengan lencana "Tanpa bahan pengawet" dan "3 generasi".
- Section baru Beranda "Menemani setiap momenmu" (mosaik 6 foto → Galeri).
- Kartu & detail produk Kunir Asem, Temulawak, Jahe Merah memakai foto asli; produk lain tetap ilustrasi botol.
- Section baru "Pilihan Kemasan" (250 ml, 500 ml, 1 liter) di halaman Produk + chip ukuran di detail produk.
- Paket Hampers: kolase foto hampers edisi Natal & Ramadan.
- Galeri: 15 foto asli, masonry mengikuti rasio asli, filter menampilkan jumlah foto, kategori kosong disembunyikan; kategori baru "Hampers & Paket".
- Tentang Kami: foto Kunir Asem 1 liter menggantikan ilustrasi.

| Fakta dari foto (bukan karangan) | Sumber |
|---|---|
| Label "Tanpa bahan pengawet" | Tercetak di label botol |
| Ukuran 250 ml, 500 ml, 1 liter (pouch & botol) | Tercetak di label / terlihat di foto studio |
| Hampers kotak kraft isi 2 & 4 botol, kartu Ramadan & Natal | Foto hampers |
| Hampers bisa campur varian | Label botol dalam satu hampers mencentang varian berbeda |

| Keputusan AI | Alasan |
|---|---|
| Keterangan tiap ukuran kemasan dibuat netral ("pas untuk sekali minum", dll.) | Tidak ada data daya tahan produk; klaim seperti "tahan 3 hari" dihindari. |
| Foto Jahe Merah dipakai untuk produk Jahe Merah | Label tulisan tangan menyebut Jahe Merah (kemungkinan varian dengan madu, perlu dikonfirmasi). |

### Fase 3: Supabase (14 November 2026)
Keputusan manusia: memakai Supabase (paket Free, region Singapore); membuat organisasi & project sendiri dan menjalankan SQL di dashboard.

Dibuat dengan bantuan AI:
- Skema database (`supabase/migrations/20261114000000_skema_awal.sql`): 7 tabel konten + `admins`, trigger `updated_at`, index, hak akses eksplisit, dan Row Level Security di semua tabel.
- Anti-spam dua lapis: pembatas per IP di server (`lib/utils/batas.ts`) + trigger database (maks. 3 pesan per kontak/10 menit, 2 ulasan per nama/jam, plus batas global per menit), ditambah honeypot dan cek waktu pengisian.
- Bucket Storage `public-images` (maks. 2 MB, hanya gambar; unggah khusus admin).
- `supabase/seed.sql` dibuat **otomatis oleh skrip** dari data Fase 2 agar isinya identik (20 produk, 7 artikel, 15 foto, promo hampers, pengaturan situs). Testimoni contoh dipisah ke file opsional.
- Lapisan data `lib/data/repo.ts`: membaca Supabase dengan cache bertag (segar tiap 5 menit, bisa disegarkan instan oleh admin di Fase 4); otomatis memakai data statis bila `.env.local` kosong.
- Form kontak & testimoni memakai Server Action (`app/(site)/actions.ts`) dengan validasi yang sama di browser dan server (`lib/validasi.ts`). Bila gagal tersimpan, form kontak menawarkan kirim lewat WhatsApp.
- Link GoFood/GrabFood/ShopeeFood, email, TikTok, Facebook, Instagram kini dibaca dari tabel `site_settings`.

| Keputusan AI | Alasan |
|---|---|
| Hanya memakai *publishable key* di website | Fase 3 tidak butuh kunci rahasia; semua akses dijaga RLS. Kunci rahasia baru dibutuhkan admin di Fase 4. |
| "Automatically expose new tables" dimatikan + GRANT eksplisit | Sesuai rekomendasi Supabase: akses tiap tabel ditulis jelas, bukan otomatis. |
| Harga disimpan dalam rupiah (bukan "ribu") | Lebih aman untuk input admin; tampilan tetap "Rp6 ribu". |
| Nomor WhatsApp & jam buka tetap di kode (`lib/site.ts`) | Dipakai di banyak komponen termasuk sisi browser; jarang berubah. Bisa dipindah ke database di Fase 4 bila perlu. |
| Testimoni contoh tidak masuk seed utama | Aturan project: tidak ada testimoni palsu di data asli. Disediakan file terpisah yang mudah dihapus. |

Bug yang ditemukan & diperbaiki saat pengujian Fase 3:
- Baris bintang form testimoni saling bertumpuk di layar ~1024px → diubah menjadi satu baris per aspek.
- Kolom waktu anti-bot ter-reset tiap form dirender ulang → kini diisi saat tombol kirim ditekan.

### Fase 4: Panel admin (15 November 2026)
Keputusan manusia: membuat akun admin `jamuburanti@gmail.com` sendiri di Supabase Auth dan mendaftarkannya sebagai admin.

Dibuat dengan bantuan AI:
- Login email + kata sandi (Supabase Auth, sesi di cookie lewat `@supabase/ssr`), tanpa pendaftaran publik. `proxy.ts` mengarahkan pengunjung tanpa login ke `/admin/login`.
- Hak admin diperiksa ulang di **setiap** halaman dan Server Action (`wajibAdmin()` di `lib/admin/auth.ts`), sesuai panduan keamanan Next.js 16, ditambah RLS `is_admin()` di database. Panel admin tidak memakai kunci rahasia.
- Menu: Ringkasan, Pesan Masuk (balas via WhatsApp/email, tandai dibaca, hapus), Testimoni (setujui/sembunyikan/hapus), Produk, Artikel, Galeri, Promo, Pengaturan.
- Form produk dengan pratinjau ilustrasi botol langsung, slug otomatis, dan pengingat framing khasiat tradisional.
- Unggah foto: dikompres di browser (maks. 1600px, WebP, ≤2 MB) lalu disimpan di Supabase Storage; alt text wajib.
- Setiap simpan langsung menyegarkan halaman publik terkait (`updateTag`).
- Konfirmasi sebelum hapus; label & pesan berbahasa Indonesia; panel tidak diindeks mesin pencari.

| Keputusan AI | Alasan |
|---|---|
| Tanpa kunci rahasia, semua aksi admin berjalan sebagai user login | Jika kode bocor, tidak ada kunci super yang ikut bocor; izin tetap dijaga RLS. |
| Pesan error login dibuat spesifik (belum dikonfirmasi / kata sandi salah / dibatasi) | Ditemukan saat pemilik pertama kali login dan gagal tanpa petunjuk. |
| Nomor WhatsApp, alamat, jam buka tetap di kode | Dipakai di banyak komponen; jarang berubah. |

### Logo resmi (15 November 2026)
Keputusan manusia: memakai logo "Jamu Tradisional Bu Ranti – The Pleasure Of Traditional Drink" (folder `logo jamu`, 2 varian).

| Keputusan AI | Alasan |
|---|---|
| Memakai varian latar krem, bukan varian "transparan" | Varian "transparan" ternyata JPEG dengan pola kotak-kotak yang ikut tercetak (bukan transparansi asli), sehingga akan terlihat di website. |
| Latar putih di luar lingkaran dibuat transparan dengan kunci warna, bukan dipotong bulat | Tagline lebih lebar dari lingkaran; potongan bulat memotong kata "The" dan "Drink". |
| Navbar: logo bulat + tulisan "Jamu Bu Ranti" | Pada tinggi 48–56 px, teks di dalam logo terlalu kecil dibaca. |
| Footer: logo besar di atas kartu krem | Tagline cokelat kurang kontras langsung di atas hijau tua. |
| Ikon tab browser hanya ilustrasi kunyit | Logo lengkap tidak terbaca di ukuran 16–32 px. |

## Status verifikasi
- Fase 1 + upgrade paket: `npm run build` dan `npm run lint` lolos tanpa error (14 November 2026).
- Tampilan Beranda, menu mobile, footer, dan 404 sudah dicek di browser pada 360px, 768px, 1024px, dan desktop; tidak ada scroll horizontal. Animasi hanya terverifikasi lewat CSS, karena komputer pengujian memakai pengaturan "kurangi gerakan".
- Fase 2: build (31 halaman statis) dan lint lolos. Semua halaman dicek di browser pada desktop dan ponsel 360px; tidak ada scroll horizontal. Filter produk, lightbox galeri, validasi form, peta, dan video sudah dicoba.
- Fase 2 revisi foto: build & lint lolos; Beranda, Produk, detail produk, Galeri (+ lightbox), dan Tentang dicek di desktop & ponsel 360px, tanpa scroll horizontal.
- Fase 3: build (31 halaman, data dari Supabase) & lint lolos. 13 uji keamanan sebagai pengunjung anonim lulus semua (baca konten ya; baca pesan, ubah/hapus/tambah produk, testimoni langsung disetujui: ditolak; anti-spam & validasi database bekerja). Form kontak dan testimoni diuji lewat browser dan terbukti tersimpan.
- Data uji yang tersisa di database (nama "UJI OTOMATIS"/"UJI BROWSER") bisa dihapus dengan `supabase/hapus-data-uji.sql`.
- Fase 4: build & lint lolos; tanpa login semua halaman admin diarahkan ke login (diuji); pemilik berhasil login dan membuka Ringkasan, Pesan, Produk, Artikel. **Belum diuji otomatis:** simpan/ubah/hapus data dan unggah foto dari panel.
- `npm audit`: tersisa 7 celah moderate pada `minimatch` (dependensi ESLint, hanya dipakai saat development). Belum ada versi perbaikan dari `@typescript-eslint`.
