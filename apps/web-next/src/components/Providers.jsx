"use client";

import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";

// El español (locale por defecto de todo el sitio) se fija aquí. El árbol
// /en/... lo sobreescribe con su propio layout (app/en/layout.js), que
// anida otro LanguageProvider con locale="en" -- el contexto de React más
// interno gana, sin necesitar leer la URL en el servidor.
export default function Providers({ children, locale = "es" }) {
  return (
    <LanguageProvider locale={locale}>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
