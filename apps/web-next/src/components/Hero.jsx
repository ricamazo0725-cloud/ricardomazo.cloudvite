"use client";

import FlowDiagram from "@/components/FlowDiagram";
import { useLanguage } from "@/hooks/useLanguage";

export default function Hero({ data }) {
  const { t, pick } = useLanguage();

  if (!data) {
    return (
      <section id="top" className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-muted font-mono text-sm">
        {t("hero.empty")}
      </section>
    );
  }

  const primaryLabel = pick(data.primaryCta?.label);
  const secondaryLabel = pick(data.secondaryCta?.label);

  return (
    <section id="top" className="max-w-6xl mx-auto px-6 pt-20 pb-24">
      <div className="status-chip mb-8">
        <span className="status-dot" />
        {pick(data.status) || t("hero.statusFallback")}
      </div>

      <h1 className="font-display font-semibold text-4xl sm:text-6xl leading-[1.05] tracking-tight max-w-3xl">
        {pick(data.title)}
      </h1>

      {data.subtitle && (
        <p className="mt-6 text-lg text-muted max-w-2xl leading-relaxed">{pick(data.subtitle)}</p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        {primaryLabel && (
          <a
            href={data.primaryCta.href || "#experience"}
            className="font-mono text-xs uppercase tracking-wider bg-primary text-primary-foreground rounded px-5 py-3 hover:opacity-90 transition-opacity focus-ring"
          >
            {primaryLabel}
          </a>
        )}
        {secondaryLabel && (
          <a
            href={data.secondaryCta.href || "#services"}
            className="font-mono text-xs uppercase tracking-wider border border-border rounded px-5 py-3 hover:border-accent hover:text-accent transition-colors focus-ring"
          >
            {secondaryLabel}
          </a>
        )}
      </div>

      <div className="mt-16 card p-6 sm:p-10">
        <FlowDiagram />
      </div>
    </section>
  );
}
