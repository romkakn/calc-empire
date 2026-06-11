"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Stair geometry — IRC 2024 Section R311.7 (residential):
//   max riser height = 7.75 in    // TODO_VERIFY: IRC 2024 R311.7.5.1 — https://codes.iccsafe.org/content/IRC2024P1/chapter-3-building-planning
//   min tread depth  = 10 in      // TODO_VERIFY: IRC 2024 R311.7.5.2
//   max stair angle  ~ 36 deg     // derived from 7.75 / 10 ratio
//   min headroom     = 80 in      // TODO_VERIFY: IRC 2024 R311.7.2
//   handrail required at 4+ risers // TODO_VERIFY: IRC 2024 R311.7.8
//
// Formula:
//   risers       = ceil(total_rise / max_riser)
//   riser_height = total_rise / risers
//   treads       = risers - 1
//   run          = treads * tread_depth
//   stringer     = sqrt(rise^2 + run^2)

const IRC_MAX_RISER = 7.75;
const IRC_MIN_TREAD = 10;
const IRC_MIN_HEADROOM = 80;
const IRC_HANDRAIL_THRESHOLD = 4;

type Unit = "in" | "cm";

function toInches(v: number, unit: Unit) {
  return unit === "in" ? v : v / 2.54;
}
function fromInches(v: number, unit: Unit) {
  return unit === "in" ? v : v * 2.54;
}

type Geometry = {
  risers: number;
  riserHeight: number;
  treads: number;
  run: number;
  stringer: number;
  angleDeg: number;
};

function computeStairs(totalRiseIn: number, treadDepthIn: number): Geometry {
  if (!Number.isFinite(totalRiseIn) || !Number.isFinite(treadDepthIn) || totalRiseIn <= 0 || treadDepthIn <= 0) {
    return { risers: NaN, riserHeight: NaN, treads: NaN, run: NaN, stringer: NaN, angleDeg: NaN };
  }
  const risers = Math.ceil(totalRiseIn / IRC_MAX_RISER);
  const riserHeight = totalRiseIn / risers;
  const treads = risers - 1;
  const run = treads * treadDepthIn;
  const stringer = Math.sqrt(totalRiseIn * totalRiseIn + run * run);
  const angleDeg = (Math.atan2(totalRiseIn, run) * 180) / Math.PI;
  return { risers, riserHeight, treads, run, stringer, angleDeg };
}

type CodeFlag = { label: string; tone: "ok" | "warn" | "alert" };

function codeStatus(g: Geometry, treadDepthIn: number): CodeFlag {
  if (!Number.isFinite(g.riserHeight)) return { label: "—", tone: "ok" };
  if (g.riserHeight > IRC_MAX_RISER + 0.005) {
    return { label: `Riser ${g.riserHeight.toFixed(2)} in exceeds IRC 7.75 in`, tone: "alert" };
  }
  if (treadDepthIn < IRC_MIN_TREAD - 0.005) {
    return { label: `Tread ${treadDepthIn.toFixed(2)} in below IRC 10 in`, tone: "alert" };
  }
  if (g.angleDeg > 36.5) {
    return { label: `Angle ${g.angleDeg.toFixed(1)} deg above 36 deg target`, tone: "warn" };
  }
  return { label: "Within IRC 2024 limits", tone: "ok" };
}

export function Calculator() {
  const [unit, setUnit] = useState<Unit>("in");
  const [totalRise, setTotalRise] = useState(108);
  const [treadDepth, setTreadDepth] = useState(10);

  const { geom, flag, handrailNeeded } = useMemo(() => {
    const riseIn = toInches(totalRise, unit);
    const treadIn = toInches(treadDepth, unit);
    const g = computeStairs(riseIn, treadIn);
    return {
      geom: g,
      flag: codeStatus(g, treadIn),
      handrailNeeded: Number.isFinite(g.risers) && g.risers >= IRC_HANDRAIL_THRESHOLD,
    };
  }, [unit, totalRise, treadDepth]);

  const toneColor = {
    ok: "var(--md-sys-color-tertiary)",
    warn: "var(--md-sys-color-secondary)",
    alert: "var(--md-sys-color-error)",
  }[flag.tone];

  const unitLabel = unit === "in" ? "in" : "cm";
  const displayRiser = Number.isFinite(geom.riserHeight) ? fromInches(geom.riserHeight, unit) : NaN;
  const displayRun = Number.isFinite(geom.run) ? fromInches(geom.run, unit) : NaN;
  const displayStringer = Number.isFinite(geom.stringer) ? fromInches(geom.stringer, unit) : NaN;

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Planning aid.</strong> Verify against your local code amendments and pull a
        permit before cutting stringers.
      </Card>

      <div className="flex flex-wrap gap-3 mb-4">
        <Segment
          label="Unit"
          value={unit}
          onChange={(v) => setUnit(v as Unit)}
          options={[
            { value: "in", label: "Inches" },
            { value: "cm", label: "Centimeters" },
          ]}
        />
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <TextField
          label="Total rise (floor to floor)"
          type="number"
          inputMode="decimal"
          value={totalRise}
          onChange={(e) => setTotalRise(Number(e.target.value))}
          min={1}
          max={unit === "in" ? 240 : 600}
          step={unit === "in" ? 0.25 : 0.5}
          trailing={unitLabel}
          supportingText="Finished floor below to finished floor above."
        />
        <TextField
          label="Preferred tread depth"
          type="number"
          inputMode="decimal"
          value={treadDepth}
          onChange={(e) => setTreadDepth(Number(e.target.value))}
          min={unit === "in" ? 8 : 20}
          max={unit === "in" ? 16 : 40}
          step={unit === "in" ? 0.25 : 0.5}
          trailing={unitLabel}
          supportingText={`IRC 2024 minimum is ${IRC_MIN_TREAD} in (25.4 cm).`}
        />
      </form>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Risers</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(geom.risers) ? geom.risers : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Riser height</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(displayRiser) ? `${displayRiser.toFixed(2)} ${unitLabel}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Treads</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(geom.treads) ? geom.treads : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Total run</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(displayRun) ? `${displayRun.toFixed(1)} ${unitLabel}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Stringer length</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(displayStringer) ? `${displayStringer.toFixed(1)} ${unitLabel}` : "—"}
            </p>
          </div>
          <div>
            <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">Stair angle</p>
            <p className="mt-1 md-headline-small font-[var(--md-sys-typescale-mono-font)] tabular-nums text-[var(--md-sys-color-primary)]">
              {Number.isFinite(geom.angleDeg) ? `${geom.angleDeg.toFixed(1)}°` : "—"}
            </p>
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block size-3 rounded-full"
              style={{ backgroundColor: toneColor }}
            />
            <span className="md-title-medium">{flag.label}</span>
          </div>
          {handrailNeeded && (
            <div className="sm:col-span-2 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
              Handrail required: {geom.risers} risers is {IRC_HANDRAIL_THRESHOLD} or more.
            </div>
          )}
        </div>
      </Card>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        IRC 2024 limits used: max riser {IRC_MAX_RISER} in, min tread {IRC_MIN_TREAD} in, min
        headroom {IRC_MIN_HEADROOM} in. Local amendments may differ — check before you build.
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
