/**
 * Perkecil & kompres gambar di browser menjadi WebP (atau JPEG bila browser
 * belum bisa menyimpan WebP, mis. Safari lama). Menggambar ulang di kanvas
 * juga membuang metadata EXIF, termasuk lokasi GPS dari kamera HP.
 * Hanya untuk dipakai di komponen klien.
 */
export async function kompresGambar(
  file: File,
  { maksSisi, maksByte }: { maksSisi: number; maksByte: number },
): Promise<{ blob: Blob; lebar: number; tinggi: number; ekstensi: "webp" | "jpg" }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Format foto tidak didukung. Pakai JPG, PNG, atau WebP.");
  }
  const kanvas = document.createElement("canvas");
  const konteks = kanvas.getContext("2d")!;

  const simpan = (tipe: string, mutu: number) =>
    new Promise<Blob | null>((r) => kanvas.toBlob(r, tipe, mutu));

  // Coba beberapa ukuran & mutu sampai di bawah batas byte
  for (const sisi of [maksSisi, Math.round(maksSisi * 0.75)]) {
    const skala = Math.min(1, sisi / Math.max(bitmap.width, bitmap.height));
    const lebar = Math.round(bitmap.width * skala);
    const tinggi = Math.round(bitmap.height * skala);
    kanvas.width = lebar;
    kanvas.height = tinggi;
    // Latar putih agar PNG transparan tidak jadi hitam saat disimpan JPEG
    konteks.fillStyle = "#fff";
    konteks.fillRect(0, 0, lebar, tinggi);
    konteks.drawImage(bitmap, 0, 0, lebar, tinggi);
    for (const mutu of [0.85, 0.75, 0.6]) {
      let blob = await simpan("image/webp", mutu);
      if (blob?.type !== "image/webp") blob = await simpan("image/jpeg", mutu);
      if (blob && blob.size <= maksByte) {
        bitmap.close();
        return { blob, lebar, tinggi, ekstensi: blob.type === "image/webp" ? "webp" : "jpg" };
      }
    }
  }
  bitmap.close();
  throw new Error("Foto terlalu besar walau sudah dikompres. Pakai foto lain.");
}
