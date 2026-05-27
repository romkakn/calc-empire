# STATUS — calc-empire

**For:** Roma · romaknafel@gmail.com
**Last update:** 2026-05-27
**Repo:** `/Users/romaknafel/projects/calc-empire`

## TL;DR

- Phase 1 (setup): **done** — Next.js 16 + React 19 + Tailwind v4 + TS, builds cleanly, `npm run build` exits 0.
- Phase 2 (recon): **done** — 13 outperform briefs in `docs/recon/`, all targets numeric and build-ready.
- Phase 3 (build): **3 of 13 calculators live**: `mortgage-recast-calculator`, `no-vig-calculator`, `dividend-calculator`. The other 10 have specs in `docs/specs/<slug>.md` ready for the next session.
- Phase 4 (ops): **done** — 5 scheduled tasks created via `scheduled-tasks` MCP. They run with degraded behavior (write to `.notifications/`) until you install gmail/notion/github MCPs.

## Three things you do (your only touchpoints)

1. **Install the 3 missing MCPs** — `./scripts/install-mcps.sh` then set the 3 env vars it prints. Adds `github`, `notion`, `gmail` so the next session can open real PRs, write to Notion, and email you.
2. **Push to GitHub** — once `GITHUB_PERSONAL_ACCESS_TOKEN` is exported: `./scripts/push-to-github.sh romaknafel calc-empire`. Creates the private repo and pushes `main`.
3. **Choose a deploy target** — Vercel one-clicks the repo. Set `NEXT_PUBLIC_SITE_URL` in the env so `sitemap.ts`, `robots.ts`, and JSON-LD use the real domain.

## What's in the repo

```
src/app/
  layout.tsx                  # Organization JSON-LD, theme bootstrap, header/footer
  page.tsx                    # Calculator catalog homepage
  about/page.tsx              # Author page (Person schema)
  sitemap.ts                  # auto-generated from data/calculators.json
  robots.ts
  manifest.ts
  mortgage-recast-calculator/{page.tsx,Calculator.tsx}
  no-vig-calculator/{page.tsx,Calculator.tsx}
  dividend-calculator/{page.tsx,Calculator.tsx}
src/components/
  Header, Footer, Container, SkipLink
  theme/{ThemeBootstrap, ThemeToggle}  # cookie-based 3-state (no localStorage)
  eeat/                                # 12 reusable E-E-A-T blocks (Hero, FAQ, FormulaExplained, etc.)
src/lib/
  site.ts, schema.ts, theme.ts
data/
  calculators.json            # single source of truth — sitemap + homepage read this
docs/
  recon/                      # 13 outperform briefs + _index.md
  specs/                      # 10 per-unit PLAN.md files for the calcs not yet built
.notifications/               # email substitute — gmail MCP missing
scripts/
  install-mcps.sh             # install github/notion/gmail
  push-to-github.sh           # one-click GitHub push
  notify-roma.sh              # email substitute helper
```

## What was substituted (because the MCPs were missing)

| Skill spec wants | Substitute used | Re-enable when… |
|---|---|---|
| `github` MCP to open PRs and push commits | Local git only (5 commits on `main`) | `./scripts/install-mcps.sh` then `./scripts/push-to-github.sh` |
| `notion` MCP for briefs + specs | Markdown files in `docs/recon/` and `docs/specs/` | Optional — local files are first-class; sync if you prefer |
| `gmail` MCP for all notifications | Markdown files in `.notifications/` | After `install-mcps.sh`, prior notifications can be flushed (TODO: `scripts/flush-notifications.sh`) |
| `/batch` skill for parallel unit builds | Sequential build of 3 calcs; specs for the rest | Install `/batch` skill or run `/seo-calc-empire calc-empire build` once MCPs exist |
| `claude-preview` snapshot/eval verification | Manual hand-verification of math via `node -e` | Run dev server + claude-preview screenshots before merging future calcs |

## Verification done so far

