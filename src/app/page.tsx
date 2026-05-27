import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import {
  CALCULATORS,
  ARTICLES,
  CATEGORIES,
  SITE,
  LIVE_CALCULATORS,
  LIVE_ARTICLES,
} from "@/lib/site";

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.tagline,
  alternates: { canonical: "/" },
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
        {SITE.tagline}
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        Each calculator shows the formula, a worked example, and the sources we
        cited — so you can trust the result and learn the math at the same time.
      </p>

      {live.length === 0 ? (
        <Card variant="outlined" className="mt-8 p-4 md-body-medium">
          No calculators are live yet. The catalog below shows what&apos;s on the roadmap.
        </Card>
      ) : (
        <section aria-labelledby="live-heading" className="mt-10">
          <h2 id="live-heading" className="md-headline-small">Live</h2>
          <div className="mt-4 space-y-10">
            {[...liveByCat.entries()].map(([cat, items]) => {
              const catMeta = CATEGORIES[cat];
              return (
                <section key={cat} aria-labelledby={`cat-${cat}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 id={`cat-${cat}`} className="md-title-large">
                      {catMeta?.label ?? cat}
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
              );
            })}
          </div>
        </section>
      )}

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
    </Container>
  );
}
