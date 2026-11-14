import type { JenisBahan } from "@/lib/data/produk";

/**
 * Ilustrasi bahan jamu (SVG buatan sendiri), viewBox 48x48.
 * Dipakai di label botol, kartu produk, dan placeholder galeri.
 */

const GARIS = "#1F3D2B";

function Isi({ jenis, warna }: { jenis: JenisBahan; warna: string }) {
  switch (jenis) {
    case "rimpang":
      return (
        <>
          <path
            d="M8 31c-4-4-2-11 4-11 1-5 7-7 10-3 3-5 10-5 12 0 5-1 9 4 6 9 4 3 2 10-4 10-2 4-8 4-10 1-3 3-9 3-11-1-4 1-8-2-7-5Z"
            fill={warna}
            stroke={GARIS}
            strokeOpacity=".35"
            strokeWidth="1.5"
          />
          <path
            d="M16 22c1.5 3 1.5 6-.5 9M26 17.5c1.5 3.5 1.5 7-.5 10.5M35.5 22.5c0 3-1 6-3 8"
            fill="none"
            stroke={GARIS}
            strokeOpacity=".3"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M22 17c1-3 3-5 6-6"
            fill="none"
            stroke="#3F7D4E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "daun":
      return (
        <>
          <path
            d="M8 41C8 21 22 8 42 7c0 20-14 34-34 34Z"
            fill={warna}
            stroke={GARIS}
            strokeOpacity=".25"
            strokeWidth="1.2"
          />
          <path
            d="M8 41 34 15M18 31l-.5-8M25 24l-.5-8.5M18 31l8.5.5M25 24l8.5-.5"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity=".55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </>
      );
    case "sirih":
      return (
        <>
          <path
            d="M24 44C13 36 5 28 5 19 5 12 10 7 16.5 7c3.5 0 6 1.6 7.5 4 1.5-2.4 4-4 7.5-4C38 7 43 12 43 19c0 9-8 17-19 25Z"
            fill={warna}
            stroke={GARIS}
            strokeOpacity=".25"
            strokeWidth="1.2"
          />
          <path
            d="M24 41V13M24 22c-4-3-8-3-12-2M24 22c4-3 8-3 12-2M24 31c-3-2-6-2-9-1M24 31c3-2 6-2 9-1"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity=".55"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </>
      );
    case "bunga":
      return (
        <>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="24"
              cy="13"
              rx="7.5"
              ry="10.5"
              fill={warna}
              stroke={GARIS}
              strokeOpacity=".2"
              strokeWidth="1"
              transform={`rotate(${r} 24 24)`}
            />
          ))}
          <circle cx="24" cy="24" r="5.5" fill="#F2D06B" />
          <circle cx="24" cy="24" r="2.2" fill={GARIS} fillOpacity=".45" />
        </>
      );
    case "sereh":
      return (
        <>
          <path
            d="M15 45C15 31 13 18 6 4M24 45C24 29 25 16 29 3M33 45c0-12 3-23 11-31"
            fill="none"
            stroke={warna}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M13 45h22"
            stroke={GARIS}
            strokeOpacity=".35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="15" y="34" width="18" height="10" rx="4" fill="#E9E1C4" />
        </>
      );
    case "asam":
      return (
        <>
          <path
            d="M5 32c3-9 9-7 13-12s10-9 14-5 8-2 11 2c2.5 4.5-1 8-5.5 9.5-4 6-10 4.5-14 9.5S10 42 6 38c-1.5-1.5-2-4-1-6Z"
            fill={warna}
            stroke={GARIS}
            strokeOpacity=".35"
            strokeWidth="1.4"
          />
          <path
            d="M12 31c3-3 6-5 9-7M23 23c3-2 6-3 9-4"
            fill="none"
            stroke="#FFFFFF"
            strokeOpacity=".35"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M41 13c2-3 3-6 2-9"
            fill="none"
            stroke="#3F7D4E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    case "beras":
      return (
        <>
          {[
            [16, 18, -25],
            [26, 14, 15],
            [34, 22, 40],
            [12, 30, 10],
            [22, 27, -10],
            [31, 33, 25],
            [20, 38, 60],
          ].map(([x, y, r]) => (
            <ellipse
              key={`${x}-${y}`}
              cx={x}
              cy={y}
              rx="3"
              ry="5.2"
              fill={warna}
              stroke={GARIS}
              strokeOpacity=".4"
              strokeWidth="1.2"
              transform={`rotate(${r} ${x} ${y})`}
            />
          ))}
        </>
      );
  }
}

export function IlustrasiBahan({
  jenis,
  warna,
  className,
}: {
  jenis: JenisBahan;
  warna: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <Isi jenis={jenis} warna={warna} />
    </svg>
  );
}

/** Versi untuk disisipkan di dalam SVG lain (mis. label botol). */
export function IlustrasiBahanSvg({
  jenis,
  warna,
  x,
  y,
  ukuran,
}: {
  jenis: JenisBahan;
  warna: string;
  x: number;
  y: number;
  ukuran: number;
}) {
  return (
    <svg x={x} y={y} width={ukuran} height={ukuran} viewBox="0 0 48 48">
      <Isi jenis={jenis} warna={warna} />
    </svg>
  );
}
