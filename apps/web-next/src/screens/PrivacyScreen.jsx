"use client";

// Política de privacidad y tratamiento de datos personales (Ley 1581 de 2012
// y Decreto 1377 de 2013, Colombia). Texto estático, no viene de Supabase:
// es un documento legal y cambiarlo debe quedar en el historial de git.
// Meta la revisa al conectar el número de WhatsApp a la API (coexistencia).
import Link from "next/link";
import Layout from "@/components/Layout";
import { useLanguage } from "@/hooks/useLanguage";

const CONTACT_EMAIL = "ricardo@ricardomazo.cloud";
const WHATSAPP = "+57 310 700 8875";
const LAST_UPDATED = { es: "25 de septiembre de 2026", en: "September 25, 2026" };

const CONTENT = {
  es: {
    eyebrow: "Legal",
    title: "Política de privacidad y tratamiento de datos personales",
    updated: "Última actualización",
    sections: [
      {
        h: "1. Responsable del tratamiento",
        p: [
          "Ricardo Mazo Velásquez, persona natural, con domicilio en Medellín, Colombia (en adelante, \"el Responsable\").",
          `Correo: ${CONTACT_EMAIL} · WhatsApp: ${WHATSAPP} · Sitio web: ricardomazo.cloud`,
        ],
      },
      {
        h: "2. Datos que recolectamos",
        p: ["Solo recolectamos los datos que usted nos entrega voluntariamente o que se generan al usar este sitio:"],
        list: [
          "Datos de contacto: nombre, número de teléfono / WhatsApp, correo electrónico y empresa.",
          "Contenido de las conversaciones que usted inicia por WhatsApp, correo o formularios (consultas, requerimientos del proyecto, archivos que comparta).",
          "Datos de navegación anónimos o seudonimizados (páginas visitadas, dispositivo, país aproximado) mediante Google Analytics.",
        ],
      },
      {
        h: "3. Finalidades",
        list: [
          "Responder sus consultas y enviarle la información o cotizaciones que solicite.",
          "Prestar los servicios contratados (automatización, desarrollo web, integraciones, CRM) y hacer su seguimiento.",
          "Registrar el historial de la relación comercial en un CRM propio para darle una atención ordenada.",
          "Enviarle recordatorios o información relacionada con su solicitud o servicio. Solo le enviaremos mensajes promocionales si usted lo autoriza.",
          "Medir y mejorar el funcionamiento de este sitio web.",
        ],
      },
      {
        h: "4. Uso de WhatsApp",
        p: [
          "Atendemos por WhatsApp Business. Algunos mensajes pueden ser respondidos de forma automática (asistente o bot) y una persona puede intervenir en cualquier momento. Para esto usamos la plataforma oficial de WhatsApp Business de Meta a través de un proveedor autorizado, y las conversaciones se guardan en nuestro CRM.",
          "Al escribirnos por WhatsApp usted autoriza el tratamiento de sus datos para las finalidades de esta política. Si no desea recibir más mensajes, escriba \"BAJA\" en el chat o solicítelo al correo indicado y dejaremos de contactarle.",
        ],
      },
      {
        h: "5. Con quién compartimos sus datos",
        p: [
          "No vendemos ni alquilamos sus datos. Solo los comparten con nosotros, como encargados del tratamiento y bajo sus propias políticas de seguridad, los proveedores tecnológicos necesarios para operar:",
        ],
        list: [
          "Meta Platforms (WhatsApp) y el proveedor de mensajería autorizado por Meta.",
          "Supabase (base de datos del CRM) y Hostinger (alojamiento web y servidores).",
          "Google (Google Analytics y correo).",
        ],
        after:
          "Algunos de estos proveedores almacenan información fuera de Colombia. Al aceptar esta política, usted autoriza esa transferencia o transmisión internacional, que se hace con proveedores que ofrecen niveles adecuados de protección.",
      },
      {
        h: "6. Sus derechos",
        p: ["Como titular de los datos, usted puede en cualquier momento:"],
        list: [
          "Conocer, actualizar y rectificar sus datos personales.",
          "Solicitar prueba de la autorización que nos otorgó.",
          "Ser informado sobre el uso que le hemos dado a sus datos.",
          "Revocar la autorización y/o pedir la supresión de sus datos, cuando no exista un deber legal o contractual de conservarlos.",
          "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.",
          "Acceder de forma gratuita a sus datos personales.",
        ],
      },
      {
        h: "7. Cómo ejercer sus derechos",
        p: [
          `Envíe su solicitud a ${CONTACT_EMAIL} (o por WhatsApp al ${WHATSAPP}) indicando su nombre, el número o correo con el que nos contactó y lo que solicita.`,
          "Las consultas se responden en un máximo de diez (10) días hábiles y los reclamos en un máximo de quince (15) días hábiles, según los plazos de la Ley 1581 de 2012.",
        ],
      },
      {
        h: "8. Conservación y seguridad",
        p: [
          "Conservamos sus datos mientras exista la relación comercial o sea necesario para las finalidades descritas y para cumplir obligaciones legales, contables o tributarias. Aplicamos medidas técnicas razonables (acceso restringido, cifrado en tránsito, copias de seguridad) para proteger su información.",
        ],
      },
      {
        h: "9. Cambios a esta política",
        p: [
          "Podemos actualizar esta política. Publicaremos cualquier cambio en esta misma página con su fecha de actualización. Esta política rige desde la fecha indicada arriba.",
        ],
      },
    ],
  },
  en: {
    eyebrow: "Legal",
    title: "Privacy and personal data policy",
    updated: "Last updated",
    sections: [
      {
        h: "1. Data controller",
        p: [
          "Ricardo Mazo Velásquez, an individual based in Medellín, Colombia (the \"Controller\").",
          `Email: ${CONTACT_EMAIL} · WhatsApp: ${WHATSAPP} · Website: ricardomazo.cloud`,
        ],
      },
      {
        h: "2. Data we collect",
        p: ["We only collect data you voluntarily provide or that is generated when you use this site:"],
        list: [
          "Contact details: name, phone / WhatsApp number, email and company.",
          "The content of conversations you start via WhatsApp, email or forms (questions, project requirements, files you share).",
          "Anonymous or pseudonymous browsing data (pages visited, device, approximate country) through Google Analytics.",
        ],
      },
      {
        h: "3. Purposes",
        list: [
          "Answering your questions and sending the information or quotes you request.",
          "Delivering contracted services (automation, web development, integrations, CRM) and following up on them.",
          "Keeping a record of our business relationship in our own CRM.",
          "Sending reminders or information related to your request or service. We only send promotional messages if you agree to them.",
          "Measuring and improving this website.",
        ],
      },
      {
        h: "4. Use of WhatsApp",
        p: [
          "We handle conversations through WhatsApp Business. Some messages may be answered automatically (assistant or bot) and a person can step in at any time. We use Meta's official WhatsApp Business Platform through an authorized provider, and conversations are stored in our CRM.",
          "By messaging us on WhatsApp you authorize the processing of your data for the purposes in this policy. To stop receiving messages, reply \"STOP\" in the chat or email us and we will no longer contact you.",
        ],
      },
      {
        h: "5. Who we share your data with",
        p: [
          "We do not sell or rent your data. It is only shared, as data processors bound by their own security policies, with the technology providers we need to operate:",
        ],
        list: [
          "Meta Platforms (WhatsApp) and the Meta-authorized messaging provider.",
          "Supabase (CRM database) and Hostinger (web hosting and servers).",
          "Google (Google Analytics and email).",
        ],
        after:
          "Some of these providers store information outside Colombia. By accepting this policy you authorize that international transfer, which is made with providers offering adequate levels of protection.",
      },
      {
        h: "6. Your rights",
        p: ["As the data subject, you may at any time:"],
        list: [
          "Access, update and correct your personal data.",
          "Request proof of the authorization you gave us.",
          "Be informed about how your data has been used.",
          "Revoke your authorization and/or request deletion of your data, unless there is a legal or contractual duty to keep it.",
          "File complaints with Colombia's Superintendence of Industry and Commerce (SIC).",
          "Access your personal data free of charge.",
        ],
      },
      {
        h: "7. How to exercise your rights",
        p: [
          `Send your request to ${CONTACT_EMAIL} (or via WhatsApp at ${WHATSAPP}) with your name, the number or email you contacted us from, and what you are requesting.`,
          "Inquiries are answered within ten (10) business days and claims within fifteen (15) business days, as set by Colombian Law 1581 of 2012.",
        ],
      },
      {
        h: "8. Retention and security",
        p: [
          "We keep your data while our business relationship lasts or as needed for the purposes above and to meet legal, accounting or tax obligations. We apply reasonable technical measures (restricted access, encryption in transit, backups) to protect it.",
        ],
      },
      {
        h: "9. Changes to this policy",
        p: [
          "We may update this policy. Any change will be published on this page with its update date. This policy is effective from the date shown above.",
        ],
      },
    ],
  },
};

