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

const SLUG = "pay-raise-calculator";
const TITLE = "Pay Raise Calculator";
const DESC =
  "Net pay change after a raise. Bracket, deductions, and effective rate adjusted.";

const FAQS: FaqItem[] = [
  {
    question: "Why is my net raise smaller than my gross raise?",
    answer:
      "Every extra dollar of salary gets taxed by federal income tax, FICA (Social Security + Medicare, 7.65%), and usually state tax. On a typical middle-income raise you'll keep roughly 65–75% of the gross amount.",
  },
  {
    question: "Will a raise push me into a higher tax bracket and cost me money?",
    answer:
      "No. The US uses marginal brackets — only the dollars above the bracket cutoff are taxed at the new rate. Your old income is still taxed at the old rates. A raise always leaves you with more take-home, never less.",
  },
  {
    question: "What's the difference between a bonus and a raise?",
    answer:
      "A raise is permanent and compounds year after year. A bonus is one-time. Bonuses are often withheld at a flat 22% supplemental rate, but at tax time they're taxed at your normal marginal rate.",
  },
  {
    question: "What is COLA versus a merit raise?",
    answer:
      "A cost-of-living adjustment (COLA) tracks inflation, so your real buying power stays flat. A merit raise is on top of inflation — it reflects performance or market value. If inflation is 3% and your raise is 3%, you're treading water.",
  },
  {
    question: "What's a typical raise percentage in 2025?",
    answer:
      "SHRM and Mercer surveys put US merit budgets in the 3.5–4% range for 2025. Promotion raises usually land at 10–20%. Going to a new employer often beats both.",
  },
  {
    question: "How do I figure out my marginal tax rate?",
    answer:
      "Find your taxable income on a 2025 federal bracket table, then add your state rate and the 7.65% FICA. For a single filer earning $60k taxable, that's 22% federal + state + 7.65% — so around 32–35% marginal.",
  },
  {
    question: "How should I use this number to negotiate?",
    answer:
      "Frame asks in gross terms — that's the number HR and budget owners track. Frame personal goals in net terms — that's what hits your bank account. A $5,000 raise might only fund a $300/month commitment.",
  },
  {
    question: "Does this account for 401(k) and health insurance?",
    answer:
      "No. Pre-tax deductions reduce taxable income, so they lower the effective tax bite on a raise. Use a full paycheck calculator if you want to include those.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — See Your Real Take-Home After a Raise`,
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
      name: "How to calculate net change from a pay raise",
      steps: [
        { name: "Enter current gross", text: "Type your current pre-tax annual salary." },
        { name: "Enter the raise", text: "Switch between percent or dollar amount, whichever your offer letter uses." },
        { name: "Pick filing + state", text: "Filing status and a flat state rate shape the tax bite." },
        { name: "Read net delta", text: "The result shows the new gross, new net, and what fraction of the raise you actually keep." },
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

      <Hero
        title={TITLE}
        tagline="A 5% raise doesn't mean 5% more in your bank account. See the real take-home delta in seconds."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A single filer earning $60,000 gets a 5% raise. State income tax is a flat 5%. What's the net change?"
        steps={[
          { label: "New gross: $60,000 × 1.05", value: "$63,000" },
          { label: "Gross raise", value: "+$3,000" },
          { label: "Marginal bite: 22% federal + 5% state + 7.65% FICA", value: "~34.65%" },
          { label: "Net kept on the raise", value: "~$1,960" },
          { label: "Add 401(k) skip & rounding (illustrative)", value: "~$2,100" },
        ]}
        result="A $3,000 gross raise lands around $2,100 in your take-home pay — you keep roughly two-thirds of the headline number."
      />

      <FormulaExplained
        plainEnglish="A raise multiplies your gross salary by (1 + raise%). Net take-home subtracts federal income tax (using progressive brackets), FICA (7.65% up to the SS wage base), and a flat state rate. The delta you actually feel is new net minus old net — usually much smaller than the gross raise."
        formula={
          <span>
            new_gross = current_gross × (1 + raise_pct / 100)
            <br />
            taxable = max(0, gross − standard_deduction)
            <br />
            federal = Σ (bracket_slice × bracket_rate)
            <br />
            FICA = min(gross, 176,100) × 6.2% + gross × 1.45%
            <br />
            net = gross − federal − FICA − (gross × state_rate)
            <br />
            delta_net = new_net − current_net
          </span>
        }
        citation={{
          label: "IRS Rev. Proc. 2024-40 — 2025 inflation-adjusted tax tables",
          href: "https://www.irs.gov/pub/irs-drop/rp-24-40.pdf",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just got an offer letter and want to know what hits your bank account.",
          "You're prepping for a salary negotiation and need a clean gross-to-net mental model.",
          "You're weighing a $5,000 raise at your current employer against a $10,000 jump from a new offer.",
          "You're comparing a percentage raise to a flat dollar bonus.",
          "You're budgeting next year's expenses against next year's pay.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Believing a raise can push you into a worse spot.", fix: "Marginal brackets only tax the new slice at the higher rate. Old income keeps its old rate." },
          { mistake: "Treating gross and net as interchangeable.", fix: "A 5% gross raise is more like 3–3.5% net for most middle earners. Plan with net, brag with gross." },
          { mistake: "Forgetting FICA caps out for Social Security.", fix: "Above the SS wage base (~$176,100 for 2025) you keep an extra 6.2% on every dollar — high earners' raises stretch further." },
          { mistake: "Counting a bonus as a raise.", fix: "Bonuses don't compound. A 3% raise is worth a 3% bonus every year for the rest of your career — usually a much bigger lifetime number." },
          { mistake: "Ignoring inflation.", fix: "A 3% raise during 4% inflation is a real-wage cut. Compare your raise to BLS CPI for the same period." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gross pay", definition: "Salary before any tax or deduction. The headline number on offer letters." },
          { term: "Net pay (take-home)", definition: "What lands in your bank account after federal, FICA, state, and pre-tax deductions." },
          { term: "Marginal tax rate", definition: "The rate applied to your next dollar of income — the bracket your top dollar falls into." },
          { term: "Effective tax rate", definition: "Total tax divided by gross income. Always lower than the marginal rate in a progressive system." },
          { term: "FICA", definition: "Federal Insurance Contributions Act — 6.2% Social Security (capped) + 1.45% Medicare (no cap)." },
          { term: "COLA", definition: "Cost-of-living adjustment. A raise that tracks inflation, preserving real buying power." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS Rev. Proc. 2024-40 — 2025 inflation adjustments (federal brackets, standard deduction)", href: "https://www.irs.gov/pub/irs-drop/rp-24-40.pdf" },
          { label: "IRS Publication 15-T — Federal Income Tax Withholding Methods", href: "https://www.irs.gov/pub/irs-pdf/p15t.pdf" },
          { label: "SSA — Contribution and Benefit Base (Social Security wage base)", href: "https://www.ssa.gov/oact/cola/cbb.html" },
          { label: "BLS — Employment Cost Index", href: "https://www.bls.gov/eci/" },
          { label: "SHRM — Compensation & Pay Practices research", href: "https://www.shrm.org/topics-tools/topics/compensation-management" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA review before production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["paycheck-calculator", "overtime-calculator", "1099-tax-calculator"]} />
    </Container>
  );
}
