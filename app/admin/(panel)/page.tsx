import Link from "next/link";
import { ArrowRight, Inbox, MessageSquareHeart, Newspaper, Package } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, formatWaktu } from "@/components/admin/Kepala";

export const metadata = { title: "Ringkasan" };

export default async function Ringkasan() {
  const { db } = await wajibAdmin();
  const hitung = (tabel: string) => db.from(tabel).select("id", { count: "exact", head: true });

  const [pesanBaru, testimoniMenunggu, produk, artikel, terbaru] = await Promise.all([
    hitung("messages").eq("is_read", false),
    hitung("testimonials").eq("is_approved", false),
    hitung("products"),
    hitung("articles").eq("is_published", true),
    db
      .from("messages")
      .select("id, name, topic, message, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const kartu = [
    { label: "Pesan belum dibaca", nilai: pesanBaru.count ?? 0, href: "/admin/pesan", Ikon: Inbox, sorot: true },
    { label: "Testimoni menunggu", nilai: testimoniMenunggu.count ?? 0, href: "/admin/testimoni", Ikon: MessageSquareHeart, sorot: true },
    { label: "Total produk", nilai: produk.count ?? 0, href: "/admin/produk", Ikon: Package },
    { label: "Artikel terbit", nilai: artikel.count ?? 0, href: "/admin/artikel", Ikon: Newspaper },
  ];

  return (
    <>
      <KepalaAdmin
        judul="Halo, selamat datang! 🌿"
        deskripsi="Ringkasan website Jamu Bu Ranti hari ini."
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kartu.map(({ label, nilai, href, Ikon, sorot }) => (
          <li key={label}>
            <Link
              href={href}
              className={`flex h-full flex-col rounded-[1.25rem] p-5 ring-1 transition hover:-translate-y-0.5 hover:shadow-lembut ${
                sorot && nilai > 0 ? "bg-kunyit ring-kunyit" : "bg-white ring-herbal/10"
              }`}
            >
              <Ikon className="h-6 w-6" aria-hidden="true" />
              <span className="mt-4 font-display text-4xl font-semibold">{nilai}</span>
              <span className="text-sm font-semibold text-herbal/80">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Pesan terbaru</h2>
          <Link href="/admin/pesan" className="inline-flex items-center gap-1 text-sm font-semibold text-daun">
            Semua pesan <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {terbaru.data && terbaru.data.length > 0 ? (
          <ul className="divide-y divide-herbal/10 overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-herbal/10">
            {terbaru.data.map((m) => (
              <li key={m.id} className="flex gap-3 p-4">
                {!m.is_read && (
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rosella" aria-label="Belum dibaca" />
                )}
                <div className="min-w-0">
                  <p className="font-semibold">
                    {m.name} <span className="font-normal text-herbal/60">· {m.topic}</span>
                  </p>
                  <p className="truncate text-sm text-herbal/80">{m.message}</p>
                  <p className="text-xs text-herbal/55">{formatWaktu(m.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[1.25rem] bg-white p-6 text-herbal/70 ring-1 ring-herbal/10">
            Belum ada pesan.
          </p>
        )}
      </section>
    </>
  );
}
