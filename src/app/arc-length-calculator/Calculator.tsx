"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Arc length of a circular arc:
//   s = r × θ      (θ in radians)
//   s = r × θ° × π / 180   (θ in degrees)
// Sector area:
//   A = ½ × r² × θ_rad
// Full circle (θ = 2π rad or 360°): s = 2πr  (circumference).

type AngleUnit = "deg" | "rad";

function toRadians(angle: number, unit: AngleUnit) {
  if (!Number.isFinite(angle)) return NaN;
  return unit === "rad" ? angle : (angle * Math.PI) / 180;
}

function fractionOfCircle(thetaRad: number) {
  if (!Number.isFinite(thetaRad)) return NaN;
  return thetaRad / (2 * Math.PI);
}

export function Calculator() {
  const [radius, setRadius] = useState(10);
  const [angle, setAngle] = useState(60);
  const [unit, setUnit] = useState<AngleUnit>("deg");

  const { arcLength, sectorArea, thetaRad, fraction } = useMemo(() => {
    const rad = toRadians(angle, unit);
    const r = Number.isFinite(radius) && radius > 0 ? radius : NaN;
    const s = r * rad;
    const a = 0.5 * r * r * rad;
    return {
      arcLength: s,
      sectorArea: a,
      thetaRad: rad,
      fraction: fractionOfCircle(rad),
    };
  }, [radius, angle, unit]);

  const fmt = (n: number, digits = 2) =>
    Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Angle unit"
          value={unit}
          onChange={(v) => setUnit(v as AngleUnit)}
          options={[
            { value: "deg", label: "Degrees" },
            { value: "rad", label: "Radians" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Radius"
          type="number"
          inputMode="decimal"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          min={0}
          step={0.1}
          supportingText="Distance from center to arc. Result uses the same unit."
        />
        <TextField
          label="Central angle"
          type="number"
          inputMode="decimal"
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          step={unit === "deg" ? 1 : 0.01}
          trailing={unit === "deg" ? "°" : "rad"}
          supportingText={unit === "deg" ? "Full circle = 360°." : "Full circle = 2π ≈ 6.283 rad."}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Arc length</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(arcLength)}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">s = r × θ<sub>rad</sub></p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Sector area
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(sectorArea)}
            </p>
            <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">A = ½ × r² × θ<sub>rad</sub></p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Angle in radians</p>
            <p className="mt-1 md-title-medium tabular-nums">{fmt(thetaRad, 4)}</p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Fraction of full circle</p>
            <p className="mt-1 md-title-medium tabular-nums">
              {Number.isFinite(fraction) ? `${fmt(fraction * 100, 2)}%` : "—"}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Arc length and sector area use the same length unit as the radius (squared for area).
        Conversion uses π / 180 between degrees and radians.
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
