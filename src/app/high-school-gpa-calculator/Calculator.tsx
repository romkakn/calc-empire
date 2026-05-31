"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Standard US high-school 4.0 scale with plus/minus.
// TODO_VERIFY: College Board BigFuture — How to Convert Your GPA to a 4.0 Scale
//   https://bigfuture.collegeboard.org/plan-for-college/your-high-school-record/how-to-convert-gpa-4.0-scale
const LETTER_POINTS: Record<string, number> = {
  "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0,
  "F": 0,
};
const LETTERS = Object.keys(LETTER_POINTS);

// Weighted bonuses vary by district; +0.5 Honors / +1.0 AP-IB is the most common rule.
// TODO_VERIFY: bonus values can be set differently by individual districts; confirm with your school policy.
//   https://bigfuture.collegeboard.org/plan-for-college/your-high-school-record/how-to-convert-gpa-4.0-scale
const HONORS_BONUS = 0.5;
const AP_BONUS = 1.0;

type CourseType = "regular" | "honors" | "ap";
type Mode = "unweighted" | "weighted";

type Row = {
  id: number;
  name: string;
  letter: string;
  credits: number;
  courseType: CourseType;
};

const DEFAULT_ROWS: Row[] = [
  { id: 1, name: "English",          letter: "A",  credits: 1,   courseType: "regular" },
  { id: 2, name: "Honors Algebra II", letter: "B+", credits: 1,   courseType: "honors"  },
  { id: 3, name: "AP US History",    letter: "A-", credits: 1,   courseType: "ap"      },
  { id: 4, name: "PE",               letter: "B",  credits: 0.5, courseType: "regular" },
];

function pointsFor(letter: string, courseType: CourseType, mode: Mode): number {
  const base = LETTER_POINTS[letter];
  if (!Number.isFinite(base)) return NaN;
  if (mode === "unweighted") return base;
  if (courseType === "honors") return base + HONORS_BONUS;
  if (courseType === "ap") return base + AP_BONUS;
  return base;
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("unweighted");
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS);
  const [nextId, setNextId] = useState(5);

  const { gpa, totalCredits, totalPoints, hasInvalid } = useMemo(() => {
    let credits = 0;
    let points = 0;
    let invalid = false;
    for (const r of rows) {
      const p = pointsFor(r.letter, r.courseType, mode);
      const c = Number(r.credits);
      if (!Number.isFinite(p) || !Number.isFinite(c) || c <= 0) {
        invalid = true;
        continue;
      }
      credits += c;
      points += p * c;
    }
    const g = credits > 0 ? points / credits : NaN;
    return { gpa: g, totalCredits: credits, totalPoints: points, hasInvalid: invalid };
  }, [rows, mode]);

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [...rs, { id: nextId, name: "", letter: "A", credits: 1, courseType: "regular" }]);
    setNextId((n) => n + 1);
  }
  function removeRow(id: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="GPA scale"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "unweighted", label: "Unweighted (4.0)" },
            { value: "weighted", label: "Weighted (+Honors/AP)" },
          ]}
        />
      </div>

      <form onSubmit={(e) => e.preventDefault()} noValidate className="grid gap-3">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className="grid gap-3 sm:grid-cols-[1fr_8rem_7rem_9rem_auto] sm:items-start rounded-[var(--md-sys-shape-corner-medium)] border border-[var(--md-sys-color-outline-variant)] p-3"
          >
            <TextField
              label={`Course ${i + 1} name`}
              value={r.name}
              onChange={(e) => updateRow(r.id, { name: e.target.value })}
              maxLength={60}
            />
            <div>
              <label className="md-label-medium block mb-1 text-[var(--md-sys-color-on-surface-variant)]" htmlFor={`grade-${r.id}`}>Grade</label>
              <select
                id={`grade-${r.id}`}
                value={r.letter}
                onChange={(e) => updateRow(r.id, { letter: e.target.value })}
                className="w-full min-h-12 rounded-[var(--md-sys-shape-corner-extra-small)] border border-[var(--md-sys-color-outline)] bg-transparent px-3 md-body-large text-[var(--md-sys-color-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
              >
                {LETTERS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="md-label-medium block mb-1 text-[var(--md-sys-color-on-surface-variant)]" htmlFor={`credits-${r.id}`}>Credits</label>
              <input
                id={`credits-${r.id}`}
                type="number"
                inputMode="decimal"
                value={r.credits}
                onChange={(e) => updateRow(r.id, { credits: Number(e.target.value) })}
                min={0.25}
                max={2}
                step={0.25}
                className="w-full min-h-12 rounded-[var(--md-sys-shape-corner-extra-small)] border border-[var(--md-sys-color-outline)] bg-transparent px-3 md-body-large text-[var(--md-sys-color-on-surface)] tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
              />
            </div>
            <div>
              <label className="md-label-medium block mb-1 text-[var(--md-sys-color-on-surface-variant)]" htmlFor={`type-${r.id}`}>Type</label>
              <select
                id={`type-${r.id}`}
                value={r.courseType}
                onChange={(e) => updateRow(r.id, { courseType: e.target.value as CourseType })}
                className="w-full min-h-12 rounded-[var(--md-sys-shape-corner-extra-small)] border border-[var(--md-sys-color-outline)] bg-transparent px-3 md-body-large text-[var(--md-sys-color-on-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
              >
                <option value="regular">Regular</option>
                <option value="honors">Honors</option>
                <option value="ap">AP / IB</option>
              </select>
            </div>
            <div className="sm:pt-6">
              <button
                type="button"
                onClick={() => removeRow(r.id)}
                disabled={rows.length === 1}
                aria-label={`Remove ${r.name || `course ${i + 1}`}`}
                className="min-h-12 min-w-12 rounded-[var(--md-sys-shape-corner-full)] px-3 md-label-large text-[var(--md-sys-color-on-surface-variant)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div>
          <button
            type="button"
            onClick={addRow}
            className="min-h-12 px-4 rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] md-label-large text-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_8%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]"
          >
            + Add course
          </button>
        </div>
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              {mode === "weighted" ? "Weighted GPA" : "Unweighted GPA"}
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(gpa) ? gpa.toFixed(3) : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Total credit hours
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {totalCredits > 0 ? totalCredits.toFixed(2) : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            {Number.isFinite(gpa) ? (
              <>Total grade points: {totalPoints.toFixed(2)} ÷ {totalCredits.toFixed(2)} credits.</>
            ) : (
              <>Enter at least one course with a positive credit value.</>
            )}
            {hasInvalid && <> Skipped rows with missing or zero credits.</>}
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Standard US 4.0 scale with plus/minus. Weighted mode adds +{HONORS_BONUS.toFixed(1)} for Honors and +{AP_BONUS.toFixed(1)} for AP/IB to that course&apos;s points before averaging. District policies vary — check your school&apos;s grading scale.
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
