import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
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
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {SITE.tagline}
      </h1>
      <p className="mt-3 max-w-prose text-[var(--color-on-surface-variant)]">
        Each calculator shows the formula, a worked example, and the sources we
        cited — so you can trust the result and learn the math at the same time.
      </p>

      {live.length === 0 ? (
        <p className="mt-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
          No calculators are live yet. The catalog below shows what&apos;s on the
          roadmap.
        </p>
      ) : (
        <section aria-labelledby="live-heading" className="mt-10">
          <h2 id="live-heading" className="text-xl font-semibold">
            Live
          </h2>
          <div className="mt-4 space-y-8">
            {[...liveByCat.entries()].map(([cat, items]) => (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <h3
                  id={`cat-${cat}`}
                  className="text-sm font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)]"
                >
                  {CATEGORIES[cat]?.label ?? cat}
                </h3>
                <ul className="mt-2 grid gap-3 sm:grid-cols-2">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="block rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                      >
                        <span className="font-medium">{c.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="roadmap-heading" className="mt-12">
        <h2 id="roadmap-heading" className="text-xl font-semibold">
          Roadmap
        </h2>
        <p className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
          {planned.length} calculator{planned.length === 1 ? "" : "s"} planned,
          prioritized by keyword difficulty.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {planned.map((c) => (
            <li
              key={c.slug}
              className="flex items-center justify-between rounded-md border border-dashed border-[var(--color-border)] px-3 py-2 text-sm"
            >
              <span>{c.title}</span>
              <span className="text-xs uppercase tracking-wide text-[var(--color-on-surface-variant)]">
                {c.tier}-tier
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
