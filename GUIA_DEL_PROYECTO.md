# Guía del proyecto — CV Ricardo Mazo (basado en la base amoli/IronFuel)

Este proyecto reutiliza la misma arquitectura del proyecto `amoli` (React + Vite +
Tailwind + Supabase, desplegado en Hostinger con Git nativo), pero sin las partes
de tienda (carrito, checkout, pedidos, catálogo de productos). En su lugar tiene
un sitio de CV/portafolio de una sola página con panel admin para editar el
contenido sin tocar código.

> Regla general (igual que en el proyecto original): todo lo que vive en
> `src/api/`, `src/hooks/`, `src/lib/` y `supabase/` es "motor" — no lo toques.
> Todo lo que vive en `src/pages/`, `src/components/`, `src/index.css` y
> `tailwind.config.js` es "carrocería" — ahí cambias diseño y textos.

## 1. Arquitectura

```
Visitante                    Tú (admin)
    │                            │
    ▼                            ▼
Sitio público (/)          Panel admin (/admin)
    │                            │
    └────────────┬───────────────┘
                  ▼
           Supabase (Postgres + Auth)
```

- **Frontend**: React + Vite, en `apps/web` (monorepo con pnpm, una sola app).
- **Backend**: Supabase — base de datos para el contenido (hero, sobre mí,
  servicios, experiencia, contacto) y autenticación del panel admin.
- **Hosting**: Hostinger con integración de Git, igual que el proyecto base.

## 2. Diseño visual

El sistema de color y tipografía está en `src/index.css` (variables) y
`tailwind.config.js`. El concepto es un "panel de control de automatización":
fondo casi negro azulado, ámbar como color de "estado activo", cian como color
de "flujo de datos", tipografía Space Grotesk (títulos), Inter (cuerpo) y
JetBrains Mono (etiquetas técnicas). El elemento firma es el diagrama de flujo
animado del hero (`src/components/FlowDiagram.jsx`).

Para cambiar la paleta, edita solo las variables `--background`, `--primary`,
`--accent`, etc. en `src/index.css`.

## 3. Puesta en marcha

1. Instala dependencias (usa pnpm):
   ```
   pnpm install
   ```
2. Crea un proyecto en [supabase.com](https://supabase.com).
3. En el **SQL Editor** de ese proyecto, corre el contenido completo de
   `apps/web/supabase/schema.sql`. Esto crea las tablas, las políticas de
   seguridad (RLS) y un contenido de ejemplo.
4. Copia `apps/web/.env.example` a `apps/web/.env` y completa
   `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Project Settings → API en
   Supabase).
5. Crea tu usuario admin en Supabase: **Authentication → Users → Add user**,
   con tu correo y una contraseña. Con eso ya puedes entrar a `/admin/login`.
6. Corre el sitio en local:
   ```
   pnpm dev
   ```
7. Entra a `/admin`, inicia sesión, y reemplaza el contenido de ejemplo por
   el tuyo (hero, sobre mí, servicios, experiencia, contacto).

## 4. Despliegue en Hostinger (igual que el proyecto original)

- Sube este proyecto a un repositorio de GitHub nuevo.
- Conecta ese repositorio en Hostinger (Git nativo).
- **Directorio de salida**: `dist/apps/web` — si lo dejas vacío, Hostinger
  publica el código fuente en vez del sitio compilado.
- Carga `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables de
  entorno en Hostinger antes de compilar. Sin estos valores, el sitio no
  arranca.
- El `package.json` raíz ya incluye el `chmod +x` que Hostinger necesita para
  que `esbuild` no pierda permisos de ejecución al compilar. No quites esa
  línea del script `build`.
- `.npmrc` tiene `ignore-scripts=true` para evitar el bloqueo de pnpm en
  Hostinger.

## 5. Qué puedes cambiar sin miedo

- Todo el contenido (textos, servicios, experiencia, contacto): desde
  `/admin`, no hace falta redesplegar.
- Colores y tipografía: `src/index.css`.
- Menú y nombre del header/footer: `src/components/Layout.jsx`.
- Estructura visual de cada sección: los componentes en `src/components/`
  (`Hero.jsx`, `About.jsx`, `Services.jsx`, `Experience.jsx`, `Contact.jsx`).

## 6. Multi-idioma (ES/EN)

El sitio soporta español e inglés:

- **Textos fijos de la interfaz** (nav, botones, mensajes de estado vacío) están
  en `src/i18n/translations.js`. Para agregar un idioma nuevo, agrega su código
  a `LOCALES` en ese archivo y completa todas las claves.
- **Contenido editable desde Supabase** (hero, sobre mí, servicios, experiencia,
  contacto) guarda los campos traducibles como `{ "es": "...", "en": "..." }` en
  vez de texto plano. Los campos que NO se traducen (enlaces, correo, WhatsApp,
  nombre de empresa) se quedan como texto plano.
- El selector ES/EN del header público cambia el idioma que ve el visitante.
  En `/admin` hay un selector aparte para elegir qué idioma estás editando en
  cada campo bilingüe — cambia a "EN" y completa la traducción en inglés.
- Si ya tenías contenido cargado en Supabase con el schema viejo (texto plano),
  corre `apps/web/supabase/migration_i18n.sql` una sola vez en el SQL Editor de
  Supabase para migrarlo al nuevo formato antes de desplegar este cambio.

## 7. Qué no tocar

- `src/lib/supabaseClient.js`, `src/api/*.js`, `src/hooks/*.jsx`: si cambias
  la forma de los datos que devuelven, tienes que actualizar los componentes
  que los consumen.
- `apps/web/supabase/schema.sql`: se corre una sola vez por proyecto de
  Supabase nuevo. Si necesitas un campo nuevo, agrégalo con una migración
  aparte en vez de editar este archivo después de haberlo corrido.
