"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Semester grade = (T1 × w1) + (T2 × w2) + (Exam × wExam), weights as decimals summing to 1.
// Target solver: ExamNeeded = (target − T1·w1 − T2·w2) / wExam.

type Mode = "compute" | "solve";

function weightedSum(t1: number, w1: number, t2: number, w2: number, exam: number, wExam: number) {
  return t1 * (w1 / 100) + t2 * (w2 / 100) + exam * (wExam / 100);
}

function examNeeded(target: number, t1: number, w1: number, t2: number, w2: number, wExam: number) {
  if (wExam <= 0) return NaN;
  const termPart = t1 * (w1 / 100) + t2 * (w2 / 100);
  return (target - termPart) / (wExam / 100);
}

function letterGrade(g: number): string {
  if (!Number.isFinite(g)) return "—";
  if (g >= 93) return "A";
  if (g >= 90) return "A−";
  if (g >= 87) return "B+";
  if (g >= 83) return "B";
  if (g >= 80) return "B−";
  if (g >= 77) return "C+";
  if (g >= 73) return "C";
  if (g >= 70) return "C−";
  if (g >= 67) return "D+";
  if (g >= 63) return "D";
  if (g >= 60) return "D−";
  return "F";
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("compute");
  const [t1, setT1] = useState(85);
  const [w1, setW1] = useState(40);
  const [t2, setT2] = useState(90);
  const [w2, setW2] = useState(40);
  const [exam, setExam] = useState(80);
  const [wExam, setWExam] = useState(20);
  const [target, setTarget] = useState(90);

  const weightTotal = w1 + w2 + wExam;
  const weightsOk = Math.abs(weightTotal - 100) < 0.001;

  const { semester, needed, feasibility } = useMemo(() => {
    if (mode === "compute") {
      const s = weightedSum(t1, w1, t2, w2, exam, wExam);
      return { semester: s, needed: NaN, feasibility: "" };
    }
    const n = examNeeded(target, t1, w1, t2, w2, wExam);
    let feas = "";
    if (!Number.isFinite(n)) feas = "Exam weight is 0% — can't solve.";
    else if (n > 100) feas = "Impossible — even a perfect 100 wouldn't reach the target.";
    else if (n < 0) feas = "Already there — even a 0 on the exam clears the target.";
    return { semester: NaN, needed: n, feasibility: feas };
  }, [mode, t1, w1, t2, w2, exam, wExam, target]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Mode"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "compute", label: "Compute grade" },
            { value: "solve", label: "Target-grade solver" },
          ]}
        />
      </div>

      {!weightsOk && (
        <div className="mb-4 p-3 md-body-medium rounded-[var(--md-sys-shape-corner-md)] bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]">
          <strong>Weights total {weightTotal}%.</strong> Adjust so Term 1 + Term 2 + Exam weights add up to exactly 100%.
        </div>
      )}

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Term 1 grade"
          type="number"
          inputMode="decimal"
          value={t1}
          onChange={(e) => setT1(Number(e.target.value))}
          min={0}
          max={100}
          step={0.1}
          trailing="/100"
        />
        <TextField
          label="Term 1 weight"
          type="number"
          inputMode="decimal"
          value={w1}
          onChange={(e) => setW1(Number(e.target.value))}
          min={0}
          max={100}
          step={1}
          trailing="%"
        />
        <TextField
          label="Term 2 grade"
          type="number"
          inputMode="decimal"
          value={t2}
          onChange={(e) => setT2(Number(e.target.value))}
          min={0}
          max={100}
          step={0.1}
          trailing="/100"
        />
        <TextField
          label="Term 2 weight"
          type="number"
          inputMode="decimal"
          value={w2}
          onChange={(e) => setW2(Number(e.target.value))}
          min={0}
          max={100}
          step={1}
          trailing="%"
        />
        {mode === "compute" ? (
          <TextField
            label="Exam grade"
            type="number"
            inputMode="decimal"
            value={exam}
            onChange={(e) => setExam(Number(e.target.value))}
            min={0}
            max={100}
            step={0.1}
            trailing="/100"
          />
        ) : (
          <TextField
            label="Target semester grade"
            type="number"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            min={0}
            max={100}
            step={0.1}
            trailing="/100"
            supportingText="What you want to finish the semester with."
          />
        )}
        <TextField
          label="Exam weight"
          type="number"
          inputMode="decimal"
          value={wExam}
          onChange={(e) => setWExam(Number(e.target.value))}
          min={0}
          max={100}
          step={1}
          trailing="%"
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {mode === "compute" ? (
            <>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Semester grade</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {Number.isFinite(semester) ? semester.toFixed(1) : "—"}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Letter grade</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {/* TODO_VERIFY: plus/minus scale per district handbook (https://nces.ed.gov/ccd/) */}
                  {letterGrade(semester)}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Exam score needed</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {Number.isFinite(needed) ? needed.toFixed(1) : "—"}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Target letter grade</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {letterGrade(target)}
                </p>
              </div>
              {feasibility && (
                <div className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {feasibility}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Weights are entered as percentages (40 means 40%) and must sum to 100. Letter-grade bands follow a common US plus/minus scale — your school&apos;s handbook is the source of truth.
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
