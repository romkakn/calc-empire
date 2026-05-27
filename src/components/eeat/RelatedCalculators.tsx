import Link from "next/link";
import { Section } from "./Section";
import { CALCULATORS } from "@/lib/site";

export function RelatedCalculators({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (items.length === 0) return null;

  return (
    <Section id="related-calculators" title="Related calculators">
      <ul className="grid gap-3 sm:grid-cols-3">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="block rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
