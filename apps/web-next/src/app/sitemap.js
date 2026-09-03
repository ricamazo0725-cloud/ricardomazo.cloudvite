import { getPublishedPosts } from "@/api/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

// Generado desde las rutas reales de app/ + los posts reales publicados en
// Supabase -- nunca a mano, así nunca queda desincronizado del código ni del
// contenido real (a diferencia de un sitemap.xml estático escrito aparte).
export default async function sitemap() {
  const staticRoutes = ["", "/blog", "/proyectos"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  let postRoutes = [];
  try {
    const posts = await getPublishedPosts();
    postRoutes = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch {
    // Si Supabase no responde durante el build/revalidación, el sitemap
    // igual se sirve con las rutas estáticas -- nunca falla la respuesta
    // completa por un problema temporal de datos.
  }

  return [...staticRoutes, ...postRoutes];
}
