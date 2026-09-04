"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_LOCALE, LOCALES, translations } from "@/i18n/translations";
import { localize } from "@/i18n/localize";

export { localize };

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
