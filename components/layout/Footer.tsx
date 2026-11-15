import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  IkonFacebook,
  IkonInstagram,
  IkonTikTok,
  IkonWhatsApp,
  OrnamenDaun,
} from "@/components/ui/Ikon";
import { disclaimer, menuUtama, site } from "@/lib/site";
import { waLinkUmum } from "@/lib/utils/whatsapp";
import { getPengaturan } from "@/lib/data/repo";

const kelasSosmed =
  "inline-flex h-11 w-11 items-center justify-center rounded-full bg-krem/10 text-krem transition hover:bg-kunyit hover:text-herbal";

export async function Footer() {
  const atur = await getPengaturan();
  const tahun = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-herbal text-krem">
      <OrnamenDaun className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-krem/10" />

      <div className="wadah relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo terang besar />
          <p className="font-display text-lg italic text-kunyit">
            &ldquo;{site.tagline}&rdquo;
          </p>
          <div className="flex gap-2">
            <a
              href={atur.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${atur.instagramAkun}`}
              className={kelasSosmed}
            >
              <IkonInstagram className="h-5 w-5" />
            </a>
            {/* TikTok & Facebook tampil otomatis setelah tautannya diisi (lihat TODO_KONTEN.md) */}
            {atur.tiktokUrl && (
              <a
                href={atur.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Jamu Bu Ranti"
                className={kelasSosmed}
              >
                <IkonTikTok className="h-5 w-5" />
              </a>
            )}
            {atur.facebookUrl && (
              <a
                href={atur.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Jamu Bu Ranti"
                className={kelasSosmed}
              >
                <IkonFacebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <nav aria-label="Menu footer">
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-krem/70">
            Jelajahi
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-1">
            {menuUtama.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block py-1 hover:text-kunyit"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-krem/70">
            Kontak
          </h2>
          <ul className="space-y-3">
            <li>
              <a
                href={waLinkUmum}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-kunyit"
              >
                <IkonWhatsApp className="h-5 w-5 shrink-0" />
                {site.whatsapp.tampil}
              </a>
            </li>
            <li>
              <a
                href={atur.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 hover:text-kunyit"
              >
                <IkonInstagram className="h-5 w-5 shrink-0" />
                {atur.instagramAkun}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <address className="not-italic">{site.alamat}</address>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-widest text-krem/70">
            Jam Buka
          </h2>
          <p className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
            {site.jamBuka.teks}
          </p>
        </div>
      </div>

      <div className="relative border-t border-krem/15">
        <div className="wadah space-y-3 py-6 pb-28 text-sm text-krem/80 md:pb-6">
          <p>{disclaimer}</p>
          <p>
            &copy; {tahun} {site.nama}. Usaha keluarga dari Semarang, Jawa
            Tengah.
          </p>
        </div>
      </div>
    </footer>
  );
}
