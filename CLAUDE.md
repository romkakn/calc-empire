@AGENTS.md

# Project: SEO Calculator Empire (calc-empire)

Owner: **Roma** — all notifications to romaknafel@gmail.com.

## Stack
- Next.js 16.2.6 (App Router) + React 19.2 + TypeScript 5 + Tailwind v4
- Static export where possible; ISR via `export const revalidate` otherwise
- Repo on GitHub (pending — local git only until github MCP installed)
- Specs in Notion workspace "SEO Calculators" (pending — markdown in `docs/specs/` until notion MCP)
- Cross-session memory via `memory` MCP — entities loaded for all 8 references + project itself

## Hard rules
- Address Roma in all PRs, Notion comments, emails
- Send notifications to romaknafel@gmail.com (substitute: write to `.notifications/<ISO-timestamp>-<subject>.md` until gmail MCP available)
- Run `npm run build` before every commit
- Read `node_modules/next/dist/docs/` for Next.js 16 APIs — training data is stale, this version has breaking changes
- Use `Context7` MCP for React / Tailwind APIs; fall back to `brave-search` if quota exceeded
- Never commit tax / medical / legal values without `TODO_VERIFY` flag and 2 source links
- Schema.org `SoftwareApplication` + `FAQPage` + `HowTo` + `BreadcrumbList` + `Person` required on every calculator page
- Theme: 3-state toggle (system / light / dark), cookie-persisted (NOT localStorage)
- Inline `<script>` in `<head>` sets `data-theme` before paint to prevent flash

## Voice
- Mobile-first, MD3-inspired design
- FAQ answers ≤ 3 sentences, 8th-grade reading level
- US English, no marketing fluff
- Banned words: **revolutionary**, **seamlessly**, **robust**, **leverage**, **synergy**

## Simplicity principle
- Built-ins over libraries
- `useState` / `useReducer` only — no Redux / Zustand
- Tailwind only — no CSS-in-JS, no UI component libs unless Context7 confirms necessity
- Native form elements (`<input>`, `<select>`) — no custom widgets
- File conventions over plugins (`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`)

## Repo structure
```
src/
  app/
    layout.tsx              # Root layout, Organization JSON-LD, theme bootstrap
    page.tsx                # Homepage — calculator index
    sitemap.ts              # Generated from /data/calculators.json
    robots.ts               # Index everything except /api and /_next
    manifest.ts             # PWA manifest
    opengraph-image.tsx     # Default OG image
    <slug>/page.tsx         # Per-calculator page (Server Component)
    <slug>/Calculator.tsx   # Per-calculator interactive widget (Client Component)
  components/
    eeat/                   # The 13 E-E-A-T blocks as reusable components
    theme/                  # ThemeToggle, cookie helpers
  lib/
    schema.ts               # JSON-LD generators
data/
  calculators.json          # Single source of truth for the catalog
docs/
  recon/                    # Outperform briefs (was Notion)
  specs/                    # Per-unit PLAN.md files
  status/                   # Run logs
.notifications/             # Email-substitutes for Roma to read
scripts/
  install-mcps.sh           # Add github/notion/gmail MCPs
  push-to-github.sh         # One-click GitHub push when token ready
```

## Per-unit workflow (summary; full spec in memory MCP under `ref:per-unit-workflow`)
A. Discovery — memory search + Context7 + ahrefs LSI/intent + design tokens
B. Plan — sequential-thinking → write `docs/specs/<slug>/PLAN.md` → cite ambiguous formulas
C. Build — `app/<slug>/page.tsx` Server + `Calculator.tsx` Client, 13 E-E-A-T blocks, register in `/data/calculators.json`
D. Verify — `npm run build`, `npm run lint`, accessibility audit, design critique, claude-preview screenshots + eval, schema validator
E. Ship — conventional commits, PR (when github MCP), email Roma (`.notifications/` until gmail MCP)

## Verification gate (no PR without all green)
See memory entity `ref:verification-checklist`. Highlights: build/lint/tsc exit 0, WCAG 2.2 AA, Lighthouse Perf ≥ 90 / A11y 100 / SEO 100, 3 worked examples verified, JSON-LD validates.

## Missing MCPs (2026-05-27) — substitutions in effect
| Missing | Substitute |
|---|---|
| github | Local git only; `scripts/push-to-github.sh` adds remote + pushes when token ready |
| notion | Briefs/specs as markdown in `docs/recon/` and `docs/specs/` |
| gmail | Notifications written to `.notifications/<timestamp>-<subject>.md` |

Run `scripts/install-mcps.sh` to install them, then re-run `/seo-calc-empire calc-empire` to sync.
