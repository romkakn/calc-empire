"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/md3/Card";

type Op = "+" | "-" | "*" | "/";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

function toImproper(whole: number, num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: NaN, den: 0 };
  const sign = whole < 0 ? -1 : 1;
  const absWhole = Math.abs(whole);
  const newNum = (absWhole * den + num) * sign;
  return { num: newNum, den };
}

function reduce(num: number, den: number): { num: number; den: number } {
  if (den === 0) return { num: NaN, den: 0 };
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  const a = Math.abs(num);
  const b = Math.abs(den);
  const g = gcd(a, b);
  return { num: sign * (a / g), den: b / g };
}

function toMixed(num: number, den: number): { whole: number; num: number; den: number } {
  if (den === 0 || !Number.isFinite(num)) return { whole: 0, num: NaN, den: 0 };
  const sign = (num < 0) !== (den < 0) ? -1 : 1;
  const a = Math.abs(num);
  const b = Math.abs(den);
  const whole = Math.floor(a / b);
  const rem = a - whole * b;
  return { whole: sign * whole, num: rem, den: b };
}

function fmtFrac(f: { num: number; den: number }): string {
  if (!Number.isFinite(f.num) || f.den === 0) return "—";
  if (f.den === 1) return `${f.num}`;
  return `${f.num}/${f.den}`;
}

function fmtMixed(m: { whole: number; num: number; den: number }): string {
  if (!Number.isFinite(m.num) || m.den === 0) return "—";
  if (m.num === 0) return `${m.whole}`;
  if (m.whole === 0) return fmtFrac({ num: m.num, den: m.den });
  const sign = m.whole < 0 ? "-" : "";
  return `${sign}${Math.abs(m.whole)} ${m.num}/${m.den}`;
}

function applyOp(a: { num: number; den: number }, op: Op, b: { num: number; den: number }) {
  switch (op) {
    case "+": return { num: a.num * b.den + b.num * a.den, den: a.den * b.den };
    case "-": return { num: a.num * b.den - b.num * a.den, den: a.den * b.den };
    case "*": return { num: a.num * b.num, den: a.den * b.den };
    case "/": return { num: a.num * b.den, den: a.den * b.num };
  }
}

export function Calculator() {
  const [aW, setAw] = useState(2);
  const [aN, setAn] = useState(1);
  const [aD, setAd] = useState(2);
  const [op, setOp] = useState<Op>("+");
  const [bW, setBw] = useState(1);
  const [bN, setBn] = useState(3);
  const [bD, setBd] = useState(4);
  const [showSteps, setShowSteps] = useState(true);

  const r = useMemo(() => {
    if (aD === 0 || bD === 0) return null;
    const A = toImproper(aW, aN, aD);
    const B = toImproper(bW, bN, bD);
    if ((op === "/") && B.num === 0) return null;
    const raw = applyOp(A, op, B);
    const red = reduce(raw.num, raw.den);
    const mixed = toMixed(red.num, red.den);
    const decimal = raw.den !== 0 ? raw.num / raw.den : NaN;
    return { A, B, raw, red, mixed, decimal };
  }, [aW, aN, aD, op, bW, bN, bD]);

  const opLabel: Record<Op, string> = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  return (
    <Card variant="outlined" as="section" className="p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr,auto,1fr] items-center">
        <Operand label="Number A" whole={aW} setWhole={setAw} num={aN} setNum={setAn} den={aD} setDen={setAd} />

        <div role="radiogroup" aria-label="Operator" className="flex sm:flex-col gap-1 justify-center">
          {(["+", "-", "*", "/"] as Op[]).map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={op === o}
              onClick={() => setOp(o)}
              className={[
                "min-h-12 min-w-12 rounded-[var(--md-sys-shape-corner-xs)] md-title-medium",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2",
                op === o
                  ? "bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]"
                  : "bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface)]",
              ].join(" ")}
            >
              {opLabel[o]}
            </button>
          ))}
        </div>

        <Operand label="Number B" whole={bW} setWhole={setBw} num={bN} setNum={setBn} den={bD} setDen={setBd} />
      </div>

      <Card variant="filled" className="mt-6 p-4">
        <div role="status" aria-live="polite" className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
          <Out label="As mixed number" value={r ? fmtMixed(r.mixed) : "—"} emphasized />
          <Out label="As improper fraction" value={r ? fmtFrac(r.red) : "—"} />
          <Out label="As decimal" value={r && Number.isFinite(r.decimal) ? r.decimal.toFixed(6).replace(/0+$/, "").replace(/\.$/, "") : "—"} />
        </div>
      </Card>

      <label className="md-body-medium mt-3 flex items-center gap-2">
        <input type="checkbox" checked={showSteps} onChange={(e) => setShowSteps(e.target.checked)} />
        Show step-by-step
      </label>

      {showSteps && r ? (
        <ol className="mt-3 md-body-medium list-decimal pl-5 space-y-1 text-[var(--md-sys-color-on-surface)]">
          <li>Convert A to improper: <code className="font-[var(--md-sys-typescale-mono-font)]">{fmtFrac(r.A)}</code></li>
          <li>Convert B to improper: <code className="font-[var(--md-sys-typescale-mono-font)]">{fmtFrac(r.B)}</code></li>
          <li>Apply <code>{opLabel[op]}</code>: <code className="font-[var(--md-sys-typescale-mono-font)]">{fmtFrac(r.A)} {opLabel[op]} {fmtFrac(r.B)} = {fmtFrac(r.raw)}</code></li>
          <li>Reduce via GCD: <code className="font-[var(--md-sys-typescale-mono-font)]">{fmtFrac(r.red)}</code></li>
          <li>Convert back to mixed: <code className="font-[var(--md-sys-typescale-mono-font)]">{fmtMixed(r.mixed)}</code></li>
        </ol>
      ) : null}
    </Card>
  );
}

function Operand({
  label, whole, setWhole, num, setNum, den, setDen,
}: {
  label: string;
  whole: number; setWhole: (n: number) => void;
  num: number; setNum: (n: number) => void;
  den: number; setDen: (n: number) => void;
}) {
  return (
    <fieldset className="rounded-[var(--md-sys-shape-corner-md)] border border-[var(--md-sys-color-outline-variant)] p-3">
      <legend className="md-label-large px-1">{label}</legend>
      <div className="flex items-center gap-2">
        <input aria-label={`${label} whole part`} type="number" value={whole} onChange={(e) => setWhole(Number(e.target.value))} className="w-20" />
        <div className="flex flex-col">
          <input aria-label={`${label} numerator`} type="number" value={num} onChange={(e) => setNum(Number(e.target.value))} className="w-16" />
          <div className="border-t border-[var(--md-sys-color-on-surface)] my-1" aria-hidden />
          <input aria-label={`${label} denominator`} type="number" value={den} onChange={(e) => setDen(Number(e.target.value))} min={1} className="w-16" />
        </div>
      </div>
      {den === 0 ? <p className="md-body-small mt-2 text-[var(--md-sys-color-error)]">Denominator can&apos;t be 0.</p> : null}
    </fieldset>
  );
}

function Out({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div>
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">{label}</p>
      <p className={["mt-1 font-[var(--md-sys-typescale-mono-font)] tabular-nums", emphasized ? "md-headline-small text-[var(--md-sys-color-primary)]" : "md-title-medium"].join(" ")}>
        {value}
      </p>
    </div>
  );
}
