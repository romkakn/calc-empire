# Edit Guide — calc-empire

A no-code reference for Roma. Every change in this guide ends with one of two outcomes:

- **You edit a file → Claude pushes → Vercel auto-redeploys in ~30 sec.**
- **You paste a value into Vercel's Environment Variables → click Redeploy → live in ~30 sec.**

If you want to do *any* of this yourself without Claude, the workflow is:

1. Open the repo on GitHub: https://github.com/romkakn/calc-empire
2. Click the file you want to change → pencil icon (✎) → make the edit → "Commit changes" at the bottom
3. Vercel sees the new commit and auto-deploys

Or just tell Claude what you want changed.

---

## 1. Edit page copy (titles, descriptions, FAQ, worked examples)

Every calculator lives in two files under `src/app/<slug>/`:

| File | What's in it |
|---|---|
| `page.tsx` | The visible page — title, tagline, FAQs, references, worked example, common mistakes |
| `Calculator.tsx` | The interactive widget — input labels, helper text, the formula in code |

Example: change the mortgage recast FAQs.

1. Open [`src/app/mortgage-recast-calculator/page.tsx`](../src/app/mortgage-recast-calculator/page.tsx)
2. Find the `FAQS` array near the top
3. Edit any `question` or `answer` string
4. Save / commit

Don't touch:
- The `softwareApplicationSchema(...)` / `howToSchema(...)` lines unless you know JSON-LD
- The `breadcrumbs` array unless you're moving the page

---

## 2. Change SEO tags per page

Each page's SEO tags are in the `metadata` block near the top of `page.tsx`:

```ts
export const metadata: Metadata = {
  title: "Mortgage Recast Calculator (2026)",
  description: "Estimate your new monthly payment …",
  alternates: { canonical: "/mortgage-recast-calculator" },
  openGraph: { title: …, description: …, url: …, type: "article" },
  twitter: { card: "summary_large_image", title: …, description: … },
};
```

