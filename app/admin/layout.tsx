import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel Admin", template: "%s | Admin Jamu Bu Ranti" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-krem">{children}</div>;
}
