import { cache } from "react";
import { notFound } from "next/navigation";
import BlogPostScreen from "@/screens/BlogPostScreen";
import { getPostBySlug } from "@/api/blog";
import { localize } from "@/i18n/localize";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

// Mismo dedupe que la versión en español (app/blog/[slug]/page.js). Nota:
// cache() de React dedupea por argumentos dentro de UN mismo request, así
// que esta instancia (definida en este archivo) es independiente de la de
// la ruta en español -- no hay colisión ni fetch compartido entre /blog/x
// y /en/blog/x, cada uno pide su propio dato una sola vez.
const getPost = cache(async (slug) => {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
});

function pickEnglish(value) {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.en ?? value.es ?? undefined;
  return undefined;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const title = pickEnglish(post.title) ?? "Post";
  const description = pickEnglish(post.excerpt) ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/en/blog/${slug}`,
      languages: {
        es: `${siteUrl}/blog/${slug}`,
        en: `${siteUrl}/en/blog/${slug}`,
        "x-default": `${siteUrl}/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.published_at,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: post.cover_image ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: localize(post.title, "en"),
    description: localize(post.excerpt, "en") || undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    url: `${siteUrl}/en/blog/${slug}`,
    mainEntityOfPage: `${siteUrl}/en/blog/${slug}`,
    author: { "@type": "Person", name: "Ricardo Mazo", url: siteUrl },
    publisher: { "@type": "Person", name: "Ricardo Mazo", url: siteUrl },
    ...(post.source ? { isBasedOn: post.source_url || undefined } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostScreen initialPost={post} />
    </>
  );
}
