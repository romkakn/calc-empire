// Federal withholding — IRS Publication 15-T Percentage Method, 2025 Annual Tables.
// TODO_VERIFY: replace with 2026 tables once IRS publishes (typically mid-November).
//   Source (2025): https://www.irs.gov/pub/irs-pdf/p15t.pdf
// FICA (Social Security + Medicare) per Social Security Administration 2025 update.
//   TODO_VERIFY: re-pull 2026 SS wage base each January.

export type FilingStatus = "single" | "mfj" | "hoh";

type Bracket = { from: number; base: number; rate: number };

// 2025 Standard withholding (W-4 step 2 NOT checked) — annual payroll period.
const BRACKETS: Record<FilingStatus, Bracket[]> = {
  single: [
    { from: 0, base: 0, rate: 0 },
    { from: 6_400, base: 0, rate: 0.1 },
    { from: 18_325, base: 1_192.5, rate: 0.12 },
    { from: 54_875, base: 5_578.5, rate: 0.22 },
    { from: 109_750, base: 17_651, rate: 0.24 },
    { from: 203_700, base: 40_199, rate: 0.32 },
    { from: 256_925, base: 57_231, rate: 0.35 },
    { from: 632_750, base: 188_769.75, rate: 0.37 },
  ],
  mfj: [
    { from: 0, base: 0, rate: 0 },
    { from: 17_100, base: 0, rate: 0.1 },
    { from: 40_950, base: 2_385, rate: 0.12 },
    { from: 114_050, base: 11_157, rate: 0.22 },
    { from: 223_800, base: 35_302, rate: 0.24 },
    { from: 411_700, base: 80_398, rate: 0.32 },
    { from: 518_150, base: 114_462, rate: 0.35 },
    { from: 768_700, base: 202_154.5, rate: 0.37 },
  ],
  hoh: [
    { from: 0, base: 0, rate: 0 },
    { from: 13_900, base: 0, rate: 0.1 },
    { from: 30_900, base: 1_700, rate: 0.12 },
    { from: 78_750, base: 7_442, rate: 0.22 },
    { from: 122_200, base: 16_001, rate: 0.24 },
    { from: 216_150, base: 38_549, rate: 0.32 },
    { from: 269_400, base: 55_589, rate: 0.35 },
    { from: 645_250, base: 187_136.5, rate: 0.37 },
  ],
};

export function federalAnnualWithholding(taxable: number, status: FilingStatus): number {
  if (taxable <= 0) return 0;
  const table = BRACKETS[status];
  let owe = 0;
  for (let i = table.length - 1; i >= 0; i--) {
    const b = table[i];
    if (taxable > b.from) {
      owe = b.base + (taxable - b.from) * b.rate;
      break;
    }
  }
  return Math.max(0, owe);
}

// 2025 limits.
export const SS_WAGE_BASE_2025 = 176_100;
export const SS_RATE = 0.062;
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009;
export const ADDITIONAL_MEDICARE_THRESHOLD: Record<FilingStatus, number> = {
  single: 200_000,
  mfj: 250_000,
  hoh: 200_000,
};

export function ficaAnnual(grossAnnual: number, status: FilingStatus) {
  const ss = Math.min(grossAnnual, SS_WAGE_BASE_2025) * SS_RATE;
  const medicareBase = grossAnnual * MEDICARE_RATE;
  const addl = Math.max(0, grossAnnual - ADDITIONAL_MEDICARE_THRESHOLD[status]) * ADDITIONAL_MEDICARE_RATE;
  return {
    socialSecurity: ss,
    medicare: medicareBase + addl,
    total: ss + medicareBase + addl,
  };
}
