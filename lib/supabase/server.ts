import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Klien Supabase untuk pengunjung publik (kunci publishable/anon).
 * Semua akses dibatasi Row Level Security di database: hanya membaca konten
 * yang terbit dan mengirim pesan/testimoni. Tidak ada sesi login di sini
 * (login admin ditangani terpisah di Fase 4).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const kunci = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let klien: SupabaseClient | null = null;

/** true bila variabel lingkungan Supabase sudah diisi di .env.local */
export const supabaseTerkonfigurasi = Boolean(url && kunci);

export function supabasePublik(): SupabaseClient | null {
  if (!url || !kunci) return null;
  klien ??= createClient(url, kunci, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return klien;
}
