import "server-only";
import { unstable_cache } from "next/cache";
import { supabasePublik } from "@/lib/supabase/server";
import { site } from "@/lib/site";
import { kategoriKebutuhan, type KategoriSlug } from "./kategori";
import { fotoDariUrl } from "./foto";
import { produk as produkStatis, type Produk, type JenisBahan } from "./produk";
import {
  artikel as artikelStatis,
  kategoriArtikel,
  type Artikel,
  type KategoriArtikel,
} from "./berita";
import { galeri as galeriStatis, kategoriGaleri, type ItemGaleri, type KategoriGaleri } from "./galeri";
import { testimoni as testimoniStatis, type Testimoni } from "./testimoni";

/**
 * Lapisan data: membaca dari Supabase bila .env.local sudah diisi,
 * atau dari data statis (lib/data/*.ts) bila belum.
 *
 * Hasil di-cache (tag per tabel). Data diperbarui otomatis tiap 5 menit, atau
 * langsung saat admin menyimpan perubahan (revalidateTag, Fase 4).
 */

export const TAG = {
  produk: "produk",
  artikel: "artikel",
  galeri: "galeri",
  testimoni: "testimoni",
  promo: "promo",
  pengaturan: "pengaturan",
} as const;

const SEGAR = 300; // detik

function gagal(tabel: string, pesan: string): never {
  throw new Error(`Gagal membaca tabel ${tabel} dari Supabase: ${pesan}`);
}

// ---------------------------------------------------------------------------
// Produk
// ---------------------------------------------------------------------------

type BarisProduk = {
  slug: string;
  name: string;
  categories: string[];
  short_benefit: string;
  benefits: string;
  ingredients: string | null;
  package_size: string | null;
  price_min: number | null;
  price_max: number | null;
  image_url: string | null;
  image_alt: string | null;
  visual: Partial<Produk["visual"]> | null;
  is_bestseller: boolean;
  is_new: boolean;
  is_available: boolean;
};

const slugKategori = new Set<string>(kategoriKebutuhan.map((k) => k.slug));
const jenisBahan = new Set<JenisBahan>([
  "rimpang", "daun", "sirih", "bunga", "sereh", "asam", "beras",
]);

function keProduk(r: BarisProduk): Produk {
  const v = r.visual ?? {};
  return {
    slug: r.slug,
    nama: r.name,
    kategori: r.categories.filter((k): k is KategoriSlug => slugKategori.has(k)),
    ringkas: r.short_benefit,
    khasiat: r.benefits,
    komposisi: r.ingredients,
    ukuran: r.package_size,
    // Database menyimpan rupiah; tampilan memakai satuan "ribu".
    hargaMin: r.price_min == null ? null : r.price_min / 1000,
    hargaMaks: r.price_max == null ? null : r.price_max / 1000,
    gambar: r.image_url ? fotoDariUrl(r.image_url, r.image_alt ?? `Foto ${r.name}`) : null,
    terlaris: r.is_bestseller,
    baru: r.is_new,
    tersedia: r.is_available,
    visual: {
      cairan: v.cairan ?? "#E8A317",
      latar: v.latar ?? "#F3E6CF",
      bahan: (v.bahan ?? []).filter((b) => jenisBahan.has(b.jenis)),
    },
  };
}

export const getProduk = unstable_cache(
  async (): Promise<Produk[]> => {
    const db = supabasePublik();
    if (!db) return produkStatis;
    const { data, error } = await db
      .from("products")
      .select(
        "slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available",
      )
      .eq("is_published", true)
      .order("sort_order")
      .order("name");
    if (error) gagal("products", error.message);
    return (data as BarisProduk[]).map(keProduk);
  },
  ["produk"],
  { tags: [TAG.produk], revalidate: SEGAR },
);

export async function getProdukBySlug(slug: string) {
  return (await getProduk()).find((p) => p.slug === slug);
}

export async function getProdukTerlaris(jumlah = 4) {
  return (await getProduk()).filter((p) => p.terlaris).slice(0, jumlah);
}

