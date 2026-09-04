import BlogScreen from "@/screens/BlogScreen";
import { getPublishedPostsFull } from "@/api/blog";
import { localize } from "@/i18n/localize";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

export const metadata = {
  title: "Blog",
  description:
    "Notes and automated posts about digital strategy, AI and automation — including the science section fed daily by NASA's API.",
  alternates: {
    canonical: `${siteUrl}/en/blog`,
    languages: {
      es: `${siteUrl}/blog`,
      en: `${siteUrl}/en/blog`,
      "x-default": `${siteUrl}/blog`,
    },
  },
};

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
    url: `${siteUrl}/en/blog`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/en/blog/${post.slug}`,
        name: localize(post.title, "en"),
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
