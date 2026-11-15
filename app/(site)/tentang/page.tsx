import type { Metadata } from "next";
import Image from "next/image";
import { foto } from "@/lib/data/foto";
import {
  BadgeCheck,
  HeartHandshake,
  Leaf,
  MapPin,
  Smartphone,
  Sparkles,
  Sprout,
  Users,
} from "lucide-react";
import { KepalaHalaman, JudulSection } from "@/components/ui/Judul";
import { Muncul } from "@/components/ui/Muncul";
import { TombolTautan } from "@/components/ui/Tombol";
import { OrnamenDaun } from "@/components/ui/Ikon";
import { LogoGambar } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kisah Jamu Bu Ranti: dirintis Bu Suranti di Sukoharjo, berjualan keliling di Semarang sejak sekitar 1980-an, dan kini dilanjutkan generasi ketiga.",
};

/** Sumber: proposal. Jangan menambah fakta baru di sini. */
const linimasa = [
  {
    waktu: "Awal mula",
    judul: "Racikan Bu Ranti di Sukoharjo",
    isi: "Usaha dirintis oleh Bu Suranti, yang akrab disapa Bu Ranti, nenek pemilik sekarang, di Sukoharjo, Jawa Tengah.",
    Ikon: Sprout,
  },
  {
    waktu: "Sekitar 1980-an",
    judul: "Merantau ke Semarang",
    isi: "Bu Ranti merantau ke Kota Semarang dan berjualan keliling rumah ke rumah di wilayah Semeru dan Gajahmungkur: digendong, lalu dengan gerobak dorong, hingga sepeda motor.",
    Ikon: MapPin,
  },
  {
    waktu: "2020",
    judul: "Ikut program KBMI",
    isi: "Cucu perintis, Agnes Oktavi Maharani, mengikuti Program Kreativitas Bisnis Mahasiswa Indonesia (KBMI) dan mendapat pendanaan Rp15 juta serta pendampingan selama 6 bulan.",
    Ikon: BadgeCheck,
  },
  {
    waktu: "Modernisasi",
    judul: "Wajah baru, rasa tetap",
    isi: "Kemasan baru yang lebih menarik, identitas merek yang jelas, dan akun Instagram @jamuburanti untuk menyapa pelanggan.",
    Ikon: Sparkles,
  },
  {
    waktu: "Kini",
    judul: "Generasi ketiga",
    isi: "Menjangkau pelanggan lewat media sosial dan layanan pesan antar, tetap sebagai usaha keluarga generasi ketiga.",
    Ikon: Smartphone,
  },
];

const misi = [
  { Ikon: Leaf, teks: "Mempertahankan resep jamu tradisional." },
  { Ikon: BadgeCheck, teks: "Mengutamakan kualitas bahan baku." },
  { Ikon: Users, teks: "Memperkenalkan minuman tradisional kepada generasi muda." },
  { Ikon: HeartHandshake, teks: "Memberikan pelayanan terbaik kepada pelanggan." },
];

