import type { Metadata } from "next";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

  const staticRoutes = [
    "",
    "about",
    "ministry",
    "sermons",
    "events",
    "galerie",
    "contact",
  ];

  const routes: MetadataRoute.Sitemap = [];

  for (const route of staticRoutes) {
    const path = route ? `/${route}` : "/";
    routes.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route === "" ? 1 : 0.8,
    });
  }

  return routes;
}
