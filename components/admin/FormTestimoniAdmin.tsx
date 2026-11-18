"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Star } from "lucide-react";
import { simpanTestimoni } from "@/app/admin/actions/pesan-testimoni";
import { cn } from "@/lib/utils/cn";
import { Centang, FormAdmin, Isian, IsianTeks, Pilihan, TombolSimpan } from "./UI";
import { UnggahGambar } from "./UnggahGambar";

export type DataTestimoniAdmin = {
  id?: string;
  name: string;
  product: string | null;
  rating_taste: number;
  rating_quality: number;
  rating_service: number;
  review: string;
  consent: boolean;
  is_approved: boolean;
  photo_url: string | null;
  created_at?: string;
};

type Aspek = "rasa" | "kualitas" | "pelayanan";

function PilihBintang({
  nilai,
  ubah,
  label,
  besar = false,
}: {
  nilai: number;
  ubah: (n: number) => void;
  label: string;
  besar?: boolean;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => ubah(n)}
          aria-pressed={n === nilai}
          aria-label={`${label}: ${n} bintang`}
          className="rounded-md p-0.5 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-telang"
        >
          <Star
            aria-hidden="true"
            className={cn(
              besar ? "h-9 w-9" : "h-6 w-6",
              n <= nilai ? "fill-kunyit text-kunyit" : "fill-herbal/5 text-herbal/30",
            )}
          />
        </button>
      ))}
    </div>
  );
}

const keterangan = ["", "Kurang", "Cukup", "Baik", "Bagus", "Sangat bagus"];

/**
 * Tambah/ubah testimoni dari panel admin. Cukup unggah screenshot ulasan
 * pelanggan (mis. dari WhatsApp) dan beri rating; detail lain opsional.
 * `fotoPrivat` = pratinjau foto kiriman pelanggan yang belum dipublikasikan.
 */
