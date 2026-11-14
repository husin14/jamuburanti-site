"use client";

import { useActionState } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import { masuk, type HasilLogin } from "@/app/admin/actions/auth";
import { kelasInput } from "@/components/ui/Form";

const awal: HasilLogin = {};

export function FormLogin({ lanjut }: { lanjut: string }) {
  const [hasil, aksi, menunggu] = useActionState(masuk, awal);

  return (
    <form action={aksi} className="mt-6 space-y-4">
      <input type="hidden" name="lanjut" value={lanjut} />
      {hasil.pesan && (
        <p role="alert" className="rounded-xl bg-rosella/10 p-3 text-sm font-semibold text-rosella">
          {hasil.pesan}
        </p>
      )}
      <div>
        <label htmlFor="email" className="mb-1.5 block font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={hasil.email}
          className={kelasInput}
        />
      </div>
      <div>
        <label htmlFor="sandi" className="mb-1.5 block font-semibold">
          Kata sandi
        </label>
        <input
          id="sandi"
          name="sandi"
          type="password"
          autoComplete="current-password"
          required
          className={kelasInput}
        />
      </div>
      <button
        type="submit"
        disabled={menunggu}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-herbal px-6 font-semibold text-krem transition hover:bg-daun disabled:opacity-70"
      >
        {menunggu ? (
          <LoaderCircle className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          <LogIn className="h-5 w-5" aria-hidden="true" />
        )}
        {menunggu ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
