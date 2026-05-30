"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";
import { TextField } from "@/components/md3/TextField";

// Single-leg P&L at expiration (US equity options, 100 shares per contract):
//   Long call:  max(0, S − K) − premium
//   Long put:   max(0, K − S) − premium
//   Short call: premium − max(0, S − K)
//   Short put:  premium − max(0, K − S)
// Sources: CBOE Options Toolbox; Hull "Options, Futures, and Other Derivatives" (9th ed.)

type Position = "long-call" | "long-put" | "short-call" | "short-put";
const SHARES_PER_CONTRACT = 100;

function plPerShare(pos: Position, S: number, K: number, premium: number): number {
  switch (pos) {
    case "long-call":
      return Math.max(0, S - K) - premium;
    case "long-put":
      return Math.max(0, K - S) - premium;
    case "short-call":
      return premium - Math.max(0, S - K);
    case "short-put":
      return premium - Math.max(0, K - S);
  }
}

function breakevens(pos: Position, K: number, premium: number): number[] {
  if (pos === "long-call" || pos === "short-call") return [K + premium];
  return [K - premium];
}

function maxProfit(pos: Position, K: number, premium: number): { value: number; unlimited: boolean } {
  switch (pos) {
    case "long-call":
      return { value: Infinity, unlimited: true };
    case "long-put":
      return { value: (K - premium) * SHARES_PER_CONTRACT, unlimited: false };
    case "short-call":
      return { value: premium * SHARES_PER_CONTRACT, unlimited: false };
    case "short-put":
      return { value: premium * SHARES_PER_CONTRACT, unlimited: false };
  }
}

function maxLoss(pos: Position, K: number, premium: number): { value: number; unlimited: boolean } {
  switch (pos) {
    case "long-call":
      return { value: -premium * SHARES_PER_CONTRACT, unlimited: false };
    case "long-put":
      return { value: -premium * SHARES_PER_CONTRACT, unlimited: false };
    case "short-call":
      return { value: -Infinity, unlimited: true };
    case "short-put":
      return { value: -(K - premium) * SHARES_PER_CONTRACT, unlimited: false };
  }
}

