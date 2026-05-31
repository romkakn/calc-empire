"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Weighted grade formula:
//   final = sum(grade_i * weight_i) / sum(weight_i)
// Weights can be percentages (sum 100) or raw points; the divisor makes both work.

type Row = { id: number; grade: number; weight: number };
type Scale = "standard" | "plusminus";

// TODO_VERIFY: Plus/minus letter grade cutoffs vary by institution; sample policy from
// University of Washington registrar (https://registrar.washington.edu/students/grading-system/).
// Confirm before publishing for any specific school.
function letterGrade(pct: number, scale: Scale): string {
  if (!Number.isFinite(pct)) return "—";
  if (scale === "standard") {
    if (pct >= 90) return "A";
    if (pct >= 80) return "B";
    if (pct >= 70) return "C";
    if (pct >= 60) return "D";
    return "F";
  }
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

function bandTone(pct: number): "ok" | "warn" | "alert" {
  if (!Number.isFinite(pct)) return "ok";
  if (pct >= 80) return "ok";
  if (pct >= 70) return "warn";
  return "alert";
}

const DEFAULT_ROWS: Row[] = [
  { id: 1, grade: 85, weight: 30 },
  { id: 2, grade: 90, weight: 40 },
  { id: 3, grade: 78, weight: 30 },
];

export function Calculator() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [scale, setScale] = useState<Scale>("standard");
  const [nextId, setNextId] = useState(4);

  const { weighted, totalWeight, letter, tone } = useMemo(() => {
    let weightedSum = 0;
    let weightSum = 0;
    for (const r of rows) {
      const g = Number.isFinite(r.grade) ? r.grade : 0;
      const w = Number.isFinite(r.weight) ? r.weight : 0;
      weightedSum += g * w;
      weightSum += w;
    }
    const pct = weightSum > 0 ? weightedSum / weightSum : NaN;
    return {
      weighted: pct,
      totalWeight: weightSum,
      letter: letterGrade(pct, scale),
      tone: bandTone(pct),
    };
  }, [rows, scale]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[tone];

  function updateRow(id: number, field: "grade" | "weight", value: number) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: nextId, grade: 80, weight: 10 }]);
    setNextId((n) => n + 1);
  }

  function removeRow(id: number) {
    setRows((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  }

  function reset() {
    setRows(DEFAULT_ROWS.map((r) => ({ ...r })));
    setNextId(4);
  }

  const weightNote =
    Math.abs(totalWeight - 100) < 0.01
      ? "Weights total 100% — clean percentage setup."
      : `Weights total ${totalWeight.toFixed(2)}. The formula divides by this, so raw point totals work too.`;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Letter scale"
          value={scale}
          onChange={(v) => setScale(v as Scale)}
          options={[
            { value: "standard", label: "Standard (A–F)" },
            { value: "plusminus", label: "Plus / minus" },
          ]}
        />
      </div>

      <form
        className="grid gap-3"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="grid gap-2">
          <div className="hidden sm:grid grid-cols-[1fr_1fr_auto] gap-3 px-1 md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
            <span>Grade (%)</span>
            <span>Weight</span>
            <span className="sr-only">Remove</span>
          </div>
          {rows.map((row, idx) => (
            <div key={row.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
              <TextField
                label={`Category ${idx + 1} grade`}
                type="number"
                inputMode="decimal"
                value={row.grade}
                onChange={(e) => updateRow(row.id, "grade", Number(e.target.value))}
                min={0}
                max={150}
                step={0.1}
                trailing="%"
              />
              <TextField
                label={`Category ${idx + 1} weight`}
                type="number"
                inputMode="decimal"
                value={row.weight}
                onChange={(e) => updateRow(row.id, "weight", Number(e.target.value))}
                min={0}
                max={1000}
                step={0.1}
                trailing="%"
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
                aria-label={`Remove category ${idx + 1}`}
                className="min-h-12 px-4 md-label-large rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <button
            type="button"
            onClick={addRow}
            className="min-h-12 px-5 md-label-large rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
          >
            + Add category
          </button>
          <button
            type="button"
            onClick={reset}
            className="min-h-12 px-5 md-label-large rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
          >
            Reset
          </button>
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Final grade
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(weighted) ? `${weighted.toFixed(2)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Letter grade
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {letter}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">
              {tone === "ok" ? "On track" : tone === "warn" ? "Borderline" : "Below passing"}
            </span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {weightNote} Letter cutoffs follow a common US scale; your syllabus is the source of truth.
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
