import Link from "next/link";
import { Mail } from "lucide-react";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, Kosong, formatWaktu } from "@/components/admin/Kepala";
import { TombolAksi, TombolHapus, kelasTombol } from "@/components/admin/UI";
import { IkonWhatsApp } from "@/components/ui/Ikon";
import { hapusPesan, tandaiPesan } from "@/app/admin/actions/pesan-testimoni";
import { cn } from "@/lib/utils/cn";

export const metadata = { title: "Pesan Masuk" };

type Props = { searchParams: Promise<{ filter?: string }> };

/** Ubah kontak pengirim menjadi tautan balas (WhatsApp atau email). */
function tautanBalas(kontak: string, nama: string) {
  if (kontak.includes("@")) {
    return { jenis: "email" as const, href: `mailto:${kontak}?subject=${encodeURIComponent("Balasan dari Jamu Bu Ranti")}` };
  }
  const angka = kontak.replace(/\D/g, "").replace(/^0/, "62");
  const teks = encodeURIComponent(`Halo ${nama}, terima kasih sudah menghubungi Jamu Bu Ranti. `);
  return { jenis: "wa" as const, href: `https://wa.me/${angka}?text=${teks}` };
}

export default async function HalamanPesan({ searchParams }: Props) {
  const { db } = await wajibAdmin();
  const { filter } = await searchParams;
  const hanyaBaru = filter !== "semua";

  let q = db
    .from("messages")
    .select("id, name, contact, topic, message, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (hanyaBaru) q = q.eq("is_read", false);
  const { data: pesan } = await q;

  return (
    <>
      <KepalaAdmin judul="Pesan Masuk" deskripsi="Pesan dari formulir Kontak di website.">
        <Link
          href="/admin/pesan"
          className={cn(hanyaBaru ? kelasTombol.utama : kelasTombol.kedua)}
          aria-current={hanyaBaru ? "page" : undefined}
        >
          Belum dibaca
        </Link>
        <Link
          href="/admin/pesan?filter=semua"
          className={cn(!hanyaBaru ? kelasTombol.utama : kelasTombol.kedua)}
          aria-current={!hanyaBaru ? "page" : undefined}
        >
          Semua
        </Link>
      </KepalaAdmin>

      {!pesan || pesan.length === 0 ? (
        <Kosong>{hanyaBaru ? "Semua pesan sudah dibaca. 🎉" : "Belum ada pesan."}</Kosong>
      ) : (
        <ul className="space-y-4">
          {pesan.map((m) => {
            const balas = tautanBalas(m.contact, m.name);
            return (
              <li
                key={m.id}
                className={cn(
                  "rounded-[1.25rem] bg-white p-5 ring-1",
                  m.is_read ? "ring-herbal/10" : "ring-2 ring-kunyit",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-lg font-semibold">
                      {m.name}
                      {!m.is_read && (
                        <span className="ml-2 rounded-full bg-rosella px-2 py-0.5 align-middle text-xs font-bold text-krem">
                          Baru
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-herbal/70">
                      {m.contact} · <strong>{m.topic}</strong> · {formatWaktu(m.created_at)}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line leading-relaxed">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={balas.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(kelasTombol.utama, "min-h-9 px-3")}
                  >
                    {balas.jenis === "wa" ? (
                      <IkonWhatsApp className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    )}
                    Balas via {balas.jenis === "wa" ? "WhatsApp" : "email"}
                  </a>
                  <TombolAksi aksi={tandaiPesan} data={{ id: m.id, dibaca: m.is_read ? "0" : "1" }}>
                    {m.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  </TombolAksi>
                  <TombolHapus aksi={hapusPesan} id={m.id} nama={`pesan dari ${m.name}`} kecil />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
