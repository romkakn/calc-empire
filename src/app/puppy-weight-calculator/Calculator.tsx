"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Puppy adult-weight estimators by size class.
// Toy / small / medium: adult_lb ≈ current_lb × (52 / age_weeks)
// Large / giant: adult_lb ≈ weight_at_6_months_lb × 2
// Sources:
//  - AAHA Canine Life Stage Guidelines 2019: growth curves and size-class transitions
//    TODO_VERIFY: https://www.aaha.org/aaha-guidelines/life-stage-canine-2019/life-stage-canine-2019/
//  - WSAVA Global Nutrition Guidelines: growth nutrition by size class
//    TODO_VERIFY: https://wsava.org/global-guidelines/global-nutrition-guidelines/

type SizeClass = "toy" | "small" | "medium" | "large" | "giant";
type Unit = "lb" | "kg";

const LB_PER_KG = 2.20462;

function projectAdultLb(sizeClass: SizeClass, currentLb: number, ageWeeks: number): number {
  if (!Number.isFinite(currentLb) || !Number.isFinite(ageWeeks) || ageWeeks <= 0) return NaN;
  if (sizeClass === "large" || sizeClass === "giant") {
    // Doubling rule projected to 6-month weight when not yet 6 months.
    // ~26 weeks = 6 months; before that, scale current weight to a 26-week estimate, then double.
    const weeksTo26 = Math.min(ageWeeks, 26);
    const sixMonthEstimate = currentLb * (26 / weeksTo26);
    return sixMonthEstimate * 2;
  }
  // toy / small / medium
  return currentLb * (52 / ageWeeks);
}

function sizeClassBand(sizeClass: SizeClass): { min: number; max: number; label: string } {
  switch (sizeClass) {
    case "toy":    return { min: 0,  max: 12, label: "Toy (under 12 lb)" };
    case "small":  return { min: 12, max: 25, label: "Small (12–25 lb)" };
    case "medium": return { min: 25, max: 50, label: "Medium (25–50 lb)" };
    case "large":  return { min: 50, max: 90, label: "Large (50–90 lb)" };
    case "giant":  return { min: 90, max: 200, label: "Giant (90+ lb)" };
  }
}

export function Calculator() {
  const [sizeClass, setSizeClass] = useState<SizeClass>("medium");
  const [unit, setUnit] = useState<Unit>("lb");
  const [ageWeeks, setAgeWeeks] = useState(16);
  const [weight, setWeight] = useState(12);

  const { adultLow, adultMid, adultHigh, displayUnit, classBand } = useMemo(() => {
    const currentLb = unit === "lb" ? weight : weight * LB_PER_KG;
    const mid = projectAdultLb(sizeClass, currentLb, ageWeeks);
    const low = mid * 0.85;
    const high = mid * 1.15;

    const toDisplay = (lb: number) =>
      unit === "lb" ? lb : lb / LB_PER_KG;

    return {
      adultLow: toDisplay(low),
      adultMid: toDisplay(mid),
      adultHigh: toDisplay(high),
      displayUnit: unit,
      classBand: sizeClassBand(sizeClass),
    };
  }, [sizeClass, unit, ageWeeks, weight]);

  const unitLabel = displayUnit === "lb" ? "lb" : "kg";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not veterinary advice. Talk to your veterinarian about
        your puppy&apos;s growth, nutrition, and exercise plan.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Size class"
          value={sizeClass}
          onChange={(v) => setSizeClass(v as SizeClass)}
          options={[
            { value: "toy", label: "Toy" },
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
            { value: "giant", label: "Giant" },
          ]}
        />
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

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Age"
          type="number"
          inputMode="decimal"
          value={ageWeeks}
          onChange={(e) => setAgeWeeks(Number(e.target.value))}
          min={4}
          max={104}
          step={1}
          trailing="weeks"
          supportingText="Estimates stabilize after 16 weeks. Re-run every 4 weeks for accuracy."
        />
        <TextField
          label="Current weight"
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          min={0.5}
          max={300}
          step={0.1}
          trailing={unitLabel}
          supportingText={`Adult range for this class: ${classBand.label}.`}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Adult weight estimate</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(adultMid) ? `${adultMid.toFixed(0)} ${unitLabel}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Range (±15%)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(adultLow) && Number.isFinite(adultHigh)
                ? `${adultLow.toFixed(0)}–${adultHigh.toFixed(0)} ${unitLabel}`
                : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: "var(--md-sys-color-tertiary)" }}
            />
            <span className="md-title-medium">{classBand.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Method: small/medium use current_weight × (52 / age_weeks); large/giant use the 6-month
        doubling rule. {/* TODO_VERIFY: AAHA 2019 size-class thresholds — confirm at publish */}
        Mixed breeds and late-bloomers can land outside the ±15% band.
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
