"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Gauss-Jordan elimination produces the reduced row echelon form (RREF) of a matrix.
// For each pivot column (left to right):
//   1. Find a non-zero entry at or below the current row in this column. Swap into pivot row.
//   2. Scale the pivot row so the pivot entry equals 1.
//   3. For every other row, subtract a multiple of the pivot row to zero out that column.
// RREF is unique for any given matrix.

type Size = "2x2" | "2x3" | "3x3" | "3x4" | "4x4";

const SIZES: { value: Size; rows: number; cols: number; label: string }[] = [
  { value: "2x2", rows: 2, cols: 2, label: "2 × 2" },
  { value: "2x3", rows: 2, cols: 3, label: "2 × 3" },
  { value: "3x3", rows: 3, cols: 3, label: "3 × 3" },
  { value: "3x4", rows: 3, cols: 4, label: "3 × 4" },
  { value: "4x4", rows: 4, cols: 4, label: "4 × 4" },
];

const DEFAULTS: Record<Size, number[][]> = {
  "2x2": [[1, 2], [3, 4]],
  "2x3": [[1, 2, 3], [2, 3, 4]],
  "3x3": [[1, 2, 3], [4, 5, 6], [7, 8, 10]],
  "3x4": [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 7]],
  "4x4": [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 7], [4, 5, 6, 9]],
};

const EPS = 1e-9;

function cloneMatrix(m: number[][]): number[][] {
  return m.map((row) => row.slice());
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "NaN";
  const rounded = Math.round(n * 1000) / 1000;
  if (Math.abs(rounded) < EPS) return "0";
  // Strip trailing zeros but keep up to 3 decimals.
  const s = rounded.toFixed(3);
  return s.replace(/\.?0+$/, "");
}

type Step = { description: string; matrix: number[][] };

function rref(input: number[][]): { result: number[][]; steps: Step[]; pivots: number[]; rank: number } {
  const m = cloneMatrix(input);
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  const steps: Step[] = [{ description: "Start", matrix: cloneMatrix(m) }];
  const pivots: number[] = [];

  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    // Find a row at or below pivotRow with a non-zero entry in this column.
    let swapRow = -1;
    for (let r = pivotRow; r < rows; r++) {
      if (Math.abs(m[r][col]) > EPS) {
        swapRow = r;
        break;
      }
    }
    if (swapRow === -1) continue; // Skip — non-pivot column.

    if (swapRow !== pivotRow) {
      [m[pivotRow], m[swapRow]] = [m[swapRow], m[pivotRow]];
      steps.push({
        description: `Swap R${pivotRow + 1} and R${swapRow + 1}`,
        matrix: cloneMatrix(m),
      });
    }

    const pivot = m[pivotRow][col];
    if (Math.abs(pivot - 1) > EPS) {
      const inv = 1 / pivot;
      for (let c = 0; c < cols; c++) m[pivotRow][c] *= inv;
      steps.push({
        description: `R${pivotRow + 1} → (1/${fmt(pivot)})·R${pivotRow + 1} (scale pivot to 1)`,
        matrix: cloneMatrix(m),
      });
    }

    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = m[r][col];
      if (Math.abs(factor) < EPS) continue;
      for (let c = 0; c < cols; c++) m[r][c] -= factor * m[pivotRow][c];
      // Tidy floating residue.
      for (let c = 0; c < cols; c++) if (Math.abs(m[r][c]) < EPS) m[r][c] = 0;
      steps.push({
        description: `R${r + 1} → R${r + 1} − (${fmt(factor)})·R${pivotRow + 1}`,
        matrix: cloneMatrix(m),
      });
    }

    pivots.push(col);
    pivotRow++;
  }

  // Final tidy.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.abs(m[r][c]) < EPS) m[r][c] = 0;
      if (Object.is(m[r][c], -0)) m[r][c] = 0;
    }
  }

  return { result: m, steps, pivots, rank: pivots.length };
}

