import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getAllSections } from "@/api/content";
import { getServices } from "@/api/services";
import { getExperience } from "@/api/experience";
import { useLanguage } from "@/hooks/useLanguage";
import Blog from "@/components/Blog";

export default function HomePage() {
  const { t } = useLanguage();
  const [sections, setSections] = useState(null);
  const [services, setServices] = useState([]);
  const [experience, setExperience] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllSections(), getServices(), getExperience()])
      .then(([sectionsData, servicesData, experienceData]) => {
        setSections(sectionsData);
        setServices(servicesData);
        setExperience(experienceData);
      })
      .catch((err) => setError(err.message));
  }, []);

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
      <Blog />
      <Services items={services} />
      <Experience items={experience} />
      <Contact data={sections?.contact} />
      <WhatsAppButton data={sections?.contact} />
    </Layout>
  );
}
