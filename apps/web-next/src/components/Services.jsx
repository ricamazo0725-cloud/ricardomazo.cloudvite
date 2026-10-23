"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { safeHref } from "@/lib/safeHref";

// "/blog" -> ruta interna (navegación SPA con react-router).
// "https://..." o "#..." -> se deja como <a> normal.
function isInternalPath(href) {
  return typeof href === "string" && href.startsWith("/") && !href.startsWith("//");
}

// Inclinación 3D + borde de luz que sigue al mouse. Solo con puntero fino
// (no en táctil) y sin prefers-reduced-motion.
function onTiltMove(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
  if (
    e.pointerType === "mouse" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    el.style.transform = `rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg)`;
  }
}

function onTiltLeave(e) {
  e.currentTarget.style.transform = "";
}

export default function Services({ items }) {
  const { t, pick } = useLanguage();

  return (
    <section id="services" className="max-w-6xl mx-auto px-6 py-20 border-t border-border">
      <span className="status-chip mb-6">{t("services.eyebrow")}</span>
      <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-12 max-w-xl">
        {t("services.heading")}
      </h2>

      {items.length === 0 ? (
        <p className="text-muted font-mono text-sm">{t("services.empty")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 [perspective:1000px]">
          {items.map((item) => {
            const href = safeHref(item.link?.href);
            const linkLabel = pick(item.link?.label);
            const cardClass = "tilt-card card relative p-6 sm:p-8 flex flex-col gap-3 focus-ring";
            const cardProps = {
              className: cardClass,
              style: { borderRadius: "1.25rem" },
              onPointerMove: onTiltMove,
              onPointerLeave: onTiltLeave,
            };

            const cardBody = (
              <>
                <div className="font-mono text-xs text-primary tracking-wider">
                  {String(item.order_index ?? 0).padStart(2, "0")}
                </div>
                <h3 className="font-display font-semibold text-xl">{pick(item.title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{pick(item.description)}</p>
                {href && linkLabel && (
                  <span className="font-mono text-xs uppercase tracking-wider text-accent mt-auto pt-2">
                    {linkLabel}
                  </span>
                )}
              </>
            );

            if (!href) {
              return (
                <div key={item.id} {...cardProps}>
                  {cardBody}
                </div>
              );
            }

            return isInternalPath(href) ? (
              <Link key={item.id} href={href} {...cardProps}>
                {cardBody}
              </Link>
            ) : (
              <a key={item.id} href={href} {...cardProps}>
                {cardBody}
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
