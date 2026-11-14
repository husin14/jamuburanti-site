import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormProduk } from "@/components/admin/FormProduk";

export const metadata = { title: "Tambah Produk" };

export default async function ProdukBaru() {
  await wajibAdmin();
  return (
    <>
      <Link href="/admin/produk" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua produk
      </Link>
      <KepalaAdmin judul="Tambah produk" />
      <FormProduk
        awal={{
          name: "",
          slug: "",
          categories: [],
          short_benefit: "",
          benefits: "",
          ingredients: null,
          package_size: null,
          price_min: null,
          price_max: null,
          image_url: null,
          image_alt: null,
          visual: { cairan: "#E8A317", latar: "#FBEBC0", bahan: [{ jenis: "rimpang", warna: "#E8A317" }] },
          is_bestseller: false,
          is_new: true,
          is_available: true,
          is_published: true,
          sort_order: 999,
        }}
      />
    </>
  );
}
