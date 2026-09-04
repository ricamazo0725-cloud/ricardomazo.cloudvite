import { LanguageProvider } from "@/hooks/useLanguage";

// Sobreescribe el idioma para todo lo que cuelga de /en/... El layout raíz
// (app/layout.js) ya envuelve todo el sitio en <LanguageProvider
// locale="es">; este segundo provider, anidado, gana para cualquier
// componente dentro de /en/ (contexto de React normal: el más interno
// pisa al externo). No toca <html>/<body> -- solo Next.js permite eso en
// el layout raíz -- por eso ese atributo se corrige aparte con un script
// mínimo en app/layout.js.
export default function EnLayout({ children }) {
  return <LanguageProvider locale="en">{children}</LanguageProvider>;
}
