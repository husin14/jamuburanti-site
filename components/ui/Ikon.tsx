/** Ikon merek dan ornamen SVG buatan sendiri (tidak bergantung pada pustaka ikon). */

type Props = { className?: string };

export function IkonWhatsApp({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2a9.93 9.93 0 0 0-8.52 15.06L2 22l5.08-1.48A9.94 9.94 0 1 0 12.04 2Zm0 1.8a8.13 8.13 0 1 1-4.29 15.04l-.31-.19-3.01.88.9-2.93-.2-.32A8.13 8.13 0 0 1 12.04 3.8Zm-3.3 3.9c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26 0 1.33.97 2.62 1.11 2.8.14.18 1.88 3 4.64 4.09 2.3.9 2.76.72 3.26.68.5-.05 1.61-.66 1.84-1.3.23-.63.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32-.27-.14-1.61-.8-1.86-.89-.25-.09-.43-.14-.61.14-.18.27-.7.89-.86 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.6-1.48-.84-2.02-.22-.52-.44-.45-.61-.46l-.52-.01Z" />
    </svg>
  );
}

export function IkonInstagram({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IkonTikTok({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M14.5 3h2.7c.2 2 1.5 3.5 3.8 3.8v2.8c-1.4 0-2.7-.4-3.8-1.1v6.3c0 3.3-2.5 5.7-5.7 5.7A5.6 5.6 0 0 1 6 14.9c0-3.3 2.9-5.9 6.4-5.4v2.9c-1.7-.4-3.5.7-3.5 2.5 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.9-1.2 2.9-3V3Z" />
    </svg>
  );
}

export function IkonFacebook({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4C16.3 4.3 15.5 4.2 14.5 4.2c-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.6V21h2.9Z" />
    </svg>
  );
}

/** Ornamen garis daun, dipakai sebagai hiasan latar. */
export function OrnamenDaun({ className }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 100C20 50 55 18 104 16c0 50-34 84-84 84Z" />
      <path d="M20 100 88 32" />
      <path d="M44 76V50M60 60V36M44 76h26M60 60h24" />
    </svg>
  );
}

/** Ornamen garis rimpang (jahe/kunyit). */
export function OrnamenRimpang({ className }: Props) {
  return (
    <svg
      viewBox="0 0 140 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 62c-8-12 0-28 16-26 4-14 24-18 32-4 12-10 32-2 30 14 14 0 22 14 14 26-6 10-22 10-28 2-8 10-26 10-32 0-10 8-26 2-32-12Z" />
      <path d="M40 44c4 4 6 10 4 16M72 38c2 6 2 12-2 18M100 50c-2 6-6 10-12 12" />
    </svg>
  );
}
