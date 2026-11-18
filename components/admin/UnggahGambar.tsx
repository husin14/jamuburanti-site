"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { kompresGambar } from "@/lib/utils/kompres-gambar";
import { kelasTombol } from "./UI";

const UKURAN = { maksSisi: 1600, maksByte: 2 * 1024 * 1024 };

/**
 * Unggah gambar ke Supabase Storage (bucket public-images) lalu menyimpan URL-nya
 * di input tersembunyi `name`. Bila `simpanUkuran`, juga mengisi input `width` & `height`.
 */
export function UnggahGambar({
  name,
  awal,
  folder,
  label = "Foto",
  simpanUkuran = false,
  ukuranAwal,
  wajib = false,
}: {
  name: string;
  awal?: string | null;
  folder: string;
  label?: string;
  simpanUkuran?: boolean;
  ukuranAwal?: { width: number | null; height: number | null };
  wajib?: boolean;
}) {
  const [url, setUrl] = useState(awal ?? "");
  const [ukuran, setUkuran] = useState({
    width: ukuranAwal?.width ?? 0,
    height: ukuranAwal?.height ?? 0,
  });
  const [status, setStatus] = useState<"diam" | "proses" | "galat">("diam");
  const [pesan, setPesan] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function pilih(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("galat");
      setPesan("File harus berupa gambar (JPG, PNG, atau WebP).");
      return;
    }
    setStatus("proses");
    setPesan("Mengompres & mengunggah…");
    try {
      const { blob, lebar, tinggi, ekstensi } = await kompresGambar(file, UKURAN);
      const dasar = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
      const jalur = `${folder}/${Date.now()}-${dasar || "foto"}.${ekstensi}`;
      const db = supabaseBrowser();
      const { error } = await db.storage
        .from("public-images")
        .upload(jalur, blob, { contentType: blob.type, cacheControl: "31536000" });
      if (error) throw new Error(error.message);
      const { data } = db.storage.from("public-images").getPublicUrl(jalur);
      setUrl(data.publicUrl);
      setUkuran({ width: lebar, height: tinggi });
      setStatus("diam");
      setPesan(`Terunggah (${Math.round(blob.size / 1024)} KB). Jangan lupa klik Simpan.`);
    } catch (e) {
      setStatus("galat");
      setPesan(e instanceof Error ? `Gagal mengunggah: ${e.message}` : "Gagal mengunggah.");
    } finally {
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">
        {label}
        {wajib && <span className="text-rosella"> *</span>}
      </p>
      <input type="hidden" name={name} value={url} />
      {simpanUkuran && (
        <>
          <input type="hidden" name="width" value={ukuran.width || ""} />
          <input type="hidden" name="height" value={ukuran.height || ""} />
        </>
      )}

      <div className="flex flex-wrap items-start gap-4">
        <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-xl bg-jahe/60 ring-1 ring-herbal/10">
          {url ? (
            <Image src={url} alt="Pratinjau" fill unoptimized sizes="9rem" className="object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-herbal/40" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className={`${kelasTombol.kedua} cursor-pointer`}>
            {status === "proses" ? (
              <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
            )}
            {url ? "Ganti foto" : "Pilih foto"}
            <input
              ref={input}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={status === "proses"}
              onChange={(e) => pilih(e.target.files?.[0])}
            />
          </label>
          {url && (
            <button
              type="button"
              onClick={() => {
                setUrl("");
                setPesan("Foto dilepas. Klik Simpan untuk menerapkan.");
              }}
              className={`${kelasTombol.kedua} min-h-9`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Lepas foto
            </button>
          )}
          <p className="max-w-xs text-xs text-herbal/65">
            JPG/PNG/WebP. Otomatis diperkecil & dikompres (maks. 2 MB).
          </p>
        </div>
      </div>
      {pesan && (
        <p
          role={status === "galat" ? "alert" : "status"}
          className={`mt-2 text-sm font-semibold ${status === "galat" ? "text-rosella" : "text-daun"}`}
        >
          {pesan}
        </p>
      )}
    </div>
  );
}
