import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormArtikel } from "@/components/admin/FormArtikel";

export const metadata = { title: "Tambah Artikel" };

export default async function ArtikelBaru() {
  await wajibAdmin();
  return (
    <>
      <Link href="/admin/artikel" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua artikel
      </Link>
      <KepalaAdmin judul="Tambah artikel" />
      <FormArtikel
        awal={{
          title: "",
          slug: "",
          category: "Sejarah & Edukasi Jamu",
          excerpt: "",
          content: null,
          external_url: null,
          source: null,
          author: null,
          published_at: new Date().toISOString().slice(0, 10),
          cover_style: { warna: "#3F7D4E", aksen: "#FBF6EC" },
          is_published: true,
        }}
      />
    </>
  );
}
