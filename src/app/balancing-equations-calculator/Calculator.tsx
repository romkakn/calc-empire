"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Balance a chemical equation by solving M · c = 0 over the integers, where
// M is the element-count matrix (rows = elements, cols = species; products
// negated) and c is the coefficient vector. We Gauss-eliminate over rationals,
// then scale to the smallest positive integers via lcm/gcd.
// Reference: OpenStax Chemistry 2e §4.1.

type Frac = { n: bigint; d: bigint };

function gcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a || 1n;
}
function lcm(a: bigint, b: bigint): bigint {
  return (a / gcd(a, b)) * b;
}
function f(n: bigint, d: bigint = 1n): Frac {
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n < 0n ? -n : n, d);
  return { n: n / g, d: d / g };
}
function fadd(a: Frac, b: Frac): Frac { return f(a.n * b.d + b.n * a.d, a.d * b.d); }
function fsub(a: Frac, b: Frac): Frac { return f(a.n * b.d - b.n * a.d, a.d * b.d); }
function fmul(a: Frac, b: Frac): Frac { return f(a.n * b.n, a.d * b.d); }
function fdiv(a: Frac, b: Frac): Frac { return f(a.n * b.d, a.d * b.n); }
function fzero(a: Frac): boolean { return a.n === 0n; }
function fneg(a: Frac): Frac { return { n: -a.n, d: a.d }; }

type Species = { raw: string; counts: Map<string, number> };

// Parse a chemical formula into element -> count.
// Supports nested parentheses and group subscripts: Ca(OH)2, Fe2(SO4)3.
function parseFormula(s: string): Map<string, number> | null {
  const out = new Map<string, number>();
  let i = 0;
  // Recursive descent. Returns a map and the index after the matched group.
  function group(): Map<string, number> | null {
    const m = new Map<string, number>();
    while (i < s.length) {
      const ch = s[i];
      if (ch === "(") {
        i++;
        const inner = group();
        if (!inner) return null;
        if (s[i] !== ")") return null;
        i++;
        const sub = readNumber();
        for (const [el, c] of inner) m.set(el, (m.get(el) ?? 0) + c * sub);
      } else if (ch === ")") {
        return m;
      } else if (/[A-Z]/.test(ch)) {
        let el = ch;
        i++;
        if (i < s.length && /[a-z]/.test(s[i])) { el += s[i]; i++; }
        const sub = readNumber();
        m.set(el, (m.get(el) ?? 0) + sub);
      } else if (ch === " " || ch === "\t") {
        i++;
      } else {
        return null;
      }
    }
    return m;
  }
  function readNumber(): number {
    let n = "";
    while (i < s.length && /[0-9]/.test(s[i])) { n += s[i]; i++; }
    return n ? parseInt(n, 10) : 1;
  }
  const result = group();
  if (!result || i !== s.length) return null;
  for (const [el, c] of result) out.set(el, c);
  return out;
}

function splitSide(side: string): string[] {
  return side.split("+").map((t) => t.trim()).filter(Boolean);
}

function solveNullSpace(A: Frac[][]): Frac[] | null {
  // Reduce A to RREF, then read off one null-space vector.
  const rows = A.length;
  const cols = A[0]?.length ?? 0;
  if (!cols) return null;
  const M = A.map((r) => r.slice());
  const pivotCol: number[] = [];
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1;
    for (let i = r; i < rows; i++) if (!fzero(M[i][c])) { piv = i; break; }
    if (piv < 0) continue;
    [M[r], M[piv]] = [M[piv], M[r]];
    const inv = fdiv(f(1n), M[r][c]);
    for (let j = c; j < cols; j++) M[r][j] = fmul(M[r][j], inv);
    for (let i = 0; i < rows; i++) {
      if (i === r || fzero(M[i][c])) continue;
      const factor = M[i][c];
      for (let j = c; j < cols; j++) M[i][j] = fsub(M[i][j], fmul(factor, M[r][j]));
    }
    pivotCol.push(c);
    r++;
  }
  const free: number[] = [];
  const pivotSet = new Set(pivotCol);
  for (let c = 0; c < cols; c++) if (!pivotSet.has(c)) free.push(c);
  if (free.length === 0) return null;
  // Pick the last free variable = 1; solve pivots.
  const freeIdx = free[free.length - 1];
  const x: Frac[] = Array.from({ length: cols }, () => f(0n));
  x[freeIdx] = f(1n);
  for (let p = pivotCol.length - 1; p >= 0; p--) {
    const c = pivotCol[p];
    let sum = f(0n);
    for (let j = c + 1; j < cols; j++) sum = fadd(sum, fmul(M[p][j], x[j]));
    x[c] = fneg(sum);
  }
  return x;
}

function scaleToIntegers(vec: Frac[]): bigint[] | null {
  let denomLcm = 1n;
  for (const v of vec) denomLcm = lcm(denomLcm, v.d);
  const ints = vec.map((v) => (v.n * denomLcm) / v.d);
  // If any negative, flip sign to keep positive.
  const anyNeg = ints.some((x) => x < 0n);
  const anyPos = ints.some((x) => x > 0n);
  if (anyNeg && anyPos) return null;
  let scaled = anyNeg ? ints.map((x) => -x) : ints;
  if (scaled.some((x) => x <= 0n)) return null;
  let g = scaled[0];
  for (let i = 1; i < scaled.length; i++) g = gcd(g, scaled[i]);
  scaled = scaled.map((x) => x / g);
  return scaled;
}

