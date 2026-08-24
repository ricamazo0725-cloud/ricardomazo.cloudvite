-- Migración para proyectos de Supabase que ya tenían el schema.sql original
-- (columnas de texto plano) y ya tienen contenido cargado. Ejecuta esto UNA VEZ
-- en el SQL Editor de tu proyecto de Supabase, después de actualizar el código.
--
-- Qué hace: envuelve el contenido existente (que estaba en español) en el
-- nuevo formato { "es": "...", "en": "..." }, dejando "en" vacío para que
-- lo completes desde /admin. Es seguro correrlo aunque ya hayas corrido
-- schema.sql original una vez — no se ejecuta dos veces sobre datos ya migrados
-- gracias a los checks de jsonb_typeof / column type.

-- 1) service_items: title/description de text -> jsonb
alter table service_items
  alter column title type jsonb using jsonb_build_object('es', title),
  alter column description type jsonb using
    case when description is null then null else jsonb_build_object('es', description) end;

-- 2) experience_items: role/period/description de text -> jsonb (company se queda como texto)
alter table experience_items
  alter column role type jsonb using jsonb_build_object('es', role),
  alter column period type jsonb using
    case when period is null then null else jsonb_build_object('es', period) end,
  alter column description type jsonb using
    case when description is null then null else jsonb_build_object('es', description) end;

-- 3) site_content: envolver los campos de texto dentro del jsonb `data`.
-- hero
update site_content
set data = data
  || jsonb_build_object('status', jsonb_build_object('es', data->>'status'))
  || jsonb_build_object('title', jsonb_build_object('es', data->>'title'))
  || jsonb_build_object('subtitle', jsonb_build_object('es', data->>'subtitle'))
  || jsonb_build_object('primaryCta', jsonb_build_object(
       'label', jsonb_build_object('es', data->'primaryCta'->>'label'),
       'href', data->'primaryCta'->>'href'
     ))
  || jsonb_build_object('secondaryCta', jsonb_build_object(
       'label', jsonb_build_object('es', data->'secondaryCta'->>'label'),
       'href', data->'secondaryCta'->>'href'
     ))
where section = 'hero' and jsonb_typeof(data->'title') = 'string';

-- about (paragraphs pasa de array plano a { es: [...], en: [] })
update site_content
set data = jsonb_set(data, '{paragraphs}', jsonb_build_object('es', coalesce(data->'paragraphs', '[]'::jsonb), 'en', '[]'::jsonb))
where section = 'about' and jsonb_typeof(data->'paragraphs') = 'array';

-- contact (whatsappMessage)
update site_content
set data = jsonb_set(data, '{whatsappMessage}', jsonb_build_object('es', data->>'whatsappMessage'))
where section = 'contact' and jsonb_typeof(data->'whatsappMessage') = 'string';

-- Nota: las "stats" de la sección about (about.stats[].label) y cualquier
-- métrica que ya hayas cargado quedan tal cual — reingrésalas desde
-- /admin (pestaña Contenido → Sobre mí) porque son pocos elementos y es
-- más simple editarlos ahí que migrarlos con SQL. Luego solo te falta
-- entrar a /admin, cambiar el selector ES/EN a "EN" y completar la
-- traducción al inglés de cada campo.
