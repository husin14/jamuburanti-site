/** Judul halaman admin + deskripsi + tombol aksi di kanan. */
export function KepalaAdmin({
  judul,
  deskripsi,
  children,
}: {
  judul: string;
  deskripsi?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold">{judul}</h1>
        {deskripsi && <p className="mt-1 text-herbal/75">{deskripsi}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function KartuAdmin({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.25rem] bg-white p-5 ring-1 ring-herbal/10 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Kosong({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-[1.25rem] border-2 border-dashed border-herbal/15 p-8 text-center text-herbal/70">
      {children}
    </p>
  );
}

export function formatWaktu(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(iso));
}
