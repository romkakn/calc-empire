"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Daily water estimate (planning rule of thumb):
//   base oz   = 0.5 × weight in lb
//   exercise  = 12 oz per 30 min of vigorous activity
//   climate   = +16 oz if hot
//   cap       = 150 oz (sensible upper bound unless medically directed)
// TODO_VERIFY: National Academies water DRI (men 3.7 L, women 2.7 L total water)
//   https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate
// TODO_VERIFY: CDC water intake guidance — confirm at publish
//   https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html

type WeightUnit = "lb" | "kg";
type Climate = "temperate" | "hot";

const OZ_PER_L = 33.814;
const LB_PER_KG = 2.20462;
const MAX_OZ = 150;

function computeOz(weight: number, unit: WeightUnit, exerciseMin: number, climate: Climate) {
  if (!Number.isFinite(weight) || weight <= 0) return NaN;
  const lb = unit === "lb" ? weight : weight * LB_PER_KG;
  const base = 0.5 * lb;
  const exercise = Number.isFinite(exerciseMin) && exerciseMin > 0
    ? 12 * (exerciseMin / 30)
    : 0;
  const climateAdd = climate === "hot" ? 16 : 0;
  const total = base + exercise + climateAdd;
  return Math.min(total, MAX_OZ);
}

export function Calculator() {
  const [unit, setUnit] = useState<WeightUnit>("lb");
  const [climate, setClimate] = useState<Climate>("temperate");
  const [weight, setWeight] = useState(160);
  const [exerciseMin, setExerciseMin] = useState(60);

  const { oz, liters, capped } = useMemo(() => {
    const o = computeOz(weight, unit, exerciseMin, climate);
    const l = Number.isFinite(o) ? o / OZ_PER_L : NaN;
    const wLb = unit === "lb" ? weight : weight * LB_PER_KG;
    const uncapped = 0.5 * wLb
      + (exerciseMin > 0 ? 12 * (exerciseMin / 30) : 0)
      + (climate === "hot" ? 16 : 0);
    return { oz: o, liters: l, capped: Number.isFinite(uncapped) && uncapped > MAX_OZ };
  }, [weight, unit, exerciseMin, climate]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. People with heart, kidney, or
        liver conditions should ask a doctor for a personal target.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Weight unit"
          value={unit}
          onChange={(v) => setUnit(v as WeightUnit)}
          options={[
            { value: "lb", label: "lb" },
            { value: "kg", label: "kg" },
          ]}
        />
        <Segment
          label="Climate"
          value={climate}
          onChange={(v) => setClimate(v as Climate)}
          options={[
            { value: "temperate", label: "Temperate" },
            { value: "hot", label: "Hot" },
          ]}
        />
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
          min={40}
          max={600}
          step={1}
          trailing={unit}
          supportingText={unit === "lb" ? "Adult typical 100–300 lb." : "Adult typical 45–135 kg."}
        />
        <TextField
          label="Vigorous exercise"
          type="number"
          inputMode="numeric"
          value={exerciseMin}
          onChange={(e) => setExerciseMin(Number(e.target.value))}
          min={0}
          max={300}
          step={5}
          trailing="min/day"
          supportingText="Minutes that make you sweat. Walking the dog does not count."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Daily target</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(oz) ? `${oz.toFixed(0)} oz` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              In liters
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(liters) ? `${liters.toFixed(1)} L` : "—"}
            </p>
          </div>
          {capped && (
            <div className="sm:col-span-2 flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: "var(--md-sys-color-secondary)" }}
              />
              <span className="md-title-medium">
                Capped at {MAX_OZ} oz — talk to a clinician before going higher.
              </span>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Total water includes about 20 percent from food per the National Academies.
        Adjust for thirst, urine color, illness, pregnancy, or lactation.
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
