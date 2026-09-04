import { supabase } from "@/lib/supabaseClient";

export async function getPublishedPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}

export async function getPublishedPostsFull(category) {
  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (category && category !== "todas") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
