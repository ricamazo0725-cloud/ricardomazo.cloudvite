import { DEFAULT_LOCALE, LOCALES } from "@/i18n/translations";

/**
 * Resuelve un valor que puede venir de Supabase en dos formas:
 * - Bilingue nuevo: { es: "...", en: "..." } (o arrays: { es: [...], en: [...] })
 * - Legado (dato viejo sin migrar): un string o array plano -- se muestra igual en
 *   cualquier idioma hasta que se edite desde el panel admin.
 *
 * Funcion pura, sin "use client": se puede importar tanto desde Server
 * Components (para generar HTML/JSON-LD con el idioma por defecto) como
 * desde hooks/useLanguage.jsx (client) para el toggle de idioma en vivo.
 */
export function localize(value, lang) {
  if (value == null) return value;
  if (typeof value === "string" || Array.isArray(value)) return value;
  if (typeof value === "object") {
    if (lang in value || DEFAULT_LOCALE in value) {
      return value[lang] ?? value[DEFAULT_LOCALE] ?? value[LOCALES.find((l) => value[l])] ?? "";
    }
    return "";
  }
  return value;
}
