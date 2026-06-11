"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Simplify algebraic expressions:
//   combine like terms: a·x^n + b·x^n = (a + b)·x^n
//   distribute:         a(b + c) = ab + ac
//   reduce fraction:    p/q ÷ gcd(p, q)

type Mode = "combine" | "distribute" | "both";

type Term = {
  coeff: number;     // numeric coefficient (signed)
  variable: string;  // "" for a constant, otherwise letter (e.g., "x")
  power: number;     // exponent on the variable (0 for constant)
};

function termKey(t: Term): string {
  return t.variable === "" ? "__const__" : `${t.variable}^${t.power}`;
}

function formatTerm(t: Term, isFirst: boolean): string {
  const sign = t.coeff < 0 ? "−" : isFirst ? "" : "+ ";
  const abs = Math.abs(t.coeff);
  const isConst = t.variable === "" || t.power === 0;

  if (isConst) {
    return `${sign}${isFirst && t.coeff < 0 ? "" : ""}${abs}`.replace("−", isFirst ? "−" : "− ");
  }

  // coefficient text: hide "1" before a variable unless constant
  const coeffText = abs === 1 ? "" : `${abs}`;
  const varText =
    t.power === 1 ? t.variable : `${t.variable}^${t.power}`;
  const body = `${coeffText}${varText}`;
  return `${sign}${body}`.replace(/^−/, isFirst ? "−" : "− ");
}

function formatExpression(terms: Term[]): string {
  if (terms.length === 0) return "0";
  const nonZero = terms.filter((t) => t.coeff !== 0);
  if (nonZero.length === 0) return "0";
  return nonZero
    .map((t, i) => formatTerm(t, i === 0))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

// Normalize input: unicode minus, multiplication, whitespace.
function normalize(src: string): string {
  return src
    .replace(/[−–—]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/\s+/g, "");
}

// Tokenize a flat (no-parentheses) expression into signed terms.
// Supports: integer coefficients, single-letter variables, optional ^power.
function parseFlat(src: string): Term[] | null {
  const s = normalize(src);
  if (s === "") return [];
  const terms: Term[] = [];
  // match: optional sign, optional digits, optional letter, optional ^digits
  const re = /([+-]?)(\d*)([a-zA-Z]?)(?:\^(\d+))?/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index !== lastIndex) return null;
    const [full, signStr, digitsStr, varStr, powStr] = m;
    if (full === "") {
      // re can match empty; bail out if no progress
      if (re.lastIndex === lastIndex) re.lastIndex++;
      continue;
    }
    lastIndex = re.lastIndex;
    const sign = signStr === "-" ? -1 : 1;
    const hasDigits = digitsStr.length > 0;
    const hasVar = varStr.length > 0;
    if (!hasDigits && !hasVar) continue;
    const coeff = sign * (hasDigits ? parseInt(digitsStr, 10) : 1);
    const variable = hasVar ? varStr : "";
    const power = hasVar ? (powStr ? parseInt(powStr, 10) : 1) : 0;
    terms.push({ coeff, variable, power });
  }
  if (lastIndex !== s.length) return null;
  return terms;
}

