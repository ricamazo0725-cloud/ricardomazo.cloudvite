// Lectura de APOD desde science.nasa.gov.
//
// En octubre de 2026 la NASA movió APOD de apod.nasa.gov a
// science.nasa.gov/apod: las URLs viejas de las imágenes dejaron de existir
// y api.nasa.gov/planetary/apod empezó a devolver el logo de la NASA en vez
// de la imagen del día. Por eso aquí se lee el feed RSS oficial del sitio
// nuevo (últimos 30 días) y, para fechas más antiguas, la página del
// artículo.

const FEED_URL = "https://science.nasa.gov/feed/apod-basic/";
const SEARCH_URL = "https://science.nasa.gov/wp-json/wp/v2/search";

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

export type ApodItem = {
  date: string; // YYYY-MM-DD
  title: string;
  explanation: string;
  imageUrl: string | null;
  link: string;
  publishedAt: string;
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function tag(xml: string, name: string): string | null {
  const match = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  if (!match) return null;
  return match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

// El feed trae la explicación en HTML, con el prefijo "Explanation:" y el
// anuncio de "Tomorrow's picture" al final; el blog guarda solo el texto.
function cleanExplanation(html: string): string {
  const text = decodeEntities(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, ""));
  return text
    .replace(/^\s*Explanation:\s*/i, "")
    .replace(/\s*Tomorrow's picture:[\s\S]*$/i, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// apod-2026-october-12-jupiter-and-the-moons -> 2026-10-12
function dateFromLink(link: string): string | null {
  const match = link.match(/\/apod-(\d{4})-([a-z]+)-(\d{1,2})-/);
  if (!match) return null;
  const month = MONTHS.indexOf(match[2]) + 1;
  if (!month) return null;
  return `${match[1]}-${String(month).padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

// Las originales llegan a pesar decenas de MB; 1280px sobra para el blog.
function resized(url: string): string {
  const parsed = new URL(decodeEntities(url));
  parsed.searchParams.set("w", "1280");
  parsed.searchParams.set("h", "1280");
  parsed.searchParams.set("fit", "clip");
  return parsed.href;
}

export async function fetchFeed(): Promise<ApodItem[]> {
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`El feed de APOD respondió ${res.status}`);
  const xml = await res.text();

  const items: ApodItem[] = [];
  for (const raw of xml.split("<item>").slice(1)) {
    const link = tag(raw, "link") ?? "";
    const date = dateFromLink(link);
    const title = tag(raw, "title");
    const explanation = tag(raw, "apod:explanation");
    if (!date || !title || !explanation) continue;

    const hdurl = tag(raw, "apod:hdurl");
    const pubDate = new Date(tag(raw, "pubDate") ?? "");
    items.push({
      date,
      title: decodeEntities(title),
      explanation: cleanExplanation(explanation),
      imageUrl: hdurl ? resized(hdurl) : null,
      link,
      publishedAt: (isNaN(pubDate.getTime()) ? new Date(date) : pubDate).toISOString(),
    });
  }
  return items;
}

// Para posts que ya no salen en el feed: busca el artículo de esa fecha en
// science.nasa.gov y devuelve su imagen principal (og:image).
export async function findArticleImage(date: string): Promise<string | null> {
  const [year, month, day] = date.split("-");
  const prefix = `apod-${year}-${MONTHS[Number(month) - 1]}-${Number(day)}-`;

  const searchRes = await fetch(`${SEARCH_URL}?search=${prefix}&per_page=10`);
  if (!searchRes.ok) return null;
  const results: { url: string }[] = await searchRes.json();
  const article = results.find((result) => result.url.includes(`/${prefix}`));
  if (!article) return null;

  const pageRes = await fetch(article.url);
  if (!pageRes.ok) return null;
  const match = (await pageRes.text()).match(/<meta property="og:image" content="([^"]+)"/);
  return match ? decodeEntities(match[1]) : null;
}
