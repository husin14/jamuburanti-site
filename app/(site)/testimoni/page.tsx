import type { Metadata } from "next";
import { Info, MessageCircleHeart } from "lucide-react";
import { KepalaHalaman, JudulSection } from "@/components/ui/Judul";
import { Muncul } from "@/components/ui/Muncul";
import { KartuTestimoni } from "@/components/testimoni/KartuTestimoni";
import { FormTestimoni } from "@/components/testimoni/FormTestimoni";
import { getProduk, getTestimoni } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Testimoni",
  description:
    "Ulasan pelanggan Jamu Bu Ranti tentang rasa, kualitas, dan pelayanan. Bagikan juga pengalamanmu.",
};

export default async function HalamanTestimoni() {
  const [testimoni, produk] = await Promise.all([getTestimoni(), getProduk()]);
  const daftar = testimoni;
  const adaContoh = daftar.some((t) => t.contoh);

  return (
    <>
      <KepalaHalaman
        eyebrow="Testimoni"
        judul="Cerita mereka setelah ngejamu"
        deskripsi="Penilaian pelanggan untuk rasa, kualitas, dan pelayanan kami."
      />

      <section aria-label="Daftar testimoni" className="wadah py-12">
        {adaContoh && (
          <p className="mb-6 flex gap-2 rounded-2xl bg-jahe/70 p-4 text-sm text-herbal/85">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Testimoni bertanda &ldquo;Contoh&rdquo; adalah ilustrasi untuk
            keperluan desain dan akan diganti ulasan pelanggan asli.
          </p>
        )}

        {daftar.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {daftar.map((t, i) => (
              <li key={t.id}>
                <Muncul jeda={(i % 3) * 0.08} className="h-full">
                  <KartuTestimoni t={t} indeks={i} />
                </Muncul>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[1.75rem] bg-jahe/70 p-10 text-center">
            <MessageCircleHeart className="mx-auto h-10 w-10 text-daun" aria-hidden="true" />
            <p className="mt-3 font-display text-2xl font-semibold">
              Jadilah yang pertama berbagi cerita
            </p>
            <p className="mt-2 text-herbal/80">
              Sudah pernah mencoba jamu kami? Ceritakan lewat formulir di bawah.
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="bagikan" className="bg-jahe/60 py-16">
        <div className="wadah grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <JudulSection
            eyebrow="Bagikan Pengalamanmu"
            judul={<span id="bagikan">Sudah coba jamu kami?</span>}
            deskripsi="Ulasanmu membantu orang lain memilih jamu yang pas. Ulasan akan tampil setelah dicek admin."
          />
          <div className="rounded-[1.75rem] bg-krem p-6 ring-1 ring-herbal/10 sm:p-8">
            <FormTestimoni namaProduk={produk.map((p) => p.nama)} />
          </div>
        </div>
      </section>
    </>
  );
}
