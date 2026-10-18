"use client";

import { useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useStickyProgress } from "@/hooks/useMotion";

// Pequeñas animaciones decorativas que rotan entre las tarjetas.
function MiniAnim({ index }) {
  switch (index % 4) {
    case 0:
      return (
        <div className="exp-mini exp-mini-sync" aria-hidden="true">
          <span style={{ left: "8%" }}>APP</span>
          <span style={{ right: "8%" }}>ERP</span>
          <i />
        </div>
      );
    case 1:
      return (
        <div className="exp-mini exp-mini-code" aria-hidden="true">
          <span>
            <b>const</b> lead = <u>await</u> crm.save(msg);
          </span>
          <span>$ sudo systemctl reload nginx</span>
          <span>
            <b>aws</b> s3 sync ./uploads s3://…
          </span>
        </div>
      );
    case 2:
      return (
        <div className="exp-mini exp-mini-shield" aria-hidden="true">
          <svg width="60" height="70" viewBox="0 0 60 70">
            <path d="M30 4 L54 14 V34 C54 50 43 61 30 66 C17 61 6 50 6 34 V14 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
            <path d="M19 35 l8 8 l15 -16" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="exp-mini exp-mini-term" aria-hidden="true">
          &gt; javac Main.java
          <br />
          &gt; java Main
          <br />
          <span className="text-primary">BUILD SUCCESSFUL</span>
        </div>
      );
  }
}

// La sección es alta y su contenido queda fijo: el scroll vertical se
// traduce en un desplazamiento horizontal de las tarjetas.
export default function Experience({ items }) {
  const { t, pick } = useLanguage();
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const progress = useStickyProgress(sectionRef);

  if (items.length === 0) {
    return (
      <section id="experience" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
        <span className="status-chip mb-6">{t("experience.eyebrow")}</span>
        <p className="text-muted font-mono text-sm">{t("experience.empty")}</p>
      </section>
    );
  }

  // Se mide en cada render (el progreso cambia con el scroll); el margen
  // extra deja aire a la derecha de la última tarjeta.
  const rail = railRef.current;
  const overflow = rail ? Math.max(0, rail.scrollWidth - rail.clientWidth + 24) : 0;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative border-t border-border"
      style={{ height: `${100 + items.length * 60}vh` }}
    >
      <div className="sticky top-0 h-screen pt-16 flex flex-col justify-center overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-6">
          <span className="status-chip mb-6">{t("experience.eyebrow")}</span>
        </div>

        <div className="mt-4">
          <ol
            ref={railRef}
            className="flex gap-5 px-6 lg:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] will-change-transform"
            style={{ transform: `translateX(${-progress * overflow}px)` }}
          >
            {items.map((item, i) => {
              const description = pick(item.description);
              return (
                <li key={item.id} className="exp-card card">
                  <div className="font-mono text-xs uppercase tracking-wider text-primary">{pick(item.period)}</div>
                  <h3 className="font-display font-semibold text-xl mt-2">{pick(item.role)}</h3>
                  <div className="font-mono text-xs text-accent mt-1 mb-3">{item.company}</div>
                  {description && <p className="text-sm leading-relaxed text-foreground/80 flex-1">{description}</p>}
                  <MiniAnim index={i} />
                </li>
              );
            })}
          </ol>
        </div>

        <div className="max-w-6xl w-full mx-auto px-6 mt-8">
          <div className="h-[2px] bg-border relative">
            <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
