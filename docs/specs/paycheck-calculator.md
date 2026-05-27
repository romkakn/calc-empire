# Spec — paycheck-calculator (federal + 50 state variants)

**Brief:** [outperform-brief-paycheck-calculator](../recon/outperform-brief-paycheck-calculator.md)
**KW / KD / Vol:** paycheck calculator · 67 · 378,000
**Tier:** S (programmatic)
**Category:** payroll

## Strategy

Federal page (`/paycheck-calculator`) is the canonical hub. 50 state pages
(`/paycheck-calculator-<state>`) reuse the same React component with state-
specific tax data, schemas, and FAQ. The state pages are how we win on KD 67
— targeting `[state] paycheck calculator` long-tails (KD 5–20 range each).

## Inputs (shared component)

- Gross pay (per period)
- Pay frequency: weekly, bi-weekly, semi-monthly, monthly, annual
- Filing status: single, married filing jointly, MFS, head of household
- Federal withholding allowances / W-4 step-2 toggle (post-2020 W-4)
- 401(k) contribution (% or $)
- HSA contribution
- Other pre-tax deductions
- Post-tax deductions
- State (defaults to page slug; switchable)
- Additional federal withholding (W-4 line 4c)
- Year-to-date toggle (optional)

## Calculations

**Federal income tax** — apply the 2026 IRS Publication 15-T withholding tables
(Percentage Method, Standard Tables) to taxable wages.

**FICA**
- Social Security: 6.2% on wages up to the 2026 wage base
- Medicare: 1.45% (+0.9% Additional Medicare Tax above $200k single / $250k MFJ)

**State income tax** — per-state rules (flat vs. brackets, deductions, credits).
Source data: each state's department of revenue + IRS state-tax tables.

**Local taxes** — surface if material (NYC, Philadelphia, OH municipalities).

**TODO_VERIFY at build:**
- 2026 IRS Publication 15-T tables (re-pull at publish; flag for re-pull each January)
- 2026 SS wage base
- 2026 state brackets per state
- Local tax inclusions per state slug

## Outputs

- Gross pay per period and annualised
- Federal income tax withheld
- Social Security
- Medicare
- State income tax (per state)
- Local tax (if applicable)
- 401(k) / HSA pre-tax deductions
- Net (take-home) pay per period and annualised
- Effective tax rate (federal, total)
- Pie chart or stacked-bar visual: where each dollar goes

## Programmatic template

`app/paycheck-calculator/[state]/page.tsx` with `generateStaticParams` returning
the 50 state slugs. Shared component imported by both the federal page and each
state page. State-specific FAQ + Reference block injected from a state data file
(`data/payroll-<state>.ts`).

## Schema notes

Each state page is its own URL with own canonical, own metadata (state-local KW
in title + description), and a `BreadcrumbList` rooted at `/paycheck-calculator`.
