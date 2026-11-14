"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { berhasil, gagal, pesanGalat, segarkan, wajibAdmin, type HasilAdmin } from "@/lib/admin/auth";
import { kategoriArtikel } from "@/lib/data/berita";
import { kategoriGaleri } from "@/lib/data/galeri";
import { buatSlug } from "@/lib/utils/slug";
import { kunciPengaturan } from "@/lib/admin/pengaturan";

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const opsional = (f: FormData, k: string) => teks(f, k) || null;
const angka = (f: FormData, k: string) => {
  const v = teks(f, k).replace(/[^\d]/g, "");
  return v ? Number(v) : null;
};
const centang = (f: FormData, k: string) => f.get(k) === "on";
const warna = (f: FormData, k: string, cadangan: string) =>
  /^#[0-9a-f]{6}$/i.test(teks(f, k)) ? teks(f, k) : cadangan;

function urlValid(v: string | null) {
  if (!v) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/* ============================== Artikel ============================== */

export async function simpanArtikel(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const id = teks(f, "id");
  const judul = teks(f, "title");
  const slug = buatSlug(teks(f, "slug") || judul);
  const kategori = teks(f, "category");
  const isi = opsional(f, "content");
  const urlLuar = opsional(f, "external_url");

  if (judul.length < 5) return gagal("Judul minimal 5 huruf.");
  if (!slug) return gagal("Slug tidak valid.");
  if (!(kategoriArtikel as readonly string[]).includes(kategori)) return gagal("Pilih kategori.");
  if (!isi && !urlLuar) return gagal("Isi artikel atau tautan liputan media wajib diisi salah satu.");
  if (!urlValid(urlLuar)) return gagal("Tautan liputan media harus diawali https://");

  const baris = {
    title: judul,
    slug,
    category: kategori,
    excerpt: teks(f, "excerpt"),
    content: isi,
    external_url: urlLuar,
    source: opsional(f, "source"),
    author: opsional(f, "author"),
    published_at: opsional(f, "published_at"),
    cover_style: { warna: warna(f, "warna", "#1F3D2B"), aksen: warna(f, "aksen", "#E8A317") },
    is_published: centang(f, "is_published"),
  };

  const { error } = id
    ? await db.from("articles").update(baris).eq("id", id)
    : await db.from("articles").insert(baris);
  if (error) return gagal(pesanGalat(error));

  segarkan("artikel");
  if (!id) redirect(`/admin/artikel?pesan=${encodeURIComponent(`Artikel "${judul}" disimpan.`)}`);
  return berhasil("Perubahan tersimpan.");
}

export async function hapusArtikel(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const { error } = await db.from("articles").delete().eq("id", teks(f, "id"));
  if (error) return gagal(pesanGalat(error));
  segarkan("artikel");
  redirect(`/admin/artikel?pesan=${encodeURIComponent("Artikel dihapus.")}`);
}

/* ============================== Galeri =============================== */

export async function simpanFoto(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const id = teks(f, "id");
  const url = teks(f, "image_url");
  const alt = teks(f, "alt");
  const kategori = teks(f, "category");

  if (!url) return gagal("Unggah foto terlebih dahulu.");
  if (alt.length < 5) return gagal("Isi deskripsi foto (alt text), minimal 5 huruf.");
  if (!(kategoriGaleri as readonly string[]).includes(kategori)) return gagal("Pilih kategori.");

  const baris = {
    image_url: url,
    alt,
    caption: opsional(f, "caption"),
    category: kategori,
    width: angka(f, "width"),
    height: angka(f, "height"),
    sort_order: angka(f, "sort_order") ?? 0,
    is_published: id ? centang(f, "is_published") : true,
  };

  const { error } = id
    ? await db.from("gallery").update(baris).eq("id", id)
    : await db.from("gallery").insert(baris);
  if (error) return gagal(pesanGalat(error));

  segarkan("galeri");
  revalidatePath("/admin/galeri");
  return berhasil(id ? "Foto diperbarui." : "Foto ditambahkan ke galeri.");
}

export async function hapusFoto(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const id = teks(f, "id");
  const { data } = await db.from("gallery").select("image_url").eq("id", id).maybeSingle();
  const { error } = await db.from("gallery").delete().eq("id", id);
  if (error) return gagal(pesanGalat(error));

  // Hapus juga file di Storage bila foto hasil unggahan admin
  const penanda = "/storage/v1/object/public/public-images/";
  if (data?.image_url?.includes(penanda)) {
    await db.storage.from("public-images").remove([data.image_url.split(penanda)[1]]);
  }

  segarkan("galeri");
  revalidatePath("/admin/galeri");
  return berhasil("Foto dihapus.");
}

/* =============================== Promo =============================== */

export async function simpanPromo(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const id = teks(f, "id");
  const judul = teks(f, "title");
  const ctaUrl = opsional(f, "cta_url");
  if (judul.length < 3) return gagal("Judul promo wajib diisi.");
  if (!urlValid(ctaUrl)) return gagal("Tautan tombol harus diawali https:// (kosongkan untuk WhatsApp).");

  const tgl = (k: string) => {
    const v = teks(f, k);
    return v ? new Date(`${v}T00:00:00+07:00`).toISOString() : null;
  };

  const baris = {
    title: judul,
    description: teks(f, "description"),
    cta_label: opsional(f, "cta_label"),
    cta_url: ctaUrl,
    is_active: centang(f, "is_active"),
    starts_at: tgl("starts_at"),
    ends_at: tgl("ends_at"),
    sort_order: angka(f, "sort_order") ?? 0,
  };

  const { error } = id
    ? await db.from("promos").update(baris).eq("id", id)
    : await db.from("promos").insert(baris);
  if (error) return gagal(pesanGalat(error));

  segarkan("promo");
  revalidatePath("/admin/promo");
  return berhasil(id ? "Promo diperbarui." : "Promo ditambahkan.");
}

export async function hapusPromo(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const { error } = await db.from("promos").delete().eq("id", teks(f, "id"));
  if (error) return gagal(pesanGalat(error));
  segarkan("promo");
  revalidatePath("/admin/promo");
  return berhasil("Promo dihapus.");
}

/* ============================ Pengaturan ============================= */

export async function simpanPengaturan(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const baris = kunciPengaturan.map((key) => ({ key, value: opsional(f, key) }));

  for (const b of baris) {
    if (b.key.endsWith("_url") && !urlValid(b.value)) {
      return gagal(`Tautan "${b.key.replace("_url", "")}" harus diawali https://`);
    }
  }
  const email = baris.find((b) => b.key === "email")?.value;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return gagal("Format email tidak valid.");

  const { error } = await db.from("site_settings").upsert(baris, { onConflict: "key" });
  if (error) return gagal(pesanGalat(error));

  segarkan("pengaturan");
  return berhasil("Pengaturan tersimpan. Tautan di website langsung diperbarui.");
}
