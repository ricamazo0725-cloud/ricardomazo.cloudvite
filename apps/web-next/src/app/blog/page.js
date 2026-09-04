import BlogScreen from "@/screens/BlogScreen";
import { getPublishedPostsFull } from "@/api/blog";
import { localize } from "@/i18n/localize";

export const revalidate = 60;

export const metadata = {
  title: "Blog",
  description:
    "Notas y publicaciones automáticas sobre estrategia digital, IA y automatización — incluyendo la sección de ciencia alimentada a diario por la API de la NASA.",
  alternates: { canonical: "/blog" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export default async function Page() {
  let posts = [];
  try {
    posts = await getPublishedPostsFull();
  } catch {
    posts = [];
  }

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog",
    url: `${siteUrl}/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: localize(post.title, "es"),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <BlogScreen initialPosts={posts} />
    </>
  );
}
