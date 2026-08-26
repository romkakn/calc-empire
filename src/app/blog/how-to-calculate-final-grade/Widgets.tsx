"use client";

import { InlineCalc, fmt, type InlineResult } from "@/components/blog/InlineCalc";

const FIELDS = [
  { key: "g1", label: "Homework grade", initial: 88 },
  { key: "w1", label: "Homework weight", initial: 0.2, step: 0.01, supportingText: "As a decimal, e.g. 0.20" },
  { key: "g2", label: "Quizzes grade", initial: 92 },
  { key: "w2", label: "Quizzes weight", initial: 0.2, step: 0.01 },
  { key: "g3", label: "Midterm grade", initial: 81 },
  { key: "w3", label: "Midterm weight", initial: 0.25, step: 0.01 },
  { key: "g4", label: "Final exam grade", initial: 79 },
  { key: "w4", label: "Final exam weight", initial: 0.35, step: 0.01 },
];

const CATEGORIES = [
  { grade: "g1", weight: "w1", label: "Homework" },
  { grade: "g2", weight: "w2", label: "Quizzes" },
  { grade: "g3", weight: "w3", label: "Midterm" },
  { grade: "g4", weight: "w4", label: "Final exam" },
];

function computeWeightedAverage(values: Record<string, number>): InlineResult[] {
  const all = CATEGORIES.flatMap((c) => [values[c.grade], values[c.weight]]);
  if (!all.every(Number.isFinite)) return [];

  const weightSum = CATEGORIES.reduce((sum, c) => sum + values[c.weight], 0);
  if (Math.abs(weightSum - 1) > 0.01) {
    return [
      {
        label: "Weights don't sum to 1.00",
        value: fmt(weightSum),
        note: "Fix the weights before trusting the final grade below — you're missing a category or there's a syllabus typo.",
      },
    ];
  }

  const final = CATEGORIES.reduce((sum, c) => sum + values[c.grade] * values[c.weight], 0);

  return [
    { label: "Final grade", value: fmt(final), emphasis: true },
    ...CATEGORIES.map((c) => ({
      label: `${c.label} contribution`,
      value: fmt(values[c.grade] * values[c.weight]),
    })),
  ];
}

export function WeightedAverageWidget() {
  return (
    <InlineCalc
      title="Weighted average calculator"
      caption="Defaults to the biology-class worked example above: 20/20/25/35 weights."
      fields={FIELDS}
      compute={computeWeightedAverage}
      footnote="Weights are decimals (0.20, not 20) and must sum to 1.00. Enter your own categories and grades to check your own class."
    />
  );
}
