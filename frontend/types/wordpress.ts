export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
}

export interface WPMeta {
  id: number;
  post_id: number;
  meta: Record<string, any>;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  slug: string;
  author: string;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  meta: Record<string, any>;
}

// --- YouTube / Sermon Types ---
export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  url: string;
}

export interface Sermon {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  dateIso?: string;
  slug: string;
  author: string;
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  videoId?: string;
  youtubeUrl?: string;
  series?: string;
}
