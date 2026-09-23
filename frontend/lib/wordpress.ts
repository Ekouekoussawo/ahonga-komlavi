import { fallbackPosts, fallbackSermons } from "@/data/fallback";
import { BlogPost, Sermon, YouTubeVideo } from "@/types/wordpress";
import { DEFAULT_POST_IMAGE } from "@/lib/images";

export const WP_API = process.env.NEXT_PUBLIC_WP_API ?? "http://ahonga-komlavi.local/wp-json/wp/v2";
export const YOUTUBE_CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "";
export const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "";

// --- Build-time snapshot fallback ---
// When WordPress is unreachable (build-time or runtime), the pre-build
// snapshot script writes all posts to public/_generated/wp-content.json.
// This function loads that file — from the filesystem during build, or
// from the static export at runtime in the browser. It returns raw WP
// post objects (same shape as the REST API response), so the existing
// mapPostToBlogPost / mapBlogPostToSermon functions work unchanged.

const SNAPSHOT_PATH = "/_generated/wp-content.json";

export async function loadSnapshot(): Promise<any[]> {
  // Browser: fetch the baked-in static JSON file
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(SNAPSHOT_PATH, { cache: "no-store" });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  }

  // Build-time (Node): read from the file written by the pre-build script
  try {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const file = path.join(process.cwd(), "public", "_generated", "wp-content.json");
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

/** Filter a raw WP post array client-side by slug or category slug. */
function filterSnapshot(posts: any[], params?: Record<string, string | number | boolean | undefined>): any[] {
  if (!params) return posts;

  let result = posts;

  if (typeof params.slug === "string") {
    result = result.filter((p) => p.slug === params.slug);
  }

  if (typeof params.category_name === "string") {
    result = result.filter((p) =>
      p._embedded?.["wp:term"]?.[0]?.some((t: any) => t.slug === params.category_name)
    );
  }

  if (typeof params.include === "string") {
    const ids = new Set(params.include.split(",").map(Number).filter(Boolean));
    result = result.filter((p) => ids.has(p.id));
  }

  return result;
}

export async function fetchWP<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${WP_API}/${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!res.ok) {
      // 2026-09-17: ModSecurity returns 406 for all PHP on HostGator.
      // When the API is blocked, fall back to the baked-in snapshot.
      if (res.status === 406) {
        console.warn("[fetchWP] ModSecurity blocked (406), falling back to snapshot");
        const snapshot = await loadSnapshot();
        return filterSnapshot(snapshot, params);
      }
      const text = await res.text().catch(() => "");
      throw new Error(`WP fetch failed ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  } catch (error) {
    // Network failure or other error — try snapshot as final fallback
    console.warn("[fetchWP] Error, trying snapshot fallback:", error);
    const snapshot = await loadSnapshot();
    return filterSnapshot(snapshot, params);
  } finally {
    clearTimeout(timeout);
  }
}

// --- Core content ---
export async function getPosts(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("posts", { ...params, _embed: true });
}

export async function getPostBySlug(slug: string) {
  const data = await getPosts({ slug });
  return data[0] ?? null;
}

export async function getPostById(id: number | string) {
  const data = await getPosts({ include: id });
  return data[0] ?? null;
}

export async function getPages(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("pages", { ...params, _embed: true });
}

export async function getPageBySlug(slug: string) {
  const data = await getPages({ slug });
  return data[0] ?? null;
}

// --- Taxonomies ---
export async function getCategories(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("categories", { ...params });
}

export async function getTags(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("tags", { ...params });
}

export async function getCategoryBySlug(slug: string) {
  const data = await getCategories({ slug });
  return data[0] ?? null;
}

// --- Post meta ---
export async function getPostMeta(postId: number | string) {
  return fetchWP<Record<string, any>>(`meta/${postId}`);
}

// --- Media ---
export async function getMedia(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("media", { ...params });
}

export async function getMediaById(id: number | string) {
  const data = await getMedia({ include: id });
  return data[0] ?? null;
}

// --- Users/Authors ---
export async function getUsers(params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>("users", { ...params });
}

export async function getUserById(id: number | string) {
  const data = await getUsers({ include: id });
  return data[0] ?? null;
}

// --- Comments ---
export async function getComments(postId: number | string) {
  return fetchWP<any[]>("comments", { post: postId });
}

// --- Custom Post Types ---
export async function getCustomPostType(type: string, params?: Record<string, string | number | boolean | undefined>) {
  return fetchWP<any[]>(type, { ...params, _embed: true });
}

// --- Utility ---
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/** Decode HTML entities (&rsquo; &#8217; &amp; etc) so titles render correctly. */
export function decodeEntities(s: string): string {
  if (!s) return s;
  return s
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&nbsp;/g, "\u00A0")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&laquo;/g, "\u00AB")
    .replace(/&raquo;/g, "\u00BB")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

export function formatDateFr(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const isoTime = (d?: string) => { const t = d ? Date.parse(d) : NaN; return Number.isNaN(t) ? 0 : t; };
export const byRawDateDesc = (a: any, b: any) => isoTime(b?.date) - isoTime(a?.date);

export function getFeaturedImage(post: any): string {
  return post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url
    ?? post?.featured_media_url
    ?? (typeof post?.image === "string" && post.image)
    ?? DEFAULT_POST_IMAGE;
}

export function getAuthorName(post: any): string {
  return post?._embedded?.author?.[0]?.name
    ?? post?.author_name
    ?? "Évangéliste Ahongan Komlavi";
}

export function getCategoriesList(post: any): { id: number; name: string; slug: string }[] {
  return post?._embedded?.["wp:term"]?.[0] ?? [];
}

export function getTagsList(post: any): { id: number; name: string; slug: string }[] {
  return post?._embedded?.["wp:term"]?.[1] ?? [];
}

// --- Mapping ---
/**
 * Map a raw WP REST API post (or snapshot entry) to a BlogPost.
 * Expects a RAW WP post with `title.rendered`, `excerpt.rendered`, etc.
 * Do NOT pass a BlogPost here — use mapBlogPostToSermon for that.
 */
export function mapPostToBlogPost(post: any): BlogPost {
  return {
    id: String(post.id),
    title: decodeEntities(stripHtml(post.title?.rendered ?? "Sans titre")),
    excerpt: decodeEntities(stripHtml(post.excerpt?.rendered ?? "")),
    content: decodeEntities(stripHtml(post.content?.rendered ?? "")),
    image: getFeaturedImage(post),
    date: formatDateFr(post.date),
    slug: post.slug ?? String(post.id),
    author: getAuthorName(post),
    categories: getCategoriesList(post),
    tags: getTagsList(post),
    meta: post.meta ?? {},
  };
}

// --- YouTube API ---
export async function getYouTubeVideos(maxResults = 20): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_CHANNEL_ID || !YOUTUBE_API_KEY) return [];

  const url = `https://www.googleapis.com/youtube/v3/search?key=${encodeURIComponent(YOUTUBE_API_KEY)}&channelId=${encodeURIComponent(YOUTUBE_CHANNEL_ID)}&part=snippet&order=date&maxResults=${maxResults}&type=video`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();

    return data.items?.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    })) || [];
  } catch {
    return [];
  }
}

