import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Footprints,
  Leaf,
  Motorbike,
  ShoppingCart,
  Smartphone,
  Store,
} from "lucide-react";
import { TombolTautan, TombolWhatsApp } from "@/components/ui/Tombol";
import { IkonInstagram, IkonWhatsApp, OrnamenDaun, OrnamenRimpang } from "@/components/ui/Ikon";
import { IkonKategori } from "@/components/ui/IkonKategori";
import { JudulSection } from "@/components/ui/Judul";
import { Muncul } from "@/components/ui/Muncul";
import { KartuProduk } from "@/components/produk/KartuProduk";
import { KartuBerita } from "@/components/berita/KartuBerita";
import { KartuTestimoni } from "@/components/testimoni/KartuTestimoni";
import { PaketHampers } from "@/components/sections/Pemesanan";
import { StatusBuka } from "@/components/kontak/StatusBuka";
import { kategoriKebutuhan } from "@/lib/data/kategori";
import type { Produk } from "@/lib/data/produk";
import type { Artikel } from "@/lib/data/berita";
import type { Testimoni } from "@/lib/data/testimoni";
import { foto } from "@/lib/data/foto";
import {
  getArtikel,
  getLiputanMedia,
  getPengaturan,
  getProduk,
  getTestimoni,
  type Pengaturan,
} from "@/lib/data/repo";
import { site } from "@/lib/site";
import { waLinkUmum } from "@/lib/utils/whatsapp";
import { cn } from "@/lib/utils/cn";

const perjalanan = [
  { Ikon: Footprints, judul: "Digendong", isi: "Keliling dari rumah ke rumah" },
  { Ikon: ShoppingCart, judul: "Gerobak", isi: "Menjangkau lebih banyak gang" },
  { Ikon: Motorbike, judul: "Sepeda motor", isi: "Semeru sampai Gajahmungkur" },
  { Ikon: Smartphone, judul: "Digital", isi: "Pesan dari ponsel, diantar" },
];

