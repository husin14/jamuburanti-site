"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, Star } from "lucide-react";
import { Bidang, Honeypot, PesanSukses, kelasInput } from "@/components/ui/Form";
import { kirimTestimoni } from "@/app/(site)/actions";
import { PilihFoto } from "@/components/testimoni/PilihFoto";
import { validasiTestimoni, type Galat, type HasilForm } from "@/lib/validasi";
import { cn } from "@/lib/utils/cn";

const awal: HasilForm = { status: "awal" };

type Aspek = "rasa" | "kualitas" | "pelayanan";
const aspek: { kunci: Aspek; label: string }[] = [
  { kunci: "rasa", label: "Rasa" },
  { kunci: "kualitas", label: "Kualitas" },
  { kunci: "pelayanan", label: "Pelayanan" },
];

function PilihBintang({
  kunci,
  label,
  nilai,
  ubah,
}: {
  kunci: Aspek;
  label: string;
  nilai: number;
  ubah: (n: number) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl bg-white/70 px-4 py-2 ring-1 ring-herbal/10">
      <legend className="sr-only">Nilai {label.toLowerCase()}</legend>
      <span className="font-semibold" aria-hidden="true">
        {label}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="relative cursor-pointer p-0.5">
            <input
              type="radio"
              name={`rating-${kunci}`}
              value={n}
              checked={nilai === n}
              onChange={() => ubah(n)}
              className="peer sr-only"
            />
            <span className="sr-only">
              {n} bintang untuk {label.toLowerCase()}
            </span>
            <Star
              aria-hidden="true"
              className={cn(
                "h-8 w-8 rounded-md transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-telang",
                n <= nilai ? "fill-kunyit text-kunyit" : "fill-herbal/5 text-herbal/30",
              )}
            />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Form "Bagikan Pengalamanmu" → tabel `testimonials` (is_approved = false,
 * menunggu persetujuan admin). Dicek di browser & di server.
 */
export function FormTestimoni({ namaProduk }: { namaProduk: string[] }) {
  const [hasil, aksi, menunggu] = useActionState(kirimTestimoni, awal);
  const [rating, setRating] = useState<Record<Aspek, number>>({
    rasa: 0,
    kualitas: 0,
    pelayanan: 0,
  });
  const [galatKlien, setGalatKlien] = useState<Galat | null>(null);
  const mulai = useRef(0);

  useEffect(() => {
    mulai.current = Date.now();
  }, []);

  if (hasil.status === "sukses") {
    return (
      <PesanSukses judul="Terima kasih sudah berbagi! 🌿">
        <p>Ulasanmu sudah kami terima dan akan tampil setelah dicek admin.</p>
      </PesanSukses>
    );
  }

  const galat = galatKlien ?? hasil.galat ?? {};

  return (
    <form
      action={aksi}
      noValidate
      className="relative space-y-5"
      onSubmit={(e) => {
        const { galat: g } = validasiTestimoni(new FormData(e.currentTarget));
        if (Object.keys(g).length > 0) {
          e.preventDefault();
          setGalatKlien(g);
        } else {
          setGalatKlien(null);
        }
      }}
    >
      <Honeypot />
      <input type="hidden" name="dimulai" />

      {hasil.status === "galat" && hasil.pesan && (
        <p role="alert" className="rounded-2xl bg-rosella/10 p-4 text-sm font-semibold text-rosella ring-1 ring-rosella/30">
          {hasil.pesan}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Bidang label="Nama atau inisial" id="t-nama" wajib galat={galat.nama}>
          <input
            id="t-nama"
            name="nama"
            autoComplete="name"
            maxLength={60}
            className={kelasInput}
            aria-invalid={Boolean(galat.nama)}
            aria-describedby={galat.nama ? "t-nama-galat" : undefined}
          />
        </Bidang>
        <Bidang label="Jamu yang kamu coba" id="t-produk">
          <select id="t-produk" name="produk" className={kelasInput} defaultValue="">
            <option value="">Pilih (opsional)</option>
            {namaProduk.map((nama) => (
              <option key={nama} value={nama}>
                {nama}
              </option>
            ))}
            <option value="Paket Hampers">Paket Hampers</option>
          </select>
        </Bidang>
      </div>

      <div>
        <p className="mb-1.5 font-semibold">
          Beri penilaian
          <span className="text-rosella" aria-hidden="true">
            {" "}*
          </span>
        </p>
        <div className="grid gap-2">
          {aspek.map((a) => (
            <PilihBintang
              key={a.kunci}
              kunci={a.kunci}
              label={a.label}
              nilai={rating[a.kunci]}
              ubah={(n) => setRating((r) => ({ ...r, [a.kunci]: n }))}
            />
          ))}
        </div>
        {galat.rating && (
          <p className="mt-1 text-sm font-semibold text-rosella">{galat.rating}</p>
        )}
      </div>

      <Bidang label="Ceritakan pengalamanmu" id="t-ulasan" wajib galat={galat.ulasan}>
        <textarea
          id="t-ulasan"
          name="ulasan"
          rows={4}
          maxLength={500}
          className={kelasInput}
          aria-invalid={Boolean(galat.ulasan)}
          aria-describedby={galat.ulasan ? "t-ulasan-galat" : undefined}
        />
      </Bidang>

      <PilihFoto galat={galat.foto} />

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="persetujuan"
            className="mt-1 h-5 w-5 shrink-0 accent-daun"
            aria-invalid={Boolean(galat.persetujuan)}
          />
          <span>
            Saya setuju nama/inisial, ulasan, dan foto (bila ada) ini
            ditampilkan di website Jamu Bu Ranti.
          </span>
        </label>
        {galat.persetujuan && (
          <p className="mt-1 text-sm font-semibold text-rosella">{galat.persetujuan}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={menunggu}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-kunyit px-7 py-3 font-semibold text-herbal shadow-lembut transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
      >
        {menunggu && (
          <LoaderCircle className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
        )}
        {menunggu ? "Mengirim…" : "Kirim Ulasan"}
      </button>
    </form>
  );
}
