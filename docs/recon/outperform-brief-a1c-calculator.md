# Outperform brief — a1c-calculator

**Primary keyword:** a1c calculator
**KD / Volume / CPC / Intent:** 7 / 22,000 / $1.40 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://professional.diabetes.org/glucose_calc | 89 | 2,150 | 64,397 |
| 2 | (PAA block — no URL) | — | — | — |
| 3 | https://www.accu-chek.com/tools/a1c-calculator | 62 | 134 | 16,009 |
| 4 | https://superpower.com/calculator/glucose-to-a1c | 65 | 3 | 2,166 |

## Table-stakes (what top-3 do well — we must match)
- Bidirectional conversion: eAG (mg/dL or mmol/L) ↔ HbA1c %
- Uses ADAG formula: eAG = 28.7 × A1C - 46.7 (Nathan et al., 2008)
- Unit toggle: mg/dL vs. mmol/L
- A1C reference ranges shown (normal <5.7, prediabetes 5.7-6.4, diabetes ≥6.5)
- Citation to ADA / Nathan 2008 paper

## Gaps (what top-3 miss — our edge)
- ADA page is medically authoritative but UI is bare; we ship modern UI + same authority via reviewer Person schema (MD or CDE)
- No top-3 shows multi-day CGM/glucose-log import to compute estimated A1C from raw data
- Missing risk-categorization explainer: what does an A1C of X mean for retinopathy / nephropathy risk
- No top-3 surfaces the time-in-range (TIR) → A1C correlation (a current 2026 clinical topic)
- Missing target A1C calculator: "how much do I need to lower my mean glucose to hit 6.5?"
- Schemas: top-3 lack MedicalWebPage + Person reviewer

## Numeric targets (binding for the build)
- **Target word count:** 1,800 (top-3 calc-page avg estimated ~1,500)
- **Target FAQ count:** 8
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, MedicalWebPage, SoftwareApplication
- **Recommended internal links:** 8 (BMI calc, BG-to-A1C, CGM time-in-range, insulin sensitivity factor, carb-to-insulin ratio, diabetes risk, HOMA-IR, eGFR)

## LSI terms to weave into copy (top 10)
1. test
2. diabetes
3. glucose
4. blood
5. glucose levels
6. blood sugar levels
7. average
8. a1c chart
9. results
10. HbA1c / hemoglobin A1c (semantic add)

## People-Also-Ask seed questions
1. How do you calculate your A1C?
2. What is my A1C if my blood sugar is 140?
3. Can walking 30 minutes a day lower A1C?
4. What is normal A1C by age?
5. How often should I check my A1C?
6. What is the difference between A1C and fasting glucose?
7. Can A1C be inaccurate?
8. How fast can A1C drop with diet and exercise?

## Notes / TODO_VERIFY
- YMYL category — every claim needs a citation (ADA, NIH, peer-reviewed)
- MedicalWebPage schema + named MD reviewer with NPI is critical for E-E-A-T
- Verify the ADAG formula coefficients haven't been updated since Nathan 2008
