import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/**
 * LOGO SEMENTARA: wordmark teks + ikon lumpang (cobek) SVG.
 * Ganti dengan logo asli setelah file tersedia di public/images/ (lihat TODO_KONTEN.md).
 */
export function IkonLumpang({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* alu */}
      <rect
        x="27"
        y="3"
        width="7"
        height="24"
        rx="3.5"
        transform="rotate(28 27 3)"
        fill="#E8A317"
      />
      {/* daun */}
      <path d="M9 15c0-5 4-8 9-8 0 5-3 9-9 8Z" fill="#3F7D4E" />
      <path
        d="M10 14c2-2 4-3.5 7-6"
        stroke="#FBF6EC"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* lumpang */}
      <path
        d="M6 22h36c0 10-6 17-14 18v3H20v-3C12 39 6 32 6 22Z"
        fill="currentColor"
      />
      <rect x="14" y="42" width="20" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  terang = false,
}: {
  className?: string;
  /** true = dipakai di atas latar gelap */
  terang?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Jamu Bu Ranti, kembali ke Beranda"
      className={cn(
        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full",
        terang ? "text-krem" : "text-herbal",
        className,
      )}
    >
      <IkonLumpang className="h-9 w-9 shrink-0" />
      <span className="font-display text-xl font-semibold leading-none">
        Jamu{" "}
        <span className={terang ? "text-kunyit" : "text-daun"}>Bu Ranti</span>
      </span>
    </Link>
  );
}
