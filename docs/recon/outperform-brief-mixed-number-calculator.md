# Outperform brief — mixed-number-calculator

**Primary keyword:** mixed number calculator
**KD / Volume / CPC / Intent:** 1 / 14,000 / $1.00 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://www.calculatorsoup.com/calculators/math/mixednumbers.php | 78 | 1,477 | 117,799 |
| 2 | https://www.calculator.net/fraction-calculator.html | 84 | 3 | 3,913 |
| 3 | (PAA block — no URL) | — | — | — |
| 4 | https://www.youtube.com/watch?v=r7kI_NBlB9A | 99 | 2 | 124 |

## Table-stakes (what top-3 do well — we must match)
- Two-mixed-number input with operation selector (+, -, ×, ÷)
- Auto-conversion: improper-to-mixed and mixed-to-improper, both directions
- Output: result in mixed-number form, improper-fraction form, and decimal form
- Step-by-step worked solution with LCM/GCF shown
- Simplification to lowest terms with the GCF surfaced

## Gaps (what top-3 miss — our edge)
- Calculatorsoup ranks #1 with 117k traffic but UX is dated; we ship a keyboard-friendly fraction input (slash key, up/down for whole, num, denom)
- No top-3 has a "show me how to do this on paper" toggle that animates the steps
- Missing OCR / image-upload path ("snap your homework, get the answer with steps") — that's a unique wedge
- No top-3 page exposes the LCM/GCF calculators inline as a tooltip
- Accessibility: top-3 fail keyboard-only entry for fractions
- Missing PAA "Which one is bigger, 3/4 or 1/2?" — we add a built-in comparison mode

## Numeric targets (binding for the build)
- **Target word count:** 1,800 (top-3 calc-page avg estimated ~1,500)
- **Target FAQ count:** 8
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, SoftwareApplication, MathSolver
- **Recommended internal links:** 8 (fraction calc, improper-to-mixed converter, GCF, LCM, decimal-to-fraction, simplify fractions, fraction comparison, percentage)

## LSI terms to weave into copy (top 10)
1. fraction calculator
2. math
3. numbers
4. fraction
5. mr (likely "Mr. organic chemistry tutor" — low signal, skip)
6. organic chemistry (low signal, skip)
7. greatest common factor
8. fractions
9. improper fraction
10. lowest common denominator (semantic add)

## People-Also-Ask seed questions
1. How do you calculate a mixed number?
2. Which one is bigger, 3/4 or 1/2?
3. How to solve mixed numbers calculator?
4. How do you convert a mixed number to an improper fraction?
5. How do you add mixed numbers with unlike denominators?
6. How do you multiply mixed numbers?
7. How do you divide mixed numbers?
8. What is the GCF and why do we use it to simplify?

## Notes / TODO_VERIFY
- "Mr" and "organic chemistry" LSI noise — exclude
- This is a homework-heavy query — content should be school-appropriate, citations to NCTM standards help E-E-A-T
