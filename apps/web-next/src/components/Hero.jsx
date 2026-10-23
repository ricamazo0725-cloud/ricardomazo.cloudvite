"use client";

import { useRef } from "react";
import NetworkCanvas from "@/components/NetworkCanvas";
import { useLanguage } from "@/hooks/useLanguage";
import { safeHref } from "@/lib/safeHref";

// Parte el titular en letras animadas, agrupadas por palabra para que el
// salto de línea nunca corte una palabra. El texto completo queda en
// aria-label para lectores de pantalla y buscadores.
function SplitTitle({ text }) {
  let index = 0;
  const words = text.split(" ");
  return words.map((word, wi) => (
    <span key={wi}>
      <span className="hero-word" aria-hidden="true">
        {[...word].map((ch) => {
          const delay = index++ * 35;
          return (
            <span
              key={delay}
              className={"hero-char" + (ch === "&" ? " text-primary" : "")}
              style={{ animationDelay: `${delay}ms` }}
            >
              {ch}
            </span>
          );
        })}
      </span>
      {wi < words.length - 1 ? " " : null}
    </span>
  ));
}

export default function Hero({ data }) {
  const { t, pick } = useLanguage();
  const sectionRef = useRef(null);

  if (!data) {
    return (
      <section id="top" className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-muted font-mono text-sm">
        {t("hero.empty")}
      </section>
    );
  }

  const title = pick(data.title) || "";
  const primaryLabel = pick(data.primaryCta?.label);
  const secondaryLabel = pick(data.secondaryCta?.label);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center"
    >
      <NetworkCanvas containerRef={sectionRef} />

      <div className="relative z-10 max-w-6xl w-full mx-auto px-6 pt-20 pb-24">
        <div className="status-chip mb-8">
          <span className="status-dot" />
          {pick(data.status) || t("hero.statusFallback")}
        </div>

        <h1
          aria-label={title}
          className="font-display font-bold text-5xl sm:text-7xl lg:text-8xl leading-[1.02] tracking-tight max-w-5xl"
        >
          <SplitTitle text={title} />
        </h1>

        {data.subtitle && (
          <p className="hero-fade mt-6 text-lg sm:text-xl text-muted max-w-2xl leading-relaxed" style={{ animationDelay: "1.4s" }}>
            {pick(data.subtitle)}
          </p>
        )}

        <div className="hero-fade mt-10 flex flex-wrap gap-4" style={{ animationDelay: "1.7s" }}>
          {primaryLabel && (
            <a
              href={safeHref(data.primaryCta.href, "#experience")}
              className="font-mono text-xs uppercase tracking-wider bg-primary text-primary-foreground rounded px-5 py-3 hover:opacity-90 transition-opacity focus-ring"
            >
              {primaryLabel}
            </a>
          )}
          {secondaryLabel && (
            <a
              href={safeHref(data.secondaryCta.href, "#services")}
              className="font-mono text-xs uppercase tracking-wider border border-border bg-surface rounded px-5 py-3 hover:border-accent hover:text-accent transition-colors focus-ring"
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
