import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { Hero } from "@/components/eeat/Hero";
import { WorkedExample } from "@/components/eeat/WorkedExample";
import { FormulaExplained } from "@/components/eeat/FormulaExplained";
import { WhenToUse } from "@/components/eeat/WhenToUse";
import { CommonMistakes } from "@/components/eeat/CommonMistakes";
import { RelatedTerms } from "@/components/eeat/RelatedTerms";
import { FAQ } from "@/components/eeat/FAQ";
import { References } from "@/components/eeat/References";
import { Author } from "@/components/eeat/Author";
import { LastReviewed } from "@/components/eeat/LastReviewed";
import { RelatedCalculators } from "@/components/eeat/RelatedCalculators";
import { Calculator } from "./Calculator";
import {
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  jsonLd,
  personSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";

const SLUG = "dividend-calculator";
const TITLE = "Dividend Calculator";
const DESC =
  "Project your dividend income and total return year by year, with or without DRIP. Shows the math, runs in your browser, costs nothing.";

const FAQS: FaqItem[] = [
  {
    question: "How is a dividend calculated?",
    answer:
      "Annual dividend per share equals the company's declared dividend rate. Your dividend income equals shares owned × annual dividend per share. Yield is annual dividend ÷ share price.",
  },
  {
    question: "What is a good dividend yield?",
    answer:
      "For broad US equities a 2–4% yield is typical. Above 6% often signals stress (cut risk or shrinking business). Sector matters: REITs and utilities run higher, growth tech runs lower.",
  },
  {
    question: "How often are dividends paid?",
    answer:
      "Most US large-caps pay quarterly. Some pay monthly (REITs, some ETFs) and a few pay annually. Pay frequency doesn't change total income — it changes when the cash arrives.",
  },
  {
    question: "Are dividends taxed as ordinary income?",
    answer:
      "Qualified dividends are taxed at long-term capital-gains rates (0%, 15%, or 20% in 2026 brackets). Non-qualified dividends — including most REITs — are taxed as ordinary income.",
  },
  {
    question: "What is the dividend payout ratio?",
    answer:
      "Payout ratio is dividends ÷ earnings. A ratio above 100% means the dividend exceeds current earnings — a yellow flag for sustainability unless free cash flow tells a different story.",
  },
  {
    question: "Should I reinvest my dividends?",
    answer:
      "If you're in the accumulation phase and don't need the income, DRIP usually wins via compounding. If you're retired and using the income, take the cash. Tax treatment is identical either way.",
  },
  {
    question: "What is a qualified dividend?",
    answer:
      "A dividend from a US corporation (or qualifying foreign corp) held more than 60 days during the 121-day window around the ex-dividend date. Qualified dividends get the lower tax rate.",
  },
  {
    question: "How do I project dividend growth?",
    answer:
      "Use 5–10 years of historical dividend CAGR as a base, then haircut for sector maturity. Aristocrats (25+ years of raises) often print 5–8%; new payers can run 15%+ but are riskier.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — DRIP & Projection (2026)`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({
      name: TITLE,
      slug: SLUG,
      category: "finance",
      description: DESC,
    }),
    howToSchema({
      name: "How to project dividend income",
      steps: [
        { name: "Enter your starting position", text: "Initial investment, current share price, and current annual dividend per share." },
        { name: "Estimate growth assumptions", text: "Use historical dividend growth and a conservative price-growth rate. Lower is safer for planning." },
        { name: "Add annual contributions", text: "Future buys compound on top of DRIP. Even small monthly contributions move the final number meaningfully." },
        { name: "Pick a horizon and toggle DRIP", text: "DRIP on uses each year's dividends to buy more shares. DRIP off pays cash and skips compounding." },
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <Hero
        title="Dividend Calculator"
        tagline="Model dividend income year by year, with or without reinvestment. See the table, copy the result."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="$10,000 into a $50 stock paying $2/share annually, with 6% dividend growth, 4% price growth, $1,200 contributed each year, DRIP on, 20-year horizon."
        steps={[
          { label: "Starting shares (10,000 / 50)", value: "200" },
          { label: "Year-1 dividends (200 × $2)", value: "$400" },
          { label: "Year-1 end price (50 × 1.04)", value: "$52.00" },
          { label: "Year-1 reinvested shares (400 / 52)", value: "+7.69" },
          { label: "Year-1 contribution shares (1,200 / 52)", value: "+23.08" },
          { label: "Year-20 final value (compounded)", value: "≈ $116,100" },
          { label: "Year-20 total dividends collected", value: "≈ $46,200" },
        ]}
        result="A modest starting position grows past $116k in 20 years on a 6% dividend / 4% price assumption."
      />

      <FormulaExplained
        plainEnglish="Each year, your dividend income is shares × dividend per share. With DRIP on, those dividends buy fractional new shares at the end-of-year price, growing your share count. Contributions compound on top."
        formula={
          <span>
            Year-end shares = shares + (dividends + contribution) / price<sub>end</sub>
            <br />
            Year-end value = shares × price<sub>end</sub>
            <br />
            Repeat for n years; price and dividend per share grow at their own rates.
          </span>
        }
        citation={{
          label: "SEC Investor.gov — Dividend Reinvestment (DRIP) basics",
          href: "https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend-reinvestment-program-drip",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're choosing between a dividend ETF and an index fund and want to see the cash-flow difference over a decade.",
          "You hold a long-time aristocrat and want to project the snowball effect of DRIP versus taking dividends in cash.",
          "You're building a retirement-income plan and need to estimate when dividends alone could cover a target annual expense.",
          "You're considering pausing contributions and want to see how much that costs over 20+ years of compounding.",
          "You want a defensible projection to share with a partner or a financial advisor before changing allocation.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming a single high yield is sustainable.", fix: "Pair yield with payout ratio and 5-year dividend growth. A 9% yield with a 130% payout ratio is a cut waiting to happen." },
          { mistake: "Forgetting taxes on dividends in a taxable account.", fix: "Qualified dividends get a 0/15/20% rate; non-qualified are ordinary income. Adjust your projection or hold dividend-heavy assets in tax-advantaged accounts." },
          { mistake: "Using last year's dividend growth as the forever rate.", fix: "Use 5–10 year CAGR and haircut for company maturity. Trees don't grow to the sky." },
          { mistake: "Ignoring fractional-share friction at the broker.", fix: "Most modern brokers support fractional DRIP. If yours doesn't, dividends sit in cash until you can buy a whole share — which slows compounding." },
          { mistake: "Confusing total return with yield.", fix: "Total return = price change + dividends. A 4% yield with −2% price growth nets +2%. Always think in total terms." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Yield", definition: "Annual dividend ÷ current share price. Moves inversely with price." },
          { term: "DRIP", definition: "Dividend Reinvestment Plan — automatic use of dividends to buy more shares, usually commission-free." },
          { term: "Payout ratio", definition: "Dividends paid ÷ earnings (or free cash flow). A sustainability check on the dividend." },
          { term: "Qualified dividend", definition: "Dividend taxed at long-term capital-gains rates rather than ordinary income." },
          { term: "Dividend CAGR", definition: "Compound annual growth rate of the dividend over a period — a cleaner signal than year-over-year change." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "SEC Investor.gov — Dividend Reinvestment Programs", href: "https://www.investor.gov/introduction-investing/investing-basics/glossary/dividend-reinvestment-program-drip" },
          { label: "IRS Topic 404 — Dividends", href: "https://www.irs.gov/taxtopics/tc404" },
          { label: "S&P Dow Jones — Dividend Aristocrats methodology", href: "https://www.spglobal.com/spdji/en/indices/dividends-factors/sp-500-dividend-aristocrats/" },
        ]}
      />

      <Author />

      <LastReviewed date="2026-05-27" />

      <RelatedCalculators
        slugs={[
          "mortgage-recast-calculator",
          "options-profit-calculator",
          "variance-calculator",
        ]}
      />
    </Container>
  );
}
