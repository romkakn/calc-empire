import { Section } from "./Section";

export type Reference = { label: string; href: string };

export function References({ items }: { items: Reference[] }) {
  return (
    <Section id="references" title="References">
      <ol className="list-decimal space-y-2 pl-5 md-body-medium max-w-prose">
        {items.map((r, i) => (
          <li key={i}>
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--md-sys-color-primary)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-xs)]"
            >
              {r.label}
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
