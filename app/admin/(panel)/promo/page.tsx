import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, KartuAdmin, Kosong } from "@/components/admin/Kepala";
import { Centang, FormAdmin, Isian, IsianTeks, TombolHapus, TombolSimpan } from "@/components/admin/UI";
import { hapusPromo, simpanPromo } from "@/app/admin/actions/konten";

export const metadata = { title: "Promo" };

type BarisPromo = {
  id?: string;
  title: string;
  description: string;
  cta_label: string | null;
  cta_url: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

const tanggal = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date(iso))
    : "";

function IsianPromo({ p }: { p: BarisPromo }) {
  return (
    <>
      {p.id && <input type="hidden" name="id" value={p.id} />}
      <Isian label="Judul" name="title" wajib defaultValue={p.title} />
      <IsianTeks label="Deskripsi" name="description" rows={3} defaultValue={p.description} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Isian label="Teks tombol" name="cta_label" defaultValue={p.cta_label ?? ""} placeholder="Tanya Paket Hampers" />
        <Isian
          label="Tautan tombol"
          name="cta_url"
          type="url"
          defaultValue={p.cta_url ?? ""}
          placeholder="Kosongkan = buka WhatsApp"
        />
        <Isian label="Mulai tampil" name="starts_at" type="date" defaultValue={tanggal(p.starts_at)} bantuan="Opsional." />
        <Isian label="Berakhir" name="ends_at" type="date" defaultValue={tanggal(p.ends_at)} bantuan="Opsional. Otomatis hilang setelah tanggal ini." />
        <Isian label="Urutan" name="sort_order" inputMode="numeric" defaultValue={p.sort_order} bantuan="Promo aktif dengan angka terkecil yang tampil." />
      </div>
      <Centang name="is_active" label="Aktif" defaultChecked={p.is_active} />
    </>
  );
}

export default async function PromoAdmin() {
  const { db } = await wajibAdmin();
  const { data: promo } = await db
    .from("promos")
    .select("id, title, description, cta_label, cta_url, is_active, starts_at, ends_at, sort_order")
    .order("sort_order");

  return (
    <>
      <KepalaAdmin
        judul="Promo / Banner"
        deskripsi="Banner hijau di Beranda dan halaman Produk. Hanya satu promo aktif yang tampil."
      />

      {!promo || promo.length === 0 ? (
        <Kosong>Belum ada promo. Banner disembunyikan dari website.</Kosong>
      ) : (
        <ul className="mb-8 space-y-4">
          {promo.map((p) => (
            <li key={p.id}>
              <KartuAdmin>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-lg font-semibold">{p.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${p.is_active ? "bg-daun text-krem" : "bg-herbal/15"}`}>
                    {p.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
                <FormAdmin aksi={simpanPromo}>
                  <IsianPromo p={p} />
                  <div className="flex flex-wrap gap-2">
                    <TombolSimpan>Simpan</TombolSimpan>
                  </div>
                </FormAdmin>
                <div className="mt-3">
                  <TombolHapus aksi={hapusPromo} id={p.id} nama={p.title} label="Hapus promo" kecil />
                </div>
              </KartuAdmin>
            </li>
          ))}
        </ul>
      )}

      <KartuAdmin>
        <details>
          <summary className="cursor-pointer text-lg font-semibold">+ Tambah promo baru</summary>
          <FormAdmin aksi={simpanPromo} resetSetelahBerhasil className="mt-4">
            <IsianPromo
              p={{
                title: "",
                description: "",
                cta_label: null,
                cta_url: null,
                is_active: true,
                starts_at: null,
                ends_at: null,
                sort_order: 0,
              }}
            />
            <TombolSimpan>Tambah promo</TombolSimpan>
          </FormAdmin>
        </details>
      </KartuAdmin>
    </>
  );
}
