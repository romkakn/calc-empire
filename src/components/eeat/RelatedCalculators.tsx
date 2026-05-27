import Link from "next/link";
import { Section } from "./Section";
import { Card } from "../md3/Card";
import { CALCULATORS } from "@/lib/site";

export function RelatedCalculators({ slugs }: { slugs: string[] }) {
  const items = slugs
    .map((s) => CALCULATORS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  if (items.length === 0) return null;

  return (
    <Section id="related-calculators" title="Related calculators">
      <ul className="grid gap-3 sm:grid-cols-3 list-none">
        {items.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/${c.slug}`}
              className="block focus-visible:outline-none rounded-[var(--md-sys-shape-corner-md)]"
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
    </Section>
  );
}
