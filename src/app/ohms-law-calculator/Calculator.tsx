"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Ohms law and DC power identities (NIST SI units: V, A, ohm, W):
//   V = I * R
//   P = V * I = I^2 * R = V^2 / R
// Given any two of {V, I, R, P}, the other two are determined.

type Unknown = "V" | "I" | "R" | "P";

type Solution = {
  V: number;
  I: number;
  R: number;
  P: number;
};

function solve(unknown: Unknown, a: number, b: number): Solution {
  // Pair labels by unknown:
  //   V unknown -> a=I, b=R
  //   I unknown -> a=V, b=R
  //   R unknown -> a=V, b=I
  //   P unknown -> a=V, b=I
  let V = NaN, I = NaN, R = NaN, P = NaN;
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return { V, I, R, P };
  }
  if (unknown === "V") {
    I = a; R = b;
    V = I * R;
    P = V * I;
  } else if (unknown === "I") {
    V = a; R = b;
    if (R === 0) return { V, I: NaN, R, P: NaN };
    I = V / R;
    P = V * I;
  } else if (unknown === "R") {
    V = a; I = b;
    if (I === 0) return { V, I, R: NaN, P: NaN };
    R = V / I;
    P = V * I;
  } else {
    V = a; I = b;
    P = V * I;
    if (I === 0) {
      R = NaN;
    } else {
      R = V / I;
    }
  }
  return { V, I, R, P };
}

function fmt(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  const abs = Math.abs(n);
  if (abs >= 1000 || abs < 0.01) return n.toExponential(2);
  return Number(n.toFixed(digits)).toString();
}

export function Calculator() {
  const [unknown, setUnknown] = useState<Unknown>("V");
  const [a, setA] = useState(2);
  const [b, setB] = useState(5);

  const labels = useMemo(() => {
    if (unknown === "V") return { a: { name: "Current (I)", unit: "A" }, b: { name: "Resistance (R)", unit: "Ω" } };
    if (unknown === "I") return { a: { name: "Voltage (V)", unit: "V" }, b: { name: "Resistance (R)", unit: "Ω" } };
    if (unknown === "R") return { a: { name: "Voltage (V)", unit: "V" }, b: { name: "Current (I)", unit: "A" } };
    return { a: { name: "Voltage (V)", unit: "V" }, b: { name: "Current (I)", unit: "A" } };
  }, [unknown]);

  const result = useMemo(() => solve(unknown, a, b), [unknown, a, b]);

  const highlight = (key: keyof Solution) =>
    key === unknown
      ? "text-[var(--md-sys-color-primary)]"
      : "text-[var(--md-sys-color-on-surface)]";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>V = I × R.</strong> Pick the unknown, enter the two known values, and the
        calculator solves for the missing quantity plus power dissipation.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Solve for"
          value={unknown}
          onChange={(v) => setUnknown(v as Unknown)}
          options={[
            { value: "V", label: "Voltage (V)" },
            { value: "I", label: "Current (I)" },
            { value: "R", label: "Resistance (R)" },
            { value: "P", label: "Power (P)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label={labels.a.name}
          type="number"
          inputMode="decimal"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          step="any"
          trailing={labels.a.unit}
        />
        <TextField
          label={labels.b.name}
          type="number"
          inputMode="decimal"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          step="any"
          trailing={labels.b.unit}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <ResultBlock label="Voltage" value={`${fmt(result.V)} V`} highlightClass={highlight("V")} />
          <ResultBlock label="Current" value={`${fmt(result.I)} A`} highlightClass={highlight("I")} />
          <ResultBlock label="Resistance" value={`${fmt(result.R)} Ω`} highlightClass={highlight("R")} />
          <ResultBlock label="Power" value={`${fmt(result.P)} W`} highlightClass={highlight("P")} />
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        SI units per NIST: volt (V), ampere (A), ohm (Ω), watt (W). Ohms law applies to
        linear, ohmic conductors at steady DC; diodes, LEDs, and filaments are non-ohmic.
      </p>
    </Card>
  );
}

function ResultBlock({
  label,
  value,
  highlightClass,
}: {
  label: string;
  value: string;
  highlightClass: string;
}) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <p className={`mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums ${highlightClass}`}>
        {value}
      </p>
    </div>
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
