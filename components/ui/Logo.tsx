import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import logoGambar from "@/public/images/logo/logo-jamu-bu-ranti.png";

/**
 * Logo resmi Jamu Tradisional Bu Ranti (PNG transparan, dari logo versi latar krem).
 * Sumber asli: folder "logo jamu"; diolah agar latar putih di luar lingkaran transparan.
 */
export function LogoGambar({
  className,
  sizes = "56px",
  alt = "Logo Jamu Tradisional Bu Ranti",
  eager = false,
}: {
  className?: string;
  sizes?: string;
  alt?: string;
  eager?: boolean;
}) {
  return (
    <Image
      src={logoGambar}
      alt={alt}
      sizes={sizes}
      placeholder="blur"
      loading={eager ? "eager" : "lazy"}
      className={cn("h-auto select-none", className)}
    />
  );
}

/**
 * Logo + nama usaha, menaut ke Beranda.
 * - default: logo bulat kecil + tulisan "Jamu Bu Ranti" (navbar, login, 404)
 * - besar: logo saja, ukuran besar (footer). `terang` = dipakai di latar gelap.
 */
export function Logo({
  className,
  terang = false,
  besar = false,
}: {
  className?: string;
  terang?: boolean;
  besar?: boolean;
}) {
  if (besar) {
    return (
      <Link
        href="/"
        aria-label="Jamu Bu Ranti, kembali ke Beranda"
        className={cn(
          "inline-block rounded-[1.75rem] p-2 transition hover:scale-[1.02]",
          terang && "bg-krem shadow-lembut",
          className,
        )}
      >
        <LogoGambar alt="" sizes="128px" className="w-28 sm:w-32" />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Jamu Bu Ranti, kembali ke Beranda"
      className={cn(
        "inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full",
        terang ? "text-krem" : "text-herbal",
        className,
      )}
    >
      <LogoGambar alt="" eager className="w-12 lg:w-14" />
      <span className="font-display text-xl font-semibold leading-none">
        Jamu{" "}
        <span className={terang ? "text-kunyit" : "text-daun"}>Bu Ranti</span>
      </span>
    </Link>
  );
}
