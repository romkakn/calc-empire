"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Gravel volume → tons:
//   cubic_yards = length_ft × width_ft × depth_ft / 27
//   tons (US short) = cubic_yards × density (ton/yd³)
// Default density 1.4 ton/yd³ ≈ typical washed gravel.
// TODO_VERIFY: 1.4 ton/yd³ washed-gravel density — USDA NRCS Soil Mechanics / National Engineering Handbook
// (https://directives.sc.egov.usda.gov/) — confirm against the published table at publish time.

type DepthUnit = "in" | "ft" | "m";

const FT_PER_M = 3.28084;

function toFeet(value: number, unit: DepthUnit): number {
  if (!Number.isFinite(value)) return NaN;
  if (unit === "in") return value / 12;
  if (unit === "m") return value * FT_PER_M;
  return value;
}

export function Calculator() {
  const [length, setLength] = useState(30); // ft
  const [width, setWidth] = useState(10); // ft
  const [depth, setDepth] = useState(4); // in by default
  const [depthUnit, setDepthUnit] = useState<DepthUnit>("in");
  const [density, setDensity] = useState(1.4); // ton/yd³
  const [waste, setWaste] = useState(10); // % overage

  const result = useMemo(() => {
    const depthFt = toFeet(depth, depthUnit);
    if (![length, width, depthFt, density].every((n) => Number.isFinite(n) && n >= 0)) {
      return { cuYd: NaN, tons: NaN, cuYdWithWaste: NaN, tonsWithWaste: NaN };
    }
    const cuFt = length * width * depthFt;
    const cuYd = cuFt / 27;
    const tons = cuYd * density;
    const factor = 1 + (Number.isFinite(waste) ? waste : 0) / 100;
    return {
      cuYd,
      tons,
      cuYdWithWaste: cuYd * factor,
      tonsWithWaste: tons * factor,
    };
  }, [length, width, depth, depthUnit, density, waste]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> Suppliers sell in fixed truckload sizes. Confirm
        the exact density of the product you order — gravel weight varies by stone type,
        size, and moisture.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Depth unit"
          value={depthUnit}
          onChange={(v) => setDepthUnit(v as DepthUnit)}
          options={[
            { value: "in", label: "in" },
            { value: "ft", label: "ft" },
            { value: "m", label: "m" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Length"
          type="number"
          inputMode="decimal"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={0}
          step={0.5}
          trailing="ft"
        />
        <TextField
          label="Width"
          type="number"
          inputMode="decimal"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          min={0}
          step={0.5}
          trailing="ft"
        />
        <TextField
          label="Depth"
          type="number"
          inputMode="decimal"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          min={0}
          step={0.5}
          trailing={depthUnit}
          supportingText="Walkway ~2 in · driveway ~4 in · base layer ~6 in."
        />
        <TextField
          label="Density"
          type="number"
          inputMode="decimal"
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          min={0.8}
          max={2.2}
          step={0.05}
          trailing="ton/yd³"
          supportingText="Default 1.4. Pea gravel ~1.4 · crushed stone ~1.5 · wet/dense up to ~1.7."
        />
        <TextField
          label="Waste overage"
          type="number"
          inputMode="decimal"
          value={waste}
          onChange={(e) => setWaste(Number(e.target.value))}
          min={0}
          max={30}
          step={1}
          trailing="%"
          supportingText="Typical 5–10% for compaction, spillage, and edges."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Volume</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.cuYd) ? `${result.cuYd.toFixed(2)} cu yd` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Weight</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result.tons) ? `${result.tons.toFixed(2)} US tons` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Order with {Number.isFinite(waste) ? waste : 0}% waste
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {Number.isFinite(result.cuYdWithWaste) && Number.isFinite(result.tonsWithWaste)
                ? `${result.cuYdWithWaste.toFixed(2)} cu yd · ${result.tonsWithWaste.toFixed(2)} US tons`
                : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Volume uses length × width × depth ÷ 27 (cubic feet to cubic yards). Weight =
        volume × density. {/* TODO_VERIFY: density table — USDA NRCS / AASHTO M 145 at publish */}
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
