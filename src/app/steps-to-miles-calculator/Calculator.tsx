"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Stride-based steps ↔ miles conversion.
// Stride (in) = height (in) × multiplier; multiplier is 0.413 (women) or 0.415 (men).
// TODO_VERIFY: stride multipliers 0.413 / 0.415 — widely cited gait-study rule of thumb.
//   Source: ACSM's Health-Related Physical Fitness Assessment Manual; also Tudor-Locke et al.
//   https://pubmed.ncbi.nlm.nih.gov/14715035/
// Miles = steps × stride (in) / 12 / 5280.
// Quick CDC rule of thumb: ~2,000 steps per mile.
// TODO_VERIFY: CDC 2,000 steps/mile rule — confirm at https://www.cdc.gov/physical-activity-basics/index.html

const FEET_PER_MILE = 5280;
const INCHES_PER_FOOT = 12;
const STRIDE_FACTOR_FEMALE = 0.413;
const STRIDE_FACTOR_MALE = 0.415;

type Direction = "steps-to-miles" | "miles-to-steps";
type Sex = "female" | "male";

function strideFeet(heightIn: number, sex: Sex) {
  const factor = sex === "female" ? STRIDE_FACTOR_FEMALE : STRIDE_FACTOR_MALE;
  return (heightIn * factor) / INCHES_PER_FOOT;
}

function stepsToMiles(steps: number, heightIn: number, sex: Sex) {
  if (!Number.isFinite(steps) || !Number.isFinite(heightIn)) return NaN;
  return (steps * strideFeet(heightIn, sex)) / FEET_PER_MILE;
}

function milesToSteps(miles: number, heightIn: number, sex: Sex) {
  if (!Number.isFinite(miles) || !Number.isFinite(heightIn)) return NaN;
  const stride = strideFeet(heightIn, sex);
  if (stride <= 0) return NaN;
  return (miles * FEET_PER_MILE) / stride;
}

export function Calculator() {
  const [direction, setDirection] = useState<Direction>("steps-to-miles");
  const [sex, setSex] = useState<Sex>("female");
  const [heightIn, setHeightIn] = useState(67);
  const [steps, setSteps] = useState(10000);
  const [miles, setMiles] = useState(5);

  const { computedSteps, computedMiles, strideFt } = useMemo(() => {
    const stride = strideFeet(heightIn, sex);
    if (direction === "steps-to-miles") {
      const m = stepsToMiles(steps, heightIn, sex);
      return { computedSteps: steps, computedMiles: m, strideFt: stride };
    }
    const s = milesToSteps(miles, heightIn, sex);
    return { computedSteps: s, computedMiles: miles, strideFt: stride };
  }, [direction, sex, heightIn, steps, miles]);

  const quickRuleMiles = direction === "steps-to-miles" ? steps / 2000 : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Stride length varies with pace, terrain, and fitness.
        For exact outdoor distance, use GPS.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Direction"
          value={direction}
          onChange={(v) => setDirection(v as Direction)}
          options={[
            { value: "steps-to-miles", label: "Steps → Miles" },
            { value: "miles-to-steps", label: "Miles → Steps" },
          ]}
        />
        <Segment
          label="Sex"
          value={sex}
          onChange={(v) => setSex(v as Sex)}
          options={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Height"
          type="number"
          inputMode="decimal"
          value={heightIn}
          onChange={(e) => setHeightIn(Number(e.target.value))}
          min={36}
          max={96}
          step={1}
          trailing="in"
          supportingText={`Typical adult range 60-78 in (5'0"-6'6").`}
        />
        {direction === "steps-to-miles" ? (
          <TextField
            label="Steps"
            type="number"
            inputMode="numeric"
            value={steps}
            onChange={(e) => setSteps(Number(e.target.value))}
            min={0}
            max={200000}
            step={100}
            trailing="steps"
          />
        ) : (
          <TextField
            label="Miles"
            type="number"
            inputMode="decimal"
            value={miles}
            onChange={(e) => setMiles(Number(e.target.value))}
            min={0}
            max={100}
            step={0.1}
            trailing="mi"
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Steps</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(computedSteps) ? Math.round(computedSteps).toLocaleString() : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Miles</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(computedMiles) ? `${computedMiles.toFixed(2)} mi` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Estimated stride
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {Number.isFinite(strideFt)
                ? `${strideFt.toFixed(2)} ft (${(strideFt * 12).toFixed(1)} in) per step`
                : "—"}
            </p>
          </div>
          {direction === "steps-to-miles" && Number.isFinite(quickRuleMiles) && (
            <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              CDC quick rule (~2,000 steps/mi): {quickRuleMiles.toFixed(2)} mi.
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Stride-based distance is an estimate. GPS is more accurate outdoors; for indoor or
        treadmill walking, step-based mileage is usually the better number.
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
