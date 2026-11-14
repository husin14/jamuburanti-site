import type { StaticImageData } from "next/image";

import traveling from "@/public/images/foto/jamu-dibawa-traveling.jpg";
import kemasan1 from "@/public/images/foto/kemasan-tiga-ukuran-1.jpg";
import kemasan2 from "@/public/images/foto/kemasan-tiga-ukuran-2.jpg";
import hampersRamadan4 from "@/public/images/foto/hampers-ramadan-4-botol.jpg";
import hampersRamadan2 from "@/public/images/foto/hampers-ramadan-2-botol.jpg";
import hampersNatal4 from "@/public/images/foto/hampers-natal-4-botol.jpg";
import hampersNatalCampur from "@/public/images/foto/hampers-natal-campur.jpg";
import kunirAsem1L from "@/public/images/foto/kunir-asem-1-liter.jpg";
import temulawak from "@/public/images/foto/temulawak.jpg";
import jaheMerah from "@/public/images/foto/jahe-merah.jpg";
import tasTaman from "@/public/images/foto/paket-tas-anyaman-taman.jpg";
import tasHijau from "@/public/images/foto/paket-tas-anyaman-hijau.jpg";
import tasRumput from "@/public/images/foto/paket-tas-anyaman-rumput.jpg";
import tasSenja from "@/public/images/foto/paket-tas-anyaman-senja.jpg";
import tasDanau from "@/public/images/foto/paket-tas-anyaman-danau.jpg";

/**
 * Foto dokumentasi asli Jamu Bu Ranti (folder "FOTO PRODUK JAMU BU RANTI").
 * Sudah diperkecil (maks. 1600px) dan metadata EXIF/GPS dihapus.
 * Import statis = Next.js otomatis membuat placeholder blur & ukuran responsif.
 */
export type Foto = {
  /** Import statis (foto lokal, dengan blur) atau URL (mis. Supabase Storage). */
  src: StaticImageData | string;
  alt: string;
  width?: number;
  height?: number;
};

export const foto = {
  traveling: {
    src: traveling,
    alt: "Botol Jamu Bu Ranti 250 ml digenggam di depan bangunan bersejarah",
  },
  kemasan1: {
    src: kemasan1,
    alt: "Tiga ukuran kemasan Jamu Bu Ranti: pouch 1 liter, botol 500 ml, dan botol 250 ml di atas tatakan rotan bersama kayu manis, cengkih, dan kunyit",
  },
  kemasan2: {
    src: kemasan2,
    alt: "Pouch 1 liter, botol 500 ml, dan botol 250 ml Jamu Bu Ranti dengan rempah di atas tatakan rotan",
  },
  hampersRamadan4: {
    src: hampersRamadan4,
    alt: "Hampers Ramadan berisi empat botol jamu 250 ml dengan kotak kraft dan kartu ucapan",
  },
  hampersRamadan2: {
    src: hampersRamadan2,
    alt: "Kotak hampers kraft berisi dua botol jamu Kunir Asem dan Beras Kencur dengan kartu Ramadan",
  },
  hampersNatal4: {
    src: hampersNatal4,
    alt: "Hampers Natal dan Tahun Baru: empat botol jamu 250 ml di depan kotak kraft berkartu ucapan",
  },
  hampersNatalCampur: {
    src: hampersNatalCampur,
    alt: "Kotak hampers bertema Natal, botol Kunir Asem 500 ml, dan pouch Beras Kencur 1 liter",
  },
  kunirAsem1L: {
    src: kunirAsem1L,
    alt: "Botol Kunir Asem 1 liter Jamu Bu Ranti di atas bangku kayu berukir",
  },
  temulawak: {
    src: temulawak,
    alt: "Segelas jamu Temulawak berwarna kuning cerah di samping botol 250 ml, sereh, dan potongan temulawak segar",
  },
  jaheMerah: {
    src: jaheMerah,
    alt: "Segelas jamu Jahe Merah dan botol 250 ml Jamu Bu Ranti di atas tatakan anyaman",
  },
  tasTaman: {
    src: tasTaman,
    alt: "Paket jamu ukuran 1 liter, 500 ml, dan 250 ml bersama tas anyaman di bangku taman",
  },
  tasHijau: {
    src: tasHijau,
    alt: "Dua pouch jamu 1 liter, botol 500 ml, dan botol 250 ml di samping tas anyaman hijau",
  },
  tasRumput: {
    src: tasRumput,
    alt: "Paket jamu pouch dan botol bersama tas anyaman merah muda di atas rumput",
  },
  tasSenja: {
    src: tasSenja,
    alt: "Paket jamu pouch dan botol bersama tas anyaman di luar ruangan saat sore",
  },
  tasDanau: {
    src: tasDanau,
    alt: "Paket jamu pouch dan botol dengan tas anyaman di tepi danau",
  },
} satisfies Record<string, Foto>;

