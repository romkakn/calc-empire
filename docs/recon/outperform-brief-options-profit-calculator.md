# Outperform brief — options-profit-calculator

**Primary keyword:** options profit calculator
**KD / Volume / CPC / Intent:** 11 / 26,000 / $1.30 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://www.optionsprofitcalculator.com/ | 36 | 1,742 | 68,200 |
| 2 | https://www.barchart.com/options/options-calculator | 80 | 285 | 16,661 |
| 3 | https://researchtools.fidelity.com/ftgw/mloptions/goto/plCalculator | 88 | 3 | 3,797 |

## Table-stakes (what top-3 do well — we must match)
- Strategy selector: long call, long put, covered call, cash-secured put, vertical spreads, iron condor, butterfly, straddle, strangle (12+ strategies)
- Inputs per leg: strike, expiration, premium (entered or auto-fetched), quantity, action (buy/sell)
- Output: payoff diagram at expiration, max profit, max loss, break-even(s), P/L at any underlying price
- Black-Scholes valuation for any date before expiration (with IV and risk-free rate)
- "What-if" sliders: time, IV, underlying price

## Gaps (what top-3 miss — our edge)
- optionsprofitcalculator.com #1 has 1742 backlinks and 68k traffic on DR 36 — the URL itself is exact-match; we beat with UX, mobile, schema
- No top-3 has free auto-fetch of live chain (ticker → strikes → premiums) — we ship via free data API or community-supported
- Missing greeks display: delta, gamma, theta, vega, rho at any what-if state
- No top-3 has a "save strategy and reload via URL" deep-link
- Top-3 payoff charts are non-accessible (no ARIA, no keyboard zoom); we ship WCAG 2.2 AA
- Missing earnings IV-crush mode: "if IV drops from 80 to 30 after earnings, what's my P/L?"
- Schemas: Calculator + HowTo + SoftwareApplication missing across top-3

## Numeric targets (binding for the build)
- **Target word count:** 2,000 (denser content needed for 12+ strategies; +33%)
- **Target FAQ count:** 10
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, SoftwareApplication, FinancialProduct
- **Recommended internal links:** 12 (Black-Scholes, IV calc, greeks calc, covered call, iron condor, theta decay, intrinsic vs. extrinsic, Kelly, position-size, max-loss, margin, expiration)

## LSI terms to weave into copy (top 10)
1. stock
2. call
3. price
4. interest rate
5. contract
6. options
7. strike
8. options trading
9. profit
10. break-even (semantic add)
11. greeks (semantic add)

## People-Also-Ask seed questions
1. How do I calculate options profit?
2. How do you find the break-even on a long call?
3. What is delta and how does it affect my P/L?
4. How does theta decay affect options profit?
5. What is max loss on a cash-secured put?
6. How is an iron condor P/L calculated?
7. What is intrinsic vs. extrinsic value?
8. How does IV crush affect earnings trades?
9. What is the difference between debit and credit spreads?
10. How do I size an options position by risk?

## Notes / TODO_VERIFY
- Domain optionsprofitcalculator.com is exact-match; we cannot beat the URL signal, only the UX
- Live-chain auto-fetch is the wedge — but adds infra cost; consider tier-gated (free w/o chain, premium with)
- Position #5 is MarketBeat with 11,335 backlinks but only 1,065 traffic — proves backlinks alone don't win this SERP
