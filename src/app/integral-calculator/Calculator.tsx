"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Basic antiderivative rules (introductory calculus):
//   integral x^n dx  = x^(n+1)/(n+1) + C   (n != -1)
//   integral 1/x dx  = ln|x| + C
//   integral e^x dx  = e^x + C
//   integral sin x dx = -cos x + C
//   integral cos x dx =  sin x + C
// Definite form uses the Fundamental Theorem of Calculus: F(b) - F(a).

type FnType = "power" | "exp" | "sin" | "cos";
type Mode = "indefinite" | "definite";

function formatNum(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) < 1e-10) return "0";
  const rounded = Number(n.toFixed(digits));
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

function formatCoef(c: number, includeOne = false): string {
  if (c === 1) return includeOne ? "1" : "";
  if (c === -1) return "-";
  return formatNum(c);
}

// Build the antiderivative expression as a display string.
function antiderivativeExpr(fn: FnType, coef: number, power: number): string {
  if (fn === "power") {
    if (power === -1) {
      const c = formatCoef(coef, true);
      return `${c}·ln|x|`;
    }
    const newPower = power + 1;
    const newCoef = coef / newPower;
    const cStr = formatCoef(newCoef, true);
    if (newPower === 1) return `${cStr}·x`;
    return `${cStr}·x^${formatNum(newPower)}`;
  }
  if (fn === "exp") {
    const c = formatCoef(coef, true);
    return `${c}·e^x`;
  }
  if (fn === "sin") {
    // integral of sin x = -cos x, so coefficient flips sign
    const c = formatCoef(-coef, true);
    return `${c}·cos(x)`;
  }
  // cos
  const c = formatCoef(coef, true);
  return `${c}·sin(x)`;
}

// Numerically evaluate the antiderivative at x.
function antiderivativeAt(fn: FnType, coef: number, power: number, x: number): number {
  if (!Number.isFinite(x)) return NaN;
  if (fn === "power") {
    if (power === -1) {
      if (x === 0) return NaN;
      return coef * Math.log(Math.abs(x));
    }
    return (coef * Math.pow(x, power + 1)) / (power + 1);
  }
  if (fn === "exp") return coef * Math.exp(x);
  if (fn === "sin") return -coef * Math.cos(x);
  return coef * Math.sin(x);
}

// Display string for the original integrand.
function integrandExpr(fn: FnType, coef: number, power: number): string {
  const c = formatCoef(coef, true);
  if (fn === "power") {
    if (power === 0) return c;
    if (power === 1) return `${c}·x`;
    return `${c}·x^${formatNum(power)}`;
  }
  if (fn === "exp") return `${c}·e^x`;
  if (fn === "sin") return `${c}·sin(x)`;
  return `${c}·cos(x)`;
}

export function Calculator() {
  const [fn, setFn] = useState<FnType>("power");
  const [mode, setMode] = useState<Mode>("definite");
  const [coef, setCoef] = useState(2);
  const [power, setPower] = useState(1);
  const [lower, setLower] = useState(0);
  const [upper, setUpper] = useState(3);

  const result = useMemo(() => {
    const integrand = integrandExpr(fn, coef, power);
    const antideriv = antiderivativeExpr(fn, coef, power);

    if (mode === "indefinite") {
      return {
        integrand,
        antideriv,
        display: `${antideriv} + C`,
        numeric: null as number | null,
        steps: null as string[] | null,
      };
    }

    const Fb = antiderivativeAt(fn, coef, power, upper);
    const Fa = antiderivativeAt(fn, coef, power, lower);
    const value = Fb - Fa;

    return {
      integrand,
      antideriv,
      display: formatNum(value),
      numeric: value,
      steps: [
        `Antiderivative: F(x) = ${antideriv}`,
        `F(${formatNum(upper)}) = ${formatNum(Fb)}`,
        `F(${formatNum(lower)}) = ${formatNum(Fa)}`,
        `F(b) − F(a) = ${formatNum(Fb)} − ${formatNum(Fa)} = ${formatNum(value)}`,
      ],
    };
  }, [fn, mode, coef, power, lower, upper]);

  const powerRuleUndefined =
    fn === "power" && power === -1 && mode === "indefinite";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational tool.</strong> Covers single-term polynomials, exponentials, and basic
        trig. For products, quotients, or chained expressions, apply u-substitution or integration by
        parts first.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Function type"
          value={fn}
          onChange={(v) => setFn(v as FnType)}
          options={[
            { value: "power", label: "x^n" },
            { value: "exp", label: "e^x" },
            { value: "sin", label: "sin x" },
            { value: "cos", label: "cos x" },
          ]}
        />
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "indefinite", label: "Indefinite" },
            { value: "definite", label: "Definite" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Coefficient"
          type="number"
          inputMode="decimal"
          value={coef}
          onChange={(e) => setCoef(Number(e.target.value))}
          step={0.5}
          supportingText="The constant multiplier in front of the function (e.g., 2 in 2x)."
        />

        {fn === "power" ? (
          <TextField
            label="Power (n)"
            type="number"
            inputMode="decimal"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            step={1}
            supportingText="The exponent on x. Power rule excludes n = -1 (use 1/x → ln|x|)."
          />
        ) : null}

        {mode === "definite" ? (
          <>
            <TextField
              label="Lower bound (a)"
              type="number"
              inputMode="decimal"
              value={lower}
              onChange={(e) => setLower(Number(e.target.value))}
              step={0.5}
            />
            <TextField
              label="Upper bound (b)"
              type="number"
              inputMode="decimal"
              value={upper}
              onChange={(e) => setUpper(Number(e.target.value))}
              step={0.5}
            />
          </>
        ) : null}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-y-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Integrand
            </p>
            <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              integral {result.integrand} dx
              {mode === "definite" ? ` from ${formatNum(lower)} to ${formatNum(upper)}` : ""}
            </p>
          </div>

          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {mode === "indefinite" ? "Antiderivative" : "Definite integral"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {powerRuleUndefined ? "ln|x| + C" : result.display}
            </p>
          </div>

          {result.steps ? (
            <details className="mt-1">
              <summary className="md-label-large cursor-pointer text-[var(--md-sys-color-primary)]">
                Show steps
              </summary>
              <ol className="mt-2 grid gap-1 pl-5 list-decimal md-body-medium">
                {result.steps.map((s, i) => (
                  <li key={i} className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                    {s}
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Trig is evaluated in radians. For x^n with n = -1, the antiderivative is ln|x| + C, not
        the power rule.
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
