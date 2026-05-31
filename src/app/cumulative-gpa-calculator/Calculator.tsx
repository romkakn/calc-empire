"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Cumulative GPA = Σ(semester_GPA × credits) / Σ credits
// Required next-term GPA to reach a target cumulative:
//   required = (target × (totalCredits + n) − current × totalCredits) / n
// US 4.0 scale assumed. Schools vary; check your registrar.
// TODO_VERIFY: 4.0 scale ceiling and grade-point conventions vary by institution.
//   Reference: NCES IPEDS glossary — https://nces.ed.gov/ipeds/report-your-data/data-tip-sheet-reporting-graduation-rates

type Mode = "rollup" | "boost";

type Row = { id: number; gpa: number; credits: number };

const DEFAULT_ROWS: Row[] = [
  { id: 1, gpa: 3.5, credits: 15 },
  { id: 2, gpa: 3.2, credits: 16 },
  { id: 3, gpa: 3.8, credits: 14 },
];

function cumulativeGpa(rows: Row[]) {
  let qp = 0;
  let credits = 0;
  for (const r of rows) {
    const g = Number(r.gpa);
    const c = Number(r.credits);
    if (Number.isFinite(g) && Number.isFinite(c) && c > 0) {
      qp += g * c;
      credits += c;
    }
  }
  if (credits === 0) return { gpa: NaN, qp: 0, credits: 0 };
  return { gpa: qp / credits, qp, credits };
}

function requiredNextGpa(current: number, totalCredits: number, target: number, n: number) {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return NaN;
  if (!Number.isFinite(n) || n <= 0) return NaN;
  return (target * (totalCredits + n) - current * totalCredits) / n;
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("rollup");
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [nextId, setNextId] = useState(4);
  const [target, setTarget] = useState(3.6);
  const [nextCredits, setNextCredits] = useState(15);

  const { gpa, qp, credits } = useMemo(() => cumulativeGpa(rows), [rows]);

  const required = useMemo(
    () => requiredNextGpa(gpa, credits, target, nextCredits),
    [gpa, credits, target, nextCredits],
  );

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, { id: nextId, gpa: 3.0, credits: 15 }]);
    setNextId((n) => n + 1);
  }
  function removeRow(id: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }

  const reachable = Number.isFinite(required) && required <= 4.0;
  const requiredLabel = !Number.isFinite(required)
    ? "—"
    : required <= 0
      ? "Already there — any passing GPA keeps you above target."
      : `${required.toFixed(2)} on the 4.0 scale`;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>4.0 scale assumed.</strong> Your school may use a different scale or
        weighting policy — check your registrar before relying on these numbers for an
        application.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "rollup", label: "Roll up semesters" },
            { value: "boost", label: "Plan next term" },
          ]}
        />
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <fieldset className="grid gap-3">
          <legend className="md-label-large mb-1 text-[var(--md-sys-color-on-surface-variant)]">
            Semester history
          </legend>
          {rows.map((row, i) => (
            <div key={row.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
              <TextField
                label={`Semester ${i + 1} GPA`}
                type="number"
                inputMode="decimal"
                value={row.gpa}
                onChange={(e) => updateRow(row.id, { gpa: Number(e.target.value) })}
                min={0}
                max={4.5}
                step={0.01}
                supportingText={i === 0 ? "0.00 – 4.00 typical" : undefined}
              />
              <TextField
                label="Credit hours"
                type="number"
                inputMode="numeric"
                value={row.credits}
                onChange={(e) => updateRow(row.id, { credits: Number(e.target.value) })}
                min={0}
                max={30}
                step={1}
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length <= 1}
                aria-label={`Remove semester ${i + 1}`}
                className="min-h-12 px-4 md-label-large rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRow}
            className="justify-self-start min-h-12 px-4 md-label-large rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
          >
            + Add semester
          </button>
        </fieldset>

        {mode === "boost" && (
          <fieldset className="grid gap-3 sm:grid-cols-2">
            <legend className="md-label-large mb-1 text-[var(--md-sys-color-on-surface-variant)] sm:col-span-2">
              Next-term plan
            </legend>
            <TextField
              label="Target cumulative GPA"
              type="number"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              min={0}
              max={4}
              step={0.01}
              supportingText="The cumulative GPA you want after next term."
            />
            <TextField
              label="Credits next term"
              type="number"
              inputMode="numeric"
              value={nextCredits}
              onChange={(e) => setNextCredits(Number(e.target.value))}
              min={1}
              max={30}
              step={1}
            />
          </fieldset>
        )}
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Cumulative GPA
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(gpa) ? gpa.toFixed(3) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total credits
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {credits || "—"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Quality points
            </p>
            <p className="mt-1 md-title-medium tabular-nums">
              {qp ? qp.toFixed(2) : "—"}
            </p>
          </div>
          {mode === "boost" && (
            <div className="sm:col-span-2 border-t border-[var(--md-sys-color-outline-variant)] pt-3">
              <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                Next-term GPA needed to hit {Number.isFinite(target) ? target.toFixed(2) : "—"}
              </p>
              <p
                className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums"
                style={{
                  color: reachable
                    ? "var(--md-sys-color-tertiary)"
                    : "var(--md-sys-color-error)",
                }}
              >
                {requiredLabel}
              </p>
              {!reachable && Number.isFinite(required) && (
                <p className="md-body-small mt-2 text-[var(--md-sys-color-on-surface-variant)]">
                  Above 4.0 means the target is not reachable in one term at this credit load. Stretch the plan over more semesters or lower the target.
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Pass/fail and transfer credits are usually excluded from GPA at US institutions —
        only enter graded courses from the same school.
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
