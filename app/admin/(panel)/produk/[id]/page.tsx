import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormProduk, type DataProdukAdmin } from "@/components/admin/FormProduk";
import { TombolHapus, kelasTombol } from "@/components/admin/UI";
import { hapusProduk } from "@/app/admin/actions/produk";

export const metadata = { title: "Ubah Produk" };

type Props = { params: Promise<{ id: string }> };

export default async function UbahProduk({ params }: Props) {
  const { db } = await wajibAdmin();
  const { id } = await params;
  const { data } = await db.from("products").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const p = data as DataProdukAdmin & { id: string };

  return (
    <>
      <Link href="/admin/produk" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua produk
      </Link>
      <KepalaAdmin judul={p.name}>
        <a href={`/produk/${p.slug}`} target="_blank" rel="noopener noreferrer" className={kelasTombol.kedua}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Lihat di website
        </a>
        <TombolHapus aksi={hapusProduk} id={p.id} nama={p.name} label="Hapus produk" />
      </KepalaAdmin>
      <FormProduk awal={p} />
    </>
  );
}
