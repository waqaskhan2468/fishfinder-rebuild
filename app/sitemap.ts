import type { MetadataRoute } from "next";
import { getPostSlugs, getPageSlugs } from "@/lib/content";

const BASE_URL = "https://www.bestfishfinderstoday.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE_URL}/guides/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // Tools are primary ranking targets, not secondary pages.
    {
      url: `${BASE_URL}/tools/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/fish-finder-compatibility-checker/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/which-fish-finder-should-i-buy/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
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
