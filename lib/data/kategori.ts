/** Kategori kebutuhan untuk filter "Cari Jamu Sesuai Kebutuhanmu". */

export const kategoriKebutuhan = [
  {
    slug: "daya-tahan",
    label: "Daya Tahan & Antioksidan",
    singkat: "Daya tahan",
    ajakan: "Biar badan tetap fit",
  },
  {
    slug: "pencernaan",
    label: "Pencernaan & Masuk Angin",
    singkat: "Pencernaan",
    ajakan: "Perut nyaman, nggak kembung",
  },
  {
    slug: "pegal-bugar",
    label: "Pegal & Badan Bugar",
    singkat: "Pegal & bugar",
    ajakan: "Habis aktivitas seharian",
  },
  {
    slug: "kewanitaan",
    label: "Kesehatan Wanita",
    singkat: "Wanita",
    ajakan: "Teman saat datang bulan",
  },
  {
    slug: "kulit",
    label: "Kulit & Gatal",
    singkat: "Kulit",
    ajakan: "Kulit terasa lebih nyaman",
  },
  {
    slug: "keluarga",
    label: "Ibu & Anak",
    singkat: "Ibu & anak",
    ajakan: "Untuk seisi rumah",
  },
] as const;

export type KategoriSlug = (typeof kategoriKebutuhan)[number]["slug"];

export function labelKategori(slug: KategoriSlug): string {
  return kategoriKebutuhan.find((k) => k.slug === slug)?.label ?? slug;
}

export function cariKategori(slug: string | null | undefined) {
  return kategoriKebutuhan.find((k) => k.slug === slug);
}
