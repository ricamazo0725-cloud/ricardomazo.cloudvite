-- Migracion: crea la tabla project_items para la seccion de Proyectos
-- (pagina /proyectos), editable desde /admin -> Proyectos igual que
-- Servicios y Experiencia. Ejecuta esto UNA VEZ en el SQL Editor de tu
-- proyecto de Supabase, despues de actualizar el codigo.
--
-- title/description guardan { "es": "...", "en": "..." }. tag y url son
-- texto plano (nombre de tecnologia y enlace no se traducen).
--
-- Es seguro correrla mas de una vez: "create table if not exists" y los
-- "drop policy if exists" antes de cada "create policy" no fallan si ya
-- corriste esto antes. El insert de los dos proyectos de ejemplo (Equipos
-- Atlas y CiudadSur) solo se hace si la tabla queda vacia, para no duplicar
-- si ya los cargaste a mano desde el admin.

create table if not exists project_items (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb,
  tag text,
  url text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table project_items enable row level security;

drop policy if exists "public read project_items" on project_items;
create policy "public read project_items" on project_items for select using (true);

drop policy if exists "admin write project_items" on project_items;
create policy "admin write project_items" on project_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

insert into project_items (title, description, tag, url, order_index)
select * from (values
  (
    '{"es": "Equipos Atlas", "en": "Equipos Atlas"}'::jsonb,
    '{
      "es": "Alquiler de gruas telescopicas, telehandlers y camabajas para izaje industrial, mas cursos de operacion de maquinaria pesada.",
      "en": "Rental of telescopic cranes, telehandlers, and low-bed trailers for industrial lifting, plus heavy machinery operation courses."
    }'::jsonb,
    'React + Supabase',
    'https://equiposatlas.com/',
    0
  ),
  (
    '{"es": "CiudadSur", "en": "CiudadSur"}'::jsonb,
    '{
      "es": "Medio de noticias digital independiente del Valle de Aburra: actualidad, cultura, deportes y sociedad en Itagui, Envigado, Medellin, Caldas, La Estrella y Sabaneta.",
      "en": "Independent digital news outlet covering Colombia''s Aburra Valley: current events, culture, sports, and society in Itagui, Envigado, Medellin, Caldas, La Estrella, and Sabaneta."
    }'::jsonb,
    'WordPress',
    'https://ciudadsur.co/',
    1
  )
) as seed(title, description, tag, url, order_index)
where not exists (select 1 from project_items);
