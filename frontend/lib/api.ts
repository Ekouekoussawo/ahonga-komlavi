"use client";

import { BlogPost } from "@/types/wordpress";

const WP_API = process.env.NEXT_PUBLIC_WP_API ?? "http://ahonga-komlavi.local/wp-json/wp/v2";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${WP_API}/${path}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`WP API error: ${res.status}`);
  return res.json();
}

export const wpApi = {
  posts: {
    getAll: (params?: Record<string, string | number | boolean | undefined>) => {
      const search = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
        });
      }
      return fetchJson<BlogPost[]>(`posts?${search.toString()}&_embed=true`);
    },
    getBySlug: (slug: string) =>
      fetchJson<BlogPost[]>(`posts?slug=${slug}&_embed=true`).then((r) => r[0] ?? null),
    getById: (id: string | number) =>
      fetchJson<BlogPost[]>(`posts?include=${id}&_embed=true`).then((r) => r[0] ?? null),
  },

  categories: {
    getAll: () => fetchJson<{ id: number; name: string; slug: string }[]>("categories"),
    getBySlug: (slug: string) =>
      fetchJson<{ id: number; name: string; slug: string }[]>(`categories?slug=${slug}`).then((r) => r[0] ?? null),
  },

  sermons: {
    getAll: () =>
      fetchJson<BlogPost[]>(`posts?category_name=preche&_embed=true`),
  },

  media: {
    getById: (id: string | number) =>
      fetchJson<{ source_url: string }>(`media/${id}`),
  },
};

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  message: string;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("subject", data.subject);
  if (data.phone) formData.append("phone", data.phone);
  formData.append("message", data.message);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/wp-json/contact-form/v1/submit`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to submit form");
  return res.json();
}

export async function submitPrayerRequest(data: {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  message: string;
}) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("subject", data.subject);
  if (data.phone) formData.append("phone", data.phone);
  formData.append("message", data.message);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/wp-json/prayer/v1/submit`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to submit prayer request");
  return res.json();
}