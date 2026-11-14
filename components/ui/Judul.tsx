import { cn } from "@/lib/utils/cn";
import { OrnamenDaun, OrnamenRimpang } from "@/components/ui/Ikon";

/** Label kecil di atas judul section. */
export function Eyebrow({
  children,
  terang = false,
}: {
  children: React.ReactNode;
  terang?: boolean;
}) {
  return (
    <p
      className={cn(
        "mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
        terang ? "bg-krem/10 text-kunyit" : "bg-jahe text-daun",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", terang ? "bg-kunyit" : "bg-daun")}
        aria-hidden="true"
      />
      {children}
    </p>
  );
}

/** Judul section: eyebrow + h2 + deskripsi. */
export function JudulSection({
  eyebrow,
  judul,
  deskripsi,
  tengah = false,
  terang = false,
  className,
}: {
  eyebrow?: string;
  judul: React.ReactNode;
  deskripsi?: React.ReactNode;
  tengah?: boolean;
  terang?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", tengah && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow terang={terang}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "text-3xl font-semibold leading-tight sm:text-4xl",
          terang ? "text-krem" : "text-herbal",
        )}
      >
        {judul}
      </h2>
      {deskripsi && (
        <p
          className={cn(
            "mt-3 text-lg leading-relaxed",
            terang ? "text-krem/85" : "text-herbal/80",
          )}
        >
          {deskripsi}
        </p>
      )}
    </div>
  );
}

/** Kepala halaman (hero kecil) untuk halaman selain Beranda. */
export function KepalaHalaman({
  eyebrow,
  judul,
  deskripsi,
  children,
}: {
  eyebrow: string;
  judul: React.ReactNode;
  deskripsi?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-jahe/60">
      <OrnamenDaun className="pointer-events-none absolute -right-10 -top-8 h-56 w-56 rotate-12 text-daun/15" />
      <OrnamenRimpang className="pointer-events-none absolute -bottom-8 left-[55%] hidden h-36 w-52 text-kunyit/30 md:block" />
      <div className="wadah relative py-14 md:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] sm:text-5xl">
          {judul}
        </h1>
        {deskripsi && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-herbal/85">
            {deskripsi}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
