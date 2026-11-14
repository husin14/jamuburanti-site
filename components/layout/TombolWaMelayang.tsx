import { IkonWhatsApp } from "@/components/ui/Ikon";
import { waLinkUmum } from "@/lib/utils/whatsapp";

/**
 * Akses WhatsApp yang selalu terlihat di semua halaman publik:
 * - tablet & desktop: tombol bulat melayang di kanan bawah
 * - ponsel: bottom bar menempel di bawah layar
 */
export function TombolWaMelayang() {
  return (
    <>
      <a
        href={waLinkUmum}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pesan via WhatsApp"
        className="fixed bottom-6 right-6 z-30 hidden h-14 w-14 items-center justify-center rounded-full bg-wa text-herbal shadow-lembut transition hover:scale-105 motion-safe:animate-denyut md:inline-flex"
      >
        <IkonWhatsApp className="h-7 w-7" />
      </a>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-herbal/10 bg-krem/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm md:hidden">
        <a
          href={waLinkUmum}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-wa px-6 py-3 text-base font-semibold text-herbal shadow-lembut"
        >
          <IkonWhatsApp className="h-5 w-5 shrink-0" />
          Pesan via WhatsApp
        </a>
      </div>
    </>
  );
}
