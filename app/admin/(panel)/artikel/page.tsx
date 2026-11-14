import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, Kosong } from "@/components/admin/Kepala";
import { kelasTombol } from "@/components/admin/UI";
import { formatTanggal } from "@/lib/data/berita";

export const metadata = { title: "Artikel" };

type Props = { searchParams: Promise<{ pesan?: string }> };

export default async function DaftarArtikelAdmin({ searchParams }: Props) {
  const { db } = await wajibAdmin();
  const { pesan } = await searchParams;
  const { data: artikel } = await db
    .from("articles")
    .select("id, title, category, source, external_url, published_at, is_published, cover_style")
    .order("published_at", { ascending: false, nullsFirst: true });

  return (
    <>
      <KepalaAdmin judul="Artikel & Berita" deskripsi="Artikel internal dan liputan media.">
        <Link href="/admin/artikel/baru" className={kelasTombol.utama}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah artikel
        </Link>
      </KepalaAdmin>

      {pesan && (
        <p role="status" className="mb-6 rounded-xl bg-daun/10 p-3 text-sm font-semibold text-daun">
          {pesan}
        </p>
      )}

      {!artikel || artikel.length === 0 ? (
        <Kosong>Belum ada artikel.</Kosong>
      ) : (
        <ul className="space-y-3">
          {artikel.map((a) => (
            <li key={a.id}>
              <Link
                href={`/admin/artikel/${a.id}`}
                className="flex items-center gap-4 rounded-[1.25rem] bg-white p-3 ring-1 ring-herbal/10 transition hover:ring-2 hover:ring-kunyit"
              >
                <span
                  className="h-14 w-20 shrink-0 rounded-lg"
                  style={{ backgroundColor: a.cover_style?.warna ?? "#1F3D2B" }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug">{a.title}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-herbal/65">
                    {a.category}
                    {a.source && <> · {a.source}</>}
                    {a.published_at && <> · {formatTanggal(a.published_at)}</>}
                    {a.external_url && <ExternalLink className="h-3 w-3" aria-label="Tautan luar" />}
                  </span>
                </span>
                {!a.is_published && (
                  <span className="rounded-full bg-herbal/15 px-2 py-0.5 text-[11px] font-bold">Draf</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
