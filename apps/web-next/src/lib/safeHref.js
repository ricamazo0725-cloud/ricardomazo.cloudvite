// Los enlaces que vienen de Supabase (CTAs del hero, servicios, proyectos,
// fuente de un post) se editan desde /admin. React 18 no bloquea URLs
// "javascript:", así que si alguien llegara a escribir en esas tablas podría
// meter código que corre al hacer clic. Esto solo deja pasar rutas internas,
// anclas y enlaces http(s)/mailto/tel; cualquier otra cosa se descarta.
const ALLOWED_PROTOCOLS = ["http:", "https:", "mailto:", "tel:"];

export function safeHref(href, fallback = null) {
  if (typeof href !== "string") return fallback;
  const value = href.trim();
  if (!value) return fallback;
  if (value.startsWith("#")) return value;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ALLOWED_PROTOCOLS.includes(url.protocol) ? value : fallback;
  } catch {
    return fallback;
  }
}
