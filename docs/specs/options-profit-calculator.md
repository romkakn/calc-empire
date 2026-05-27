# Spec — options-profit-calculator

**Brief:** [outperform-brief-options-profit-calculator](../recon/outperform-brief-options-profit-calculator.md)
**KW / KD / Vol:** options profit calculator · 11 · 26,000
**Tier:** A
**Category:** finance

## Scope (v1)

Single-leg P&L at expiration for long/short calls and puts. Multi-leg
(spreads, straddles, iron condors) deferred to v2.

## Formulas

Long Call P&L at price S:

    P&L = max(0, S − K) − premium_paid

Long Put P&L at price S:

    P&L = max(0, K − S) − premium_paid

Short legs: flip sign and adjust for assignment risk.

**Sources:**
- CBOE Options Toolbox
- Hull, "Options, Futures, and Other Derivatives" (9th ed.)
- IRS Pub 550 for tax treatment notes

## Inputs

- Position: select (long call / long put / short call / short put)
- Strike price (K)
- Premium per share (paid for long, received for short)
- Contracts (1 = 100 shares)
- Current spot price (optional, for unrealized P&L)
- Spot-price grid: visualise P&L from 50% below to 50% above strike (linear, 20 steps)
- Expiration date (date input) — for time decay messaging only in v1, no Greeks math

## Outputs

- Max profit, max loss, breakeven price(s)
- P&L at current spot (if entered)
- P&L table (spot, $/contract, total $)
- ASCII or SVG line chart (mobile-first; use native `<svg>`, no chart lib)

## Mandatory disclaimers

- "Educational, not investment advice"
- "Options carry risk of total loss"
- Per FINRA guidance — visible above the calculator

## TODO_VERIFY at build

- Confirm 100-shares-per-contract assumption (standard US equity option, not mini)
- Confirm FINRA/SEC compliance copy with a current source
- v2: add Black-Scholes Greeks (delta, gamma, theta, vega) — out of v1 scope
