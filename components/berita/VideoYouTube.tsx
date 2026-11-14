"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Embed YouTube ringan (facade): hanya thumbnail sampai diklik, baru iframe dimuat.
 * Memakai youtube-nocookie.com agar tidak ada cookie pelacak sebelum diputar.
 */
export function VideoYouTube({ id, judul }: { id: string; judul: string }) {
  const [putar, setPutar] = useState(false);

  return (
    <figure>
      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-herbal">
        {putar ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={judul}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPutar(true)}
            className="group absolute inset-0 h-full w-full"
            aria-label={`Putar video: ${judul}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-linear-to-t from-herbal/70 to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-kunyit text-herbal shadow-lembut transition group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-herbal" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 font-semibold leading-snug">{judul}</figcaption>
    </figure>
  );
}
