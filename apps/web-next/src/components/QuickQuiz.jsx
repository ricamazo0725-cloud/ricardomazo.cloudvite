"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { effectsCopy, whatsappLink } from "@/i18n/effectsCopy";

// Diagnóstico de 3 preguntas: recomienda uno de los servicios y abre
// WhatsApp con el mensaje ya escrito.
export default function QuickQuiz({ whatsapp }) {
  const { lang } = useLanguage();
  const copy = effectsCopy(lang).quiz;
  const [answers, setAnswers] = useState([]);

  const total = copy.questions.length;
  const step = answers.length;
  const finished = step >= total;

  let result = null;
  if (finished) {
    const score = {};
    for (const a of answers) score[a] = (score[a] || 0) + 1;
    // Desempate: gana la primera respuesta dada.
    const best = Object.keys(score).sort((a, b) => score[b] - score[a] || answers.indexOf(a) - answers.indexOf(b))[0];
    result = copy.results[best];
  }
  const href = result ? whatsappLink(whatsapp, result.message) : null;

  return (
    <section id="diagnostico" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{copy.eyebrow}</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-4 max-w-2xl">{copy.title}</h2>
      <p className="text-foreground/80 max-w-2xl">{copy.lead}</p>

      <div className="card p-6 sm:p-8 mt-10 max-w-2xl">
        <div className="flex gap-1.5 mb-6" aria-hidden="true">
          {copy.questions.map((_, i) => (
            <i key={i} className={"flex-1 h-1 rounded transition-colors " + (i <= step ? "bg-primary" : "bg-border")} />
          ))}
        </div>

        {!finished ? (
          <div key={step} className="quiz-in">
            <div className="font-mono text-xs text-muted mb-2">{copy.counter(step + 1, total)}</div>
            <h3 className="font-display font-semibold text-xl sm:text-2xl mb-4">{copy.questions[step].q}</h3>
            <div className="grid gap-2.5">
              {copy.questions[step].options.map(([label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setAnswers((prev) => [...prev, value])}
                  className="quiz-option focus-ring"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="quiz-in">
            <div className="font-mono text-xs text-accent tracking-wider">{copy.resultTag}</div>
            <h3 className="font-display font-semibold text-2xl mt-2 mb-3">{result.name}</h3>
            <p className="text-foreground/80 mb-6">{result.text}</p>
            <div className="flex flex-wrap gap-3">
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase tracking-wider bg-[#25D366] text-[#05210f] font-semibold rounded px-5 py-3 hover:opacity-90 focus-ring"
                >
                  {copy.send}
                </a>
              )}
              <button
                type="button"
                onClick={() => setAnswers([])}
                className="font-mono text-xs uppercase tracking-wider border border-border rounded px-5 py-3 hover:border-accent hover:text-accent transition-colors focus-ring"
              >
                {copy.again}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
