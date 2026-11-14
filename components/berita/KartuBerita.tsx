import Link from "next/link";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { OrnamenDaun, OrnamenRimpang } from "@/components/ui/Ikon";
import { formatTanggal, type Artikel } from "@/lib/data/berita";

/** Sampul ilustrasi (tanpa foto media agar tidak memakai gambar berhak cipta). */
export function SampulArtikel({ a, besar = false }: { a: Artikel; besar?: boolean }) {
  return (
    <div
      className="relative isolate flex aspect-[16/9] flex-col justify-between overflow-hidden p-5"
      style={{ backgroundColor: a.sampul.warna, color: a.sampul.aksen }}
    >
      <OrnamenDaun className="absolute -right-6 -top-6 -z-10 h-32 w-32 opacity-25" />
      <OrnamenRimpang className="absolute -bottom-6 -left-4 -z-10 h-24 w-36 opacity-20" />
      <span className="inline-flex items-center gap-2 self-start rounded-full bg-black/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
        {a.urlEksternal ? (
          <Newspaper className="h-3.5 w-3.5" aria-hidden="true" />
        ) : null}
        {a.urlEksternal ? "Liputan media" : "Artikel Jamu Bu Ranti"}
      </span>
      {/* Kartu kecil: nama media besar (judul sudah ada di bawah sampul).
          Halaman detail: judul artikel. */}
      <p
        className={
          besar
            ? "font-display text-3xl font-semibold leading-tight sm:text-4xl"
            : "font-display text-3xl font-semibold leading-tight"
        }
        aria-hidden="true"
      >
        {besar ? a.judul : (a.sumber ?? a.kategori)}
      </p>
    </div>
  );
}

export function KartuBerita({ a }: { a: Artikel }) {
  const eksternal = Boolean(a.urlEksternal);
  const kelasTautan =
    "after:absolute after:inset-0 after:rounded-[1.75rem] rounded-sm";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white/80 ring-1 ring-herbal/10 transition duration-300 hover:-translate-y-1 hover:shadow-lembut">
      <SampulArtikel a={a} />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-daun">
          {a.kategori}
        </p>
        <h3 className="mt-2 text-lg font-semibold leading-snug">
          {eksternal ? (
            <a
              href={a.urlEksternal!}
              target="_blank"
              rel="noopener noreferrer"
              className={kelasTautan}
            >
              {a.judul}
              <span className="sr-only"> (membuka situs {a.sumber} di tab baru)</span>
            </a>
          ) : (
            <Link href={`/berita/${a.slug}`} className={kelasTautan}>
              {a.judul}
            </Link>
          )}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-herbal/80">
          {a.ringkasan}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm text-herbal/75">
          <span>
            {a.tanggal ? formatTanggal(a.tanggal) : "Artikel"}
            {a.penulis ? ` · ${a.penulis}` : ""}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-herbal">
            {eksternal ? "Baca di sumber" : "Baca"}
            <ArrowUpRight
              className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
