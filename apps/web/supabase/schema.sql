-- Ejecutar en el SQL Editor del proyecto de Supabase.

create extension if not exists "pgcrypto";

-- Secciones de texto libre: hero, about, contact
create table if not exists site_content (
  section text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- title/description guardan { "es": "...", "en": "..." } para soportar multi-idioma.
create table if not exists service_items (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  description jsonb,
  -- Enlace opcional de la tarjeta (ej. "Ver ejemplo en vivo" -> /blog).
  -- Mismo formato que hero.primaryCta/secondaryCta: { "label": {"es":"...","en":"..."}, "href": "..." }.
  -- Si es null, la tarjeta se muestra sin enlace (comportamiento actual).
  link jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- role/period/description guardan { "es": "...", "en": "..." }; company no se traduce
-- (es un nombre propio) y sigue siendo texto plano.
create table if not exists experience_items (
  id uuid primary key default gen_random_uuid(),
  role jsonb not null,
  company text,
  period jsonb,
  description jsonb,
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

-- Contenido inicial de ejemplo (bórralo o edítalo desde el panel admin).
-- Los campos de texto visibles al público se guardan como { "es": "...", "en": "..." }
-- para que el sitio pueda mostrar cada idioma sin tocar la base de datos otra vez.
insert into site_content (section, data) values
  ('hero', '{
    "status": {"es": "Disponible para proyectos", "en": "Available for projects"},
    "title": {"es": "Ecosistemas Digitales & Agentes de IA", "en": "Digital Ecosystems & AI Agents"},
    "subtitle": {
      "es": "Ayudo a las empresas a escalar cerrando la brecha entre la complejidad operativa y la tecnología.",
      "en": "I help businesses scale by closing the gap between operational complexity and technology."
    },
    "primaryCta": {"label": {"es": "Ver experiencia", "en": "View experience"}, "href": "#experience"},
    "secondaryCta": {"label": {"es": "Ver servicios", "en": "View services"}, "href": "#services"}
  }'::jsonb),
  ('about', '{
    "paragraphs": {
      "es": ["Soy un Líder de Estrategia Digital y Operaciones dedicado al diseño y automatización de ecosistemas de alta eficiencia."],
      "en": ["I am a Digital Strategy and Operations Leader focused on designing and automating high-efficiency ecosystems."]
    },
    "stats": [
      {"value": "100%", "label": {"es": "Automatización & IA", "en": "Automation & AI"}},
      {"value": "n8n", "label": {"es": "Sistemas integrados", "en": "Integrated systems"}}
    ]
  }'::jsonb),
  ('contact', '{
    "email": "tucorreo@ejemplo.com",
    "whatsapp": "573000000000",
    "whatsappMessage": {
      "es": "Hola, vi tu portafolio y me gustaría hablar contigo.",
      "en": "Hi, I saw your portfolio and would like to talk to you."
    }
  }'::jsonb)
on conflict (section) do nothing;