export function cariProdukTerkait(semua: Produk[], p: Produk, jumlah = 4) {
  return semua
    .filter((x) => x.slug !== p.slug && x.kategori.some((k) => p.kategori.includes(k)))
    .slice(0, jumlah);
}

// ---------------------------------------------------------------------------
// Artikel
// ---------------------------------------------------------------------------

type BarisArtikel = {
  slug: string;
  title: string;
  excerpt: string;
  content: string | null;
  cover_style: { warna?: string; aksen?: string } | null;
  category: string;
  author: string | null;
  source: string | null;
  external_url: string | null;
  published_at: string | null;
};

function keArtikel(r: BarisArtikel): Artikel {
  return {
    slug: r.slug,
    judul: r.title,
    ringkasan: r.excerpt,
    kategori: (kategoriArtikel as readonly string[]).includes(r.category)
      ? (r.category as KategoriArtikel)
      : "Sejarah & Edukasi Jamu",
    tanggal: r.published_at,
    penulis: r.author,
    sumber: r.source,
    urlEksternal: r.external_url,
    isi: r.content
      ? r.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
      : null,
    sampul: {
      warna: r.cover_style?.warna ?? "#1F3D2B",
      aksen: r.cover_style?.aksen ?? "#E8A317",
    },
  };
}

/** Terbaru dulu; artikel tanpa tanggal (artikel internal) di depan. */
function urutkanArtikel(daftar: Artikel[]) {
  return [...daftar].sort((a, b) => {
    if (!a.tanggal) return -1;
    if (!b.tanggal) return 1;
    return b.tanggal.localeCompare(a.tanggal);
  });
}

export const getArtikel = unstable_cache(
  async (): Promise<Artikel[]> => {
    const db = supabasePublik();
    if (!db) return urutkanArtikel(artikelStatis);
    const { data, error } = await db
      .from("articles")
      .select(
        "slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at",
      )
      .eq("is_published", true);
    if (error) gagal("articles", error.message);
    return urutkanArtikel((data as BarisArtikel[]).map(keArtikel));
  },
  ["artikel"],
  { tags: [TAG.artikel], revalidate: SEGAR },
);

export async function getArtikelBySlug(slug: string) {
  return (await getArtikel()).find((a) => a.slug === slug);
}

/** Media yang meliput (untuk strip "Diliput Media"), satu per sumber. */
export async function getLiputanMedia() {
  const hasil = new Map<string, string>();
  for (const a of await getArtikel()) {
    if (a.sumber && a.urlEksternal && !hasil.has(a.sumber)) {
      hasil.set(a.sumber, a.urlEksternal);
    }
  }
  return [...hasil].map(([nama, url]) => ({ nama, url }));
}

// ---------------------------------------------------------------------------
// Galeri
// ---------------------------------------------------------------------------

type BarisGaleri = {
  id: string;
  image_url: string;
  alt: string;
  caption: string | null;
  category: string;
  width: number | null;
  height: number | null;
};

export const getGaleri = unstable_cache(
  async (): Promise<ItemGaleri[]> => {
    const db = supabasePublik();
    if (!db) return galeriStatis;
    const { data, error } = await db
      .from("gallery")
      .select("id, image_url, alt, caption, category, width, height")
      .eq("is_published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) gagal("gallery", error.message);
    return (data as BarisGaleri[]).map((r) => ({
      id: r.id,
      kategori: (kategoriGaleri as readonly string[]).includes(r.category)
        ? (r.category as KategoriGaleri)
        : "Pelanggan & Promosi",
      judul: r.caption ?? r.alt,
      foto: fotoDariUrl(r.image_url, r.alt, r.width, r.height),
    }));
  },
  ["galeri"],
  { tags: [TAG.galeri], revalidate: SEGAR },
);

// ---------------------------------------------------------------------------
// Testimoni (hanya yang disetujui & memberi izin tampil, diatur RLS)
// ---------------------------------------------------------------------------

type BarisTestimoni = {
  id: string;
  name: string;
  city: string | null;
  product: string | null;
  rating_taste: number;
  rating_quality: number;
  rating_service: number;
  review: string;
  is_sample: boolean;
  created_at: string;
};

export const getTestimoni = unstable_cache(
  async (): Promise<Testimoni[]> => {
    const db = supabasePublik();
    if (!db) {
      return [...testimoniStatis].sort((a, b) => b.tanggal.localeCompare(a.tanggal));
    }
    const { data, error } = await db
      .from("testimonials")
      .select(
        "id, name, city, product, rating_taste, rating_quality, rating_service, review, is_sample, created_at",
      )
      .eq("is_approved", true)
      .eq("consent", true)
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) gagal("testimonials", error.message);
    return (data as BarisTestimoni[]).map((r) => ({
      id: r.id,
      nama: r.name,
      kota: r.city ?? "",
      produk: r.product ?? "",
      rating: {
        rasa: r.rating_taste,
        kualitas: r.rating_quality,
        pelayanan: r.rating_service,
      },
      ulasan: r.review,
      tanggal: r.created_at.slice(0, 10),
      contoh: r.is_sample,
    }));
  },
  ["testimoni"],
  { tags: [TAG.testimoni], revalidate: SEGAR },
);

