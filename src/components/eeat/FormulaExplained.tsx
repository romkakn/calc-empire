import type { ReactNode } from "react";
import { Section } from "./Section";

export function FormulaExplained({
  plainEnglish,
  formula,
  citation,
}: {
  plainEnglish: string;
  formula: ReactNode;
  citation: { label: string; href: string };
}) {
  return (
    <Section id="formula" title="The formula, in plain English">
      <p className="max-w-prose">{plainEnglish}</p>
      <div className="mt-4 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-sm">
        {formula}
      </div>
      <p className="mt-3 text-sm text-[var(--color-on-surface-variant)]">
        Source:{" "}
        <a
          href={citation.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] rounded-sm"
        >
          {citation.label}
        </a>
      </p>
    </Section>
  );
}
