import { Section } from "./Section";
import { Card } from "../md3/Card";

export type Mistake = { mistake: string; fix: string };

export function CommonMistakes({ items }: { items: Mistake[] }) {
  return (
    <Section id="common-mistakes" title="Common mistakes (and what to do instead)">
      <ul className="space-y-3 max-w-prose list-none">
        {items.map((m, i) => (
          <Card key={i} variant="outlined" as="li" className="p-4">
            <p className="md-title-medium flex items-start gap-2">
              <span
                aria-hidden
                className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] md-label-medium"
              >
                ✕
              </span>
              <span>{m.mistake}</span>
            </p>
            <p className="md-body-medium mt-2 flex items-start gap-2">
              <span
                aria-hidden
                className="inline-flex size-6 items-center justify-center rounded-full bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] md-label-medium"
              >
                ✓
              </span>
              <span>{m.fix}</span>
            </p>
          </Card>
        ))}
      </ul>
    </Section>
  );
}
