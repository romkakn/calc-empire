// Blog post catalog. Each entry generates a sitemap URL, appears on the
// /blog index, and is referenced by the post's page.tsx for shared metadata.
// To add a post: drop a new folder under src/app/blog/<slug>/ with page.tsx,
// then add an entry here.

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Lead paragraph used on the index card (≤ 200 chars). */
  excerpt: string;
  /** Primary calculator category this post supports. */
  category: "construction" | "finance" | "health" | "math" | "stats" | "payroll" | "betting" | "education" | "pets";
  /** ISO date the post was first published. */
  datePublished: string;
  /** ISO date the post was last reviewed/updated. */
  dateModified: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** Primary keyword (informational). */
  primaryKeyword: string;
  /** Related calculator slugs to cross-link from the post + index card. */
  relatedCalcs: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-much-concrete-do-i-need",
    title: "How Much Concrete Do I Need? (Field Math + 3 Real Examples)",
    description:
      "Order the right amount of concrete the first time. The one formula, three worked examples (patio, garage slab, footing), waste factor, bags vs ready-mix, and the mistakes that cost contractors a second truck.",
    excerpt:
      "Most botched pours start with bad math. Here's the one formula, three real-world walkthroughs, and the waste factor every pro adds before they call the plant.",
    category: "construction",
    datePublished: "2026-05-31",
    dateModified: "2026-05-31",
    readingMinutes: 9,
    primaryKeyword: "how much concrete do i need",
    relatedCalcs: ["cubic-yard-calculator", "gravel-calculator", "square-footage-calculator"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostsSortedByDate(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}
