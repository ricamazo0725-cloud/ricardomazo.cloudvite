"use client";

import { useLanguage } from "@/hooks/useLanguage";

export default function About({ data }) {
  const { t, pick } = useLanguage();
  const paragraphs = pick(data?.paragraphs) || [];

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{t("about.eyebrow")}</span>

      {!data ? (
        <p className="text-muted font-mono text-sm">{t("about.empty")}</p>
      ) : (
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
          <div className="space-y-4 text-lg leading-relaxed text-foreground/90 max-w-2xl">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {data.stats?.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {data.stats.map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className="font-display font-semibold text-2xl text-primary">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted">
                    {pick(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
