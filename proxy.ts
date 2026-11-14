import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy (dulu "middleware") khusus /admin:
 * - menyegarkan sesi login Supabase (cookie),
 * - mengarahkan pengunjung yang belum login ke /admin/login.
 * Pemeriksaan hak admin yang sesungguhnya tetap dilakukan di setiap halaman
 * dan Server Action (lib/admin/auth.ts), tidak hanya di sini.
 */
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !kunci) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, kunci, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(daftar, headers) {
        daftar.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        daftar.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const halamanLogin = pathname === "/admin/login";

  if (!user && !halamanLogin) {
    const tujuan = request.nextUrl.clone();
    tujuan.pathname = "/admin/login";
    tujuan.search = `?lanjut=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(tujuan);
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
