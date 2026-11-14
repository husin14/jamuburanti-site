/**
 * ⚠️ TESTIMONI CONTOH (DUMMY) untuk keperluan desain & presentasi.
 * Nama dan ulasan di bawah ini KARANGAN, bukan pelanggan sungguhan.
 * Setiap item ditandai `contoh: true` dan tampil dengan label "Contoh" di website.
 * Wajib dihapus/diganti testimoni asli sebelum website dipublikasikan (lihat TODO_KONTEN.md).
 * Di Fase 3 data ini pindah ke tabel `testimonials` (hanya yang is_approved & consent).
 */

export type Testimoni = {
  id: string;
  nama: string;
  kota: string;
  produk: string;
  rating: { rasa: number; kualitas: number; pelayanan: number };
  ulasan: string;
  tanggal: string;
  contoh: boolean;
};

export const testimoni: Testimoni[] = [
  {
    id: "c1",
    nama: "Rina Kartikasari",
    kota: "Tembalang",
    produk: "Kunir Asem",
    rating: { rasa: 5, kualitas: 5, pelayanan: 5 },
    ulasan:
      "Kunir asemnya seger banget, asamnya pas dan nggak bikin enek. Sekarang jadi stok wajib di kulkas kos tiap minggu.",
    tanggal: "2026-10-28",
    contoh: true,
  },
  {
    id: "c2",
    nama: "Bagus Prasetyo",
    kota: "Banyumanik",
    produk: "Jahe Merah",
    rating: { rasa: 5, kualitas: 5, pelayanan: 4 },
    ulasan:
      "Pulang kerja malam badan rasanya capek, minum jahe merah hangat langsung enakan. Pesan lewat ojol juga cepat sampai.",
    tanggal: "2026-10-21",
    contoh: true,
  },
  {
    id: "c3",
    nama: "Endang Suharti",
    kota: "Gajahmungkur",
    produk: "Beras Kencur",
    rating: { rasa: 5, kualitas: 5, pelayanan: 5 },
    ulasan:
      "Dari zaman Bu Ranti masih keliling gendong saya sudah langganan. Rasanya tetap sama, cuma sekarang botolnya lebih bagus.",
    tanggal: "2026-10-15",
    contoh: true,
  },
  {
    id: "c4",
    nama: "Nadia Rahmawati",
    kota: "Candisari",
    produk: "Sereh Telang",
    rating: { rasa: 4, kualitas: 5, pelayanan: 5 },
    ulasan:
      "Warnanya biru cantik, wangi serehnya lembut. Awalnya beli karena penasaran buat difoto, eh ternyata enak dan jadi repeat order.",
    tanggal: "2026-10-09",
    contoh: true,
  },
  {
    id: "c5",
    nama: "Fajar Nugroho",
    kota: "Pedurungan",
    produk: "Temulawak",
    rating: { rasa: 4, kualitas: 5, pelayanan: 5 },
    ulasan:
      "Saya kira bakal pahit banget, ternyata masih enak diminum dingin. Adminnya ramah dan fast respon di WhatsApp.",
    tanggal: "2026-09-30",
    contoh: true,
  },
  {
    id: "c6",
    nama: "Ayu Wulandari",
    kota: "Ngaliyan",
    produk: "Paket Hampers",
    rating: { rasa: 5, kualitas: 5, pelayanan: 5 },
    ulasan:
      "Pesan hampers buat hantaran keluarga, kemasannya rapi dan kelihatan premium. Banyak yang tanya belinya di mana.",
    tanggal: "2026-09-18",
    contoh: true,
  },
  {
    id: "c7",
    nama: "Hendra Wijaya",
    kota: "Semarang Barat",
    produk: "Pegel Linu",
    rating: { rasa: 4, kualitas: 4, pelayanan: 5 },
    ulasan:
      "Rutin beli buat bapak saya yang suka pegal habis berkebun. Katanya rasanya mirip jamu langganan zaman dulu.",
    tanggal: "2026-09-05",
    contoh: true,
  },
  {
    id: "c8",
    nama: "Putri Anggraeni",
    kota: "Tlogosari",
    produk: "Rosella",
    rating: { rasa: 5, kualitas: 4, pelayanan: 5 },
    ulasan:
      "Rosellanya asam segar, cocok diminum siang-siang. Harganya juga ramah kantong mahasiswa.",
    tanggal: "2026-08-27",
    contoh: true,
  },
];

export function rataRata(t: Testimoni): number {
  const { rasa, kualitas, pelayanan } = t.rating;
  return Math.round(((rasa + kualitas + pelayanan) / 3) * 10) / 10;
}
