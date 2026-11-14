import "server-only";
import { headers } from "next/headers";

/**
 * Pembatas sederhana per alamat IP (lapisan pertama). Disimpan di memori server,
 * jadi hanya berlaku per instance. Lapisan kedua yang pasti ada di database
 * (trigger batasi_pesan & batasi_testimoni).
 */
const catatan = new Map<string, number[]>();

export async function lewatBatas(kunci: string, maks: number, jendelaMs: number) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "lokal";
  const id = `${kunci}:${ip}`;
  const sekarang = Date.now();
  const riwayat = (catatan.get(id) ?? []).filter((t) => sekarang - t < jendelaMs);
  if (riwayat.length >= maks) {
    catatan.set(id, riwayat);
    return true;
  }
  riwayat.push(sekarang);
  catatan.set(id, riwayat);
  // Bersihkan sesekali agar memori tidak membengkak
  if (catatan.size > 5000) catatan.clear();
  return false;
}

/** true bila form diisi terlalu cepat (indikasi bot). `dimulai` = waktu form dirender. */
export function terlaluCepat(dimulai: FormDataEntryValue | null, minimumMs = 2500) {
  const t = Number(dimulai);
  return Number.isFinite(t) && t > 0 && Date.now() - t < minimumMs;
}
