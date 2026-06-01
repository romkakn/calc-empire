import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Calc Empire crawl policy.
//
// Strategy: max signal of intent without hurting indexability.
//
//   - Every legitimate search engine (Googlebot, Bingbot, DuckDuckBot,
//     YandexBot, Slurp, Naver, Baidu, etc.) is covered by the default `*`
//     allow and gets the full site, including `/_next/` so Google can fetch
//     the CSS + JS it needs to render a page. Blocking `/_next/` is a common
//     SEO own-goal — we don't do it.
//
//   - Real-time AI search assistants (ChatGPT-User, PerplexityBot, OAI
//     SearchBot, etc.) cite their sources and send traffic back, so they
//     stay on the default allow path too.
//
//   - AI training-only scrapers (GPTBot, ClaudeBot, Google-Extended,
//     anthropic-ai, CCBot, Bytespider, …) extract content for model
//     training without sending traffic back. Blocked.
//
//   - Bandwidth-heavy SEO competitor crawlers we don't use (SemrushBot,
//     MJ12bot, DotBot, BLEXBot, PetalBot, SeznamBot, …). Blocked.
//
//   - AhrefsBot is intentionally NOT blocked — we use Ahrefs to track this
//     site's own rankings and backlinks.
//
//   - Internal-only paths blocked everywhere: `/api/*` (would-be private
//     endpoints) and `/_vercel/*` (Vercel infra routes). `/_next/static/*`
//     stays allowed because Google needs to fetch CSS/JS to render.

const AI_TRAINING_BOTS = [
  "GPTBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "cohere-ai",
  "Omgilibot",
  "Omgili",
  "Diffbot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "ImagesiftBot",
  "AwarioRssBot",
  "AwarioSmartBot",
  "DataForSeoBot",
  "Applebot-Extended",
];

const BANDWIDTH_HEAVY_BOTS = [
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "BLEXBot",
  "PetalBot",
  "SeznamBot",
  "linkfluence",
  "magpie-crawler",
  "MauiBot",
  "trendictionbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Default — every other bot, including Googlebot, Bingbot, etc.
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_vercel/"],
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
      {
        userAgent: BANDWIDTH_HEAVY_BOTS,
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
