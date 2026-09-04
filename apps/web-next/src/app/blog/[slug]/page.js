import { cache } from "react";
import { notFound } from "next/navigation";
import BlogPostScreen from "@/screens/BlogPostScreen";
import { getPostBySlug } from "@/api/blog";
import { localize } from "@/i18n/localize";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ricardomazo.cloud";

// cache() dedupea la consulta a Supabase: generateMetadata y el componente
// de página piden el mismo slug en el mismo request, pero solo se ejecuta
// una vez.
const getPost = cache(async (slug) => {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
});

function pickDefault(value) {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.es ?? value.en ?? undefined;
  return undefined;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Publicación no encontrada" };
  }

  const title = pickDefault(post.title) ?? "Publicación";
  const description = pickDefault(post.excerpt) ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
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
    headline: localize(post.title, "es"),
    description: localize(post.excerpt, "es") || undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at,
    dateModified: post.published_at,
    url: `${siteUrl}/blog/${slug}`,
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: "Ricardo Mazo",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Ricardo Mazo",
      url: siteUrl,
    },
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
