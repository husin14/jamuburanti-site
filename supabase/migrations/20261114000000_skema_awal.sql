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
