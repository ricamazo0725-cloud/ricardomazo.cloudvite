import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const NASA_API_KEY = Deno.env.get("NASA_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Bucket público donde se guarda una copia de cada imagen de la NASA, para
// que el blog no dependa de que apod.nasa.gov esté arriba (ver
// migration_blog_images.sql).
const BUCKET = "blog-images";

// Descarga la imagen y la sube a Supabase Storage. Devuelve la URL pública
// de la copia, o null si no se pudo descargar (en ese caso el post se
// guarda con la URL original de la NASA y se puede reintentar con el modo
// backfill).
async function rehostImage(
  supabase: SupabaseClient,
  url: string,
  slug: string,
): Promise<string | null> {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") ?? "";
    if (!res.ok || !contentType.startsWith("image/")) return null;

    const ext = contentType.split("/")[1].split(";")[0].replace("jpeg", "jpg");
    const path = `nasa/${slug}.${ext}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, await res.arrayBuffer(), { contentType, upsert: true });
    if (error) return null;

    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  } catch {
    return null;
  }
}

// Re-aloja las imágenes de los posts que todavía apuntan a nasa.gov.
// Se llama una vez a mano con ?backfill=1 (mismo header Authorization que
// usa el cron).
async function backfill(supabase: SupabaseClient): Promise<Response> {
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, slug, cover_image")
    .like("cover_image", "%nasa.gov%");
  if (error) return new Response(`Error al leer posts: ${error.message}`, { status: 500 });

  const failed: string[] = [];
  let moved = 0;
  for (const post of posts ?? []) {
    const publicUrl = await rehostImage(supabase, post.cover_image, post.slug);
    if (!publicUrl) {
      failed.push(post.slug);
      continue;
    }
    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({ cover_image: publicUrl })
      .eq("id", post.id);
    if (updateError) failed.push(post.slug);
    else moved++;
  }

  return Response.json({ total: posts?.length ?? 0, moved, failed });
}

Deno.serve(async (req) => {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

  if (new URL(req.url).searchParams.get("backfill") === "1") {
    return backfill(supabase);
  }

  const nasaRes = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`);
  if (!nasaRes.ok) {
    return new Response("Error al consultar NASA APOD", { status: 502 });
  }
  const apod = await nasaRes.json();
  if (apod.media_type !== "image") {
    return new Response("El contenido del día no es una imagen, se omite", { status: 200 });
  }

  const slug = `apod-${apod.date}`;
  const coverImage = (await rehostImage(supabase, apod.url, slug)) ?? apod.url;

  const { error } = await supabase.from("blog_posts").upsert(
    {
      slug,
      category: "ciencia",
      title: { es: apod.title, en: apod.title },
      excerpt: {
        es: apod.explanation.slice(0, 180) + "...",
        en: apod.explanation.slice(0, 180) + "...",
      },
      content: { es: apod.explanation, en: apod.explanation },
      cover_image: coverImage,
      source: "NASA APOD",
      source_url: `https://apod.nasa.gov/apod/ap${apod.date.replace(/-/g, "").slice(2)}.html`,
      published: true,
      published_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );
  if (error) {
    return new Response(`Error al guardar: ${error.message}`, { status: 500 });
  }
  return new Response(`Post creado: ${slug}`, { status: 200 });
});
