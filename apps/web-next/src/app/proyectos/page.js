import ProjectsScreen from "@/screens/ProjectsScreen";

export const metadata = {
  title: "Proyectos",
  description: "Proyectos y ejemplos de landing pages, integraciones y automatizaciones construidas por Ricardo Mazo.",
  alternates: { canonical: "/proyectos" },
};

export default function Page() {
  return <ProjectsScreen />;
}
