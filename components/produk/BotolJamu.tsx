import { useId } from "react";
import type { Produk } from "@/lib/data/produk";
import { IlustrasiBahanSvg } from "./IlustrasiBahan";

/**
 * Ilustrasi botol jamu (desain sementara sampai foto produk asli tersedia).
 * Warna cairan, ilustrasi bahan di label, dan nama produk mengikuti data produk.
 */

const BADAN =
  "M46 28h28v24c0 10 22 18 22 44v136c0 12-8 20-20 20H44c-12 0-20-8-20-20V96c0-26 22-34 22-44V28Z";

/** Pecah nama panjang jadi dua baris di spasi yang paling tengah. */
function pecahNama(nama: string): string[] {
  if (nama.length <= 10 || !nama.includes(" ")) return [nama];
  const tengah = nama.length / 2;
  let posisi = -1;
  for (let i = 0; i < nama.length; i++) {
    if (nama[i] === " " && (posisi < 0 || Math.abs(i - tengah) < Math.abs(posisi - tengah))) {
      posisi = i;
    }
  }
  return [nama.slice(0, posisi), nama.slice(posisi + 1)];
}

export function BotolJamu({
  produk,
  className,
}: {
  produk: Pick<Produk, "nama" | "visual">;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const { cairan, bahan } = produk.visual;
  const baris = pecahNama(produk.nama);
  const panjang = Math.max(...baris.map((b) => b.length));
  const ukuranHuruf = panjang > 9 ? 9.5 : panjang > 6 ? 11 : 13;
  const bahanLabel = bahan[0];

  return (
    <svg
      viewBox="0 0 120 260"
      role="img"
      aria-label={`Ilustrasi botol jamu ${produk.nama}`}
      className={className}
    >
      <defs>
        <clipPath id={`badan-${id}`}>
          <path d={BADAN} />
        </clipPath>
        <linearGradient id={`bayang-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset=".75" stopColor="#000" stopOpacity=".05" />
          <stop offset="1" stopColor="#000" stopOpacity=".22" />
        </linearGradient>
      </defs>

      {/* tutup */}
      <rect x="42" y="4" width="36" height="26" rx="6" fill="#1F3D2B" />
      <path
        d="M48 9v16M54 9v16M60 9v16M66 9v16M72 9v16"
        stroke="#FBF6EC"
        strokeOpacity=".18"
        strokeWidth="2"
      />

      {/* kaca + cairan */}
      <path d={BADAN} fill="#FFFFFF" fillOpacity=".55" />
      <g clipPath={`url(#badan-${id})`}>
        <path
          d="M0 74c20-8 40 8 60 0s40-8 60 0v190H0Z"
          fill={cairan}
        />
        <path
          d="M0 74c20-8 40 8 60 0s40-8 60 0"
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity=".35"
          strokeWidth="3"
        />
        <rect x="0" y="0" width="120" height="260" fill={`url(#bayang-${id})`} />
      </g>
      <path
        d={BADAN}
        fill="none"
        stroke="#1F3D2B"
        strokeOpacity=".18"
        strokeWidth="1.5"
      />

      {/* kilau kaca */}
      <path
        d="M35 104c0-15 9-22 13-30M33 120v60"
        stroke="#FFFFFF"
        strokeOpacity=".5"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {/* label */}
      <rect
        x="28"
        y="122"
        width="64"
        height="88"
        rx="12"
        fill="#FBF6EC"
        stroke="#1F3D2B"
        strokeOpacity=".12"
      />
      {bahanLabel && (
        <IlustrasiBahanSvg
          jenis={bahanLabel.jenis}
          warna={bahanLabel.warna}
          x={47}
          y={128}
          ukuran={26}
        />
      )}
      <text
        x="60"
        y="164"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        letterSpacing="1.2"
        fill="#3F7D4E"
      >
        JAMU BU RANTI
      </text>
      <line
        x1="40"
        x2="80"
        y1="169"
        y2="169"
        stroke="#E8A317"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {baris.map((b, i) => (
        <text
          key={b}
          x="60"
          y={baris.length === 1 ? 188 : 182 + i * (ukuranHuruf + 2)}
          textAnchor="middle"
          fontSize={ukuranHuruf}
          fontWeight="700"
          fill="#1F3D2B"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          {b}
        </text>
      ))}
    </svg>
  );
}
