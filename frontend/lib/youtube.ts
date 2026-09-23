const CHANNEL_ID = "UC0PpGC7UZupgs5C3Gy8VgkQ";

export interface RecentVideo {
  id: string;
  title: string;
}

// The channel's public RSS feed needs no API key and works from a server
// fetch at build time (static export has no server to poll a real API from
// at request time) — same no-maintenance principle as the "uploads" playlist
// embed trick used elsewhere, but this one returns individual video IDs so
// distinct players can be rendered instead of a single playlist widget.
export async function getRecentVideos(count = 3): Promise<RecentVideo[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    if (!res.ok) return [];
    const xml = await res.text();
    const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, count);
    return entries
      .map((entry) => {
        const block = entry[1];
        const id = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
        const title = block.match(/<title>(.*?)<\/title>/)?.[1] ?? "";
        return { id, title };
      })
      .filter((v) => v.id);
  } catch {
    return [];
  }
}
