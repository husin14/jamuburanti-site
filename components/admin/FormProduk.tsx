"use client";

import { useState } from "react";
import { BotolJamu } from "@/components/produk/BotolJamu";
import { IlustrasiBahan } from "@/components/produk/IlustrasiBahan";
import { kategoriKebutuhan } from "@/lib/data/kategori";
import type { JenisBahan } from "@/lib/data/produk";
import { buatSlug } from "@/lib/utils/slug";
import { simpanProduk } from "@/app/admin/actions/produk";
import { UnggahGambar } from "./UnggahGambar";
import { Centang, FormAdmin, Isian, IsianTeks, Pilihan, TombolSimpan, kelasIsian } from "./UI";

export type DataProdukAdmin = {
  id?: string;
  name: string;
  slug: string;
  categories: string[];
  short_benefit: string;
  benefits: string;
  ingredients: string | null;
  package_size: string | null;
  price_min: number | null;
  price_max: number | null;
  image_url: string | null;
  image_alt: string | null;
  visual: { cairan?: string; latar?: string; bahan?: { jenis: string; warna: string }[] };
  is_bestseller: boolean;
  is_new: boolean;
  is_available: boolean;
  is_published: boolean;
  sort_order: number;
};

const opsiBahan = [
  { nilai: "", label: "— tidak ada —" },
  { nilai: "rimpang", label: "Rimpang (jahe/kunyit/kencur)" },
  { nilai: "daun", label: "Daun" },
  { nilai: "sirih", label: "Daun sirih" },
  { nilai: "bunga", label: "Bunga (rosella/telang)" },
  { nilai: "sereh", label: "Sereh" },
  { nilai: "asam", label: "Asam jawa" },
  { nilai: "beras", label: "Beras" },
];

