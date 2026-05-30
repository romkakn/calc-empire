import type { MetadataRoute } from "next";
import {
  SITE_URL,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
  CATEGORIES,
} from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const root: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const liveCategories = new Set([
    ...LIVE_CALCULATORS.map((c) => c.category),
    ...LIVE_ARTICLES.map((a) => a.category),
  ]);
  const categories: MetadataRoute.Sitemap = [...liveCategories]
    .filter((c) => CATEGORIES[c])
    .map((c) => ({
      url: `${SITE_URL}/${c}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const calcs: MetadataRoute.Sitemap = LIVE_CALCULATORS.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Programmatic state-variant URLs (e.g. /paycheck-calculator/tx).
  const stateRoutes: MetadataRoute.Sitemap = LIVE_CALCULATORS.flatMap((c) =>
    c.programmatic?.type === "us-state"
      ? c.programmatic.states.map((s) => ({
          url: `${SITE_URL}/${c.slug}/${s}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      : [],
  );

  const articles: MetadataRoute.Sitemap = LIVE_ARTICLES.map((a) => ({
    url: `${SITE_URL}/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...root, ...categories, ...calcs, ...stateRoutes, ...articles];
}
