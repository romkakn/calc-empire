"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Body shape classification from bust/waist/hip circumference.
// Ratio thresholds follow common styling references:
//   - Balanced (bust ~ hip): difference within 5% of the larger value.
//   - Defined waist: waist <= 0.75 of the smaller of bust/hip.
// TODO_VERIFY: 5% balance band and 0.75 waist cutoff are styling conventions, not
// a clinical standard — see CDC Anthropometry Procedures Manual for measurement
// protocol: https://wwwn.cdc.gov/nchs/data/nhanes/2017-2018/manuals/2017_Anthropometry_Procedures_Manual.pdf

type Unit = "in" | "cm";
type Shape =
  | "Hourglass"
  | "Pear"
  | "Apple"
  | "Rectangle"
  | "Inverted triangle"
  | "—";

// Balance band: bust and hip count as "roughly equal" when their ratio is
// within ~5%. Using 0.06 so a bust/hip ratio of 0.95 (e.g., 36/38) still
// reads as balanced, matching common styling chart conventions.
const BALANCE_BAND = 0.06;
const WAIST_DEFINED = 0.75; // waist <= 0.75 × min(bust, hip) → defined waist

function classify(bust: number, waist: number, hip: number): {
  shape: Shape;
  description: string;
} {
  if (!Number.isFinite(bust) || !Number.isFinite(waist) || !Number.isFinite(hip)) {
    return { shape: "—", description: "Enter all three measurements." };
  }
  if (bust <= 0 || waist <= 0 || hip <= 0) {
    return { shape: "—", description: "Enter all three measurements." };
  }

  const larger = Math.max(bust, hip);
  const smaller = Math.min(bust, hip);
  const balanced = (larger - smaller) / larger <= BALANCE_BAND;
  const waistDefined = waist <= WAIST_DEFINED * smaller;
  const waistEqualToBust = Math.abs(waist - bust) / Math.max(waist, bust) <= BALANCE_BAND;
  const waistEqualToHip = Math.abs(waist - hip) / Math.max(waist, hip) <= BALANCE_BAND;

  // Apple: waist meets or exceeds both bust and hip (full midsection, no defined waist).
  if (waist >= bust && waist >= hip) {
    return {
      shape: "Apple",
      description: "Weight tends to sit around the middle. Bust and hips are similar to or smaller than the waist.",
    };
  }

  // Hourglass: bust and hip balanced AND clearly defined waist.
  if (balanced && waistDefined) {
    return {
      shape: "Hourglass",
      description: "Bust and hips are roughly equal, with a clearly defined waist.",
    };
  }

  // Pear (triangle): hip wider than bust by more than the balance band.
  if (hip > bust && (hip - bust) / hip > BALANCE_BAND) {
    return {
      shape: "Pear",
      description: "Hips are wider than the bust, with weight sitting lower on the frame.",
    };
  }

  // Inverted triangle: bust wider than hip by more than the balance band.
  if (bust > hip && (bust - hip) / bust > BALANCE_BAND) {
    return {
      shape: "Inverted triangle",
      description: "Shoulders and bust are wider than the hips, with weight carried higher.",
    };
  }

  // Rectangle: balanced bust/hip but the waist is not much smaller.
  if (balanced && (waistEqualToBust || waistEqualToHip || !waistDefined)) {
    return {
      shape: "Rectangle",
      description: "Bust, waist, and hips are close in measurement, with a straight up-and-down line.",
    };
  }

  // Fallback for edge cases at the threshold.
  return {
    shape: "Rectangle",
    description: "Measurements sit close together without a strongly defined waist.",
  };
}

export function Calculator() {
  const [unit, setUnit] = useState<Unit>("in");
  const [bust, setBust] = useState(36);
  const [waist, setWaist] = useState(26);
  const [hip, setHip] = useState(38);

  const { shape, description, bustHip, waistBust, waistHip } = useMemo(() => {
    const result = classify(bust, waist, hip);
    return {
      shape: result.shape,
      description: result.description,
      bustHip: Number.isFinite(bust / hip) ? bust / hip : NaN,
      waistBust: Number.isFinite(waist / bust) ? waist / bust : NaN,
      waistHip: Number.isFinite(waist / hip) ? waist / hip : NaN,
    };
  }, [bust, waist, hip]);

  const shapeColor =
    shape === "Apple"
      ? "var(--md-sys-color-secondary)"
      : shape === "—"
      ? "var(--md-sys-color-on-surface-variant)"
      : "var(--md-sys-color-tertiary)";

  const unitLabel = unit === "in" ? "in" : "cm";
  const step = unit === "in" ? 0.5 : 1;
  const minVal = unit === "in" ? 20 : 50;
  const maxVal = unit === "in" ? 80 : 200;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Styling tool, not a health screen.</strong> For waist-to-hip ratio in
        a health context, talk to a clinician and use WHO cutoffs.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Measurement unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "in", label: "Inches" },
            { value: "cm", label: "Centimeters" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Bust"
          type="number"
          inputMode="decimal"
          value={bust}
          onChange={(e) => setBust(Number(e.target.value))}
          min={minVal}
          max={maxVal}
          step={step}
          trailing={unitLabel}
          supportingText="Fullest point of the chest, tape level."
        />
        <TextField
          label="Waist"
          type="number"
          inputMode="decimal"
          value={waist}
          onChange={(e) => setWaist(Number(e.target.value))}
          min={minVal}
          max={maxVal}
          step={step}
          trailing={unitLabel}
          supportingText="Narrowest point above the navel."
        />
        <TextField
          label="Hips"
          type="number"
          inputMode="decimal"
          value={hip}
          onChange={(e) => setHip(Number(e.target.value))}
          min={minVal}
          max={maxVal}
          step={step}
          trailing={unitLabel}
          supportingText="Widest point of the seat."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: shapeColor }}
            />
            <span className="md-headline-small font-[var(--md-sys-typescale-mono-font)] text-[var(--md-sys-color-primary)]">
              {shape}
            </span>
          </div>
          <p className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            {description}
          </p>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Bust ÷ Hip
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(bustHip) ? bustHip.toFixed(2) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Waist ÷ Bust
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(waistBust) ? waistBust.toFixed(2) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Waist ÷ Hip
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(waistHip) ? waistHip.toFixed(2) : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Shape rules use a 5% balance band and a 0.75 waist cutoff — styling conventions,
        not a clinical standard. Real bodies often blend categories.
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
