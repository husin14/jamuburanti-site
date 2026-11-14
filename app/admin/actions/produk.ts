"use server";

import { redirect } from "next/navigation";
import { berhasil, gagal, pesanGalat, segarkan, wajibAdmin, type HasilAdmin } from "@/lib/admin/auth";
import { kategoriKebutuhan } from "@/lib/data/kategori";
import { buatSlug } from "@/lib/utils/slug";

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opsional = (f: FormData, k: string) => teks(f, k) || null;
const angka = (f: FormData, k: string) => {
  const v = teks(f, k).replace(/[^\d]/g, "");
  return v ? Number(v) : null;
};
const warna = (f: FormData, k: string, cadangan: string) =>
  /^#[0-9a-f]{6}$/i.test(teks(f, k)) ? teks(f, k) : cadangan;

const jenisBahan = ["rimpang", "daun", "sirih", "bunga", "sereh", "asam", "beras"];
const slugKategori = new Set<string>(kategoriKebutuhan.map((k) => k.slug));

export async function simpanProduk(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const id = teks(f, "id");
  const nama = teks(f, "name");
  const slug = buatSlug(teks(f, "slug") || nama);

  if (nama.length < 2) return gagal("Nama produk wajib diisi.");
  if (!slug) return gagal("Slug tidak valid.");
  const hargaMin = angka(f, "price_min");
  const hargaMaks = angka(f, "price_max");
  if (hargaMin != null && hargaMaks != null && hargaMaks < hargaMin) {
    return gagal("Harga maksimal tidak boleh lebih kecil dari harga minimal.");
  }

  const bahan = [1, 2]
    .map((i) => ({ jenis: teks(f, `bahan${i}_jenis`), warna: warna(f, `bahan${i}_warna`, "#3F7D4E") }))
    .filter((b) => jenisBahan.includes(b.jenis));

  const baris = {
    name: nama,
    slug,
    categories: f.getAll("categories").map(String).filter((k) => slugKategori.has(k)),
    short_benefit: teks(f, "short_benefit"),
    benefits: teks(f, "benefits"),
    ingredients: opsional(f, "ingredients"),
    package_size: opsional(f, "package_size"),
    price_min: hargaMin,
    price_max: hargaMaks,
    image_url: opsional(f, "image_url"),
    image_alt: opsional(f, "image_alt"),
    visual: {
      cairan: warna(f, "cairan", "#E8A317"),
      latar: warna(f, "latar", "#F3E6CF"),
      bahan,
    },
    is_bestseller: f.get("is_bestseller") === "on",
    is_new: f.get("is_new") === "on",
    is_available: f.get("is_available") === "on",
    is_published: f.get("is_published") === "on",
    sort_order: angka(f, "sort_order") ?? 0,
  };

  if (baris.image_url && !baris.image_alt) {
    return gagal("Isi 'Deskripsi foto' (alt text) agar foto ramah pembaca layar.");
  }

  const { error } = id
    ? await db.from("products").update(baris).eq("id", id)
    : await db.from("products").insert(baris);
  if (error) return gagal(pesanGalat(error));

  segarkan("produk");
  if (!id) redirect(`/admin/produk?pesan=${encodeURIComponent(`Produk "${nama}" ditambahkan.`)}`);
  return berhasil("Perubahan tersimpan dan sudah tampil di website.");
}

export async function hapusProduk(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const { error } = await db.from("products").delete().eq("id", teks(f, "id"));
  if (error) return gagal(pesanGalat(error));
  segarkan("produk");
  redirect(`/admin/produk?pesan=${encodeURIComponent("Produk dihapus.")}`);
}
