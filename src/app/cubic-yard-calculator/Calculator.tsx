"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Cubic yards formula:
//   1 cubic yard = 27 cubic feet (3 ft × 3 ft × 3 ft).
//   Rectangle: cu_yd = (length_ft × width_ft × depth_ft) / 27
//   Circle:    cu_yd = (π × r_ft² × depth_ft) / 27
// Depth unit conversion:
//   inches → feet: divide by 12
//   meters → feet: multiply by 3.280839895 (NIST SP 811 exact conversion)
// TODO_VERIFY: NIST SP 811 — exact unit conversions (1 m = 3.28083989501... ft)
// Source: https://www.nist.gov/pml/special-publication-811

type Shape = "rectangle" | "circle";
type DepthUnit = "in" | "ft" | "m";

const M_TO_FT = 3.280839895; // NIST SP 811 conversion factor

function depthToFeet(depth: number, unit: DepthUnit): number {
  if (!Number.isFinite(depth)) return NaN;
  if (unit === "in") return depth / 12;
  if (unit === "m") return depth * M_TO_FT;
  return depth;
}

function cubicYards(shape: Shape, lengthFt: number, widthFt: number, depthFt: number): number {
  if (!Number.isFinite(depthFt)) return NaN;
  if (shape === "circle") {
    // For a circle the "length" input is treated as diameter (ft); radius = diameter / 2.
    if (!Number.isFinite(lengthFt)) return NaN;
    const r = lengthFt / 2;
    return (Math.PI * r * r * depthFt) / 27;
  }
  if (!Number.isFinite(lengthFt) || !Number.isFinite(widthFt)) return NaN;
  return (lengthFt * widthFt * depthFt) / 27;
}

function cubicFeet(shape: Shape, lengthFt: number, widthFt: number, depthFt: number): number {
  if (!Number.isFinite(depthFt)) return NaN;
  if (shape === "circle") {
    if (!Number.isFinite(lengthFt)) return NaN;
    const r = lengthFt / 2;
    return Math.PI * r * r * depthFt;
  }
  if (!Number.isFinite(lengthFt) || !Number.isFinite(widthFt)) return NaN;
  return lengthFt * widthFt * depthFt;
}

export function Calculator() {
  const [shape, setShape] = useState<Shape>("rectangle");
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(8);
  const [depth, setDepth] = useState(4);
  const [depthUnit, setDepthUnit] = useState<DepthUnit>("in");
  const [waste, setWaste] = useState(10);

  const { cuFt, cuYd, cuYdWithWaste, orderCuYd } = useMemo(() => {
    const dFt = depthToFeet(depth, depthUnit);
    const cf = cubicFeet(shape, length, width, dFt);
    const cy = cubicYards(shape, length, width, dFt);
    const wasteFactor = 1 + (Number.isFinite(waste) ? waste : 0) / 100;
    const cyWaste = cy * wasteFactor;
    return {
      cuFt: cf,
      cuYd: cy,
      cuYdWithWaste: cyWaste,
      orderCuYd: Number.isFinite(cyWaste) ? Math.ceil(cyWaste) : NaN,
    };
  }, [shape, length, width, depth, depthUnit, waste]);

  const lengthLabel = shape === "circle" ? "Diameter" : "Length";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Heads up.</strong> Order whole cubic yards — most suppliers do not split a yard. Add waste for spillage, settling, and uneven ground.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Shape"
          value={shape}
          onChange={(v) => setShape(v as Shape)}
          options={[
            { value: "rectangle", label: "Rectangle" },
            { value: "circle", label: "Circle" },
          ]}
        />
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
          label={lengthLabel}
          type="number"
          inputMode="decimal"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          min={0}
          step={0.1}
          trailing="ft"
          supportingText={shape === "circle" ? "Diameter across the circle." : "Long side of the area."}
        />
        {shape === "rectangle" && (
          <TextField
            label="Width"
            type="number"
            inputMode="decimal"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing="ft"
            supportingText="Short side of the area."
          />
        )}
        <TextField
          label="Depth"
          type="number"
          inputMode="decimal"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          min={0}
          step={0.1}
          trailing={depthUnit}
          supportingText="How deep the fill goes."
        />
        <TextField
          label="Waste factor"
          type="number"
          inputMode="decimal"
          value={waste}
          onChange={(e) => setWaste(Number(e.target.value))}
          min={0}
          max={50}
          step={1}
          trailing="%"
          supportingText="Add 10% for typical jobs; 15–20% for irregular ground."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Volume</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(cuYd) ? `${cuYd.toFixed(2)} cu yd` : "—"}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {Number.isFinite(cuFt) ? `${cuFt.toFixed(2)} cu ft` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              With {Number.isFinite(waste) ? waste : 0}% waste
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(cuYdWithWaste) ? `${cuYdWithWaste.toFixed(2)} cu yd` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: "var(--md-sys-color-tertiary)" }}
            />
            <span className="md-title-medium">
              Order {Number.isFinite(orderCuYd) ? orderCuYd : "—"} cu yd (rounded up to the next whole yard)
            </span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        1 cu yd = 27 cu ft. Weights vary by material — concrete ≈ 4,050 lb/cu yd, gravel ≈ 2,700 lb/cu yd, mulch ≈ 800 lb/cu yd.
        {/* TODO_VERIFY: material density rules of thumb — confirm against supplier spec sheets at publish. Source: USDA NRCS and FHWA aggregate guidance. https://www.fhwa.dot.gov/pavement/pubs/013124.pdf */}
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
