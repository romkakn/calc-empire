"use client";

import { InlineCalc, type InlineResult } from "@/components/blog/InlineCalc";

const FIELDS = [
  { key: "a", label: "Leg a", initial: 3, suffix: "ft" },
  { key: "b", label: "Leg b", initial: 4, suffix: "ft" },
];

/** Trim floating-point noise without pretending to more precision than we have. */
function fmt(n: number): string {
  return Number.parseFloat(n.toFixed(4)).toString();
}

function computeHypotenuse({ a, b }: Record<string, number>): InlineResult[] {
  if (![a, b].every(Number.isFinite)) return [];
  if (a <= 0 || b <= 0) {
    return [
      {
        label: "Not a triangle",
        value: "—",
        note: "Both legs have to be a positive length before a² + b² = c² means anything.",
      },
    ];
  }

  const c = Math.sqrt(a * a + b * b);
  const isTriple = Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c);

  return [
    { label: "Hypotenuse (c = √(a² + b²))", value: `${fmt(c)} ft`, emphasis: true },
    {
      label: "Pythagorean triple?",
      value: isTriple ? "Yes" : "No",
      note: isTriple
        ? "All three sides land on whole numbers — the carpenter's check works exactly."
        : "The hypotenuse isn't a whole number, so a tape measure only gets you close.",
    },
  ];
}

export function HypotenuseWidget() {
  return (
    <InlineCalc
      title="Check a corner with a² + b² = c²"
      caption="Enter the two legs. The default is the 3-4-5 carpenter's triangle from the example above."
      fields={FIELDS}
      compute={computeHypotenuse}
      footnote="Works for any right triangle — a framing square, a TV bracket, a deck frame. Swap in your own measurements."
    />
  );
}
