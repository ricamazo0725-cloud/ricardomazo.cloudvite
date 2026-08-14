import { useEffect, useState } from "react";

// Para un cliente nuevo: cambia NAV, el nombre de marca y el footer.
const NAV = [
  { to: "#about", label: "Sobre mí" },
  { to: "#services", label: "Servicios" },
  { to: "#experience", label: "Experiencia" },
  { to: "#contact", label: "Contacto" },
];

export default function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);

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
          <a
            href="#contact"
            className="font-mono text-xs uppercase tracking-wider border border-border rounded px-3 py-1.5 hover:border-primary hover:text-primary transition-colors focus-ring"
          >
            Hablemos
          </a>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <span>© {new Date().getFullYear()} Ricardo Mazo</span>
          <span>Ecosistemas Digitales &amp; Agentes de IA</span>
        </div>
      </footer>
    </div>
  );
}
