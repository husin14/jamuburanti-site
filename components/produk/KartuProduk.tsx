import Image from "next/image";
import Link from "next/link";
import { TombolWhatsApp } from "@/components/ui/Tombol";
import { cariKategori } from "@/lib/data/kategori";
import { formatHarga, type Produk } from "@/lib/data/produk";
import { propsFoto } from "@/lib/data/foto";
import { cn } from "@/lib/utils/cn";
import { BotolJamu } from "./BotolJamu";
import { IlustrasiBahan } from "./IlustrasiBahan";

export function LencanaProduk({ p }: { p: Produk }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {!p.tersedia && (
        <span className="rounded-full bg-herbal px-2.5 py-1 text-xs font-bold text-krem">
          Habis
        </span>
      )}
      {p.terlaris && (
        <span className="rounded-full bg-rosella px-2.5 py-1 text-xs font-bold text-krem">
          Terlaris
        </span>
      )}
      {p.baru && (
        <span className="rounded-full bg-daun px-2.5 py-1 text-xs font-bold text-krem">
          Varian Baru
        </span>
      )}
    </div>
  );
}

/** Area visual produk: latar warna jamu, bahan melayang, dan botol. */
export function VisualProduk({
  p,
  className,
  besar = false,
}: {
  p: Produk;
  className?: string;
  besar?: boolean;
}) {
  const [b1, b2] = p.visual.bahan;

  if (p.gambar) {
    return (
      <div
        className={cn("relative isolate overflow-hidden", className)}
        style={{ backgroundColor: p.visual.latar }}
      >
        <Image
          {...propsFoto(p.gambar)}
          alt={p.gambar.alt}
          fill
          sizes={besar ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"}
          preload={besar}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative isolate overflow-hidden", className)}
      style={{ backgroundColor: p.visual.latar }}
    >
      <div
        className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-blob bg-white/45"
        aria-hidden="true"
      />
      {b1 && (
        <IlustrasiBahan
          jenis={b1.jenis}
          warna={b1.warna}
          className={cn(
            "absolute -rotate-12 opacity-90",
            besar ? "left-[8%] top-[10%] w-24" : "left-4 top-10 w-12",
          )}
        />
      )}
      {b2 && (
        <IlustrasiBahan
          jenis={b2.jenis}
          warna={b2.warna}
          className={cn(
            "absolute rotate-12 opacity-90",
            besar ? "bottom-[10%] right-[8%] w-24" : "bottom-5 right-4 w-12",
          )}
        />
      )}
      <BotolJamu
        produk={p}
        className="relative mx-auto h-full w-auto py-[7%] drop-shadow-[0_18px_18px_rgba(31,61,43,0.25)] transition duration-500 group-hover:-rotate-3 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export function KartuProduk({ p }: { p: Produk }) {
  const kategoriUtama = cariKategori(p.kategori[0]);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white/70 ring-1 ring-herbal/8 transition duration-300 hover:-translate-y-1 hover:shadow-lembut">
      <div className="relative">
        <VisualProduk p={p} className="aspect-[4/3.8]" />
        <div className="absolute left-3 top-3">
          <LencanaProduk p={p} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {kategoriUtama && (
          <p className="text-xs font-bold uppercase tracking-wider text-daun">
            {kategoriUtama.singkat}
          </p>
        )}
        <h3 className="mt-1 text-xl font-semibold">
          <Link
            href={`/produk/${p.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:rounded-[1.75rem]"
          >
            {p.nama}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-herbal/80">{p.ringkas}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="text-sm font-bold whitespace-nowrap text-herbal">
            <span className="rounded-md bg-kunyit/25 px-1.5 py-0.5">
              {formatHarga(p)}
            </span>
          </p>
          <TombolWhatsApp
            produk={p.nama}
            label="Pesan"
            varian="wa"
            className="relative z-10 min-h-10 px-4 py-2 text-sm shadow-none"
          />
        </div>
      </div>
    </article>
  );
}
