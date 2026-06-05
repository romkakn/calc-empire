# Calc Empire

> Free online calculators that show the math.

**Live:** https://calc-empire-roma-s-projects3.vercel.app

A growing library of plain-English calculators — finance, statistics, math,
health, construction, payroll, education, and pets. Every page shows the
formula, walks through a worked example, and cites the authoritative source
behind the math.

---

## What's inside

- **42 calculators** across 9 categories, including a 50-state programmatic
  paycheck calculator.
- **103 indexable URLs** in the sitemap (home, category pages, per-calculator
  pages, state variants).
- **Static export by default** — every calculator page is prerendered as HTML
  at build time. Fast loads, no cold starts.
- **Material Design 3** design system with light/dark/system theme, full
  WCAG 2.2 AA contrast, focus outlines, and 48dp touch targets.
- **E-E-A-T blocks on every calculator page** — Hero, WorkedExample,
  FormulaExplained, WhenToUse, CommonMistakes, RelatedTerms, FAQ, References,
  Author, LastReviewed, RelatedCalculators.
- **JSON-LD on every page** — `SoftwareApplication`, `HowTo`, `FAQPage`,
  `BreadcrumbList`, `Person`, plus `Organization` + `WebSite` at the site
  level.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 19](https://react.dev/)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Hosted on [Vercel](https://vercel.com/)

## Project structure

```
src/
  app/                          Next.js App Router pages
    <slug>/page.tsx             Server component — metadata, JSON-LD, E-E-A-T blocks
    <slug>/Calculator.tsx       Client component — form + math (useState/useMemo)
    [category]/page.tsx         Dynamic category landing pages
    sitemap.ts, robots.ts       SEO file conventions
    layout.tsx                  Root layout, theme bootstrap, analytics slots
  components/
    eeat/                       Reusable E-E-A-T content blocks
    md3/                        Material Design 3 primitives (Card, TextField, …)
    theme/                      Theme toggle + cookie-based bootstrap
  lib/
    site.ts, schema.ts          Site metadata + JSON-LD generators
data/
  calculators.json              Single source of truth for the catalog
  payroll-states.ts             Per-state payroll-tax data for the programmatic route
public/
  static assets (icons, IndexNow ownership key)
scripts/
  indexnow-ping.sh              Pings api.indexnow.org after every deploy
```

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

To build for production:

```bash
npm run build
npm run start
```

## Adding a calculator

1. Add a new entry to `data/calculators.json`.
2. Create `src/app/<slug>/page.tsx` (server) and `src/app/<slug>/Calculator.tsx`
   (client). Mirror an existing calculator's pattern.
3. Verify the worked example produces the expected output in dev.
4. `npm run build` — the new page joins the sitemap automatically.

## Deploy

Every push to `main` triggers a Vercel deploy (via the GitHub App and a
backup deploy-hook GitHub Action). About 90 seconds after the deploy
goes live, a second Action pings IndexNow with every sitemap URL so
Bing and Yandex pick up new pages within minutes.

## License

© Roma. All rights reserved. Source published for transparency; not licensed
for redistribution without permission.
