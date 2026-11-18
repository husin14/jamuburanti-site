"use client";

import { useRef } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Foto di kartu testimoni (selebar kartu); klik untuk memperbesar.
 * `potret` = lebih tinggi & dipotong dari atas, cocok untuk screenshot chat.
 * Memakai <dialog> bawaan browser: fokus terkunci di dalam, Esc menutup,
 * dan fokus kembali ke thumbnail setelah ditutup.
 */
export function FotoUlasan({
  src,
  nama,
  potret = false,
  className,
}: {
  src: string;
  nama: string;
  potret?: boolean;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const alt = `Foto dari ulasan ${nama}`;

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Perbesar foto dari ${nama}`}
        className={cn(
          "group/foto relative block w-full overflow-hidden rounded-2xl bg-jahe/60 ring-1 ring-herbal/10",
          potret ? "aspect-[4/5]" : "aspect-[4/3]",
          className,
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 85vw"
          className={cn(
            "object-cover transition duration-500 group-hover/foto:scale-105",
            potret && "object-top",
          )}
        />
        <span
          className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-herbal/80 px-3 py-1.5 text-xs font-semibold text-krem shadow-sm backdrop-blur-sm transition group-hover/foto:bg-herbal"
          aria-hidden="true"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          Perbesar
        </span>
      </button>

      <dialog
        ref={dialog}
        aria-label={alt}
        // Klik di mana saja menutup (termasuk tombol X)
        onClick={() => dialog.current?.close()}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-4 text-krem backdrop:bg-herbal/90 backdrop:backdrop-blur-sm sm:p-8"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-krem/80">Foto dari {nama}</p>
            <button
              type="button"
              aria-label="Tutup"
              autoFocus
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-krem/10 hover:bg-krem/20"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="relative my-4 min-h-0 flex-1">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="pointer-events-none object-contain"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
