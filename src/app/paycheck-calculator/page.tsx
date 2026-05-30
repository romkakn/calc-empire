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

const SLUG = "paycheck-calculator";
const TITLE = "Paycheck Calculator";
const DESC =
  "Estimate your take-home pay after federal, FICA, state, and pre-tax deductions. Shows where each dollar of your gross goes.";

const FAQS: FaqItem[] = [
  {
    question: "How is federal income tax withholding calculated?",
    answer:
      "Employers use IRS Publication 15-T's percentage method on your annualised wages, then divide by your pay frequency. The result depends on filing status, pre-tax deductions, and any extra withholding you requested on the W-4.",
  },
  {
    question: "What is FICA?",
    answer:
      "FICA is the combined Social Security (6.2% up to the annual wage base) and Medicare (1.45%, plus an extra 0.9% on income over $200k single / $250k joint) payroll taxes.",
  },
  {
    question: "Why is my take-home pay less than my gross?",
    answer:
      "Three groups of deductions: pre-tax (401(k), HSA, health premiums), taxes (federal, FICA, state, sometimes local), and post-tax (Roth contributions, garnishments, life insurance). The calculator separates each.",
  },
  {
    question: "Does this calculator handle state taxes?",
    answer:
      "This preview uses a single flat-rate field for state withholding. The production version uses per-state brackets — see the state pages at /paycheck-calculator-<state>.",
  },
  {
    question: "How do I lower my federal tax withholding?",
    answer:
      "Increase pre-tax contributions (401(k), HSA), or update your W-4 to claim dependents or other adjustments. Don't over-withhold just to get a refund — it's an interest-free loan to the IRS.",
  },
  {
    question: "What's the difference between gross and net?",
    answer:
      "Gross is what you earn before deductions. Net (take-home) is what hits your bank account after taxes and deductions.",
  },
  {
    question: "Are bonuses taxed differently?",
    answer:
      "Bonuses are taxed as supplemental wages. Most employers apply a flat 22% federal withholding (37% above $1M). The actual tax at year-end is your normal rate — any over-withholding comes back as a refund.",
  },
  {
    question: "How accurate is this calculator?",
    answer:
      "Federal and FICA are exact for the inputs you provide. State is an estimate at the flat rate you enter; per-state brackets are coming in the state-specific pages. Local taxes and Roth contributions aren't modeled in this preview.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Federal Preview (2025/2026)`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `/${SLUG}`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Payroll", path: "/payroll" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({
      name: TITLE,
      slug: SLUG,
      category: "payroll",
      description: DESC,
    }),
    howToSchema({
      name: "How to estimate take-home pay",
      steps: [
        {
          name: "Enter gross pay and pay frequency",
          text: "Use the amount from a recent pay stub before any deductions, and pick how often you're paid.",
        },
        {
          name: "Pick filing status",
          text: "Single, married filing jointly, or head of household. This sets the federal bracket the percentage method uses.",
        },
        {
          name: "Enter pre-tax deductions",
          text: "401(k), HSA, and other pre-tax items reduce the wages federal income tax is calculated on.",
        },
        {
          name: "Add state rate and any extra withholding",
          text: "Use your state's effective rate, and any W-4 line 4c extra withholding you requested.",
        },
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
        title="Paycheck Calculator"
        tagline="See your take-home pay and where every dollar of your gross goes — federal, FICA, state, and pre-tax."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A single filer earning $2,500 bi-weekly ($65,000/yr), $150/period to a 401(k), no HSA, 5% flat state rate."
        steps={[
          { label: "Annual gross (2,500 × 26)", value: "$65,000.00" },
          { label: "Annual 401(k) (150 × 26)", value: "$3,900.00" },
          { label: "Federal taxable (65,000 − 3,900)", value: "$61,100.00" },
          { label: "Federal income tax (2025 single percentage method)", value: "$6,948.50" },
          { label: "Social Security (6.2% × 65,000)", value: "$4,030.00" },
          { label: "Medicare (1.45% × 65,000)", value: "$942.50" },
          { label: "State (5% × 61,100)", value: "$3,055.00" },
          { label: "Take-home annual", value: "$46,124.00" },
          { label: "Take-home per period", value: "$1,773.99" },
        ]}
        result="$1,774 every two weeks; ~23% effective tax rate (a third of gross goes to taxes + 401(k))."
      />

      <FormulaExplained
        plainEnglish="Take-home is gross minus pre-tax deductions, minus federal income tax (computed on the reduced wages), minus FICA (Social Security 6.2% up to the wage base, plus Medicare 1.45% plus 0.9% above the high-earner threshold), minus state and any post-tax deductions."
        formula={
          <span>
            net = gross − pre-tax − federalWH(gross − pre-tax) − FICA(gross) − state(taxable) − post-tax
            <br />
            federalWH uses IRS Pub 15-T percentage-method brackets per filing status.
          </span>
        }
        citation={{
          label: "IRS Publication 15-T — Federal Income Tax Withholding Methods",
          href: "https://www.irs.gov/pub/irs-pdf/p15t.pdf",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're negotiating a salary and want to know the real take-home difference between two offers.",
          "You're considering increasing your 401(k) and want to see how much your paycheck actually shrinks.",
          "You moved states and need to re-estimate your withholding before updating your W-4 with the new employer.",
          "You took on a side job and want to gauge how much extra federal withholding (W-4 4c) to add to avoid an April surprise.",
          "You're budgeting for a mortgage and the lender is asking for take-home, not gross.",
        ]}
      />

      <CommonMistakes
        items={[
          {
            mistake: "Using gross pay in monthly budgeting.",
            fix: "Always use take-home (net). Gross overstates what's available by 20–35%.",
          },
          {
            mistake: "Forgetting that pre-tax deductions reduce federal taxable wages.",
            fix: "A 401(k) at 6% doesn't cut your paycheck by 6% — federal tax savings claw some of it back.",
          },
          {
            mistake: "Ignoring FICA's wage base and additional Medicare tax.",
            fix: "Social Security stops once you cross the 2025 wage base ($176,100). Above $200k single / $250k joint, an extra 0.9% Medicare kicks in.",
          },
          {
            mistake: "Treating bonus withholding as your final tax.",
            fix: "Bonus withholding is a flat 22% rate, not your real bracket. Year-end reconciliation refunds any over-withholding.",
          },
          {
            mistake: "Comparing nominal salaries across states without adjusting for state tax.",
            fix: "A $100k offer in TX nets meaningfully more than the same offer in CA. Always run both through the calculator.",
          },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gross pay", definition: "Total earnings before any deductions or taxes." },
          { term: "Net pay", definition: "Take-home — what lands in your bank account after deductions." },
          { term: "FICA", definition: "Federal Insurance Contributions Act — Social Security plus Medicare payroll taxes." },
          { term: "W-4", definition: "The IRS form telling your employer how much federal tax to withhold." },
          { term: "Pre-tax vs post-tax", definition: "Pre-tax deductions (401(k), HSA) reduce taxable wages; post-tax (Roth, garnishments) come out of after-tax pay." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS Publication 15-T (2025) — Federal Income Tax Withholding Methods", href: "https://www.irs.gov/pub/irs-pdf/p15t.pdf" },
          { label: "Social Security Administration — 2025 Cost-of-Living Adjustments + wage base", href: "https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf" },
          { label: "IRS — Topic 751: Social Security and Medicare Withholding Rates", href: "https://www.irs.gov/taxtopics/tc751" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA reviewer for production" />

      <LastReviewed date="2026-05-27" />

      <RelatedCalculators
        slugs={[
          "mortgage-recast-calculator",
          "dividend-calculator",
          "no-vig-calculator",
        ]}
      />
    </Container>
  );
}
