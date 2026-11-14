"use server";

import { redirect } from "next/navigation";
import { supabaseSesi } from "@/lib/supabase/sesi";
import { lewatBatas } from "@/lib/utils/batas";

export type HasilLogin = { pesan?: string; email?: string };

/** Hanya izinkan kembali ke halaman di dalam /admin (cegah open redirect). */
function tujuanAman(v: FormDataEntryValue | null) {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/admin") && !s.startsWith("//") ? s : "/admin";
}

export async function masuk(_awal: HasilLogin, form: FormData): Promise<HasilLogin> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const sandi = String(form.get("sandi") ?? "");
  if (!email || !sandi) return { pesan: "Isi email dan kata sandi.", email };

  if (await lewatBatas("login", 8, 10 * 60_000)) {
    return { pesan: "Terlalu banyak percobaan masuk. Tunggu 10 menit lalu coba lagi.", email };
  }

  const db = await supabaseSesi();
  if (!db) return { pesan: "Supabase belum dikonfigurasi (.env.local).", email };

  const { error } = await db.auth.signInWithPassword({ email, password: sandi });
  if (error) {
    console.error("Login admin gagal:", error.code, error.message);
    const pesan =
      error.code === "email_not_confirmed"
        ? "Email ini belum dikonfirmasi. Di Supabase > Authentication > Users, buka user ini lalu pilih Confirm email (atau buat ulang dengan 'Auto Confirm User' dicentang)."
        : error.code === "invalid_credentials"
          ? "Email atau kata sandi salah. Pastikan user sudah dibuat di Supabase > Authentication > Users dan kata sandinya sama."
          : error.code === "over_request_rate_limit" || error.status === 429
            ? "Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi."
            : `Gagal masuk: ${error.message}`;
    return { pesan, email };
  }

  const { data: admin } = await db.rpc("is_admin");
  if (admin !== true) {
    await db.auth.signOut();
    return {
      pesan: "Akun ini belum terdaftar sebagai admin. Hubungi pengelola website.",
      email,
    };
  }

  redirect(tujuanAman(form.get("lanjut")));
}

export async function keluar() {
  const db = await supabaseSesi();
  await db?.auth.signOut();
  redirect("/admin/login?keluar=1");
}
