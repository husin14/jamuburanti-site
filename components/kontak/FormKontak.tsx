"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { Bidang, Honeypot, PesanSukses, kelasInput } from "@/components/ui/Form";
import { IkonWhatsApp } from "@/components/ui/Ikon";
import { kirimPesan } from "@/app/(site)/actions";
import { topikPesan, validasiPesan, type Galat, type HasilForm } from "@/lib/validasi";

const awal: HasilForm = { status: "awal" };

/** Formulir pesan → disimpan ke database (tabel `messages`), dicek di browser & server. */
export function FormKontak() {
  const [hasil, aksi, menunggu] = useActionState(kirimPesan, awal);
  const [galatKlien, setGalatKlien] = useState<Galat | null>(null);
  const mulai = useRef(0);

  // Waktu form mulai diisi (penangkal bot yang mengirim seketika)
  useEffect(() => {
    mulai.current = Date.now();
  }, []);

  if (hasil.status === "sukses") {
    return (
      <PesanSukses judul="Pesanmu sudah kami terima! 🌿">
        <p>
          Terima kasih sudah menghubungi Jamu Bu Ranti. Kami balas secepatnya di
          jam buka (07.00–21.00 WIB) lewat kontak yang kamu berikan.
        </p>
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
        const { galat: g } = validasiPesan(new FormData(e.currentTarget));
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
        <div role="alert" className="rounded-2xl bg-rosella/10 p-4 text-sm ring-1 ring-rosella/30">
          <p className="font-semibold text-rosella">{hasil.pesan}</p>
          {hasil.waCadangan && (
            <a
              href={hasil.waCadangan}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-wa px-5 font-semibold text-herbal"
            >
              <IkonWhatsApp className="h-5 w-5" />
              Kirim lewat WhatsApp
            </a>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Bidang label="Nama" id="k-nama" wajib galat={galat.nama}>
          <input
            id="k-nama"
            name="nama"
            autoComplete="name"
            maxLength={60}
            className={kelasInput}
            aria-invalid={Boolean(galat.nama)}
            aria-describedby={galat.nama ? "k-nama-galat" : undefined}
          />
        </Bidang>
        <Bidang
          label="WhatsApp atau email"
          id="k-kontak"
          wajib
          galat={galat.kontak}
          bantuan="Agar kami bisa membalas."
        >
          <input
            id="k-kontak"
            name="kontak"
            inputMode="email"
            maxLength={80}
            className={kelasInput}
            aria-invalid={Boolean(galat.kontak)}
            aria-describedby={galat.kontak ? "k-kontak-galat" : "k-kontak-bantuan"}
          />
        </Bidang>
      </div>
      <Bidang label="Topik" id="k-topik" wajib galat={galat.topik}>
        <select
          id="k-topik"
          name="topik"
          defaultValue=""
          className={kelasInput}
          aria-invalid={Boolean(galat.topik)}
          aria-describedby={galat.topik ? "k-topik-galat" : undefined}
        >
          <option value="" disabled>
            Pilih topik
          </option>
          {topikPesan.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Bidang>
      <Bidang label="Pesan" id="k-pesan" wajib galat={galat.pesan}>
        <textarea
          id="k-pesan"
          name="pesan"
          rows={5}
          maxLength={1000}
          className={kelasInput}
          aria-invalid={Boolean(galat.pesan)}
          aria-describedby={galat.pesan ? "k-pesan-galat" : undefined}
        />
      </Bidang>
      <button
        type="submit"
        disabled={menunggu}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-kunyit px-7 py-3 font-semibold text-herbal shadow-lembut transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-wait disabled:opacity-70"
      >
        {menunggu ? (
          <LoaderCircle className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
        ) : (
          <Send className="h-5 w-5" aria-hidden="true" />
        )}
        {menunggu ? "Mengirim…" : "Kirim Pesan"}
      </button>
    </form>
  );
}
