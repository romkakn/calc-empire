# Spec — crcl-calculator (Creatinine Clearance)

**Brief:** [outperform-brief-crcl-calculator](../recon/outperform-brief-crcl-calculator.md)
**KW / KD / Vol:** creatinine clearance calculator · 9 · 19,000
**Tier:** A
**Category:** health

## Formulas

Cockcroft-Gault (default — drug dosing standard):

    CrCl_mL_min = ((140 − age) × weight_kg) / (72 × serum_creatinine_mg_dL)
    × 0.85 if female

CKD-EPI 2021 (kidney-function staging, no race coefficient):

    See NKF/ASN 2021 reference equation. Implement via reference table.

**Sources:**
- Cockcroft-Gault: Nephron 1976; 16(1):31-41
- CKD-EPI 2021: Inker et al., NEJM 2021 (PMID: 34554658)
- National Kidney Foundation eGFR calculator
- FDA Guidance for Industry: Pharmacokinetics in Patients with Impaired Renal Function (2020)

## Inputs

- Age (years)
- Sex (male / female / unspecified)
- Weight (kg or lb, with toggle)
- Serum creatinine (mg/dL or µmol/L, with toggle)
- Equation toggle: Cockcroft-Gault (default) vs CKD-EPI 2021
- Height (cm or in) — required for BSA-adjusted CKD-EPI
- TODO_VERIFY: include ideal body weight (IBW) adjustment for obese patients?

## Outputs (aria-live)

- CrCl or eGFR in mL/min (or mL/min/1.73m² for CKD-EPI)
- KDIGO stage (G1–G5)
- Drug-dosing band hint (Normal / Mild / Moderate / Severe / Failure)
- Disclaimer that any drug-dose adjustment must be confirmed against the drug label

## Mandatory blocks

- Author + Reviewed by: `TODO_VERIFY: licensed clinical pharmacist or nephrologist`
- Medical disclaimer banner above the calculator
- Cite both Cockcroft-Gault and CKD-EPI 2021 papers in References
- LastReviewed every 90 days; bump if FDA guidance updates

## Verification at build

- Worked example: 65-year-old male, 80 kg, SCr 1.2 → Cockcroft-Gault = ((140-65)×80)/(72×1.2) = 6000/86.4 = 69.4 mL/min
- 65-year-old female, same inputs → 69.4 × 0.85 = 59.0 mL/min
- Hand-verify before publish
