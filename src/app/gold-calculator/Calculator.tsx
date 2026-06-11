"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Gold melt value:
//   per-gram spot = spot_per_troy_oz / 31.1035
//   value        = weight_grams * (karat / 24) * per-gram spot
// Constants:
//   1 troy oz = 31.1034768 g (NIST)
//   1 pennyweight (dwt) = 1.55517384 g (20 dwt per troy oz)
// TODO_VERIFY: troy-ounce constant per NIST SI units of mass:
//   https://www.nist.gov/pml/owm/si-units-mass

const GRAMS_PER_TROY_OZ = 31.1035;
const GRAMS_PER_DWT = 1.55517;

type Unit = "g" | "ozt" | "dwt";
type Karat = "10" | "14" | "18" | "22" | "24";

const KARAT_FRACTION: Record<Karat, number> = {
  "10": 10 / 24, // 0.4167
  "14": 14 / 24, // 0.5833
  "18": 18 / 24, // 0.75
  "22": 22 / 24, // 0.9167
  "24": 24 / 24, // 1.0
};

function toGrams(weight: number, unit: Unit): number {
  if (!Number.isFinite(weight)) return NaN;
  if (unit === "g") return weight;
  if (unit === "ozt") return weight * GRAMS_PER_TROY_OZ;
  return weight * GRAMS_PER_DWT;
}

function meltValue(weight: number, unit: Unit, karat: Karat, spotPerOz: number): number {
  const grams = toGrams(weight, unit);
  if (!Number.isFinite(grams) || !Number.isFinite(spotPerOz)) return NaN;
  const perGram = spotPerOz / GRAMS_PER_TROY_OZ;
  return grams * KARAT_FRACTION[karat] * perGram;
}

function formatUSD(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export function Calculator() {
  const [weight, setWeight] = useState(10);
  const [unit, setUnit] = useState<Unit>("g");
  const [karat, setKarat] = useState<Karat>("14");
  const [spot, setSpot] = useState(2400);

  const { value, perGram, pureGrams, dealer70, dealer90 } = useMemo(() => {
    const v = meltValue(weight, unit, karat, spot);
    const pg = spot / GRAMS_PER_TROY_OZ;
    const grams = toGrams(weight, unit);
    const pure = Number.isFinite(grams) ? grams * KARAT_FRACTION[karat] : NaN;
    return {
      value: v,
      perGram: pg,
      pureGrams: pure,
      dealer70: v * 0.7,
      dealer90: v * 0.9,
    };
  }, [weight, unit, karat, spot]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Melt value only.</strong> Buyers usually pay 60–80% of this number.
        Spot prices change every few seconds during trading hours — pull a fresh quote
        before you sell.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Karat"
          value={karat}
          onChange={(v) => setKarat(v as Karat)}
          options={[
            { value: "10", label: "10k" },
            { value: "14", label: "14k" },
            { value: "18", label: "18k" },
            { value: "22", label: "22k" },
            { value: "24", label: "24k" },
          ]}
        />
        <Segment
          label="Weight unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "g", label: "grams" },
            { value: "ozt", label: "troy oz" },
            { value: "dwt", label: "pennyweight" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Weight"
          type="number"
          inputMode="decimal"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          min={0}
          max={100000}
          step={0.01}
          trailing={unit === "g" ? "g" : unit === "ozt" ? "oz t" : "dwt"}
          supportingText="Use a gram or jewelry scale. Weigh stones separately."
        />
        <TextField
          label="Spot price (per troy oz)"
          type="number"
          inputMode="decimal"
          value={spot}
          onChange={(e) => setSpot(Number(e.target.value))}
          min={0}
          max={100000}
          step={1}
          trailing="USD"
          supportingText="From LBMA or a live market feed. Updates every few seconds."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Melt value
            </p>
            <p className="mt-1 md-display-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formatUSD(value)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Spot per gram
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {formatUSD(perGram)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Pure gold content
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(pureGrams) ? `${pureGrams.toFixed(3)} g` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Scrap buyer (70%)
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-secondary)]">
              {formatUSD(dealer70)}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Refiner offer (90%)
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-tertiary)]">
              {formatUSD(dealer90)}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Values shown in USD. Karat fractions follow the 24-part purity scale.
        {/* TODO_VERIFY: troy-ounce conversion 31.1035 g per NIST:
            https://www.nist.gov/pml/owm/si-units-mass */}
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
