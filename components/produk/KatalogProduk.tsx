"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { kategoriKebutuhan, cariKategori } from "@/lib/data/kategori";
import type { Produk } from "@/lib/data/produk";
import { cn } from "@/lib/utils/cn";
import { KartuProduk } from "./KartuProduk";

const kelasChip =
  "inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-4 text-sm font-semibold transition-colors";

/** Grid produk dengan filter kategori kebutuhan (?kategori=...) dan pencarian nama. */
export function KatalogProduk({ daftar }: { daftar: Produk[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const kategoriAktif = cariKategori(params.get("kategori"))?.slug ?? null;
  const [kata, setKata] = useState(params.get("q") ?? "");

  const hasil = useMemo(() => {
    const q = kata.trim().toLowerCase();
    return daftar.filter(
      (p) =>
        (!kategoriAktif || p.kategori.includes(kategoriAktif)) &&
        (!q || p.nama.toLowerCase().includes(q)),
    );
  }, [daftar, kategoriAktif, kata]);

  function pilihKategori(slug: string | null) {
    const baru = new URLSearchParams(params.toString());
    if (slug) baru.set("kategori", slug);
    else baru.delete("kategori");
    const qs = baru.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter kebutuhan"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          <button
            type="button"
            onClick={() => pilihKategori(null)}
            aria-pressed={!kategoriAktif}
            className={cn(
              kelasChip,
              !kategoriAktif
                ? "border-herbal bg-herbal text-krem"
                : "border-herbal/15 bg-white/60 text-herbal hover:border-herbal/40",
            )}
          >
            Semua
          </button>
          {kategoriKebutuhan.map((k) => {
            const aktif = kategoriAktif === k.slug;
            return (
              <button
                key={k.slug}
                type="button"
                onClick={() => pilihKategori(aktif ? null : k.slug)}
                aria-pressed={aktif}
                className={cn(
                  kelasChip,
                  aktif
                    ? "border-herbal bg-herbal text-krem"
                    : "border-herbal/15 bg-white/60 text-herbal hover:border-herbal/40",
                )}
              >
                {k.label}
              </button>
            );
          })}
        </div>

        <label className="relative block w-full lg:max-w-xs">
          <span className="sr-only">Cari nama jamu</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-herbal/60"
            aria-hidden="true"
          />
          <input
            type="search"
            value={kata}
            onChange={(e) => setKata(e.target.value)}
            placeholder="Cari jamu, mis. kunir asem"
            className="min-h-12 w-full rounded-full border-2 border-herbal/15 bg-white/80 py-2 pl-12 pr-4 text-base text-herbal placeholder:text-herbal/50 focus:border-daun"
          />
        </label>
      </div>

      <p className="mt-6 text-sm text-herbal/75" aria-live="polite">
        Menampilkan <strong className="text-herbal">{hasil.length}</strong> jamu
        {kategoriAktif && (
          <>
            {" "}
            untuk <strong className="text-herbal">{cariKategori(kategoriAktif)?.label}</strong>
          </>
        )}
        {kata.trim() && (
          <>
            {" "}
            dengan kata &ldquo;{kata.trim()}&rdquo;
          </>
        )}
      </p>

      {hasil.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {hasil.map((p) => (
            <li key={p.slug}>
              <KartuProduk p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-[1.75rem] bg-jahe/70 p-10 text-center">
          <p className="font-display text-2xl font-semibold">
            Jamu yang kamu cari belum ada.
          </p>
          <p className="mt-2 text-herbal/80">
            Coba kata lain, atau tanyakan langsung lewat WhatsApp.
          </p>
          <button
            type="button"
            onClick={() => {
              setKata("");
              pilihKategori(null);
            }}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-herbal px-5 font-semibold hover:bg-herbal hover:text-krem"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Hapus filter
          </button>
        </div>
      )}
    </div>
  );
}
