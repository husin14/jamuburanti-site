import type { Metadata } from "next";
import { KepalaHalaman, JudulSection } from "@/components/ui/Judul";
import { DaftarBerita } from "@/components/berita/DaftarBerita";
import { VideoYouTube } from "@/components/berita/VideoYouTube";
import { videoKegiatan } from "@/lib/data/berita";
import { getArtikel } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Berita & Artikel",
  description:
    "Liputan media tentang Jamu Bu Ranti dari Espos, Kompasiana, TIMES Indonesia, dan Udinus, serta artikel edukasi seputar jamu tradisional.",
};

export default async function HalamanBerita() {
  const artikel = await getArtikel();
  return (
    <>
      <KepalaHalaman
        eyebrow="Berita"
        judul="Kabar dari dapur jamu Bu Ranti"
        deskripsi="Liputan media, cerita perjalanan usaha, dan edukasi seputar jamu tradisional."
      />

      <section aria-label="Daftar artikel" className="wadah py-12">
        <DaftarBerita daftar={artikel} />
      </section>

      <section aria-labelledby="video" className="bg-jahe/60 py-16">
        <div className="wadah">
          <JudulSection
            eyebrow="Video"
            judul={<span id="video">Video kegiatan & promosi</span>}
            deskripsi="Klik untuk memutar. Video dimuat dari YouTube."
          />
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videoKegiatan.map((v) => (
              <li key={v.id}>
                <VideoYouTube id={v.id} judul={v.judul} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
