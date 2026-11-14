import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan nama kelas, melewati nilai kosong.
 * Bila ada kelas Tailwind yang bentrok (mis. `inline-flex` dan `hidden`), yang ditulis
 * belakangan menang. Ini wajib sejak Tailwind 4, karena urutan CSS-nya tidak lagi
 * menjamin kelas override menang.
 */
export function cn(...kelas: Array<string | false | null | undefined>): string {
  return twMerge(kelas.filter(Boolean).join(" "));
}