/** Path di database (kolom image_url) → foto lokal beserta blur-nya. */
const fotoPerPath: Record<string, keyof typeof foto> = {
  "/images/foto/jamu-dibawa-traveling.jpg": "traveling",
  "/images/foto/kemasan-tiga-ukuran-1.jpg": "kemasan1",
  "/images/foto/kemasan-tiga-ukuran-2.jpg": "kemasan2",
  "/images/foto/hampers-ramadan-4-botol.jpg": "hampersRamadan4",
  "/images/foto/hampers-ramadan-2-botol.jpg": "hampersRamadan2",
  "/images/foto/hampers-natal-4-botol.jpg": "hampersNatal4",
  "/images/foto/hampers-natal-campur.jpg": "hampersNatalCampur",
  "/images/foto/kunir-asem-1-liter.jpg": "kunirAsem1L",
  "/images/foto/temulawak.jpg": "temulawak",
  "/images/foto/jahe-merah.jpg": "jaheMerah",
  "/images/foto/paket-tas-anyaman-taman.jpg": "tasTaman",
  "/images/foto/paket-tas-anyaman-hijau.jpg": "tasHijau",
  "/images/foto/paket-tas-anyaman-rumput.jpg": "tasRumput",
  "/images/foto/paket-tas-anyaman-senja.jpg": "tasSenja",
  "/images/foto/paket-tas-anyaman-danau.jpg": "tasDanau",
};

/**
 * Ubah image_url dari database menjadi Foto.
 * Foto lokal memakai import statis (ada blur); URL lain dipakai apa adanya.
 */
export function fotoDariUrl(
  url: string,
  alt: string,
  width?: number | null,
  height?: number | null,
): Foto {
  const kunci = fotoPerPath[url];
  if (kunci) return { ...foto[kunci], alt };
  return { src: url, alt, width: width ?? undefined, height: height ?? undefined };
}

/** Props aman untuk next/image: blur hanya untuk foto lokal. */
export function propsFoto(f: Foto) {
  return {
    src: f.src,
    alt: f.alt,
    placeholder: typeof f.src === "string" ? ("empty" as const) : ("blur" as const),
  };
}

/** Seperti propsFoto, plus width/height untuk URL (wajib bila tidak pakai `fill`). */
export function propsFotoUkuran(f: Foto) {
  if (typeof f.src !== "string") return propsFoto(f);
  return { ...propsFoto(f), width: f.width ?? 1200, height: f.height ?? 1200 };
}

/** Pilihan kemasan yang terlihat di foto produk asli. */
export const pilihanKemasan = [
  { ukuran: "250 ml", bentuk: "Botol kotak", cocok: "Pas untuk sekali minum" },
  { ukuran: "500 ml", bentuk: "Botol tinggi", cocok: "Untuk dinikmati berdua" },
  { ukuran: "1 liter", bentuk: "Pouch & botol", cocok: "Untuk keluarga di rumah" },
] as const;
