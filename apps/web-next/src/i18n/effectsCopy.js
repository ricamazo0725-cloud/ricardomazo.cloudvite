// Textos de las secciones animadas del home (flujo, chat CRM, diagnóstico,
// terminal del blog...). Van aparte de translations.js porque son listas y
// guiones largos, no etiquetas sueltas. Igual que allá: agrega aquí el
// idioma nuevo con las mismas claves.
export const EFFECTS_COPY = {
  es: {
    marquee: [
      "Web JS Vanilla",
      "App React",
      "Supabase + n8n",
      "WhatsApp Cloud API",
      "CRM · Embudo de ventas",
      "Marketing digital",
      "Agentes de IA",
      "Shopify + ERP",
      "Google Maps API",
      "AWS / Ubuntu",
    ],
    flow: {
      eyebrow: "Flujo de integración",
      title: "Un mensaje entra. El sistema hace el resto.",
      meter: "Sistemas conectados",
      nodes: [
        "WEB JS VANILLA",
        "APP REACT",
        "SUPABASE + N8N",
        "WHATSAPP",
        "CRM · EMBUDO DE VENTAS",
        "MARKETING DIGITAL",
      ],
      ariaLabel:
        "Diagrama de flujo: un sitio web en JS vanilla y una app en React alimentan una capa de automatización con Supabase y n8n, que conecta WhatsApp con un CRM de embudo de ventas y con marketing digital",
      steps: [
        { tag: "01 · CAPTURA", text: "El cliente escribe desde la web, la app o WhatsApp." },
        { tag: "02 · ORQUESTA", text: "Supabase + n8n reciben, limpian y deciden." },
        { tag: "03 · CONVIERTE", text: "El lead cae en el CRM y avanza en el embudo." },
        { tag: "04 · NUTRE", text: "Marketing digital y contenido que se escribe solo." },
      ],
    },
    crm: {
      eyebrow: "WhatsApp + CRM",
      title: "Las conversaciones de WhatsApp alimentan tu embudo de ventas.",
      lead: "Un CRM propio, sin depender de plataformas cerradas. Mira cómo se llena la ficha mientras el cliente escribe.",
      business: "Tu negocio",
      online: "en línea",
      botTag: "🤖 agente IA · n8n",
      card: "Ficha CRM",
      syncing: "sincronizando",
      fields: { name: "Nombre", channel: "Canal", interest: "Interés", city: "Ciudad", next: "Siguiente acción" },
      funnel: ["CONTACTO", "INTERÉS", "PROPUESTA", "CIERRE"],
      replay: "↻ repetir conversación",
      example: "Conversación de ejemplo",
      convo: [
        { who: "in", text: "Hola, vi su página. ¿Hacen domicilios en Envigado?", fill: { channel: "WhatsApp", city: "Envigado" }, stage: 0 },
        { who: "bot", text: "¡Hola! Sí 🙌 ¿Con quién tengo el gusto?" },
        { who: "in", text: "Laura Gómez", fill: { name: "Laura Gómez" }, stage: 1 },
        { who: "bot", text: "Gracias, Laura. ¿Qué te interesa: café en grano o molido?" },
        { who: "in", text: "En grano, 2 libras para la oficina", fill: { interest: "Café en grano · 2 lb" }, stage: 2 },
        { who: "bot", text: "Listo. Te envío el link de pago y la ruta de entrega llega a tu correo ✅", fill: { next: "Enviar link de pago" }, stage: 3 },
      ],
    },
    terminal: {
      title: "n8n · flujo diario · blog",
      lines: [
        ["mu", "$ n8n run flujo-blog-diario"],
        ["ok", "✓ Cron 06:00 America/Bogota disparado"],
        ["", "→ GET api.nasa.gov/planetary/apod", 0],
        ["ok", "✓ Imagen del día recibida"],
        ["", "→ Agente IA redactando post (es / en)…", 1],
        ["ok", "✓ Título, resumen y SEO generados"],
        ["", "→ Subiendo imagen a Supabase · blog-images", 2],
        ["ok", "✓ Post publicado en ricardomazo.cloud/blog"],
        ["am", "↻ Próxima ejecución: mañana 06:00", 3],
      ],
    },
    quiz: {
      eyebrow: "Diagnóstico rápido",
      title: "¿Qué deberías automatizar primero?",
      lead: "Tres preguntas y te digo por dónde empezaría. Al final, el mensaje de WhatsApp ya va escrito.",
      counter: (i, n) => `PREGUNTA ${i} DE ${n}`,
      resultTag: "TE RECOMIENDO EMPEZAR POR",
      send: "Enviar por WhatsApp",
      again: "Repetir",
      questions: [
        {
          q: "¿Dónde se te va más tiempo hoy?",
          options: [
            ["Respondiendo WhatsApp uno por uno", "wa"],
            ["Publicando contenido y redes", "content"],
            ["Pedidos, domicilios y rutas a mano", "app"],
          ],
        },
        {
          q: "¿Cómo guardas hoy a tus clientes?",
          options: [
            ["En el celular o en chats", "wa"],
            ["En Excel o en varias herramientas", "wa"],
            ["En una tienda online (ej. Shopify)", "app"],
          ],
        },
        {
          q: "¿Qué te gustaría que pasara solo?",
          options: [
            ["Que cada mensaje se vuelva un lead en el CRM", "wa"],
            ["Que el blog y las redes se publiquen solos", "content"],
            ["Que el pedido calcule la ruta y avise por correo", "app"],
          ],
        },
      ],
      results: {
        wa: {
          name: "WhatsApp + CRM",
          text: "Conecto las conversaciones de WhatsApp a un CRM propio que alimenta tu embudo de ventas, sin depender de plataformas cerradas.",
          message: "Hola Ricardo, hice el diagnóstico en tu página y me salió WhatsApp + CRM. Quiero que mis conversaciones de WhatsApp alimenten un embudo de ventas.",
        },
        content: {
          name: "Contenido que se escribe solo",
          text: "Diseño un sistema que genera y publica contenido automáticamente, como el blog de este sitio.",
          message: "Hola Ricardo, hice el diagnóstico en tu página y me salió Contenido que se escribe solo. Quiero automatizar mi blog y redes.",
        },
        app: {
          name: "Apps web a medida (React)",
          text: "Checkout con geolocalización, rutas de entrega optimizadas con Google Maps API y envío automático de la ruta por correo.",
          message: "Hola Ricardo, hice el diagnóstico en tu página y me salió una app web a medida. Quiero automatizar pedidos y rutas de entrega.",
        },
      },
    },
    contact: {
      cta: "Escríbeme por WhatsApp →",
      open: "En horario, respondo hoy",
      closed: "Fuera de horario, respondo mañana temprano",
    },
    bubble: "¿Automatizamos tu WhatsApp? Escríbeme 👋",
  },
  en: {
    marquee: [
      "Vanilla JS Web",
      "React App",
      "Supabase + n8n",
      "WhatsApp Cloud API",
      "CRM · Sales funnel",
      "Digital marketing",
      "AI agents",
      "Shopify + ERP",
      "Google Maps API",
      "AWS / Ubuntu",
    ],
    flow: {
      eyebrow: "Integration flow",
      title: "A message comes in. The system does the rest.",
      meter: "Systems connected",
      nodes: [
        "VANILLA JS WEB",
        "REACT APP",
        "SUPABASE + N8N",
        "WHATSAPP",
        "CRM · SALES FUNNEL",
        "DIGITAL MARKETING",
      ],
      ariaLabel:
        "Flow diagram: a vanilla JS website and a React app feed an automation layer built with Supabase and n8n, which connects WhatsApp to a sales-funnel CRM and to digital marketing",
      steps: [
        { tag: "01 · CAPTURE", text: "The customer writes from the website, the app or WhatsApp." },
        { tag: "02 · ORCHESTRATE", text: "Supabase + n8n receive, clean and decide." },
        { tag: "03 · CONVERT", text: "The lead lands in the CRM and moves down the funnel." },
        { tag: "04 · NURTURE", text: "Digital marketing and content that writes itself." },
      ],
    },
    crm: {
      eyebrow: "WhatsApp + CRM",
      title: "Your WhatsApp conversations feed your sales funnel.",
      lead: "Your own CRM, without depending on closed platforms. Watch the record fill in while the customer types.",
      business: "Your business",
      online: "online",
      botTag: "🤖 AI agent · n8n",
      card: "CRM record",
      syncing: "syncing",
      fields: { name: "Name", channel: "Channel", interest: "Interest", city: "City", next: "Next action" },
      funnel: ["CONTACT", "INTEREST", "PROPOSAL", "CLOSE"],
      replay: "↻ replay conversation",
      example: "Sample conversation",
      convo: [
        { who: "in", text: "Hi, I saw your website. Do you deliver to Envigado?", fill: { channel: "WhatsApp", city: "Envigado" }, stage: 0 },
        { who: "bot", text: "Hi! Yes 🙌 Who am I talking to?" },
        { who: "in", text: "Laura Gómez", fill: { name: "Laura Gómez" }, stage: 1 },
        { who: "bot", text: "Thanks, Laura. What are you after: whole bean or ground coffee?" },
        { who: "in", text: "Whole bean, 2 pounds for the office", fill: { interest: "Whole bean · 2 lb" }, stage: 2 },
        { who: "bot", text: "Done. I'm sending the payment link, and the delivery route will arrive in your inbox ✅", fill: { next: "Send payment link" }, stage: 3 },
      ],
    },
    terminal: {
      title: "n8n · daily flow · blog",
      lines: [
        ["mu", "$ n8n run daily-blog-flow"],
        ["ok", "✓ Cron 06:00 America/Bogota fired"],
        ["", "→ GET api.nasa.gov/planetary/apod", 0],
        ["ok", "✓ Picture of the day received"],
        ["", "→ AI agent writing the post (es / en)…", 1],
        ["ok", "✓ Title, summary and SEO generated"],
        ["", "→ Uploading image to Supabase · blog-images", 2],
        ["ok", "✓ Post published at ricardomazo.cloud/blog"],
        ["am", "↻ Next run: tomorrow 06:00", 3],
      ],
    },
    quiz: {
      eyebrow: "Quick check",
      title: "What should you automate first?",
      lead: "Three questions and I'll tell you where I'd start. At the end, the WhatsApp message is already written.",
      counter: (i, n) => `QUESTION ${i} OF ${n}`,
      resultTag: "I'D START WITH",
      send: "Send on WhatsApp",
      again: "Start over",
      questions: [
        {
          q: "Where does most of your time go today?",
          options: [
            ["Answering WhatsApp one by one", "wa"],
            ["Publishing content and social posts", "content"],
            ["Orders, deliveries and routes by hand", "app"],
          ],
        },
        {
          q: "Where do you keep your customers today?",
          options: [
            ["On my phone or in chats", "wa"],
            ["In Excel or several tools", "wa"],
            ["In an online store (e.g. Shopify)", "app"],
          ],
        },
        {
          q: "What would you like to happen on its own?",
          options: [
            ["Every message becomes a lead in the CRM", "wa"],
            ["The blog and social posts publish themselves", "content"],
            ["Each order plans its route and emails it", "app"],
          ],
        },
      ],
      results: {
        wa: {
          name: "WhatsApp + CRM",
          text: "I connect your WhatsApp conversations to your own CRM that feeds your sales funnel, without depending on closed platforms.",
          message: "Hi Ricardo, I took the quick check on your site and got WhatsApp + CRM. I'd like my WhatsApp conversations to feed a sales funnel.",
        },
        content: {
          name: "Content that writes itself",
          text: "I design a system that generates and publishes content automatically, like this site's blog.",
          message: "Hi Ricardo, I took the quick check on your site and got Content that writes itself. I'd like to automate my blog and social posts.",
        },
        app: {
          name: "Custom web apps (React)",
          text: "Checkout with geolocation, delivery routes optimized with the Google Maps API, and the route emailed automatically.",
          message: "Hi Ricardo, I took the quick check on your site and got a custom web app. I'd like to automate orders and delivery routes.",
        },
      },
    },
    contact: {
      cta: "Message me on WhatsApp →",
      open: "Working hours, I'll reply today",
      closed: "Outside working hours, I'll reply first thing tomorrow",
    },
    bubble: "Shall we automate your WhatsApp? Message me 👋",
  },
};

export function effectsCopy(lang) {
  return EFFECTS_COPY[lang] || EFFECTS_COPY.es;
}

export function whatsappLink(number, message) {
  if (!number) return null;
  const digits = String(number).replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
