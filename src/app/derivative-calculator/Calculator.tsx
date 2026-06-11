"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Derivative rules (standard calculus):
//   d/dx(c·x^n) = c·n·x^(n-1)             (power rule + constant multiple)
//   d/dx(c·e^(kx)) = c·k·e^(kx)            (chain rule)
//   d/dx(c·ln(kx)) = c/x                   (chain rule cancels k)
//   d/dx(c·sin(kx)) = c·k·cos(kx)          (chain rule)
//   d/dx(c·cos(kx)) = -c·k·sin(kx)         (chain rule, sign flip)
//   d/dx(c·tan(kx)) = c·k·sec^2(kx)        (chain rule)

type FnType = "poly" | "exp" | "ln" | "sin" | "cos" | "tan";

function fmtCoef(c: number): string {
  if (c === 1) return "";
  if (c === -1) return "-";
  return `${c}`;
}

function fmtTerm(coef: number, body: string): string {
  if (coef === 0) return "0";
  if (coef === 1) return body;
  if (coef === -1) return `-${body}`;
  return `${coef}${body}`;
}

function computeDerivative(
  type: FnType,
  coef: number,
  power: number,
  inner: number,
): { expression: string; derivative: string; rule: string } {
  if (!Number.isFinite(coef) || !Number.isFinite(power) || !Number.isFinite(inner)) {
    return { expression: "—", derivative: "—", rule: "Enter numeric inputs." };
  }

  if (type === "poly") {
    const expression = fmtTerm(coef, `x^${power}`);
    if (power === 0) {
      return {
        expression: `${coef}`,
        derivative: "0",
        rule: "Derivative of a constant is 0.",
      };
    }
    const newCoef = coef * power;
    const newPower = power - 1;
    const body = newPower === 0 ? "" : newPower === 1 ? "x" : `x^${newPower}`;
    const derivative = body === "" ? `${newCoef}` : fmtTerm(newCoef, body);
    return {
      expression,
      derivative,
      rule: `Power rule: d/dx(x^n) = n·x^(n-1). Multiply coefficient by power (${coef}·${power} = ${newCoef}) and drop the exponent by 1.`,
    };
  }

  if (type === "exp") {
    const expression = `${fmtCoef(coef)}e^(${fmtCoef(inner)}x)`;
    const newCoef = coef * inner;
    const derivative = `${fmtCoef(newCoef)}e^(${fmtCoef(inner)}x)`;
    return {
      expression,
      derivative,
      rule: `d/dx(e^x) = e^x. Chain rule pulls the inner multiplier ${inner} out front.`,
    };
  }

  if (type === "ln") {
    const expression = `${fmtCoef(coef)}ln(${fmtCoef(inner)}x)`;
    const derivative = fmtTerm(coef, "/x");
    return {
      expression,
      derivative,
      rule: `d/dx(ln(x)) = 1/x. The inner constant ${inner} cancels out by chain rule.`,
    };
  }

  if (type === "sin") {
    const expression = `${fmtCoef(coef)}sin(${fmtCoef(inner)}x)`;
    const newCoef = coef * inner;
    const derivative = `${fmtCoef(newCoef)}cos(${fmtCoef(inner)}x)`;
    return {
      expression,
      derivative,
      rule: `d/dx(sin x) = cos x. Chain rule multiplies by inner derivative ${inner}.`,
    };
  }

  if (type === "cos") {
    const expression = `${fmtCoef(coef)}cos(${fmtCoef(inner)}x)`;
    const newCoef = -coef * inner;
    const derivative = `${fmtCoef(newCoef)}sin(${fmtCoef(inner)}x)`;
    return {
      expression,
      derivative,
      rule: `d/dx(cos x) = -sin x. Chain rule gives a minus sign and an extra factor of ${inner}.`,
    };
  }

  // tan
  const expression = `${fmtCoef(coef)}tan(${fmtCoef(inner)}x)`;
  const newCoef = coef * inner;
  const derivative = `${fmtCoef(newCoef)}sec^2(${fmtCoef(inner)}x)`;
  return {
    expression,
    derivative,
    rule: `d/dx(tan x) = sec^2 x. Chain rule multiplies by inner derivative ${inner}.`,
  };
}

export function Calculator() {
  const [type, setType] = useState<FnType>("poly");
  const [coef, setCoef] = useState(3);
  const [power, setPower] = useState(4);
  const [inner, setInner] = useState(2);

  const { expression, derivative, rule } = useMemo(
    () => computeDerivative(type, coef, power, inner),
    [type, coef, power, inner],
  );

  const showPower = type === "poly";
  const showInner = type !== "poly";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational tool.</strong> Pick a function type, set the coefficient and
        inner multiplier, and the calculator shows the derivative plus the rule used.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Function type"
          value={type}
          onChange={(v) => setType(v as FnType)}
          options={[
            { value: "poly", label: "Polynomial" },
            { value: "exp", label: "e^x" },
            { value: "ln", label: "ln x" },
            { value: "sin", label: "sin" },
            { value: "cos", label: "cos" },
            { value: "tan", label: "tan" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Coefficient (c)"
          type="number"
          inputMode="decimal"
          value={coef}
          onChange={(e) => setCoef(Number(e.target.value))}
          step={0.5}
          supportingText="The constant in front of the function."
        />
        {showPower && (
          <TextField
            label="Power (n) — for x^n"
            type="number"
            inputMode="decimal"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            step={1}
            supportingText="Integer or rational exponent."
          />
        )}
        {showInner && (
          <TextField
            label="Inner multiplier (k) — for f(kx)"
            type="number"
            inputMode="decimal"
            value={inner}
            onChange={(e) => setInner(Number(e.target.value))}
            step={1}
            supportingText="Use 1 if there is no inner constant."
          />
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">f(x)</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-on-surface)]">
              {expression}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              f′(x)
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {derivative}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Rule applied
            </p>
            <p className="mt-1 md-body-medium text-[var(--md-sys-color-on-surface)]">{rule}</p>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Standard single-variable derivative rules. For products of two non-trivial
        factors use the product rule; for nested functions apply the chain rule.
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
