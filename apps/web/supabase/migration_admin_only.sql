-- Migración de seguridad: solo el admin puede escribir en el contenido.
--
-- Problema: las políticas "admin write ..." usan auth.role() = 'authenticated',
-- que es verdadero para CUALQUIER usuario con sesión. Si el registro por correo
-- de Supabase Auth está abierto (lo está por defecto), cualquiera puede crearse
-- una cuenta con la anon key pública y editar o borrar todo el sitio.
--
-- Qué hace:
-- 1) Crea la tabla admin_users (quién es admin) y la función is_admin().
-- 2) En site_content, service_items, experience_items, project_items y
--    blog_posts borra TODAS las políticas que no sean de solo lectura y crea
--    una sola de escritura limitada a is_admin().
-- 3) La lectura pública de blog_posts queda limitada a posts publicados.
-- 4) Borra cualquier política de escritura del bucket blog-images.
-- La Edge Function nasa-daily-post usa la service_role, que se salta RLS, así
-- que sigue funcionando igual.
--
-- ANTES de correrla: cambia TU-CORREO-ADMIN@ejemplo.com (paso 1) por el correo
-- con el que entras a /admin. Si te equivocas, no te bloqueas para siempre:
-- puedes corregir admin_users desde el SQL Editor.
-- Es seguro correrla más de una vez.

-- 1) Lista de admins
create table if not exists admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table admin_users enable row level security;
-- Sin políticas: nadie la lee ni la escribe desde la API pública.

insert into admin_users (user_id)
select id from auth.users where email = 'TU-CORREO-ADMIN@ejemplo.com'
on conflict do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2) Reemplazar las políticas de escritura
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['site_content', 'service_items', 'experience_items', 'project_items', 'blog_posts'] loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('alter table public.%I enable row level security', t);
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t and cmd <> 'SELECT'
    loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      'admin write ' || t, t
    );
  end loop;
end $$;

-- 3) blog_posts: la lectura pública solo ve posts publicados. Antes no se
--    sabía cómo estaba (la tabla se creó fuera de los archivos del repo); si
--    era using (true), cualquiera podía leer los borradores con la anon key.
--    El sitio ya filtra published = true, así que no cambia nada visible.
do $$
declare
  p record;
begin
  if to_regclass('public.blog_posts') is null then
    return;
  end if;
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'blog_posts' and cmd = 'SELECT'
  loop
    execute format('drop policy %I on public.blog_posts', p.policyname);
  end loop;
  create policy "public read published blog_posts" on public.blog_posts
    for select using (published = true or public.is_admin());
end $$;

-- 4) Bucket blog-images: nadie sube ni borra desde el navegador. La función
--    nasa-daily-post usa la service_role, que se salta RLS, y el bucket es
--    público para leer, así que no necesita políticas de escritura. Si alguna
--    se creó a mano, se borra. No toca políticas de otros buckets.
do $$
declare
  p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and cmd <> 'SELECT'
      and (coalesce(qual, '') || coalesce(with_check, '')) like '%blog-images%'
  loop
    execute format('drop policy %I on storage.objects', p.policyname);
  end loop;
end $$;

-- 5) Comprobación (solo lectura): así deberían quedar las políticas.
select schemaname, tablename, policyname, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, cmd;
