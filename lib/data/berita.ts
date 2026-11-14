/**
 * Berita & artikel (Fase 2, statis). Di Fase 3 dipindah ke tabel `articles`.
 *
 * Liputan media dikumpulkan lewat pencarian web "jamu bu ranti berita semarang"
 * (14 November 2026). Judul, tanggal, dan penulis diambil dari halaman aslinya;
 * ringkasan ditulis ulang dengan kata-kata sendiri. Isi lengkap tetap di situs sumber.
 */

export const kategoriArtikel = [
  "Sejarah & Edukasi Jamu",
  "Liputan Media",
  "Kegiatan UMKM",
  "Cerita Pelanggan",
] as const;

export type KategoriArtikel = (typeof kategoriArtikel)[number];

export type Artikel = {
  slug: string;
  judul: string;
  ringkasan: string;
  kategori: KategoriArtikel;
  /** ISO date (YYYY-MM-DD). null = belum diketahui. */
  tanggal: string | null;
  penulis: string | null;
  /** Nama media, untuk liputan eksternal. */
  sumber: string | null;
  /** Ada = kartu membuka situs sumber di tab baru. */
  urlEksternal: string | null;
  /** Isi artikel internal, per paragraf. Teks diawali "## " dijadikan subjudul. */
  isi: string[] | null;
  sampul: { warna: string; aksen: string };
};

export const artikel: Artikel[] = [
  {
    slug: "espos-dari-sukoharjo-ke-semarang",
    judul:
      "Dari Sukoharjo ke Semarang: Jamu Bu Ranti Bertahan Lewat Digitalisasi",
    ringkasan:
      "Espos menelusuri perjalanan usaha jamu gendong keluarga ini hingga generasi ketiga, Agnes Oktavi Maharani, yang membawanya ke GoFood, GrabFood, dan ShopeeFood.",
    kategori: "Liputan Media",
    tanggal: "2026-07-04",
    penulis: "Fitroh Nurikhsan",
    sumber: "Espos.id",
    urlEksternal:
      "https://regional.espos.id/dari-sukoharjo-ke-semarang-jamu-bu-ranti-bertahan-lewat-digitalisasi-2229921",
    isi: null,
    sampul: { warna: "#1F3D2B", aksen: "#E8A317" },
  },
  {
    slug: "kompasiana-dari-gendongan-hingga-digital",
    judul:
      "Dari Gendongan hingga Digital, Perjalanan Jamu Bu Ranti Bertahan di Era Modern",
    ringkasan:
      "Kisah Bu Ranti yang berjualan keliling dengan digendong, gerobak, lalu motor, sampai cucunya membawa jamu keluarga ini ke media sosial dan layanan pesan antar.",
    kategori: "Liputan Media",
    tanggal: "2026-06-20",
    penulis: "Fadila Intan",
    sumber: "Kompasiana",
    urlEksternal:
      "https://www.kompasiana.com/fadilaintan1333/6a369ad934777c56a6704ff3/dari-gendongan-hingga-digital-perjalanan-jamu-bu-ranti-bertahan-di-era-modern",
    isi: null,
    sampul: { warna: "#3F7D4E", aksen: "#FBF6EC" },
  },
  {
    slug: "udinus-alumni-sulap-jamu-keluarga",
    judul:
      "Alumni Udinus Sulap Jamu Keluarga Jadi Brand Modern, Raup Omzet Puluhan Juta",
    ringkasan:
      "Tim Kewirausahaan Udinus menulis bagaimana Agnes memperbarui logo, kemasan, dan proses produksi, serta menambah varian rosella dan sereh telang.",
    kategori: "Liputan Media",
    tanggal: "2026-03-19",
    penulis: "Kewirausahaan Udinus",
    sumber: "Udinus",
    urlEksternal:
      "https://inbis.dinus.ac.id/2026/03/19/alumni-udinus-sulap-jamu-keluarga-jadi-brand-modern-raup-omzet-puluhan-juta/",
    isi: null,
    sampul: { warna: "#4B5FB0", aksen: "#F3E6CF" },
  },
  {
    slug: "udinus-agnes-ilmu-kewirausahaan",
    judul: "Agnes, Mahasiswa FKes Udinus, Dapatkan Ilmu Kewirausahaan di Kampus",
    ringkasan:
      "Humas Udinus mengangkat usaha jamu Agnes yang lolos pendanaan KBMI dan dipasarkan lewat Instagram, GoFood, serta endorsement akun kuliner.",
    kategori: "Kegiatan UMKM",
    tanggal: "2023-01-05",
    penulis: "Humas Udinus",
    sumber: "Udinus",
    urlEksternal:
      "https://dinus.ac.id/berita/agnes-mahasiswa-fkes-udinus-dapatkan-ilmu-kewirausahaan-di-kampus/",
    isi: null,
    sampul: { warna: "#E8A317", aksen: "#1F3D2B" },
  },
  {
    slug: "times-racikan-asli-nenek-sejak-1980",
    judul: "Jamu Bu Ranti, Racikan Asli Nenek Sejak 1980",
    ringkasan:
      "TIMES Indonesia mengenalkan varian andalan seperti beras kencur, kunir asem, jahe merah, dan temulawak, serta cara Agnes bertahan memasarkan jamu di masa pandemi.",
    kategori: "Liputan Media",
    tanggal: "2022-01-10",
    penulis: null,
    sumber: "TIMES Indonesia",
    urlEksternal: "https://jatim.times.co.id/news/berita/0k5hdg4m1f/news",
    isi: null,
    sampul: { warna: "#B83A3A", aksen: "#FBF6EC" },
  },
  {
    slug: "dari-gendongan-ke-digital",
    judul: "Dari Gendongan ke Digital: Tiga Generasi Jamu Bu Ranti",
    ringkasan:
      "Bagaimana resep jamu seorang nenek dari Sukoharjo bertahan puluhan tahun dan kini bisa dipesan lewat ponsel.",
    kategori: "Sejarah & Edukasi Jamu",
    tanggal: null,
    penulis: "Tim Jamu Bu Ranti",
    sumber: null,
    urlEksternal: null,
    isi: [
      "Jamu Bu Ranti dirintis oleh Bu Suranti, yang akrab disapa Bu Ranti, di Sukoharjo, Jawa Tengah. Resepnya diracik sendiri dari rimpang dan dedaunan, lalu dijajakan ke tetangga sekitar.",
      "## Merantau ke Semarang",
      "Sekitar tahun 1980-an, Bu Ranti merantau ke Kota Semarang. Ia berjualan keliling dari rumah ke rumah di wilayah Semeru dan Gajahmungkur. Mula-mula jamu digendong, lalu memakai gerobak dorong, hingga akhirnya diantar dengan sepeda motor.",
      "## Generasi ketiga mengambil peran",
      "Pada 2020, cucu Bu Ranti, Agnes Oktavi Maharani, mengikuti Program Kreativitas Bisnis Mahasiswa Indonesia (KBMI). Usaha keluarga ini mendapat pendanaan Rp15 juta dan pendampingan selama enam bulan.",
      "Dari situ jamu keluarga mulai berbenah: kemasan baru yang lebih menarik, identitas merek yang jelas, dan akun Instagram @jamuburanti untuk menyapa pelanggan.",
      "## Rasa yang sama, cara pesan yang baru",
      "Kini Jamu Bu Ranti menjangkau pelanggan lewat media sosial dan layanan pesan antar, tetap sebagai usaha keluarga generasi ketiga. Resepnya tetap warisan nenek, hanya cara menikmatinya yang menyesuaikan zaman.",
    ],
    sampul: { warna: "#E8A317", aksen: "#1F3D2B" },
  },
  {
    slug: "panduan-memilih-jamu",
    judul: "Bingung Pilih Jamu? Ini Panduan Singkat Sesuai Kebutuhanmu",
    ringkasan:
      "Dari kunir asem sampai pegel linu, kenali jamu yang secara tradisional dipilih untuk kebutuhan sehari-hari.",
    kategori: "Sejarah & Edukasi Jamu",
    tanggal: null,
    penulis: "Tim Jamu Bu Ranti",
    sumber: null,
    urlEksternal: null,
    isi: [
      "Jamu adalah minuman tradisional yang diracik dari bahan alami seperti rimpang, daun, dan bunga. Setiap racikan punya rasa dan kegunaan tradisionalnya sendiri. Berikut panduan singkat memilihnya.",
      "## Saat badan terasa kurang fit",
      "Rosella, Sereh Telang, Temulawak, dan Brotowali sering dipilih sebagai minuman antioksidan untuk membantu menjaga daya tahan tubuh.",
      "## Saat perut kurang nyaman atau masuk angin",
      "Jahe Merah terasa hangat dan secara tradisional dipercaya membantu meredakan masuk angin. Gula Asem, Tolak Angin, dan Empu Kunir juga jadi pilihan untuk perut yang terasa kembung.",
      "## Setelah aktivitas seharian",
      "Beras Kencur dikenal membantu menghilangkan rasa lelah, sementara Pegel Linu dan Kumis Kucing biasa dipilih saat badan terasa pegal.",
      "## Untuk perempuan",
      "Kunir Asem adalah jamu klasik saat datang bulan. Ada juga Kunir Asem Sirih, Sirih, dan Sirih Manjakani untuk perawatan sehari-hari.",
      "Ingat, jamu adalah minuman tradisional, bukan pengganti obat atau anjuran dokter. Konsultasikan dengan tenaga kesehatan bila memiliki kondisi medis tertentu.",
    ],
    sampul: { warna: "#3F7D4E", aksen: "#E8A317" },
  },
];

