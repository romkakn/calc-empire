import type { ReactNode } from "react";
import { Section } from "./Section";
import { Card } from "../md3/Card";

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
      <p className="md-body-large max-w-prose">{plainEnglish}</p>
      <Card variant="outlined" className="mt-4 overflow-x-auto p-4 font-[var(--md-sys-typescale-mono-font)] md-body-medium">
        {formula}
      </Card>
      <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
        Source:{" "}
        <a
          href={citation.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--md-sys-color-primary)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-xs)]"
        >
          {citation.label}
        </a>
      </p>
    </Section>
  );
}
