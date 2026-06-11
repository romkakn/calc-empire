"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Stone volume + weight math:
//   cubic_yards = (length_ft × width_ft × depth_ft) / 27
//   tons        = cubic_yards × density (ton/yd³)
// Default density 1.5 ton/yd³ — typical for crushed stone.
// TODO_VERIFY: density range for aggregate types — see AASHTO M 145
// https://store.transportation.org/Common/DownloadContentFiles?id=2236

type DepthUnit = "in" | "ft";

function cubicYards(lengthFt: number, widthFt: number, depthFt: number) {
  if (![lengthFt, widthFt, depthFt].every(Number.isFinite)) return NaN;
  if (lengthFt <= 0 || widthFt <= 0 || depthFt <= 0) return NaN;
  return (lengthFt * widthFt * depthFt) / 27;
}

function toFeet(depth: number, unit: DepthUnit) {
  if (!Number.isFinite(depth)) return NaN;
  return unit === "ft" ? depth : depth / 12;
}

export function Calculator() {
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(10);
  const [depth, setDepth] = useState(4);
  const [depthUnit, setDepthUnit] = useState<DepthUnit>("in");
  const [density, setDensity] = useState(1.5);

  const { yards, tons, yardsWithBuffer, tonsWithBuffer } = useMemo(() => {
    const depthFt = toFeet(depth, depthUnit);
    const y = cubicYards(length, width, depthFt);
    const t = Number.isFinite(y) ? y * density : NaN;
    return {
      yards: y,
      tons: t,
      yardsWithBuffer: Number.isFinite(y) ? y * 1.10 : NaN,
      tonsWithBuffer: Number.isFinite(t) ? t * 1.10 : NaN,
    };
  }, [length, width, depth, depthUnit, density]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimates only.</strong> Supplier weights vary by stone type and moisture.
        Confirm density with your quarry or landscape yard before ordering.
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
          step={depthUnit === "in" ? 0.5 : 0.1}
          trailing={depthUnit}
          supportingText="Decorative 2–3 in · walkway 3–4 in · driveway 4–6 in"
        />
        <TextField
          label="Density (ton per cubic yard)"
          type="number"
          inputMode="decimal"
          value={density}
          onChange={(e) => setDensity(Number(e.target.value))}
          min={0.5}
          max={3}
          step={0.05}
          trailing="ton/yd³"
          supportingText="Default 1.5 for crushed stone. Pea gravel ~1.3 · base limestone ~1.6"
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Volume</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(yards) ? `${yards.toFixed(1)} yd³` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Weight</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(tons) ? `${tons.toFixed(1)} US tons` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-2 pt-3 border-t border-[var(--md-sys-color-outline-variant)]">
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Order (+10% buffer)</p>
              <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {Number.isFinite(yardsWithBuffer) ? `${yardsWithBuffer.toFixed(1)} yd³` : "—"}
              </p>
            </div>
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Or</p>
              <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {Number.isFinite(tonsWithBuffer) ? `${tonsWithBuffer.toFixed(1)} US tons` : "—"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Loose volume — stone compacts about 10–20% under traffic. Add a larger buffer for
        soft subgrade or sloped sites.
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
