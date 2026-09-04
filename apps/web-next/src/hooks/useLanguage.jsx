"use client";

import { createContext, useContext, useMemo } from "react";
import { LOCALES, translations } from "@/i18n/translations";
import { localize } from "@/i18n/localize";

export { localize };

const LanguageContext = createContext(null);

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

/**
 * El idioma ya no es un estado que el usuario cambia en el cliente (eso
 * rompía el SEO: una sola URL podía mostrar dos idiomas distintos según
 * localStorage, lo cual hace inválido cualquier hreflang). Ahora cada URL
 * tiene un idioma fijo -- / y sus rutas son español, /en/... es inglés --
 * decidido en el servidor por app/layout.js a partir del pathname (ver
 * middleware.js). `locale` llega desde ahí como prop obligatoria.
 */
export function LanguageProvider({ children, locale }) {
  const lang = LOCALES.includes(locale) ? locale : LOCALES[0];

  const t = useMemo(() => {
    return (key) => {
      const value = getPath(translations[lang], key) ?? getPath(translations[LOCALES[0]], key);
      return value ?? key;
    };
  }, [lang]);

  const pick = useMemo(() => {
    return (value) => localize(value, lang);
  }, [lang]);

  const value = useMemo(() => ({ lang, t, pick, locales: LOCALES }), [lang, t, pick]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  return ctx;
}
