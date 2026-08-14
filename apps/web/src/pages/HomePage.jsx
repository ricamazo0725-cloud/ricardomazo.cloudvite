import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { getAllSections } from "@/api/content";
import { getServices } from "@/api/services";
import { getExperience } from "@/api/experience";

export default function HomePage() {
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
          No se pudo cargar el contenido: {error}
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
    </Layout>
  );
}