function fmtUSD(n: number): string {
  if (n === Infinity) return "Unlimited";
  if (n === -Infinity) return "Unlimited loss";
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const POSITIONS: { value: Position; label: string }[] = [
  { value: "long-call", label: "Long call" },
  { value: "long-put", label: "Long put" },
  { value: "short-call", label: "Short call" },
  { value: "short-put", label: "Short put" },
];

export function Calculator() {
  const [position, setPosition] = useState<Position>("long-call");
  const [strike, setStrike] = useState(100);
  const [premium, setPremium] = useState(3);
  const [contracts, setContracts] = useState(1);
  const [spot, setSpot] = useState(100);

  const data = useMemo(() => {
    const lo = strike * 0.5;
    const hi = strike * 1.5;
    const steps = 21;
    const rows = Array.from({ length: steps }, (_, i) => {
      const S = lo + ((hi - lo) * i) / (steps - 1);
      const perShare = plPerShare(position, S, strike, premium);
      const total = perShare * SHARES_PER_CONTRACT * contracts;
      return { spot: S, perShare, total };
    });
    const bes = breakevens(position, strike, premium);
    const mp = maxProfit(position, strike, premium);
    const ml = maxLoss(position, strike, premium);
    const atSpot = plPerShare(position, spot, strike, premium) * SHARES_PER_CONTRACT * contracts;
    return { rows, breakevens: bes, maxProfit: mp, maxLoss: ml, atSpot, lo, hi };
  }, [position, strike, premium, contracts, spot]);

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <Card variant="filled" className="mb-4 p-3 md-body-medium">
        <strong>Educational only.</strong> Not investment advice. Options can
        lose more than the premium paid for short positions. Per FINRA, ensure
        the position is appropriate for your risk tolerance and account approval
        level.
      </Card>

      <div className="mb-4">
        <p className="md-label-medium mb-1 text-[var(--md-sys-color-on-surface-variant)]">Position</p>
        <div
          role="radiogroup"
          aria-label="Position"
          className="inline-flex flex-wrap rounded-[var(--md-sys-shape-corner-full)] border border-[var(--md-sys-color-outline)] overflow-hidden"
        >
          {POSITIONS.map((p, i) => (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={position === p.value}
              onClick={() => setPosition(p.value)}
              className={[
                "min-h-12 px-4 md-label-large",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-[-2px]",
                position === p.value
                  ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                  : "text-[var(--md-sys-color-on-surface)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_8%,transparent)]",
                i > 0 ? "border-l border-[var(--md-sys-color-outline)]" : "",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Options inputs"
      >
        <TextField
          label="Strike price (K)"
          type="number"
          inputMode="decimal"
          value={strike}
          onChange={(e) => setStrike(Number(e.target.value))}
          min={0.01}
          step={0.5}
          trailing="$ / share"
        />
        <TextField
          label="Premium per share"
          type="number"
          inputMode="decimal"
          value={premium}
          onChange={(e) => setPremium(Number(e.target.value))}
          min={0}
          step={0.05}
          trailing="$ / share"
          supportingText={
            position.startsWith("long") ? "Cost basis you paid." : "Credit received at open."
          }
        />
        <TextField
          label="Contracts"
          type="number"
          inputMode="numeric"
          value={contracts}
          onChange={(e) => setContracts(Number(e.target.value))}
          min={1}
          step={1}
          trailing={`× ${SHARES_PER_CONTRACT} shares`}
        />
        <TextField
          label="Current spot price"
          type="number"
          inputMode="decimal"
          value={spot}
          onChange={(e) => setSpot(Number(e.target.value))}
          min={0}
          step={0.5}
          trailing="$ / share"
          supportingText="Used for P&L at the current price."
        />
      </form>

      <Card variant="filled" className="mt-6 p-4 sm:p-5">
        <div
          role="status"
          aria-live="polite"
          aria-label="Options profit results"
          className="grid gap-x-6 gap-y-4 sm:grid-cols-2"
        >
          <Out label="Max profit" value={fmtUSD(data.maxProfit.value)} emphasized />
          <Out label="Max loss" value={fmtUSD(data.maxLoss.value)} />
          <Out
            label="Breakeven price(s)"
            value={data.breakevens.map((b) => `$${b.toFixed(2)}`).join(" · ")}
          />
          <Out label="P&L at current spot" value={fmtUSD(data.atSpot)} />
        </div>
      </Card>

      <PnLChart rows={data.rows} strike={strike} breakevens={data.breakevens} />

      <details className="mt-4 rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]">
        <summary className="md-label-large cursor-pointer px-4 py-3 text-[var(--md-sys-color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] rounded-[var(--md-sys-shape-corner-md)]">
          P&L table (per spot price at expiration)
        </summary>
        <div className="overflow-x-auto border-t border-[var(--md-sys-color-outline-variant)]">
          <table className="w-full md-body-medium">
            <thead className="bg-[var(--md-sys-color-surface-container)] text-left">
              <tr>
                <th scope="col" className="px-4 py-2 md-label-medium">Spot</th>
                <th scope="col" className="px-4 py-2 md-label-medium text-right">P&L / share</th>
                <th scope="col" className="px-4 py-2 md-label-medium text-right">Total ({contracts} × {SHARES_PER_CONTRACT})</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r) => (
                <tr key={r.spot} className="border-t border-[var(--md-sys-color-outline-variant)]">
                  <td className="px-4 py-1.5 font-[var(--md-sys-typescale-mono-font)] tabular-nums">${r.spot.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right font-[var(--md-sys-typescale-mono-font)] tabular-nums">${r.perShare.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right font-[var(--md-sys-typescale-mono-font)] tabular-nums">{fmtUSD(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <p className="md-body-small mt-3 text-[var(--md-sys-color-on-surface-variant)]">
        {/* TODO_VERIFY: confirm 100-shares-per-contract assumption (standard US equity option, not mini) */}
        Assumes standard US equity options (100 shares per contract). P&L is at
        expiration only — Greeks (delta, gamma, theta, vega) are out of v1
        scope. Tax treatment per IRS Pub 550.
      </p>
    </Card>
  );
}

function Out({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <p
        className={[
          "mt-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums",
          emphasized
            ? "md-headline-small text-[var(--md-sys-color-primary)]"
            : "md-title-medium",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function PnLChart({
  rows,
  strike,
  breakevens,
}: {
  rows: { spot: number; total: number }[];
  strike: number;
  breakevens: number[];
}) {
  const W = 600;
  const H = 240;
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 36;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xs = rows.map((r) => r.spot);
  const ys = rows.map((r) => r.total);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yPad = Math.max(1, (Math.max(...ys) - Math.min(...ys)) * 0.1);
  const yMin = Math.min(...ys) - yPad;
  const yMax = Math.max(...ys) + yPad;

  const xScale = (x: number) => padL + ((x - xMin) / (xMax - xMin || 1)) * innerW;
  const yScale = (y: number) => padT + (1 - (y - yMin) / (yMax - yMin || 1)) * innerH;

  const linePath = rows
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xScale(r.spot).toFixed(2)} ${yScale(r.total).toFixed(2)}`)
    .join(" ");

  const zeroY = yScale(0);
  const showZero = yMin <= 0 && yMax >= 0;
  const strikeX = strike >= xMin && strike <= xMax ? xScale(strike) : null;

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => yMin + ((yMax - yMin) * i) / yTicks);
  const xTickVals = [xMin, (xMin + xMax) / 2, xMax];

  return (
    <figure className="mt-4">
      <figcaption className="md-label-medium mb-2 text-[var(--md-sys-color-on-surface-variant)]">
        P&L at expiration vs. spot price
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Profit and loss line chart from 50 percent below strike to 50 percent above strike"
        className="w-full h-auto rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)]"
      >
        {yTickVals.map((v) => (
          <g key={`y-${v}`}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="var(--md-sys-color-outline-variant)"
              strokeWidth={1}
            />
            <text
              x={padL - 6}
              y={yScale(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fill="var(--md-sys-color-on-surface-variant)"
            >
              {v >= 0 ? "$" : "−$"}
              {Math.abs(Math.round(v)).toLocaleString("en-US")}
            </text>
          </g>
        ))}

        {xTickVals.map((v) => (
          <text
            key={`x-${v}`}
            x={xScale(v)}
            y={H - padB + 16}
            textAnchor="middle"
            fontSize={10}
            fill="var(--md-sys-color-on-surface-variant)"
          >
            ${v.toFixed(0)}
          </text>
        ))}

        {showZero ? (
          <line
            x1={padL}
            x2={W - padR}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--md-sys-color-on-surface)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ) : null}

        {strikeX !== null ? (
          <g>
            <line
              x1={strikeX}
              x2={strikeX}
              y1={padT}
              y2={H - padB}
              stroke="var(--md-sys-color-secondary)"
              strokeWidth={1}
              strokeDasharray="2 4"
            />
            <text
              x={strikeX}
              y={padT + 12}
              textAnchor="middle"
              fontSize={10}
              fill="var(--md-sys-color-secondary)"
            >
              K = ${strike.toFixed(0)}
            </text>
          </g>
        ) : null}

        {breakevens.map((b) =>
          b >= xMin && b <= xMax ? (
            <g key={`be-${b}`}>
              <line
                x1={xScale(b)}
                x2={xScale(b)}
                y1={padT}
                y2={H - padB}
                stroke="var(--md-sys-color-tertiary)"
                strokeWidth={1}
                strokeDasharray="2 4"
              />
              <text
                x={xScale(b)}
                y={H - padB - 6}
                textAnchor="middle"
                fontSize={10}
                fill="var(--md-sys-color-tertiary)"
              >
                BE ${b.toFixed(2)}
              </text>
            </g>
          ) : null,
        )}

        <path
          d={linePath}
          fill="none"
          stroke="var(--md-sys-color-primary)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </figure>
  );
}
