-- =====================================================================
-- Foto pada testimoni + testimoni dari admin
--
-- Alur:
--   1. Pengunjung mengunggah foto lewat form ulasan. Server mengunggahnya ke
--      bucket PRIVAT `ulasan-masuk` (tidak bisa dilihat publik) dan menyimpan
--      nama filenya di kolom `photo_path`.
--   2. Admin melihat foto itu di panel (URL bertanda tangan, sementara).
--   3. Saat admin menyetujui, foto disalin ke `public-images/testimoni/`,
--      URL publiknya disimpan di `photo_url`, lalu salinan privat dihapus.
--   Jadi foto hanya tampil di website setelah dicek admin.
--
-- Aman dijalankan ulang.
-- =====================================================================

-- Kolom: nama file di bucket privat (format UUID.webp atau UUID.jpg, diisi server)
alter table public.testimonials
  add column if not exists photo_path text;

alter table public.testimonials
  drop constraint if exists testimonials_photo_path_format;
alter table public.testimonials
  add constraint testimonials_photo_path_format check (
    photo_path ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg)$'
  );

-- Kebijakan "publik kirim testimoni" yang lama tetap berlaku:
-- pengunjung tidak bisa mengisi photo_url (selalu null), hanya photo_path.

-- Bucket privat untuk foto ulasan yang belum dicek (maks. 1 MB, WebP/JPEG)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ulasan-masuk', 'ulasan-masuk', false, 1048576, array['image/webp', 'image/jpeg'])
on conflict (id) do update
  set public = false, file_size_limit = 1048576, allowed_mime_types = array['image/webp', 'image/jpeg'];

-- Batas unggahan global agar bucket tidak dibanjiri (maks. 20 foto / 10 menit)
create or replace function public.kuota_foto_ulasan()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select count(*) < 20 from storage.objects
  where bucket_id = 'ulasan-masuk' and created_at > now() - interval '10 minutes';
$$;
grant execute on function public.kuota_foto_ulasan() to anon, authenticated;

drop policy if exists "publik unggah foto ulasan" on storage.objects;
drop policy if exists "admin lihat foto ulasan" on storage.objects;
drop policy if exists "admin hapus foto ulasan" on storage.objects;

-- Pengunjung: hanya boleh MENAMBAH file bernama UUID.webp|jpg (tidak bisa
-- melihat, menimpa, atau menghapus)
create policy "publik unggah foto ulasan" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'ulasan-masuk'
    and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg)$'
    and public.kuota_foto_ulasan()
  );

-- Admin: melihat (untuk pratinjau & menyalin) dan menghapus
create policy "admin lihat foto ulasan" on storage.objects
  for select to authenticated using (bucket_id = 'ulasan-masuk' and public.is_admin());
create policy "admin hapus foto ulasan" on storage.objects
  for delete to authenticated using (bucket_id = 'ulasan-masuk' and public.is_admin());

-- Batas jumlah ulasan hanya untuk pengunjung; admin boleh menambah banyak
-- testimoni sekaligus (mis. memindahkan ulasan dari WhatsApp).
create or replace function public.batasi_testimoni()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() then
    return new;
  end if;
  if (select count(*) from public.testimonials
      where lower(name) = lower(new.name) and created_at > now() - interval '1 hour') >= 2
     or (select count(*) from public.testimonials
         where created_at > now() - interval '1 minute') >= 10 then
    raise exception 'Terlalu banyak ulasan. Coba lagi nanti.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

-- Testimoni dari admin boleh berupa foto/screenshot saja: isi ulasan boleh
-- kosong bila ada foto publik. (Form pengunjung tetap wajib menulis ulasan,
-- karena kebijakan "publik kirim testimoni" mengharuskan photo_url kosong.)
alter table public.testimonials alter column review set default '';
alter table public.testimonials drop constraint if exists testimonials_review_check;
alter table public.testimonials add constraint testimonials_review_check check (
  length(review) <= 500 and (length(trim(review)) >= 10 or photo_url is not null)
);
