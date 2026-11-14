import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleOff } from "lucide-react";
import { Isi } from "@/components/ui/Isi";
import { JudulSection } from "@/components/ui/Judul";
import { TombolWhatsApp } from "@/components/ui/Tombol";
import { KartuProduk, LencanaProduk, VisualProduk } from "@/components/produk/KartuProduk";
import { ChipOjol, Disclaimer } from "@/components/sections/Pemesanan";
import { labelKategori } from "@/lib/data/kategori";
import { formatHarga } from "@/lib/data/produk";
import { pilihanKemasan } from "@/lib/data/foto";
import {
  cariProdukTerkait,
  getPengaturan,
  getProduk,
  getProdukBySlug,
} from "@/lib/data/repo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProduk()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProdukBySlug((await params).slug);
  if (!p) return {};
  return {
    title: `${p.nama}: Khasiat & Harga`,
    description: `${p.nama} dari Jamu Bu Ranti. ${p.khasiat} ${formatHarga(p)}, pesan via WhatsApp.`,
  };
}

export default async function DetailProduk({ params }: Props) {
  const { slug } = await params;
  const [semua, atur] = await Promise.all([getProduk(), getPengaturan()]);
  const p = semua.find((x) => x.slug === slug);
  if (!p) notFound();
  const terkait = cariProdukTerkait(semua, p);

  return (
    <>
      <div className="wadah pt-6">
        <Link
          href="/produk"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-herbal/80 hover:text-herbal"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Semua produk
        </Link>
      </div>

      <section className="wadah grid gap-10 pb-16 pt-4 lg:grid-cols-2 lg:items-start">
        <div className="group relative lg:sticky lg:top-28">
          <VisualProduk p={p} besar className="aspect-square rounded-[2rem]" />
          <div className="absolute left-4 top-4">
            <LencanaProduk p={p} />
          </div>
        </div>

        <div>
          <ul className="flex flex-wrap gap-2">
            {p.kategori.map((k) => (
              <li key={k}>
                <Link
                  href={`/produk?kategori=${k}`}
                  className="inline-flex rounded-full bg-jahe px-3 py-1 text-sm font-semibold text-daun hover:bg-daun hover:text-krem"
                >
                  {labelKategori(k)}
                </Link>
              </li>
            ))}
          </ul>
          <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{p.nama}</h1>
          <p className="mt-3 text-xl text-herbal/85">{p.ringkas}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <p className="font-display text-3xl font-semibold">
              <span className="rounded-lg bg-kunyit/30 px-2">{formatHarga(p)}</span>
            </p>
            <p className="inline-flex items-center gap-2 text-sm font-semibold">
              {p.tersedia ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-daun" aria-hidden="true" />
                  Tersedia, tanyakan stok hari ini
                </>
              ) : (
                <>
                  <CircleOff className="h-5 w-5 text-rosella" aria-hidden="true" />
                  Sedang habis
                </>
              )}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <TombolWhatsApp produk={p.nama} label={`Pesan ${p.nama}`} varian="wa" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-herbal/80">
              Atau cari &ldquo;{site.nama}&rdquo; di:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {atur.ojol.map((o) => (
                <ChipOjol key={o.nama} nama={o.nama} url={o.url} />
              ))}
            </div>
          </div>

          <dl className="mt-10 divide-y divide-herbal/10 rounded-[1.75rem] bg-white/70 px-6 ring-1 ring-herbal/10">
            <div className="py-5">
              <dt className="text-sm font-bold uppercase tracking-wider text-daun">
                Khasiat tradisional
              </dt>
              <dd className="mt-2 text-lg leading-relaxed">{p.khasiat}</dd>
            </div>
            <div className="py-5">
              <dt className="text-sm font-bold uppercase tracking-wider text-daun">
                Komposisi bahan
              </dt>
              <dd className="mt-2">
                {p.komposisi ?? <Isi>komposisi {p.nama}</Isi>}
              </dd>
            </div>
            <div className="py-5">
              <dt className="text-sm font-bold uppercase tracking-wider text-daun">
                Ukuran kemasan
              </dt>
              <dd className="mt-2">
                {p.ukuran ?? (
                  <>
                    <span className="flex flex-wrap gap-2">
                      {pilihanKemasan.map((k) => (
                        <span
                          key={k.ukuran}
                          className="rounded-full bg-kunyit/25 px-3 py-1 text-sm font-semibold"
                        >
                          {k.ukuran} · {k.bentuk.toLowerCase()}
                        </span>
                      ))}
                    </span>
                    <span className="mt-2 block text-sm text-herbal/75">
                      Tanyakan ketersediaan ukuran {p.nama} lewat WhatsApp.
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>

          <Disclaimer className="mt-6" />
        </div>
      </section>

      {terkait.length > 0 && (
        <section aria-labelledby="terkait" className="bg-jahe/50 py-16">
          <div className="wadah">
            <JudulSection
              eyebrow="Produk terkait"
              judul={<span id="terkait">Cocok juga untukmu</span>}
            />
            <ul className="mt-8 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
              {terkait.map((t) => (
                <li key={t.slug}>
                  <KartuProduk p={t} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