// Distribute one layer of parentheses of the form: COEFF(...) or -(...) or +(...).
// Returns the expanded string, ready to be combined.
function distributeOnce(src: string): string {
  const s = normalize(src);
  const open = s.indexOf("(");
  if (open === -1) return s;
  // find matching close (no nesting support beyond one level)
  let depth = 0;
  let close = -1;
  for (let i = open; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")") {
      depth--;
      if (depth === 0) { close = i; break; }
    }
  }
  if (close === -1) return s;
  const before = s.slice(0, open);
  const inside = s.slice(open + 1, close);
  const after = s.slice(close + 1);

  // factor preceding the "(": parse from the right of `before`
  const factorMatch = before.match(/([+-]?)(\d*)([a-zA-Z]?)(?:\^(\d+))?$/);
  let factor: Term = { coeff: 1, variable: "", power: 0 };
  let beforeRest = before;
  if (factorMatch && factorMatch[0] !== "") {
    const [full, signStr, digitsStr, varStr, powStr] = factorMatch;
    beforeRest = before.slice(0, before.length - full.length);
    const sign = signStr === "-" ? -1 : 1;
    const hasDigits = digitsStr.length > 0;
    const hasVar = varStr.length > 0;
    if (!hasDigits && !hasVar) {
      // a bare sign attached to the parenthesis: -(...) or +(...)
      factor = { coeff: sign, variable: "", power: 0 };
    } else {
      const coeff = sign * (hasDigits ? parseInt(digitsStr, 10) : 1);
      factor = {
        coeff,
        variable: hasVar ? varStr : "",
        power: hasVar ? (powStr ? parseInt(powStr, 10) : 1) : 0,
      };
    }
  }

  const insideTerms = parseFlat(inside) ?? [];
  const expanded: Term[] = insideTerms.map((t) => ({
    coeff: t.coeff * factor.coeff,
    variable: factor.variable !== "" ? factor.variable : t.variable,
    power: (factor.variable !== "" && factor.variable === t.variable)
      ? factor.power + t.power
      : factor.variable !== ""
      ? factor.power
      : t.power,
  }));
  const expandedStr = formatExpression(expanded)
    .replace(/− /g, "-")
    .replace(/\+ /g, "+")
    .replace(/^-/, "-")
    // ensure leading + is stripped
    .replace(/^\+/, "");
  // re-glue with the rest of the expression, inserting an explicit + if needed
  const glue = beforeRest && !/[+\-]$/.test(beforeRest) ? "+" : "";
  return `${beforeRest}${glue}${expandedStr}${after}`;
}

function combineLikeTerms(terms: Term[]): Term[] {
  const buckets = new Map<string, Term>();
  for (const t of terms) {
    const k = termKey(t);
    const existing = buckets.get(k);
    if (existing) existing.coeff += t.coeff;
    else buckets.set(k, { ...t });
  }
  // order: highest power first, then constants last
  return Array.from(buckets.values()).sort((a, b) => {
    if (a.variable === "" && b.variable !== "") return 1;
    if (a.variable !== "" && b.variable === "") return -1;
    if (a.power !== b.power) return b.power - a.power;
    return a.variable.localeCompare(b.variable);
  });
}

function simplify(src: string, mode: Mode): { result: string; steps: string[]; ok: boolean } {
  const steps: string[] = [];
  let current = normalize(src);

  if (mode === "distribute" || mode === "both") {
    let guard = 0;
    while (current.includes("(") && guard < 16) {
      const next = distributeOnce(current);
      if (next === current) break;
      steps.push(`Distribute: ${current} -> ${next}`);
      current = next;
      guard++;
    }
  }

  if (mode === "combine" || mode === "both") {
    const parsed = parseFlat(current);
    if (parsed === null) {
      return { result: "Could not parse expression.", steps, ok: false };
    }
    const combined = combineLikeTerms(parsed);
    const out = formatExpression(combined);
    if (out !== current) steps.push(`Combine like terms: ${current} -> ${out}`);
    current = out;
  }

  return { result: current, steps, ok: true };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("combine");
  const [expression, setExpression] = useState("2x + 3x - 4 + 6");

  const { result, steps, ok } = useMemo(
    () => simplify(expression, mode),
    [expression, mode],
  );

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        Enter an algebraic expression. Use <code>^</code> for exponents (e.g., <code>x^2</code>) and parentheses for grouping (e.g., <code>2(x + 3)</code>).
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "distribute", label: "Distribute" },
            { value: "combine", label: "Combine" },
            { value: "both", label: "Both" },
          ]}
        />
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Expression"
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          supportingText="Try: 2x + 3x - 4 + 6  ·  3(x + 2) - x  ·  -(2x - 5)"
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-3">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Simplified
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {ok ? result : "—"}
            </p>
          </div>
          {steps.length > 0 && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Steps
              </p>
              <ol className="mt-1 md-body-medium list-decimal pl-5 space-y-1">
                {steps.map((s, i) => (
                  <li key={i} className="font-[var(--md-sys-typescale-mono-font)]">{s}</li>
                ))}
              </ol>
            </div>
          )}
          {!ok && (
            <p className="md-body-medium text-[var(--md-sys-color-error)]">
              {result}
            </p>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Supports single-variable expressions with integer coefficients and one level of parentheses. For multi-variable or fractional inputs, simplify in steps.
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
