import catalog from "../../data/calculators.json";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://calc-empire.local";

export const SITE = catalog.site;
export const CATEGORIES = catalog.categories as Record<
  string,
  { label: string; schemaCategory: string | null }
>;

export type CalcRecord = {
  slug: string;
  title: string;
  category: string;
  tier: string;
  status: "planned" | "in-progress" | "live";
  priority: number;
  description?: string;
  programmatic?: { type: "us-state"; states: string[] };
};

export type ArticleRecord = {
  slug: string;
  title: string;
  category: string;
  tier: string;
  status: "planned" | "in-progress" | "live";
  priority: number;
  description?: string;
};

export const CALCULATORS = catalog.calculators as CalcRecord[];
export const ARTICLES = catalog.articles as ArticleRecord[];

export const LIVE_CALCULATORS = CALCULATORS.filter((c) => c.status === "live");
export const LIVE_ARTICLES = ARTICLES.filter((a) => a.status === "live");

export function absUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function calcUrl(slug: string): string {
  return absUrl(`/${slug}`);
}
