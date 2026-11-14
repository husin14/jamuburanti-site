import { cn } from "@/lib/utils/cn";

export const kelasInput =
  "min-h-12 w-full rounded-2xl border-2 border-herbal/15 bg-white/90 px-4 py-3 text-base text-herbal placeholder:text-herbal/50 focus:border-daun aria-[invalid=true]:border-rosella";

export function Bidang({
  label,
  id,
  galat,
  bantuan,
  wajib = false,
  children,
}: {
  label: string;
  id: string;
  galat?: string;
  bantuan?: string;
  wajib?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-semibold">
        {label}
        {wajib && (
          <span className="text-rosella" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      {children}
      {bantuan && !galat && (
        <p id={`${id}-bantuan`} className="mt-1 text-sm text-herbal/70">
          {bantuan}
        </p>
      )}
      {galat && (
        <p id={`${id}-galat`} className="mt-1 text-sm font-semibold text-rosella">
          {galat}
        </p>
      )}
    </div>
  );
}

/** Kolom jebakan bot (honeypot): tak terlihat manusia, sering diisi bot. */
export function Honeypot({ name = "situs_web" }: { name?: string }) {
  return (
    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
      <label>
        Jangan isi kolom ini
        <input type="text" name={name} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function PesanSukses({
  judul,
  children,
  className,
}: {
  judul: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn("rounded-[1.5rem] bg-daun/10 p-6 ring-1 ring-daun/30", className)}
    >
      <p className="font-display text-2xl font-semibold text-daun">{judul}</p>
      {children && <div className="mt-2 text-herbal/85">{children}</div>}
    </div>
  );
}
