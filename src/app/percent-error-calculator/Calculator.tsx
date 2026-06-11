"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Percent error formula (standard physics / chemistry):
//   %error = |experimental − theoretical| / |theoretical| × 100
// Signed form keeps direction (negative = measurement ran low).

type Mode = "absolute" | "signed";

function percentError(experimental: number, theoretical: number, mode: Mode) {
  if (!Number.isFinite(experimental) || !Number.isFinite(theoretical)) return NaN;
  if (theoretical === 0) return NaN;
  const diff = experimental - theoretical;
  const ratio = diff / Math.abs(theoretical);
  return (mode === "absolute" ? Math.abs(ratio) : ratio) * 100;
}

function tolerance(absPct: number): { label: string; tone: "ok" | "warn" | "alert" } {
  if (!Number.isFinite(absPct)) return { label: "—", tone: "ok" };
  if (absPct < 5) return { label: "Within typical lab tolerance (< 5%)", tone: "ok" };
  if (absPct < 10) return { label: "Acceptable for harder setups (5–10%)", tone: "warn" };
  return { label: "Above 10% — check for systematic error", tone: "alert" };
}

export function Calculator() {
  const [mode, setMode] = useState<Mode>("absolute");
  const [experimental, setExperimental] = useState(9.5);
  const [theoretical, setTheoretical] = useState(10);

  const { result, band, undefinedReason } = useMemo(() => {
    if (theoretical === 0) {
      return {
        result: NaN,
        absolutePct: NaN,
        band: tolerance(NaN),
        undefinedReason: "Theoretical value is zero — percent error is undefined.",
      };
    }
    const r = percentError(experimental, theoretical, mode);
    const abs = Math.abs(r);
    return { result: r, absolutePct: abs, band: tolerance(abs), undefinedReason: "" };
  }, [experimental, theoretical, mode]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[band.tone];

  const absoluteError = Number.isFinite(experimental) && Number.isFinite(theoretical)
    ? Math.abs(experimental - theoretical)
    : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Result style"
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { value: "absolute", label: "Absolute (standard)" },
            { value: "signed", label: "Signed (keeps direction)" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Experimental value"
          type="number"
          inputMode="decimal"
          value={experimental}
          onChange={(e) => setExperimental(Number(e.target.value))}
          step="any"
          supportingText="The value you measured."
        />
        <TextField
          label="Theoretical (accepted) value"
          type="number"
          inputMode="decimal"
          value={theoretical}
          onChange={(e) => setTheoretical(Number(e.target.value))}
          step="any"
          supportingText="The known or reference value. Cannot be zero."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Percent error</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(result) ? `${result.toFixed(2)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Absolute error</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(absoluteError) ? absoluteError.toFixed(4) : "—"}
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
          {undefinedReason && (
            <p className="sm:col-span-2 md-body-small text-[var(--md-sys-color-error)]">
              {undefinedReason}
            </p>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Tolerance bands reflect typical introductory physics-lab conventions; your course or
        instrument spec may set tighter limits. Percent error captures accuracy, not precision —
        repeated trials still matter.
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