export function Calculator() {
  const [size, setSize] = useState<Size>("2x3");
  const [matrix, setMatrix] = useState<number[][]>(DEFAULTS["2x3"]);

  const dim = useMemo(() => SIZES.find((s) => s.value === size)!, [size]);

  function onResize(newSize: Size) {
    setSize(newSize);
    setMatrix(DEFAULTS[newSize]);
  }

  function onCellChange(r: number, c: number, raw: string) {
    const value = raw === "" || raw === "-" ? 0 : Number(raw);
    setMatrix((prev) => {
      const next = cloneMatrix(prev);
      if (!next[r]) next[r] = [];
      next[r][c] = Number.isFinite(value) ? value : 0;
      return next;
    });
  }

  const { result, steps, pivots, rank } = useMemo(() => rref(matrix), [matrix]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Matrix size"
          value={size}
          onChange={(v) => onResize(v as Size)}
          options={SIZES.map((s) => ({ value: s.value, label: s.label }))}
        />
      </div>

      <form
        className="overflow-x-auto"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <p className="md-label-medium mb-2 text-[var(--md-sys-color-on-surface-variant)]">
          Enter the matrix entries
        </p>
        <div className="inline-grid gap-2" style={{ gridTemplateColumns: `repeat(${dim.cols}, minmax(5.5rem, 1fr))` }}>
          {Array.from({ length: dim.rows }).map((_, r) =>
            Array.from({ length: dim.cols }).map((_, c) => (
              <TextField
                key={`${size}-${r}-${c}`}
                label={`a${r + 1}${c + 1}`}
                type="number"
                inputMode="decimal"
                value={matrix[r]?.[c] ?? 0}
                onChange={(e) => onCellChange(r, c, e.target.value)}
                step={1}
              />
            ))
          )}
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-4">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Reduced row echelon form
            </p>
            <div className="mt-2 overflow-x-auto">
              <MatrixView m={result} highlightCols={pivots} />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 md-body-medium">
            <span>
              <strong>Rank:</strong>{" "}
              <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">{rank}</span>
            </span>
            <span>
              <strong>Pivot columns:</strong>{" "}
              <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {pivots.length ? pivots.map((p) => p + 1).join(", ") : "—"}
              </span>
            </span>
            <span>
              <strong>Free columns:</strong>{" "}
              <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                {dim.cols - pivots.length > 0
                  ? Array.from({ length: dim.cols }, (_, i) => i)
                      .filter((i) => !pivots.includes(i))
                      .map((i) => i + 1)
                      .join(", ")
                  : "—"}
              </span>
            </span>
          </div>
        </div>
      </Card>

      <details className="mt-6">
        <summary className="md-title-small cursor-pointer text-[var(--md-sys-color-primary)]">
          Show every Gauss-Jordan step ({steps.length})
        </summary>
        <ol className="mt-4 grid gap-4">
          {steps.map((step, i) => (
            <li key={i} className="grid gap-2">
              <p className="md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                Step {i + 1}: {step.description}
              </p>
              <div className="overflow-x-auto">
                <MatrixView m={step.matrix} />
              </div>
            </li>
          ))}
        </ol>
      </details>

      <p className="md-body-small mt-4 text-[var(--md-sys-color-on-surface-variant)]">
        RREF is unique for any matrix. Pivot columns identify basic variables; non-pivot
        columns identify free variables.
      </p>
    </Card>
  );
}

function MatrixView({ m, highlightCols = [] }: { m: number[][]; highlightCols?: number[] }) {
  const rows = m.length;
  const cols = m[0]?.length ?? 0;
  return (
    <table className="border-collapse">
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            <td className="px-1 text-[var(--md-sys-color-on-surface-variant)]" aria-hidden>
              [
            </td>
            {Array.from({ length: cols }).map((_, c) => {
              const isPivot = highlightCols.includes(c);
              return (
                <td
                  key={c}
                  className="px-3 py-1 text-right tabular-nums font-[var(--md-sys-typescale-mono-font)]"
                  style={{
                    color: isPivot ? "var(--md-sys-color-primary)" : "var(--md-sys-color-on-surface)",
                    fontWeight: isPivot ? 600 : 400,
                  }}
                >
                  {fmt(m[r]?.[c] ?? 0)}
                </td>
              );
            })}
            <td className="px-1 text-[var(--md-sys-color-on-surface-variant)]" aria-hidden>
              ]
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
