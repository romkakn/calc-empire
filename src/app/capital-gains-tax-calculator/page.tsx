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
  breadcrumbListSchema, faqPageSchema, howToSchema, jsonLd,
  personSchema, softwareApplicationSchema, type FaqItem,
} from "@/lib/schema";

const SLUG = "capital-gains-tax-calculator";
const TITLE = "Capital Gains Tax Calculator";
const DESC =
  "Estimate federal capital gains tax on the sale of stocks or other appreciated property. Long-term vs short-term brackets.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between short-term and long-term capital gains?",
    answer:
      "Short-term gains come from assets held one year or less and are taxed at your ordinary income rate (10%–37% in 2025). Long-term gains come from assets held more than a year and get preferential 0%, 15%, or 20% rates. The holding period starts the day after you bought the asset.",
  },
  {
    question: "Do I owe state tax on top of federal capital gains?",
    answer:
      "Usually yes. Most states tax capital gains as regular income — California, for example, can add 9.3%+ on top of federal. Nine states (FL, TX, WA, NV, SD, WY, TN, AK, NH) have no state income tax. Check your state's rules before estimating your total bill.",
  },
  {
    question: "What is the Net Investment Income Tax (NIIT)?",
    answer:
      "NIIT is an extra 3.8% tax on investment income for high earners. It kicks in once your modified adjusted gross income (MAGI) tops $200,000 single or $250,000 married filing jointly. The 3.8% applies to the smaller of your net investment income or the amount above the threshold.",
  },
  {
    question: "Are qualified dividends taxed the same way?",
    answer:
      "Yes — qualified dividends use the same 0%/15%/20% long-term capital gains brackets. Non-qualified (ordinary) dividends are taxed at your regular income rate instead. Your broker reports which type on Form 1099-DIV.",
  },
  {
    question: "How does the wash-sale rule affect my cost basis?",
    answer:
      "If you sell a stock at a loss and buy a substantially identical security within 30 days before or after, the IRS disallows the loss. The disallowed loss gets added to the cost basis of the replacement shares, so you recover it when you eventually sell those shares.",
  },
  {
    question: "Do I owe capital gains tax when I sell my house?",
    answer:
      "Section 121 lets single filers exclude up to $250,000 of gain on a primary residence ($500,000 for married filing jointly). You must have owned and lived in the home for at least 2 of the last 5 years. Gain above the exclusion is taxed at long-term capital gains rates.",
  },
  {
    question: "Can I lower my taxes by harvesting losses?",
    answer:
      "Yes. Selling losing positions to offset gains is called tax-loss harvesting. You can deduct up to $3,000 in net losses against ordinary income each year ($1,500 if married filing separately), with the rest carrying forward. Watch the wash-sale rule when you reinvest.",
  },
  {
    question: "When should I talk to a CPA instead of using a calculator?",
    answer:
      "Get professional help for large gains, business sales, rental property, gifted or inherited assets, foreign accounts, or any year you change states. A calculator gives you a rough federal estimate — a CPA or enrolled agent handles state rules, basis adjustments, and planning moves like installment sales.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — 2025 Federal Brackets`,
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
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "finance", description: DESC }),
    howToSchema({
      name: "How to estimate federal capital gains tax",
      steps: [
        { name: "Find your cost basis", text: "Original purchase price plus commissions and reinvested dividends. Check your broker's 1099-B." },
        { name: "Subtract from sale price", text: "Sale price minus cost basis equals your capital gain (or loss)." },
        { name: "Identify holding period", text: "Held one year or less is short-term (ordinary rates). More than a year is long-term (0%/15%/20%)." },
        { name: "Apply the bracket", text: "Long-term rate depends on total taxable income including the gain. Add 3.8% NIIT if MAGI exceeds $200k single or $250k joint." },
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }} />

      <Breadcrumbs items={breadcrumbs} />

      <Hero title={TITLE} tagline="Estimate the federal tax you'll owe on a stock or property sale — short-term ordinary rates vs long-term 0%/15%/20% brackets.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Bought 100 shares for $10,000 in 2022, sold them in 2025 for $25,000. Single filer with $75,000 of other taxable income."
        steps={[
          { label: "Gain: $25,000 − $10,000", value: "$15,000" },
          { label: "Holding period > 1 yr → long-term", value: "" },
          { label: "Total taxable income: $75,000 + $15,000", value: "$90,000" },
          { label: "LTCG bracket (single, $48,350–$533,400)", value: "15%" },
          { label: "Federal tax: $15,000 × 0.15", value: "$2,250" },
          { label: "MAGI $90,000 below NIIT threshold ($200k)", value: "$0 NIIT" },
        ]}
        result="Total federal capital gains tax: $2,250. Effective rate 15% on the gain. State tax not included."
      />

      <FormulaExplained
        plainEnglish="Capital gain is what you sold for minus what you paid. The rate depends on two things: how long you held the asset, and your total taxable income for the year."
        formula={
          <span>
            gain = sale price − cost basis
            <br />
            short-term tax = gain × ordinary income rate (10%–37%)
            <br />
            long-term tax = gain × LTCG rate (0% / 15% / 20%)
            <br />
            NIIT = min(gain, MAGI − threshold) × 3.8%
          </span>
        }
        citation={{
          label: "IRS Topic No. 409 — Capital Gains and Losses",
          href: "https://www.irs.gov/taxtopics/tc409",
        }}
      />

      <WhenToUse
        scenarios={[
          "You sold stock, ETFs, or mutual fund shares and want a federal tax estimate before filing.",
          "You're deciding whether to sell now or wait until the one-year mark to get long-term rates.",
          "You're planning year-end tax-loss harvesting and need to see the net impact on your bill.",
          "You inherited or were gifted appreciated assets and need to model what selling looks like.",
          "You're comparing a lump-sum sale to an installment sale and want a sanity check on the cash flow.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating the day you bought as day one of the holding period.", fix: "The holding period starts the day after purchase. Sell on the one-year anniversary and it's still short-term — wait one more day." },
          { mistake: "Forgetting state tax.", fix: "Most states tax capital gains as ordinary income. California and New York can add 9%+ to your federal bill." },
          { mistake: "Using purchase price as cost basis on reinvested-dividend shares.", fix: "Every reinvested dividend adds to basis. Skip those and you'll overstate your gain — and overpay." },
          { mistake: "Selling at a loss then rebuying within 30 days.", fix: "Wash-sale rule disallows the loss. Wait 31+ days or buy a different (not substantially identical) security." },
          { mistake: "Ignoring the NIIT.", fix: "Above $200k single / $250k joint MAGI, an extra 3.8% applies. Easy to miss on a one-time large sale." },
          { mistake: "Assuming the calculator equals your final tax bill.", fix: "It estimates federal only. State tax, AMT, basis adjustments, and other income changes can shift the number — file with a CPA for anything material." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cost basis", definition: "What you paid for an asset, adjusted for commissions, reinvested dividends, and certain corporate actions." },
          { term: "Short-term capital gain", definition: "Gain on an asset held one year or less. Taxed at ordinary income rates." },
          { term: "Long-term capital gain", definition: "Gain on an asset held more than one year. Taxed at 0%, 15%, or 20% federal." },
          { term: "NIIT", definition: "Net Investment Income Tax — extra 3.8% on investment income above MAGI thresholds." },
          { term: "Wash sale", definition: "Selling at a loss then buying the same or substantially identical security within 30 days. Loss is disallowed and rolled into the new basis." },
          { term: "Section 121", definition: "IRS rule excluding up to $250k ($500k joint) of gain on the sale of a primary residence." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS Topic No. 409 — Capital Gains and Losses", href: "https://www.irs.gov/taxtopics/tc409" },
          { label: "IRS Publication 550 — Investment Income and Expenses", href: "https://www.irs.gov/publications/p550" },
          { label: "IRS Revenue Procedure 2024-40 — 2025 inflation-adjusted brackets", href: "https://www.irs.gov/pub/irs-drop/rp-24-40.pdf" },
          { label: "IRS — Net Investment Income Tax", href: "https://www.irs.gov/individuals/net-investment-income-tax" },
          { label: "IRS Publication 523 — Selling Your Home (Section 121)", href: "https://www.irs.gov/publications/p523" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA review before publish — 2025 brackets and NIIT thresholds" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["stock-profit-calculator", "dividend-calculator", "paycheck-calculator"]} />
    </Container>
  );
}
