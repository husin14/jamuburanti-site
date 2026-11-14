/** Penanda data yang belum ada. Semua penanda ini tercatat di TODO_KONTEN.md. */
export function Isi({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-dashed border-rosella/50 bg-rosella/5 px-1.5 py-0.5 font-mono text-[0.85em] text-rosella">
      [ISI: {children}]
    </span>
  );
}