export const videoKegiatan = [
  {
    id: "HbKjg6uC0YA",
    judul: "Jamu Bu Ranti Khasiat Herbal Warisan Leluhur",
  },
  {
    id: "nxm8UJJC9Rs",
    judul: "Indonesia Bisa - Jamu Tradisional, Pemasaran Milenial",
  },
  {
    id: "NLUoiAHZvms",
    // Judul asli di YouTube tertulis "bu Kanti"; cek ulang (lihat TODO_KONTEN.md).
    judul: "Jamu Tradisional - Segmen 4",
  },
] as const;

/** Media yang meliput, untuk strip "Diliput Media" di Beranda. */
export const liputanMedia = [
  {
    nama: "Kompasiana",
    url: artikel[1].urlEksternal!,
  },
  { nama: "Espos", url: artikel[0].urlEksternal! },
  { nama: "TIMES Indonesia", url: artikel[4].urlEksternal! },
  { nama: "Udinus", url: artikel[2].urlEksternal! },
];

export function cariArtikel(slug: string) {
  return artikel.find((a) => a.slug === slug);
}

/** Terbaru dulu; artikel tanpa tanggal ditaruh di depan (artikel internal). */
export const artikelTerurut = [...artikel].sort((a, b) => {
  if (!a.tanggal) return -1;
  if (!b.tanggal) return 1;
  return b.tanggal.localeCompare(a.tanggal);
});

export function formatTanggal(iso: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(`${iso}T12:00:00+07:00`));
}