export default function Tentang() {
  return (
    <>
      <KepalaHalaman
        eyebrow="Tentang Kami"
        judul="Melestarikan Jamu Tradisional untuk Generasi Masa Kini"
        deskripsi="Satu resep keluarga, tiga generasi, dan perjalanan panjang dari jalanan kampung Semarang sampai layar ponselmu."
      />

      {/* Narasi */}
      <section className="wadah grid gap-10 py-16 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-sm pb-6 pr-6">
          <div
            className="absolute -left-6 -top-6 h-[75%] w-[85%] rounded-blob bg-daun/90"
            aria-hidden="true"
          />
          <OrnamenDaun className="absolute -right-2 -top-8 z-10 h-24 w-24 text-kunyit" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-lembut ring-8 ring-krem">
            <Image
              src={foto.kunirAsem1L.src}
              alt={foto.kunirAsem1L.alt}
              placeholder="blur"
              fill
              sizes="(min-width: 1024px) 24rem, 90vw"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 flex items-center gap-3 rounded-2xl bg-herbal px-4 py-3 text-krem shadow-lembut">
            <span className="shrink-0 rounded-full bg-krem p-0.5">
              <LogoGambar alt="" sizes="48px" className="w-11" />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none text-kunyit">
                3 generasi
              </span>
              <span className="text-xs text-krem/85">satu resep keluarga</span>
            </span>
          </div>
        </div>
        <div className="space-y-4 text-lg leading-relaxed text-herbal/90">
          <p>
            Jamu Bu Ranti bermula dari racikan <strong>Bu Suranti</strong>, yang
            akrab disapa Bu Ranti, di Sukoharjo, Jawa Tengah. Sekitar tahun
            1980-an, ia merantau ke Kota Semarang dan menjajakan jamunya dari
            rumah ke rumah di wilayah Semeru dan Gajahmungkur.
          </p>
          <p>
            Awalnya jamu digendong, kemudian dibawa dengan gerobak dorong, lalu
            diantar dengan sepeda motor. Pelanggan setia mengenal rasanya yang
            konsisten dari tahun ke tahun.
          </p>
          <p>
            Pada 2020, cucunya, <strong>Agnes Oktavi Maharani</strong>, membawa
            usaha keluarga ini ke babak baru lewat program KBMI. Kemasan
            diperbarui, merek dibangun, dan Jamu Bu Ranti mulai hadir di
            Instagram serta layanan pesan antar, tanpa mengubah resep warisan
            nenek.
          </p>
        </div>
      </section>

      {/* Linimasa */}
      <section aria-labelledby="sejarah" className="bg-herbal py-20 text-krem">
        <div className="wadah">
          <JudulSection
            terang
            eyebrow="Perjalanan Kami"
            judul={<span id="sejarah">Dari Gendongan ke Digital</span>}
          />
          <ol className="relative mt-12 grid gap-8 border-l-2 border-dashed border-kunyit/60 pl-8 lg:grid-cols-5 lg:gap-6 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-10">
            {linimasa.map(({ waktu, judul, isi, Ikon }, i) => (
              <li key={waktu} className="relative">
                <span
                  className="absolute -left-[3.05rem] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-kunyit text-herbal lg:-top-[3.6rem] lg:left-0"
                  aria-hidden="true"
                >
                  <Ikon className="h-5 w-5" />
                </span>
                <Muncul jeda={i * 0.08}>
                  <p className="font-bold text-kunyit">{waktu}</p>
                  <h3 className="mt-1 text-xl font-semibold text-krem">{judul}</h3>
                  <p className="mt-2 leading-relaxed text-krem/85">{isi}</p>
                </Muncul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Visi & Misi */}
      <section aria-labelledby="visi" className="wadah py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-kunyit p-8 sm:p-12">
          <OrnamenDaun className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 text-herbal/10" />
          <p className="text-sm font-bold uppercase tracking-widest text-herbal/80">
            Visi
          </p>
          <h2 id="visi" className="mt-2 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
            Menjadi UMKM minuman tradisional yang dikenal luas dengan
            mempertahankan cita rasa dan kualitas produk.
          </h2>
        </div>

        <h2 className="mt-14 text-3xl font-semibold">Misi kami</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {misi.map(({ Ikon, teks }, i) => (
            <li key={teks}>
              <Muncul jeda={i * 0.08} className="h-full">
                <div className="h-full rounded-[1.5rem] bg-white/70 p-6 ring-1 ring-herbal/10">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-jahe text-daun">
                    <Ikon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-lg font-semibold leading-snug">{teks}</p>
                </div>
              </Muncul>
            </li>
          ))}
        </ul>
      </section>

      <section className="wadah pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-jahe p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-3xl font-semibold">Cicipi resep warisan kami</h2>
            <p className="mt-2 text-lg text-herbal/80">
              20 racikan jamu, dari kunir asem sampai sereh telang.
            </p>
          </div>
          <TombolTautan href="/produk">Lihat Produk</TombolTautan>
        </div>
      </section>
    </>
  );
}
