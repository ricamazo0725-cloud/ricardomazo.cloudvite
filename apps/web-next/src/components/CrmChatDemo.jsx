"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useInViewOnce, useReducedMotion } from "@/hooks/useMotion";
import { effectsCopy } from "@/i18n/effectsCopy";

const FIELDS = ["name", "channel", "interest", "city", "next"];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Simulación: un chat de WhatsApp con agente IA que va llenando una ficha
// de CRM y moviendo el embudo. Arranca la primera vez que entra en pantalla.
export default function CrmChatDemo() {
  const { lang } = useLanguage();
  const copy = effectsCopy(lang).crm;
  const sectionRef = useRef(null);
  const seen = useInViewOnce(sectionRef);
  const reduced = useReducedMotion();
  const runId = useRef(0);

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [record, setRecord] = useState({});
  const [flashes, setFlashes] = useState({});
  const [stage, setStage] = useState(-1);

  const run = useCallback(async () => {
    const id = ++runId.current;
    const alive = () => id === runId.current;
    setMessages([]);
    setRecord({});
    setStage(-1);
    for (const m of copy.convo) {
      if (m.who === "in") {
        setTyping(true);
        await wait(reduced ? 50 : 1100);
        setTyping(false);
      } else {
        await wait(reduced ? 50 : 700);
      }
      if (!alive()) return;
      setMessages((prev) => [...prev, m]);
      await wait(reduced ? 20 : 350);
      if (!alive()) return;
      if (m.fill) {
        setRecord((prev) => ({ ...prev, ...m.fill }));
        setFlashes((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(m.fill)) next[k] = (next[k] || 0) + 1;
          return next;
        });
      }
      if (m.stage !== undefined) setStage(m.stage);
      await wait(reduced ? 20 : 500);
    }
  }, [copy, reduced]);

  useEffect(() => {
    if (seen) run();
    return () => {
      runId.current++;
    };
  }, [seen, run]);

  return (
    <section ref={sectionRef} className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{copy.eyebrow}</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-4 max-w-2xl">{copy.title}</h2>
      <p className="text-foreground/80 max-w-2xl">{copy.lead}</p>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-10">
        <div className="crm-phone" aria-label={copy.example}>
          <div className="crm-phone-bar">
            <div className="crm-avatar">RM</div>
            <div>
              <b>{copy.business}</b>
              <br />
              <small>{copy.online}</small>
            </div>
          </div>
          <div className="crm-msgs" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`crm-msg ${m.who}`}>
                {m.who === "bot" && <small>{copy.botTag}</small>}
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="crm-typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold text-lg">{copy.card}</h3>
            <span className="status-chip !text-[10px]">
              <span className="status-dot" />
              {copy.syncing}
            </span>
          </div>
          {FIELDS.map((k) => (
            // La key cambia con cada relleno para que el destello se repita.
            <div key={`${k}-${flashes[k] || 0}`} className={"crm-field" + (record[k] ? " fill" : "")}>
              <span>{copy.fields[k]}</span>
              <span>{record[k] || ""}</span>
            </div>
          ))}
          <div className="flex gap-1.5 mt-5">
            {copy.funnel.map((label, i) => (
              <div key={label} className={"crm-funnel" + (i <= stage ? " on" : "")}>
                {label}
              </div>
            ))}
          </div>
          <button type="button" onClick={run} className="mt-4 font-mono text-xs text-accent hover:underline focus-ring rounded">
            {copy.replay}
          </button>
        </div>
      </div>
    </section>
  );
}
