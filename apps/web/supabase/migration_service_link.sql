-- Migración: agrega el campo opcional "link" a service_items y traslada la
-- tarjeta "Contenido que se escribe solo" (antes quemada en el código, en
-- src/components/Services.jsx) a un registro normal editable desde
-- /admin -> Servicios, con textos bilingües. Ejecuta esto UNA VEZ en el
-- SQL Editor de tu proyecto de Supabase, después de actualizar el código.
--
-- Qué hace:
-- 1) Agrega la columna `link` (jsonb, opcional) a service_items, con el
--    mismo formato { "label": {"es": "...", "en": "..."}, "href": "..." }
--    que ya usan las tarjetas del hero (primaryCta / secondaryCta). Si un
--    servicio no tiene link, la tarjeta se muestra igual que antes, sin
--    enlace.
-- 2) Si todavía no tienes un servicio que enlace a /blog, inserta uno con
--    el texto que antes estaba quemado en el componente, para que no se
--    pierda al actualizar el código. Después edítalo o bórralo desde
--    /admin como cualquier otro servicio.
--
-- Es seguro correrla más de una vez: "add column if not exists" no falla
-- si ya corriste esto antes, y el insert solo agrega la tarjeta si ningún
-- servicio ya enlaza a /blog.

alter table service_items add column if not exists link jsonb;

insert into service_items (title, description, link, order_index)
select
  '{"es": "Contenido que se escribe solo", "en": "Content that writes itself"}'::jsonb,
  '{
    "es": "Diseño sistemas que generan y publican contenido automáticamente, sin trabajo manual diario. Este sitio tiene un ejemplo funcionando en vivo.",
    "en": "I design systems that generate and publish content automatically, with no daily manual work. This site has a live working example."
  }'::jsonb,
  '{"label": {"es": "Ver ejemplo en vivo →", "en": "See live example →"}, "href": "/blog"}'::jsonb,
  (select coalesce(max(order_index), -1) + 1 from service_items)
where not exists (
  select 1 from service_items where link ->> 'href' = '/blog'
);
