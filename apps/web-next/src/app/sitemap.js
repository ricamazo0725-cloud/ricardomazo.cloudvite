import { getPublishedPosts } from "@/api/blog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

// Generado desde las rutas reales de app/ + los posts reales publicados en
// Supabase -- nunca a mano, así nunca queda desincronizado del código ni del
// contenido real (a diferencia de un sitemap.xml estático escrito aparte).
//
// Cada URL en español incluye su par en inglés (y viceversa) vía
// `alternates.languages`, que Next.js traduce a las anotaciones
// <xhtml:link rel="alternate" hreflang="..."> del sitemap -- el mismo dato
// que ya declaran las etiquetas hreflang en el <head> de cada página, aquí
// además a nivel de sitemap para que Google lo vea sin tener que visitar
// cada URL primero.
export default async function sitemap() {
  const staticPaths = ["", "/blog", "/proyectos"];
  const staticRoutes = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: {
        es: `${siteUrl}${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
  }));

  const staticEnRoutes = staticPaths.map((path) => ({
    url: `${siteUrl}/en${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.7,
    alternates: {
      languages: {
        es: `${siteUrl}${path}`,
        en: `${siteUrl}/en${path}`,
      },
    },
  }));

  let postRoutes = [];
  let postEnRoutes = [];
  try {
    const posts = await getPublishedPosts();
    postRoutes = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          es: `${siteUrl}/blog/${post.slug}`,
          en: `${siteUrl}/en/blog/${post.slug}`,
        },
      },
    }));
    postEnRoutes = posts.map((post) => ({
      url: `${siteUrl}/en/blog/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          es: `${siteUrl}/blog/${post.slug}`,
          en: `${siteUrl}/en/blog/${post.slug}`,
        },
      },
    }));
  } catch {
    // Si Supabase no responde durante el build/revalidación, el sitemap
    // igual se sirve con las rutas estáticas -- nunca falla la respuesta
    // completa por un problema temporal de datos.
  }

  return [...staticRoutes, ...staticEnRoutes, ...postRoutes, ...postEnRoutes];
}
