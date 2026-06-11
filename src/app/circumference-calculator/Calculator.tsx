"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Circle formulas:
//   C = 2 * pi * r = pi * d
//   A = pi * r^2
//   From area: r = sqrt(A / pi)

type Known = "radius" | "diameter" | "area";

function fromRadius(r: number) {
  if (!Number.isFinite(r) || r <= 0) return { r: NaN, d: NaN, c: NaN, a: NaN };
  return {
    r,
    d: 2 * r,
    c: 2 * Math.PI * r,
    a: Math.PI * r * r,
  };
}
function fromDiameter(d: number) {
  if (!Number.isFinite(d) || d <= 0) return { r: NaN, d: NaN, c: NaN, a: NaN };
  const r = d / 2;
  return fromRadius(r);
}
function fromArea(a: number) {
  if (!Number.isFinite(a) || a <= 0) return { r: NaN, d: NaN, c: NaN, a: NaN };
  const r = Math.sqrt(a / Math.PI);
  return fromRadius(r);
}

function fmt(n: number, decimals = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function Calculator() {
  const [known, setKnown] = useState<Known>("radius");
  const [unit, setUnit] = useState("cm");
  const [radius, setRadius] = useState(5);
  const [diameter, setDiameter] = useState(10);
  const [area, setArea] = useState(78.54);

  const { r, d, c, a } = useMemo(() => {
    if (known === "radius") return fromRadius(radius);
    if (known === "diameter") return fromDiameter(diameter);
    return fromArea(area);
  }, [known, radius, diameter, area]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="What do you know?"
          value={known}
          onChange={(v) => setKnown(v as Known)}
          options={[
            { value: "radius", label: "Radius" },
            { value: "diameter", label: "Diameter" },
            { value: "area", label: "Area" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {known === "radius" && (
          <TextField
            label="Radius (r)"
            type="number"
            inputMode="decimal"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing={unit}
            supportingText="Distance from the center to the edge."
          />
        )}
        {known === "diameter" && (
          <TextField
            label="Diameter (d)"
            type="number"
            inputMode="decimal"
            value={diameter}
            onChange={(e) => setDiameter(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing={unit}
            supportingText="Distance straight across through the center."
          />
        )}
        {known === "area" && (
          <TextField
            label="Area (A)"
            type="number"
            inputMode="decimal"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing={`${unit}^2`}
            supportingText="Surface area enclosed by the circle."
          />
        )}
        <TextField
          label="Unit label"
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value || "cm")}
          supportingText="Display only — try cm, m, in, ft."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Circumference (C)</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(c) ? `${fmt(c)} ${unit}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Area (A)</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(a) ? `${fmt(a)} ${unit}^2` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Radius (r)</p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(r) ? `${fmt(r)} ${unit}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Diameter (d)</p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
              {Number.isFinite(d) ? `${fmt(d)} ${unit}` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Uses Math.PI (~15 digits of pi). Units are display labels — keep them
        consistent. Area uses {unit}^2 regardless of which length unit you typed.
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
