# Spec — variance-calculator

**Brief:** [outperform-brief-variance-calculator](../recon/outperform-brief-variance-calculator.md)
**KW / KD / Vol:** variance calculator · 5 · 15,000
**Tier:** S
**Category:** stats

## Formulas

Sample variance (Bessel-corrected, default):

    s² = Σ(xᵢ − x̄)² / (n − 1)

Population variance:

    σ² = Σ(xᵢ − μ)² / N

Standard deviation: square root of the variance.

**Sources to cite:**
- NIST/SEMATECH e-Handbook of Statistical Methods (https://www.itl.nist.gov/div898/handbook/)
- Khan Academy — Sample vs. population variance

## Inputs

- Data input: textarea (comma- or whitespace-separated numbers); also paste support
- Toggle: sample (n−1, default) vs. population (N)
- Optional: round-to N decimals (default 4)

## Outputs (real-time, aria-live)

- Count (n)
- Mean (x̄)
- Sum of squared deviations Σ(xᵢ − x̄)²
- Variance
- Standard deviation
- Min / max / range (cheap bonus signal)

## Edge cases

- n < 2 for sample → show inline warning, don't compute
- non-numeric tokens → skipped + listed under "ignored values"
- empty input → output dashes, no error

## 13 E-E-A-T blocks — special notes

- WorkedExample: dataset 4, 8, 6, 5, 3 → s² = 3.7 (sample), σ² = 2.96 (pop)
- CommonMistakes: sample vs. population confusion is the #1 issue — lead with it
- RelatedTerms: variance, std dev, MAD, IQR, z-score
- FAQ targets ≥ 8, lifted from People-Also-Ask (re-pull at build time)

## TODO_VERIFY at build

- Confirm Bessel correction is the right default for the audience (lean toward "yes" — most users are computing a sample)
- Confirm no education-policy issue with the worked example for K-12 readers (use neutral data)
