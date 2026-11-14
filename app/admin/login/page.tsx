import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { FormLogin } from "@/components/admin/FormLogin";

export const metadata: Metadata = { title: "Masuk" };

type Props = { searchParams: Promise<{ lanjut?: string; alasan?: string; keluar?: string }> };

export default async function HalamanLogin({ searchParams }: Props) {
  const { lanjut, alasan, keluar } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-[1.75rem] bg-white p-7 shadow-lembut ring-1 ring-herbal/10">
          <h1 className="text-2xl font-semibold">Masuk Panel Admin</h1>
          <p className="mt-1 text-sm text-herbal/75">
            Khusus pengelola website Jamu Bu Ranti.
          </p>
          {keluar && (
            <p role="status" className="mt-4 rounded-xl bg-daun/10 p-3 text-sm font-semibold text-daun">
              Kamu sudah keluar.
            </p>
          )}
          {alasan === "bukan-admin" && (
            <p role="alert" className="mt-4 rounded-xl bg-rosella/10 p-3 text-sm font-semibold text-rosella">
              Akun yang sedang login bukan admin.
            </p>
          )}
          <FormLogin lanjut={lanjut ?? "/admin"} />
        </div>
        <p className="mt-6 text-center text-sm text-herbal/70">
          Lupa kata sandi? Reset lewat dashboard Supabase (Authentication → Users).
        </p>
      </div>
    </main>
  );
}
