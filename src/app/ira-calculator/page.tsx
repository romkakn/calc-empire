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

const SLUG = "ira-calculator";
const TITLE = "IRA Calculator";
const DESC =
  "Project the future value of a Traditional or Roth IRA. Enter your balance, annual contribution, expected return, and retirement age.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between a Traditional and Roth IRA?",
    answer:
      "Traditional IRA contributions may be tax-deductible now, and withdrawals in retirement are taxed as ordinary income. Roth IRA contributions are made with after-tax dollars, but qualified withdrawals after age 59½ are tax-free. Both grow tax-deferred while invested.",
  },
  {
    question: "What are the 2025 IRA contribution limits?",
    answer:
      "For 2025, the IRS sets the IRA contribution limit at $7,000 per year for individuals under 50. Combined Traditional plus Roth contributions cannot exceed the annual limit. Limits are indexed for inflation and may be updated each year.",
  },
  {
    question: "What is the catch-up contribution for people 50 and older?",
    answer:
      "If you are age 50 or older, the IRS allows an extra $1,000 catch-up contribution on top of the regular IRA limit. For 2025 that brings the total to $8,000 per year. The catch-up applies separately for each spouse with earned income.",
  },
  {
    question: "Are there income limits on Roth IRA contributions?",
    answer:
      "Yes. Roth IRA contributions phase out at higher modified adjusted gross incomes (MAGI). For 2025, single filers phase out between $150,000 and $165,000 MAGI, and married filing jointly between $236,000 and $246,000. Above the top range, direct Roth contributions are not allowed.",
  },
  {
    question: "What is the early withdrawal penalty?",
    answer:
      "Withdrawing earnings from an IRA before age 59½ usually triggers a 10% additional tax plus regular income tax on the amount. The IRS allows exceptions for things like a first home purchase up to $10,000, qualified higher education, and certain medical costs.",
  },
  {
    question: "When do required minimum distributions (RMDs) start?",
    answer:
      "Under SECURE 2.0, Traditional IRA owners must begin RMDs at age 73, rising to 75 for people born in 1960 or later. Roth IRAs have no RMDs during the owner's lifetime. Missing an RMD can trigger a 25% excise tax, reduced to 10% if corrected promptly.",
  },
  {
    question: "What is a backdoor Roth IRA?",
    answer:
      "A backdoor Roth is a strategy where high earners who exceed the Roth income limits make a nondeductible Traditional IRA contribution and then convert it to a Roth IRA. The conversion is generally taxable on any pre-tax balance. Speak to a tax advisor about the pro-rata rule before trying this.",
  },
  {
    question: "Does this calculator account for taxes?",
    answer:
      "No. The future value shown is the gross balance before any taxes are applied. For Traditional IRAs, withdrawals are taxed at your future ordinary income rate. For Roth IRAs, qualified withdrawals are tax-free, so the gross balance is closer to what you keep.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Traditional & Roth Projection`,
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
      name: "How to project an IRA balance at retirement",
      steps: [
        { name: "Enter your starting balance", text: "Use the current value of your Traditional or Roth IRA from your latest statement." },
        { name: "Set the annual contribution", text: "For 2025 the IRS limit is $7,000 (or $8,000 if age 50+). Contribute up to what you can afford within that cap." },
        { name: "Estimate your return and timeline", text: "Pick an expected average annual return (a common planning figure is 6–8%) and enter your current and target retirement age." },
        { name: "Read the future value", text: "The calculator compounds your balance and contributions year by year and shows the projected balance at retirement." },
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

      <Hero title={TITLE} tagline="See what a Traditional or Roth IRA could grow to by the year you retire — based on your contributions and expected return.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 35-year-old has $10,000 in a Roth IRA, plans to contribute $7,000 per year, expects 7% average annual return, and wants to retire at 65 (30 years)."
        steps={[
          { label: "Years to retirement (n)", value: "30" },
          { label: "Growth factor (1.07)^30", value: "7.6123" },
          { label: "Starting balance grown: 10,000 × 7.6123", value: "$76,123" },
          { label: "Annuity factor: (7.6123 − 1) / 0.07", value: "94.461" },
          { label: "Contributions grown: 7,000 × 94.461", value: "$661,226" },
          { label: "Total future value", value: "$737,349" },
        ]}
        result="At age 65, the projected Roth IRA balance is about $737,000. Because it's a Roth, qualified withdrawals after 59½ are tax-free — so this is close to what would be spendable."
      />

      <FormulaExplained
        plainEnglish="An IRA grows in two ways at once: your current balance keeps compounding, and each new contribution also compounds from the moment it's deposited. The future value formula adds both pieces together over your time horizon."
        formula={
          <span>
            FV = B × (1 + r)<sup>n</sup> + C × [(1 + r)<sup>n</sup> − 1] / r
            <br />
            B = current balance · C = annual contribution
            <br />
            r = expected annual return · n = years to retirement
          </span>
        }
        citation={{
          label: "IRS Publication 590-A — Contributions to Individual Retirement Arrangements (IRAs)",
          href: "https://www.irs.gov/publications/p590a",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're deciding whether to open a Traditional or Roth IRA and want to see long-run growth.",
          "You're already contributing and want to know if you're on track for your target retirement age.",
          "You're comparing different contribution amounts (e.g. $3,000 vs the $7,000 cap) to see the long-term impact.",
          "You're modeling different expected returns to stress-test your plan.",
          "You're teaching a child or partner how compounding works inside a tax-advantaged account.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming the projected balance is what you'll take home.", fix: "Traditional IRA withdrawals are taxed as ordinary income. Apply your expected retirement tax rate to estimate net spendable dollars." },
          { mistake: "Using an overly optimistic return rate.", fix: "Historical US stock returns average about 7% real (after inflation), but past performance does not guarantee future results. Try 5–7% for a realistic plan." },
          { mistake: "Ignoring the annual contribution cap.", fix: "The IRS limits IRA contributions ($7,000 in 2025, $8,000 if age 50+). Excess contributions trigger a 6% annual penalty until removed." },
          { mistake: "Confusing IRA limits with 401(k) limits.", fix: "401(k) limits are much higher ($23,500 in 2025). You can contribute to both an IRA and a workplace plan, subject to each plan's own rules." },
          { mistake: "Skipping income limits on Roth contributions.", fix: "If your modified AGI is above the phase-out range, you can't contribute directly to a Roth. Check IRS Publication 590-A or talk to a tax advisor." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Traditional IRA", definition: "Tax-deferred retirement account; contributions may be deductible, withdrawals are taxed as ordinary income." },
          { term: "Roth IRA", definition: "After-tax retirement account; qualified withdrawals after age 59½ are tax-free." },
          { term: "Compound growth", definition: "Earnings on earnings — interest, dividends, and gains that themselves earn returns over time." },
          { term: "MAGI", definition: "Modified Adjusted Gross Income — used to determine Roth IRA eligibility and deduction limits." },
          { term: "RMD", definition: "Required Minimum Distribution — the IRS-mandated yearly withdrawal from Traditional IRAs starting at age 73." },
          { term: "Catch-up contribution", definition: "An extra $1,000 annual IRA contribution allowed for people age 50 and older." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS Publication 590-A — Contributions to IRAs", href: "https://www.irs.gov/publications/p590a" },
          { label: "IRS Publication 590-B — Distributions from IRAs", href: "https://www.irs.gov/publications/p590b" },
          { label: "SEC Investor.gov — Individual Retirement Accounts (IRAs)", href: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/retirement-savings/individual" },
          { label: "U.S. Department of Labor — Saving Matters / Retirement Toolkit", href: "https://www.dol.gov/agencies/ebsa/key-topics/retirement-toolkit" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["savings-bond-calculator", "money-market-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
