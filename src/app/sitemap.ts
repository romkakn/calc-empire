import type { MetadataRoute } from "next";
import { SITE_URL, LIVE_CALCULATORS, LIVE_ARTICLES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
  ];

  const calcs: MetadataRoute.Sitemap = LIVE_CALCULATORS.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articles: MetadataRoute.Sitemap = LIVE_ARTICLES.map((a) => ({
    url: `${SITE_URL}/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...root, ...calcs, ...articles];
}
