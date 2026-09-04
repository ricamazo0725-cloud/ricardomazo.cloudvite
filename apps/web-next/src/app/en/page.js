import HomeScreen from "@/screens/HomeScreen";
import { getAllSections } from "@/api/content";
import { getServices } from "@/api/services";
import { getExperience } from "@/api/experience";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const revalidate = 60;

export const metadata = {
  title: "Ricardo Mazo | Digital Strategist & Solutions Developer",
  description:
    "Ricardo Mazo — Digital Strategy, AI Agents and Automation. A control panel from a specialist in integrating systems.",
  alternates: {
    canonical: `${siteUrl}/en`,
    languages: { es: siteUrl, en: `${siteUrl}/en`, "x-default": siteUrl },
  },
  openGraph: {
    type: "website",
    siteName: "Ricardo Mazo",
    title: "Ricardo Mazo | Digital Strategist & Solutions Developer",
    description:
      "Ricardo Mazo — Digital Strategy, AI Agents and Automation. A control panel from a specialist in integrating systems.",
    url: `${siteUrl}/en`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ricardo Mazo | Digital Strategist & Solutions Developer",
    description: "Ricardo Mazo — Digital Strategy, AI Agents and Automation.",
  },
};

// Misma pantalla y misma consulta a Supabase que app/page.js (español) --
// el LanguageProvider de app/en/layout.js es lo único que hace que
// HomeScreen renderice en inglés. Ver ese archivo para el porqué.
export default async function Page() {
  let sections = null;
  let services = [];
  let experience = [];
  let error = null;

  try {
    [sections, services, experience] = await Promise.all([
      getAllSections(),
      getServices(),
      getExperience(),
    ]);
  } catch (err) {
    error = err.message;
  }

  return (
    <HomeScreen
      sections={sections}
      services={services}
      experience={experience}
      error={error}
    />
  );
}
