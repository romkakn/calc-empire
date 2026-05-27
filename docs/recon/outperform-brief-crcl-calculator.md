# Outperform brief — crcl-calculator

**Primary keyword:** creatinine clearance calculator
**KD / Volume / CPC / Intent:** 9 / 19,000 / $0.04 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://www.mdcalc.com/calc/43/creatinine-clearance-cockcroft-gault-equation | 77 | 1,387 | 50,501 |
| 2 | https://www.hiv.uw.edu/page/clinical-calculators/crcl | 88 | 5 | 10,041 |
| 3 | https://www.mcw.edu/calculators/creatinine-clearance | 77 | 1,392 | 5,726 |

## Table-stakes (what top-3 do well — we must match)
- Cockcroft-Gault formula: CrCl = [(140-age) × weight] / (72 × SCr), × 0.85 if female
- Inputs: age (years), weight (kg or lb), sex, serum creatinine (mg/dL or µmol/L)
- Unit toggles for weight and creatinine
- IBW vs. ABW vs. AdjBW toggle (critical for obese patients) — MDCalc handles this well
- Citations: Cockcroft & Gault 1976, Nephron 16:31-41
- Reference ranges for renal function staging

## Gaps (what top-3 miss — our edge)
- MDCalc is the gold standard for clinicians but requires login for some features — we stay fully free + no login
- No top-3 offers a multi-equation comparison view (Cockcroft-Gault vs. MDRD vs. CKD-EPI 2021 race-free) side-by-side
- Missing drug-dosing helper: paste a drug (vancomycin, enoxaparin) → CrCl-adjusted dose suggestion with citations
- No top-3 has a CGM-style "trend" mode for serial creatinines
- Schemas: MedicalWebPage + Person (MD/PharmD with NPI) absent on most; we ship full E-E-A-T
- Mobile UX: MDCalc requires login modal interruption on mobile — we are friction-free

## Numeric targets (binding for the build)
- **Target word count:** 1,800 (top-3 calc-page avg estimated ~1,500)
- **Target FAQ count:** 8
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, MedicalWebPage, SoftwareApplication
- **Recommended internal links:** 8 (eGFR CKD-EPI, MDRD, BSA, BMI, IBW, vancomycin dose, enoxaparin dose, A1C)

## LSI terms to weave into copy (top 10)
1. creatinine
2. et al (skip — citation artifact)
3. kidney disease
4. weight
5. body
6. crcl
7. equation
8. ckd
9. patients
10. renal
11. Cockcroft-Gault (semantic add)

## People-Also-Ask seed questions
1. How is creatinine clearance calculated?
2. What is a normal creatinine clearance for a 70-year-old?
3. Cockcroft-Gault vs. CKD-EPI: which is better?
4. Should I use ideal body weight or actual body weight in CrCl?
5. How does CrCl change with age?
6. What CrCl means stage 3 CKD?
7. When do I need to dose-adjust a drug for CrCl?
8. Why was the race coefficient removed in 2021?

## Notes / TODO_VERIFY
- YMYL clinical — every formula needs PubMed citation and a MedicalWebPage schema
- Race-free CKD-EPI 2021 is the post-2021 standard — must be the default equation in any comparison view
- Audience is split: clinicians (need precision) vs. patients (need plain-English) — toggle helps both
- CPC = $0.04 (effectively zero ads) — this is a pure E-E-A-T / authority play, not a revenue play
