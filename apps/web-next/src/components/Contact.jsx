"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { effectsCopy, whatsappLink } from "@/i18n/effectsCopy";

// Hora actual en Medellín y si es horario laboral (L-V, 8:00-19:00).
function useMedellinClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;
  const hour = Number(get("hour")) % 24;
  const weekday = get("weekday");
  return {
    time: `${String(hour).padStart(2, "0")}:${get("minute")}`,
    open: hour >= 8 && hour < 19 && weekday !== "Sat" && weekday !== "Sun",
  };
}

export default function Contact({ data }) {
  const { t, pick, lang } = useLanguage();
  const copy = effectsCopy(lang).contact;
  const clock = useMedellinClock();
  const magnetRef = useRef(null);
  const whatsappHref = whatsappLink(data?.whatsapp, pick(data?.whatsappMessage));

  // Botón magnético: se acerca al cursor cuando está a menos de 160px.
  const onMove = (e) => {
    const el = magnetRef.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = Math.hypot(dx, dy) < 160 ? `translate(${dx * 0.3}px, ${dy * 0.3}px)` : "";
  };
  const onLeave = () => {
    if (magnetRef.current) magnetRef.current.style.transform = "";
  };

  return (
    <section
      id="contact"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="max-w-6xl mx-auto px-6 py-24 sm:py-32 border-t border-border text-center"
    >
      <span className="status-chip mb-6">
        <span className="status-dot" />
        {t("contact.eyebrow")}
      </span>
      <h2 className="font-display font-semibold text-3xl sm:text-5xl tracking-tight mb-10 max-w-3xl mx-auto">
        {t("contact.heading")}
      </h2>

      {!data ? (
        <p className="text-muted font-mono text-sm">{t("contact.empty")}</p>
      ) : (
        <>
          {whatsappHref && (
            <a
              ref={magnetRef}
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-block font-display font-semibold text-lg bg-[#25D366] text-[#05210f] rounded-md px-8 py-5 transition-transform duration-200 ease-out focus-ring"
            >
              {copy.cta}
            </a>
          )}

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto mt-12 text-left">
            {data.email && (
              <div className="card p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">{t("contact.email")}</div>
                <a href={`mailto:${data.email}`} className="font-display text-lg hover:text-primary transition-colors focus-ring rounded">
                  {data.email}
                </a>
              </div>
            )}
            {whatsappHref && (
              <div className="card p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-muted mb-2">{t("contact.whatsapp")}</div>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="font-display text-lg hover:text-primary transition-colors focus-ring rounded">
                  {data.whatsapp}
                </a>
              </div>
            )}
          </div>

          {clock && (
            <p className="mt-8 font-mono text-xs text-muted">
              {t("layout.location")} · <b className="text-foreground">{clock.time}</b> ·{" "}
              <span className={clock.open ? "text-[#25D366]" : "text-primary"}>● {clock.open ? copy.open : copy.closed}</span>
            </p>
          )}
        </>
      )}
    </section>
  );
}
