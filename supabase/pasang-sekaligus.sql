-- =====================================================================
-- PASANG SEKALIGUS: skema + data awal Jamu Bu Ranti.
-- Salin SEMUA isi file ini ke Supabase > SQL Editor > New query, lalu Run.
-- (Gabungan migrations/20261114000000_skema_awal.sql + seed.sql)
-- =====================================================================

-- =====================================================================
-- Jamu Bu Ranti: skema awal (Fase 3)
-- Jalankan sekali di Supabase SQL Editor, atau `supabase db push`.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Admin & helper
-- ---------------------------------------------------------------------

-- Daftar user yang boleh mengelola konten (dipakai panel admin di Fase 4).
-- Tambahkan admin: insert into public.admins (user_id) values ('<uuid user>');
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Produk
-- ---------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  categories text[] not null default '{}',
  short_benefit text not null default '',
  benefits text not null default '',
  ingredients text,
  package_size text,
  price_min integer check (price_min >= 0),          -- rupiah
  price_max integer check (price_max >= price_min),  -- rupiah
  image_url text,
  image_alt text,
  -- Desain ilustrasi botol: { cairan, latar, bahan: [{ jenis, warna }] }
  visual jsonb not null default '{}'::jsonb,
  is_bestseller boolean not null default false,
  is_new boolean not null default false,
  is_available boolean not null default true,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Artikel & liputan media
-- ---------------------------------------------------------------------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  excerpt text not null default '',
  content text,                 -- markdown; null untuk liputan eksternal
  cover_url text,
  cover_style jsonb not null default '{}'::jsonb, -- { warna, aksen }
  category text not null check (category in (
    'Sejarah & Edukasi Jamu', 'Liputan Media', 'Kegiatan UMKM', 'Cerita Pelanggan'
  )),
  author text,
  source text,                  -- nama media, untuk liputan eksternal
  external_url text,
  published_at date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (content is not null or external_url is not null)
);
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Galeri
-- ---------------------------------------------------------------------
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text not null check (length(trim(alt)) > 0),
  caption text,
  category text not null check (category in (
    'Produk & Kemasan', 'Hampers & Paket', 'Aktivitas Produksi',
    'Pameran UMKM', 'Pelanggan & Promosi'
  )),
  width integer check (width > 0),
  height integer check (height > 0),
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Testimoni
-- ---------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 60),
  city text check (length(city) <= 60),
  product text check (length(product) <= 60),
  photo_url text,
  rating_taste smallint not null check (rating_taste between 1 and 5),
  rating_quality smallint not null check (rating_quality between 1 and 5),
  rating_service smallint not null check (rating_service between 1 and 5),
  review text not null check (length(trim(review)) between 10 and 500),
  consent boolean not null default false,
  is_approved boolean not null default false,
  -- true = testimoni contoh untuk desain/presentasi (ditandai "Contoh" di website)
  is_sample boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Promo / banner
