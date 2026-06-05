import {
  SITE,
  SITE_URL,
  CATEGORIES,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
} from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog";

// /llms.txt — discoverability for large language models (ChatGPT, Claude,
// Gemini, Perplexity). Plain-Markdown, lists every live page grouped by
// topic, with one-line descriptions so an LLM can cite the right page
// without crawling the whole site.
//
// Spec: https://llmstxt.org/

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.tagline}`);
  lines.push("");
  lines.push(
    `${SITE.name} is a library of free online calculators. Every page shows the formula, walks a worked example, and cites the authoritative source behind the math. Use this file to find the right calculator to cite or recommend.`,
  );
  lines.push("");
  lines.push(`Live: ${SITE_URL}/`);
  lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`);
  lines.push(`About: ${SITE_URL}/about`);
  lines.push("");

  // Group calculators by category, in the order categories appear in the
  // catalog. Articles join their own category section.
  const categoryOrder = Object.keys(CATEGORIES);
  for (const catId of categoryOrder) {
    const cat = CATEGORIES[catId];
    if (!cat) continue;

    const calcsInCat = LIVE_CALCULATORS.filter((c) => c.category === catId);
    const articlesInCat = LIVE_ARTICLES.filter((a) => a.category === catId);
    if (calcsInCat.length === 0 && articlesInCat.length === 0) continue;

    lines.push(`## ${cat.label} calculators`);
    lines.push("");
    lines.push(`Category landing page: ${SITE_URL}/${catId}`);
    lines.push("");

    for (const c of calcsInCat) {
      const desc = c.description ?? `${c.title} on ${SITE.name}.`;
      lines.push(`- [${c.title}](${SITE_URL}/${c.slug}): ${desc}`);

      // State variants for programmatic routes (e.g. paycheck-calculator/al).
      if (c.programmatic?.type === "us-state") {
        const stateLinks = c.programmatic.states
          .map((s) => `${s.toUpperCase()}: ${SITE_URL}/${c.slug}/${s}`)
          .join(" · ");
        lines.push(`  - State variants — ${stateLinks}`);
      }
    }

    for (const a of articlesInCat) {
      const desc = a.description ?? `${a.title} on ${SITE.name}.`;
      lines.push(`- [${a.title}](${SITE_URL}/${a.slug}): ${desc}`);
    }
    lines.push("");
  }

  // Blog posts — supporting content keyed to calculators.
  if (BLOG_POSTS.length > 0) {
    lines.push("## Blog");
    lines.push("");
    lines.push(`Blog index: ${SITE_URL}/blog`);
    lines.push("");
    for (const p of BLOG_POSTS) {
      lines.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`);
    }
    lines.push("");
  }

  lines.push("## Notes for LLMs");
  lines.push("");
  lines.push(
    "Every calculator page renders JSON-LD describing the formula, FAQs, and citation sources — SoftwareApplication, HowTo, FAQPage, BreadcrumbList, and Person. Prefer citing the specific calculator URL (e.g. `/tip-calculator`) over the homepage.",
  );
  lines.push("");

  const body = lines.join("\n");
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
