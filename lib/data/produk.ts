import type { KategoriSlug } from "./kategori";
import { foto, type Foto } from "./foto";

/**
 * Data produk statis (Fase 2). Di Fase 3 dipindah ke tabel `products` (Supabase).
 * Sumber nama, kategori, dan khasiat: proposal (skill Bagian 6).
 * Field bernilai null = datanya belum ada, lihat TODO_KONTEN.md. Jangan dikarang.
 *
 * `visual` adalah desain ilustrasi botol sementara (sampai foto produk asli tersedia):
 * warna cairan mengikuti warna jamunya, latar kartu versi pastelnya, dan ilustrasi
 * bahan utama yang tersirat dari nama racikan.
 */

export type JenisBahan =
  | "rimpang"
  | "daun"
  | "sirih"
  | "bunga"
  | "sereh"
  | "asam"
  | "beras";

export type Bahan = { jenis: JenisBahan; warna: string };

export type Produk = {
  slug: string;
  nama: string;
  kategori: KategoriSlug[];
  /** Satu baris untuk kartu produk. */
  ringkas: string;
  /** Khasiat versi website (framing tradisional, tanpa klaim medis). */
  khasiat: string;
  komposisi: string | null;
  ukuran: string | null;
  hargaMin: number | null;
  hargaMaks: number | null;
  /** Foto produk asli. null = pakai ilustrasi botol. */
  gambar: Foto | null;
  terlaris: boolean;
  baru: boolean;
  tersedia: boolean;
  visual: {
    cairan: string;
    latar: string;
    bahan: Bahan[];
  };
};

// Palet warna bahan ilustrasi
const W = {
  kunyit: "#E8A317",
  jahe: "#D9B27C",
  jaheMerah: "#C2562E",
  kencur: "#E6D3B0",
  temulawak: "#E2A02B",
  daun: "#3F7D4E",
  daunMuda: "#7FA35B",
  rosella: "#B83A3A",
  telang: "#4B5FB0",
  sereh: "#8DAA5B",
  asam: "#7A4A2A",
  beras: "#FBF6EC",
};

