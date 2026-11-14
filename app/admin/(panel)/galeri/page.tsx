import Image from "next/image";
import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, KartuAdmin, Kosong } from "@/components/admin/Kepala";
import { Centang, FormAdmin, Isian, Pilihan, TombolHapus, TombolSimpan } from "@/components/admin/UI";
import { UnggahGambar } from "@/components/admin/UnggahGambar";
import { hapusFoto, simpanFoto } from "@/app/admin/actions/konten";
import { kategoriGaleri } from "@/lib/data/galeri";
import { fotoDariUrl, propsFoto } from "@/lib/data/foto";

export const metadata = { title: "Galeri" };

export default async function GaleriAdmin() {
  const { db } = await wajibAdmin();
  const { data: foto } = await db
    .from("gallery")
    .select("id, image_url, alt, caption, category, width, height, sort_order, is_published")
    .order("sort_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <KepalaAdmin judul="Galeri" deskripsi={`${foto?.length ?? 0} foto dokumentasi.`} />

      <KartuAdmin className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Tambah foto</h2>
        <FormAdmin aksi={simpanFoto} resetSetelahBerhasil>
          <UnggahGambar name="image_url" folder="galeri" simpanUkuran wajib />
          <div className="grid gap-4 sm:grid-cols-2">
            <Isian
              label="Deskripsi foto (alt text)"
              name="alt"
              wajib
              placeholder="mis. Bu Ranti meracik kunyit di dapur"
              bantuan="Jelaskan isi foto untuk pembaca layar."
            />
            <Isian label="Keterangan (tampil di galeri)" name="caption" placeholder="mis. Meracik kunyit segar" />
            <Pilihan label="Kategori" name="category" opsi={kategoriGaleri} />
            <Isian label="Urutan" name="sort_order" inputMode="numeric" defaultValue="0" bantuan="Angka kecil tampil lebih dulu." />
          </div>
          <TombolSimpan>Tambah ke galeri</TombolSimpan>
        </FormAdmin>
      </KartuAdmin>

      {!foto || foto.length === 0 ? (
        <Kosong>Belum ada foto.</Kosong>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {foto.map((g) => {
            const f = fotoDariUrl(g.image_url, g.alt, g.width, g.height);
            return (
              <li key={g.id} className="overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-herbal/10">
                <div className="relative aspect-[4/3] bg-jahe/60">
                  <Image {...propsFoto(f)} alt={g.alt} fill sizes="(min-width: 1280px) 20rem, 50vw" className="object-cover" />
                  {!g.is_published && (
                    <span className="absolute left-2 top-2 rounded-full bg-herbal px-2 py-0.5 text-xs font-bold text-krem">
                      Disembunyikan
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-daun">{g.category}</p>
                  <p className="font-semibold">{g.caption ?? "Tanpa keterangan"}</p>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-daun">Ubah</summary>
                    <FormAdmin aksi={simpanFoto} className="mt-3">
                      <input type="hidden" name="id" value={g.id} />
                      <input type="hidden" name="image_url" value={g.image_url} />
                      <input type="hidden" name="width" value={g.width ?? ""} />
                      <input type="hidden" name="height" value={g.height ?? ""} />
                      <Isian label="Alt text" name="alt" wajib defaultValue={g.alt} />
                      <Isian label="Keterangan" name="caption" defaultValue={g.caption ?? ""} />
                      <Pilihan label="Kategori" name="category" opsi={kategoriGaleri} defaultValue={g.category} />
                      <Isian label="Urutan" name="sort_order" inputMode="numeric" defaultValue={g.sort_order} />
                      <Centang name="is_published" label="Tampil di website" defaultChecked={g.is_published} />
                      <TombolSimpan>Simpan</TombolSimpan>
                    </FormAdmin>
                    <div className="mt-3">
                      <TombolHapus aksi={hapusFoto} id={g.id} nama={g.caption ?? "foto ini"} label="Hapus foto" kecil />
                    </div>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
