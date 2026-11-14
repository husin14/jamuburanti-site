"use server";

import { revalidatePath } from "next/cache";
import { berhasil, gagal, pesanGalat, segarkan, wajibAdmin, type HasilAdmin } from "@/lib/admin/auth";

const id = (f: FormData) => String(f.get("id") ?? "");

/* ----------------------------- Pesan ----------------------------- */

export async function tandaiPesan(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const dibaca = f.get("dibaca") === "1";
  const { error } = await db.from("messages").update({ is_read: dibaca }).eq("id", id(f));
  if (error) return gagal(pesanGalat(error));
  revalidatePath("/admin", "layout");
  return berhasil(dibaca ? "Ditandai sudah dibaca." : "Ditandai belum dibaca.");
}

export async function hapusPesan(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const { error } = await db.from("messages").delete().eq("id", id(f));
  if (error) return gagal(pesanGalat(error));
  revalidatePath("/admin", "layout");
  return berhasil("Pesan dihapus.");
}

/* --------------------------- Testimoni --------------------------- */

export async function setujuiTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const setuju = f.get("setuju") === "1";
  const { error } = await db.from("testimonials").update({ is_approved: setuju }).eq("id", id(f));
  if (error) return gagal(pesanGalat(error));
  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  return berhasil(setuju ? "Testimoni disetujui dan tampil di website." : "Testimoni disembunyikan.");
}

export async function hapusTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const { error } = await db.from("testimonials").delete().eq("id", id(f));
  if (error) return gagal(pesanGalat(error));
  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  return berhasil("Testimoni dihapus.");
}
