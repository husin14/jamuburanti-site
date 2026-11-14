import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SampulArtikel, KartuBerita } from "@/components/berita/KartuBerita";
import { TombolTautan, TombolWhatsApp } from "@/components/ui/Tombol";
import { formatTanggal } from "@/lib/data/berita";
import { getArtikel, getArtikelBySlug } from "@/lib/data/repo";

type Props = { params: Promise<{ slug: string }> };

/** Hanya artikel internal yang punya halaman sendiri; liputan media membuka situs sumber. */
export async function generateStaticParams() {
  return (await getArtikel()).filter((a) => a.isi).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getArtikelBySlug((await params).slug);
  if (!a) return {};
  return { title: a.judul, description: a.ringkasan };
}

export default async function DetailArtikel({ params }: Props) {
  const { slug } = await params;
  const semua = await getArtikel();
  const a = semua.find((x) => x.slug === slug);
  if (!a) notFound();
  if (!a.isi) redirect(a.urlEksternal ?? "/berita");

  const lainnya = semua.filter((x) => x.slug !== a.slug).slice(0, 3);

  return (
    <>
      <article className="wadah max-w-3xl pb-16 pt-6">
        <Link
          href="/berita"
          className="inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-herbal/80 hover:text-herbal"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Semua berita
        </Link>

        <header className="mt-4">
          <p className="text-sm font-bold uppercase tracking-wider text-daun">
            {a.kategori}
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight sm:text-5xl">
            {a.judul}
          </h1>
          <p className="mt-4 text-herbal/75">
            {a.penulis}
            {a.tanggal ? ` · ${formatTanggal(a.tanggal)}` : ""}
          </p>
        </header>

        <div className="mt-8 overflow-hidden rounded-[1.75rem]">
          <SampulArtikel a={a} besar />
        </div>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-herbal/90">
          {a.isi.map((p) =>
            p.startsWith("## ") ? (
              <h2 key={p} className="pt-4 text-2xl font-semibold text-herbal">
                {p.slice(3)}
              </h2>
            ) : (
              <p key={p}>{p}</p>
            ),
          )}
        </div>

        <div className="mt-12 flex flex-col gap-3 rounded-[1.75rem] bg-jahe p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl font-semibold">Mau coba jamunya?</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <TombolTautan href="/produk" varian="sekunder">
              Lihat Produk
            </TombolTautan>
            <TombolWhatsApp />
          </div>
        </div>
      </article>

      <section aria-labelledby="lainnya" className="bg-jahe/60 py-16">
        <div className="wadah">
          <h2 id="lainnya" className="text-3xl font-semibold">
            Baca juga
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {lainnya.map((x) => (
              <li key={x.slug}>
                <KartuBerita a={x} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
