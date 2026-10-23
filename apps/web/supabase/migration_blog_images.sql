-- Migracion: crea el bucket publico blog-images en Supabase Storage, donde
-- la Edge Function nasa-daily-post guarda una copia de cada imagen de la
-- NASA. Asi el blog no depende de que apod.nasa.gov este arriba. Ejecuta
-- esto UNA VEZ en el SQL Editor de tu proyecto de Supabase, antes de
-- desplegar la nueva version de la funcion.
--
-- Solo hace falta el bucket: la funcion sube con la service role key (que
-- ignora RLS) y un bucket publico se puede leer sin politicas extra.
--
-- Es seguro correrla mas de una vez gracias al "on conflict do nothing".

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
