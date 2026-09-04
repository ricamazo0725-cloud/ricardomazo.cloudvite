import ProjectsScreen from "@/screens/ProjectsScreen";
import { getProjects } from "@/api/projects";

export const revalidate = 60;

export const metadata = {
  title: "Proyectos",
  description: "Proyectos y ejemplos de landing pages, integraciones y automatizaciones construidas por Ricardo Mazo.",
  alternates: { canonical: "/proyectos" },
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
