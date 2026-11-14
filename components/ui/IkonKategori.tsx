import {
  Activity,
  Flower2,
  ShieldCheck,
  Soup,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { KategoriSlug } from "@/lib/data/kategori";

const peta: Record<KategoriSlug, LucideIcon> = {
  "daya-tahan": ShieldCheck,
  pencernaan: Soup,
  "pegal-bugar": Activity,
  kewanitaan: Flower2,
  kulit: Sparkles,
  keluarga: Users,
};

export function IkonKategori({
  slug,
  className,
}: {
  slug: KategoriSlug;
  className?: string;
}) {
  const Ikon = peta[slug];
  return <Ikon className={className} aria-hidden="true" />;
}
