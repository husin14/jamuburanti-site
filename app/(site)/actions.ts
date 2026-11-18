"use server";

import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { supabasePublik } from "@/lib/supabase/server";
import { lewatBatas, terlaluCepat } from "@/lib/utils/batas";
import { buildWaLink } from "@/lib/utils/whatsapp";
import { TAG } from "@/lib/data/repo";
import {
  periksaFoto,
  validasiPesan,
  validasiTestimoni,
  type HasilForm,
} from "@/lib/validasi";

const BALASAN_BOT: HasilForm = { status: "sukses", waktu: 0 };

function pesanKeWa(nama: string, kontak: string, topik: string, pesan: string) {
  return buildWaLink(`Halo Jamu Bu Ranti, saya ${nama} (${kontak}).\nTopik: ${topik}\n\n${pesan}`);
}

/** Form kontak → tabel `messages`. */
export async function kirimPesan(_awal: HasilForm, form: FormData): Promise<HasilForm> {
  // Honeypot & isian super cepat: pura-pura sukses agar bot tidak belajar.
  if (form.get("situs_web") || terlaluCepat(form.get("dimulai"))) return BALASAN_BOT;

  const { data, galat } = validasiPesan(form);
  if (!data) return { status: "galat", galat, waktu: Date.now() };

  const wa = pesanKeWa(data.nama, data.kontak, data.topik, data.pesan);

  if (await lewatBatas("pesan", 3, 10 * 60_000)) {
    return {
      status: "galat",
      pesan: "Kamu sudah mengirim beberapa pesan. Coba lagi dalam beberapa menit, atau langsung chat WhatsApp.",
      waCadangan: wa,
      waktu: Date.now(),
    };
  }

  const db = supabasePublik();
  if (!db) {
    return {
      status: "galat",
      pesan: "Formulir belum tersambung ke database. Kirim pesanmu lewat WhatsApp dulu, ya.",
      waCadangan: wa,
      waktu: Date.now(),
    };
  }

  const { error } = await db.from("messages").insert({
    name: data.nama,
    contact: data.kontak,
    topic: data.topik,
    message: data.pesan,
  });

  if (error) {
    console.error("Gagal menyimpan pesan:", error.message);
    const dibatasi = error.code === "P0001";
    return {
      status: "galat",
      pesan: dibatasi
        ? "Terlalu banyak pesan dalam waktu singkat. Coba lagi beberapa menit lagi, atau chat WhatsApp."
        : "Maaf, pesan gagal terkirim. Silakan kirim lewat WhatsApp.",
      waCadangan: wa,
      waktu: Date.now(),
    };
  }

  return { status: "sukses", waktu: Date.now() };
}

/**
 * Form testimoni → tabel `testimonials` (selalu menunggu persetujuan admin).
 * Foto opsional masuk ke bucket PRIVAT `ulasan-masuk`; baru tampil di website
 * setelah admin menyetujui (disalin ke public-images).
 */
export async function kirimTestimoni(_awal: HasilForm, form: FormData): Promise<HasilForm> {
  if (form.get("situs_web") || terlaluCepat(form.get("dimulai"))) return BALASAN_BOT;

  const { data, galat } = validasiTestimoni(form);
  const foto = await periksaFoto(form.get("foto"));
  if (typeof foto === "string") galat.foto = foto;
  if (!data || typeof foto === "string") return { status: "galat", galat, waktu: Date.now() };

  if (await lewatBatas("testimoni", 2, 60 * 60_000)) {
    return {
      status: "galat",
      pesan: "Kamu sudah mengirim ulasan. Terima kasih! Coba lagi nanti bila ingin menambah.",
      waktu: Date.now(),
    };
  }

  const db = supabasePublik();
  if (!db) {
    return {
      status: "galat",
      pesan: "Formulir belum tersambung ke database, jadi ulasan belum bisa disimpan.",
      waktu: Date.now(),
    };
  }

  let photoPath: string | null = null;
  if (foto) {
    photoPath = `${randomUUID()}.${foto.ekstensi}`;
    const { error: galatUnggah } = await db.storage
      .from("ulasan-masuk")
      .upload(photoPath, foto.isi, { contentType: foto.tipe });
    if (galatUnggah) {
      console.error("Gagal mengunggah foto ulasan:", galatUnggah.message);
      return {
        status: "galat",
        galat: { foto: "Foto gagal diunggah. Coba lagi, atau kirim ulasan tanpa foto." },
        waktu: Date.now(),
      };
    }
  }

  const { error } = await db.from("testimonials").insert({
    name: data.nama,
    ...(photoPath && { photo_path: photoPath }),
    product: data.produk,
    rating_taste: data.rasa,
    rating_quality: data.kualitas,
    rating_service: data.pelayanan,
    review: data.ulasan,
    consent: true,
    // is_approved & is_sample dibiarkan default (false) — dijaga juga oleh RLS
  });

  if (error) {
    console.error("Gagal menyimpan testimoni:", error.message);
    return {
      status: "galat",
      pesan:
        error.code === "P0001"
          ? "Terlalu banyak ulasan dalam waktu singkat. Coba lagi nanti."
          : "Maaf, ulasan gagal terkirim. Coba lagi sebentar lagi.",
      waktu: Date.now(),
    };
  }

  // Ulasan baru belum tampil (menunggu persetujuan), tapi cache testimoni
  // disegarkan agar daftar selalu konsisten dengan database.
  revalidateTag(TAG.testimoni, "max");
  return { status: "sukses", waktu: Date.now() };
}
