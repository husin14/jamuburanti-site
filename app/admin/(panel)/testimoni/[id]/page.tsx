import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin } from "@/components/admin/Kepala";
import { FormTestimoniAdmin, type DataTestimoniAdmin } from "@/components/admin/FormTestimoniAdmin";
import { TombolHapus } from "@/components/admin/UI";
import { hapusTestimoniLaluKembali } from "@/app/admin/actions/pesan-testimoni";

export const metadata = { title: "Ubah Testimoni" };

type Props = { params: Promise<{ id: string }> };

export default async function UbahTestimoni({ params }: Props) {
  const { db } = await wajibAdmin();
  const { id } = await params;
  const [{ data }, { data: produk }] = await Promise.all([
    db
      .from("testimonials")
      .select(
        "id, name, product, rating_taste, rating_quality, rating_service, review, consent, is_approved, photo_url, photo_path, created_at",
      )
      .eq("id", id)
      .maybeSingle(),
    db.from("products").select("name").order("sort_order"),
  ]);
  if (!data) notFound();
  const t = data as DataTestimoniAdmin & { id: string; photo_path: string | null };

  // Foto kiriman pelanggan yang belum publik: tautan sementara untuk pratinjau
  let fotoPrivat: string | null = null;
  if (t.photo_path) {
    const { data: tanda } = await db.storage.from("ulasan-masuk").createSignedUrl(t.photo_path, 3600);
    fotoPrivat = tanda?.signedUrl ?? null;
  }

  return (
    <>
      <Link
        href={t.is_approved ? "/admin/testimoni?filter=tampil" : "/admin/testimoni"}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-herbal/75 hover:text-herbal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Semua testimoni
      </Link>
      <KepalaAdmin judul={`Ulasan dari ${t.name}`}>
        <TombolHapus aksi={hapusTestimoniLaluKembali} id={t.id} nama={`ulasan dari ${t.name}`} label="Hapus testimoni" />
      </KepalaAdmin>
      <FormTestimoniAdmin awal={t} namaProduk={(produk ?? []).map((p) => p.name)} fotoPrivat={fotoPrivat} />
    </>
  );
}
