"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Mulch volume math:
//   cubic_feet  = L_ft × W_ft × depth_ft
//   cubic_yards = cubic_feet / 27
//   depth_ft    = depth_in / 12
//   bags        = cubic_feet / bag_size_cuft
// Density references (informational, not part of volume formula):
//   hardwood ≈ 700 lb/yd³, cypress ≈ 500 lb/yd³, rubber ≈ 800 lb/yd³.
//   TODO_VERIFY: density bands — confirm against Mulch and Soil Council product specs
//   https://mulchandsoilcouncil.org/

type DepthUnit = "in" | "ft";
type BagSize = "1" | "2" | "3";
type MulchType = "hardwood" | "cypress" | "rubber";

const DENSITY_LB_PER_YD3: Record<MulchType, number> = {
  hardwood: 700,
  cypress: 500,
  rubber: 800,
};

function computeMulch(
  lengthFt: number,
  widthFt: number,
  depth: number,
  depthUnit: DepthUnit,
  bagSize: BagSize,
) {
  if (![lengthFt, widthFt, depth].every(Number.isFinite)) {
    return { cubicFeet: NaN, cubicYards: NaN, bags: NaN, depthFt: NaN };
  }
  const depthFt = depthUnit === "in" ? depth / 12 : depth;
  const cubicFeet = lengthFt * widthFt * depthFt;
  const cubicYards = cubicFeet / 27;
  const bags = cubicFeet / Number(bagSize);
  return { cubicFeet, cubicYards, bags, depthFt };
}

export function Calculator() {
  const [length, setLength] = useState(20);
  const [width, setWidth] = useState(10);
  const [depth, setDepth] = useState(3);
  const [depthUnit, setDepthUnit] = useState<DepthUnit>("in");
  const [bagSize, setBagSize] = useState<BagSize>("2");
  const [mulchType, setMulchType] = useState<MulchType>("hardwood");

  const { cubicFeet, cubicYards, bags } = useMemo(
    () => computeMulch(length, width, depth, depthUnit, bagSize),
    [length, width, depth, depthUnit, bagSize],
  );

  const weightLb = Number.isFinite(cubicYards)
    ? cubicYards * DENSITY_LB_PER_YD3[mulchType]
    : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Tip:</strong> Order about 10% extra for settling and edge trimming.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Depth unit"
          value={depthUnit}
          onChange={(v) => setDepthUnit(v as DepthUnit)}
          options={[
            { value: "in", label: "Inches" },
            { value: "ft", label: "Feet" },
          ]}
        />
        <Segment
          label="Bag size"
          value={bagSize}
          onChange={(v) => setBagSize(v as BagSize)}
          options={[
            { value: "1", label: "1 cu ft" },
            { value: "2", label: "2 cu ft" },
            { value: "3", label: "3 cu ft" },
          ]}
        />
        <Segment
          label="Mulch type"
          value={mulchType}
          onChange={(v) => setMulchType(v as MulchType)}
          options={[
            { value: "hardwood", label: "Hardwood" },
            { value: "cypress", label: "Cypress" },
            { value: "rubber", label: "Rubber" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-3"
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
          max={1000}
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
          max={1000}
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
          max={depthUnit === "in" ? 24 : 2}
          step={depthUnit === "in" ? 0.5 : 0.05}
          trailing={depthUnit}
          supportingText="Standard depth is 2–4 in for landscape beds."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Cubic yards</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(cubicYards) ? `${cubicYards.toFixed(2)} yd³` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Cubic feet</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(cubicFeet) ? `${cubicFeet.toFixed(1)} ft³` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Bags ({bagSize} cu ft)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(bags) ? Math.ceil(bags) : "—"}
            </p>
          </div>
          <div className="sm:col-span-3 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: "var(--md-sys-color-tertiary)" }}
            />
            <span className="md-title-medium">
              Estimated weight: {Number.isFinite(weightLb) ? `${Math.round(weightLb).toLocaleString()} lb` : "—"} ({mulchType})
            </span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Bag count is rounded up. Densities are typical — actual weight varies with moisture content.
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
