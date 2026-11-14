"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import type { HasilAdmin } from "@/lib/admin/auth";
import { cn } from "@/lib/utils/cn";

/* ------------------------------------------------------------------ */
/* Tombol & pesan                                                       */
/* ------------------------------------------------------------------ */

export const kelasTombol = {
  utama:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-herbal px-5 text-sm font-semibold text-krem transition hover:bg-daun disabled:opacity-60",
  kedua:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-herbal/20 bg-white px-5 text-sm font-semibold text-herbal transition hover:border-herbal disabled:opacity-60",
  bahaya:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-rosella/30 bg-white px-4 text-sm font-semibold text-rosella transition hover:bg-rosella hover:text-krem disabled:opacity-60",
};

/** Tombol submit yang otomatis menampilkan status "menyimpan". */
export function TombolSimpan({
  children = "Simpan",
  className,
  varian = "utama",
}: {
  children?: React.ReactNode;
  className?: string;
  varian?: keyof typeof kelasTombol;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={cn(kelasTombol[varian], className)}>
      {pending && <LoaderCircle className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

/** Pesan hasil simpan (hijau/merah), hilang sendiri setelah beberapa detik. */
export function PesanHasil({ hasil }: { hasil: HasilAdmin | null }) {
  const [tampil, setTampil] = useState<number | null>(null);
  const [lihat, setLihat] = useState(0);

  // Tampilkan setiap kali ada hasil baru (dibedakan lewat `waktu`)
  if (hasil && hasil.waktu !== lihat) {
    setLihat(hasil.waktu);
    setTampil(hasil.waktu);
  }

  useEffect(() => {
    if (tampil === null || !hasil?.ok) return;
    const t = window.setTimeout(() => setTampil(null), 4000);
    return () => window.clearTimeout(t);
  }, [tampil, hasil?.ok]);

  if (!hasil || tampil === null) return null;
  return (
    <p
      role={hasil.ok ? "status" : "alert"}
      className={cn(
        "flex items-start gap-2 rounded-xl p-3 text-sm font-semibold",
        hasil.ok ? "bg-daun/10 text-daun" : "bg-rosella/10 text-rosella",
      )}
    >
      {hasil.ok ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      {hasil.pesan}
    </p>
  );
}

type AksiAdmin = (awal: HasilAdmin | null, form: FormData) => Promise<HasilAdmin>;

/** Form admin standar: menjalankan Server Action dan menampilkan hasilnya. */
export function FormAdmin({
  aksi,
  children,
  className,
  resetSetelahBerhasil = false,
}: {
  aksi: AksiAdmin;
  children: React.ReactNode;
  className?: string;
  resetSetelahBerhasil?: boolean;
}) {
  const [hasil, jalankan] = useActionState(aksi, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (resetSetelahBerhasil && hasil?.ok) ref.current?.reset();
  }, [hasil, resetSetelahBerhasil]);

  return (
    <form ref={ref} action={jalankan} className={cn("space-y-4", className)}>
      {children}
      <PesanHasil hasil={hasil} />
    </form>
  );
}

/** Tombol hapus dengan konfirmasi. `id` dikirim sebagai field "id". */
export function TombolHapus({
  aksi,
  id,
  nama,
  label = "Hapus",
  kecil = false,
}: {
  aksi: AksiAdmin;
  id: string;
  nama: string;
  label?: string;
  kecil?: boolean;
}) {
  const [hasil, jalankan] = useActionState(aksi, null);
  return (
    <form
      action={jalankan}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
          e.preventDefault();
        }
      }}
      className="inline-flex flex-col items-start gap-1"
    >
      <input type="hidden" name="id" value={id} />
      <TombolSimpan varian="bahaya" className={kecil ? "min-h-9 px-3" : undefined}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {label}
      </TombolSimpan>
      {hasil && !hasil.ok && (
        <span role="alert" className="text-xs font-semibold text-rosella">
          {hasil.pesan}
        </span>
      )}
    </form>
  );
}

/** Tombol aksi cepat (mis. Setujui, Tandai dibaca) tanpa konfirmasi. */
export function TombolAksi({
  aksi,
  data,
  children,
  varian = "kedua",
  kecil = true,
}: {
  aksi: AksiAdmin;
  data: Record<string, string>;
  children: React.ReactNode;
  varian?: keyof typeof kelasTombol;
  kecil?: boolean;
}) {
  const [hasil, jalankan] = useActionState(aksi, null);
  return (
    <form action={jalankan} className="inline-flex flex-col items-start gap-1">
      {Object.entries(data).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <TombolSimpan varian={varian} className={kecil ? "min-h-9 px-3" : undefined}>
        {children}
      </TombolSimpan>
      {hasil && !hasil.ok && (
        <span role="alert" className="text-xs font-semibold text-rosella">
          {hasil.pesan}
        </span>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Isian                                                               */
/* ------------------------------------------------------------------ */

export const kelasIsian =
  "min-h-11 w-full rounded-xl border-2 border-herbal/15 bg-white px-3.5 py-2.5 text-base text-herbal placeholder:text-herbal/45 focus:border-daun";

export function Isian({
  label,
  name,
  bantuan,
  wajib,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  bantuan?: string;
  wajib?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
        {wajib && <span className="text-rosella"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        required={wajib}
        aria-describedby={bantuan ? `${id}-b` : undefined}
        className={kelasIsian}
        {...props}
      />
      {bantuan && (
        <p id={`${id}-b`} className="mt-1 text-xs text-herbal/65">
          {bantuan}
        </p>
      )}
    </div>
  );
}

export function IsianTeks({
  label,
  name,
  bantuan,
  wajib,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  bantuan?: string;
  wajib?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
        {wajib && <span className="text-rosella"> *</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={wajib}
        aria-describedby={bantuan ? `${id}-b` : undefined}
        className={kelasIsian}
        {...props}
      />
      {bantuan && (
        <p id={`${id}-b`} className="mt-1 text-xs text-herbal/65">
          {bantuan}
        </p>
      )}
    </div>
  );
}

export function Pilihan({
  label,
  name,
  opsi,
  bantuan,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  opsi: readonly (string | { nilai: string; label: string })[];
  bantuan?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      <select id={id} name={name} className={kelasIsian} {...props}>
        {opsi.map((o) =>
          typeof o === "string" ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ),
        )}
      </select>
      {bantuan && <p className="mt-1 text-xs text-herbal/65">{bantuan}</p>}
    </div>
  );
}

export function Centang({
  label,
  name,
  defaultChecked,
  bantuan,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  bantuan?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-white px-3.5 py-3 ring-1 ring-herbal/10">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-5 w-5 shrink-0 accent-daun"
      />
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {bantuan && <span className="block text-xs text-herbal/65">{bantuan}</span>}
      </span>
    </label>
  );
}
