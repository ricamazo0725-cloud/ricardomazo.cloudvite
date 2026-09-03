import BlogScreen from "@/screens/BlogScreen";

export const metadata = {
  title: "Blog",
  description:
    "Notas y publicaciones automáticas sobre estrategia digital, IA y automatización — incluyendo la sección de ciencia alimentada a diario por la API de la NASA.",
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return <BlogScreen />;
}