export default function PrivacyScreen() {
  const { t, lang } = useLanguage();
  const basePrefix = lang === "en" ? "/en" : "";
  const c = CONTENT[lang] ?? CONTENT.es;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-4">
        <Link
          href={basePrefix || "/"}
          className="font-mono text-xs uppercase tracking-wider text-muted hover:text-foreground"
        >
          {t("nav.backHome")}
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <span className="status-chip mb-6">{c.eyebrow}</span>
        <h1 className="font-display font-semibold text-3xl sm:text-4xl tracking-tight mb-3">{c.title}</h1>
        <p className="font-mono text-xs uppercase tracking-wider text-muted mb-12">
          {c.updated}: {LAST_UPDATED[lang] ?? LAST_UPDATED.es}
        </p>

        <div className="space-y-10">
          {c.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display font-semibold text-xl mb-3">{s.h}</h2>
              {s.p?.map((para) => (
                <p key={para} className="text-muted leading-relaxed mb-3">
                  {para}
                </p>
              ))}
              {s.list && (
                <ul className="list-disc pl-5 space-y-2 text-muted leading-relaxed mb-3">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
              {s.after && <p className="text-muted leading-relaxed">{s.after}</p>}
            </section>
          ))}
        </div>
      </article>
    </Layout>
  );
}
