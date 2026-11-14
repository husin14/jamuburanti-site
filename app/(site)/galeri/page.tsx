import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { KepalaHalaman } from "@/components/ui/Judul";
import { GaleriGrid } from "@/components/galeri/GaleriGrid";
import { getGaleri, getPengaturan } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Dokumentasi Jamu Bu Ranti: produk dan kemasan, aktivitas produksi, pameran UMKM, serta kegiatan bersama pelanggan.",
};

export default async function HalamanGaleri() {
  const [galeri, atur] = await Promise.all([getGaleri(), getPengaturan()]);
  return (
    <>
      <KepalaHalaman
        eyebrow="Galeri"
        judul="Intip keseharian dapur jamu kami"
        deskripsi="Dari meracik rimpang segar sampai hampers siap kirim."
      />
      <section aria-label="Foto" className="wadah py-12">
        <GaleriGrid daftar={galeri} />
        <p className="mt-6 flex items-center gap-2 text-sm text-herbal/75">
          <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
          Lebih banyak dokumentasi di Instagram{" "}
          <a
            href={atur.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-daun underline-offset-4 hover:underline"
          >
            {atur.instagramAkun}
          </a>
        </p>
      </section>
    </>
  );
}
