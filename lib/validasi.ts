/**
 * Aturan validasi form, dipakai di browser (umpan balik cepat) DAN di server
 * (Server Action) agar tidak bisa dilewati. Batasnya sama dengan CHECK di database.
 */

export type Galat = Record<string, string>;

export const topikPesan = ["Pemesanan", "Kerja Sama", "Pertanyaan", "Lainnya"] as const;
export type TopikPesan = (typeof topikPesan)[number];

const teks = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

export type DataPesan = {
  nama: string;
  kontak: string;
  topik: TopikPesan;
  pesan: string;
};

export function validasiPesan(form: FormData): { data?: DataPesan; galat: Galat } {
  const nama = teks(form.get("nama"));
  const kontak = teks(form.get("kontak"));
  const topik = teks(form.get("topik"));
  const pesan = teks(form.get("pesan"));
  const galat: Galat = {};

  if (nama.length < 2 || nama.length > 60) galat.nama = "Tulis namamu (2–60 huruf).";
  const nomorWa = /^(\+?62|0)8[0-9\s-]{7,13}$/.test(kontak);
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(kontak) && kontak.length <= 80;
  if (!nomorWa && !email) galat.kontak = "Isi nomor WhatsApp (08…) atau email yang valid.";
  if (!topikPesan.includes(topik as TopikPesan)) galat.topik = "Pilih topik pesan.";
  if (pesan.length < 10) galat.pesan = "Pesan minimal 10 huruf.";
  else if (pesan.length > 1000) galat.pesan = "Pesan maksimal 1000 huruf.";

  if (Object.keys(galat).length > 0) return { galat };
  return { data: { nama, kontak, topik: topik as TopikPesan, pesan }, galat };
}

export type DataTestimoni = {
  nama: string;
  produk: string | null;
  rasa: number;
  kualitas: number;
  pelayanan: number;
  ulasan: string;
};

function bintang(v: FormDataEntryValue | null) {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 0;
}

export function validasiTestimoni(form: FormData): { data?: DataTestimoni; galat: Galat } {
  const nama = teks(form.get("nama"));
  const produk = teks(form.get("produk")).slice(0, 60) || null;
  const ulasan = teks(form.get("ulasan"));
  const rasa = bintang(form.get("rating-rasa"));
  const kualitas = bintang(form.get("rating-kualitas"));
  const pelayanan = bintang(form.get("rating-pelayanan"));
  const galat: Galat = {};

  if (nama.length < 2 || nama.length > 60) galat.nama = "Tulis nama atau inisialmu (2–60 huruf).";
  if (ulasan.length < 10) galat.ulasan = "Ceritakan sedikit lebih panjang (minimal 10 huruf).";
  else if (ulasan.length > 500) galat.ulasan = "Ulasan maksimal 500 huruf.";
  if (!rasa || !kualitas || !pelayanan) galat.rating = "Beri bintang untuk ketiga aspek.";
  if (!form.get("persetujuan")) galat.persetujuan = "Centang persetujuan agar ulasan bisa ditampilkan.";

  if (Object.keys(galat).length > 0) return { galat };
  return { data: { nama, produk, rasa, kualitas, pelayanan, ulasan }, galat };
}

/** Hasil Server Action untuk useActionState. */
export type HasilForm = {
  status: "awal" | "sukses" | "galat";
  galat?: Galat;
  pesan?: string;
  /** Tautan WhatsApp cadangan bila penyimpanan gagal/ belum tersambung. */
  waCadangan?: string;
  /** Penanda unik per pengiriman, agar form bisa di-reset. */
  waktu?: number;
};
