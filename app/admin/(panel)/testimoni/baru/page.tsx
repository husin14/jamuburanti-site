import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormTestimoniAdmin } from "@/components/admin/FormTestimoniAdmin";

export const metadata = { title: "Tambah Testimoni" };

export default async function TestimoniBaru() {
  const { db } = await wajibAdmin();
  const { data: produk } = await db.from("products").select("name").order("sort_order");

  return (
    <>
      <Link href="/admin/testimoni" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua testimoni
      </Link>
      <KepalaAdmin
        judul="Tambah testimoni"
        deskripsi="Cukup unggah screenshot ulasan pelanggan (WhatsApp, Instagram, dll.) dan beri rating."
      />
      <FormTestimoniAdmin
        namaProduk={(produk ?? []).map((p) => p.name)}
        awal={{
          name: "",
          product: null,
          rating_taste: 5,
          rating_quality: 5,
          rating_service: 5,
          review: "",
          consent: true,
          is_approved: true,
          photo_url: null,
        }}
      />
    </>
  );
}
