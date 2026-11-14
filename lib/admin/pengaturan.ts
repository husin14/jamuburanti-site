/** Kunci di tabel site_settings yang bisa diubah admin, beserta labelnya. */
export const daftarPengaturan = [
  { key: "instagram_akun", label: "Akun Instagram", contoh: "@jamuburanti", kelompok: "Media sosial" },
  { key: "instagram_url", label: "Tautan Instagram", contoh: "https://www.instagram.com/jamuburanti", kelompok: "Media sosial" },
  { key: "tiktok_url", label: "Tautan TikTok", contoh: "https://www.tiktok.com/@…", kelompok: "Media sosial" },
  { key: "facebook_url", label: "Tautan Facebook", contoh: "https://www.facebook.com/…", kelompok: "Media sosial" },
  { key: "email", label: "Email resmi", contoh: "halo@jamuburanti.com", kelompok: "Kontak" },
  { key: "gofood_url", label: "Tautan toko GoFood", contoh: "https://gofood.link/…", kelompok: "Ojek online" },
  { key: "grabfood_url", label: "Tautan toko GrabFood", contoh: "https://r.grab.com/…", kelompok: "Ojek online" },
  { key: "shopeefood_url", label: "Tautan toko ShopeeFood", contoh: "https://shopee.co.id/…", kelompok: "Ojek online" },
] as const;

export const kunciPengaturan = daftarPengaturan.map((p) => p.key);
