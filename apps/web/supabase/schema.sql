-- Ejecutar en el SQL Editor del proyecto de Supabase.

create extension if not exists "pgcrypto";

-- Secciones de texto libre: hero, about, contact
create table if not exists site_content (
  section text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists service_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists experience_items (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text,
  period text,
  description text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table site_content enable row level security;
alter table service_items enable row level security;
alter table experience_items enable row level security;

-- Lectura pública (el sitio es público)
create policy "public read site_content" on site_content for select using (true);
create policy "public read service_items" on service_items for select using (true);
create policy "public read experience_items" on experience_items for select using (true);

-- Escritura solo para usuarios autenticados (el admin)
create policy "admin write site_content" on site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin write service_items" on service_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin write experience_items" on experience_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Contenido inicial de ejemplo (bórralo o edítalo desde el panel admin)
insert into site_content (section, data) values
  ('hero', '{
    "status": "Disponible para proyectos",
    "title": "Ecosistemas Digitales & Agentes de IA",
    "subtitle": "Ayudo a las empresas a escalar cerrando la brecha entre la complejidad operativa y la tecnología.",
    "primaryCta": {"label": "Ver experiencia", "href": "#experience"},
    "secondaryCta": {"label": "Ver servicios", "href": "#services"}
  }'::jsonb),
  ('about', '{
    "paragraphs": ["Soy un Líder de Estrategia Digital y Operaciones dedicado al diseño y automatización de ecosistemas de alta eficiencia."],
    "stats": [{"value": "100%", "label": "Automatización & IA"}, {"value": "n8n", "label": "Sistemas integrados"}]
  }'::jsonb),
  ('contact', '{
    "email": "tucorreo@ejemplo.com",
    "whatsapp": "573000000000",
    "whatsappMessage": "Hola, vi tu portafolio y me gustaría hablar contigo."
  }'::jsonb)
on conflict (section) do nothing;
