import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { CalcCard } from "@/components/CalcCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import {
  CALCULATORS,
  ARTICLES,
  CATEGORIES,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
  SITE,
} from "@/lib/site";
import { breadcrumbListSchema, jsonLd } from "@/lib/schema";

// Pre-render one page per category that has at least one live item.
export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return { title: "Not found" };

  // Pull the top three live calcs in this category, by priority, so the meta
  // description doubles as a keyword-rich preview of what's inside.
  const top = LIVE_CALCULATORS.filter((c) => c.category === category)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
    .map((c) => c.title)
    .join(", ");

  // Root layout supplies `%s | Calc Empire` template — keep the page title
  // brand-free here and let the template append, except for `openGraph.title`
  // which is not run through the template.
  const title = `${cat.label} Calculators — Free & Show the Math`;
  const desc = top
    ? `Free ${cat.label.toLowerCase()} calculators including ${top}. Each one shows the formula, a worked example, and cited sources.`
    : `Free ${cat.label.toLowerCase()} calculators from ${SITE.name} — formula + worked example + cited sources on every page.`;

  return {
    title: { absolute: `${title} | ${SITE.name}` },
    description: desc,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: `${title} | ${SITE.name}`,
      description: desc,
      url: `/${category}`,
      type: "website",
      siteName: SITE.name,
    },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ category: string }> },
) {
  const { category } = await params;
  const cat = CATEGORIES[category];
  if (!cat) return notFound();

  const liveCalcs = LIVE_CALCULATORS.filter((c) => c.category === category)
    .sort((a, b) => a.priority - b.priority);
  const liveArticles = LIVE_ARTICLES.filter((a) => a.category === category)
    .sort((a, b) => a.priority - b.priority);
  const plannedCalcs = CALCULATORS.filter(
    (c) => c.category === category && c.status !== "live",
  ).sort((a, b) => a.priority - b.priority);
  const plannedArticles = ARTICLES.filter(
    (a) => a.category === category && a.status !== "live",
  ).sort((a, b) => a.priority - b.priority);

  const live = [...liveCalcs, ...liveArticles];
  const planned = [...plannedCalcs, ...plannedArticles];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: cat.label, path: `/${category}` },
  ];

  return (
    <Container as="section" className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbListSchema(breadcrumbs)) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-2 flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
        >
          <CategoryIcon category={category} size={28} />
        </span>
        <h1 className="md-display-small text-[var(--md-sys-color-on-surface)]">
          {cat.label} Calculators
        </h1>
      </div>

      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        Free, no-login {cat.label.toLowerCase()} calculators —{" "}
        {live.length} live{planned.length > 0 ? `, ${planned.length} on the roadmap` : ""}.
        Every {cat.label.toLowerCase()} calculator on this page shows the formula and cites
        its sources.
      </p>

      {live.length > 0 ? (
        <section aria-labelledby="live-heading" className="mt-10">
          <h2 id="live-heading" className="md-headline-small">All {cat.label.toLowerCase()} calculators</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 list-none">
            {live.map((c) => (
              <li key={c.slug} className="h-full">
                <CalcCard
                  slug={c.slug}
                  title={c.title}
                  description={c.description}
                  category={c.category}
                  hideCategory
                />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <Card variant="outlined" className="mt-8 p-4">
          <p className="md-body-medium">
            No {cat.label.toLowerCase()} calculators are live yet. The roadmap below shows
            what&apos;s on deck.
          </p>
        </Card>
      )}

      {planned.length > 0 ? (
        <section aria-labelledby="roadmap-heading" className="mt-10">
          <h2 id="roadmap-heading" className="md-headline-small">Roadmap</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 list-none">
            {planned.map((c) => (
              <li
                key={c.slug}
                className="flex items-center justify-between rounded-[var(--md-sys-shape-corner-sm)] border border-dashed border-[var(--md-sys-color-outline-variant)] px-3 py-2 md-body-medium"
              >
                <span>{c.title}</span>
                <span className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                  {c.tier}-tier
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
