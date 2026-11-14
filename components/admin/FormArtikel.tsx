"use client";

import { useState } from "react";
import { kategoriArtikel } from "@/lib/data/berita";
import { buatSlug } from "@/lib/utils/slug";
import { simpanArtikel } from "@/app/admin/actions/konten";
import { Centang, FormAdmin, Isian, IsianTeks, Pilihan, TombolSimpan } from "./UI";

export type DataArtikelAdmin = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string | null;
  external_url: string | null;
  source: string | null;
  author: string | null;
  published_at: string | null;
  cover_style: { warna?: string; aksen?: string } | null;
  is_published: boolean;
};

export function FormArtikel({ awal }: { awal: DataArtikelAdmin }) {
  const baru = !awal.id;
  const [judul, setJudul] = useState(awal.title);
  const [slug, setSlug] = useState(awal.slug);
  const [slugManual, setSlugManual] = useState(!baru);
  const [jenis, setJenis] = useState<"internal" | "liputan">(
    awal.external_url ? "liputan" : "internal",
  );
  const [warna, setWarna] = useState(awal.cover_style?.warna ?? "#1F3D2B");
  const [aksen, setAksen] = useState(awal.cover_style?.aksen ?? "#E8A317");

  return (
    <FormAdmin aksi={simpanArtikel}>
      {awal.id && <input type="hidden" name="id" value={awal.id} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_17rem]">
        <div className="space-y-6">
          <fieldset className="space-y-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Jenis artikel</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["internal", "Artikel di website", "Ditulis di sini, punya halaman sendiri."],
                  ["liputan", "Liputan media", "Kartu yang membuka artikel di situs media."],
                ] as const
              ).map(([nilai, label, bantu]) => (
                <label
                  key={nilai}
                  className={`flex cursor-pointer gap-3 rounded-xl p-3 ring-2 ${
                    jenis === nilai ? "bg-kunyit/15 ring-kunyit" : "bg-white ring-herbal/10"
                  }`}
                >
                  <input
                    type="radio"
                    name="jenis"
                    checked={jenis === nilai}
                    onChange={() => setJenis(nilai)}
                    className="mt-1 accent-daun"
                  />
                  <span>
                    <span className="block font-semibold">{label}</span>
                    <span className="block text-xs text-herbal/65">{bantu}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-4 rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <legend className="px-1 text-lg font-semibold">Isi</legend>
            <Isian
              label="Judul"
              name="title"
              wajib
              maxLength={140}
              value={judul}
              onChange={(e) => {
                setJudul(e.target.value);
                if (!slugManual) setSlug(buatSlug(e.target.value));
              }}
            />
            <Isian
              label="Slug"
              name="slug"
              wajib
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              bantuan={jenis === "internal" ? `jamuburanti.com/berita/${slug || "…"}` : "Penanda unik artikel."}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Pilihan label="Kategori" name="category" opsi={kategoriArtikel} defaultValue={awal.category} />
              <Isian
                label="Tanggal terbit"
                name="published_at"
                type="date"
                defaultValue={awal.published_at ?? ""}
                bantuan="Boleh dikosongkan."
              />
            </div>
            <IsianTeks
              label="Ringkasan"
              name="excerpt"
              rows={2}
              maxLength={300}
              defaultValue={awal.excerpt}
              bantuan="1–2 kalimat, tampil di kartu artikel."
            />

            {jenis === "internal" ? (
              <>
                <IsianTeks
                  label="Isi artikel"
                  name="content"
                  rows={14}
                  defaultValue={awal.content ?? ""}
                  bantuan='Pisahkan paragraf dengan satu baris kosong. Awali baris dengan "## " untuk membuat subjudul.'
                />
                <Isian label="Penulis" name="author" defaultValue={awal.author ?? "Tim Jamu Bu Ranti"} />
              </>
            ) : (
              <>
                <Isian
                  label="Tautan artikel media"
                  name="external_url"
                  type="url"
                  wajib
                  defaultValue={awal.external_url ?? ""}
                  placeholder="https://…"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Isian label="Nama media" name="source" defaultValue={awal.source ?? ""} placeholder="mis. Espos.id" />
                  <Isian label="Penulis / jurnalis" name="author" defaultValue={awal.author ?? ""} />
                </div>
                <p className="text-sm text-herbal/70">
                  Tulis ringkasan dengan kata-katamu sendiri; jangan menyalin isi artikel media.
                </p>
              </>
            )}
          </fieldset>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10">
            <p className="text-lg font-semibold">Sampul</p>
            <div
              className="mt-3 flex aspect-[16/10] flex-col justify-between rounded-xl p-4"
              style={{ backgroundColor: warna, color: aksen }}
            >
              <span className="self-start rounded-full bg-black/15 px-2 py-0.5 text-[10px] font-bold uppercase">
                {jenis === "liputan" ? "Liputan media" : "Artikel Jamu Bu Ranti"}
              </span>
              <span className="line-clamp-3 font-display text-lg font-semibold leading-tight">
                {judul || "Judul artikel"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                Warna latar
                <input type="color" name="warna" value={warna} onChange={(e) => setWarna(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border-2 border-herbal/15" />
              </label>
              <label className="text-sm font-semibold">
                Warna teks
                <input type="color" name="aksen" value={aksen} onChange={(e) => setAksen(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-xl border-2 border-herbal/15" />
              </label>
            </div>
          </div>
          <Centang name="is_published" label="Terbitkan di website" defaultChecked={awal.is_published} />
          <TombolSimpan className="min-h-12 w-full text-base">
            {awal.id ? "Simpan perubahan" : "Simpan artikel"}
          </TombolSimpan>
        </aside>
      </div>
    </FormAdmin>
  );
}
