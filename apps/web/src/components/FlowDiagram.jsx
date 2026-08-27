import { useLanguage } from "@/hooks/useLanguage";

const NODE_LABELS = {
  es: [
    "WEB JS VANILLA",
    "APP REACT",
    "SUPABASE + N8N",
    "WHATSAPP",
    "CRM · EMBUDO DE VENTAS",
    "MARKETING DIGITAL",
  ],
  en: [
    "VANILLA JS WEB",
    "REACT APP",
    "SUPABASE + N8N",
    "WHATSAPP",
    "CRM · SALES FUNNEL",
    "DIGITAL MARKETING",
  ],
};

const CAPTION = {
  es: "Flujo de integración de sistemas para pequeñas y medianas empresas",
  en: "Systems integration flow for small and medium businesses",
};

const ARIA_LABEL = {
  es: "Diagrama de flujo: un sitio web en JS vanilla y una app en React alimentan una capa de automatización con Supabase y n8n, que conecta WhatsApp con un CRM de embudo de ventas y con marketing digital",
  en: "Flow diagram: a vanilla JS website and a React app feed an automation layer built with Supabase and n8n, which connects WhatsApp to a sales-funnel CRM and to digital marketing",
};

const NODE_LAYOUT = [
  { x: 20, y: 20, w: 260, h: 46 },
  { x: 620, y: 20, w: 260, h: 46 },
  { x: 320, y: 140, w: 260, h: 52, highlight: true },
  { x: 20, y: 252, w: 180, h: 46 },
  { x: 310, y: 252, w: 280, h: 46 },
  { x: 680, y: 252, w: 200, h: 46 },
];

const EDGES = [
  [0, 2],
  [1, 2],
  [2, 3],
  [2, 4],
  [2, 5],
  [3, 4],
];

function nodeCenter(n) {
  return { cx: n.x + n.w / 2, cy: n.y + n.h / 2 };
}

export default function FlowDiagram() {
  const { lang } = useLanguage();
  const labels = NODE_LABELS[lang] || NODE_LABELS.es;
  const caption = CAPTION[lang] || CAPTION.es;
  const NODES = NODE_LAYOUT.map((layout, i) => ({ ...layout, label: labels[i] }));

  return (
    <div>
      <svg
        viewBox="0 0 900 320"
        className="w-full h-auto"
        role="img"
        aria-label={ARIA_LABEL[lang] || ARIA_LABEL.es}
      >
        <g stroke="hsl(var(--border))" strokeWidth="1" fill="none">
          {EDGES.map(([a, b], i) => {
            const from = nodeCenter(NODES[a]);
            const to = nodeCenter(NODES[b]);
            return (
              <path
                key={i}
                d={`M ${from.cx} ${from.cy} L ${to.cx} ${to.cy}`}
                className="flow-dash"
                stroke="hsl(var(--accent) / 0.7)"
              />
            );
          })}
        </g>

        {NODES.map((n, i) => {
          const { cx, cy } = nodeCenter(n);
          return (
            <g key={i}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx="6"
                fill="hsl(var(--surface))"
                stroke={n.highlight ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={n.highlight ? 1.5 : 1}
              />
              <text
                x={cx}
                y={cy + 3.5}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="11"
                letterSpacing="0.05em"
                fill={n.highlight ? "hsl(var(--primary))" : "hsl(var(--muted))"}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-muted">
        {caption}
      </p>
    </div>
  );
}
