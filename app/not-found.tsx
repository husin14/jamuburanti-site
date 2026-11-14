import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { OrnamenDaun, OrnamenRimpang } from "@/components/ui/Ikon";
import { TombolTautan, TombolWhatsApp } from "@/components/ui/Tombol";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
};

export default function TidakDitemukan() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <OrnamenDaun className="pointer-events-none absolute -right-12 top-16 h-64 w-64 rotate-12 text-daun/15" />
      <OrnamenRimpang className="pointer-events-none absolute -left-10 bottom-10 h-44 w-60 text-kunyit/30" />

      <div className="wadah py-6">
        <Logo />
      </div>

      <div className="wadah relative flex flex-1 flex-col items-center justify-center py-16 text-center">
        <p className="font-display text-[7rem] font-semibold leading-none text-kunyit sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Wah, gelasnya kosong.
        </h1>
        <p className="mt-4 max-w-md text-lg text-herbal/85">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk kembali
          ke Beranda dan pilih jamu favoritmu.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <TombolTautan href="/">Kembali ke Beranda</TombolTautan>
          <TombolWhatsApp varian="sekunder" />
        </div>
      </div>
    </main>
  );
}
