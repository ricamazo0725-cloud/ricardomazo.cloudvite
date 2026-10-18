"use client";

import { useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion, useStickyProgress } from "@/hooks/useMotion";
import { effectsCopy } from "@/i18n/effectsCopy";

// Diagrama de integración que se "conecta" a medida que se hace scroll:
// la sección mide 420vh y su contenido queda fijo (sticky) mientras el
// progreso enciende nodos, dibuja las líneas y hace viajar los paquetes.

const NODES = [
  { x: 20, y: 20, w: 260, h: 46, on: 0.12 },
  { x: 620, y: 20, w: 260, h: 46, on: 0.2 },
  { x: 320, y: 146, w: 260, h: 56, on: 0.05, hub: true },
  { x: 20, y: 290, w: 180, h: 46, on: 0 },
  { x: 310, y: 290, w: 280, h: 46, on: 0.42 },
  { x: 680, y: 290, w: 200, h: 46, on: 0.66 },
];

// [desde, hasta, progreso en que empieza a dibujarse]
const EDGES = [
  [3, 2, 0.05],
  [0, 2, 0.12],
  [1, 2, 0.2],
  [2, 4, 0.38],
  [3, 4, 0.5],
  [2, 5, 0.62],
];

function edgePath(a, b) {
  const A = NODES[a];
  const B = NODES[b];
  const ax = A.x + A.w / 2;
  const bx = B.x + B.w / 2;
  if (A.y === B.y) {
    const y = A.y + A.h / 2;
    return `M${A.x + A.w} ${y} L${B.x} ${y}`;
  }
  const down = A.y < B.y;
  const y1 = down ? A.y + A.h : A.y;
  const y2 = down ? B.y : B.y + B.h;
  const my = (y1 + y2) / 2;
  return `M${ax} ${y1} C${ax} ${my}, ${bx} ${my}, ${bx} ${y2}`;
}

export default function FlowDiagram() {
  const { lang } = useLanguage();
  const copy = effectsCopy(lang).flow;
  const sectionRef = useRef(null);
  const progress = useStickyProgress(sectionRef);
  const reduced = useReducedMotion();

  const started = progress > 0.01;
  const nodesOn = NODES.map((n) => started && progress >= n.on);
  const connected = nodesOn.filter(Boolean).length;
  const stepIndex = progress < 0.18 ? 0 : progress < 0.38 ? 1 : progress < 0.62 ? 2 : 3;

  return (
    <section ref={sectionRef} className="relative h-[420vh] border-t border-border">
      <div className="sticky top-0 h-screen pt-16 flex flex-col justify-center overflow-hidden">
        <div className="max-w-6xl w-full mx-auto px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <span className="status-chip mb-4">{copy.eyebrow}</span>
              <h2 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight max-w-2xl">
                {copy.title}
              </h2>
            </div>
            <div className="font-mono text-sm text-muted">
              {copy.meter}{" "}
              <span className="text-primary text-2xl font-semibold">{connected}</span>/{NODES.length}
            </div>
          </div>

          <div className="w-full max-h-[40vh] sm:max-h-[52vh] aspect-[900/360] mx-auto">
            <svg viewBox="0 0 900 360" className="w-full h-full overflow-visible" role="img" aria-label={copy.ariaLabel}>
              {EDGES.map(([a, b, start], i) => {
                const d = edgePath(a, b);
                const lp = Math.min(1, Math.max(0, (progress - start) / 0.16));
                return (
                  <g key={i}>
                    <path d={d} className="flow-edge-bg" />
                    <path
                      d={d}
                      pathLength="1"
                      className="flow-edge"
                      style={{ strokeDasharray: 1, strokeDashoffset: 1 - lp }}
                    />
                    {lp >= 1 && !reduced && (
                      <circle r="5" className="flow-packet">
                        <animateMotion dur="1.6s" begin={`${(i * 0.27).toFixed(2)}s`} repeatCount="indefinite" path={d} />
                      </circle>
                    )}
                  </g>
                );
              })}
              {NODES.map((n, i) => (
                <g key={i} className={"flow-node" + (n.hub ? " hub" : "") + (nodesOn[i] ? " on" : "")}>
                  <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="6" />
                  <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 5} textAnchor="middle">
                    {copy.nodes[i]}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="h-[3px] bg-border rounded mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-primary"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            {copy.steps.map((step, i) => (
              <div key={i} className={"flow-step card" + (started && i <= stepIndex ? " on" : "")}>
                <b>{step.tag}</b>
                {step.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
