import { Section } from "./Section";
import { Card } from "../md3/Card";

export type WorkedStep = { label: string; value: string };

export function WorkedExample({
  scenario,
  steps,
  result,
}: {
  scenario: string;
  steps: WorkedStep[];
  result: string;
}) {
  return (
    <Section id="worked-example" title="Worked example">
      <p className="md-body-large max-w-prose">{scenario}</p>
      <ol className="mt-4 space-y-2 list-none">
        {steps.map((s, i) => (
          <Card key={i} variant="filled" as="li" className="px-4 py-3 flex justify-between gap-4">
            <span className="md-body-medium">{s.label}</span>
            <span className="md-body-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {s.value}
            </span>
          </Card>
        ))}
      </ol>
      <Card variant="filled" className="mt-4 px-4 py-3">
        <p className="md-title-medium">
          Result:{" "}
          <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
            {result}
          </span>
        </p>
      </Card>
    </Section>
  );
}
