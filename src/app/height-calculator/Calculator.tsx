"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Mid-parental-height method (Tanner et al., 1970; reaffirmed in AAP short-stature reviews):
//   Boy:  adult height ≈ ((dad + mom + 5 in) / 2)   ±4 in (95% CI)
//   Girl: adult height ≈ ((dad + mom − 5 in) / 2)   ±4 in (95% CI)
//   Metric: replace 5 in with 13 cm and 4 in with 10 cm.
// TODO_VERIFY: sex-adjustment constant (5 in / 13 cm) and 95% CI half-width (4 in / 10 cm)
// against AAP Pediatrics in Review — Evaluation of Short and Tall Stature in Children
// https://publications.aap.org/pediatricsinreview/article/37/10/433/35026/Evaluation-of-Short-and-Tall-Stature-in-Children

type Sex = "boy" | "girl";
type Unit = "in" | "cm";

function predictHeight(dad: number, mom: number, sex: Sex, unit: Unit) {
  if (!Number.isFinite(dad) || !Number.isFinite(mom)) return { mid: NaN, low: NaN, high: NaN };
  const sexAdj = unit === "in" ? 5 : 13;
  const ci = unit === "in" ? 4 : 10;
  const signed = sex === "boy" ? sexAdj : -sexAdj;
  const mid = (dad + mom + signed) / 2;
  return { mid, low: mid - ci, high: mid + ci };
}

function formatInches(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const totalIn = Math.round(value);
  const ft = Math.floor(totalIn / 12);
  const inches = totalIn - ft * 12;
  return `${ft}'${inches}"`;
}

export function Calculator() {
  const [sex, setSex] = useState<Sex>("boy");
  const [unit, setUnit] = useState<Unit>("in");
  const [dad, setDad] = useState(70);
  const [mom, setMom] = useState(65);

  const { mid, low, high } = useMemo(
    () => predictHeight(dad, mom, sex, unit),
    [dad, mom, sex, unit],
  );

  const unitLabel = unit === "in" ? "in" : "cm";
  const decimals = unit === "in" ? 1 : 0;

  // typical adult height ranges in each unit, for the input clamps
  const minH = unit === "in" ? 48 : 122;
  const maxH = unit === "in" ? 90 : 230;
  const step = unit === "in" ? 0.5 : 1;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not medical advice. For a clinical estimate,
        ask your pediatrician about a bone-age x-ray.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Child's sex"
          value={sex}
          onChange={(v) => setSex(v as Sex)}
          options={[
            { value: "boy", label: "Boy" },
            { value: "girl", label: "Girl" },
          ]}
        />
        <Segment
          label="Unit"
          value={unit}
          onChange={(v) => {
            const next = v as Unit;
            if (next === unit) return;
            // convert current values so the user keeps the same real height
            if (next === "cm") {
              setDad((d) => Math.round(d * 2.54));
              setMom((m) => Math.round(m * 2.54));
            } else {
              setDad((d) => Math.round((d / 2.54) * 2) / 2);
              setMom((m) => Math.round((m / 2.54) * 2) / 2);
            }
            setUnit(next);
          }}
          options={[
            { value: "in", label: "Inches" },
            { value: "cm", label: "Centimeters" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Father's height"
          type="number"
          inputMode="decimal"
          value={dad}
          onChange={(e) => setDad(Number(e.target.value))}
          min={minH}
          max={maxH}
          step={step}
          trailing={unitLabel}
          supportingText={unit === "in" ? "1 ft = 12 in. Average US adult male ≈ 69 in." : "Average US adult male ≈ 175 cm."}
        />
        <TextField
          label="Mother's height"
          type="number"
          inputMode="decimal"
          value={mom}
          onChange={(e) => setMom(Number(e.target.value))}
          min={minH}
          max={maxH}
          step={step}
          trailing={unitLabel}
          supportingText={unit === "in" ? "Average US adult female ≈ 64 in." : "Average US adult female ≈ 162 cm."}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Predicted adult height
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(mid) ? `${mid.toFixed(decimals)} ${unitLabel}` : "—"}
            </p>
            {unit === "in" && Number.isFinite(mid) && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                {formatInches(mid)}
              </p>
            )}
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              95% likely range
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(low) && Number.isFinite(high)
                ? `${low.toFixed(decimals)}–${high.toFixed(decimals)} ${unitLabel}`
                : "—"}
            </p>
            {unit === "in" && Number.isFinite(low) && Number.isFinite(high) && (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)]">
                {formatInches(low)} to {formatInches(high)}
              </p>
            )}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Mid-parental method, Tanner et al. (1970). The ±{unit === "in" ? "4 in" : "10 cm"} band
        is a 95% confidence interval — not a guarantee. Bone-age x-rays give a tighter estimate.
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
