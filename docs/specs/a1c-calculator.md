# Spec — a1c-calculator

**Brief:** [outperform-brief-a1c-calculator](../recon/outperform-brief-a1c-calculator.md)
**KW / KD / Vol:** a1c calculator · 7 · 22,000
**Tier:** A
**Category:** health

## Formulas

eAG (estimated Average Glucose) from A1C:

    eAG_mg_dL = 28.7 × A1C − 46.7
    eAG_mmol_L = 1.59 × A1C − 2.59

Source: ADA-endorsed Nathan et al., 2008 (PMID: 18540046).

Reverse (eAG → A1C):

    A1C ≈ (eAG_mg_dL + 46.7) / 28.7

## Inputs

- Mode toggle: A1C → eAG (default) or eAG → A1C
- A1C percentage (e.g. 5.7) OR eAG in mg/dL or mmol/L
- Unit toggle: mg/dL (US default) vs mmol/L (most of world)

## Outputs (aria-live)

- Converted value (with unit)
- Categorical band: Normal (<5.7%), Prediabetes (5.7–6.4%), Diabetes (≥6.5%) — ADA criteria
- Plain-English interpretation in 1 sentence
- "Talk to your doctor" disclaimer prominently

## Mandatory blocks (health vertical)

- Author: byline + Reviewed by `TODO_VERIFY: licensed medical reviewer (MD or RD)`
- Medical disclaimer banner above the calculator (not after) — "Educational only, not medical advice"
- LastReviewed: every 90 days

## TODO_VERIFY at build

- ADA 2026 criteria (no change expected, but verify)
- Convert button accessible from keyboard (Enter on input triggers it)
- Reviewer credential — block publish until set
