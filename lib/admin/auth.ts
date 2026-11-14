import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { supabaseSesi } from "@/lib/supabase/sesi";
import { TAG } from "@/lib/data/repo";

/** Sesi admin untuk satu request (di-cache per render). */
export const getSesiAdmin = cache(async () => {
  const db = await supabaseSesi();
  if (!db) return null;
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data: admin } = await db.rpc("is_admin");
  return { db, user, admin: admin === true };
});

/**
 * Wajib dipanggil di setiap halaman admin DAN setiap Server Action admin.
 * Mengembalikan klien Supabase ber-sesi; bila bukan admin, diarahkan ke login.
 */
export async function wajibAdmin() {
  const sesi = await getSesiAdmin();
  if (!sesi) redirect("/admin/login");
  if (!sesi.admin) redirect("/admin/login?alasan=bukan-admin");
  return sesi;
}

/** Segarkan cache halaman publik setelah data diubah admin. */
export function segarkan(...tag: (keyof typeof TAG)[]) {
  for (const t of tag) updateTag(TAG[t]);
}

/** Hasil standar Server Action admin. */
export type HasilAdmin = { ok: boolean; pesan: string; waktu: number };

export const berhasil = (pesan: string): HasilAdmin => ({ ok: true, pesan, waktu: Date.now() });
export const gagal = (pesan: string): HasilAdmin => ({ ok: false, pesan, waktu: Date.now() });

/** Terjemahkan error Supabase umum ke Bahasa Indonesia yang ramah. */
export function pesanGalat(e: { code?: string; message: string }): string {
  if (e.code === "23505") return "Data dengan slug/kunci yang sama sudah ada. Gunakan slug lain.";
  if (e.code === "23514") return "Ada isian yang tidak sesuai aturan (terlalu pendek/panjang atau nilainya tidak valid).";
  if (e.code === "42501") return "Akun ini tidak punya izin untuk perubahan tersebut.";
  return `Gagal menyimpan: ${e.message}`;
}
