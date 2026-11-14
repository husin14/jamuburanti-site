import Image from "next/image";
import { Check, Gift, Info, Leaf, Store } from "lucide-react";
import { IkonInstagram, IkonWhatsApp } from "@/components/ui/Ikon";
import { JudulSection } from "@/components/ui/Judul";
import { Isi } from "@/components/ui/Isi";
import { TombolWhatsApp } from "@/components/ui/Tombol";
import { foto, pilihanKemasan } from "@/lib/data/foto";
import { getPengaturan, getPromoUtama } from "@/lib/data/repo";
import { disclaimer, site } from "@/lib/site";
import { buildWaLink } from "@/lib/utils/whatsapp";
import { cn } from "@/lib/utils/cn";

/** Chip aplikasi ojol. Menjadi tautan otomatis begitu URL-nya diisi di pengaturan situs. */
export function ChipOjol({
  nama,
  url,
  className,
}: {
  nama: string;
  url: string | null;
  className?: string;
}) {
  const kelas = cn(
    "inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-herbal/15 bg-white/70 px-4 text-sm font-semibold text-herbal",
    className,
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cn(kelas, "hover:border-herbal")}>
        <Store className="h-4 w-4" aria-hidden="true" />
        {nama}
      </a>
    );
  }
  return (
    <span className={kelas} title={`Cari "${site.nama}" di aplikasi ${nama}`}>
      <Store className="h-4 w-4" aria-hidden="true" />
      {nama}
    </span>
  );
}