// ---------------------------------------------------------------------------
// Promo utama (banner hampers)
// ---------------------------------------------------------------------------

export type Promo = {
  judul: string;
  deskripsi: string;
  ctaLabel: string;
  ctaUrl: string | null;
};

const promoBawaan: Promo = {
  judul: "Hantaran sehat untuk orang tersayang",
  deskripsi:
    "Paket jamu pilihan dalam kemasan cantik, mulai Rp40 ribu hingga Rp90 ribu. Cocok untuk lebaran, arisan, atau oleh-oleh khas Semarang.",
  ctaLabel: "Tanya Paket Hampers",
  ctaUrl: null,
};

export const getPromoUtama = unstable_cache(
  async (): Promise<Promo | null> => {
    const db = supabasePublik();
    if (!db) return promoBawaan;
    const { data, error } = await db
      .from("promos")
      .select("title, description, cta_label, cta_url")
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    if (error) gagal("promos", error.message);
    if (!data) return null; // tidak ada promo aktif: banner disembunyikan
    return {
      judul: data.title,
      deskripsi: data.description,
      ctaLabel: data.cta_label ?? promoBawaan.ctaLabel,
      ctaUrl: data.cta_url,
    };
  },
  ["promo"],
  { tags: [TAG.promo], revalidate: SEGAR },
);

// ---------------------------------------------------------------------------
// Pengaturan situs
// ---------------------------------------------------------------------------

export type Pengaturan = {
  instagramUrl: string;
  instagramAkun: string;
  email: string | null;
  tiktokUrl: string | null;
  facebookUrl: string | null;
  ojol: { nama: string; url: string | null }[];
};

const pengaturanBawaan: Pengaturan = {
  instagramUrl: site.instagram.url,
  instagramAkun: site.instagram.akun,
  email: site.email,
  tiktokUrl: site.tiktokUrl,
  facebookUrl: site.facebookUrl,
  ojol: site.ojol.map((o) => ({ ...o })),
};

export const getPengaturan = unstable_cache(
  async (): Promise<Pengaturan> => {
    const db = supabasePublik();
    if (!db) return pengaturanBawaan;
    const { data, error } = await db.from("site_settings").select("key, value");
    if (error) gagal("site_settings", error.message);
    const nilai = new Map(
      (data as { key: string; value: string | null }[]).map((r) => [
        r.key,
        r.value?.trim() || null,
      ]),
    );
    return {
      instagramUrl: nilai.get("instagram_url") ?? pengaturanBawaan.instagramUrl,
      instagramAkun: nilai.get("instagram_akun") ?? pengaturanBawaan.instagramAkun,
      email: nilai.get("email") ?? null,
      tiktokUrl: nilai.get("tiktok_url") ?? null,
      facebookUrl: nilai.get("facebook_url") ?? null,
      ojol: [
        { nama: "GoFood", url: nilai.get("gofood_url") ?? null },
        { nama: "GrabFood", url: nilai.get("grabfood_url") ?? null },
        { nama: "ShopeeFood", url: nilai.get("shopeefood_url") ?? null },
      ],
    };
  },
  ["pengaturan"],
  { tags: [TAG.pengaturan], revalidate: SEGAR },
);
