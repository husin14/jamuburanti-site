import { Quote, Star } from "lucide-react";
import { rataRata, type Testimoni } from "@/lib/data/testimoni";
import { cn } from "@/lib/utils/cn";

const warnaAvatar = ["#E8A317", "#3F7D4E", "#B83A3A", "#4B5FB0", "#C2562E"];

function inisial(nama: string) {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((k) => k[0])
    .join("")
    .toUpperCase();
}

export function Bintang({
  nilai,
  className,
}: {
  nilai: number;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex gap-0.5", className)}
      role="img"
      aria-label={`${nilai} dari 5 bintang`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            "h-4 w-4",
            i <= Math.round(nilai)
              ? "fill-kunyit text-kunyit"
              : "fill-herbal/10 text-herbal/20",
          )}
        />
      ))}
    </span>
  );
}

export function KartuTestimoni({
  t,
  indeks = 0,
  className,
}: {
  t: Testimoni;
  indeks?: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative flex h-full flex-col rounded-[1.75rem] bg-white/80 p-6 ring-1 ring-herbal/10",
        className,
      )}
    >
      <Quote
        className="absolute right-5 top-5 h-8 w-8 text-kunyit/40"
        aria-hidden="true"
      />
      <div className="flex items-center gap-2">
        <Bintang nilai={rataRata(t)} />
        <span className="text-sm font-bold">{rataRata(t).toFixed(1)}</span>
      </div>

      <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed">
        &ldquo;{t.ulasan}&rdquo;
      </blockquote>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-jahe/60 p-3 text-center text-xs">
        {(
          [
            ["Rasa", t.rating.rasa],
            ["Kualitas", t.rating.kualitas],
            ["Pelayanan", t.rating.pelayanan],
          ] as const
        ).map(([label, nilai]) => (
          <div key={label}>
            <dt className="text-herbal/75">{label}</dt>
            <dd className="font-bold">{nilai}/5</dd>
          </div>
        ))}
      </dl>

      <figcaption className="mt-5 flex items-center gap-3">
        <span
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-krem"
          style={{ backgroundColor: warnaAvatar[indeks % warnaAvatar.length] }}
          aria-hidden="true"
        >
          {inisial(t.nama)}
        </span>
        <span>
          <span className="block font-semibold">{t.nama}</span>
          <span className="block text-sm text-herbal/75">
            {t.kota} · {t.produk}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
