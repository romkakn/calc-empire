"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// AP score estimator.
// Per College Board, every AP exam composite is:
//   composite = MCQ_raw × MCQ_weight + FRQ_raw × FRQ_weight
// then mapped to 1–5 via a per-subject cutoff table.
// TODO_VERIFY: subject section weights — confirm against the latest Course and Exam Description.
//   Source: https://apcentral.collegeboard.org/courses
// TODO_VERIFY: composite cutoff bands — confirm against the most recent released exam per subject.
//   Source: https://apcentral.collegeboard.org/

type SubjectKey =
  | "calc-ab"
  | "calc-bc"
  | "stats"
  | "physics-1"
  | "bio"
  | "chem"
  | "lang"
  | "lit"
  | "us-history"
  | "world-history";

type Subject = {
  key: SubjectKey;
  label: string;
  mcqMax: number;
  frqMax: number;
  mcqWeight: number; // fraction of composite carried by MCQ
  frqWeight: number; // fraction of composite carried by FRQ
  compositeMax: number; // total points after scaling
  // Cutoff bands: minimum composite to earn each score.
  // Example: { five: 80, four: 63, three: 47, two: 31 } means
  // composite >= 80 -> 5, 63–79 -> 4, 47–62 -> 3, 31–46 -> 2, else 1.
  cutoffs: { five: number; four: number; three: number; two: number };
};

const SUBJECTS: Subject[] = [
  {
    key: "calc-ab",
    label: "AP Calculus AB",
    mcqMax: 45,
    frqMax: 54,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 108,
    cutoffs: { five: 80, four: 63, three: 47, two: 31 },
  },
  {
    key: "calc-bc",
    label: "AP Calculus BC",
    mcqMax: 45,
    frqMax: 54,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 108,
    cutoffs: { five: 75, four: 60, three: 45, two: 30 },
  },
  {
    key: "stats",
    label: "AP Statistics",
    mcqMax: 40,
    frqMax: 50,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 100,
    cutoffs: { five: 70, four: 57, three: 44, two: 33 },
  },
  {
    key: "physics-1",
    label: "AP Physics 1",
    mcqMax: 50,
    frqMax: 45,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 90,
    cutoffs: { five: 71, four: 55, three: 41, two: 29 },
  },
  {
    key: "bio",
    label: "AP Biology",
    mcqMax: 60,
    frqMax: 60,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 120,
    cutoffs: { five: 80, four: 64, three: 50, two: 36 },
  },
  {
    key: "chem",
    label: "AP Chemistry",
    mcqMax: 60,
    frqMax: 46,
    mcqWeight: 0.5,
    frqWeight: 0.5,
    compositeMax: 100,
    cutoffs: { five: 72, four: 58, three: 44, two: 30 },
  },
  {
    key: "lang",
    label: "AP English Language",
    mcqMax: 45,
    frqMax: 18, // 3 essays × 6 pts
    mcqWeight: 0.45,
    frqWeight: 0.55,
    compositeMax: 100,
    cutoffs: { five: 75, four: 63, three: 50, two: 39 },
  },
  {
    key: "lit",
    label: "AP English Literature",
    mcqMax: 55,
    frqMax: 18,
    mcqWeight: 0.45,
    frqWeight: 0.55,
    compositeMax: 100,
    cutoffs: { five: 76, four: 64, three: 51, two: 40 },
  },
  {
    key: "us-history",
    label: "AP US History",
    mcqMax: 55,
    frqMax: 40,
    mcqWeight: 0.6,
    frqWeight: 0.4,
    compositeMax: 100,
    cutoffs: { five: 75, four: 60, three: 45, two: 32 },
  },
  {
    key: "world-history",
    label: "AP World History",
    mcqMax: 55,
    frqMax: 40,
    mcqWeight: 0.6,
    frqWeight: 0.4,
    compositeMax: 100,
    cutoffs: { five: 75, four: 60, three: 45, two: 32 },
  },
];

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function compositeFor(subject: Subject, mcq: number, frq: number) {
  const mcqFrac = subject.mcqMax > 0 ? clamp(mcq, 0, subject.mcqMax) / subject.mcqMax : 0;
  const frqFrac = subject.frqMax > 0 ? clamp(frq, 0, subject.frqMax) / subject.frqMax : 0;
  const mcqPoints = mcqFrac * subject.mcqWeight * subject.compositeMax;
  const frqPoints = frqFrac * subject.frqWeight * subject.compositeMax;
  return mcqPoints + frqPoints;
}

function scoreFor(subject: Subject, composite: number): 1 | 2 | 3 | 4 | 5 {
  const c = subject.cutoffs;
  if (composite >= c.five) return 5;
  if (composite >= c.four) return 4;
  if (composite >= c.three) return 3;
  if (composite >= c.two) return 2;
  return 1;
}

function scoreBand(score: 1 | 2 | 3 | 4 | 5): { label: string; tone: "ok" | "warn" | "alert" } {
  if (score >= 4) return { label: `Score ${score} — credit-eligible at most colleges`, tone: "ok" };
  if (score === 3) return { label: "Score 3 — qualifying, accepted by many colleges", tone: "warn" };
  return { label: `Score ${score} — usually below college credit threshold`, tone: "alert" };
}

export function Calculator() {
  const [subjectKey, setSubjectKey] = useState<SubjectKey>("calc-ab");
  const subject = SUBJECTS.find((s) => s.key === subjectKey) ?? SUBJECTS[0];
  const [mcq, setMcq] = useState(30);
  const [frq, setFrq] = useState(35);

  const { composite, score, band } = useMemo(() => {
    const comp = compositeFor(subject, mcq, frq);
    const sc = scoreFor(subject, comp);
    return { composite: comp, score: sc, band: scoreBand(sc) };
  }, [subject, mcq, frq]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Estimate only.</strong> College Board does not publish exact composite cutoffs.
        Bands use the most recent released exam per subject.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="AP subject"
          value={subjectKey}
          onChange={(v) => {
            const next = SUBJECTS.find((s) => s.key === (v as SubjectKey)) ?? SUBJECTS[0];
            setSubjectKey(next.key);
            // re-clamp raw inputs into the new subject's range
            setMcq((m) => clamp(m, 0, next.mcqMax));
            setFrq((f) => clamp(f, 0, next.frqMax));
          }}
          options={SUBJECTS.map((s) => ({ value: s.key, label: s.label }))}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="MCQ raw points"
          type="number"
          inputMode="numeric"
          value={mcq}
          onChange={(e) => setMcq(Number(e.target.value))}
          min={0}
          max={subject.mcqMax}
          step={1}
          trailing={`/ ${subject.mcqMax}`}
          supportingText={`Multiple-choice section. ${Math.round(subject.mcqWeight * 100)}% of composite.`}
        />
        <TextField
          label="FRQ raw points"
          type="number"
          inputMode="numeric"
          value={frq}
          onChange={(e) => setFrq(Number(e.target.value))}
          min={0}
          max={subject.frqMax}
          step={1}
          trailing={`/ ${subject.frqMax}`}
          supportingText={`Free-response section. ${Math.round(subject.frqWeight * 100)}% of composite.`}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Composite
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {composite.toFixed(1)} / {subject.compositeMax}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
              Projected AP score
            </p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {score}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{band.label}</span>
          </div>
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Cutoff bands (composite out of {subject.compositeMax}): 5 ≥ {subject.cutoffs.five} ·
        4 ≥ {subject.cutoffs.four} · 3 ≥ {subject.cutoffs.three} · 2 ≥ {subject.cutoffs.two}.
        Each year College Board re-equates the curve, so borderline scores may move one band.
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
      <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden">
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
