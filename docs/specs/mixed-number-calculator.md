# Spec — mixed-number-calculator

**Brief:** [outperform-brief-mixed-number-calculator](../recon/outperform-brief-mixed-number-calculator.md)
**KW / KD / Vol:** mixed number calculator · 1 · 14,000
**Tier:** S
**Category:** math

## Behavior

Accept two mixed numbers + an operator (+ − × ÷), output the simplified mixed-number result with a worked step-by-step trace.

## Inputs

- Operand A: whole + numerator/denominator (three numeric fields, denominator > 0)
- Operator: select from + − × ÷
- Operand B: whole + numerator/denominator
- Toggle: show steps (default on)

## Algorithm

1. Convert each mixed number to an improper fraction:
       improper = (whole × den) + num   (sign carried by whole)
2. Apply operator on improper fractions (common-denominator add/sub, cross-multiply div).
3. Reduce result via Euclidean GCD.
4. Convert improper back to mixed (whole + remainder/divisor).

**Sources:**
- Khan Academy — Mixed numbers (https://www.khanacademy.org)
- Math is Fun — Mixed Fractions (https://www.mathsisfun.com/mixed-fractions.html)

## Outputs (real-time, aria-live)

- Result as mixed number
- Result as improper fraction
- Result as decimal (rounded to 6 places)
- Step-by-step explanation in a numbered list

## Edge cases

- Division by zero (operand B = 0 or whole+num both 0) → error, no result
- Negative mixed numbers: input field for sign; convert via "whole part carries sign" rule
- Already-improper input (num ≥ den) → accepted, normalised

## 13 E-E-A-T blocks — special notes

- Audience: students 4th–8th grade and adult learners; reading level 6th grade
- CommonMistakes: forgetting to convert, lossy reduction, sign on subtraction
- RelatedTerms: improper fraction, GCD, LCM, reciprocal
- FAQ: PAA dominated by "how do you add mixed numbers", "subtract with regrouping", "multiply mixed numbers"

## TODO_VERIFY

- None — pure math, no external data needed
