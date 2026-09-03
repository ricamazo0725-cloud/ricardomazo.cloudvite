import BlogPostScreen from "@/screens/BlogPostScreen";
import { getPostBySlug } from "@/api/blog";

function pickDefault(value) {
  if (value == null) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.es ?? value.en ?? undefined;
  return undefined;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  let post = null;
  try {
    post = await getPostBySlug(slug);
  } catch {
    post = null;
  }

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

export default function Page() {
  return <BlogPostScreen />;
}
