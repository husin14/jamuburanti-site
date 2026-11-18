import Image from "next/image";
import Link from "next/link";
import { Check, EyeOff, Pencil, Plus } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, Kosong, formatWaktu } from "@/components/admin/Kepala";
import { TombolAksi, TombolHapus, kelasTombol } from "@/components/admin/UI";
import { Bintang } from "@/components/testimoni/KartuTestimoni";
import {
  hapusFotoTestimoni,
  hapusTestimoni,
  setujuiTestimoni,
} from "@/app/admin/actions/pesan-testimoni";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Testimoni" };

type Props = { searchParams: Promise<{ filter?: string; pesan?: string }> };

export default async function HalamanTestimoniAdmin({ searchParams }: Props) {
  const { db } = await wajibAdmin();
  const { filter, pesan } = await searchParams;
  const tampil = filter === "tampil";

  const { data: daftar } = await db
    .from("testimonials")
    .select(
      "id, name, city, product, rating_taste, rating_quality, rating_service, review, consent, is_approved, is_sample, photo_path, photo_url, created_at",
    )
    .eq("is_approved", tampil)
    .order("created_at", { ascending: false })
    .limit(200);

  // Foto kiriman yang belum dipublikasikan ada di bucket privat:
  // buat tautan sementara (1 jam) khusus untuk pratinjau admin.
  const jalurPrivat = (daftar ?? []).flatMap((t) => (t.photo_path ? [t.photo_path] : []));
  const tautanPrivat = new Map<string, string>();
  if (jalurPrivat.length > 0) {
    const { data } = await db.storage.from("ulasan-masuk").createSignedUrls(jalurPrivat, 3600);
    data?.forEach((d) => d.path && d.signedUrl && tautanPrivat.set(d.path, d.signedUrl));
  }

  return (
    <>
      <KepalaAdmin
        judul="Testimoni"
        deskripsi="Setujui ulasan pelanggan agar tampil di website, atau tambahkan sendiri ulasan yang masuk lewat WhatsApp."
      >
        <Link href="/admin/testimoni/baru" className={kelasTombol.utama}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Tambah testimoni
        </Link>
      </KepalaAdmin>

      <nav aria-label="Saring testimoni" className="mb-6 inline-flex rounded-full bg-white p-1 ring-1 ring-herbal/10">
        {(
          [
            ["/admin/testimoni", "Menunggu persetujuan", !tampil],
            ["/admin/testimoni?filter=tampil", "Sudah tampil", tampil],
          ] as const
        ).map(([href, label, aktif]) => (
          <Link
            key={href}
            href={href}
            aria-current={aktif ? "page" : undefined}
            className={cn(
              "inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors",
              aktif ? "bg-herbal text-krem" : "text-herbal/75 hover:text-herbal",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      {pesan && (
        <p role="status" className="mb-6 rounded-xl bg-daun/10 p-3 text-sm font-semibold text-daun">
          {pesan}
        </p>
      )}

      {!daftar || daftar.length === 0 ? (
        <Kosong>
          {tampil ? "Belum ada testimoni yang tampil." : "Tidak ada testimoni yang menunggu. 🎉"}
        </Kosong>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {daftar.map((t) => {
            const rata = (t.rating_taste + t.rating_quality + t.rating_service) / 3;
            const foto: string | undefined =
              t.photo_url ?? (t.photo_path ? tautanPrivat.get(t.photo_path) : undefined);
            return (
              <li key={t.id} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Bintang nilai={rata} />
                  <span className="text-sm font-bold">{rata.toFixed(1)}</span>
                  {t.is_sample && (
                    <span className="rounded-full bg-herbal/10 px-2 py-0.5 text-xs font-bold">Contoh</span>
                  )}
                </div>
                <p className="mt-3 flex-1 leading-relaxed">
                  {t.review ? <>&ldquo;{t.review}&rdquo;</> : <span className="text-herbal/60">Testimoni berupa foto screenshot.</span>}
                </p>
                {foto && (
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={foto}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Buka foto ukuran penuh"
                      className="relative block h-24 w-24 shrink-0 overflow-hidden rounded-xl ring-1 ring-herbal/10"
                    >
                      <Image
                        src={foto}
                        alt={`Foto dari ${t.name}`}
                        fill
                        unoptimized
                        sizes="6rem"
                        className="object-cover"
                      />
                    </a>
                    <p className="text-xs leading-relaxed text-herbal/65">
                      {t.photo_url
                        ? "Foto tampil di website bersama ulasan ini."
                        : "Foto belum publik. Akan ikut tampil saat ulasan disetujui."}
                      <br />
                      Klik foto untuk melihat ukuran penuh.
                    </p>
                  </div>
                )}
                <p className="mt-3 text-sm">
                  <strong>{t.name}</strong>
                  <span className="text-herbal/70">
                    {t.city ? ` · ${t.city}` : ""}
                    {t.product ? ` · ${t.product}` : ""}
                  </span>
                </p>
                <p className="text-xs text-herbal/60">
                  Rasa {t.rating_taste} · Kualitas {t.rating_quality} · Pelayanan {t.rating_service} ·{" "}
                  {formatWaktu(t.created_at)} · {t.consent ? "Setuju ditampilkan" : "Tanpa izin tampil"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={`/admin/testimoni/${t.id}`} className={cn(kelasTombol.kedua, "min-h-9 px-3")}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Ubah
                  </Link>
                  {tampil ? (
                    <TombolAksi aksi={setujuiTestimoni} data={{ id: t.id, setuju: "0" }}>
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                      Sembunyikan
                    </TombolAksi>
                  ) : (
                    t.consent && (
                      <TombolAksi aksi={setujuiTestimoni} data={{ id: t.id, setuju: "1" }} varian="utama">
                        <Check className="h-4 w-4" aria-hidden="true" />
                        Setujui & tampilkan
                      </TombolAksi>
                    )
                  )}
                  {foto && (
                    <TombolHapus
                      aksi={hapusFotoTestimoni}
                      id={t.id}
                      nama={`foto dari ulasan ${t.name}`}
                      label="Hapus foto"
                      kecil
                    />
                  )}
                  <TombolHapus aksi={hapusTestimoni} id={t.id} nama={`ulasan dari ${t.name}`} kecil />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