Edit the `title` and `description` strings. Keep:
- Title ≤ 60 characters
- Description ≤ 155 characters
- Canonical URL exactly matches the route (don't change unless you move the page)

The Open Graph image is auto-generated from `src/app/opengraph-image.tsx` (see §6 to customise).

---

## 3. Install header codes (Google Analytics, GTM, FB Pixel, etc.)

**No code edit needed.** Set environment variables in Vercel and redeploy.

### Google Analytics 4
1. https://analytics.google.com → create a property → copy the **Measurement ID** (looks like `G-XXXXXXXXXX`)
2. Vercel → Project → **Settings** → **Environment Variables**
3. Add: `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (Production)
4. **Deployments** tab → ⋯ on latest → **Redeploy**

### Google Tag Manager
1. https://tagmanager.google.com → create container → copy the **GTM ID** (looks like `GTM-XXXXXXX`)
2. Vercel env var: `NEXT_PUBLIC_GTM_ID` = `GTM-XXXXXXX`
3. Redeploy

Once GTM is loaded, install Facebook Pixel, Hotjar, etc. via GTM tags — no code change.

### Search Engine Verification

| Service | Env var | Where to get the code |
|---|---|---|
| Google Search Console | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | search.google.com/search-console → property → settings → ownership verification → HTML tag → copy `content="..."` value |
| Bing Webmaster | `NEXT_PUBLIC_BING_SITE_VERIFICATION` | bing.com/webmasters → site → meta tag → copy value |
| Yandex | `NEXT_PUBLIC_YANDEX_VERIFICATION` | webmaster.yandex.com → meta tag → copy value |

Add the env var → redeploy → in the Console UI click "Verify".

### Vercel Web Analytics + Speed Insights
These are already installed and only need to be **enabled in the dashboard**:

1. Vercel → Project → **Analytics** tab → click **Enable**
2. Same for **Speed Insights** tab

Free forever on Hobby plan. No code change. Visitor numbers and Core Web Vitals appear within minutes.

---

## 4. Submit the sitemap (Google + Bing)

After GSC verification (above):

1. **Google Search Console** → site → **Sitemaps** (left sidebar) → add `https://<your-domain>/sitemap.xml` → **Submit**
2. **Bing Webmaster** → **Sitemaps** → **Submit sitemap** → same URL

Google typically starts crawling within 24 hours. Watch the **Coverage** report for indexed pages.

---

## 5. Buy a custom domain

1. Buy at Namecheap / Porkbun / Google Domains (~$10/yr)
2. Vercel → Project → **Settings** → **Domains** → **Add** → type the domain
3. Vercel shows DNS records to add at your registrar — paste them in
4. Wait 5–60 min for DNS propagation; certificate auto-issues
5. Vercel → **Settings** → **Environment Variables** → edit `NEXT_PUBLIC_SITE_URL` to the new domain
6. Redeploy

The sitemap, robots.txt, JSON-LD, and canonical URLs all auto-pick up the new domain after redeploy.

---

## 6. Add a new calculator

Tell Claude. The pattern is:

1. Pick a slug + primary keyword
2. Add it to `data/calculators.json` with `"status": "planned"`
3. Run `/seo-calc-empire calc-empire recon` to generate the outperform brief
4. Run `/seo-calc-empire calc-empire build` to ship the page
5. Mark `"status": "live"` and push

Or just say: "Add a [topic] calculator". Claude follows the per-unit workflow stored in memory.

---

## 7. Change theme colors

All color tokens live in [`src/app/globals.css`](../src/app/globals.css), under `:root, [data-theme="light"]` and `[data-theme="dark"]`.

The most-touched tokens:
- `--md-sys-color-primary` — accent for buttons, emphasised results, links
- `--md-sys-color-surface` — page background
- `--md-sys-color-on-surface` — body text

Pick a new palette using Google's **Material Theme Builder** (https://material-foundation.github.io/material-theme-builder/) — export the CSS values and paste them in.

---

## 8. Mark a planned calculator as live (or vice versa)

Edit [`data/calculators.json`](../data/calculators.json) — change `"status": "planned"` to `"status": "live"` (or `"in-progress"` to skip the sitemap but keep the URL accessible).

The homepage, category pages, sitemap, and Roadmap section all rebuild from this file.

---

## 9. Edit the homepage

[`src/app/page.tsx`](../src/app/page.tsx). The tagline comes from `data/calculators.json` → `site.tagline`.

---

## 10. Edit the About / author page

[`src/app/about/page.tsx`](../src/app/about/page.tsx). Author name + URL path live in `data/calculators.json` → `site.author` and `site.author_url_path`.

Person schema (LinkedIn, etc.) → [`src/lib/schema.ts`](../src/lib/schema.ts) → `personSchema()` → fill in `sameAs` array.

---

## 11. Add a redirect (e.g., old URL → new URL)

Edit [`next.config.ts`](../next.config.ts) — add a `redirects()` function:

```ts
async redirects() {
  return [
    { source: "/old-calc", destination: "/new-calc", permanent: true },
  ];
}
```

`permanent: true` = 308 (search-engine-safe). `false` = 307 (temporary).

---

## 12. Where to ask for help

- Anything calc-related → ask Claude. Reference this guide by number ("how do I do §3 step 4?").
- Vercel-specific → vercel.com/docs has clean walkthroughs with screenshots.
- Next.js API → `node_modules/next/dist/docs/` (Next 16 has breaking changes — don't trust internet posts written before late 2025).

---

## Files NOT to touch

| File | Why |
|---|---|
| `src/app/layout.tsx` | Wires analytics, search-console verification, Organization JSON-LD. Edit via env vars instead. |
| `src/components/md3/` | Material Design 3 primitives. Editing breaks every page that uses them. |
| `src/lib/site.ts` / `src/lib/schema.ts` | Single source of truth for site config + JSON-LD. Touch only with care. |
| `.next/` | Build output. Auto-generated. Ignored by git anyway. |
| `node_modules/` | Dependencies. Ignored by git. |
