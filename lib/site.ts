/**
 * Data inti situs Jamu Bu Ranti.
 * Sumber: proposal "Rancangan Corporate Website Jamu Bu Ranti".
 * Nilai bertanda [ISI: ...] belum ada datanya, lihat TODO_KONTEN.md.
 * Di Fase 3 nilai ini akan dibaca dari tabel `site_settings` (Supabase).
 */

export const site = {
  nama: "Jamu Bu Ranti",
  tagline: "Nikmat Rasanya, Terjaga Khasiatnya",
  deskripsi:
    "Jamu tradisional racikan keluarga dari Semarang, diwariskan tiga generasi. Pesan mudah lewat WhatsApp dan ojek online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jamuburanti.com",
  whatsapp: {
    tampil: "0856-4010-1163",
    internasional: "6285640101163",
  },
  instagram: {
    akun: "@jamuburanti",
    url: "https://www.instagram.com/jamuburanti",
  },
  // Belum ada datanya. null = ikon/tautan tidak ditampilkan.
  tiktokUrl: null as string | null, // [ISI: link TikTok]
  facebookUrl: null as string | null, // [ISI: link Facebook]
  email: null as string | null, // [ISI: email resmi]
  // Nama toko di aplikasi ojol: "Jamu Bu Ranti". Tautan langsungnya belum ada.
  ojol: [
    { nama: "GoFood", url: null as string | null }, // [ISI: link GoFood]
    { nama: "GrabFood", url: null as string | null }, // [ISI: link GrabFood]
    { nama: "ShopeeFood", url: null as string | null }, // [ISI: link ShopeeFood]
  ],
  mapsQuery:
    "Jl. Taman Semeru II No. 23, Karangrejo, Gajahmungkur, Kota Semarang",
  alamat:
    "Jl. Taman Semeru II No. 23, RT 5/RW 4, Kel. Karangrejo, Kec. Gajahmungkur, Kota Semarang",
  jamBuka: {
    teks: "Setiap hari, 07.00–21.00 WIB",
    buka: 7,
    tutup: 21,
  },
} as const;

export type ItemMenu = { label: string; href: string };

/** Sitemap final (7 menu). Jangan diubah. */
export const menuUtama: ItemMenu[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Produk", href: "/produk" },
  { label: "Berita", href: "/berita" },
  { label: "Galeri", href: "/galeri" },
  { label: "Testimoni", href: "/testimoni" },
  { label: "Kontak", href: "/kontak" },
];

export const disclaimer =
  "Jamu adalah minuman tradisional, bukan pengganti obat atau anjuran dokter. Konsultasikan dengan tenaga kesehatan bila memiliki kondisi medis tertentu.";
