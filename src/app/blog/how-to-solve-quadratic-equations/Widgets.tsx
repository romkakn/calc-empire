"use client";

import { InlineCalc, fmt, type InlineResult } from "@/components/blog/InlineCalc";

const FIELDS = [
  { key: "a", label: "a (x² coefficient)", initial: 1, supportingText: "Cannot be 0" },
  { key: "b", label: "b (x coefficient)", initial: -5 },
  { key: "c", label: "c (constant)", initial: 6 },
];

function isPerfectSquare(n: number): boolean {
  if (n < 0 || !Number.isInteger(n)) return false;
  const r = Math.round(Math.sqrt(n));
  return r * r === n;
}

function computeDiscriminant({ a, b, c }: Record<string, number>): InlineResult[] {
  if (![a, b, c].every(Number.isFinite)) return [];
  if (a === 0) {
    return [
      {
        label: "Not a quadratic",
        value: "—",
        note: "With a = 0 the x² term disappears and bx + c = 0 is linear.",
      },
    ];
  }

  const delta = b * b - 4 * a * c;
  const rows: InlineResult[] = [
    { label: "Discriminant (Δ = b² − 4ac)", value: fmt(delta, 6), emphasis: true },
  ];

  if (delta > 0) {
    const root = Math.sqrt(delta);
    rows.push({
      label: "Solutions",
      value: `${fmt((-b + root) / (2 * a), 6)}, ${fmt((-b - root) / (2 * a), 6)}`,
      note: "Two distinct real roots — the parabola crosses the x-axis twice.",
    });
    rows.push({
      label: "Try factoring first?",
      value: isPerfectSquare(delta) ? "Yes" : "No",
      note: isPerfectSquare(delta)
        ? "Δ is a perfect square, so an integer factor pair exists."
        : "Δ is not a perfect square — go straight to the quadratic formula.",
    });
  } else if (delta === 0) {
    rows.push({
      label: "Solution",
      value: `${fmt(-b / (2 * a), 6)} (repeated)`,
      note: "One real root — the parabola touches the x-axis at its vertex.",
    });
    rows.push({ label: "Try factoring first?", value: "Yes", note: "It factors as a perfect square." });
  } else {
    const real = -b / (2 * a);
    const imag = Math.sqrt(-delta) / (2 * Math.abs(a));
    rows.push({
      label: "Solutions",
      value: `${fmt(real, 6)} ± ${fmt(imag, 6)}i`,
      note: "Two complex conjugates — the parabola never crosses the x-axis.",
    });
    rows.push({
      label: "Try factoring first?",
      value: "No",
      note: "There is no integer factor pair to find.",
    });
  }

  return rows;
}

export function DiscriminantWidget() {
  return (
    <InlineCalc
      title="Read the discriminant"
      caption="Type the coefficients of ax² + bx + c = 0. The default is x² − 5x + 6, the worked example above."
      fields={FIELDS}
      compute={computeDiscriminant}
      footnote="Complex roots are shown in a ± bi form. Exact radicals are rounded to six decimal places."
    />
  );
}