export function FormTestimoniAdmin({
  awal,
  namaProduk,
  fotoPrivat,
}: {
  awal: DataTestimoniAdmin;
  namaProduk: string[];
  fotoPrivat?: string | null;
}) {
  const [nilai, setNilai] = useState<Record<Aspek, number>>({
    rasa: awal.rating_taste,
    kualitas: awal.rating_quality,
    pelayanan: awal.rating_service,
  });
  const samaSemua = nilai.rasa === nilai.kualitas && nilai.kualitas === nilai.pelayanan;
  const [perAspek, setPerAspek] = useState(!samaSemua);
  const [bukaDetail, setBukaDetail] = useState(Boolean(awal.id && awal.review));
  const umum = Math.round((nilai.rasa + nilai.kualitas + nilai.pelayanan) / 3);

  const produk =
    awal.product && !namaProduk.includes(awal.product) ? [awal.product, ...namaProduk] : namaProduk;
  const adaFotoPrivat = Boolean(fotoPrivat && !awal.photo_url);

  return (
    <FormAdmin aksi={simpanTestimoni}>
      {awal.id && <input type="hidden" name="id" value={awal.id} />}
      <input type="hidden" name="rating_taste" value={nilai.rasa} />
      <input type="hidden" name="rating_quality" value={nilai.kualitas} />
      <input type="hidden" name="rating_service" value={nilai.pelayanan} />

      <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-5">
          {/* 1. Foto */}
          <section className="space-y-3 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <h2 className="text-lg font-semibold">1. Foto testimoni</h2>
            {adaFotoPrivat && (
              <div className="flex items-center gap-3 rounded-xl bg-jahe/50 p-3">
                <a
                  href={fotoPrivat!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block h-20 w-20 shrink-0 overflow-hidden rounded-lg"
                  title="Buka foto ukuran penuh"
                >
                  <Image src={fotoPrivat!} alt="Foto kiriman pelanggan" fill unoptimized sizes="5rem" className="object-cover" />
                </a>
                <p className="text-sm text-herbal/80">
                  Foto kiriman pelanggan, <strong>belum publik</strong>. Ikut tampil saat
                  ulasan disetujui. Unggah foto lain di bawah bila ingin menggantinya.
                </p>
              </div>
            )}
            <UnggahGambar
              name="photo_url"
              folder="testimoni"
              awal={awal.photo_url}
              label={adaFotoPrivat ? "Ganti dengan foto lain (opsional)" : "Screenshot ulasan atau foto pelanggan"}
            />
            <p className="text-xs text-herbal/65">
              Mis. tangkapan layar chat WhatsApp/DM Instagram. Samarkan nomor HP pelanggan dulu.
            </p>
          </section>

          {/* 2. Rating */}
          <section className="rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <h2 className="text-lg font-semibold">2. Rating</h2>
            {!perAspek ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <PilihBintang
                  besar
                  label="Rating"
                  nilai={umum}
                  ubah={(n) => setNilai({ rasa: n, kualitas: n, pelayanan: n })}
                />
                <span className="text-sm font-semibold text-herbal/75">
                  {umum}/5 · {keterangan[umum]}
                </span>
              </div>
            ) : (
              <div className="mt-3 grid gap-2">
                {(
                  [
                    ["rasa", "Rasa"],
                    ["kualitas", "Kualitas"],
                    ["pelayanan", "Pelayanan"],
                  ] as const
                ).map(([kunci, label]) => (
                  <div
                    key={kunci}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-krem/60 px-3 py-1.5"
                  >
                    <span className="text-sm font-semibold">{label}</span>
                    <PilihBintang
                      label={label}
                      nilai={nilai[kunci]}
                      ubah={(n) => setNilai((v) => ({ ...v, [kunci]: n }))}
                    />
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (perAspek) setNilai({ rasa: umum, kualitas: umum, pelayanan: umum });
                setPerAspek(!perAspek);
              }}
              className="mt-3 text-sm font-semibold text-daun underline-offset-4 hover:underline"
            >
              {perAspek ? "Pakai satu rating saja" : "Beri nilai per aspek (rasa, kualitas, pelayanan)"}
            </button>
          </section>

          {/* Detail opsional */}
          <section className="rounded-[1.25rem] bg-white ring-1 ring-herbal/10">
            <button
              type="button"
              onClick={() => setBukaDetail(!bukaDetail)}
              aria-expanded={bukaDetail}
              className="flex w-full items-center justify-between gap-3 p-5 text-left"
            >
              <span>
                <span className="block font-semibold">Detail tambahan</span>
                <span className="block text-xs text-herbal/65">
                  Opsional: nama pelanggan, jamu, teks ulasan, tanggal
                </span>
              </span>
              <ChevronDown
                className={cn("h-5 w-5 shrink-0 transition-transform", bukaDetail && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {/* Tetap di DOM (hanya disembunyikan) agar isiannya ikut terkirim */}
            <div className={cn("space-y-4 border-t border-herbal/10 p-5", !bukaDetail && "hidden")}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Isian
                  label="Nama pelanggan"
                  name="name"
                  maxLength={60}
                  defaultValue={awal.name === "Pelanggan" ? "" : awal.name}
                  bantuan='Kosong = tampil sebagai "Pelanggan".'
                />
                <Pilihan
                  label="Jamu yang dibeli"
                  name="product"
                  defaultValue={awal.product ?? ""}
                  opsi={[{ nilai: "", label: "Tidak disebutkan" }, ...produk, "Paket Hampers"]}
                />
              </div>
              <IsianTeks
                label="Teks ulasan"
                name="review"
                rows={4}
                maxLength={500}
                defaultValue={awal.review}
                bantuan="Boleh kosong bila sudah ada screenshot. Bila diisi, minimal 10 huruf."
              />
              <Isian
                label="Tanggal ulasan"
                name="tanggal"
                type="date"
                defaultValue={awal.created_at?.slice(0, 10)}
                bantuan="Kosong = hari ini."
                className="max-w-xs"
              />
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <Centang
            label="Pelanggan sudah mengizinkan"
            name="consent"
            defaultChecked={awal.consent}
            bantuan="Ulasan & fotonya boleh ditampilkan di website."
          />
          <TombolSimpan className="w-full">
            {awal.id ? "Simpan perubahan" : "Simpan & tampilkan"}
          </TombolSimpan>
          {!awal.id && (
            <p className="text-xs text-herbal/65">Testimoni langsung tampil di website setelah disimpan.</p>
          )}
        </div>
      </div>
    </FormAdmin>
  );
}