-- ---------------------------------------------------------------------
create table public.promos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  cta_label text,
  cta_url text,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger promos_updated_at before update on public.promos
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Pesan dari form kontak
-- ---------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 2 and 60),
  contact text not null check (length(trim(contact)) between 5 and 80),
  topic text not null check (topic in ('Pemesanan', 'Kerja Sama', 'Pertanyaan', 'Lainnya')),
  message text not null check (length(trim(message)) between 10 and 1000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Pengaturan situs (key/value)
-- ---------------------------------------------------------------------
create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Anti-spam di level database (berlaku walau server di-scale)
-- ---------------------------------------------------------------------
create or replace function public.batasi_pesan()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.messages
      where contact = new.contact and created_at > now() - interval '10 minutes') >= 3
     or (select count(*) from public.messages
         where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'Terlalu banyak pesan. Coba lagi beberapa menit lagi.'
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;
create trigger messages_batasi before insert on public.messages
  for each row execute function public.batasi_pesan();

create or replace function public.batasi_testimoni()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
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
create trigger testimonials_batasi before insert on public.testimonials
  for each row execute function public.batasi_testimoni();

-- ---------------------------------------------------------------------
-- Hak akses tabel (eksplisit; aman walau "Automatically expose new tables"
-- dimatikan). Baris mana yang boleh disentuh tetap diatur RLS di bawah.
-- ---------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

-- Pengunjung (anon): hanya membaca konten, dan mengirim pesan/testimoni
grant select on public.products, public.articles, public.gallery,
  public.testimonials, public.promos, public.site_settings
  to anon, authenticated;
grant insert on public.messages, public.testimonials to anon, authenticated;

-- User login (admin di Fase 4): kelola semua tabel, dibatasi is_admin() lewat RLS
grant select, insert, update, delete on public.products, public.articles,
  public.gallery, public.testimonials, public.promos, public.messages,
  public.site_settings to authenticated;
grant select on public.admins to authenticated;

grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.admins        enable row level security;
alter table public.products      enable row level security;
alter table public.articles      enable row level security;
alter table public.gallery       enable row level security;
alter table public.testimonials  enable row level security;
alter table public.promos        enable row level security;
alter table public.messages      enable row level security;
alter table public.site_settings enable row level security;

-- Admin: hanya admin yang bisa melihat daftar admin
create policy "admin melihat admins" on public.admins
  for select to authenticated using (public.is_admin());

-- Publik membaca konten yang terbit; admin mengelola semuanya
create policy "publik baca produk terbit" on public.products
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin kelola produk" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "publik baca artikel terbit" on public.articles
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin kelola artikel" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "publik baca galeri" on public.gallery
  for select to anon, authenticated using (is_published or public.is_admin());
create policy "admin kelola galeri" on public.gallery
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "publik baca promo aktif" on public.promos
  for select to anon, authenticated using (
    (is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at > now()))
    or public.is_admin()
  );
create policy "admin kelola promo" on public.promos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "publik baca pengaturan" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admin kelola pengaturan" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Testimoni: publik hanya melihat yang disetujui & sudah memberi izin tampil.
-- Publik boleh mengirim, tapi selalu masuk sebagai "menunggu persetujuan".
create policy "publik baca testimoni disetujui" on public.testimonials
  for select to anon, authenticated using ((is_approved and consent) or public.is_admin());
create policy "publik kirim testimoni" on public.testimonials
  for insert to anon, authenticated
  with check (is_approved = false and is_sample = false and consent = true and photo_url is null);
create policy "admin kelola testimoni" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Pesan: publik hanya boleh mengirim; membaca hanya admin.
create policy "publik kirim pesan" on public.messages
  for insert to anon, authenticated with check (is_read = false);
create policy "admin kelola pesan" on public.messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- Storage: bucket gambar publik (upload hanya admin, maks. 2 MB)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-images', 'public-images', true, 2097152,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "publik baca public-images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'public-images');
create policy "admin unggah public-images" on storage.objects
  for insert to authenticated with check (bucket_id = 'public-images' and public.is_admin());
create policy "admin ubah public-images" on storage.objects
  for update to authenticated using (bucket_id = 'public-images' and public.is_admin());
create policy "admin hapus public-images" on storage.objects
  for delete to authenticated using (bucket_id = 'public-images' and public.is_admin());

-- Index untuk urutan tampil
create index products_sort_idx on public.products (sort_order);
create index articles_published_idx on public.articles (published_at desc nulls first);
create index gallery_sort_idx on public.gallery (sort_order);
create index testimonials_created_idx on public.testimonials (created_at desc);
create index messages_created_idx on public.messages (created_at desc);


