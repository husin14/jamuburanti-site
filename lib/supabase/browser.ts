"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Klien Supabase di browser admin (membawa sesi login dari cookie). Dipakai untuk unggah gambar. */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
