import { Section } from "./Section";

export function WhenToUse({ scenarios }: { scenarios: string[] }) {
  return (
    <Section id="when-to-use" title="When to use this calculator">
      <ul className="mt-1 list-disc space-y-2 pl-5 max-w-prose">
        {scenarios.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </Section>
  );
}
