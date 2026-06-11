"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Volume formulas (standard Euclidean geometry):
//   Cube:              V = a³
//   Rectangular prism: V = l · w · h
//   Sphere:            V = (4/3) · π · r³
//   Cylinder:          V = π · r² · h
//   Cone:              V = (1/3) · π · r² · h
//   Square pyramid:    V = (1/3) · a² · h

type Shape = "cube" | "box" | "sphere" | "cylinder" | "cone" | "pyramid";

function volume(
  shape: Shape,
  d: { a: number; l: number; w: number; h: number; r: number }
): number {
  switch (shape) {
    case "cube":
      return d.a ** 3;
    case "box":
      return d.l * d.w * d.h;
    case "sphere":
      return (4 / 3) * Math.PI * d.r ** 3;
    case "cylinder":
      return Math.PI * d.r ** 2 * d.h;
    case "cone":
      return (1 / 3) * Math.PI * d.r ** 2 * d.h;
    case "pyramid":
      return (1 / 3) * d.a ** 2 * d.h;
  }
}

function fmt(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "—";
  if (n === 0) return "0";
  if (n >= 100000 || n < 0.01) return n.toExponential(3);
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function Calculator() {
  const [shape, setShape] = useState<Shape>("cylinder");
  const [unit, setUnit] = useState("m");
  const [a, setA] = useState(2);
  const [l, setL] = useState(3);
  const [w, setW] = useState(2);
  const [h, setH] = useState(10);
  const [r, setR] = useState(4);

  const v = useMemo(
    () => volume(shape, { a, l, w, h, r }),
    [shape, a, l, w, h, r]
  );

  const cubicUnit = `${unit}³`;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Shape"
          value={shape}
          onChange={(v) => setShape(v as Shape)}
          options={[
            { value: "cube", label: "Cube" },
            { value: "box", label: "Box" },
            { value: "sphere", label: "Sphere" },
            { value: "cylinder", label: "Cylinder" },
            { value: "cone", label: "Cone" },
            { value: "pyramid", label: "Pyramid" },
          ]}
        />
        <Segment
          label="Unit"
          value={unit}
          onChange={setUnit}
          options={[
            { value: "cm", label: "cm" },
            { value: "m", label: "m" },
            { value: "in", label: "in" },
            { value: "ft", label: "ft" },
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
            trailing={unit}
          />
        )}

        {shape === "box" && (
          <>
            <TextField
              label="Length (l)"
              type="number"
              inputMode="decimal"
              value={l}
              onChange={(e) => setL(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
            <TextField
              label="Width (w)"
              type="number"
              inputMode="decimal"
              value={w}
              onChange={(e) => setW(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
          </>
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
            trailing={unit}
            supportingText="Half the diameter."
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
              trailing={unit}
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
          </>
        )}

        {shape === "cone" && (
          <>
            <TextField
              label="Base radius (r)"
              type="number"
              inputMode="decimal"
              value={r}
              onChange={(e) => setR(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
          </>
        )}

        {shape === "pyramid" && (
          <>
            <TextField
              label="Base edge (a)"
              type="number"
              inputMode="decimal"
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
              supportingText="Square base — all four edges equal."
            />
            <TextField
              label="Height (h)"
              type="number"
              inputMode="decimal"
              value={h}
              onChange={(e) => setH(Number(e.target.value))}
              min={0}
              step={0.1}
              trailing={unit}
            />
          </>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Volume
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {fmt(v)} {cubicUnit}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Shape
            </p>
            <p className="mt-1 md-title-medium capitalize">
              {shape === "box" ? "Rectangular prism" : shape}
            </p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Enter every dimension in the same unit. Result is in cubic units of that unit
        (1 m³ = 1,000 L; 1 ft³ ≈ 7.481 US gallons).
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
