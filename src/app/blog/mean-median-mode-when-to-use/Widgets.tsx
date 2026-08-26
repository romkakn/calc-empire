"use client";

import { InlineCalc, fmt, type InlineResult } from "@/components/blog/InlineCalc";

const FIELDS = [
  { key: "x1", label: "Value 1", initial: 2 },
  { key: "x2", label: "Value 2", initial: 4 },
  { key: "x3", label: "Value 3", initial: 4 },
  { key: "x4", label: "Value 4", initial: 4 },
  { key: "x5", label: "Value 5", initial: 5 },
  { key: "x6", label: "Value 6", initial: 6 },
  { key: "x7", label: "Value 7", initial: 100 },
];

const KEYS = FIELDS.map((f) => f.key);

function computeSummary(values: Record<string, number>): InlineResult[] {
  const nums = KEYS.map((k) => values[k]);
  if (!nums.every(Number.isFinite)) return [];

  const n = nums.length;
  const mean = nums.reduce((sum, v) => sum + v, 0) / n;

  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];

  const counts = new Map<number, number>();
  for (const v of nums) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxFreq = Math.max(...counts.values());
  const modes = [...counts.entries()].filter(([, c]) => c === maxFreq).map(([v]) => v);
  const modeValue =
    maxFreq <= 1
      ? "No mode (every value unique)"
      : modes.sort((a, b) => a - b).map(fmt).join(", ");

  const gap = mean - median;
  const skewNote =
    Math.abs(gap) < 1e-9
      ? "Mean and median match — the set is symmetric around its center."
      : gap > 0
        ? "Mean sits above median — a right-skewed set, usually a high outlier."
        : "Mean sits below median — a left-skewed set, usually a low outlier.";

  return [
    { label: "Mean", value: fmt(mean) },
    { label: "Median", value: fmt(median), emphasis: true },
    { label: "Mode", value: modeValue },
    { label: "Mean − median gap", value: fmt(gap), note: skewNote },
  ];
}

export function SummaryStatsWidget() {
  return (
    <InlineCalc
      title="Mean, median, and mode for a set of numbers"
      caption="Defaults to {2, 4, 4, 4, 5, 6, 100} — the set discussed above."
      fields={FIELDS}
      compute={computeSummary}
      footnote="Median is the sorted middle value (or the average of the two middle values for an even count). Mode is whichever value repeats most; ties list every tied value."
    />
  );
}
