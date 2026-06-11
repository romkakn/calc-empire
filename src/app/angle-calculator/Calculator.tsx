"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Triangle solver — all angles in degrees on the UI, radians internally.
//   Law of sines:   a/sin A = b/sin B = c/sin C
//   Law of cosines: c² = a² + b² − 2ab·cos C
//   Angle sum:      A + B + C = 180°
// Reference: NIST DLMF ch. 4 (https://dlmf.nist.gov/4) and OpenStax Algebra & Trigonometry.

type Mode = "SSS" | "SAS" | "SSA" | "ASA" | "RIGHT";

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;
const fmt = (n: number, d = 2) => (Number.isFinite(n) ? n.toFixed(d) : "—");

type Solution = {
  a: number; b: number; c: number;
  A: number; B: number; C: number;
  note?: string;
  invalid?: string;
};

function solveSSS(a: number, b: number, c: number): Solution {
  if (a + b <= c || a + c <= b || b + c <= a) {
    return { a, b, c, A: NaN, B: NaN, C: NaN, invalid: "Triangle inequality violated — sides cannot form a triangle." };
  }
  const A = toDeg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
  const B = toDeg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
  const C = 180 - A - B;
  return { a, b, c, A, B, C };
}

function solveSAS(a: number, b: number, Cdeg: number): Solution {
  if (Cdeg <= 0 || Cdeg >= 180) {
    return { a, b, c: NaN, A: NaN, B: NaN, C: Cdeg, invalid: "Angle must be between 0° and 180°." };
  }
  const C = Cdeg;
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(toRad(C)));
  const A = toDeg(Math.asin((a * Math.sin(toRad(C))) / c));
  const B = 180 - A - C;
  return { a, b, c, A, B, C };
}

function solveASA(Adeg: number, c: number, Bdeg: number): Solution {
  if (Adeg + Bdeg >= 180 || Adeg <= 0 || Bdeg <= 0) {
    return { a: NaN, b: NaN, c, A: Adeg, B: Bdeg, C: NaN, invalid: "Angles A and B must each be > 0° and sum to less than 180°." };
  }
  const A = Adeg;
  const B = Bdeg;
  const C = 180 - A - B;
  const a = (c * Math.sin(toRad(A))) / Math.sin(toRad(C));
  const b = (c * Math.sin(toRad(B))) / Math.sin(toRad(C));
  return { a, b, c, A, B, C };
}

function solveSSA(a: number, b: number, Adeg: number): Solution {
  if (Adeg <= 0 || Adeg >= 180) {
    return { a, b, c: NaN, A: Adeg, B: NaN, C: NaN, invalid: "Angle A must be between 0° and 180°." };
  }
  const A = Adeg;
  const sinB = (b * Math.sin(toRad(A))) / a;
  if (sinB > 1) {
    return { a, b, c: NaN, A, B: NaN, C: NaN, invalid: "No triangle fits these sides and angle (ambiguous-case fail)." };
  }
  const B = toDeg(Math.asin(sinB));
  const C = 180 - A - B;
  if (C <= 0) {
    return { a, b, c: NaN, A, B, C: NaN, invalid: "Angles already sum past 180°." };
  }
  const c = (a * Math.sin(toRad(C))) / Math.sin(toRad(A));
  const note = sinB < 1 && A < 90 && b > a ? "Ambiguous case — a second triangle may also be valid." : undefined;
  return { a, b, c, A, B, C, note };
}