export const produk: Produk[] = [
  {
    slug: "kunir-asem",
    nama: "Kunir Asem",
    kategori: ["kewanitaan"],
    ringkas: "Segar asam-manis, teman saat datang bulan.",
    khasiat:
      "Dipercaya membantu meredakan nyeri haid, melancarkan siklus haid, dan teman diet alami.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: foto.kunirAsem1L,
    terlaris: true,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#F2B632",
      latar: "#FBEBC0",
      bahan: [
        { jenis: "rimpang", warna: W.kunyit },
        { jenis: "asam", warna: W.asam },
      ],
    },
  },
  {
    slug: "beras-kencur",
    nama: "Beras Kencur",
    kategori: ["pegal-bugar", "keluarga"],
    ringkas: "Manis hangat, bikin badan segar lagi.",
    khasiat:
      "Menambah nafsu makan, menghangatkan saat flu dan batuk, serta menghilangkan rasa lelah.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: true,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#EFE1C2",
      latar: "#F6EEDD",
      bahan: [
        { jenis: "beras", warna: W.beras },
        { jenis: "rimpang", warna: W.kencur },
      ],
    },
  },
  {
    slug: "temulawak",
    nama: "Temulawak",
    kategori: ["daya-tahan", "pencernaan"],
    ringkas: "Antioksidan, menjaga pencernaan tetap nyaman.",
    khasiat:
      "Antioksidan; dipercaya membantu menjaga kesehatan pencernaan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: foto.temulawak,
    terlaris: true,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#E2A02B",
      latar: "#F8E7C4",
      bahan: [
        { jenis: "rimpang", warna: W.temulawak },
        { jenis: "daun", warna: W.daun },
      ],
    },
  },
  {
    slug: "jahe-merah",
    nama: "Jahe Merah",
    kategori: ["pencernaan"],
    ringkas: "Hangat pedas, pas untuk masuk angin.",
    khasiat:
      "Menghangatkan tubuh; dipercaya membantu meredakan pusing, masuk angin, dan pegal.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: foto.jaheMerah,
    terlaris: true,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#C2562E",
      latar: "#F6DCCF",
      bahan: [
        { jenis: "rimpang", warna: W.jaheMerah },
        { jenis: "daun", warna: W.daun },
      ],
    },
  },
  {
    slug: "rosella",
    nama: "Rosella",
    kategori: ["daya-tahan"],
    ringkas: "Merah segar kaya antioksidan.",
    khasiat:
      "Kaya antioksidan; secara tradisional dipercaya membantu menjaga tekanan darah dan kolesterol, serta teman diet alami.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: true,
    tersedia: true,
    visual: {
      cairan: "#B83A3A",
      latar: "#F6D9D6",
      bahan: [
        { jenis: "bunga", warna: W.rosella },
        { jenis: "daun", warna: W.daun },
      ],
    },
  },
  {
    slug: "sereh-telang",
    nama: "Sereh Telang",
    kategori: ["daya-tahan"],
    ringkas: "Biru cantik dengan wangi sereh.",
    khasiat:
      "Antioksidan; dipercaya membantu menjaga kolesterol dan mengurangi peradangan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: true,
    tersedia: true,
    visual: {
      cairan: "#4B5FB0",
      latar: "#DCE1F4",
      bahan: [
        { jenis: "bunga", warna: W.telang },
        { jenis: "sereh", warna: W.sereh },
      ],
    },
  },
  {
    slug: "jkt",
    nama: "JKT",
    kategori: ["daya-tahan", "pencernaan"],
    ringkas: "Jahe, kunyit asam, dan temulawak dalam satu botol.",
    khasiat:
      "Antioksidan; dipercaya membantu meredakan mual dan gangguan pencernaan, menjaga daya tahan tubuh dan kesehatan sendi.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#D98E1C",
      latar: "#F8E3BF",
      bahan: [
        { jenis: "rimpang", warna: W.jahe },
        { jenis: "rimpang", warna: W.kunyit },
      ],
    },
  },
  {
    slug: "kunyit-putih",
    nama: "Kunyit Putih",
    kategori: ["pencernaan", "pegal-bugar"],
    ringkas: "Lembut, untuk pencernaan dan sendi.",
    khasiat:
      "Dipercaya membantu menjaga pencernaan dan meredakan pegal pada sendi.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#E9DDB4",
      latar: "#F3EEDC",
      bahan: [
        { jenis: "rimpang", warna: "#EFE6CC" },
        { jenis: "daun", warna: W.daunMuda },
      ],
    },
  },
  {
    slug: "kumis-kucing",
    nama: "Kumis Kucing",
    kategori: ["pegal-bugar"],
    ringkas: "Racikan daun untuk badan lebih ringan.",
    khasiat:
      "Secara tradisional digunakan untuk membantu menjaga kesehatan saluran kemih dan ginjal, serta meredakan pegal dan rematik.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#9DB36B",
      latar: "#E3EBD3",
      bahan: [
        { jenis: "daun", warna: W.daunMuda },
        { jenis: "bunga", warna: "#E9E4F2" },
      ],
    },
  },
  {
    slug: "brotowali",
    nama: "Brotowali",
    kategori: ["daya-tahan"],
    ringkas: "Pahit khas, warisan racikan lama.",
    khasiat:
      "Dipercaya membantu menjaga kadar gula darah, kesehatan tulang, dan daya tahan tubuh.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#5E7A3A",
      latar: "#DDE5CF",
      bahan: [
        { jenis: "sirih", warna: W.daun },
        { jenis: "sereh", warna: "#6B8A44" },
      ],
    },
  },
  {
    slug: "gula-asem",
    nama: "Gula Asem",
    kategori: ["pencernaan"],
    ringkas: "Manis legit, perut terasa lega.",
    khasiat:
      "Dipercaya membantu melancarkan pencernaan serta menjaga kolesterol dan gula darah.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#8A4B2A",
      latar: "#F0DFD2",
      bahan: [
        { jenis: "asam", warna: W.asam },
        { jenis: "beras", warna: "#C98B4E" },
      ],
    },
  },
  {
    slug: "tolak-angin",
    nama: "Tolak Angin",
    kategori: ["pencernaan"],
    ringkas: "Andalan saat badan mulai meriang.",
    khasiat:
      "Membantu meringankan masuk angin, pusing, mual, dan perut kembung.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#7A5230",
      latar: "#EEDFD0",
      bahan: [
        { jenis: "rimpang", warna: W.jahe },
        { jenis: "daun", warna: W.daun },
      ],
    },
  },
  {
    slug: "pegel-linu",
    nama: "Pegel Linu",
    kategori: ["pegal-bugar"],
    ringkas: "Untuk pegal setelah kerja keras.",
    khasiat: "Membantu meringankan pegal linu, encok, dan keluhan rematik.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#6B4A2B",
      latar: "#EBDDCF",
      bahan: [
        { jenis: "rimpang", warna: "#B8864F" },
        { jenis: "daun", warna: W.daun },
      ],
    },
  },
  {
    slug: "empu-kunir",
    nama: "Empu Kunir",
    kategori: ["pencernaan"],
    ringkas: "Kunyit pekat untuk lambung dan tenggorokan.",
    khasiat:
      "Secara tradisional digunakan untuk membantu meredakan asam lambung, sembelit, batuk, dan radang tenggorokan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#E9A825",
      latar: "#F9E8C2",
      bahan: [
        { jenis: "rimpang", warna: W.kunyit },
        { jenis: "rimpang", warna: "#F0C24B" },
      ],
    },
  },
  {
    slug: "jamu-gatal-gatal",
    nama: "Jamu Gatal-Gatal",
    kategori: ["kulit"],
    ringkas: "Racikan tradisional untuk keluhan kulit.",
    khasiat:
      "Secara tradisional digunakan untuk membantu meredakan gatal-gatal dan keluhan kulit.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#6E8B3D",
      latar: "#E2EAD2",
      bahan: [
        { jenis: "daun", warna: "#5E8A3E" },
        { jenis: "sirih", warna: W.daunMuda },
      ],
    },
  },
  {
    slug: "sawanan",
    nama: "Sawanan",
    kategori: ["keluarga", "kulit"],
    ringkas: "Jamu tradisional untuk dewasa dan anak.",
    khasiat:
      "Jamu tradisional untuk dewasa dan anak; dipercaya membantu meredakan gatal, kembung, dan menambah nafsu makan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#A7B85C",
      latar: "#EAF0D6",
      bahan: [
        { jenis: "daun", warna: W.daunMuda },
        { jenis: "rimpang", warna: W.kencur },
      ],
    },
  },
  {
    slug: "kunir-asem-sirih",
    nama: "Kunir Asem Sirih",
    kategori: ["kewanitaan"],
    ringkas: "Kunir asem dengan sentuhan daun sirih.",
    khasiat:
      "Dipercaya membantu mengontrol berat badan, melancarkan metabolisme, dan mengurangi bau badan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#D9A63A",
      latar: "#F5E8C5",
      bahan: [
        { jenis: "sirih", warna: W.daun },
        { jenis: "rimpang", warna: W.kunyit },
      ],
    },
  },
  {
    slug: "sirih-manjakani",
    nama: "Sirih Manjakani",
    kategori: ["kewanitaan"],
    ringkas: "Racikan sirih untuk perawatan wanita.",
    khasiat:
      "Secara tradisional digunakan untuk membantu menjaga kebersihan dan kesehatan area kewanitaan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#5C7A4A",
      latar: "#DEE7D6",
      bahan: [
        { jenis: "sirih", warna: W.daun },
        { jenis: "asam", warna: "#8C6A4A" },
      ],
    },
  },
  {
    slug: "sirih",
    nama: "Sirih",
    kategori: ["kewanitaan"],
    ringkas: "Daun sirih, resep turun-temurun.",
    khasiat:
      "Secara tradisional digunakan untuk membantu mengurangi keputihan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#4F7A3F",
      latar: "#DCE8D3",
      bahan: [
        { jenis: "sirih", warna: W.daun },
        { jenis: "sirih", warna: W.daunMuda },
      ],
    },
  },
  {
    slug: "wejahan",
    nama: "Wejahan",
    kategori: ["keluarga", "kewanitaan"],
    ringkas: "Untuk ibu menyusui, badan lebih segar.",
    khasiat: "Dipercaya membantu melancarkan ASI dan menyegarkan badan.",
    komposisi: null,
    ukuran: null,
    hargaMin: null,
    hargaMaks: null,
    gambar: null,
    terlaris: false,
    baru: false,
    tersedia: true,
    visual: {
      cairan: "#A0643A",
      latar: "#F1E0D0",
      bahan: [
        { jenis: "rimpang", warna: W.jahe },
        { jenis: "daun", warna: W.daunMuda },
      ],
    },
  },
];

/** Info harga umum dari proposal (harga per produk belum ada). */
export const infoHarga = {
  satuanMulai: 6,
  besarHingga: 30,
  hampersMin: 40,
  hampersMaks: 90,
} as const;

export function cariProduk(slug: string): Produk | undefined {
  return produk.find((p) => p.slug === slug);
}

export const produkTerlaris = produk.filter((p) => p.terlaris).slice(0, 4);

/** Produk lain yang berbagi kategori, untuk "Produk terkait". */
export function produkTerkait(p: Produk, jumlah = 4): Produk[] {
  return produk
    .filter((x) => x.slug !== p.slug && x.kategori.some((k) => p.kategori.includes(k)))
    .slice(0, jumlah);
}

/** "Rp15 ribu" / "Rp6–30 ribu" / fallback "Mulai Rp6 ribu". */
export function formatHarga(p: Pick<Produk, "hargaMin" | "hargaMaks">): string {
  if (p.hargaMin == null) return `Mulai Rp${infoHarga.satuanMulai} ribu`;
  if (p.hargaMaks == null || p.hargaMaks === p.hargaMin) {
    return `Rp${p.hargaMin} ribu`;
  }
  return `Rp${p.hargaMin}–${p.hargaMaks} ribu`;
}