export default async function Beranda() {
  const [produk, artikel, liputan, testimoni, atur] = await Promise.all([
    getProduk(),
    getArtikel(),
    getLiputanMedia(),
    getTestimoni(),
    getPengaturan(),
  ]);

  return (
    <>
      <Hero />
      <StripPesanLewat atur={atur} />
      <ProdukTerlaris produk={produk} />
      <CariKebutuhan produk={produk} />
      <CeritaSingkat />
      <div className="py-10">
        <PaketHampers />
      </div>
      <MomenFoto />
      {liputan.length > 0 && <DiliputMedia liputan={liputan} />}
      <TestimoniTerbaru testimoni={testimoni} />
      {artikel.length > 0 && <ArtikelTerbaru artikel={artikel} />}
      <CtaPenutup />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <OrnamenDaun className="pointer-events-none absolute -left-16 top-24 h-64 w-64 -rotate-12 text-daun/15" />
      <OrnamenRimpang className="pointer-events-none absolute bottom-6 left-1/3 hidden h-40 w-56 text-kunyit/25 lg:block" />

      <div className="wadah grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2 lg:py-24">
        <div className="relative animate-naik-pelan">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-jahe px-4 py-2 text-sm font-semibold text-herbal">
            <span className="h-2 w-2 rounded-full bg-daun" aria-hidden="true" />
            Jamu tradisional dari Semarang
          </p>
          <h1 className="text-[2.75rem] font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
            Nikmat Rasanya,{" "}
            <span className="relative inline-block text-daun">
              Terjaga
              <svg
                viewBox="0 0 200 14"
                aria-hidden="true"
                preserveAspectRatio="none"
                className="absolute -bottom-1 left-0 h-3 w-full text-kunyit"
              >
                <path
                  d="M3 9c40-8 120-8 194-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            Khasiatnya
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-herbal/85">
            Jamu racikan keluarga sejak tiga generasi, kini lebih segar untuk
            gaya hidupmu.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TombolWhatsApp />
            <TombolTautan href="/produk" varian="sekunder">
              Lihat Produk
            </TombolTautan>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-herbal/80">
            <Clock className="h-4 w-4" aria-hidden="true" />
            Buka {site.jamBuka.teks.toLowerCase()}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md pb-8 pl-6 pr-2 sm:pl-10">
          <div
            className="absolute -right-6 top-6 h-[85%] w-[85%] rounded-blob bg-kunyit/90"
            aria-hidden="true"
          />
          <div
            className="absolute -left-2 bottom-0 h-[60%] w-[60%] -rotate-6 rounded-blob border-2 border-dashed border-daun/40"
            aria-hidden="true"
          />

          {/* Foto utama */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lembut ring-8 ring-krem">
            <Image
              src={foto.temulawak.src}
              alt={foto.temulawak.alt}
              placeholder="blur"
              fill
              preload
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>

          {/* Foto kecil menumpuk */}
          <div className="absolute -bottom-2 -left-2 w-[42%] rotate-[-7deg] overflow-hidden rounded-[1.5rem] shadow-lembut ring-4 ring-krem sm:-left-4 motion-safe:animate-melayang">
            <Image
              src={foto.jaheMerah.src}
              alt={foto.jaheMerah.alt}
              placeholder="blur"
              sizes="12rem"
              className="h-auto w-full"
            />
          </div>

          {/* Lencana mengambang */}
          <p className="absolute -right-2 top-8 inline-flex items-center gap-2 rounded-full bg-krem px-4 py-2 text-sm font-bold text-herbal shadow-lembut sm:-right-6">
            <Leaf className="h-4 w-4 text-daun" aria-hidden="true" />
            Tanpa bahan pengawet
          </p>
          <p className="absolute -right-1 bottom-24 rounded-2xl bg-herbal px-4 py-3 text-krem shadow-lembut sm:-right-5">
            <span className="block font-display text-2xl font-semibold leading-none text-kunyit">
              3 generasi
            </span>
            <span className="text-xs">resep keluarga</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function StripPesanLewat({ atur }: { atur: Pengaturan }) {
  const kelas =
    "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-krem/10 px-4 text-sm font-semibold text-krem";
  return (
    <section aria-label="Pesan lewat" className="bg-herbal text-krem">
      <div className="wadah flex flex-col gap-3 py-5 md:flex-row md:items-center">
        <p className="shrink-0 font-display text-lg font-semibold text-kunyit">
          Pesan lewat
        </p>
        <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          <li>
            <a
              href={waLinkUmum}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(kelas, "bg-wa text-herbal hover:brightness-105")}
            >
              <IkonWhatsApp className="h-4 w-4" />
              WhatsApp
            </a>
          </li>
          {atur.ojol.map((o) => (
            <li key={o.nama}>
              {o.url ? (
                <a href={o.url} target="_blank" rel="noopener noreferrer" className={cn(kelas, "hover:bg-krem/20")}>
                  <Store className="h-4 w-4" aria-hidden="true" />
                  {o.nama}
                </a>
              ) : (
                <span className={kelas} title={`Cari "${site.nama}" di ${o.nama}`}>
                  <Store className="h-4 w-4" aria-hidden="true" />
                  {o.nama}
                </span>
              )}
            </li>
          ))}
          <li>
            <a
              href={atur.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(kelas, "hover:bg-krem/20")}
            >
              <IkonInstagram className="h-4 w-4" />
              Instagram
            </a>
          </li>
        </ul>
        <p className="text-sm text-krem/80 md:ml-auto">
          Cari &ldquo;{site.nama}&rdquo; di aplikasi ojol
        </p>
      </div>
    </section>
  );
}

function ProdukTerlaris({ produk }: { produk: Produk[] }) {
  const terlaris = produk.filter((p) => p.terlaris).slice(0, 4);
  return (
    <section aria-labelledby="terlaris" className="wadah py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <JudulSection
          eyebrow="Produk Terlaris"
          judul={<span id="terlaris">Yang paling sering dipesan ulang</span>}
          deskripsi="Empat racikan favorit pelanggan, dari yang segar sampai yang menghangatkan."
        />
        <Link
          href="/produk"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-daun hover:text-herbal"
        >
          Lihat {produk.length} jamu
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-10 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {terlaris.map((p, i) => (
          <li key={p.slug}>
            <Muncul jeda={i * 0.08} className="h-full">
              <KartuProduk p={p} />
            </Muncul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CariKebutuhan({ produk }: { produk: Produk[] }) {
  const latar = ["#DCE1F4", "#F8E3BF", "#E3EBD3", "#F6D9D6", "#EAF0D6", "#F6EEDD"];
  return (
    <section aria-labelledby="kebutuhan" className="relative overflow-hidden bg-jahe/60 py-20">
      <OrnamenDaun className="pointer-events-none absolute -right-10 top-10 h-48 w-48 text-daun/10" />
      <div className="wadah relative">
        <JudulSection
          tengah
          eyebrow="Cari Jamu Sesuai Kebutuhanmu"
          judul={<span id="kebutuhan">Lagi butuh yang mana hari ini?</span>}
          deskripsi="Pilih kebutuhanmu, kami tunjukkan jamu yang secara tradisional cocok."
        />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {kategoriKebutuhan.map((k, i) => {
            const jumlah = produk.filter((p) => p.kategori.includes(k.slug)).length;
            return (
              <li key={k.slug}>
                <Link
                  href={`/produk?kategori=${k.slug}`}
                  className="group flex h-full flex-col rounded-[1.5rem] p-5 ring-1 ring-herbal/10 transition hover:-translate-y-1 hover:shadow-lembut"
                  style={{ backgroundColor: latar[i] }}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-herbal">
                    <IkonKategori slug={k.slug} className="h-6 w-6" />
                  </span>
                  <span className="mt-4 font-display text-lg font-semibold leading-tight">
                    {k.label}
                  </span>
                  <span className="mt-1 text-sm text-herbal/80">{k.ajakan}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-bold text-daun">
                    {jumlah} jamu
                    <ArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function CeritaSingkat() {
  return (
    <section aria-labelledby="cerita" className="wadah py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
        <JudulSection
          eyebrow="Cerita Kami"
          judul={<span id="cerita">Dari Gendongan ke Digital</span>}
          deskripsi="Bermula dari Bu Ranti yang menjajakan jamu racikannya keliling kampung, kini resep yang sama dilanjutkan cucunya dan bisa kamu pesan dari ponsel."
        />
        <div>
          <ol className="relative grid grid-cols-2 gap-4 sm:grid-cols-4">
            <span
              className="absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dashed border-kunyit sm:block"
              aria-hidden="true"
            />
            {perjalanan.map(({ Ikon, judul, isi }, i) => (
              <li key={judul} className="relative text-center">
                <Muncul jeda={i * 0.1}>
                  <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-kunyit text-herbal shadow-lembut">
                    <Ikon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-display text-lg font-semibold">{judul}</p>
                  <p className="text-sm text-herbal/80">{isi}</p>
                </Muncul>
              </li>
            ))}
          </ol>
          <div className="mt-8 text-center sm:text-left">
            <TombolTautan href="/tentang" varian="sekunder">
              Baca Cerita Kami
            </TombolTautan>
          </div>
        </div>
      </div>
    </section>
  );
}

function MomenFoto() {
  const kolom = [
    [foto.tasDanau, foto.hampersNatal4],
    [foto.kemasan1, foto.tasHijau],
    [foto.hampersRamadan4, foto.traveling],
  ];
  return (
    <section aria-labelledby="momen" className="overflow-hidden bg-herbal py-20 text-krem">
      <div className="wadah">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <JudulSection
            terang
            eyebrow="Galeri"
            judul={<span id="momen">Menemani setiap momenmu</span>}
            deskripsi="Dari bekal piknik di taman sampai hampers hari raya, beginilah Jamu Bu Ranti dinikmati."
          />
          <Link
            href="/galeri"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-kunyit hover:text-krem"
          >
            Lihat galeri
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {kolom.map((isi, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col gap-3 sm:gap-4",
                i === 1 && "md:translate-y-10",
                i === 2 && "hidden md:flex",
              )}
            >
              {isi.map((f, j) => (
                <Muncul key={f.src.src} jeda={(i + j) * 0.08}>
                  <Link
                    href="/galeri"
                    className="group block overflow-hidden rounded-[1.5rem]"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={f.src}
                      alt={f.alt}
                      placeholder="blur"
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="h-auto w-full transition duration-700 group-hover:scale-105"
                    />
                  </Link>
                </Muncul>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiliputMedia({ liputan }: { liputan: { nama: string; url: string }[] }) {
  return (
    <section aria-labelledby="media" className="wadah py-16">
      <p
        id="media"
        className="text-center text-sm font-bold uppercase tracking-widest text-herbal/70"
      >
        Diliput media
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {liputan.map((m) => (
          <li key={m.nama}>
            <a
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-14 items-center gap-2 rounded-2xl bg-white/70 px-6 font-display text-xl font-semibold text-herbal/75 ring-1 ring-herbal/10 transition hover:text-herbal hover:ring-herbal/30"
            >
              {m.nama}
              <ArrowUpRight
                className="h-4 w-4 opacity-0 transition group-hover:opacity-100"
                aria-hidden="true"
              />
              <span className="sr-only">(buka artikel di tab baru)</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TestimoniTerbaru({ testimoni }: { testimoni: Testimoni[] }) {
  const tiga = [...testimoni].sort((a, b) => b.tanggal.localeCompare(a.tanggal)).slice(0, 3);
  return (
    <section aria-labelledby="testimoni" className="bg-jahe/60 py-20">
      <div className="wadah">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <JudulSection
            eyebrow="Kata Pelanggan"
            judul={<span id="testimoni">Diminum, disukai, dipesan lagi</span>}
          />
          <Link
            href="/testimoni"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-daun hover:text-herbal"
          >
            Semua testimoni
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {tiga.length > 0 ? (
          <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {tiga.map((t, i) => (
              <li key={t.id} className="w-[85%] shrink-0 snap-center md:w-auto">
                <KartuTestimoni t={t} indeks={i} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-[1.75rem] bg-krem/80 p-8 text-center ring-1 ring-herbal/10">
            <p className="font-display text-2xl font-semibold">
              Jadilah yang pertama berbagi cerita
            </p>
            <p className="mt-2 text-herbal/80">
              Sudah pernah mencoba jamu kami? Ceritakan pengalamanmu.
            </p>
            <Link
              href="/testimoni#bagikan"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-herbal px-5 font-semibold hover:bg-herbal hover:text-krem"
            >
              Tulis ulasan
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ArtikelTerbaru({ artikel }: { artikel: Artikel[] }) {
  return (
    <section aria-labelledby="artikel" className="wadah py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <JudulSection
          eyebrow="Berita & Artikel"
          judul={<span id="artikel">Kabar terbaru dari dapur jamu</span>}
        />
        <Link
          href="/berita"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-daun hover:text-herbal"
        >
          Semua berita
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {artikel.slice(0, 3).map((a, i) => (
          <li key={a.slug}>
            <Muncul jeda={i * 0.08} className="h-full">
              <KartuBerita a={a} />
            </Muncul>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CtaPenutup() {
  return (
    <section className="wadah pb-20">
      <div className="relative overflow-hidden rounded-[2rem] bg-kunyit px-6 py-14 text-center sm:px-12">
        <OrnamenDaun className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 text-herbal/10" />
        <OrnamenRimpang className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-44 text-herbal/10" />
        <h2 className="relative text-4xl font-semibold sm:text-5xl">
          Haus yang sehat? Pesan sekarang.
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-lg text-herbal/85">
          Jamu diantar segar ke rumahmu. {site.jamBuka.teks}.
        </p>
        <div className="relative mt-5 flex justify-center">
          <StatusBuka />
        </div>
        <div className="relative mt-6 flex justify-center">
          <a
            href={waLinkUmum}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-herbal px-7 py-3 text-base font-semibold text-krem transition hover:-translate-y-0.5"
          >
            <IkonWhatsApp className="h-5 w-5" />
            Pesan via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
