import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { CalcCard } from "@/components/CalcCard";
import { CategoryIcon } from "@/components/CategoryIcon";
import {
  CALCULATORS,
  ARTICLES,
  CATEGORIES,
  SITE,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
} from "@/lib/site";

// Root layout sets a `%s | Calc Empire` title template, so we leave the brand
// suffix off the page title itself and let the template append it.
const SEO_TITLE = "Free Online Calculators — Show the Math";
const SEO_DESC = `Free, no-login calculators for finance, math, stats, health, construction, education, and pets. Each one shows the formula, a worked example, and the sources we cited — so you can trust the result and learn the math.`;

export const metadata: Metadata = {
  title: { absolute: `${SEO_TITLE} | ${SITE.name}` },
  description: SEO_DESC,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SEO_TITLE} | ${SITE.name}`,
    description: SEO_DESC,
    url: "/",
    type: "website",
    siteName: SITE.name,
  },
  twitter: { card: "summary_large_image", title: SEO_TITLE, description: SEO_DESC },
};

function groupByCategory<T extends { category: string }>(items: T[]) {
  const out = new Map<string, T[]>();
  for (const it of items) {
    if (!out.has(it.category)) out.set(it.category, []);
    out.get(it.category)!.push(it);
  }
  return out;
}

export default function HomePage() {
  const live = [...LIVE_CALCULATORS, ...LIVE_ARTICLES].sort(
    (a, b) => a.priority - b.priority,
  );
  const planned = [...CALCULATORS, ...ARTICLES]
    .filter((c) => c.status !== "live")
    .sort((a, b) => a.priority - b.priority);
  const liveByCat = groupByCategory(live);

  return (
    <Container as="div" className="py-10">
      <h1 className="md-display-small text-[var(--md-sys-color-on-surface)]">
        Free online calculators that show the math.
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        {live.length} calculators across finance, math, statistics, health,
        construction, payroll, education, and pets. Every page shows the
        formula, a worked example, and cited authoritative sources — so you can
        trust the number and learn the math.
      </p>

      {live.length === 0 ? (
        <Card variant="outlined" className="mt-8 p-4 md-body-medium">
          No calculators are live yet. The catalog below shows what&apos;s on the roadmap.
        </Card>
      ) : (
        <section aria-labelledby="live-heading" className="mt-10">
          <h2 id="live-heading" className="md-headline-small">All calculators</h2>
          <div className="mt-4 space-y-10">
            {[...liveByCat.entries()].map(([cat, items]) => {
              const catMeta = CATEGORIES[cat];
              const catLabel = catMeta?.label ?? cat;
              return (
                <section key={cat} aria-labelledby={`cat-${cat}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3
                      id={`cat-${cat}`}
                      className="md-title-large flex items-center gap-2 text-[var(--md-sys-color-on-surface)]"
                    >
                      <span
                        aria-hidden
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                      >
                        <CategoryIcon category={cat} size={18} />
                      </span>
                      {catLabel} calculators
                    </h3>
                    <Link
                      href={`/${cat}`}
                      className="md-label-large text-[var(--md-sys-color-primary)] underline-offset-4 hover:underline rounded-[var(--md-sys-shape-corner-xs)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2"
                    >
                      Browse all →
                    </Link>
                  </div>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2 list-none">
                    {items.map((c) => (
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
              );
            })}
          </div>
        </section>
      )}

      {planned.length > 0 ? (
        <section aria-labelledby="roadmap-heading" className="mt-12">
          <h2 id="roadmap-heading" className="md-headline-small">Roadmap</h2>
          <p className="md-body-medium mt-2 text-[var(--md-sys-color-on-surface-variant)]">
            {planned.length} calculator{planned.length === 1 ? "" : "s"} planned,
            prioritized by keyword difficulty.
          </p>
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
