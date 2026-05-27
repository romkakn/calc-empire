import { Section } from "./Section";
import type { FaqItem } from "@/lib/schema";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <Section id="faq" title="Frequently asked questions">
      <div className="space-y-2 max-w-prose">
        {items.map((q, i) => (
          <details
            key={i}
            className="group rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm">
              <span className="mr-2 inline-block transition-transform group-open:rotate-90" aria-hidden>
                ›
              </span>
              {q.question}
            </summary>
            <p className="mt-2 text-[var(--color-on-surface-variant)]">{q.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