- `npm run build` → **green**, 9 static routes prerendered (including the 3 calcs)
- `npm run lint` → **green**, zero warnings
- `npx tsc --noEmit` → **green**
- Mortgage-recast math hand-verified: $300k, 6.5%, 28y left, $50k lump → **$324/mo savings**, **$108,449 lifetime** (matches code)
- No-vig math hand-verified: −150/+130 → fair odds **−138/+138**, vig **3.48%** (matches code)
- Dividend math hand-verified: $10k / $50/sh / $2 div / 6%/4% / $1.2k contrib / 20y / DRIP → **$116,100 final**, **$46,200 dividends collected** (matches code)
- JSON-LD: all 3 calcs emit `SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`, `Person`. Root layout emits `Organization`. Validate at validator.schema.org once deployed.
- Accessibility self-check: WCAG 2.2 AA structural compliance — semantic HTML, one `<h1>`, skip link, focus-visible rings, `aria-invalid`/`aria-errormessage` on form errors, `role="status"` `aria-live="polite"` on results, ≥ 48 px touch targets, contrast pairs hand-picked to ≥ 4.5:1 body / ≥ 3:1 UI in both themes. A formal `design:accessibility-review` pass should be the gate before the next merge.

## Open `TODO_VERIFY` flags (visible in code)

- `src/components/eeat/Author.tsx` — Roma's credentials + bio
- `src/lib/schema.ts` — `Person.sameAs` LinkedIn/profile URL
- `src/app/mortgage-recast-calculator/page.tsx` — licensed mortgage analyst reviewer
- All 10 spec files in `docs/specs/` — calc-specific TODO_VERIFY items (2026 tax tables for paycheck; medical reviewer for a1c/crcl; current model versions for AI articles; etc.)

## Memory MCP entities created

- `project:calc-empire` — project root with rules, stack, owner, voice
- `ref:eeat-blocks`, `ref:verification-checklist`, `ref:schema-templates`, `ref:competitor-recon`, `ref:per-unit-workflow`, `ref:accessibility-spec`, `ref:scheduled-ops`, `ref:claude-md-template` — the 8 reference docs
- `brief:<slug>` × 13 — per-slug outperform briefs (linked to project via `informs`)
- `missing-mcps:2026-05-27` — blocker entity with substitutions and resolution steps

A future session can resume by calling `mcp__memory__search_nodes` with `project:calc-empire` or any of the slug names.

## Scheduled tasks (live now, degraded until MCPs exist)

| Task | When | What it does |
|---|---|---|
| `calc-empire-daily-digest` | every day 08:00 | Rank + GSC deltas → `.notifications/` (+ email if gmail) |
| `calc-empire-weekly-opportunity-scan` | Mon 09:00 | KD ≤ 20 / vol ≥ 2k keyword pulls → backlog candidates |
| `calc-empire-rank-drop-alert` | every 6h | Alert if any tracked keyword drops 5+ positions |
| `calc-empire-quarterly-refresh-check` | Tue 10:00 | Find calcs past 90-day review, generate refresh briefs |
| `calc-empire-competitor-watch` | Sun 06:00 | Re-scan top-10 calcs by traffic, detect SERP shifts |

All five auto-skip steps that need github/notion/gmail until those MCPs exist.

## Next session — what to ask me

- **"Continue building — variance, mixed-number, asphalt next."** I'll use `docs/specs/<slug>.md` + the briefs in `docs/recon/` to ship those three calcs. Same E-E-A-T template, same verification gate.
- **"Hook up GitHub and push."** I'll run the install script, set up the remote, push, and open the first PR.
- **"Set the production domain."** I'll wire `NEXT_PUBLIC_SITE_URL`, regenerate sitemap + JSON-LD, and confirm with a fresh `npm run build`.
- **"Run claude-preview on the 3 live calcs."** I'll start the dev server, screenshot 375 + 1440 in both themes, and validate JSON-LD against validator.schema.org.

— Built by Claude for Roma. Address questions in this session or open a fresh one with `/seo-calc-empire calc-empire`.
