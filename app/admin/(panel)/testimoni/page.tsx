import Link from "next/link";
import { Check, EyeOff } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, Kosong, formatWaktu } from "@/components/admin/Kepala";
import { TombolAksi, TombolHapus, kelasTombol } from "@/components/admin/UI";
import { Bintang } from "@/components/testimoni/KartuTestimoni";
import { hapusTestimoni, setujuiTestimoni } from "@/app/admin/actions/pesan-testimoni";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Testimoni" };

type Props = { searchParams: Promise<{ filter?: string }> };

export default async function HalamanTestimoniAdmin({ searchParams }: Props) {
  const { db } = await wajibAdmin();
  const { filter } = await searchParams;
  const tampil = filter === "tampil";

  const { data: daftar } = await db
    .from("testimonials")
    .select(
      "id, name, city, product, rating_taste, rating_quality, rating_service, review, consent, is_approved, is_sample, created_at",
    )
    .eq("is_approved", tampil)
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <KepalaAdmin
        judul="Testimoni"
        deskripsi="Setujui ulasan pelanggan agar tampil di website, atau hapus yang tidak pantas."
      >
        <Link href="/admin/testimoni" className={cn(!tampil ? kelasTombol.utama : kelasTombol.kedua)}>
          Menunggu persetujuan
        </Link>
        <Link href="/admin/testimoni?filter=tampil" className={cn(tampil ? kelasTombol.utama : kelasTombol.kedua)}>
          Sudah tampil
        </Link>
      </KepalaAdmin>

      {!daftar || daftar.length === 0 ? (
        <Kosong>
          {tampil ? "Belum ada testimoni yang tampil." : "Tidak ada testimoni yang menunggu. 🎉"}
        </Kosong>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {daftar.map((t) => {
            const rata = (t.rating_taste + t.rating_quality + t.rating_service) / 3;
            return (
              <li key={t.id} className="flex flex-col rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
                <div className="flex flex-wrap items-center gap-2">
                  <Bintang nilai={rata} />
                  <span className="text-sm font-bold">{rata.toFixed(1)}</span>
                  {t.is_sample && (
                    <span className="rounded-full bg-herbal/10 px-2 py-0.5 text-xs font-bold">Contoh</span>
                  )}
                </div>
                <p className="mt-3 flex-1 leading-relaxed">&ldquo;{t.review}&rdquo;</p>
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
