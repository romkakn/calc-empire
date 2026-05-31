"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Square root: √x = x^0.5
//   - x ≥ 0 → Math.sqrt(x), shown to 10 significant decimals.
//   - x < 0 → √|x| · i (imaginary).
//   - When x is a non-negative integer, simplify to a·√b by extracting the
//     largest perfect-square factor a².
// Reference: NIST DLMF §4.2 (Powers and Roots) — https://dlmf.nist.gov/4.2

type Mode = "decimal" | "simplified";

const MAX_SIMPLIFY = 1e12; // factoring loop guard; integers above this fall back to decimal-only.

type Simplified =
  | { kind: "integer"; a: number } // √(a²)
  | { kind: "radical"; a: number; b: number } // a√b, b > 1, b square-free
  | { kind: "none" };

function simplifyRadical(x: number): Simplified {
  if (!Number.isInteger(x) || x < 0 || x > MAX_SIMPLIFY) return { kind: "none" };
  if (x === 0) return { kind: "integer", a: 0 };
  if (x === 1) return { kind: "integer", a: 1 };
  // Find the largest a such that a² divides x.
  const root = Math.floor(Math.sqrt(x));
  for (let a = root; a >= 1; a--) {
    const sq = a * a;
    if (x % sq === 0) {
      const b = x / sq;
      if (b === 1) return { kind: "integer", a };
      return { kind: "radical", a, b };
    }
  }
  return { kind: "none" };
}

function formatDecimal(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Number.isInteger(value)) return value.toString();
  // 10 significant decimals, then trim trailing zeros.
  const fixed = value.toFixed(10);
  return fixed.replace(/0+$/, "").replace(/\.$/, "");
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("decimal");
  const [raw, setRaw] = useState<string>("50");

  const { x, isNegative, decimal, simplified, valid } = useMemo(() => {
    const parsed = Number(raw);
    if (raw.trim() === "" || !Number.isFinite(parsed)) {
      return { x: NaN, isNegative: false, decimal: NaN, simplified: { kind: "none" } as Simplified, valid: false };
    }
    const neg = parsed < 0;
    const mag = Math.abs(parsed);
    const root = Math.sqrt(mag);
    return {
      x: parsed,
      isNegative: neg,
      decimal: root,
      simplified: simplifyRadical(parsed),
      valid: true,
    };
  }, [raw]);

  const decimalLabel = useMemo(() => {
    if (!valid) return "—";
    const body = formatDecimal(decimal);
    return isNegative ? `${body}i` : body;
  }, [valid, decimal, isNegative]);

  const simplifiedNode = useMemo(() => {
    if (!valid) return <span>—</span>;
    if (isNegative) {
      // Simplify √|x| in the imaginary case too.
      const inner = simplifyRadical(Math.abs(x));
      if (inner.kind === "integer") return <span>{inner.a}<i>i</i></span>;
      if (inner.kind === "radical")
        return (
          <span>
            {inner.a}√{inner.b}
            <i> i</i>
          </span>
        );
      return <span>{formatDecimal(decimal)}<i> i</i></span>;
    }
    if (simplified.kind === "integer") return <span>{simplified.a}</span>;
    if (simplified.kind === "radical")
      return (
        <span>
          {simplified.a === 1 ? "" : simplified.a}√{simplified.b}
        </span>
      );
    // Non-integer or out-of-range — show decimal as the simplified form too.
    return <span>{formatDecimal(decimal)}</span>;
  }, [valid, simplified, isNegative, x, decimal]);

  const note = useMemo(() => {
    if (!valid) return "Enter a number to see its square root.";
    if (isNegative) return "Negative input — result includes the imaginary unit i.";
    if (!Number.isInteger(x))
      return "Non-integer input — simplified radical form requires a whole number, so the decimal is shown in both views.";
    if (x > MAX_SIMPLIFY) return "Input too large for exact factoring — decimal value is still accurate.";
    if (simplified.kind === "integer") return "Perfect square — the root is an exact integer.";
    if (simplified.kind === "radical") return "Irrational root — decimal is rounded to 10 digits; the a√b form is exact.";
    return "";
  }, [valid, isNegative, x, simplified]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Result view"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "decimal", label: "Decimal" },
            { value: "simplified", label: "Simplified a√b" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Number (x)"
          type="number"
          inputMode="decimal"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          step="any"
          supportingText="Any real number. Negative inputs return an imaginary result (a + bi form)."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Decimal (10 digits)
            </p>
            <p
              className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]"
              aria-current={mode === "decimal" ? "true" : undefined}
            >
              {decimalLabel}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Simplified radical
            </p>
            <p
              className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]"
              aria-current={mode === "simplified" ? "true" : undefined}
            >
              {simplifiedNode}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
            {note}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {/* TODO_VERIFY: simplification correctness on integers up to 1e12 — confirm against NIST DLMF §4.2 https://dlmf.nist.gov/4.2 at publish. */}
        Irrational results are rounded to 10 decimal places; the simplified a√b form is exact.
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
