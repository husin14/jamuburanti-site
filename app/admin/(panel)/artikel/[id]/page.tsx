import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormArtikel, type DataArtikelAdmin } from "@/components/admin/FormArtikel";
import { TombolHapus, kelasTombol } from "@/components/admin/UI";
import { hapusArtikel } from "@/app/admin/actions/konten";

export const metadata = { title: "Ubah Artikel" };

type Props = { params: Promise<{ id: string }> };

export default async function UbahArtikel({ params }: Props) {
  const { db } = await wajibAdmin();
  const { id } = await params;
  const { data } = await db.from("articles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const a = data as DataArtikelAdmin & { id: string };
  const tautan = a.external_url ?? `/berita/${a.slug}`;

  return (
    <>
      <Link href="/admin/artikel" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua artikel
      </Link>
      <KepalaAdmin judul="Ubah artikel">
        <a href={tautan} target="_blank" rel="noopener noreferrer" className={kelasTombol.kedua}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Lihat
        </a>
        <TombolHapus aksi={hapusArtikel} id={a.id} nama={a.title} label="Hapus artikel" />
      </KepalaAdmin>
      <FormArtikel awal={a} />
    </>
  );
}
