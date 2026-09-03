"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, translations } from "@/i18n/translations";

const STORAGE_KEY = "site_lang";
const LanguageContext = createContext(null);

function detectInitialLang() {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && LOCALES.includes(stored)) return stored;
  const browserLang = window.navigator.language?.slice(0, 2);
  if (browserLang && LOCALES.includes(browserLang)) return browserLang;
  return DEFAULT_LOCALE;
}

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

/**
 * Resuelve un valor que puede venir de Supabase en dos formas:
 * - Bilingüe nuevo: { es: "...", en: "..." } (o arrays: { es: [...], en: [...] })
 * - Legado (dato viejo sin migrar): un string o array plano — se muestra igual en
 *   cualquier idioma hasta que se edite desde el panel admin.
 */
export function localize(value, lang) {
  if (value == null) return value;
  if (typeof value === "string" || Array.isArray(value)) return value;
  if (typeof value === "object") {
    if (lang in value || DEFAULT_LOCALE in value) {
      return value[lang] ?? value[DEFAULT_LOCALE] ?? value[LOCALES.find((l) => value[l])] ?? "";
    }
    // Objeto sin ninguna clave de idioma (ej. {} recien creado desde el admin
    // sin llenar todavia) -- nunca devolver el objeto crudo, React no puede
    // renderizarlo como hijo y la pagina se rompe entera.
    return "";
  }
  return value;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitialLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next) {
    if (LOCALES.includes(next)) setLangState(next);
  }

  function toggleLang() {
    const idx = LOCALES.indexOf(lang);
    setLangState(LOCALES[(idx + 1) % LOCALES.length]);
  }

  const t = useMemo(() => {
    return (key) => {
      const value = getPath(translations[lang], key) ?? getPath(translations[DEFAULT_LOCALE], key);
      return value ?? key;
    };
  }, [lang]);

  const pick = useMemo(() => {
    return (value) => localize(value, lang);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, pick, locales: LOCALES }),
    [lang, t, pick]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  return ctx;
}
