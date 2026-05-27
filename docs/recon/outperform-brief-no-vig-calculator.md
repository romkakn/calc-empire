# Outperform brief — no-vig-calculator

**Primary keyword:** no vig calculator
**KD / Volume / CPC / Intent:** 2 / 7,000 / $3.00 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://oddsjam.com/betting-calculators/no-vig-fair-odds | 59 | 1,738 | 15,974 |
| 2 | https://unabated.com/betting-calculators/no-vig-fair-odds-calculator | 41 | 229 | 2,012 |
| 3 | https://oddsorca.com/betting-calculators/no-vig-odds-calculator | 15 | 29 | 312 |

## Table-stakes (what top-3 do well — we must match)
- Two-input devig form (price A, price B) with auto-detect for American/Decimal/Fractional odds
- Output: fair price for each side, implied probability, bookmaker margin (vig %)
- Multi-way market support (3-way moneyline, props) — oddsjam handles up to 4+ legs
- Devig method toggle (Multiplicative, Additive, Shin, Power) with brief explanations
- Glossary: vig, juice, fair odds, EV, hold percentage

## Gaps (what top-3 miss — our edge)
- Top-3 do not surface a worked EV example tied to the devigged price (e.g., "if a sportsbook offers +110 and fair is +95, your EV per $100 = $X")
- No live "copy URL with prefilled inputs" share button — high-friction for Twitter/Reddit users
- Schemas: SoftwareApplication missing across top-3; we ship full Calculator + HowTo
- No accessibility pass (keyboard nav for odds inputs, ARIA on output)
- Missing "which devig method should I use?" decision tree with rule-of-thumb
- No batch/CSV upload for paper trading multiple lines

## Numeric targets (binding for the build)
- **Target word count:** 1,800 (top-3 calc-page avg estimated ~1,500)
- **Target FAQ count:** 8
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, SoftwareApplication
- **Recommended internal links:** 8 (EV calculator, Kelly criterion, arbitrage calc, parlay calc, hedge calc, odds converter, hold calc, bankroll)

## LSI terms to weave into copy (top 10)
1. fair odds
2. sports betting
3. margin calculator
4. probability
5. odds calculator
6. vig
7. betting odds
8. juice (semantic add)
9. implied probability (semantic add)
10. expected value / EV (semantic add)

## People-Also-Ask seed questions
1. What is the vig in sports betting?
2. How do you calculate no-vig odds?
3. What is a fair price in betting?
4. Multiplicative vs. additive devig — which is better?
5. How do sportsbooks set the vig?
6. Can you bet profitably with no-vig odds?
7. What is a Shin devig method?
8. How do I calculate the hold percentage?

## Notes / TODO_VERIFY
- Oddsjam dominates with 1,738 backlinks — link-earning play is data-driven content (e.g., "average vig across 12 US sportsbooks, weekly update")
- $3.00 CPC = strong affiliate angle (Pikkit, Outlier, etc.); leave room for an "Affiliate disclosure" Person block
