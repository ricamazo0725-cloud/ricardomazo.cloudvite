const NODES = [
  { x: 30, y: 150, label: "CLIENTE" },
  { x: 230, y: 60, label: "AGENTE IA" },
  { x: 430, y: 150, label: "ERP / CRM" },
  { x: 610, y: 60, label: "WHATSAPP" },
];

const EDGES = [
  [0, 1],
  [1, 2],
  [2, 3],
  [1, 3],
];

function nodeCenter(n) {
  return { cx: n.x + 55, cy: n.y + 20 };
}

export default function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 690 220"
      className="w-full h-auto"
      role="img"
      aria-label="Diagrama de flujo: cliente conectado a un agente de IA que sincroniza ERP, CRM y WhatsApp"
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

      {NODES.map((n, i) => (
        <g key={i}>
          <rect
            x={n.x}
            y={n.y}
            width="110"
            height="40"
            rx="6"
            fill="hsl(var(--surface))"
            stroke={i === 1 ? "hsl(var(--primary))" : "hsl(var(--border))"}
            strokeWidth={i === 1 ? 1.5 : 1}
          />
          <text
            x={n.x + 55}
            y={n.y + 25}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="10"
            letterSpacing="0.05em"
            fill={i === 1 ? "hsl(var(--primary))" : "hsl(var(--muted))"}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
