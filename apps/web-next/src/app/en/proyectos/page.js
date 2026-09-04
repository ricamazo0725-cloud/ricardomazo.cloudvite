import ProjectsScreen from "@/screens/ProjectsScreen";
import { getProjects } from "@/api/projects";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const revalidate = 60;

export const metadata = {
  title: "Projects",
  description: "Projects and examples of landing pages, integrations and automations built by Ricardo Mazo.",
  alternates: {
    canonical: `${siteUrl}/en/proyectos`,
    languages: {
      es: `${siteUrl}/proyectos`,
      en: `${siteUrl}/en/proyectos`,
      "x-default": `${siteUrl}/proyectos`,
    },
  },
};

export default async function Page() {
  let items = [];
  let error = null;
  try {
    items = await getProjects();
  } catch (err) {
    error = err.message;
  }

  return <ProjectsScreen initialItems={items} initialError={error} />;
}
