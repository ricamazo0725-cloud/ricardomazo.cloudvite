import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, toggleLang, locales } = useLanguage();

  const NAV = [
    { to: "#about", label: t("nav.about") },
    { to: "#services", label: t("nav.services") },
    { to: "#experience", label: t("nav.experience") },
    { to: "#contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className={`sticky top-0 z-40 transition-colors ${
          scrolled ? "bg-background/90 backdrop-blur border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-display font-semibold tracking-tight text-lg">
            Ricardo Mazo
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-muted">
            {NAV.map((item) => (
              <a
                key={item.to}
                href={item.to}
                className="hover:text-foreground transition-colors focus-ring rounded"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              aria-label={locales.map((l) => l.toUpperCase()).join(" / ")}
              className="font-mono text-xs uppercase tracking-wider border border-border rounded px-2.5 py-1.5 text-muted hover:border-primary hover:text-primary transition-colors focus-ring"
            >
              {locales.map((l, i) => (
                <span key={l} className={l === lang ? "text-foreground" : ""}>
                  {l.toUpperCase()}
                  {i < locales.length - 1 ? " / " : ""}
                </span>
              ))}
            </button>
            <a
              href="#contact"
              className="font-mono text-xs uppercase tracking-wider border border-border rounded px-3 py-1.5 hover:border-primary hover:text-primary transition-colors focus-ring"
            >
              {t("layout.cta")}
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <span>© {new Date().getFullYear()} Ricardo Mazo</span>
          <span>{t("layout.footerTagline")}</span>
        </div>
      </footer>
    </div>
  );
}
