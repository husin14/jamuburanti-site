import { foto, type Foto } from "./foto";

/**
 * Galeri dokumentasi asli Jamu Bu Ranti.
 * Kategori tanpa foto otomatis disembunyikan dari filter (lihat TODO_KONTEN.md:
 * foto Aktivitas Produksi & Pameran UMKM belum ada).
 */

export const kategoriGaleri = [
  "Produk & Kemasan",
  "Hampers & Paket",
  "Aktivitas Produksi",
  "Pameran UMKM",
  "Pelanggan & Promosi",
] as const;

export type KategoriGaleri = (typeof kategoriGaleri)[number];

export type ItemGaleri = {
  id: string;
  kategori: KategoriGaleri;
  judul: string;
  foto: Foto;
};

export const galeri: ItemGaleri[] = [
  {
    id: "temulawak",
    kategori: "Produk & Kemasan",
    judul: "Temulawak segar, kuningnya alami",
    foto: foto.temulawak,
  },
  {
    id: "kemasan-1",
    kategori: "Produk & Kemasan",
    judul: "Tiga ukuran: 1 liter, 500 ml, dan 250 ml",
    foto: foto.kemasan1,
  },
  {
    id: "hampers-natal-4",
    kategori: "Hampers & Paket",
    judul: "Hampers Natal & Tahun Baru, isi 4 botol",
    foto: foto.hampersNatal4,
  },
  {
    id: "tas-taman",
    kategori: "Hampers & Paket",
    judul: "Paket jamu dengan tas anyaman",
    foto: foto.tasTaman,
  },
  {
    id: "jahe-merah",
    kategori: "Produk & Kemasan",
    judul: "Jahe Merah, hangat untuk sore hari",
    foto: foto.jaheMerah,
  },
  {
    id: "hampers-ramadan-4",
    kategori: "Hampers & Paket",
    judul: "Hampers Ramadan, isi 4 botol 250 ml",
    foto: foto.hampersRamadan4,
  },
  {
    id: "traveling",
    kategori: "Pelanggan & Promosi",
    judul: "Jamu Bu Ranti ikut jalan-jalan",
    foto: foto.traveling,
  },
  {
    id: "kunir-asem-1l",
    kategori: "Produk & Kemasan",
    judul: "Kunir Asem kemasan 1 liter",
    foto: foto.kunirAsem1L,
  },
  {
    id: "tas-danau",
    kategori: "Hampers & Paket",
    judul: "Bekal jamu untuk piknik di taman",
    foto: foto.tasDanau,
  },
  {
    id: "hampers-natal-campur",
    kategori: "Hampers & Paket",
    judul: "Hampers Natal dengan botol & pouch",
    foto: foto.hampersNatalCampur,
  },
  {
    id: "tas-hijau",
    kategori: "Hampers & Paket",
    judul: "Pouch 1 liter siap untuk keluarga",
    foto: foto.tasHijau,
  },
  {
    id: "kemasan-2",
    kategori: "Produk & Kemasan",
    judul: "Kemasan baru dengan label khas Bu Ranti",
    foto: foto.kemasan2,
  },
  {
    id: "hampers-ramadan-2",
    kategori: "Hampers & Paket",
    judul: "Hampers Ramadan isi 2 botol besar",
    foto: foto.hampersRamadan2,
  },
  {
    id: "tas-rumput",
    kategori: "Hampers & Paket",
    judul: "Paket jamu & tas anyaman",
    foto: foto.tasRumput,
  },
  {
    id: "tas-senja",
    kategori: "Hampers & Paket",
    judul: "Teman santai sore hari",
    foto: foto.tasSenja,
  },
];