export function FormProduk({ awal }: { awal: DataProdukAdmin }) {
  const baru = !awal.id;
  const [nama, setNama] = useState(awal.name);
  const [slug, setSlug] = useState(awal.slug);
  const [slugManual, setSlugManual] = useState(!baru);
  const [cairan, setCairan] = useState(awal.visual.cairan ?? "#E8A317");
  const [latar, setLatar] = useState(awal.visual.latar ?? "#F3E6CF");
  const [bahan, setBahan] = useState(
    [0, 1].map((i) => ({
      jenis: awal.visual.bahan?.[i]?.jenis ?? "",
      warna: awal.visual.bahan?.[i]?.warna ?? "#3F7D4E",
    })),
  );

  const bahanValid = bahan.filter((b) => b.jenis) as { jenis: JenisBahan; warna: string }[];

  return (
    <FormAdmin aksi={simpanProduk}>
      {awal.id && <input type="hidden" name="id" value={awal.id} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-6">
          {/* Info utama */}
          <fieldset className="space-y-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Informasi produk</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Isian
                label="Nama produk"
                name="name"
                wajib
                maxLength={60}
                value={nama}
                onChange={(e) => {
                  setNama(e.target.value);
                  if (!slugManual) setSlug(buatSlug(e.target.value));
                }}
              />
              <Isian
                label="Slug (alamat halaman)"
                name="slug"
                wajib
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                bantuan={`jamuburanti.com/produk/${slug || "…"}`}
              />
            </div>
            <Isian
              label="Ringkasan 1 baris (tampil di kartu produk)"
              name="short_benefit"
              maxLength={90}
              defaultValue={awal.short_benefit}
            />
            <IsianTeks
              label="Khasiat tradisional"
              name="benefits"
              rows={3}
              defaultValue={awal.benefits}
              bantuan='Gunakan framing tradisional, mis. "Secara tradisional dipercaya membantu…". Hindari kata "mengobati" atau "menyembuhkan".'
            />
            <div>
              <p className="mb-1 text-sm font-semibold">Kategori kebutuhan</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {kategoriKebutuhan.map((k) => (
                  <Centang
                    key={k.slug}
                    name="categories"
                    label={k.label}
                    defaultChecked={awal.categories.includes(k.slug)}
                  />
                ))}
              </div>
            </div>
          </fieldset>

          {/* Detail */}
          <fieldset className="space-y-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Detail & harga</legend>
            <IsianTeks
              label="Komposisi bahan"
              name="ingredients"
              rows={2}
              defaultValue={awal.ingredients ?? ""}
              bantuan="Kosongkan bila belum ada; website menampilkan penanda [ISI]."
            />
            <Isian
              label="Ukuran kemasan"
              name="package_size"
              defaultValue={awal.package_size ?? ""}
              placeholder="mis. 250 ml, 500 ml, 1 liter"
              bantuan="Kosongkan untuk menampilkan pilihan umum 250 ml / 500 ml / 1 liter."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Isian
                label="Harga mulai (Rp)"
                name="price_min"
                inputMode="numeric"
                defaultValue={awal.price_min ?? ""}
                placeholder="6000"
                bantuan='Kosong = tampil "Mulai Rp6 ribu".'
              />
              <Isian
                label="Harga sampai (Rp, opsional)"
                name="price_max"
                inputMode="numeric"
                defaultValue={awal.price_max ?? ""}
                placeholder="30000"
              />
            </div>
          </fieldset>

          {/* Foto */}
          <fieldset className="space-y-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Foto produk</legend>
            <UnggahGambar name="image_url" awal={awal.image_url} folder="produk" />
            <Isian
              label="Deskripsi foto (alt text)"
              name="image_alt"
              defaultValue={awal.image_alt ?? ""}
              placeholder="mis. Botol Kunir Asem 250 ml di atas meja kayu"
              bantuan="Wajib bila ada foto. Dibaca oleh pembaca layar & mesin pencari."
            />
            <p className="text-sm text-herbal/70">
              Tanpa foto, website menampilkan ilustrasi botol sesuai warna di samping.
            </p>
          </fieldset>

          {/* Status */}
          <fieldset className="space-y-3 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Status & urutan</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <Centang name="is_published" label="Tampil di website" defaultChecked={awal.is_published} />
              <Centang name="is_available" label="Tersedia (stok ada)" defaultChecked={awal.is_available} bantuan='Bila tidak dicentang, muncul label "Habis".' />
              <Centang name="is_bestseller" label="Terlaris" defaultChecked={awal.is_bestseller} bantuan="4 produk terlaris pertama tampil di Beranda." />
              <Centang name="is_new" label="Varian baru" defaultChecked={awal.is_new} />
            </div>
            <Isian
              label="Urutan tampil"
              name="sort_order"
              inputMode="numeric"
              defaultValue={awal.sort_order}
              bantuan="Angka kecil tampil lebih dulu."
              className="max-w-40"
            />
          </fieldset>
        </div>

        {/* Desain botol + pratinjau */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <p className="text-lg font-semibold">Desain ilustrasi botol</p>
            <div
              className="relative mt-3 flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl"
              style={{ backgroundColor: latar }}
            >
              {bahanValid[0] && (
                <IlustrasiBahan
                  jenis={bahanValid[0].jenis}
                  warna={bahanValid[0].warna}
                  className="absolute left-3 top-6 w-10 -rotate-12"
                />
              )}
              {bahanValid[1] && (
                <IlustrasiBahan
                  jenis={bahanValid[1].jenis}
                  warna={bahanValid[1].warna}
                  className="absolute bottom-4 right-3 w-10 rotate-12"
                />
              )}
              <BotolJamu
                produk={{ nama: nama || "Nama", visual: { cairan, latar, bahan: bahanValid } }}
                className="h-[85%] w-auto drop-shadow-lg"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                Warna jamu
                <input
                  type="color"
                  name="cairan"
                  value={cairan}
                  onChange={(e) => setCairan(e.target.value)}
                  className="mt-1 h-11 w-full cursor-pointer rounded-xl border-2 border-herbal/15 bg-white"
                />
              </label>
              <label className="text-sm font-semibold">
                Warna latar
                <input
                  type="color"
                  name="latar"
                  value={latar}
                  onChange={(e) => setLatar(e.target.value)}
                  className="mt-1 h-11 w-full cursor-pointer rounded-xl border-2 border-herbal/15 bg-white"
                />
              </label>
            </div>
            {[0, 1].map((i) => (
              <div key={i} className="mt-3 grid grid-cols-[1fr_3.5rem] items-end gap-2">
                <Pilihan
                  label={`Bahan ${i + 1}`}
                  name={`bahan${i + 1}_jenis`}
                  opsi={opsiBahan}
                  value={bahan[i].jenis}
                  onChange={(e) =>
                    setBahan((b) => b.map((x, j) => (j === i ? { ...x, jenis: e.target.value } : x)))
                  }
                />
                <input
                  type="color"
                  name={`bahan${i + 1}_warna`}
                  aria-label={`Warna bahan ${i + 1}`}
                  value={bahan[i].warna}
                  onChange={(e) =>
                    setBahan((b) => b.map((x, j) => (j === i ? { ...x, warna: e.target.value } : x)))
                  }
                  className={`${kelasIsian} h-11 cursor-pointer p-1`}
                />
              </div>
            ))}
          </div>

          <TombolSimpan className="w-full min-h-12 text-base">
            {awal.id ? "Simpan perubahan" : "Tambah produk"}
          </TombolSimpan>
        </aside>
      </div>
    </FormAdmin>
  );
}
