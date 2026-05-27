# Spec — asphalt-calculator

**Brief:** [outperform-brief-asphalt-calculator](../recon/outperform-brief-asphalt-calculator.md)
**KW / KD / Vol:** asphalt calculator · 4 · 9,700
**Tier:** S
**Category:** construction

## Formula

Tonnage of asphalt for a rectangular paving project:

    tons = (length_ft × width_ft × thickness_in / 12) × density_lb_per_ft3 × 0.0005

- Default density: HMA (hot-mix asphalt) ≈ 145 lb/ft³ (range 140–150)
- 0.0005 converts pounds → US short tons (1 ton = 2,000 lb)

**Sources:**
- Asphalt Institute, "Asphalt Paving Materials" (textbook; cite without linking — print only)
- National Asphalt Pavement Association (NAPA) density guidance
- TODO_VERIFY at build: cite a specific NAPA PDF URL

## Inputs

- Length (ft)
- Width (ft)
- Thickness (inches; common 1.5, 2, 3, 4)
- Density override (lb/ft³, default 145)
- Waste factor toggle (default +5%)
- Cost per ton (USD, optional — drives a price output)

## Outputs

- Volume (cubic yards)
- Weight (tons, short)
- Estimated cost (if price entered)
- Coverage check: area covered at given thickness, in sq ft

## Edge cases

- Thickness < 1 inch → show inline warning ("most overlays are ≥ 1.5 in")
- Negative or zero dims → suppress output, show inline error per field

## 13 E-E-A-T blocks — special notes

- WhenToUse: driveway resurfacing, parking-lot overlay, walking-path patch, road-shoulder, garage floor
- CommonMistakes: confusing volume with weight, ignoring waste, using cold-mix density for hot-mix
- LSI: hot mix, cold mix, density, compaction, base course, binder course
- FAQ from PAA: "how much asphalt do I need for a driveway?", "how thick should driveway asphalt be?", "asphalt vs concrete cost?"

## TODO_VERIFY at build

- Current 2026 $/ton avg (NAPA + state DOT bid tabs) — flag once a year via scheduled refresh
- Density default per region — confirm 145 lb/ft³ holds for the median project (yes for HMA dense-graded)
