import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, Kosong } from "@/components/admin/Kepala";
import { kelasTombol } from "@/components/admin/UI";
import { BotolJamu } from "@/components/produk/BotolJamu";
import { fotoDariUrl, propsFoto } from "@/lib/data/foto";
import { labelKategori, type KategoriSlug } from "@/lib/data/kategori";

export const metadata = { title: "Produk" };

type Props = { searchParams: Promise<{ pesan?: string }> };

export default async function DaftarProdukAdmin({ searchParams }: Props) {
  const { db } = await wajibAdmin();
  const { pesan } = await searchParams;
  const { data: produk } = await db
    .from("products")
    .select("id, slug, name, categories, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order, price_min")
    .order("sort_order")
    .order("name");

  return (
    <>
      <KepalaAdmin judul="Produk" deskripsi={`${produk?.length ?? 0} jamu. Klik produk untuk mengubah.`}>
        <Link href="/admin/produk/baru" className={kelasTombol.utama}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah produk
        </Link>
      </KepalaAdmin>

      {pesan && (
        <p role="status" className="mb-6 rounded-xl bg-daun/10 p-3 text-sm font-semibold text-daun">
          {pesan}
        </p>
      )}

      {!produk || produk.length === 0 ? (
        <Kosong>Belum ada produk.</Kosong>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {produk.map((p) => {
            const visual = {
              cairan: p.visual?.cairan ?? "#E8A317",
              latar: p.visual?.latar ?? "#F3E6CF",
              bahan: p.visual?.bahan ?? [],
            };
            const foto = p.image_url ? fotoDariUrl(p.image_url, p.image_alt ?? p.name) : null;
            return (
              <li key={p.id}>
                <Link
                  href={`/admin/produk/${p.id}`}
                  className="flex gap-4 rounded-[1.25rem] bg-white p-3 ring-1 ring-herbal/10 transition hover:ring-2 hover:ring-kunyit"
                >
                  <span
                    className="relative flex h-20 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                    style={{ backgroundColor: visual.latar }}
                  >
                    {foto ? (
                      <Image {...propsFoto(foto)} alt="" fill sizes="4rem" className="object-cover" />
                    ) : (
                      <BotolJamu produk={{ nama: p.name, visual }} className="h-[90%] w-auto" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-herbal/65">
                      {(p.categories as KategoriSlug[]).map(labelKategori).join(", ") || "Tanpa kategori"}
                    </span>
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {!p.is_published && <Lencana warna="bg-herbal/15">Disembunyikan</Lencana>}
                      {!p.is_available && <Lencana warna="bg-herbal text-krem">Habis</Lencana>}
                      {p.is_bestseller && <Lencana warna="bg-rosella text-krem">Terlaris</Lencana>}
                      {p.is_new && <Lencana warna="bg-daun text-krem">Baru</Lencana>}
                      {p.price_min == null && <Lencana warna="bg-kunyit/30">Harga belum diisi</Lencana>}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function Lencana({ children, warna }: { children: React.ReactNode; warna: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${warna}`}>{children}</span>;
}
