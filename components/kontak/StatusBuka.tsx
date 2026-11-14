"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils/cn";

type Status = "buka" | "tutup";

/** Jam & menit sekarang di zona WIB (Asia/Jakarta), apa pun zona waktu pengunjung. */
function statusSekarang(): Status {
  const bagian = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const jam = Number(bagian.find((b) => b.type === "hour")?.value ?? 0);
  const menit = Number(bagian.find((b) => b.type === "minute")?.value ?? 0);
  const sekarang = jam * 60 + menit;
  return sekarang >= site.jamBuka.buka * 60 && sekarang < site.jamBuka.tutup * 60
    ? "buka"
    : "tutup";
}

function berlangganan(ubah: () => void) {
  const id = window.setInterval(ubah, 60_000);
  return () => window.clearInterval(id);
}

/** Indikator "Buka sekarang / Tutup" berdasarkan waktu WIB. */
export function StatusBuka({
  className,
  terang = false,
}: {
  className?: string;
  terang?: boolean;
}) {
  const status = useSyncExternalStore<Status | null>(
    berlangganan,
    statusSekarang,
    () => null,
  );

  if (!status) {
    return <span className={cn("inline-block h-8 w-36", className)} aria-hidden="true" />;
  }

  const buka = status === "buka";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold",
        buka
          ? terang
            ? "bg-wa/20 text-krem"
            : "bg-wa/20 text-herbal"
          : terang
            ? "bg-krem/10 text-krem"
            : "bg-herbal/10 text-herbal",
        className,
      )}
    >
      <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
        {buka && (
          <span className="absolute inline-flex h-full w-full rounded-full bg-wa opacity-75 motion-safe:animate-ping" />
        )}
        <span
          className={cn(
            "relative inline-flex h-2.5 w-2.5 rounded-full",
            buka ? "bg-wa" : "bg-rosella",
          )}
        />
      </span>
      {buka
        ? `Buka sekarang · tutup ${site.jamBuka.tutup}.00 WIB`
        : `Tutup · buka lagi ${String(site.jamBuka.buka).padStart(2, "0")}.00 WIB`}
    </span>
  );
}
