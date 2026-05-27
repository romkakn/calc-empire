import Link from "next/link";
import { Section } from "./Section";

export type RelatedTerm = { term: string; definition: string; slug?: string };

export function RelatedTerms({ terms }: { terms: RelatedTerm[] }) {
  return (
    <Section id="related-terms" title="Related terms you'll hear">
      <dl className="space-y-4 max-w-prose">
        {terms.map((t) => (
          <div key={t.term}>
            <dt className="md-title-medium">
              {t.slug ? (
                <Link
                  href={`/${t.slug}`}
                  className="text-[var(--md-sys-color-primary)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-xs)]"
                >
                  {t.term}
                </Link>
              ) : (
                t.term
              )}
            </dt>
            <dd className="md-body-medium mt-1 text-[var(--md-sys-color-on-surface-variant)]">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