export async function CaraPesan() {
  const atur = await getPengaturan();
  return (
    <section aria-labelledby="cara-pesan" className="wadah py-16">
      <JudulSection
        eyebrow="Cara Pesan"
        judul={<span id="cara-pesan">Tiga cara gampang menikmati jamu kami</span>}
      />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="flex flex-col rounded-[1.75rem] bg-wa/15 p-6 ring-1 ring-wa/30">
          <IkonWhatsApp className="h-9 w-9 text-herbal" />
          <h3 className="mt-4 text-xl font-semibold">WhatsApp</h3>
          <p className="mt-1 text-herbal/80">
            Chat langsung, tanya stok hari ini, atau pesan dalam jumlah banyak.
          </p>
          <p className="mt-3 font-bold">{site.whatsapp.tampil}</p>
          <TombolWhatsApp varian="wa" className="mt-5 self-start shadow-none" />
        </div>
        <div className="flex flex-col rounded-[1.75rem] bg-kunyit/15 p-6 ring-1 ring-kunyit/40">
          <Store className="h-9 w-9 text-herbal" aria-hidden="true" />
          <h3 className="mt-4 text-xl font-semibold">Ojek online</h3>
          <p className="mt-1 text-herbal/80">
            Cari toko <strong>&ldquo;{site.nama}&rdquo;</strong> di aplikasi
            favoritmu, jamu diantar sampai depan pintu.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {atur.ojol.map((o) => (
              <ChipOjol key={o.nama} nama={o.nama} url={o.url} />
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-[1.75rem] bg-telang/10 p-6 ring-1 ring-telang/25">
          <IkonInstagram className="h-9 w-9 text-herbal" />
          <h3 className="mt-4 text-xl font-semibold">Instagram</h3>
          <p className="mt-1 text-herbal/80">
            Intip promo, varian baru, dan kirim DM untuk pesan.
          </p>
          <a
            href={atur.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-12 items-center gap-2 self-start rounded-full border-2 border-herbal px-5 font-semibold transition hover:bg-herbal hover:text-krem"
          >
            {atur.instagramAkun}
          </a>
        </div>
      </div>
    </section>
  );
}

const pesanHampers = `Halo ${site.nama}, saya ingin memesan paket hampers. Boleh info isi dan harganya?`;

/** Banner promo utama (default: paket hampers). Disembunyikan bila tidak ada promo aktif. */
export async function PaketHampers({ judulTag = "h2" }: { judulTag?: "h2" | "h3" }) {
  const Judul = judulTag;
  const promo = await getPromoUtama();
  if (!promo) return null;
  const tautanCta = promo.ctaUrl ?? buildWaLink(pesanHampers);

  return (
    <section className="wadah py-6">
      <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-herbal p-6 text-krem sm:p-8 md:grid-cols-[1fr_1.1fr] md:p-12">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-rosella px-3 py-1 text-sm font-bold">
            <Gift className="h-4 w-4" aria-hidden="true" />
            Paket Hampers
          </p>
          <Judul className="text-3xl font-semibold leading-tight text-krem sm:text-4xl">
            {promo.judul}
          </Judul>
          <p className="mt-3 text-lg text-krem/85">{promo.deskripsi}</p>
          <ul className="mt-5 flex flex-wrap gap-2 text-sm">
            {["Kotak kraft isi 2 atau 4 botol", "Kartu ucapan Ramadan & Natal", "Bisa campur varian"].map(
              (t) => (
                <li
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-full bg-krem/10 px-3 py-1.5"
                >
                  <Check className="h-4 w-4 text-kunyit" aria-hidden="true" />
                  {t}
                </li>
              ),
            )}
          </ul>
          <p className="mt-4 text-sm text-krem/80">
            Isi & harga tiap paket: <Isi>isi & harga tiap paket hampers</Isi>
          </p>
          <a
            href={tautanCta}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-kunyit px-6 py-3 font-semibold text-herbal transition hover:-translate-y-0.5 hover:brightness-105"
          >
            <IkonWhatsApp className="h-5 w-5" />
            {promo.ctaLabel}
          </a>
        </div>

        {/* kolase foto hampers asli */}
        <div className="grid grid-cols-[1.25fr_1fr] gap-3">
          <div className="relative row-span-2 overflow-hidden rounded-[1.5rem]">
            <Image
              src={foto.hampersNatal4.src}
              alt={foto.hampersNatal4.alt}
              placeholder="blur"
              fill
              sizes="(min-width: 768px) 25vw, 55vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-krem px-3 py-1 text-xs font-bold text-herbal">
              Edisi Natal
            </span>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image
              src={foto.hampersRamadan4.src}
              alt={foto.hampersRamadan4.alt}
              placeholder="blur"
              fill
              sizes="(min-width: 768px) 20vw, 45vw"
              className="object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-kunyit px-3 py-1 text-xs font-bold text-herbal">
              Edisi Ramadan
            </span>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
            <Image
              src={foto.hampersRamadan2.src}
              alt={foto.hampersRamadan2.alt}
              placeholder="blur"
              fill
              sizes="(min-width: 768px) 20vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Tiga ukuran kemasan, berdasarkan foto produk asli. */
export function PilihanKemasan() {
  return (
    <section aria-labelledby="kemasan" className="wadah py-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-lembut">
          <Image
            src={foto.kemasan1.src}
            alt={foto.kemasan1.alt}
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto w-full"
          />
          <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-herbal px-4 py-2 text-sm font-bold text-krem">
            <Leaf className="h-4 w-4 text-kunyit" aria-hidden="true" />
            Tanpa bahan pengawet
          </p>
        </div>
        <div>
          <JudulSection
            eyebrow="Pilihan Kemasan"
            judul={<span id="kemasan">Pilih ukuran sesuai kebutuhan</span>}
            deskripsi="Setiap botol berlabel khas Jamu Tradisional Bu Ranti, ditandai sesuai varian yang kamu pesan."
          />
          <ul className="mt-6 space-y-3">
            {pilihanKemasan.map((k) => (
              <li
                key={k.ukuran}
                className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-herbal/10"
              >
                <span className="inline-flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-kunyit font-display text-lg font-semibold text-herbal">
                  {k.ukuran}
                </span>
                <span>
                  <span className="block font-semibold">{k.bentuk}</span>
                  <span className="block text-sm text-herbal/75">{k.cocok}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-herbal/75">
            Ketersediaan ukuran tiap varian bisa ditanyakan lewat WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex gap-3 rounded-2xl bg-jahe/70 p-4 text-sm leading-relaxed text-herbal/85",
        className,
      )}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-daun" aria-hidden="true" />
      {disclaimer}
    </p>
  );
}