-- =====================================================================
-- Data awal Jamu Bu Ranti (dibuat otomatis dari lib/data/*.ts, Fase 2).
-- Aman dijalankan ulang: data dengan slug/gambar yang sama diperbarui.
-- Testimoni contoh TIDAK ada di sini (lihat seed-contoh-testimoni.sql).
-- =====================================================================

-- Produk
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('kunir-asem', 'Kunir Asem', array['kewanitaan']::text[], 'Segar asam-manis, teman saat datang bulan.', 'Dipercaya membantu meredakan nyeri haid, melancarkan siklus haid, dan teman diet alami.', null, null, null, null, '/images/foto/kunir-asem-1-liter.jpg', 'Botol Kunir Asem 1 liter Jamu Bu Ranti di atas bangku kayu berukir', '{"cairan":"#F2B632","latar":"#FBEBC0","bahan":[{"jenis":"rimpang","warna":"#E8A317"},{"jenis":"asam","warna":"#7A4A2A"}]}'::jsonb, true, false, true, true, 10)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('beras-kencur', 'Beras Kencur', array['pegal-bugar', 'keluarga']::text[], 'Manis hangat, bikin badan segar lagi.', 'Menambah nafsu makan, menghangatkan saat flu dan batuk, serta menghilangkan rasa lelah.', null, null, null, null, null, null, '{"cairan":"#EFE1C2","latar":"#F6EEDD","bahan":[{"jenis":"beras","warna":"#FBF6EC"},{"jenis":"rimpang","warna":"#E6D3B0"}]}'::jsonb, true, false, true, true, 20)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('temulawak', 'Temulawak', array['daya-tahan', 'pencernaan']::text[], 'Antioksidan, menjaga pencernaan tetap nyaman.', 'Antioksidan; dipercaya membantu menjaga kesehatan pencernaan.', null, null, null, null, '/images/foto/temulawak.jpg', 'Segelas jamu Temulawak berwarna kuning cerah di samping botol 250 ml, sereh, dan potongan temulawak segar', '{"cairan":"#E2A02B","latar":"#F8E7C4","bahan":[{"jenis":"rimpang","warna":"#E2A02B"},{"jenis":"daun","warna":"#3F7D4E"}]}'::jsonb, true, false, true, true, 30)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('jahe-merah', 'Jahe Merah', array['pencernaan']::text[], 'Hangat pedas, pas untuk masuk angin.', 'Menghangatkan tubuh; dipercaya membantu meredakan pusing, masuk angin, dan pegal.', null, null, null, null, '/images/foto/jahe-merah.jpg', 'Segelas jamu Jahe Merah dan botol 250 ml Jamu Bu Ranti di atas tatakan anyaman', '{"cairan":"#C2562E","latar":"#F6DCCF","bahan":[{"jenis":"rimpang","warna":"#C2562E"},{"jenis":"daun","warna":"#3F7D4E"}]}'::jsonb, true, false, true, true, 40)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('rosella', 'Rosella', array['daya-tahan']::text[], 'Merah segar kaya antioksidan.', 'Kaya antioksidan; secara tradisional dipercaya membantu menjaga tekanan darah dan kolesterol, serta teman diet alami.', null, null, null, null, null, null, '{"cairan":"#B83A3A","latar":"#F6D9D6","bahan":[{"jenis":"bunga","warna":"#B83A3A"},{"jenis":"daun","warna":"#3F7D4E"}]}'::jsonb, false, true, true, true, 50)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('sereh-telang', 'Sereh Telang', array['daya-tahan']::text[], 'Biru cantik dengan wangi sereh.', 'Antioksidan; dipercaya membantu menjaga kolesterol dan mengurangi peradangan.', null, null, null, null, null, null, '{"cairan":"#4B5FB0","latar":"#DCE1F4","bahan":[{"jenis":"bunga","warna":"#4B5FB0"},{"jenis":"sereh","warna":"#8DAA5B"}]}'::jsonb, false, true, true, true, 60)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('jkt', 'JKT', array['daya-tahan', 'pencernaan']::text[], 'Jahe, kunyit asam, dan temulawak dalam satu botol.', 'Antioksidan; dipercaya membantu meredakan mual dan gangguan pencernaan, menjaga daya tahan tubuh dan kesehatan sendi.', null, null, null, null, null, null, '{"cairan":"#D98E1C","latar":"#F8E3BF","bahan":[{"jenis":"rimpang","warna":"#D9B27C"},{"jenis":"rimpang","warna":"#E8A317"}]}'::jsonb, false, false, true, true, 70)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('kunyit-putih', 'Kunyit Putih', array['pencernaan', 'pegal-bugar']::text[], 'Lembut, untuk pencernaan dan sendi.', 'Dipercaya membantu menjaga pencernaan dan meredakan pegal pada sendi.', null, null, null, null, null, null, '{"cairan":"#E9DDB4","latar":"#F3EEDC","bahan":[{"jenis":"rimpang","warna":"#EFE6CC"},{"jenis":"daun","warna":"#7FA35B"}]}'::jsonb, false, false, true, true, 80)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('kumis-kucing', 'Kumis Kucing', array['pegal-bugar']::text[], 'Racikan daun untuk badan lebih ringan.', 'Secara tradisional digunakan untuk membantu menjaga kesehatan saluran kemih dan ginjal, serta meredakan pegal dan rematik.', null, null, null, null, null, null, '{"cairan":"#9DB36B","latar":"#E3EBD3","bahan":[{"jenis":"daun","warna":"#7FA35B"},{"jenis":"bunga","warna":"#E9E4F2"}]}'::jsonb, false, false, true, true, 90)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('brotowali', 'Brotowali', array['daya-tahan']::text[], 'Pahit khas, warisan racikan lama.', 'Dipercaya membantu menjaga kadar gula darah, kesehatan tulang, dan daya tahan tubuh.', null, null, null, null, null, null, '{"cairan":"#5E7A3A","latar":"#DDE5CF","bahan":[{"jenis":"sirih","warna":"#3F7D4E"},{"jenis":"sereh","warna":"#6B8A44"}]}'::jsonb, false, false, true, true, 100)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('gula-asem', 'Gula Asem', array['pencernaan']::text[], 'Manis legit, perut terasa lega.', 'Dipercaya membantu melancarkan pencernaan serta menjaga kolesterol dan gula darah.', null, null, null, null, null, null, '{"cairan":"#8A4B2A","latar":"#F0DFD2","bahan":[{"jenis":"asam","warna":"#7A4A2A"},{"jenis":"beras","warna":"#C98B4E"}]}'::jsonb, false, false, true, true, 110)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('tolak-angin', 'Tolak Angin', array['pencernaan']::text[], 'Andalan saat badan mulai meriang.', 'Membantu meringankan masuk angin, pusing, mual, dan perut kembung.', null, null, null, null, null, null, '{"cairan":"#7A5230","latar":"#EEDFD0","bahan":[{"jenis":"rimpang","warna":"#D9B27C"},{"jenis":"daun","warna":"#3F7D4E"}]}'::jsonb, false, false, true, true, 120)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('pegel-linu', 'Pegel Linu', array['pegal-bugar']::text[], 'Untuk pegal setelah kerja keras.', 'Membantu meringankan pegal linu, encok, dan keluhan rematik.', null, null, null, null, null, null, '{"cairan":"#6B4A2B","latar":"#EBDDCF","bahan":[{"jenis":"rimpang","warna":"#B8864F"},{"jenis":"daun","warna":"#3F7D4E"}]}'::jsonb, false, false, true, true, 130)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('empu-kunir', 'Empu Kunir', array['pencernaan']::text[], 'Kunyit pekat untuk lambung dan tenggorokan.', 'Secara tradisional digunakan untuk membantu meredakan asam lambung, sembelit, batuk, dan radang tenggorokan.', null, null, null, null, null, null, '{"cairan":"#E9A825","latar":"#F9E8C2","bahan":[{"jenis":"rimpang","warna":"#E8A317"},{"jenis":"rimpang","warna":"#F0C24B"}]}'::jsonb, false, false, true, true, 140)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('jamu-gatal-gatal', 'Jamu Gatal-Gatal', array['kulit']::text[], 'Racikan tradisional untuk keluhan kulit.', 'Secara tradisional digunakan untuk membantu meredakan gatal-gatal dan keluhan kulit.', null, null, null, null, null, null, '{"cairan":"#6E8B3D","latar":"#E2EAD2","bahan":[{"jenis":"daun","warna":"#5E8A3E"},{"jenis":"sirih","warna":"#7FA35B"}]}'::jsonb, false, false, true, true, 150)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('sawanan', 'Sawanan', array['keluarga', 'kulit']::text[], 'Jamu tradisional untuk dewasa dan anak.', 'Jamu tradisional untuk dewasa dan anak; dipercaya membantu meredakan gatal, kembung, dan menambah nafsu makan.', null, null, null, null, null, null, '{"cairan":"#A7B85C","latar":"#EAF0D6","bahan":[{"jenis":"daun","warna":"#7FA35B"},{"jenis":"rimpang","warna":"#E6D3B0"}]}'::jsonb, false, false, true, true, 160)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('kunir-asem-sirih', 'Kunir Asem Sirih', array['kewanitaan']::text[], 'Kunir asem dengan sentuhan daun sirih.', 'Dipercaya membantu mengontrol berat badan, melancarkan metabolisme, dan mengurangi bau badan.', null, null, null, null, null, null, '{"cairan":"#D9A63A","latar":"#F5E8C5","bahan":[{"jenis":"sirih","warna":"#3F7D4E"},{"jenis":"rimpang","warna":"#E8A317"}]}'::jsonb, false, false, true, true, 170)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('sirih-manjakani', 'Sirih Manjakani', array['kewanitaan']::text[], 'Racikan sirih untuk perawatan wanita.', 'Secara tradisional digunakan untuk membantu menjaga kebersihan dan kesehatan area kewanitaan.', null, null, null, null, null, null, '{"cairan":"#5C7A4A","latar":"#DEE7D6","bahan":[{"jenis":"sirih","warna":"#3F7D4E"},{"jenis":"asam","warna":"#8C6A4A"}]}'::jsonb, false, false, true, true, 180)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('sirih', 'Sirih', array['kewanitaan']::text[], 'Daun sirih, resep turun-temurun.', 'Secara tradisional digunakan untuk membantu mengurangi keputihan.', null, null, null, null, null, null, '{"cairan":"#4F7A3F","latar":"#DCE8D3","bahan":[{"jenis":"sirih","warna":"#3F7D4E"},{"jenis":"sirih","warna":"#7FA35B"}]}'::jsonb, false, false, true, true, 190)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;
insert into public.products (slug, name, categories, short_benefit, benefits, ingredients, package_size, price_min, price_max, image_url, image_alt, visual, is_bestseller, is_new, is_available, is_published, sort_order) values ('wejahan', 'Wejahan', array['keluarga', 'kewanitaan']::text[], 'Untuk ibu menyusui, badan lebih segar.', 'Dipercaya membantu melancarkan ASI dan menyegarkan badan.', null, null, null, null, null, null, '{"cairan":"#A0643A","latar":"#F1E0D0","bahan":[{"jenis":"rimpang","warna":"#D9B27C"},{"jenis":"daun","warna":"#7FA35B"}]}'::jsonb, false, false, true, true, 200)
  on conflict (slug) do update set name = excluded.name, categories = excluded.categories, short_benefit = excluded.short_benefit, benefits = excluded.benefits, image_url = excluded.image_url, image_alt = excluded.image_alt, visual = excluded.visual, is_bestseller = excluded.is_bestseller, is_new = excluded.is_new, sort_order = excluded.sort_order;

-- Artikel & liputan media
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('espos-dari-sukoharjo-ke-semarang', 'Dari Sukoharjo ke Semarang: Jamu Bu Ranti Bertahan Lewat Digitalisasi', 'Espos menelusuri perjalanan usaha jamu gendong keluarga ini hingga generasi ketiga, Agnes Oktavi Maharani, yang membawanya ke GoFood, GrabFood, dan ShopeeFood.', null, '{"warna":"#1F3D2B","aksen":"#E8A317"}'::jsonb, 'Liputan Media', 'Fitroh Nurikhsan', 'Espos.id', 'https://regional.espos.id/dari-sukoharjo-ke-semarang-jamu-bu-ranti-bertahan-lewat-digitalisasi-2229921', '2026-07-04'::date, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('kompasiana-dari-gendongan-hingga-digital', 'Dari Gendongan hingga Digital, Perjalanan Jamu Bu Ranti Bertahan di Era Modern', 'Kisah Bu Ranti yang berjualan keliling dengan digendong, gerobak, lalu motor, sampai cucunya membawa jamu keluarga ini ke media sosial dan layanan pesan antar.', null, '{"warna":"#3F7D4E","aksen":"#FBF6EC"}'::jsonb, 'Liputan Media', 'Fadila Intan', 'Kompasiana', 'https://www.kompasiana.com/fadilaintan1333/6a369ad934777c56a6704ff3/dari-gendongan-hingga-digital-perjalanan-jamu-bu-ranti-bertahan-di-era-modern', '2026-06-20'::date, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('udinus-alumni-sulap-jamu-keluarga', 'Alumni Udinus Sulap Jamu Keluarga Jadi Brand Modern, Raup Omzet Puluhan Juta', 'Tim Kewirausahaan Udinus menulis bagaimana Agnes memperbarui logo, kemasan, dan proses produksi, serta menambah varian rosella dan sereh telang.', null, '{"warna":"#4B5FB0","aksen":"#F3E6CF"}'::jsonb, 'Liputan Media', 'Kewirausahaan Udinus', 'Udinus', 'https://inbis.dinus.ac.id/2026/03/19/alumni-udinus-sulap-jamu-keluarga-jadi-brand-modern-raup-omzet-puluhan-juta/', '2026-03-19'::date, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('udinus-agnes-ilmu-kewirausahaan', 'Agnes, Mahasiswa FKes Udinus, Dapatkan Ilmu Kewirausahaan di Kampus', 'Humas Udinus mengangkat usaha jamu Agnes yang lolos pendanaan KBMI dan dipasarkan lewat Instagram, GoFood, serta endorsement akun kuliner.', null, '{"warna":"#E8A317","aksen":"#1F3D2B"}'::jsonb, 'Kegiatan UMKM', 'Humas Udinus', 'Udinus', 'https://dinus.ac.id/berita/agnes-mahasiswa-fkes-udinus-dapatkan-ilmu-kewirausahaan-di-kampus/', '2023-01-05'::date, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('times-racikan-asli-nenek-sejak-1980', 'Jamu Bu Ranti, Racikan Asli Nenek Sejak 1980', 'TIMES Indonesia mengenalkan varian andalan seperti beras kencur, kunir asem, jahe merah, dan temulawak, serta cara Agnes bertahan memasarkan jamu di masa pandemi.', null, '{"warna":"#B83A3A","aksen":"#FBF6EC"}'::jsonb, 'Liputan Media', null, 'TIMES Indonesia', 'https://jatim.times.co.id/news/berita/0k5hdg4m1f/news', '2022-01-10'::date, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('dari-gendongan-ke-digital', 'Dari Gendongan ke Digital: Tiga Generasi Jamu Bu Ranti', 'Bagaimana resep jamu seorang nenek dari Sukoharjo bertahan puluhan tahun dan kini bisa dipesan lewat ponsel.', 'Jamu Bu Ranti dirintis oleh Bu Suranti, yang akrab disapa Bu Ranti, di Sukoharjo, Jawa Tengah. Resepnya diracik sendiri dari rimpang dan dedaunan, lalu dijajakan ke tetangga sekitar.

## Merantau ke Semarang

Sekitar tahun 1980-an, Bu Ranti merantau ke Kota Semarang. Ia berjualan keliling dari rumah ke rumah di wilayah Semeru dan Gajahmungkur. Mula-mula jamu digendong, lalu memakai gerobak dorong, hingga akhirnya diantar dengan sepeda motor.

## Generasi ketiga mengambil peran

Pada 2020, cucu Bu Ranti, Agnes Oktavi Maharani, mengikuti Program Kreativitas Bisnis Mahasiswa Indonesia (KBMI). Usaha keluarga ini mendapat pendanaan Rp15 juta dan pendampingan selama enam bulan.

Dari situ jamu keluarga mulai berbenah: kemasan baru yang lebih menarik, identitas merek yang jelas, dan akun Instagram @jamuburanti untuk menyapa pelanggan.

## Rasa yang sama, cara pesan yang baru

Kini Jamu Bu Ranti menjangkau pelanggan lewat media sosial dan layanan pesan antar, tetap sebagai usaha keluarga generasi ketiga. Resepnya tetap warisan nenek, hanya cara menikmatinya yang menyesuaikan zaman.', '{"warna":"#E8A317","aksen":"#1F3D2B"}'::jsonb, 'Sejarah & Edukasi Jamu', 'Tim Jamu Bu Ranti', null, null, null, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;
insert into public.articles (slug, title, excerpt, content, cover_style, category, author, source, external_url, published_at, is_published) values ('panduan-memilih-jamu', 'Bingung Pilih Jamu? Ini Panduan Singkat Sesuai Kebutuhanmu', 'Dari kunir asem sampai pegel linu, kenali jamu yang secara tradisional dipilih untuk kebutuhan sehari-hari.', 'Jamu adalah minuman tradisional yang diracik dari bahan alami seperti rimpang, daun, dan bunga. Setiap racikan punya rasa dan kegunaan tradisionalnya sendiri. Berikut panduan singkat memilihnya.

## Saat badan terasa kurang fit

Rosella, Sereh Telang, Temulawak, dan Brotowali sering dipilih sebagai minuman antioksidan untuk membantu menjaga daya tahan tubuh.

## Saat perut kurang nyaman atau masuk angin

Jahe Merah terasa hangat dan secara tradisional dipercaya membantu meredakan masuk angin. Gula Asem, Tolak Angin, dan Empu Kunir juga jadi pilihan untuk perut yang terasa kembung.

## Setelah aktivitas seharian

Beras Kencur dikenal membantu menghilangkan rasa lelah, sementara Pegel Linu dan Kumis Kucing biasa dipilih saat badan terasa pegal.

## Untuk perempuan

Kunir Asem adalah jamu klasik saat datang bulan. Ada juga Kunir Asem Sirih, Sirih, dan Sirih Manjakani untuk perawatan sehari-hari.

Ingat, jamu adalah minuman tradisional, bukan pengganti obat atau anjuran dokter. Konsultasikan dengan tenaga kesehatan bila memiliki kondisi medis tertentu.', '{"warna":"#3F7D4E","aksen":"#E8A317"}'::jsonb, 'Sejarah & Edukasi Jamu', 'Tim Jamu Bu Ranti', null, null, null, true)
  on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, cover_style = excluded.cover_style, category = excluded.category, author = excluded.author, source = excluded.source, external_url = excluded.external_url, published_at = excluded.published_at;

-- Galeri (foto dokumentasi asli di public/images/foto/)
delete from public.gallery where image_url like '/images/foto/%';
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/temulawak.jpg', 'Segelas jamu Temulawak berwarna kuning cerah di samping botol 250 ml, sereh, dan potongan temulawak segar', 'Temulawak segar, kuningnya alami', 'Produk & Kemasan', 1280, 1600, 10);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/kemasan-tiga-ukuran-1.jpg', 'Tiga ukuran kemasan Jamu Bu Ranti: pouch 1 liter, botol 500 ml, dan botol 250 ml di atas tatakan rotan bersama kayu manis, cengkih, dan kunyit', 'Tiga ukuran: 1 liter, 500 ml, dan 250 ml', 'Produk & Kemasan', 1280, 853, 20);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/hampers-natal-4-botol.jpg', 'Hampers Natal dan Tahun Baru: empat botol jamu 250 ml di depan kotak kraft berkartu ucapan', 'Hampers Natal & Tahun Baru, isi 4 botol', 'Hampers & Paket', 1280, 1600, 30);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/paket-tas-anyaman-taman.jpg', 'Paket jamu ukuran 1 liter, 500 ml, dan 250 ml bersama tas anyaman di bangku taman', 'Paket jamu dengan tas anyaman', 'Hampers & Paket', 960, 1280, 40);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/jahe-merah.jpg', 'Segelas jamu Jahe Merah dan botol 250 ml Jamu Bu Ranti di atas tatakan anyaman', 'Jahe Merah, hangat untuk sore hari', 'Produk & Kemasan', 1281, 1600, 50);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/hampers-ramadan-4-botol.jpg', 'Hampers Ramadan berisi empat botol jamu 250 ml dengan kotak kraft dan kartu ucapan', 'Hampers Ramadan, isi 4 botol 250 ml', 'Hampers & Paket', 958, 1280, 60);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/jamu-dibawa-traveling.jpg', 'Botol Jamu Bu Ranti 250 ml digenggam di depan bangunan bersejarah', 'Jamu Bu Ranti ikut jalan-jalan', 'Pelanggan & Promosi', 514, 640, 70);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/kunir-asem-1-liter.jpg', 'Botol Kunir Asem 1 liter Jamu Bu Ranti di atas bangku kayu berukir', 'Kunir Asem kemasan 1 liter', 'Produk & Kemasan', 958, 1280, 80);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/paket-tas-anyaman-danau.jpg', 'Paket jamu pouch dan botol dengan tas anyaman di tepi danau', 'Bekal jamu untuk piknik di taman', 'Hampers & Paket', 1440, 1575, 90);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/hampers-natal-campur.jpg', 'Kotak hampers bertema Natal, botol Kunir Asem 500 ml, dan pouch Beras Kencur 1 liter', 'Hampers Natal dengan botol & pouch', 'Hampers & Paket', 1440, 1440, 100);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/paket-tas-anyaman-hijau.jpg', 'Dua pouch jamu 1 liter, botol 500 ml, dan botol 250 ml di samping tas anyaman hijau', 'Pouch 1 liter siap untuk keluarga', 'Hampers & Paket', 958, 1280, 110);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/kemasan-tiga-ukuran-2.jpg', 'Pouch 1 liter, botol 500 ml, dan botol 250 ml Jamu Bu Ranti dengan rempah di atas tatakan rotan', 'Kemasan baru dengan label khas Bu Ranti', 'Produk & Kemasan', 1280, 853, 120);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/hampers-ramadan-2-botol.jpg', 'Kotak hampers kraft berisi dua botol jamu Kunir Asem dan Beras Kencur dengan kartu Ramadan', 'Hampers Ramadan isi 2 botol besar', 'Hampers & Paket', 1284, 1600, 130);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/paket-tas-anyaman-rumput.jpg', 'Paket jamu pouch dan botol bersama tas anyaman merah muda di atas rumput', 'Paket jamu & tas anyaman', 'Hampers & Paket', 960, 1280, 140);
insert into public.gallery (image_url, alt, caption, category, width, height, sort_order) values ('/images/foto/paket-tas-anyaman-senja.jpg', 'Paket jamu pouch dan botol bersama tas anyaman di luar ruangan saat sore', 'Teman santai sore hari', 'Hampers & Paket', 960, 1280, 150);

-- Promo default: paket hampers
delete from public.promos where title = 'Hantaran sehat untuk orang tersayang';
insert into public.promos (title, description, cta_label, cta_url, is_active, sort_order) values ('Hantaran sehat untuk orang tersayang', 'Paket jamu pilihan dalam kemasan cantik, mulai Rp40 ribu hingga Rp90 ribu. Cocok untuk lebaran, arisan, atau oleh-oleh khas Semarang.', 'Tanya Paket Hampers', null, true, 10);

-- Pengaturan situs (kosong = belum ada datanya, lihat TODO_KONTEN.md)
insert into public.site_settings (key, value) values ('instagram_url', 'https://www.instagram.com/jamuburanti') on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('instagram_akun', '@jamuburanti') on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('email', null) on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('tiktok_url', null) on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('facebook_url', null) on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('gofood_url', null) on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('grabfood_url', null) on conflict (key) do nothing;
insert into public.site_settings (key, value) values ('shopeefood_url', null) on conflict (key) do nothing;
