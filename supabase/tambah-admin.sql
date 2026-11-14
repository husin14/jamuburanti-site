-- Jadikan user sebagai admin panel Jamu Bu Ranti.
-- 1) Buat dulu user-nya: Supabase > Authentication > Users > Add user > Create new user
--    (centang "Auto Confirm User").
-- 2) Ganti email di bawah, lalu jalankan di SQL Editor.
insert into public.admins (user_id)
select id from auth.users where email = 'jamuburanti@gmail.com'
on conflict (user_id) do nothing;

-- Cek daftar admin:
select a.user_id, u.email, a.created_at
from public.admins a join auth.users u on u.id = a.user_id;
