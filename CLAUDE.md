# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Calc Empire** — a static-first Next.js 16 (App Router) site of plain-English
calculators and supporting blog posts. Live at https://calculate-it.dev,
deployed on Vercel. TypeScript, React 19, Tailwind v4, no test framework yet.

Every calculator page is prerendered at build time. There is no database, no
API layer, and no server state — all content lives in the repo.

## Commands

```bash
npm ci              # install (lockfile is authoritative)
npm run dev         # local dev server
npm run build       # production build — prerenders every page; the real gate
npm run lint        # eslint (next/core-web-vitals + next/typescript)
npx tsc --noEmit    # typecheck
```

`npm run build` is the meaningful check: it statically renders 150+ routes, so
a bad slug, a broken `generateStaticParams`, or a metadata error fails there
and nowhere else. Run it before any push that touches routing, data, or
`src/lib/`.

## Layout

```
data/calculators.json     Catalog: site meta, categories, calculators, articles
data/payroll-states.ts    Per-state payroll tax tables (50-state programmatic calc)
src/lib/site.ts           Reads calculators.json; exports SITE_URL, CATEGORIES,
                          CALCULATORS, LIVE_CALCULATORS, ARTICLES, LIVE_ARTICLES
src/lib/blog.ts           BLOG_POSTS — the blog catalog (separate from the JSON)
src/lib/schema.ts         JSON-LD builders (SoftwareApplication, HowTo, FAQPage,
                          BreadcrumbList, Person)
src/lib/theme.ts          Light/dark/system theme resolution
src/components/eeat/      Page-section components every calculator page composes
src/components/md3/       Material Design 3 primitives (Card, TextField, ...)
src/app/<slug>/page.tsx   One directory per calculator; `Calculator.tsx` beside it
                          holds the interactive client component
src/app/[category]/       Category landing pages
src/app/blog/<slug>/      One directory per post
src/app/sitemap.xml/      Hand-rolled sitemap index
src/app/sitemap/[file]/   Child sitemaps, one per category plus `main`
```

## Two catalogs — know which one you are editing

- **Calculators** are declared in `data/calculators.json` and read through
  `src/lib/site.ts`. A calculator is only in the sitemap when its entry has
  `"status": "live"`.
- **Blog posts** are declared in `src/lib/blog.ts` (`BLOG_POSTS`), *not* in
  `calculators.json`. The `articles` array in the JSON is currently inert —
  no entry is `live`, so `LIVE_ARTICLES` is empty.

Adding a calculator means: a `data/calculators.json` entry with
`status: "live"`, plus `src/app/<slug>/page.tsx` and `Calculator.tsx`.
Adding a post means: a `BLOG_POSTS` entry plus `src/app/blog/<slug>/page.tsx`.
Either one added in only one of the two places is a bug — the page 404s from
the sitemap, or the sitemap points at a 404.

## Page conventions

A calculator page is a server component that:

1. Declares `SLUG`, `TITLE`, `DESC`, and a `FAQS: FaqItem[]` array as
   module-level constants.
2. Exports `metadata` with a canonical URL built from `SITE_URL`.
3. Composes the E-E-A-T sections in a fixed order: `Breadcrumbs`, `Hero`,
   the client `Calculator`, `WorkedExample`, `FormulaExplained`, `WhenToUse`,
   `CommonMistakes`, `RelatedTerms`, `FAQ`, `References`, `Author`,
   `LastReviewed`, `RelatedCalculators`.
4. Emits JSON-LD via the `src/lib/schema.ts` builders.

Copy the nearest existing calculator in the same category rather than starting
from scratch — the section order and schema wiring are load-bearing for SEO.

The interactive part always lives in a sibling `Calculator.tsx` marked
`"use client"`. Keep `page.tsx` a server component so the page stays static.

## Styling

Material Design 3 tokens are defined in `src/app/globals.css` as CSS custom
properties and consumed through Tailwind. Do not hardcode colors — use the
tokens so light/dark/system theming and WCAG 2.2 AA contrast hold. Interactive
targets are 48dp minimum.

Note: "token" in this codebase almost always means a design token, not a
credential.

## Secrets and public identifiers

No secrets are committed, and none should be. `.gitignore` excludes `.env*`
and `*.pem`. GitHub Actions read `${{ secrets.VERCEL_DEPLOY_HOOK_URL }}` and
`${{ secrets.SITE_HOST }}`.

Two hardcoded values look like secrets but are public by protocol design —
leave them alone:

- The IndexNow key in `scripts/indexnow-ping.sh`, which must match the file
  served at `public/<key>.txt`.
- The Google Search Console verification token in `src/app/layout.tsx`, which
  ships in a `<meta>` tag.

## SEO invariants

These are the things that quietly break and cost traffic. Check them when you
touch data or routing:

- Every `live` calculator slug has a matching `src/app/<slug>/` directory,
  and every calculator directory has a `live` catalog entry.
- Every `BLOG_POSTS` slug has a matching `src/app/blog/<slug>/` directory.
- `relatedCalcs` on every post references a `live` calculator slug.
- Every internal `href` resolves to a real route.
- `src/app/sitemap.xml/route.ts` and `src/app/sitemap/[file]/route.ts` list
  the same child ids. They are two hand-written files that must agree.
- Canonical URLs come from `SITE_URL`; never hardcode the domain in a page.

## Git

Conventional-commit subjects (`feat(calc):`, `fix(sitemap):`, `chore:`, `seo:`).
Do not commit `node_modules`, `.next`, or `.vercel`.
