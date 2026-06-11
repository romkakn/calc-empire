"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Surface area formulas (standard Euclidean geometry):
//   cube:               SA = 6a^2
//   sphere:             SA = 4 * pi * r^2
//   cylinder (closed):  SA = 2 * pi * r * (r + h)
//   cone (closed):      SA = pi * r * (r + slant)
//   rectangular prism:  SA = 2 * (l*w + l*h + w*h)
//   square pyramid:     SA = a^2 + 2 * a * slant

type Shape =
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone"
  | "rect-prism"
  | "square-pyramid";

const PI = Math.PI;

function cubeSA(a: number) {
  return 6 * a * a;
}
function sphereSA(r: number) {
  return 4 * PI * r * r;
}
function cylinderSA(r: number, h: number) {
  return 2 * PI * r * (r + h);
}
function coneSA(r: number, slant: number) {
  return PI * r * (r + slant);
}
function rectPrismSA(l: number, w: number, h: number) {
  return 2 * (l * w + l * h + w * h);
}
function squarePyramidSA(a: number, slant: number) {
  return a * a + 2 * a * slant;
}

function fmt(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n >= 1000) return n.toFixed(1);
  if (n >= 10) return n.toFixed(2);
  return n.toFixed(3);
}

export function Calculator() {
  const [shape, setShape] = useState<Shape>("cylinder");
  const [a, setA] = useState(5);
  const [r, setR] = useState(5);
  const [h, setH] = useState(10);
  const [slant, setSlant] = useState(8);
  const [l, setL] = useState(4);
  const [w, setW] = useState(3);
  const [pyrSide, setPyrSide] = useState(6);
  const [pyrSlant, setPyrSlant] = useState(5);

  const { area, formula, breakdown } = useMemo(() => {
    switch (shape) {
      case "cube": {
        const sa = cubeSA(a);
        return {
          area: sa,
          formula: "6a²",
          breakdown: `6 × ${a}² = 6 × ${(a * a).toFixed(3)} = ${fmt(sa)}`,
        };
      }
      case "sphere": {
        const sa = sphereSA(r);
        return {
          area: sa,
          formula: "4πr²",
          breakdown: `4 × π × ${r}² = ${(4 * r * r).toFixed(3)}π ≈ ${fmt(sa)}`,
        };
      }
      case "cylinder": {
        const sa = cylinderSA(r, h);
        return {
          area: sa,
          formula: "2πr(r + h)",
          breakdown: `2 × π × ${r} × (${r} + ${h}) = ${(2 * r * (r + h)).toFixed(3)}π ≈ ${fmt(sa)}`,
        };
      }
      case "cone": {
        const sa = coneSA(r, slant);
        return {
          area: sa,
          formula: "πr(r + slant)",
          breakdown: `π × ${r} × (${r} + ${slant}) = ${(r * (r + slant)).toFixed(3)}π ≈ ${fmt(sa)}`,
        };
      }
      case "rect-prism": {
        const sa = rectPrismSA(l, w, h);
        return {
          area: sa,
          formula: "2(lw + lh + wh)",
          breakdown: `2 × (${l}×${w} + ${l}×${h} + ${w}×${h}) = 2 × ${(l * w + l * h + w * h).toFixed(3)} = ${fmt(sa)}`,
        };
      }
      case "square-pyramid": {
        const sa = squarePyramidSA(pyrSide, pyrSlant);
        return {
          area: sa,
          formula: "a² + 2a·slant",
          breakdown: `${pyrSide}² + 2 × ${pyrSide} × ${pyrSlant} = ${(pyrSide * pyrSide).toFixed(3)} + ${(2 * pyrSide * pyrSlant).toFixed(3)} = ${fmt(sa)}`,
        };
      }
    }
  }, [shape, a, r, h, slant, l, w, pyrSide, pyrSlant]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Shape"
          value={shape}
          onChange={(v) => setShape(v as Shape)}
          options={[
            { value: "cube", label: "Cube" },
            { value: "sphere", label: "Sphere" },
            { value: "cylinder", label: "Cylinder" },
            { value: "cone", label: "Cone" },
            { value: "rect-prism", label: "Rect. prism" },
            { value: "square-pyramid", label: "Sq. pyramid" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {shape === "cube" && (
          <TextField
            label="Side length (a)"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing="units"
            supportingText="Every edge of a cube is the same length."
          />
        )}

        {shape === "sphere" && (
          <TextField
            label="Radius (r)"
            type="number"
            inputMode="decimal"
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            min={0}
            step={0.1}
            trailing="units"
            supportingText="Distance from the center to the surface."
          />
        )}

        {shape === "cylinder" && (
          <>
            <TextField
              label="Radius (r)"
              type="number"
              inputMode="decimal"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
              supportingText="Includes both circular ends plus the curved side."
            />
          </>
        )}

        {shape === "cone" && (
          <>
            <TextField
              label="Radius (r)"
              type="number"
              inputMode="decimal"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
            />
            <TextField
              label="Slant height (ℓ)"
              type="number"
              inputMode="decimal"
              value={slant}
              onChange={(e) => setSlant(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
              supportingText="Slant goes from the tip down the side, not straight down."
            />
          </>
        )}

        {shape === "rect-prism" && (
          <>
            <TextField
              label="Length (l)"
              type="number"
              inputMode="decimal"
              value={l}
              onChange={(e) => setL(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
            />
            <TextField
              label="Width (w)"
              type="number"
              inputMode="decimal"
              value={w}
              onChange={(e) => setW(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
              supportingText="Six rectangular faces in three matching pairs."
            />
          </>
        )}

        {shape === "square-pyramid" && (
          <>
            <TextField
              label="Base side (a)"
              type="number"
              inputMode="decimal"
              value={pyrSide}
              onChange={(e) => setPyrSide(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
            />
            <TextField
              label="Slant height (ℓ)"
              type="number"
              inputMode="decimal"
              value={pyrSlant}
              onChange={(e) => setPyrSlant(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing="units"
              supportingText="From the apex down the middle of a triangular face."
            />
          </>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Formula
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {formula}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total surface area
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(area)} sq units
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Work shown
            </p>
            <p className="mt-1 md-body-medium font-[var(--md-sys-typescale-mono-font)]">
              {breakdown}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Result is the total (outer) surface area in square units. All inputs must
        share the same unit — feet in gives square feet out.
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
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
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
