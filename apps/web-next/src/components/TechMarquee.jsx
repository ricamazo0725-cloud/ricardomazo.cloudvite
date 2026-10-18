"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { effectsCopy } from "@/i18n/effectsCopy";

export default function TechMarquee() {
  const { lang } = useLanguage();
  const items = effectsCopy(lang).marquee;

  return (
    <section className="marquee border-y border-border bg-surface py-8 overflow-hidden" aria-label="Stack">
      <div className="marquee-track">
        {/* La lista va dos veces para que el bucle no tenga salto. */}
        {[...items, ...items].map((item, i) => (
          <span key={i} aria-hidden={i >= items.length ? "true" : undefined}>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
