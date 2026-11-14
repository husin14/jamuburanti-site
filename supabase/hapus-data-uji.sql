-- Hapus data yang dibuat saat pengujian Fase 3 (14 November 2026).
-- Jalankan di Supabase > SQL Editor bila ingin membersihkan.
delete from public.messages where name in ('UJI OTOMATIS', 'UJI BROWSER');
delete from public.testimonials where name in ('UJI OTOMATIS', 'UJI BROWSER');
