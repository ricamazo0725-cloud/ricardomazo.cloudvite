"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useInViewOnce, useReducedMotion } from "@/hooks/useMotion";

// "100%" -> sube de 0 a 100 conservando el "%". Si el valor no es un número
// (ej. "n8n"), se muestra tal cual.
function CountUp({ value }) {
  const ref = useRef(null);
  const seen = useInViewOnce(ref, 0.5);
  const reduced = useReducedMotion();
  const match = /^(\D*?)(\d+)(\D*)$/.exec(String(value ?? ""));
  const target = match ? Number(match[2]) : null;
  const [n, setN] = useState(target);

  useEffect(() => {
    if (target == null || !seen || reduced) {
      setN(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 1600);
      setN(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    setN(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, reduced]);

  return <span ref={ref}>{match ? `${match[1]}${n}${match[3]}` : value}</span>;
}

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
                  <div className="font-display font-bold text-4xl text-primary">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-muted">
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
