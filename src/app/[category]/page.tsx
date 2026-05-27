import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
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
  return {
    title: `${cat.label} calculators`,
    description: `${cat.label} calculators from ${SITE.name} — each with the formula, a worked example, and cited sources.`,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: `${cat.label} calculators — ${SITE.name}`,
      description: `${cat.label} calculators with the math shown.`,
      url: `/${category}`,
      type: "website",
    },
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

      <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
        {cat.label} calculators
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        {live.length} live{planned.length > 0 ? `, ${planned.length} on the roadmap` : ""}.
        Every {cat.label.toLowerCase()} calculator on this site shows the formula and cites
        its sources.
      </p>

      {live.length > 0 ? (
        <section aria-labelledby="live-heading" className="mt-10">
          <h2 id="live-heading" className="md-headline-small">Live</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 list-none">
            {live.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="block rounded-[var(--md-sys-shape-corner-md)] focus-visible:outline-none"
                >
                  <Card
                    variant="elevated"
                    className="p-4 transition-shadow duration-[var(--md-sys-motion-duration-short3)] hover:md-elevation-2"
                  >
                    <p className="md-title-medium text-[var(--md-sys-color-on-surface)]">
                      {c.title}
                    </p>
                  </Card>
                </Link>
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
