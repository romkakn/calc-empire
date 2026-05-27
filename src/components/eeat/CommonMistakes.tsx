import { Section } from "./Section";

export type Mistake = { mistake: string; fix: string };

export function CommonMistakes({ items }: { items: Mistake[] }) {
  return (
    <Section id="common-mistakes" title="Common mistakes (and what to do instead)">
      <ul className="space-y-3 max-w-prose">
        {items.map((m, i) => (
          <li
            key={i}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <p>
              <span aria-hidden className="mr-2 text-[var(--color-danger)]">
                ✗
              </span>
              <span className="font-medium">{m.mistake}</span>
            </p>
            <p className="mt-1 text-sm">
              <span aria-hidden className="mr-2 text-[var(--color-success)]">
                ✓
              </span>
              {m.fix}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
