import {
  SITE_URL,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
  CATEGORIES,
} from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";
import { notFound } from "next/navigation";

// Child sitemaps for the hierarchy at /sitemap/<id>.xml. One file per
// category id plus a "main" sitemap for the homepage + about + blog +
// category landing pages. The parent sitemap-index lives at /sitemap.xml
// (see app/sitemap.xml/route.ts) and references each id listed here.

type UrlEntry = {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
};

const CATEGORY_IDS = Object.keys(CATEGORIES);
const VALID_IDS = ["main", ...CATEGORY_IDS];

export const dynamic = "force-static";
export const revalidate = false;
export const dynamicParams = false;

export function generateStaticParams() {
  return VALID_IDS.map((id) => ({ file: `${id}.xml` }));
}

function mainUrls(now: string): UrlEntry[] {
  const root: UrlEntry[] = [
    { url: `${SITE_URL}/`, lastmod: now, changefreq: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/about`, lastmod: now, changefreq: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastmod: now, changefreq: "weekly", priority: 0.7 },
  ];

  const blog: UrlEntry[] = BLOG_POSTS.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastmod: new Date(p.dateModified).toISOString(),
    changefreq: "monthly",
    priority: 0.7,
  }));

  const liveCategories = new Set<string>([
    ...LIVE_CALCULATORS.map((c) => c.category),
    ...LIVE_ARTICLES.map((a) => a.category),
  ]);
  const categories: UrlEntry[] = [...liveCategories]
    .filter((c) => CATEGORIES[c])
    .map((c) => ({
      url: `${SITE_URL}/${c}`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.8,
    }));

  return [...root, ...categories, ...blog];
}

function categoryUrls(catId: string, now: string): UrlEntry[] {
  const calcs: UrlEntry[] = LIVE_CALCULATORS.filter(
    (c) => c.category === catId,
  ).map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    lastmod: now,
    changefreq: "monthly",
    priority: 0.8,
  }));

  const stateRoutes: UrlEntry[] = LIVE_CALCULATORS.filter(
    (c) => c.category === catId && c.programmatic?.type === "us-state",
  ).flatMap((c) =>
    c.programmatic!.states.map((s) => ({
      url: `${SITE_URL}/${c.slug}/${s}`,
      lastmod: now,
      changefreq: "monthly",
      priority: 0.6,
    })),
  );

  const articles: UrlEntry[] = LIVE_ARTICLES.filter(
    (a) => a.category === catId,
  ).map((a) => ({
    url: `${SITE_URL}/${a.slug}`,
    lastmod: now,
    changefreq: "monthly",
    priority: 0.7,
  }));

  return [...calcs, ...stateRoutes, ...articles];
}

function buildXml(urls: UrlEntry[]): string {
  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.url}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</urlset>\n`
  );
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ file: string }> },
) {
  const { file } = await ctx.params;
  const id = file.replace(/\.xml$/i, "");
  if (!VALID_IDS.includes(id)) notFound();

  const now = new Date().toISOString();
  const urls = id === "main" ? mainUrls(now) : categoryUrls(id, now);

  return new Response(buildXml(urls), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
