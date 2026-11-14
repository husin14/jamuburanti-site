"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { kategoriGaleri, type ItemGaleri, type KategoriGaleri } from "@/lib/data/galeri";
import { propsFotoUkuran } from "@/lib/data/foto";
import { cn } from "@/lib/utils/cn";

export function GaleriGrid({ daftar }: { daftar: ItemGaleri[] }) {
  const [aktif, setAktif] = useState<KategoriGaleri | null>(null);
  const [buka, setBuka] = useState<number | null>(null);
  const tombolTutup = useRef<HTMLButtonElement>(null);
  const pemicu = useRef<HTMLElement | null>(null);
  const sentuhX = useRef<number | null>(null);

  // Hanya tampilkan kategori yang punya foto
  const tersedia = kategoriGaleri.filter((k) => daftar.some((g) => g.kategori === k));
  const hasil = aktif ? daftar.filter((g) => g.kategori === aktif) : daftar;
  const item = buka !== null ? hasil[buka] : null;

  const geser = useCallback(
    (arah: 1 | -1) =>
      setBuka((i) => (i === null ? i : (i + arah + hasil.length) % hasil.length)),
    [hasil.length],
  );

  const tutup = useCallback(() => {
    setBuka(null);
    pemicu.current?.focus();
  }, []);

  useEffect(() => {
    if (buka === null) return;
    tombolTutup.current?.focus();
    document.body.style.overflow = "hidden";
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutup();
      if (e.key === "ArrowRight") geser(1);
      if (e.key === "ArrowLeft") geser(-1);
    };
    window.addEventListener("keydown", tekan);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", tekan);
    };
  }, [buka, geser, tutup]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter kategori galeri"
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[null, ...tersedia].map((k) => {
          const pilih = aktif === k;
          const jumlah = k ? daftar.filter((g) => g.kategori === k).length : daftar.length;
          return (
            <button
              key={k ?? "semua"}
              type="button"
              aria-pressed={pilih}
              onClick={() => setAktif(k)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                pilih
                  ? "border-herbal bg-herbal text-krem"
                  : "border-herbal/15 bg-white/60 text-herbal hover:border-herbal/40",
              )}
            >
              {k ?? "Semua"}
              <span className={cn("text-xs", pilih ? "text-krem/75" : "text-herbal/60")}>
                {jumlah}
              </span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 columns-2 gap-3 sm:gap-4 lg:columns-3">
        {hasil.map((g, i) => (
          <li key={g.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={(e) => {
                pemicu.current = e.currentTarget;
                setBuka(i);
              }}
              className="group relative block w-full overflow-hidden rounded-[1.25rem] text-left sm:rounded-[1.5rem]"
            >
              <Image
                {...propsFotoUkuran(g.foto)}
                alt={g.foto.alt}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="h-auto w-full transition duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-linear-to-t from-herbal/85 via-herbal/10 to-transparent opacity-90 transition group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-kunyit">
                  {g.kategori}
                </span>
                <span className="mt-0.5 block text-sm font-semibold leading-snug text-krem">
                  {g.judul}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {item && buka !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${buka + 1} dari ${hasil.length}: ${item.judul}`}
          className="fixed inset-0 z-50 flex flex-col bg-herbal/95 p-4 text-krem sm:p-8"
          onClick={(e) => e.target === e.currentTarget && tutup()}
          onTouchStart={(e) => (sentuhX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (sentuhX.current === null) return;
            const dx = e.changedTouches[0].clientX - sentuhX.current;
            if (Math.abs(dx) > 50) geser(dx < 0 ? 1 : -1);
            sentuhX.current = null;
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-krem/80" aria-live="polite">
              {buka + 1} / {hasil.length}
            </p>
            <button
              ref={tombolTutup}
              type="button"
              onClick={tutup}
              aria-label="Tutup"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-krem/10 hover:bg-krem/20"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative my-4 flex min-h-0 flex-1 items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && tutup()}
          >
            <Image
              key={item.id}
              {...propsFotoUkuran(item.foto)}
              alt={item.foto.alt}
              sizes="100vw"
              className="h-auto max-h-full w-auto max-w-full rounded-2xl object-contain"
            />
          </div>

          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => geser(-1)}
              aria-label="Foto sebelumnya"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-krem/10 hover:bg-krem/20"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-kunyit">
                {item.kategori}
              </p>
              <p className="mt-1 font-semibold">{item.judul}</p>
            </div>
            <button
              type="button"
              onClick={() => geser(1)}
              aria-label="Foto berikutnya"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-krem/10 hover:bg-krem/20"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
