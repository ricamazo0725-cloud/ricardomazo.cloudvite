"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useInViewOnce, useReducedMotion } from "@/hooks/useMotion";
import { effectsCopy } from "@/i18n/effectsCopy";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AutomationShowcase() {
  const { t, lang } = useLanguage();
  const lines = effectsCopy(lang).terminal.lines;
  const termTitle = effectsCopy(lang).terminal.title;
  const sectionRef = useRef(null);
  const seen = useInViewOnce(sectionRef);
  const reduced = useReducedMotion();

  // typed[i] = texto ya escrito de la línea i; activeStep = paso encendido
  const [typed, setTyped] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!seen) return;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < lines.length; i++) {
        const [, text, step] = lines[i];
        if (step !== undefined) setActiveStep(step);
        if (reduced) {
          setTyped((prev) => [...prev, text]);
        } else {
          for (let c = 1; c <= text.length; c++) {
            if (cancelled) return;
            setTyped((prev) => {
              const next = prev.slice(0, i);
              next[i] = text.slice(0, c);
              return next;
            });
            await wait(16);
          }
          await wait(260);
        }
        if (cancelled) return;
      }
      setDone(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [seen, lines, reduced]);

  const steps = [
    { emoji: "🛰️", label: t("automation.steps.connect") },
    { emoji: "✍️", label: t("automation.steps.write") },
    { emoji: "📤", label: t("automation.steps.publish") },
    { emoji: "🔁", label: t("automation.steps.repeat") },
  ];

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-16 border-t border-border">
      <span className="status-chip mb-4">{t("automation.eyebrow")}</span>
      <h2 className="font-display font-semibold text-2xl sm:text-3xl text-foreground mb-3">{t("automation.title")}</h2>
      <p className="text-foreground/80 max-w-2xl mb-8">{t("automation.description")}</p>

      <div className="term">
        <div className="term-bar">
          <i />
          <i />
          <i />
          <span>{termTitle}</span>
        </div>
        <pre aria-label={lines.map((l) => l[1]).join("\n")}>
          {typed.map((text, i) => (
            <span key={i} className={lines[i][0] ? `term-${lines[i][0]}` : undefined}>
              {text}
              {i === typed.length - 1 && !done ? <span className="term-cursor" /> : null}
              {"\n"}
            </span>
          ))}
          {done && <span className="term-cursor" />}
        </pre>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {steps.map((step, i) => (
          <div key={i} className={"term-step" + (done || i === activeStep ? " on" : "")}>
            <span className="text-2xl block mb-1">{step.emoji}</span>
            <span className="text-sm">{step.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
