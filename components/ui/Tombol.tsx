import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { IkonWhatsApp } from "@/components/ui/Ikon";
import { buildWaLink, pesanProduk, pesanUmum } from "@/lib/utils/whatsapp";

const dasar =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0";

const varian = {
  // CTA utama: kuning kunyit dengan teks hijau tua (kontras AA)
  utama: "bg-kunyit text-herbal shadow-lembut hover:brightness-105",
  sekunder:
    "border-2 border-herbal text-herbal hover:bg-herbal hover:text-krem",
  terang: "border-2 border-krem text-krem hover:bg-krem hover:text-herbal",
  wa: "bg-wa text-herbal shadow-lembut hover:brightness-105",
} as const;

type Varian = keyof typeof varian;

export function TombolTautan({
  href,
  children,
  varian: v = "utama",
  className,
}: {
  href: string;
  children: React.ReactNode;
  varian?: Varian;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(dasar, varian[v], className)}>
      {children}
    </Link>
  );
}

/** Tombol pesan via WhatsApp. Isi `produk` agar pesan otomatis menyebut nama produknya. */
export function TombolWhatsApp({
  produk,
  label = "Pesan via WhatsApp",
  varian: v = "utama",
  className,
}: {
  produk?: string;
  label?: string;
  varian?: Varian;
  className?: string;
}) {
  const href = buildWaLink(produk ? pesanProduk(produk) : pesanUmum);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(dasar, varian[v], className)}
    >
      <IkonWhatsApp className="h-5 w-5 shrink-0" />
      {label}
    </a>
  );
}
