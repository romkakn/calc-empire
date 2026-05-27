import Link from "next/link";
import { Section } from "./Section";

export type RelatedTerm = { term: string; definition: string; slug?: string };

export function RelatedTerms({ terms }: { terms: RelatedTerm[] }) {
  return (
    <Section id="related-terms" title="Related terms you'll hear">
      <dl className="space-y-3 max-w-prose">
        {terms.map((t) => (
          <div key={t.term}>
            <dt className="font-medium">
              {t.slug ? (
                <Link
                  href={`/${t.slug}`}
                  className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
                >
                  {t.term}
                </Link>
              ) : (
                t.term
              )}
            </dt>
            <dd className="mt-1 text-[var(--color-on-surface-variant)]">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
