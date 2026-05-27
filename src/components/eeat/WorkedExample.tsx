import { Section } from "./Section";

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
      <p className="max-w-prose">{scenario}</p>
      <ol className="mt-4 space-y-2 text-sm">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex justify-between gap-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2"
          >
            <span>{s.label}</span>
            <span className="font-mono">{s.value}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 rounded-md bg-[var(--color-surface-2)] px-3 py-2 font-medium">
        Result: <span className="font-mono">{result}</span>
      </p>
    </Section>
  );
}
