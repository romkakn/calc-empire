"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Protein intake coefficients (grams per unit body weight per day).
// Pairs are matched: lb factor ≈ kg factor / 2.2046.
// TODO_VERIFY: ISSN Position Stand on Protein & Exercise (Jäger et al., 2017)
//   https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8
// TODO_VERIFY: US National Academies DRI for Protein (0.8 g/kg RDA, 2005)
//   https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids
// TODO_VERIFY: PROT-AGE (Bauer et al., JAMDA 2013) — older-adult recommendation
//   https://www.jamda.com/article/S1525-8610(13)00326-5/fulltext

type Unit = "lb" | "kg";
type Goal = "sedentary" | "active" | "strength" | "cutting" | "bulking";

const FACTORS: Record<Goal, { perLb: number; perKg: number; label: string; blurb: string }> = {
  sedentary:  { perLb: 0.36, perKg: 0.8, label: "Sedentary (RDA)",        blurb: "Minimum to prevent deficiency in healthy adults." },
  active:     { perLb: 0.55, perKg: 1.2, label: "Generally active",       blurb: "Recreational cardio, daily steps, light resistance." },
  strength:   { perLb: 0.73, perKg: 1.6, label: "Strength training",      blurb: "Lifting 3+ days/week, building or maintaining muscle." },
  cutting:    { perLb: 0.82, perKg: 1.8, label: "Cutting (fat loss)",     blurb: "Calorie deficit — higher protein preserves muscle." },
  bulking:    { perLb: 1.00, perKg: 2.2, label: "Bulking or 65+",         blurb: "Aggressive muscle gain or older-adult anabolic resistance." },
};

function gramsPerDay(weight: number, unit: Unit, goal: Goal) {
  if (!Number.isFinite(weight) || weight <= 0) return NaN;
  const f = FACTORS[goal];
  return unit === "lb" ? weight * f.perLb : weight * f.perKg;
}

export function Calculator() {
  const [unit, setUnit] = useState<Unit>("lb");
  const [weight, setWeight] = useState(160);
  const [goal, setGoal] = useState<Goal>("strength");

  const { total, perMeal3, perMeal4, perMeal5, factorLabel } = useMemo(() => {
    const g = gramsPerDay(weight, unit, goal);
    return {
      total: g,
      perMeal3: g / 3,
      perMeal4: g / 4,
      perMeal5: g / 5,
      factorLabel: unit === "lb"
        ? `${FACTORS[goal].perLb} g/lb`
        : `${FACTORS[goal].perKg} g/kg`,
    };
  }, [weight, unit, goal]);

  const weightUnitLabel = unit === "lb" ? "lb" : "kg";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. Talk to a licensed clinician or
        registered dietitian before big changes — especially if you have kidney concerns.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Weight unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "lb", label: "lb" },
            { value: "kg", label: "kg" },
          ]}
        />
      </div>

      <div className="mb-4">
        <Segment
          label="Activity & goal"
          value={goal}
          onChange={(v) => setGoal(v as Goal)}
          options={[
            { value: "sedentary", label: "Sedentary" },
            { value: "active",    label: "Active" },
            { value: "strength",  label: "Strength" },
            { value: "cutting",   label: "Cutting" },
            { value: "bulking",   label: "Bulk / 65+" },
          ]}
        />
        <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
          {FACTORS[goal].blurb}
        </p>
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Body weight"
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          min={50}
          max={500}
          step={1}
          trailing={weightUnitLabel}
          supportingText={`Multiplier: ${factorLabel} · ${FACTORS[goal].label}`}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Daily protein target
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(total) ? `${Math.round(total)} g/day` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">3 meals</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(perMeal3) ? `~${Math.round(perMeal3)} g` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">4 meals</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(perMeal4) ? `~${Math.round(perMeal4)} g` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">5 meals</p>
            <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(perMeal5) ? `~${Math.round(perMeal5)} g` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Aim for 25–40 g per meal to keep muscle protein synthesis active across the day. Older
        adults and fully plant-based eaters often do better at the higher end of the per-meal range.
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
