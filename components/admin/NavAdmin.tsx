"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareHeart,
  Newspaper,
  Package,
  Settings,
} from "lucide-react";
import { keluar } from "@/app/admin/actions/auth";
import { cn } from "@/lib/utils/cn";

const menu = [
  { href: "/admin", label: "Ringkasan", Ikon: LayoutDashboard },
  { href: "/admin/pesan", label: "Pesan Masuk", Ikon: Inbox, lencana: "pesan" },
  { href: "/admin/testimoni", label: "Testimoni", Ikon: MessageSquareHeart, lencana: "testimoni" },
  { href: "/admin/produk", label: "Produk", Ikon: Package },
  { href: "/admin/artikel", label: "Artikel", Ikon: Newspaper },
  { href: "/admin/galeri", label: "Galeri", Ikon: Images },
  { href: "/admin/promo", label: "Promo", Ikon: Megaphone },
  { href: "/admin/pengaturan", label: "Pengaturan", Ikon: Settings },
] as const;

export function NavAdmin({
  email,
  jumlah,
}: {
  email: string;
  jumlah: { pesan: number; testimoni: number };
}) {
  const pathname = usePathname();
  const aktif = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 z-30 border-b border-herbal/10 bg-herbal text-krem lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0">
      <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block">
        <Link href="/admin" className="font-display text-xl font-semibold">
          Jamu <span className="text-kunyit">Bu Ranti</span>
          <span className="ml-2 rounded-full bg-krem/10 px-2 py-0.5 align-middle font-sans text-xs font-bold text-krem/80">
            Admin
          </span>
        </Link>
        <form action={keluar} className="lg:hidden">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-krem/10 px-3 text-sm font-semibold"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Keluar
          </button>
        </form>
      </div>

      <nav aria-label="Menu admin" className="overflow-x-auto px-3 pb-3 lg:px-3">
        <ul className="flex gap-1 lg:flex-col">
          {menu.map(({ href, label, Ikon, ...m }) => {
            const n = "lencana" in m ? jumlah[m.lencana] : 0;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={aktif(href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-semibold transition-colors",
                    aktif(href) ? "bg-kunyit text-herbal" : "text-krem/85 hover:bg-krem/10",
                  )}
                >
                  <Ikon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {label}
                  {n > 0 && (
                    <span
                      className={cn(
                        "ml-auto rounded-full px-2 py-0.5 text-xs font-bold",
                        aktif(href) ? "bg-herbal text-krem" : "bg-rosella text-krem",
                      )}
                    >
                      {n}
                      <span className="sr-only"> baru</span>
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden space-y-2 border-t border-krem/15 px-5 py-4 text-sm lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-krem/80 hover:text-kunyit"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Lihat website
        </a>
        <p className="truncate text-krem/60" title={email}>
          {email}
        </p>
        <form action={keluar}>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-krem/10 px-4 font-semibold hover:bg-krem/20"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
