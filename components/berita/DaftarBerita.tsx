"use client";

import { useState } from "react";
import { kategoriArtikel, type Artikel, type KategoriArtikel } from "@/lib/data/berita";
import { cn } from "@/lib/utils/cn";
import { KartuBerita } from "./KartuBerita";

export function DaftarBerita({ daftar }: { daftar: Artikel[] }) {
  const [aktif, setAktif] = useState<KategoriArtikel | null>(null);
  const tersedia = kategoriArtikel.filter((k) => daftar.some((a) => a.kategori === k));
  const hasil = aktif ? daftar.filter((a) => a.kategori === aktif) : daftar;

  const chip = (label: string, pilih: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={pilih}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-4 text-sm font-semibold transition-colors",
        pilih
          ? "border-herbal bg-herbal text-krem"
          : "border-herbal/15 bg-white/60 text-herbal hover:border-herbal/40",
      )}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori artikel"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {chip("Semua", !aktif, () => setAktif(null))}
        {tersedia.map((k) => chip(k, aktif === k, () => setAktif(aktif === k ? null : k)))}
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {hasil.map((a) => (
          <li key={a.slug}>
            <KartuBerita a={a} />
          </li>
        ))}
      </ul>
    </div>
  );
}
