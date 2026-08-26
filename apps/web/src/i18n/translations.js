// Diccionario de textos estáticos de la interfaz (no vienen de Supabase).
// Para agregar un idioma nuevo: agrega su código aquí con todas las claves.
export const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

export const translations = {
  es: {
    nav: {
      about: "Sobre mí",
      services: "Servicios",
      experience: "Experiencia",
      contact: "Contacto",
      blog: "Blog",
    },
    layout: {
      cta: "Hablemos",
      footerTagline: "Ecosistemas Digitales & Agentes de IA",
    },
    hero: {
      statusFallback: "Disponible para proyectos",
      empty: "El contenido del hero aún no está cargado. Entra al panel admin para completarlo.",
    },
    about: {
      eyebrow: "Sobre mí",
      empty: "Esta sección todavía no tiene contenido. Complétala desde el panel admin.",
    },
    services: {
      eyebrow: "Servicios",
      heading: "Soluciones a medida para transformar tus operaciones.",
      empty: "Todavía no hay servicios cargados. Agrégalos desde el panel admin.",
    },
    experience: {
      eyebrow: "Experiencia laboral",
      empty: "Todavía no hay experiencia cargada. Agrégala desde el panel admin.",
    },
    contact: {
      eyebrow: "Hablemos",
      heading: "¿Tienes un proyecto en mente o buscas automatizar tus procesos?",
      empty: "Agrega tu correo y WhatsApp desde el panel admin.",
      email: "Correo electrónico",
      whatsapp: "WhatsApp",
    },
    homePage: {
      loadError: "No se pudo cargar el contenido:",
    },
    blog: {
      eyebrow: "Blog",
      loading: "Cargando...",
      empty: "Aún no hay publicaciones.",
    },
    automation: {
      eyebrow: "Automatización en vivo",
      title: "Este blog se escribe solo",
      description:
        "No escribo estos posts a mano. Cada día, un sistema automático revisa una fuente de contenido y publica algo nuevo sin que yo intervenga. Es el mismo tipo de solución que construyo para negocios: procesos que antes tomaban tiempo manual, ahora corren solos.",
      steps: {
        connect: "Se conecta a la NASA",
        write: "Redacta el post",
        publish: "Lo publica solo",
        repeat: "Se repite cada día",
      },
    },
    admin: {
      title: "Panel admin",
      signOut: "Cerrar sesión",
      tabs: { content: "Contenido", services: "Servicios", experience: "Experiencia" },
      saved: "Guardado ✓",
      save: "Guardar",
      remove: "Quitar",
      delete: "Eliminar",
      langTab: { es: "ES", en: "EN" },
      hero: {
        title: "Hero",
        status: "Estado (eyebrow)",
        heroTitle: "Título",
        subtitle: "Subtítulo",
        primaryLabel: "Botón primario — texto",
        primaryHref: "Botón primario — enlace",
        secondaryLabel: "Botón secundario — texto",
        secondaryHref: "Botón secundario — enlace",
      },
      about: {
        title: "Sobre mí",
        paragraphs: "Párrafos (uno por línea)",
        stats: "Métricas",
        statValue: "Valor (ej. 100%)",
        statLabel: "Etiqueta",
        addStat: "+ Agregar métrica",
      },
      contact: {
        title: "Contacto",
        email: "Correo",
        whatsapp: "WhatsApp (con código de país, solo números)",
        whatsappMessage: "Mensaje predeterminado de WhatsApp",
      },
      servicesEditor: {
        newTitle: "Nuevo servicio",
        fieldTitle: "Título",
        fieldDescription: "Descripción",
        order: "Orden",
      },
      experienceEditor: {
        newTitle: "Nueva experiencia",
        role: "Cargo",
        company: "Empresa",
        period: "Periodo (ej. 2022 — Presente)",
        order: "Orden",
        description: "Descripción",
      },
    },
  },
  en: {
    nav: {
      about: "About",
      services: "Services",
      experience: "Experience",
      contact: "Contact",
      blog: "Blog",
    },
    layout: {
      cta: "Let's talk",
      footerTagline: "Digital Ecosystems & AI Agents",
    },
    hero: {
      statusFallback: "Available for projects",
      empty: "Hero content isn't loaded yet. Go to the admin panel to fill it in.",
    },
    about: {
      eyebrow: "About me",
      empty: "This section has no content yet. Fill it in from the admin panel.",
    },
    services: {
      eyebrow: "Services",
      heading: "Tailored solutions to transform your operations.",
      empty: "No services yet. Add them from the admin panel.",
    },
    experience: {
      eyebrow: "Work experience",
      empty: "No experience yet. Add it from the admin panel.",
    },
    contact: {
      eyebrow: "Let's talk",
      heading: "Have a project in mind, or looking to automate your processes?",
      empty: "Add your email and WhatsApp from the admin panel.",
      email: "Email",
      whatsapp: "WhatsApp",
    },
    homePage: {
      loadError: "Couldn't load content:",
    },
    blog: {
      eyebrow: "Blog",
      loading: "Loading...",
      empty: "No posts yet.",
    },
    automation: {
      eyebrow: "Live automation",
      title: "This blog writes itself",
      description:
        "I don't write these posts by hand. Every day, an automated system checks a content source and publishes something new without me stepping in. It's the same kind of solution I build for businesses: processes that used to take manual time now run on their own.",
      steps: {
        connect: "Connects to NASA",
        write: "Writes the post",
        publish: "Publishes on its own",
        repeat: "Repeats every day",
      },
    },
    admin: {
      title: "Admin panel",
      signOut: "Sign out",
      tabs: { content: "Content", services: "Services", experience: "Experience" },
      saved: "Saved ✓",
      save: "Save",
      remove: "Remove",
      delete: "Delete",
      langTab: { es: "ES", en: "EN" },
      hero: {
        title: "Hero",
        status: "Status (eyebrow)",
        heroTitle: "Title",
        subtitle: "Subtitle",
        primaryLabel: "Primary button — text",
        primaryHref: "Primary button — link",
        secondaryLabel: "Secondary button — text",
        secondaryHref: "Secondary button — link",
      },
      about: {
        title: "About",
        paragraphs: "Paragraphs (one per line)",
        stats: "Stats",
        statValue: "Value (e.g. 100%)",
        statLabel: "Label",
        addStat: "+ Add stat",
      },
      contact: {
        title: "Contact",
        email: "Email",
        whatsapp: "WhatsApp (country code, numbers only)",
        whatsappMessage: "Default WhatsApp message",
      },
      servicesEditor: {
        newTitle: "New service",
        fieldTitle: "Title",
        fieldDescription: "Description",
        order: "Order",
      },
      experienceEditor: {
        newTitle: "New experience",
        role: "Role",
        company: "Company",
        period: "Period (e.g. 2022 — Present)",
        order: "Order",
        description: "Description",
      },
    },
  },
};