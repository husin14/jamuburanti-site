import { site } from "@/lib/site";

/** Membuat tautan WhatsApp dengan pesan yang sudah terisi. */
export function buildWaLink(pesan: string): string {
  return `https://wa.me/${site.whatsapp.internasional}?text=${encodeURIComponent(pesan)}`;
}

/** Pesan otomatis untuk memesan satu produk. */
export function pesanProduk(produk: string): string {
  return `Halo Jamu Bu Ranti, saya ingin memesan ${produk}. Apakah tersedia hari ini?`;
}

/** Pesan umum (tombol "Pesan via WhatsApp" tanpa produk tertentu). */
export const pesanUmum =
  "Halo Jamu Bu Ranti, saya ingin memesan jamu. Apakah tersedia hari ini?";

export const waLinkUmum = buildWaLink(pesanUmum);
