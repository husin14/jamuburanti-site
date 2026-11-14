import { wajibAdmin } from "@/lib/admin/auth";
import { KepalaAdmin, KartuAdmin } from "@/components/admin/Kepala";
import { FormAdmin, Isian, TombolSimpan } from "@/components/admin/UI";
import { simpanPengaturan } from "@/app/admin/actions/konten";
import { daftarPengaturan } from "@/lib/admin/pengaturan";
import { site } from "@/lib/site";

export const metadata = { title: "Pengaturan" };

export default async function PengaturanAdmin() {
  const { db } = await wajibAdmin();
  const { data } = await db.from("site_settings").select("key, value");
  const nilai = new Map((data ?? []).map((r) => [r.key, r.value ?? ""]));
  const kelompok = [...new Set(daftarPengaturan.map((p) => p.kelompok))];

  return (
    <>
      <KepalaAdmin
        judul="Pengaturan situs"
        deskripsi="Tautan & kontak yang tampil di website. Kosongkan bila belum ada."
      />
      <FormAdmin aksi={simpanPengaturan}>
        {kelompok.map((k) => (
          <KartuAdmin key={k}>
            <h2 className="mb-4 text-lg font-semibold">{k}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {daftarPengaturan
                .filter((p) => p.kelompok === k)
                .map((p) => (
                  <Isian
                    key={p.key}
                    label={p.label}
                    name={p.key}
                    type={p.key === "email" ? "email" : p.key.endsWith("_url") ? "url" : "text"}
                    defaultValue={nilai.get(p.key) ?? ""}
                    placeholder={p.contoh}
                  />
                ))}
            </div>
            {k === "Ojek online" && (
              <p className="mt-3 text-sm text-herbal/70">
                Selama kosong, website menampilkan ajakan mencari toko &ldquo;{site.nama}&rdquo; di aplikasi.
              </p>
            )}
          </KartuAdmin>
        ))}
        <KartuAdmin>
          <h2 className="text-lg font-semibold">Diatur di kode</h2>
          <p className="mt-1 text-sm text-herbal/75">
            Nomor WhatsApp ({site.whatsapp.tampil}), alamat, dan jam buka ({site.jamBuka.teks}) ada di{" "}
            <code className="rounded bg-jahe px-1">lib/site.ts</code> karena dipakai di banyak tempat.
          </p>
        </KartuAdmin>
        <TombolSimpan className="min-h-12 px-8 text-base">Simpan pengaturan</TombolSimpan>
      </FormAdmin>
    </>
  );
}