function solveRight(a: number, b: number): Solution {
  // Right triangle: legs a and b, hypotenuse c, C = 90°.
  if (a <= 0 || b <= 0) {
    return { a, b, c: NaN, A: NaN, B: NaN, C: 90, invalid: "Both legs must be positive." };
  }
  const c = Math.sqrt(a * a + b * b);
  const A = toDeg(Math.atan(a / b));
  const B = 90 - A;
  return { a, b, c, A, B, C: 90 };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("SAS");

  // Inputs (each mode reads what it needs).
  const [a, setA] = useState(5);
  const [b, setB] = useState(7);
  const [c, setC] = useState(6);
  const [angA, setAngA] = useState(40);
  const [angB, setAngB] = useState(60);
  const [angC, setAngC] = useState(60);

  const sol = useMemo<Solution>(() => {
    switch (mode) {
      case "SSS":   return solveSSS(a, b, c);
      case "SAS":   return solveSAS(a, b, angC);
      case "ASA":   return solveASA(angA, c, angB);
      case "SSA":   return solveSSA(a, b, angA);
      case "RIGHT": return solveRight(a, b);
    }
  }, [mode, a, b, c, angA, angB, angC]);

  const sumOk = Number.isFinite(sol.A) && Number.isFinite(sol.B) && Number.isFinite(sol.C)
    && Math.abs(sol.A + sol.B + sol.C - 180) < 0.05;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="mb-4">
        <Segment
          label="Known values"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "SSS",   label: "SSS" },
            { value: "SAS",   label: "SAS" },
            { value: "SSA",   label: "SSA" },
            { value: "ASA",   label: "ASA" },
            { value: "RIGHT", label: "Right" },
          ]}
        />
        <p className="md-body-small mt-2 text-[var(--md-sys-color-on-surface-variant)]">
          {mode === "SSS" && "Three sides known."}
          {mode === "SAS" && "Two sides and the included angle (between them)."}
          {mode === "SSA" && "Two sides and a non-included angle — may be ambiguous."}
          {mode === "ASA" && "Two angles and the included side."}
          {mode === "RIGHT" && "Right triangle: enter the two legs; C is fixed at 90°."}
        </p>
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        {(mode === "SSS" || mode === "SAS" || mode === "SSA" || mode === "RIGHT") && (
          <TextField
            label="Side a"
            type="number"
            inputMode="decimal"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            min={0}
            step={0.01}
            supportingText={mode === "RIGHT" ? "First leg." : "Opposite angle A."}
          />
        )}
        {(mode === "SSS" || mode === "SAS" || mode === "SSA" || mode === "RIGHT") && (
          <TextField
            label="Side b"
            type="number"
            inputMode="decimal"
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            min={0}
            step={0.01}
            supportingText={mode === "RIGHT" ? "Second leg." : "Opposite angle B."}
          />
        )}
        {(mode === "SSS" || mode === "ASA") && (
          <TextField
            label="Side c"
            type="number"
            inputMode="decimal"
            value={c}
            onChange={(e) => setC(Number(e.target.value))}
            min={0}
            step={0.01}
            supportingText={mode === "ASA" ? "Side between angles A and B." : "Opposite angle C."}
          />
        )}
        {mode === "SAS" && (
          <TextField
            label="Angle C (between a and b)"
            type="number"
            inputMode="decimal"
            value={angC}
            onChange={(e) => setAngC(Number(e.target.value))}
            min={0}
            max={180}
            step={0.1}
            trailing="°"
          />
        )}
        {mode === "SSA" && (
          <TextField
            label="Angle A (opposite side a)"
            type="number"
            inputMode="decimal"
            value={angA}
            onChange={(e) => setAngA(Number(e.target.value))}
            min={0}
            max={180}
            step={0.1}
            trailing="°"
          />
        )}
        {mode === "ASA" && (
          <>
            <TextField
              label="Angle A"
              type="number"
              inputMode="decimal"
              value={angA}
              onChange={(e) => setAngA(Number(e.target.value))}
              min={0}
              max={180}
              step={0.1}
              trailing="°"
            />
            <TextField
              label="Angle B"
              type="number"
              inputMode="decimal"
              value={angB}
              onChange={(e) => setAngB(Number(e.target.value))}
              min={0}
              max={180}
              step={0.1}
              trailing="°"
            />
          </>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-3">
          <ResultCell label="Side a" value={fmt(sol.a)} />
          <ResultCell label="Side b" value={fmt(sol.b)} />
          <ResultCell label="Side c" value={fmt(sol.c)} />
          <ResultCell label="Angle A" value={Number.isFinite(sol.A) ? `${fmt(sol.A, 1)}°` : "—"} />
          <ResultCell label="Angle B" value={Number.isFinite(sol.B) ? `${fmt(sol.B, 1)}°` : "—"} />
          <ResultCell label="Angle C" value={Number.isFinite(sol.C) ? `${fmt(sol.C, 1)}°` : "—"} />

          <div className="sm:col-span-3 flex items-center gap-2 pt-2 border-t border-[var(--md-sys-color-outline-variant)]">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{
                backgroundColor: sol.invalid
                  ? "var(--md-sys-color-error)"
                  : sumOk
                    ? "var(--md-sys-color-tertiary)"
                    : "var(--md-sys-color-secondary)",
              }}
            />
            <span className="md-title-medium">
              {sol.invalid
                ? sol.invalid
                : sumOk
                  ? `Angles sum to ${fmt(sol.A + sol.B + sol.C, 1)}° — valid triangle.`
                  : "Awaiting valid inputs."}
            </span>
          </div>
          {sol.note && (
            <p className="sm:col-span-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              {sol.note}
            </p>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Angles in degrees. Sides share whatever unit you enter (m, ft, cm — anything consistent).
        Law of sines and law of cosines per NIST DLMF chapter 4.
      </p>
    </Card>
  );
}

function ResultCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
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
