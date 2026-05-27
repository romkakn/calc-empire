# Outperform brief — dividend-calculator

**Primary keyword:** dividend calculator
**KD / Volume / CPC / Intent:** 5 / 37,000 / $0.90 / Informational
**Generated:** 2026-05-27
**Source:** Ahrefs API v3, 2026-05-27

## Top 3 competitors (from SERP)
| Rank | URL | DR | Backlinks | Est. traffic |
|---|---|---|---|---|
| 1 | https://www.marketbeat.com/dividends/calculator/ | 75 | 12,080 | 33,053 |
| 2 | https://www.dripcalc.com/ | 11 | 25 | 24,125 |
| 3 | https://www.empowerfcu.com/.../dividend-calculator | 45 | 17 | 9,304 |

## Table-stakes (what top-3 do well — we must match)
- DRIP (Dividend Reinvestment) toggle — compound vs. cash-out comparison
- Input set: initial investment, share price, dividend per share, dividend frequency, annual contribution, years, dividend growth rate, expected price appreciation
- Output: year-by-year table with shares owned, dividend income, portfolio value, total return
- Visual: line chart for portfolio growth, bar chart for annual dividends
- Tax bucket toggle (taxable vs. Roth / 401k)

## Gaps (what top-3 miss — our edge)
- No top-3 lets the user paste a ticker and auto-fetch current yield + 5y dividend CAGR — we can do this via free API
- Missing qualified vs. ordinary dividend tax treatment with current 2026 brackets
- No "dividend safety score" hint or payout-ratio warning
- Top-3 lack downloadable CSV/PDF projection — we ship it
- No mobile-first chart (top-3 use Highcharts/Chart.js with poor touch UX)
- Accessibility: no top-3 page passes full WCAG 2.2 AA for chart alt-text
- Missing schema: SoftwareApplication, Person (author with CFP/CFA credential)

## Numeric targets (binding for the build)
- **Target word count:** 1,800 (top-3 calc-page avg estimated ~1,500)
- **Target FAQ count:** 8
- **Required schemas:** Calculator, HowTo, FAQPage, BreadcrumbList, Person, SoftwareApplication, Dataset (if ticker-fetch enabled)
- **Recommended internal links:** 8 (compound interest calculator, dividend yield, DRIP, dividend tax, ETF calc, retirement calc, FIRE calc, capital gains)

## LSI terms to weave into copy (top 10)
1. compound interest calculator
2. stock
3. credit union
4. dividend
5. compound interest
6. annual
7. yield
8. investment
9. dividend stocks
10. DRIP / reinvestment (semantic add)

## People-Also-Ask seed questions
1. How is a dividend calculated?
2. What is a good dividend yield?
3. How often are dividends paid?
4. Are dividends taxed as ordinary income?
5. What is the dividend payout ratio?
6. Should I reinvest my dividends?
7. What is a qualified dividend?
8. How do I project dividend growth?

## Notes / TODO_VERIFY
- MarketBeat owns 12k backlinks — direct DR competition is out of reach; we win on UX + ticker-fetch
- DripCalc (DR 11) sits at #2 with 24k traffic — proves UX > authority for this term
- $0.90 CPC, KD 5, 37k vol = best traffic-per-effort target in the whole batch
