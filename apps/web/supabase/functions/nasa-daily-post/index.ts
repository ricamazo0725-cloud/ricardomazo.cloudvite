import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ApodItem, fetchFeed, findArticleImage } from "./apod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Bucket público donde se guarda una copia de cada imagen de la NASA, para
// que el blog no dependa de que los servidores de la NASA estén arriba ni
// de que conserven sus URLs (ver migration_blog_images.sql).
const BUCKET = "blog-images";

// Título que dejó la API vieja de la NASA cuando empezó a fallar: esos
// posts tienen también el texto y la imagen equivocados.
const BROKEN_TITLE = "NASA Science";

type Post = { id: string; slug: string; title: { es?: string } | null; cover_image: string | null };

const isStored = (url: string | null) => Boolean(url?.startsWith(`${SUPABASE_URL}/storage/`));

// Descarga la imagen y la sube a Supabase Storage. Devuelve la URL pública
// de la copia, o null si no se pudo descargar.
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

function postFields(item: ApodItem) {
  return {
    title: { es: item.title, en: item.title },
    excerpt: {
      es: item.explanation.slice(0, 180) + "...",
      en: item.explanation.slice(0, 180) + "...",
    },
    content: { es: item.explanation, en: item.explanation },
    source_url: item.link,
  };
}

// Corre a diario desde pg_cron: publica la imagen del día y repara los
// posts recientes cuya imagen todavía no está copiada en Storage. Con
// ?backfill=1 (mismo header Authorization que usa el cron) repara también
// los posts más antiguos que ya no salen en el feed.
Deno.serve(async (req) => {
  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
  const includeOlder = new URL(req.url).searchParams.get("backfill") === "1";

  // Crea el bucket si todavía no existe (equivale a correr
  // migration_blog_images.sql); si ya existe, el error se ignora.
  await supabase.storage.createBucket(BUCKET, { public: true });

  let feed: ApodItem[];
  try {
    feed = await fetchFeed();
  } catch (error) {
    return new Response(`Error al consultar NASA APOD: ${(error as Error).message}`, { status: 502 });
  }
  if (feed.length === 0) {
    return new Response("El feed de NASA APOD llegó vacío", { status: 502 });
  }

  const { data, error: readError } = await supabase
    .from("blog_posts")
    .select("id, slug, title, cover_image")
    .eq("source", "NASA APOD");
  if (readError) {
    return new Response(`Error al leer posts: ${readError.message}`, { status: 500 });
  }
  const posts = new Map((data as Post[]).map((post) => [post.slug, post]));

  const result = { created: null as string | null, repaired: [] as string[], failed: [] as string[] };

  // Post del día (el feed viene ordenado del más nuevo al más viejo).
  const today = feed[0];
  const todaySlug = `apod-${today.date}`;
  if (!posts.has(todaySlug)) {
    const coverImage = today.imageUrl && (await rehostImage(supabase, today.imageUrl, todaySlug));
    if (!coverImage) {
      // Sin imagen descargable (por ejemplo un video): se omite, como antes.
      result.failed.push(todaySlug);
    } else {
      const { error } = await supabase.from("blog_posts").upsert(
        {
          slug: todaySlug,
          category: "ciencia",
          ...postFields(today),
          cover_image: coverImage,
          source: "NASA APOD",
          published: true,
          published_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      );
      if (error) return new Response(`Error al guardar: ${error.message}`, { status: 500 });
      result.created = todaySlug;
    }
  }

  // Reparación: posts que aún apuntan a la NASA o que quedaron con los
  // datos equivocados de la API vieja.
  const feedBySlug = new Map(feed.map((item) => [`apod-${item.date}`, item]));
  for (const post of posts.values()) {
    const broken = post.title?.es === BROKEN_TITLE;
    if (isStored(post.cover_image) && !broken) continue;

    const item = feedBySlug.get(post.slug);
    if (!item && !includeOlder) continue;

    const sourceUrl = item ? item.imageUrl : await findArticleImage(post.slug.replace("apod-", ""));
    const coverImage = sourceUrl && (await rehostImage(supabase, sourceUrl, post.slug));
    if (!coverImage) {
      result.failed.push(post.slug);
      continue;
    }

    // El título y el texto solo se pisan si eran los de la API rota: los
    // demás pueden estar traducidos a mano desde el admin.
    const { error } = await supabase
      .from("blog_posts")
      .update({ cover_image: coverImage, ...(broken && item ? postFields(item) : {}) })
      .eq("id", post.id);
    if (error) result.failed.push(post.slug);
    else result.repaired.push(post.slug);
  }

  return Response.json(result);
});
