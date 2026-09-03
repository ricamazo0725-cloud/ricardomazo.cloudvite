"use client";

import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * A diferencia del HomePage.jsx original (Vite), los datos ya vienen
 * resueltos desde el servidor (app/page.js hace el fetch a Supabase antes
 * de renderizar) -- así el HTML inicial ya trae el contenido real para
 * buscadores y redes sociales, en vez de un <div id="root"> vacío.
 */
export default function HomeScreen({ sections, services, experience, error }) {
  const { t } = useLanguage();

  if (error) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-6 py-24 font-mono text-sm text-muted">
          {t("homePage.loadError")} {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Hero data={sections?.hero} />
      <About data={sections?.about} />

      <Services items={services} />
      <Experience items={experience} />
      <Contact data={sections?.contact} />
      <WhatsAppButton data={sections?.contact} />
    </Layout>
  );
}
