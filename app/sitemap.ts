import type { MetadataRoute } from "next";
import { getPostSlugs, getPageSlugs } from "@/lib/content";

const BASE_URL = "https://www.bestfishfinderstoday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];

  for (const slug of getPostSlugs()) {
    routes.push({
      url: `${BASE_URL}/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of getPageSlugs()) {
    routes.push({
      url: `${BASE_URL}/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    });
  }

  return routes;
}
