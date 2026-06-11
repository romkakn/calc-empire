"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// AR 600-9 tape-test body-fat equations (US Army, circumference method):
//   Male   BF% = 86.010 * log10(waist_in − neck_in) − 70.041 * log10(height_in) + 36.76
//   Female BF% = 163.205 * log10(waist_in + hip_in − neck_in) − 97.684 * log10(height_in) − 78.387
// TODO_VERIFY: AR 600-9 (Army Body Composition Program) coefficients — confirm current edition.
// Source: https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1023368

type Sex = "male" | "female";
type Unit = "in" | "cm";

const CM_PER_IN = 2.54;

function toInches(val: number, unit: Unit): number {
  if (!Number.isFinite(val)) return NaN;
  return unit === "in" ? val : val / CM_PER_IN;
}

function maleBodyFat(heightIn: number, neckIn: number, waistIn: number): number {
  const diff = waistIn - neckIn;
  if (!(diff > 0) || !(heightIn > 0)) return NaN;
  return 86.010 * Math.log10(diff) - 70.041 * Math.log10(heightIn) + 36.76;
}

function femaleBodyFat(heightIn: number, neckIn: number, waistIn: number, hipIn: number): number {
  const sum = waistIn + hipIn - neckIn;
  if (!(sum > 0) || !(heightIn > 0)) return NaN;
  return 163.205 * Math.log10(sum) - 97.684 * Math.log10(heightIn) - 78.387;
}

// AR 600-9 maximum allowable body-fat percent by age and sex.
// TODO_VERIFY: AR 600-9 max BF% table — confirm at publish.
// Source: https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1023368
function armyMax(sex: Sex, age: number): number | null {
  if (!Number.isFinite(age) || age < 17) return null;
  if (sex === "male") {
    if (age <= 20) return 20;
    if (age <= 27) return 22;
    if (age <= 39) return 24;
    return 26;
  }
  if (age <= 20) return 30;
  if (age <= 27) return 32;
  if (age <= 39) return 34;
  return 36;
}

function complianceBand(bf: number, max: number | null): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(bf)) return { label: "—", tone: "ok" };
  if (max == null) return { label: "Enter age for AR 600-9 check", tone: "ok" };
  if (bf <= max - 2) return { label: `Within standard (max ${max}% for this age)`, tone: "ok" };
  if (bf <= max) return { label: `Near limit (max ${max}%)`, tone: "warn" };
  return { label: `Over standard (max ${max}%)`, tone: "alert" };
}

export function Calculator() {
  const [sex, setSex] = useState<Sex>("male");
  const [unit, setUnit] = useState<Unit>("in");
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(70);
  const [neck, setNeck] = useState(16);
  const [waist, setWaist] = useState(34);
  const [hip, setHip] = useState(38);

  const { bf, band } = useMemo(() => {
    const h = toInches(height, unit);
    const n = toInches(neck, unit);
    const w = toInches(waist, unit);
    const hp = toInches(hip, unit);
    const value =
      sex === "male" ? maleBodyFat(h, n, w) : femaleBodyFat(h, n, w, hp);
    const max = armyMax(sex, age);
    return { bf: value, band: complianceBand(value, max) };
  }, [sex, unit, age, height, neck, waist, hip]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  const unitLabel = unit === "in" ? "in" : "cm";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> The tape test is a screening tool, not a clinical
        measurement. Official AR 600-9 results require a trained measurer.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Sex"
          value={sex}
          onChange={(v) => setSex(v as Sex)}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
        />
        <Segment
          label="Unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "in", label: "in" },
            { value: "cm", label: "cm" },
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
          min={17}
          max={80}
          step={1}
          trailing="yrs"
          supportingText="Used for the AR 600-9 max body-fat table."
        />
        <TextField
          label="Height"
          type="number"
          inputMode="decimal"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          min={unit === "in" ? 48 : 122}
          max={unit === "in" ? 84 : 213}
          step={unit === "in" ? 0.25 : 0.5}
          trailing={unitLabel}
        />
        <TextField
          label="Neck (just below larynx)"
          type="number"
          inputMode="decimal"
          value={neck}
          onChange={(e) => setNeck(Number(e.target.value))}
          min={unit === "in" ? 10 : 25}
          max={unit === "in" ? 25 : 64}
          step={unit === "in" ? 0.25 : 0.5}
          trailing={unitLabel}
        />
        <TextField
          label={sex === "male" ? "Waist (at navel)" : "Waist (narrowest point)"}
          type="number"
          inputMode="decimal"
          value={waist}
          onChange={(e) => setWaist(Number(e.target.value))}
          min={unit === "in" ? 20 : 50}
          max={unit === "in" ? 60 : 152}
          step={unit === "in" ? 0.25 : 0.5}
          trailing={unitLabel}
        />
        {sex === "female" && (
          <TextField
            label="Hip (widest point)"
            type="number"
            inputMode="decimal"
            value={hip}
            onChange={(e) => setHip(Number(e.target.value))}
            min={unit === "in" ? 25 : 63}
            max={unit === "in" ? 65 : 165}
            step={unit === "in" ? 0.25 : 0.5}
            trailing={unitLabel}
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Body fat
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(bf) ? `${bf.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              AR 600-9 max for age
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {armyMax(sex, age) != null ? `${armyMax(sex, age)}%` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Measure twice, average the readings. Tape parallel to the floor, snug but not
        compressing skin. Inputs outside AR 600-9 measurement ranges return no result.
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
