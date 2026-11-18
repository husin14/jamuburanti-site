"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

type Db = Awaited<ReturnType<typeof wajibAdmin>>["db"];

/** Bucket privat foto kiriman pengunjung & bucket publik website. */
const PRIVAT = "ulasan-masuk";
const PUBLIK = "public-images";

/** Jalur file di bucket publik dari URL-nya; hanya folder testimoni/ yang dikelola di sini. */
function jalurPublikFoto(url: string | null): string | null {
  const jalur = url?.split(`/${PUBLIK}/`)[1];
  return jalur?.startsWith("testimoni/") ? jalur : null;
}

async function ambilFoto(db: Db, idT: string) {
  return db.from("testimonials").select("photo_path, photo_url").eq("id", idT).single();
}

/** Hapus berkas foto sebuah testimoni dari kedua bucket (galat diabaikan). */
async function hapusBerkas(db: Db, t: { photo_path: string | null; photo_url: string | null }) {
  if (t.photo_path) await db.storage.from(PRIVAT).remove([t.photo_path]);
  const publik = jalurPublikFoto(t.photo_url);
  if (publik) await db.storage.from(PUBLIK).remove([publik]);
}

/**
 * Foto kiriman pengunjung baru dipublikasikan saat disetujui: salin dari
 * bucket privat ke public-images/testimoni/. Mengembalikan URL publiknya.
 */
async function terbitkanFoto(db: Db, jalur: string): Promise<{ url?: string; galat?: string }> {
  const tujuan = `testimoni/${jalur}`;
  const { error } = await db.storage.from(PRIVAT).copy(jalur, tujuan, { destinationBucket: PUBLIK });
  // "sudah ada" = salinan dari percobaan sebelumnya; lanjutkan saja
  if (error && !/exist/i.test(error.message)) {
    return { galat: `Foto gagal dipublikasikan: ${error.message}` };
  }
  return { url: db.storage.from(PUBLIK).getPublicUrl(tujuan).data.publicUrl };
}

export async function setujuiTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const setuju = f.get("setuju") === "1";
  const idT = id(f);
  const ubah: { is_approved: boolean; photo_url?: string; photo_path?: null } = { is_approved: setuju };

  const { data: t, error: galatAmbil } = await ambilFoto(db, idT);
  if (galatAmbil) return gagal(pesanGalat(galatAmbil));
  if (setuju && t.photo_path && !t.photo_url) {
    const { url, galat } = await terbitkanFoto(db, t.photo_path);
    if (galat || !url) return gagal(galat ?? "Foto gagal dipublikasikan.");
    ubah.photo_url = url;
    ubah.photo_path = null;
  }

  const { error } = await db.from("testimonials").update(ubah).eq("id", idT);
  if (error) return gagal(pesanGalat(error));
  if (ubah.photo_url && t.photo_path) await db.storage.from(PRIVAT).remove([t.photo_path]);

  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  return berhasil(setuju ? "Testimoni disetujui dan tampil di website." : "Testimoni disembunyikan.");
}

/** Lepas & hapus foto dari testimoni (ulasannya tetap). */
export async function hapusFotoTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const idT = id(f);
  const { data: t, error: galatAmbil } = await ambilFoto(db, idT);
  if (galatAmbil) return gagal(pesanGalat(galatAmbil));
  const { error } = await db
    .from("testimonials")
    .update({ photo_url: null, photo_path: null })
    .eq("id", idT);
  if (error) return gagal(pesanGalat(error));
  await hapusBerkas(db, t);
  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  return berhasil("Foto dihapus. Ulasannya tetap ada.");
}

export async function hapusTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const idT = id(f);
  const { data: t } = await ambilFoto(db, idT);
  const { error } = await db.from("testimonials").delete().eq("id", idT);
  if (error) return gagal(pesanGalat(error));
  if (t) await hapusBerkas(db, t);
  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  return berhasil("Testimoni dihapus.");
}

/* ------------------ Tambah / ubah testimoni oleh admin ------------------ */

const teks = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const nilai = (f: FormData, k: string) => {
  const n = Number(f.get(k));
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 0;
};

/** Nama yang dipakai bila admin tidak mengisi nama pelanggan. */
const NAMA_CADANGAN = "Pelanggan";

/**
 * Simpan testimoni dari panel admin. Cukup screenshot ulasan (mis. chat
 * WhatsApp) + rating; nama, jamu, teks, dan tanggal opsional. Foto diunggah
 * admin langsung ke public-images/testimoni/. Testimoni baru langsung tampil;
 * saat mengubah, status tampil/sembunyi tidak disentuh.
 */