export async function getSermonsFromYouTube(): Promise<Sermon[]> {
  const videos = await getYouTubeVideos(50);

  // Filter for sermon-like videos (title contains sermon keywords)
  const sermonKeywords = ["prêche", "prédication", "message", "enseignement", "culte", "seminaire", "sermon", "preche"];
  const sermonVideos = videos.filter((video) =>
    sermonKeywords.some((kw) => video.title.toLowerCase().includes(kw))
  );

  return sermonVideos.map((video) => ({
    id: `yt-${video.videoId}`,
    title: video.title,
    excerpt: video.description.slice(0, 200) + "...",
    content: video.description,
    image: video.thumbnail,
    date: new Date(video.publishedAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    dateIso: video.publishedAt,
    slug: `sermon-${video.videoId}`,
    author: "Évangéliste Ahongan Komlavi",
    categories: [{ id: 1, name: "Prêches", slug: "preches" }],
    tags: [],
    videoId: video.videoId,
    youtubeUrl: video.url,
    series: extractSeries(video.title),
  }));
}

function extractSeries(title: string): string {
  const seriesPatterns = [
    /série\s*:?\s*([^|:]+)/i,
    /serie\s*:?\s*([^|:]+)/i,
    /collection\s*:?\s*([^|:]+)/i,
    /épisode\s*\d+/i,
    /episode\s*\d+/i,
  ];

  for (const pattern of seriesPatterns) {
    const match = title.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Default series based on keywords
  if (/gen[eè]se|creation|origines/i.test(title)) return "Genèse";
  if (/exode|mo[iï]se|d[eé]livrance/i.test(title)) return "Exode";
  if (/j[eé]sus|evangile|christ/i.test(title)) return "Vie de Jésus";
  if (/prier|intercession|guerre/i.test(title)) return "Prière et Intercession";
  if (/famille|mariage|enfant/i.test(title)) return "Famille";
  if (/jeune|jeunesse|jeunes/i.test(title)) return "Jeunesse";

  return "Prêches Généraux";
}

// --- High-level fetchers ---
export async function getAllPosts(params?: Record<string, string | number | boolean | undefined>): Promise<BlogPost[]> {
  try {
    // 2026-09-17: WP REST API is blocked by ModSecurity (406) on HostGator.
    // Use the baked-in snapshot as the primary data source.
    const snapshot = await loadSnapshot();
    if (snapshot.length) {
      // Sort raw posts by ISO date BEFORE mapping — sorting on the
      // already-mapped French date string produces NaN and wrong order.
      return snapshot.slice().sort(byRawDateDesc).map(mapPostToBlogPost);
    }
    const posts = await getPosts(params);
    return posts.slice().sort(byRawDateDesc).map(mapPostToBlogPost);
  } catch {
    return fallbackPosts;
  }
}

export async function getSermons(): Promise<Sermon[]> {
  try {
    // 2026-09-23: map raw WP posts directly — do NOT go through getAllPosts()
    // which already maps to BlogPost. A BlogPost has no _embedded / featured_media_url,
    // so getFeaturedImage() would fall to the default for every post.
    const wpSermons = await getRawPosts();
    const mapped = wpSermons.slice().sort(byRawDateDesc).map(mapBlogPostToSermon);

    const fromYouTube = await getSermonsFromYouTube().catch(() => []);

    const combined = [...mapped, ...fromYouTube]
      .sort((a, b) => isoTime(b.dateIso) - isoTime(a.dateIso));
    return combined.length ? combined : fallbackSermons;
  } catch {
    return fallbackSermons;
  }
}

/** Return raw WP posts (snapshot or live API), unmapped. */
async function getRawPosts(): Promise<any[]> {
  const snapshot = await loadSnapshot();
  if (snapshot.length) return snapshot;
  return getPosts({ per_page: 100 });
}

export async function getSermonBySlug(slug: string): Promise<Sermon | null> {
  const sermons = await getSermons();
  return sermons.find((s) => s.slug === slug) ?? null;
}

export function mapBlogPostToSermon(post: any): Sermon {
  // Accept either a raw WP post (has .title.rendered) or an already-mapped BlogPost.
  const raw = post as any;
  const titleStr = typeof raw.title === "string"
    ? raw.title
    : decodeEntities(stripHtml(raw.title?.rendered ?? "Sans titre"));
  const excerptStr = typeof raw.excerpt === "string"
    ? raw.excerpt
    : decodeEntities(stripHtml(raw.excerpt?.rendered ?? ""));
  const contentStr = typeof raw.content === "string"
    ? raw.content
    : decodeEntities(stripHtml(raw.content?.rendered ?? ""));
  return {
    id: String(raw.id),
    title: titleStr,
    excerpt: excerptStr,
    content: contentStr,
    image: getFeaturedImage(raw),
    date: formatDateFr(raw.date),
    slug: raw.slug ?? String(raw.id),
    author: getAuthorName(raw),
    categories: getCategoriesList(raw),
    tags: getTagsList(raw),
    dateIso: raw.date,
    videoId: undefined,
    youtubeUrl: undefined,
    series: raw.categories?.[0]?.name,
  };
}

export async function getRecentPosts(limit = 6): Promise<BlogPost[]> {
  try {
    const posts = await getAllPosts();
    return posts
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  } catch {
    return fallbackPosts.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
  }
}
