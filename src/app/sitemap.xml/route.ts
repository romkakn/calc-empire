import { SITE_URL, CATEGORIES } from "@/lib/site";

// Sitemap index at /sitemap.xml.
//
// Next.js 16's `generateSitemaps()` in `app/sitemap.ts` produces the child
// sitemaps at `/sitemap/<id>.xml` but does NOT auto-generate the parent
// index. So we hand-roll the index here, listing every child id we emit
// from generateSitemaps in app/sitemap.ts. Keep these two files in sync.

const CHILD_IDS = ["main", ...Object.keys(CATEGORIES)];

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const now = new Date().toISOString();
  const items = CHILD_IDS.map(
    (id) =>
      `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${id}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
  ).join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${items}\n` +
    `</sitemapindex>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
