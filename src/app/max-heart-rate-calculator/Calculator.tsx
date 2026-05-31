"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Max heart rate estimation:
//   Fox (1971):    MHR = 220 - age
//   Tanaka (2001): MHR = 208 - 0.7 * age   // TODO_VERIFY: Tanaka H, Monahan KD, Seals DR — J Am Coll Cardiol 2001; https://www.jacc.org/doi/10.1016/S0735-1097%2800%2901054-8
//   Gulati (2010): MHR = 206 - 0.88 * age  // TODO_VERIFY: Gulati M et al. — Circulation 2010; https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.110.939249
// Training zones (% MHR):
//   Z1 50-60, Z2 60-70, Z3 70-80, Z4 80-90, Z5 90-100

type Formula = "fox" | "tanaka" | "gulati";

function maxHeartRate(age: number, formula: Formula): number {
  if (!Number.isFinite(age)) return NaN;
  switch (formula) {
    case "fox":
      return 220 - age;
    case "tanaka":
      return 208 - 0.7 * age;
    case "gulati":
      return 206 - 0.88 * age;
  }
}

const ZONES: { name: string; low: number; high: number; purpose: string }[] = [
  { name: "Zone 1", low: 0.5, high: 0.6, purpose: "Recovery" },
  { name: "Zone 2", low: 0.6, high: 0.7, purpose: "Aerobic base" },
  { name: "Zone 3", low: 0.7, high: 0.8, purpose: "Tempo" },
  { name: "Zone 4", low: 0.8, high: 0.9, purpose: "Threshold" },
  { name: "Zone 5", low: 0.9, high: 1.0, purpose: "VO2 max" },
];

export function Calculator() {
  const [age, setAge] = useState(35);
  const [formula, setFormula] = useState<Formula>("tanaka");

  const { mhr, zones } = useMemo(() => {
    const m = maxHeartRate(age, formula);
    const z = ZONES.map((z) => ({
      ...z,
      lowBpm: Number.isFinite(m) ? Math.round(m * z.low) : NaN,
      highBpm: Number.isFinite(m) ? Math.round(m * z.high) : NaN,
    }));
    return { mhr: m, zones: z };
  }, [age, formula]);

  const formulaLabel = {
    fox: "Fox (220 − age)",
    tanaka: "Tanaka (208 − 0.7 × age)",
    gulati: "Gulati (206 − 0.88 × age)",
  }[formula];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. Talk to your doctor before
        starting a high-intensity program — especially if you are over 40 or have heart
        symptoms.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Formula"
          value={formula}
          onChange={(v) => setFormula(v as Formula)}
          options={[
            { value: "fox", label: "Fox" },
            { value: "tanaka", label: "Tanaka" },
            { value: "gulati", label: "Gulati" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Age"
          type="number"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          min={10}
          max={100}
          step={1}
          trailing="yrs"
          supportingText="Whole years. Estimates are most reliable for ages 20–80."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated max heart rate
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(mhr) ? `${mhr.toFixed(1)} bpm` : "—"}
            </p>
            <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
              {formulaLabel}
            </p>
          </div>

          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-2">
              Training zones
            </p>
            <table className="w-full text-left md-body-medium border-collapse">
              <thead>
                <tr className="border-b border-[var(--md-sys-color-outline-variant)]">
                  <th className="py-2 pr-2 md-label-medium">Zone</th>
                  <th className="py-2 pr-2 md-label-medium">% MHR</th>
                  <th className="py-2 pr-2 md-label-medium">bpm</th>
                  <th className="py-2 md-label-medium">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.name} className="border-b border-[var(--md-sys-color-outline-variant)] last:border-0">
                    <td className="py-2 pr-2 md-title-small">{z.name}</td>
                    <td className="py-2 pr-2 tabular-nums">
                      {Math.round(z.low * 100)}–{Math.round(z.high * 100)}%
                    </td>
                    <td className="py-2 pr-2 tabular-nums font-[var(--md-sys-typescale-mono-font)]">
                      {Number.isFinite(z.lowBpm) ? `${z.lowBpm}–${z.highBpm}` : "—"}
                    </td>
                    <td className="py-2 text-[var(--md-sys-color-on-surface-variant)]">
                      {z.purpose}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Individual MHR varies by roughly ±10–12 bpm from the population estimate. A graded
        exercise test in a clinical setting is the only way to measure your true peak.
      </p>
    </Card>
  );
}

function Segment({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <div role="radiogroup" aria-label={label} className="inline-flex rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={[
              "min-h-12 px-4 md-label-large",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]",
              value === opt.value
                ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
              i > 0 ? "border-l border-[var(--md-sys-color-outline)]" : "",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
