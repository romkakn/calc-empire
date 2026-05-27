import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { LIVE_CALCULATORS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: `That page doesn't exist on ${SITE.name}. Try a calculator from the list below.`,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const featured = [...LIVE_CALCULATORS]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6);

  return (
    <Container as="section" className="py-12">
      <p className="md-label-large text-[var(--md-sys-color-primary)]">404</p>
      <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
        That page doesn&apos;t exist.
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        The URL may have moved, or you typed it from memory. Try a popular calculator
        below — or go back to the{" "}
        <Link
          href="/"
          className="text-[var(--md-sys-color-primary)] underline underline-offset-4 rounded-[var(--md-sys-shape-corner-xs)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)]"
        >
          homepage
        </Link>
        .
      </p>

      <h2 className="md-headline-small mt-10">Popular calculators</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 list-none">
        {featured.map((c) => (
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
    </Container>
  );
}
