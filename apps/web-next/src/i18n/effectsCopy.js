// Textos de las secciones animadas del home (flujo, chat CRM, diagnóstico,
// terminal del blog...). Van aparte de translations.js porque son listas y
// guiones largos, no etiquetas sueltas. Igual que allá: agrega aquí el
// idioma nuevo con las mismas claves.
export const EFFECTS_COPY = {
  es: {
    marquee: [
      "Procesos automatizados",
      "Información integrada",
      "WhatsApp conectado a tus ventas",
      "Clientes en un solo lugar",
      "Embudo de ventas",
      "Agentes de IA",
      "Tienda online + inventario",
      "Pedidos y entregas sin papel",
      "Reportes al día",
      "Menos tareas manuales",
    ],
    flow: {
      eyebrow: "Flujo de integración",
      title: "Toda la información de tu negocio, conectada.",
      meter: "Sistemas conectados",
      nodes: [
        "TU SITIO WEB",
        "TU TIENDA O APP",
        "AUTOMATIZACIÓN",
        "WHATSAPP",
        "CRM · VENTAS",
        "MARKETING",
      ],
      ariaLabel:
        "Diagrama: el sitio web y la tienda del negocio alimentan una capa de automatización que conecta WhatsApp con el CRM de ventas y con el marketing",
      steps: [
        { tag: "01 · CAPTURA", text: "El cliente escribe desde la web, la app o WhatsApp." },
        { tag: "02 · AUTOMATIZA", text: "El sistema ordena la información y decide qué hacer, sin trabajo manual." },
        { tag: "03 · CONVIERTE", text: "El lead cae en el CRM y avanza en el embudo." },
        { tag: "04 · FIDELIZA", text: "Seguimiento, marketing y contenido que salen solos." },
      ],
    },
    crm: {
      eyebrow: "WhatsApp + CRM",
      title: "Las conversaciones de WhatsApp alimentan tu embudo de ventas.",
      lead: "Cada conversación queda registrada en tu sistema de clientes, sin copiar y pegar. Mira cómo se llena la ficha mientras el cliente escribe.",
      business: "Tu negocio",
      online: "en línea",
      botTag: "🤖 asistente automático",
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
      title: "Registro de la automatización · blog",
      lines: [
        ["mu", "▶ Rutina diaria del blog"],
        ["ok", "✓ 6:00 a. m. · arranca sola"],
        ["", "→ Consulta la imagen del día de la NASA", 0],
        ["ok", "✓ Imagen recibida"],
        ["", "→ Un asistente de IA redacta el post en español e inglés", 1],
        ["ok", "✓ Título, resumen y SEO listos"],
        ["", "→ Guarda la imagen en la base de datos", 2],
        ["ok", "✓ Post publicado en el blog"],
        ["am", "↻ Mañana se repite, sin que nadie intervenga", 3],
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
          name: "Pedidos y entregas automatizados",
          text: "Tu cliente compra en línea, el sistema ubica la dirección, arma la ruta de entrega y la envía por correo sin que nadie la haga a mano.",
          message: "Hola Ricardo, hice el diagnóstico en tu página y me salió Pedidos y entregas automatizados. Quiero automatizar mis pedidos y entregas.",
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
      "Automated processes",
      "Connected information",
      "WhatsApp tied to your sales",
      "All your customers in one place",
      "Sales funnel",
      "AI agents",
      "Online store + inventory",
      "Paperless orders and deliveries",
      "Up-to-date reports",
      "Fewer manual tasks",
    ],
    flow: {
      eyebrow: "Integration flow",
      title: "All your business information, connected.",
      meter: "Systems connected",
      nodes: [
        "YOUR WEBSITE",
        "YOUR STORE OR APP",
        "AUTOMATION",
        "WHATSAPP",
        "CRM · SALES",
        "MARKETING",
      ],
      ariaLabel:
        "Diagram: the business website and store feed an automation layer that connects WhatsApp to the sales CRM and to marketing",
      steps: [
        { tag: "01 · CAPTURE", text: "The customer writes from the website, the app or WhatsApp." },
        { tag: "02 · AUTOMATE", text: "The system organizes the information and decides what to do, with no manual work." },
        { tag: "03 · CONVERT", text: "The lead lands in the CRM and moves down the funnel." },
        { tag: "04 · RETAIN", text: "Follow-ups, marketing and content that go out on their own." },
      ],
    },
    crm: {
      eyebrow: "WhatsApp + CRM",
      title: "Your WhatsApp conversations feed your sales funnel.",
      lead: "Every conversation is logged in your customer system, with no copy and paste. Watch the record fill in while the customer types.",
      business: "Your business",
      online: "online",
      botTag: "🤖 automatic assistant",
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
      title: "Automation log · blog",
      lines: [
        ["mu", "▶ Daily blog routine"],
        ["ok", "✓ 6:00 a.m. · starts on its own"],
        ["", "→ Fetches NASA's picture of the day", 0],
        ["ok", "✓ Picture received"],
        ["", "→ An AI assistant writes the post in Spanish and English", 1],
        ["ok", "✓ Title, summary and SEO ready"],
        ["", "→ Saves the image to the database", 2],
        ["ok", "✓ Post published on the blog"],
        ["am", "↻ Repeats tomorrow, with no one stepping in", 3],
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
          name: "Automated orders and deliveries",
          text: "Your customer buys online, the system locates the address, plans the delivery route and emails it, with no one doing it by hand.",
          message: "Hi Ricardo, I took the quick check on your site and got Automated orders and deliveries. I'd like to automate my orders and deliveries.",
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
