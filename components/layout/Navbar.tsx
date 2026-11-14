"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { TombolWhatsApp } from "@/components/ui/Tombol";
import { menuUtama, site } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

function aktif(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const [terbuka, setTerbuka] = useState(false);
  const [tergulir, setTergulir] = useState(false);

  // Bayangan muncul setelah halaman digulir
  useEffect(() => {
    const cek = () => setTergulir(window.scrollY > 8);
    cek();
    window.addEventListener("scroll", cek, { passive: true });
    return () => window.removeEventListener("scroll", cek);
  }, []);

  // Kunci gulir halaman dan dukung tombol Escape saat menu mobile terbuka
  useEffect(() => {
    if (!terbuka) return;
    document.body.style.overflow = "hidden";
    const tekan = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTerbuka(false);
    };
    window.addEventListener("keydown", tekan);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", tekan);
    };
  }, [terbuka]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-shadow duration-300",
        tergulir && "shadow-[0_6px_24px_-16px_rgba(31,61,43,0.5)]",
      )}
    >
      {/* Latar blur di lapisan terpisah: backdrop-filter pada <header> sendiri akan
          membuat menu mobile (position: fixed) ikut terkurung setinggi header. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-krem/90 backdrop-blur-sm"
      />
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-herbal focus:px-4 focus:py-2 focus:text-krem"
      >
        Lewati ke konten utama
      </a>

      <div className="wadah flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        <nav aria-label="Menu utama" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {menuUtama.map((item) => {
              const a = aktif(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={a ? "page" : undefined}
                    className={cn(
                      "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors xl:px-3 xl:text-[15px]",
                      a
                        ? "bg-jahe text-herbal"
                        : "text-herbal/80 hover:bg-jahe/70 hover:text-herbal",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <TombolWhatsApp
            label="Pesan Sekarang"
            className="hidden min-h-11 whitespace-nowrap px-5 py-2 text-[15px] sm:inline-flex lg:px-4 xl:px-5"
          />
          <button
            type="button"
            onClick={() => setTerbuka((v) => !v)}
            aria-expanded={terbuka}
            aria-controls="menu-mobile"
            aria-label={terbuka ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-jahe text-herbal lg:hidden"
          >
            {terbuka ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile layar penuh */}
      <div
        id="menu-mobile"
        hidden={!terbuka}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-herbal text-krem lg:hidden"
      >
        <nav
          aria-label="Menu utama (mobile)"
          className="wadah flex min-h-full flex-col py-8"
        >
          <ul className="flex flex-col">
            {menuUtama.map((item, i) => {
              const a = aktif(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className="animate-naik-pelan border-b border-krem/15"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <Link
                    href={item.href}
                    aria-current={a ? "page" : undefined}
                    onClick={() => setTerbuka(false)}
                    className={cn(
                      "block py-4 font-display text-3xl",
                      a ? "text-kunyit" : "text-krem",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 space-y-3 pb-24">
            <TombolWhatsApp varian="wa" className="w-full" />
            <p className="text-center text-sm text-krem/80">
              {site.jamBuka.teks}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
