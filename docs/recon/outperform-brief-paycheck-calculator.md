# Outperform brief — paycheck-calculator

**Primary keyword:** paycheck calculator
**KD / Volume / CPC / Intent:** 67 / 378,000 / $3.00 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

> Note: This brief covers the **federal** paycheck calculator only. The 50 state variants (e.g., `paycheck-calculator-california`) reuse the same template, with state-specific tax tables swapped in.

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://www.adp.com/resources/tools/calculators/salary-paycheck-calculator.aspx | 91 | 5,278 | 986,133 |
| 2 | https://smartasset.com/taxes/paycheck-calculator | 84 | 11,413 | 267,777 |
| 3 | https://www.adp.com/resources/tools/calculators/hourly-paycheck-calculator.aspx | 91 | 1,724 | 410,046 |

## Table-stakes (what top-3 do well — we must match)
- Salary vs. hourly toggle (ADP splits these into two pages — we ship one unified form)
- Federal withholding by filing status (single / MFJ / HoH / MFS)
- W-4 v2020+ form fields (Step 2 multi-job, Step 3 dependents, Step 4a/4b/4c)
- State tax dropdown — all 50 states + DC
- FICA breakdown: Social Security 6.2% (up to wage base), Medicare 1.45%, additional Medicare 0.9% over $200k
- Pre-tax deductions: 401(k), HSA, FSA, medical, dental, vision
- Post-tax deductions: Roth 401(k), garnishments, custom
- Pay frequency: weekly, bi-weekly, semi-monthly, monthly, annual
- Output: gross, all taxes itemized, net per paycheck, annualized net

## Gaps (what top-3 miss — our edge)
- ADP and SmartAsset both hide the actual formula — we expose the math in a collapsible "show calculation" panel
- No top-3 lets you load a previous calculation via URL params — we ship deep-linkable URLs (high share/save value)
- Top-3 don't surface 2026 contribution limits (401k $23,500 base + $7,500 catch-up; HSA $4,300 single / $8,550 family) inline
- No top-3 calculates supplemental wage withholding (bonuses, RSUs) at the flat 22%/37% rates
- ADP's UX requires multiple page loads for state — we ship reactive single-page
- Schemas: SmartAsset has Calculator; ADP has none — we ship Calculator + HowTo + FAQPage + GovernmentService (links to IRS Pub 15-T)
- No top-3 has a printable pay-stub mock-up output

## Numeric targets (binding for the build)
- **Target word count:** 2,000 (top-3 here are denser; +33% on the standard 1,500 base)
- **Target FAQ count:** 10 (federal + state-overlap questions)
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, SoftwareApplication, GovernmentService
- **Recommended internal links:** 12 (each state variant + bonus calc + W-4 calc + take-home pay + tax bracket + FICA + SE-tax)

## LSI terms to weave into copy (top 10)
1. social security
2. paylocity (low-signal brand, skip)
3. health insurance
4. tax calculator
5. pay
6. salary calculator
7. taxes
8. gross income
9. federal withholding (semantic add)
10. take-home pay (semantic add)

## People-Also-Ask seed questions
1. How is my paycheck calculated?
2. How much federal tax is withheld from a $X paycheck?
3. What is FICA on my paycheck?
4. How do I fill out a W-4 in 2026?
5. What is the 2026 Social Security wage base?
6. How are bonuses taxed differently?
7. How does pre-tax 401(k) reduce my paycheck?
8. What is the difference between gross and net pay?
9. Why is my bonus taxed at 22%?
10. How do I calculate take-home pay for a new job?

## Notes / TODO_VERIFY
- KD=67 — this is the only high-difficulty term in the batch; ADP & SmartAsset are top-3 walls
- Strategy: rank for federal page, then capture 50 long-tail state variants where KD is 10-30
- 2026 numbers (SS wage base, 401k limits, brackets) MUST be verified against IRS before publish
- Supplemental withholding rates: 22% under $1M / 37% above $1M (verify for 2026)
