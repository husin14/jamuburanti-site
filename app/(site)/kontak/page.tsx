import type { Metadata } from "next";
import { Clock, Mail, MapPin, Navigation } from "lucide-react";
import { KepalaHalaman } from "@/components/ui/Judul";
import { IkonInstagram, IkonWhatsApp } from "@/components/ui/Ikon";
import { Isi } from "@/components/ui/Isi";
import { StatusBuka } from "@/components/kontak/StatusBuka";
import { FormKontak } from "@/components/kontak/FormKontak";
import { ChipOjol } from "@/components/sections/Pemesanan";
import { site } from "@/lib/site";
import { waLinkUmum } from "@/lib/utils/whatsapp";
import { getPengaturan } from "@/lib/data/repo";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Jamu Bu Ranti: WhatsApp 0856-4010-1163, Instagram @jamuburanti, Jl. Taman Semeru II No. 23, Gajahmungkur, Semarang. Buka setiap hari 07.00–21.00 WIB.",
};

const q = encodeURIComponent(site.mapsQuery);

export default async function HalamanKontak() {
  const atur = await getPengaturan();
  const kelasBaris = "flex gap-4 rounded-2xl p-3 transition hover:bg-jahe/70";
  const kelasIkon =
    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-jahe text-daun";

  return (
    <>
      <KepalaHalaman
        eyebrow="Kontak"
        judul="Mampir, chat, atau pesan antar"
        deskripsi="Kami senang mendengar darimu, entah untuk pesan jamu, kerja sama, atau sekadar bertanya."
      >
        <div className="mt-6">
          <StatusBuka />
        </div>
      </KepalaHalaman>

      <section className="wadah grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">Info kontak</h2>
          <ul className="mt-4 space-y-1">
            <li>
              <a href={waLinkUmum} target="_blank" rel="noopener noreferrer" className={kelasBaris}>
                <span className={kelasIkon}>
                  <IkonWhatsApp className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-herbal/70">WhatsApp</span>
                  <span className="block text-lg font-semibold">{site.whatsapp.tampil}</span>
                </span>
              </a>
            </li>
            <li>
              <a href={atur.instagramUrl} target="_blank" rel="noopener noreferrer" className={kelasBaris}>
                <span className={kelasIkon}>
                  <IkonInstagram className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm text-herbal/70">Instagram</span>
                  <span className="block text-lg font-semibold">{atur.instagramAkun}</span>
                </span>
              </a>
            </li>
            <li className={kelasBaris}>
              <span className={kelasIkon}>
                <Mail className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-herbal/70">Email</span>
                {atur.email ? (
                  <a href={`mailto:${atur.email}`} className="block text-lg font-semibold">
                    {atur.email}
                  </a>
                ) : (
                  <span className="mt-1 block">
                    <Isi>email resmi</Isi>
                  </span>
                )}
              </span>
            </li>
            <li className={kelasBaris}>
              <span className={kelasIkon}>
                <MapPin className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-herbal/70">Alamat</span>
                <address className="block text-lg font-semibold not-italic leading-snug">
                  {site.alamat}
                </address>
              </span>
            </li>
            <li className={kelasBaris}>
              <span className={kelasIkon}>
                <Clock className="h-6 w-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm text-herbal/70">Jam operasional</span>
                <span className="block text-lg font-semibold">{site.jamBuka.teks}</span>
              </span>
            </li>
          </ul>

          <div className="mt-6 rounded-2xl bg-white/70 p-5 ring-1 ring-herbal/10">
            <p className="font-semibold">Pesan antar lewat ojek online</p>
            <p className="text-sm text-herbal/75">
              Cari toko &ldquo;{site.nama}&rdquo; di aplikasi:
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {atur.ojol.map((o) => (
                <ChipOjol key={o.nama} nama={o.nama} url={o.url} />
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-herbal/10">
            <iframe
              title={`Peta lokasi ${site.nama}`}
              src={`https://www.google.com/maps?q=${q}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0"
            />
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-herbal px-6 font-semibold transition hover:bg-herbal hover:text-krem"
          >
            <Navigation className="h-5 w-5" aria-hidden="true" />
            Petunjuk Arah
          </a>
        </div>
      </section>

      <section aria-labelledby="form-pesan" className="bg-jahe/60 py-16">
        <div className="wadah grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="form-pesan" className="text-3xl font-semibold sm:text-4xl">
              Kirim pesan
            </h2>
            <p className="mt-3 text-lg text-herbal/80">
              Untuk pemesanan, kerja sama, atau pertanyaan. Kami hanya meminta
              data yang perlu untuk membalasmu.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-krem p-6 ring-1 ring-herbal/10 sm:p-8">
            <FormKontak />
          </div>
        </div>
      </section>
    </>
  );
}
