import { Section } from "./Section";
import type { FaqItem } from "@/lib/schema";

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <Section id="faq" title="Frequently asked questions">
      <div className="space-y-2 max-w-prose">
        {items.map((q, i) => (
          <details
            key={i}
            className="group rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] px-4 py-3"
          >
            <summary className="md-title-medium cursor-pointer list-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2 rounded-[var(--md-sys-shape-corner-xs)] flex items-start gap-3">
              <span
                aria-hidden
                className="inline-block mt-0.5 size-5 transition-transform group-open:rotate-90 text-[var(--md-sys-color-on-surface-variant)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"/></svg>
              </span>
              <span>{q.question}</span>
            </summary>
            <p className="md-body-medium mt-3 ml-8 text-[var(--md-sys-color-on-surface-variant)]">
              {q.answer}
            </p>
          </details>
        ))}
      </div>
    </Section>
  );
}
