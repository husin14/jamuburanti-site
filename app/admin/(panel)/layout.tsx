import { wajibAdmin } from "@/lib/admin/auth";
import { NavAdmin } from "@/components/admin/NavAdmin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { db, user } = await wajibAdmin();

  const [pesan, testimoni] = await Promise.all([
    db.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    db.from("testimonials").select("id", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  return (
    <div className="lg:flex">
      <NavAdmin
        email={user.email ?? ""}
        jumlah={{ pesan: pesan.count ?? 0, testimoni: testimoni.count ?? 0 }}
      />
      <main id="konten" className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
