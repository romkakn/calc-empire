# STATUS — calc-empire

**For:** Roma · seomanager211@gmail.com
**Last update:** 2026-05-27 (late evening)
**Repo:** https://github.com/romkakn/calc-empire (private)
**Live URL:** https://calc-empire-roma-s-projects3.vercel.app

## TL;DR — fully live

- ✅ **8 calculator pages** live with full E-E-A-T (mortgage-recast, no-vig, dividend, variance, asphalt, mixed-number, a1c, chronological-age) + paycheck-calculator preview (noindex)
- ✅ **7 category landing pages** (`/finance`, `/betting`, `/stats`, `/math`, `/health`, `/construction`, `/payroll`) auto-generated from `data/calculators.json`
- ✅ **Sitemap (16 URLs)**, robots.txt, JSON-LD on every page, dynamic OG image + favicon
- ✅ **Material Design 3** design system, light + dark + system themes, WCAG 2.2 AA accessibility
- ✅ **Vercel auto-deploy on every push to `main`** — both Vercel's native GitHub App webhook AND a backup GitHub Action via a Vercel deploy hook
- ✅ **Vercel Analytics + Speed Insights** code wired in; enable per the EDIT_GUIDE for live numbers
- ✅ **Slots ready for** Google Analytics, Google Tag Manager, Google Search Console verification, Bing verification, Yandex — all via Vercel env vars (no code edit)

## How to make any change

**The full no-code reference is in [`docs/EDIT_GUIDE.md`](docs/EDIT_GUIDE.md).** It covers:

1. Edit page copy
2. Change SEO tags per page
3. Install Google Analytics / GTM / FB Pixel via Vercel env vars
4. Verify with Google Search Console / Bing / Yandex
5. Submit the sitemap
6. Buy and connect a custom domain
7. Add a new calculator
8. Change theme colors
9. Promote a planned calculator to live
10. Edit the homepage / about page
11. Add redirects
12. Files NOT to touch

## What's actually serving in production

```
src/app/
  layout.tsx                          # Root layout + analytics + verification slots
  page.tsx                            # Homepage with category sections
  about/page.tsx                      # Author page
  [category]/page.tsx                 # Dynamic category landing pages
  sitemap.ts robots.ts manifest.ts    # SEO file conventions
  opengraph-image.tsx icon.tsx        # Dynamic OG + favicon
  not-found.tsx                       # Branded 404
  mortgage-recast-calculator/         # Live
  no-vig-calculator/                  # Live
  dividend-calculator/                # Live
  variance-calculator/                # Live
  asphalt-calculator/                 # Live
  mixed-number-calculator/            # Live
  a1c-calculator/                     # Live
  chronological-age-calculator/       # Live
  paycheck-calculator/                # Preview (noindex; needs 2026 IRS tables + state pages)
src/components/
  Header, Footer, Container, SkipLink
  theme/{ThemeBootstrap, ThemeToggle}
  md3/{Card, TextField, SegmentedButton}     # Material Design 3 primitives
  eeat/                                       # 13 reusable E-E-A-T content blocks
data/
  calculators.json                    # Single source of truth — sitemap + homepage + category pages all read this
docs/
  EDIT_GUIDE.md                       # The no-code reference (start here)
  recon/                              # 13 outperform briefs from Ahrefs SERP research
  specs/                              # Per-unit PLAN.md files for the not-yet-built calcs
.github/workflows/
  vercel-deploy.yml                   # Backup GitHub Action that POSTs to Vercel's deploy hook on every push
```

## Auto-deploy plumbing

Two paths now trigger a build on every `git push origin main`:

1. **Vercel's GitHub App webhook** — native, fast. Was blocked previously because the commit author email was invalid; fixed by setting the repo's `user.email = seomanager211@gmail.com`.
2. **Backup GitHub Action** (`.github/workflows/vercel-deploy.yml`) — POSTs to a Vercel deploy-hook URL stored as repo secret `VERCEL_DEPLOY_HOOK_URL`. If Vercel's native webhook ever gets BLOCKED again (e.g. Hobby-tier quirk), this path still fires.

Roma never needs to manually click Redeploy. Edit files on GitHub → 30 sec later the change is live.

## What to do next (your call)

**Recommended order:**

1. **Enable Vercel Web Analytics**: dashboard → calc-empire → Analytics tab → Enable. Free. Numbers appear within minutes. (Speed Insights already auto-enabled itself.)
2. **Verify ownership with Google Search Console**: https://search.google.com/search-console → add property → "HTML tag" → copy the `content="..."` value → paste into Vercel env as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Production) → Redeploy → click "Verify" in the GSC UI.
3. **Submit the sitemap**: GSC → Sitemaps → `https://calc-empire-roma-s-projects3.vercel.app/sitemap.xml` → Submit. Google starts crawling within 24 h.
4. **Buy a custom domain** (Namecheap, Porkbun) when you're ready. Vercel → Settings → Domains → Add → follow DNS prompts. Update `NEXT_PUBLIC_SITE_URL` env var to the new domain → Redeploy.
5. **Build the next batch** of calcs: crcl, options-profit, paycheck-state-variants — all already specced under `docs/specs/`. Just ask.

## Open TODO_VERIFY items in code

- `src/components/eeat/Author.tsx` — replace placeholder bio with real credentials
- `src/lib/schema.ts` — add Roma's LinkedIn / authoritative profile URLs to `Person.sameAs`
- `src/app/a1c-calculator/page.tsx` — needs a licensed clinical reviewer named in the Author block
- `src/app/mortgage-recast-calculator/page.tsx` — needs a licensed mortgage analyst named in the Author block
- `src/app/paycheck-calculator/federalTax.ts` — uses 2025 IRS Publication 15-T tables; refresh to 2026 when IRS publishes (typically mid-November)
- `docs/specs/*.md` — each spec lists its own forward-looking TODO_VERIFY items
