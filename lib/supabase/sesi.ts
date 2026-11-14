import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Klien Supabase yang membawa sesi login (cookie) pengguna.
 * Dipakai di panel admin: semua tulis-ubah berjalan sebagai user yang login,
 * jadi tetap dijaga RLS (is_admin()) — tanpa kunci rahasia.
 */
export async function supabaseSesi() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !kunci) return null;

  const toko = await cookies();
  return createServerClient(url, kunci, {
    cookies: {
      getAll: () => toko.getAll(),
      setAll(daftar) {
        try {
          daftar.forEach(({ name, value, options }) => toko.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (cookie read-only); proxy yang menyegarkan sesi.
        }
      },
    },
  });
}