type Balance =
  | { ok: true; coeffs: bigint[]; reactants: Species[]; products: Species[]; equation: string; elements: string[] }
  | { ok: false; error: string };

function balance(reactantsStr: string, productsStr: string): Balance {
  const rRaw = splitSide(reactantsStr);
  const pRaw = splitSide(productsStr);
  if (!rRaw.length || !pRaw.length) return { ok: false, error: "Enter at least one reactant and one product." };
  const reactants: Species[] = [];
  const products: Species[] = [];
  for (const t of rRaw) {
    const m = parseFormula(t);
    if (!m) return { ok: false, error: `Could not parse formula: ${t}` };
    reactants.push({ raw: t, counts: m });
  }
  for (const t of pRaw) {
    const m = parseFormula(t);
    if (!m) return { ok: false, error: `Could not parse formula: ${t}` };
    products.push({ raw: t, counts: m });
  }
  const elementSet = new Set<string>();
  for (const s of [...reactants, ...products]) for (const e of s.counts.keys()) elementSet.add(e);
  const elements = Array.from(elementSet);
  const species = [...reactants, ...products];
  const M: Frac[][] = elements.map((el) =>
    species.map((sp, j) => {
      const c = sp.counts.get(el) ?? 0;
      const sign = j < reactants.length ? 1 : -1;
      return f(BigInt(c * sign));
    })
  );
  const vec = solveNullSpace(M);
  if (!vec) return { ok: false, error: "No unique balance found. Check that products and reactants share the same elements." };
  const ints = scaleToIntegers(vec);
  if (!ints) return { ok: false, error: "Could not scale to positive integers. Check the equation." };
  const coeffs = ints;
  const formatSide = (start: number, end: number, list: Species[]) =>
    list.map((sp, k) => {
      const c = coeffs[start + k];
      const head = c === 1n ? "" : `${c} `;
      return `${head}${sp.raw}`;
    }).join(" + ");
  const equation = `${formatSide(0, reactants.length, reactants)} = ${formatSide(reactants.length, species.length, products)}`;
  return { ok: true, coeffs, reactants, products, equation, elements };
}

type Mode = "balance" | "check";

export function Calculator() {
  const [mode, setMode] = useState<Mode>("balance");
  const [reactants, setReactants] = useState("H2 + O2");
  const [products, setProducts] = useState("H2O");

  const result = useMemo(() => balance(reactants, products), [reactants, products]);

  const conservationRows = useMemo(() => {
    if (!result.ok) return [] as { el: string; left: bigint; right: bigint }[];
    const rows: { el: string; left: bigint; right: bigint }[] = [];
    for (const el of result.elements) {
      let left = 0n;
      let right = 0n;
      result.reactants.forEach((sp, k) => {
        left += BigInt(sp.counts.get(el) ?? 0) * result.coeffs[k];
      });
      result.products.forEach((sp, k) => {
        right += BigInt(sp.counts.get(el) ?? 0) * result.coeffs[result.reactants.length + k];
      });
      rows.push({ el, left, right });
    }
    return rows;
  }, [result]);

  const allMatch = conservationRows.every((r) => r.left === r.right);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational tool.</strong> Enter formulas as plain text (for example, <code>H2 + O2 = H2O</code>).
        Use parentheses for groups like <code>Ca(OH)2</code> and digits for subscripts.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "balance", label: "Balance" },
            { value: "check", label: "Check conservation" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Reactants"
          type="text"
          value={reactants}
          onChange={(e) => setReactants(e.target.value)}
          supportingText="Separate species with + (for example, H2 + O2)."
        />
        <TextField
          label="Products"
          type="text"
          value={products}
          onChange={(e) => setProducts(e.target.value)}
          supportingText="Separate species with + (for example, H2O)."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {mode === "balance" ? "Balanced equation" : "Conservation check"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)] break-words">
              {result.ok ? result.equation : "—"}
            </p>
          </div>

          {result.ok && (
            <div>
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)] mb-2">
                Atoms per side
              </p>
              <ul className="grid gap-1 md-body-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {conservationRows.map((r) => (
                  <li key={r.el} className="flex gap-3">
                    <span className="min-w-12">{r.el}</span>
                    <span>{r.left.toString()} ↔ {r.right.toString()}</span>
                    <span aria-hidden style={{ color: r.left === r.right ? "var(--md-sys-color-tertiary)" : "var(--md-sys-color-error)" }}>
                      {r.left === r.right ? "✓" : "✗"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!result.ok && (
            <p className="md-body-medium text-[var(--md-sys-color-error)]">{result.error}</p>
          )}

          {result.ok && (
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block size-3 rounded-full"
                style={{ backgroundColor: allMatch ? "var(--md-sys-color-tertiary)" : "var(--md-sys-color-error)" }}
              />
              <span className="md-title-medium">
                {allMatch ? "Mass conserved — smallest integer coefficients." : "Counts do not match."}
              </span>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Method: solve M · c = 0 in the null space of the element-count matrix, then scale to smallest positive integers.
        Charges, states (s/l/g/aq), and arrows other than <code>=</code> are not parsed in this version.
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
