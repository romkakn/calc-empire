import { Section } from "./Section";
import { CalcCard } from "../CalcCard";
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
    </Section>
  );
}
