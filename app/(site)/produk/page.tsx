import type { Metadata } from "next";
import { Suspense } from "react";
import { KepalaHalaman } from "@/components/ui/Judul";
import { KatalogProduk } from "@/components/produk/KatalogProduk";
import {
  CaraPesan,
  Disclaimer,
  PaketHampers,
  PilihanKemasan,
} from "@/components/sections/Pemesanan";
import { infoHarga } from "@/lib/data/produk";
import { getProduk } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Produk & Harga",
  description:
    "20 racikan jamu tradisional Jamu Bu Ranti: kunir asem, beras kencur, temulawak, jahe merah, rosella, dan lainnya. Mulai Rp6 ribu, pesan via WhatsApp atau ojek online.",
};

export default async function HalamanProduk() {
  const produk = await getProduk();
  return (
    <>
      <KepalaHalaman
        eyebrow="Produk"
        judul="Racikan jamu untuk tiap kebutuhanmu"
        deskripsi="Diracik dari rimpang, daun, dan bunga pilihan dengan resep keluarga tiga generasi."
      >
        <dl className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Jamu satuan", `Mulai Rp${infoHarga.satuanMulai} ribu`],
            ["Ukuran besar", `Hingga Rp${infoHarga.besarHingga} ribu`],
            [
              "Paket hampers",
              `Rp${infoHarga.hampersMin}–${infoHarga.hampersMaks} ribu`,
            ],
          ].map(([label, nilai]) => (
            <div key={label} className="rounded-2xl bg-krem/80 px-5 py-4 ring-1 ring-herbal/10">
              <dt className="text-sm text-herbal/75">{label}</dt>
              <dd className="font-display text-xl font-semibold">{nilai}</dd>
            </div>
          ))}
        </dl>
      </KepalaHalaman>

      <section aria-label="Daftar produk" className="wadah py-12">
        <Suspense fallback={<KatalogFallback />}>
          <KatalogProduk daftar={produk} />
        </Suspense>
      </section>

      <PilihanKemasan />
      <PaketHampers />
      <CaraPesan />

      <div className="wadah pb-16">
        <Disclaimer />
      </div>
    </>
  );
}

function KatalogFallback() {
  return (
    <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] animate-pulse rounded-[1.75rem] bg-jahe/70" />
      ))}
    </div>
  );
}