export async function simpanTestimoni(_a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const { db } = await wajibAdmin();
  const idT = id(f);
  const nama = teks(f, "name") || NAMA_CADANGAN;
  const ulasan = teks(f, "review");
  const rasa = nilai(f, "rating_taste");
  const kualitas = nilai(f, "rating_quality");
  const pelayanan = nilai(f, "rating_service");
  const fotoBaru = teks(f, "photo_url") || null;
  const tanggal = teks(f, "tanggal");
  const izin = f.get("consent") === "on";

  // Data lama (status tampil & foto, untuk membersihkan foto yang diganti/dilepas)
  const lama = idT
    ? (await db.from("testimonials").select("is_approved, photo_path, photo_url").eq("id", idT).single()).data
    : null;
  if (idT && !lama) return gagal("Testimoni tidak ditemukan. Mungkin sudah dihapus.");
  const tampil = lama ? lama.is_approved : true;
  const adaFoto = Boolean(fotoBaru || lama?.photo_path);

  if (nama.length < 2 || nama.length > 60) return gagal("Nama pelanggan 2–60 huruf (atau kosongkan).");
  if (!adaFoto && !ulasan) return gagal("Unggah foto screenshot ulasan, atau tulis teks ulasannya.");
  if (ulasan && (ulasan.length < 10 || ulasan.length > 500)) {
    return gagal("Teks ulasan 10–500 huruf (atau kosongkan bila sudah ada foto).");
  }
  if (!rasa || !kualitas || !pelayanan) return gagal("Beri rating 1–5 bintang.");
  if (tampil && !izin) {
    return gagal("Centang 'Pelanggan sudah mengizinkan' agar ulasan boleh tampil di website.");
  }
  if (fotoBaru && !jalurPublikFoto(fotoBaru)) return gagal("Foto harus diunggah lewat tombol Pilih foto.");
  if (tanggal && !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)) return gagal("Format tanggal tidak valid.");

  const baris: Record<string, unknown> = {
    name: nama,
    product: teks(f, "product").slice(0, 60) || null,
    rating_taste: rasa,
    rating_quality: kualitas,
    rating_service: pelayanan,
    review: ulasan,
    consent: izin,
    is_approved: tampil,
    photo_url: fotoBaru,
    ...(tanggal && { created_at: `${tanggal}T12:00:00+07:00` }),
  };

  // Foto kiriman pelanggan (privat) yang belum diganti admin: terbitkan bila
  // ulasan ditampilkan, atau buang bila admin mengunggah foto lain.
  if (lama?.photo_path) {
    if (fotoBaru) {
      baris.photo_path = null;
    } else if (tampil) {
      const { url, galat } = await terbitkanFoto(db, lama.photo_path);
      if (galat || !url) return gagal(galat ?? "Foto gagal dipublikasikan.");
      baris.photo_url = url;
      baris.photo_path = null;
    }
  }

  const { error } = idT
    ? await db.from("testimonials").update(baris).eq("id", idT)
    : await db.from("testimonials").insert(baris);
  if (error) {
    // Aturan lama di database (ulasan wajib ≥ 10 huruf) belum diperbarui
    if (error.code === "23514" && !ulasan && error.message.includes("review")) {
      return gagal(
        "Database belum diperbarui untuk testimoni tanpa teks. Jalankan ulang file " +
          "supabase/migrations/20261118000000_foto_testimoni.sql di Supabase SQL Editor, lalu simpan lagi.",
      );
    }
    return gagal(pesanGalat(error));
  }

  // Bersihkan berkas lama yang tidak dipakai lagi
  if (lama) {
    const publikLama = jalurPublikFoto(lama.photo_url);
    if (publikLama && lama.photo_url !== baris.photo_url) {
      await db.storage.from(PUBLIK).remove([publikLama]);
    }
    if (lama.photo_path && baris.photo_path === null) {
      await db.storage.from(PRIVAT).remove([lama.photo_path]);
    }
  }

  segarkan("testimoni");
  revalidatePath("/admin", "layout");
  if (!idT) {
    const pesan = nama === NAMA_CADANGAN ? "Testimoni baru ditambahkan." : `Testimoni dari ${nama} ditambahkan.`;
    redirect(`/admin/testimoni?filter=tampil&pesan=${encodeURIComponent(`${pesan} Sudah tampil di website.`)}`);
  }
  return berhasil(tampil ? "Tersimpan. Perubahan sudah tampil di website." : "Tersimpan (ulasan ini belum ditampilkan).");
}

/** Hapus dari halaman ubah: kembali ke daftar setelah terhapus. */
export async function hapusTestimoniLaluKembali(a: HasilAdmin | null, f: FormData): Promise<HasilAdmin> {
  const hasil = await hapusTestimoni(a, f);
  if (!hasil.ok) return hasil;
  redirect(`/admin/testimoni?pesan=${encodeURIComponent("Testimoni dihapus.")}`);
}
