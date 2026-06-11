"use client";

import { useId, useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

// Simple linear regression (ordinary least squares):
//   slope b = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)^2
//   intercept a = ȳ − b·x̄
//   R^2 = 1 − SS_res / SS_tot
// Reference: NIST/SEMATECH e-Handbook §4.1.4.1 (Linear Least Squares).

type View = "summary" | "residuals";

function parseSeries(raw: string): number[] {
  return raw
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map((t) => Number(t))
    .filter((n) => Number.isFinite(n));
}

type Fit = {
  n: number;
  slope: number;
  intercept: number;
  r2: number;
  xMean: number;
  yMean: number;
  residuals: { x: number; y: number; yhat: number; resid: number }[];
  error?: string;
};

function fitLine(xs: number[], ys: number[]): Fit {
  const empty: Fit = {
    n: 0, slope: NaN, intercept: NaN, r2: NaN, xMean: NaN, yMean: NaN, residuals: [],
  };
  if (xs.length !== ys.length) {
    return { ...empty, error: `x has ${xs.length} values, y has ${ys.length}. Lists must be the same length.` };
  }
  if (xs.length < 2) {
    return { ...empty, error: "Need at least 2 paired points to fit a line." };
  }
  const n = xs.length;
  const xMean = xs.reduce((s, v) => s + v, 0) / n;
  const yMean = ys.reduce((s, v) => s + v, 0) / n;

  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - xMean;
    sxy += dx * (ys[i] - yMean);
    sxx += dx * dx;
  }
  if (sxx === 0) {
    return { ...empty, error: "All x values are identical — slope is undefined." };
  }
  const slope = sxy / sxx;
  const intercept = yMean - slope * xMean;

  let ssRes = 0;
  let ssTot = 0;
  const residuals: Fit["residuals"] = [];
  for (let i = 0; i < n; i++) {
    const yhat = intercept + slope * xs[i];
    const resid = ys[i] - yhat;
    ssRes += resid * resid;
    const dy = ys[i] - yMean;
    ssTot += dy * dy;
    residuals.push({ x: xs[i], y: ys[i], yhat, resid });
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { n, slope, intercept, r2, xMean, yMean, residuals };
}

function fmt(n: number, digits = 4) {
  if (!Number.isFinite(n)) return "—";
  return Number(n.toFixed(digits)).toString();
}

export function Calculator() {
  const [xRaw, setXRaw] = useState("1, 2, 3, 4, 5");
  const [yRaw, setYRaw] = useState("2, 4, 5, 4, 5");
  const [view, setView] = useState<View>("summary");

  const fit = useMemo(() => {
    const xs = parseSeries(xRaw);
    const ys = parseSeries(yRaw);
    return fitLine(xs, ys);
  }, [xRaw, yRaw]);

  const equation =
    Number.isFinite(fit.slope) && Number.isFinite(fit.intercept)
      ? `y = ${fmt(fit.slope, 4)} × x + ${fmt(fit.intercept, 4)}`
      : "—";

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="View"
          value={view}
          onChange={(v) => setView(v as View)}
          options={[
            { value: "summary", label: "Summary" },
            { value: "residuals", label: "Residuals" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextAreaField
          label="x values"
          rows={4}
          value={xRaw}
          onChange={(e) => setXRaw(e.target.value)}
          supportingText="Comma, space, or newline separated."
        />
        <TextAreaField
          label="y values"
          rows={4}
          value={yRaw}
          onChange={(e) => setYRaw(e.target.value)}
          supportingText="Must match the count of x values."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {fit.error ? (
            <p className="sm:col-span-2 md-body-medium text-[var(--md-sys-color-error)]">{fit.error}</p>
          ) : view === "summary" ? (
            <>
              <div className="sm:col-span-2">
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Best-fit line</p>
                <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
                  {equation}
                </p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Slope (b)</p>
                <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmt(fit.slope)}</p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Intercept (a)</p>
                <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmt(fit.intercept)}</p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">R-squared</p>
                <p className="mt-1 md-title-large font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmt(fit.r2)}</p>
              </div>
              <div>
                <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">n / x̄ / ȳ</p>
                <p className="mt-1 md-title-medium font-[var(--md-sys-typescale-mono-font)] tabular-nums">
                  {fit.n} · {fmt(fit.xMean)} · {fmt(fit.yMean)}
                </p>
              </div>
            </>
          ) : (
            <div className="sm:col-span-2 overflow-x-auto">
              <table className="w-full text-left md-body-small tabular-nums">
                <thead>
                  <tr className="text-[var(--md-sys-color-on-surface-variant)]">
                    <th className="py-1 pr-3">x</th>
                    <th className="py-1 pr-3">y</th>
                    <th className="py-1 pr-3">ŷ</th>
                    <th className="py-1">residual</th>
                  </tr>
                </thead>
                <tbody>
                  {fit.residuals.map((r, i) => (
                    <tr key={i} className="border-t border-[var(--md-sys-color-outline-variant)]">
                      <td className="py-1 pr-3">{fmt(r.x)}</td>
                      <td className="py-1 pr-3">{fmt(r.y)}</td>
                      <td className="py-1 pr-3">{fmt(r.yhat)}</td>
                      <td className="py-1">{fmt(r.resid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        Ordinary least squares — assumes a roughly linear relationship and roughly even spread of residuals. Check the
        residuals view if the summary numbers look surprising.
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

function TextAreaField({
  label,
  supportingText,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  supportingText?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  const id = useId();
  const helpId = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="md-label-medium block mb-1 text-[var(--md-sys-color-on-surface-variant)]"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-describedby={supportingText ? helpId : undefined}
        className={[
          "w-full px-4 py-3 bg-transparent",
          "rounded-[var(--md-sys-shape-corner-xs)]",
          "border border-[var(--md-sys-color-outline)] outline-none",
          "focus:border-2 focus:border-[var(--md-sys-color-primary)] focus:px-[15px] focus:py-[11px]",
          "text-[var(--md-sys-color-on-surface)] caret-[var(--md-sys-color-primary)]",
          "md-body-large",
          "font-[var(--md-sys-typescale-mono-font)] tabular-nums",
        ].join(" ")}
      />
      {supportingText ? (
        <p
          id={helpId}
          className="md-body-small mt-1 ml-4 text-[var(--md-sys-color-on-surface-variant)]"
        >
          {supportingText}
        </p>
      ) : null}
    </div>
  );
}
