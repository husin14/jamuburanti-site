"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { kompresGambar } from "@/lib/utils/kompres-gambar";
import { FOTO_ULASAN } from "@/lib/validasi";
import { cn } from "@/lib/utils/cn";

/**
 * Isian foto opsional di form ulasan. Foto langsung diperkecil di browser
 * (≤ 900 KB, metadata EXIF/GPS terbuang), lalu file hasil kompres itulah
 * yang ikut terkirim bersama form (input `foto`).
 */
export function PilihFoto({ galat }: { galat?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [pratinjau, setPratinjau] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);
  const [pesan, setPesan] = useState<string | null>(null);

  // Lepas URL pratinjau lama agar tidak bocor memori
  useEffect(() => {
    return () => {
      if (pratinjau) URL.revokeObjectURL(pratinjau);
    };
  }, [pratinjau]);

  // Bila form di-reset (mis. setelah terkirim), kosongkan pratinjau juga
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const saatReset = () => {
      setPratinjau(null);
      setPesan(null);
    };
    form.addEventListener("reset", saatReset);
    return () => form.removeEventListener("reset", saatReset);
  }, []);

  function kosongkan() {
    if (input.current) input.current.value = "";
    setPratinjau(null);
  }

  async function pilih(file: File | undefined) {
    const el = input.current;
    if (!el || !file) return;
    setPesan(null);
    if (!file.type.startsWith("image/")) {
      kosongkan();
      setPesan("File harus berupa foto (JPG, PNG, atau WebP).");
      return;
    }
    setMemproses(true);
    try {
      const { blob, ekstensi } = await kompresGambar(file, FOTO_ULASAN);
      const hasil = new File([blob], `foto.${ekstensi}`, { type: blob.type });
      const dt = new DataTransfer();
      dt.items.add(hasil);
      el.files = dt.files;
      setPratinjau(URL.createObjectURL(blob));
    } catch (e) {
      kosongkan();
      setPesan(e instanceof Error ? e.message : "Foto gagal diproses. Coba foto lain.");
    } finally {
      setMemproses(false);
    }
  }

  const galatTampil = pesan ?? galat;

  return (
    <div>
      <p className="mb-1.5 font-semibold">
        Foto <span className="font-normal text-herbal/60">(opsional)</span>
      </p>
      <div
        className={cn(
          "flex items-center gap-4 rounded-2xl border-2 border-dashed bg-white/50 p-3 transition-colors",
          galatTampil ? "border-rosella/50" : "border-herbal/20",
        )}
      >
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-jahe/70 sm:h-24 sm:w-24">
          {pratinjau ? (
            <Image
              src={pratinjau}
              alt="Pratinjau foto yang dipilih"
              fill
              unoptimized
              sizes="6rem"
              className="object-cover"
            />
          ) : memproses ? (
            <LoaderCircle className="h-7 w-7 text-herbal/50 motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <Camera className="h-7 w-7 text-herbal/45" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <label
              className={cn(
                "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border-2 border-herbal/80 px-4 text-sm font-semibold transition hover:bg-herbal hover:text-krem focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-telang",
                memproses && "pointer-events-none opacity-60",
              )}
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {memproses ? "Memproses…" : pratinjau ? "Ganti foto" : "Pilih foto"}
              <input
                ref={input}
                type="file"
                name="foto"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={memproses}
                aria-invalid={Boolean(galatTampil)}
                aria-describedby="t-foto-info"
                onChange={(e) => pilih(e.target.files?.[0])}
              />
            </label>
            {pratinjau && !memproses && (
              <button
                type="button"
                onClick={kosongkan}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-rosella hover:bg-rosella/10"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Hapus
              </button>
            )}
          </div>
          <p id="t-foto-info" className="mt-1.5 text-xs leading-relaxed text-herbal/65">
            Foto jamu atau momen ngejamu-mu. JPG/PNG/WebP, otomatis diperkecil.
            Tampil setelah dicek admin.
          </p>
        </div>
      </div>
      {galatTampil && (
        <p role="alert" className="mt-1 text-sm font-semibold text-rosella">
          {galatTampil}
        </p>
      )}
    </div>
  );
}
