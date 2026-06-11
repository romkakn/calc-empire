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

const SLUG = "agi-calculator";
const TITLE = "AGI Calculator";
const DESC =
  "Calculate Adjusted Gross Income from gross income and above-the-line deductions per IRS Form 1040. Free, instant, with worked examples.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between AGI, MAGI, and taxable income?",
    answer:
      "AGI is gross income minus above-the-line adjustments — it sits on Form 1040 line 11. MAGI adds certain items back (varies by provision, like student loan interest or foreign earned income). Taxable income is AGI minus the standard or itemized deduction and the QBI deduction.",
  },
  {
    question: "Why does AGI matter beyond the tax I owe?",
    answer:
      "AGI is the gatekeeper for many phase-outs and credits. The Child Tax Credit, education credits, IRA deductibility, and several itemized deduction floors all key off AGI or MAGI. A lower AGI can unlock benefits worth more than the deduction itself.",
  },
  {
    question: "What MAGI is used for Roth IRA contribution limits?",
    answer:
      "Roth MAGI starts with AGI and adds back the traditional IRA deduction, student loan interest deduction, foreign earned income exclusion, and a few less common items. The IRS publishes the phase-out ranges each year in Publication 590-A.",
  },
  {
    question: "How is ACA-subsidy MAGI defined?",
    answer:
      "ACA MAGI is AGI plus tax-exempt interest, non-taxable Social Security, and excluded foreign income. It's used to determine eligibility for premium tax credits on Marketplace plans.",
  },
  {
    question: "What's the difference between above-the-line and itemized deductions?",
    answer:
      "Above-the-line deductions (Schedule 1) reduce gross income to get AGI — you take them whether you itemize or not. Itemized deductions (Schedule A) come after AGI and only help if they exceed the standard deduction.",
  },
  {
    question: "Where do I find my AGI on a prior-year return?",
    answer:
      "On Form 1040, AGI is line 11. The IRS also uses prior-year AGI to verify your identity when you e-file.",
  },
  {
    question: "Does pre-tax 401(k) lower my AGI?",
    answer:
      "Indirectly — yes. Pre-tax 401(k) contributions are already excluded from W-2 box 1, so they never enter the gross income line. You don't claim them as an above-the-line deduction.",
  },
  {
    question: "Are HSA payroll deductions an above-the-line deduction?",
    answer:
      "No. Payroll-deducted HSA contributions (cafeteria plan) are already excluded from W-2 box 1. Only direct HSA contributions you made outside payroll go on Schedule 1.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Form 1040 Line 11 Worksheet`,
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
      name: "How to calculate Adjusted Gross Income",
      steps: [
        { name: "Add up gross income", text: "Wages from W-2 box 1, plus self-employment net profit, interest, dividends, and other taxable income." },
        { name: "List above-the-line adjustments", text: "Schedule 1 Part II: traditional IRA, HSA, half of SE tax, student loan interest, and pre-2019 alimony paid." },
        { name: "Subtract adjustments from gross income", text: "AGI = gross income − total Schedule 1 Part II adjustments." },
        { name: "Carry AGI to Form 1040 line 11", text: "Use this number as the base for MAGI calculations, phase-out checks, and the standard or itemized deduction." },
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

      <Hero title={TITLE} tagline="Find your Form 1040 line 11 in seconds — gross income minus the Schedule 1 adjustments that count.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A single filer earns $80,000 in W-2 wages, contributes $5,000 to a traditional IRA, $3,000 directly to an HSA, and pays $2,000 in student loan interest."
        steps={[
          { label: "Gross income (wages only)", value: "$80,000" },
          { label: "Traditional IRA deduction", value: "−$5,000" },
          { label: "HSA deduction (direct, not payroll)", value: "−$3,000" },
          { label: "Student loan interest (under $2,500 cap)", value: "−$2,000" },
          { label: "Total above-the-line adjustments", value: "−$10,000" },
          { label: "AGI (Form 1040 line 11)", value: "$70,000" },
        ]}
        result="AGI is $70,000. This figure flows to Form 1040 line 11 and becomes the base for MAGI-keyed phase-outs (Roth limits, education credits, ACA subsidies)."
      />

      <FormulaExplained
        plainEnglish="AGI is your total taxable income before the standard or itemized deduction, minus a small set of specific adjustments listed on Schedule 1 Part II. It's the single most-referenced number on your return — many credit and deduction phase-outs key off AGI or its modified cousin (MAGI)."
        formula={
          <span>
            AGI = gross_income − above_the_line_adjustments
            <br />
            Adjustments (Schedule 1 Part II) = traditional IRA + HSA + ½ SE tax + student loan interest (≤ $2,500) + pre-2019 alimony paid + …
            <br />
            Carry AGI to Form 1040 line 11.
          </span>
        }
        citation={{
          label: "IRS — About Form 1040, U.S. Individual Income Tax Return",
          href: "https://www.irs.gov/forms-pubs/about-form-1040",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're about to file and want to sanity-check your AGI before e-signing.",
          "You're deciding between traditional and Roth IRA, and need MAGI for the contribution limit.",
          "You're shopping the ACA Marketplace and need MAGI for the premium tax credit.",
          "You're applying for student aid (FAFSA), which keys off prior-year AGI.",
          "You're planning year-end moves (HSA top-up, IRA contribution) to drop into a phase-out band.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Double-counting pre-tax 401(k) as an above-the-line deduction.", fix: "Pre-tax 401(k) is already excluded from W-2 box 1. Don't subtract it again." },
          { mistake: "Subtracting payroll-deducted HSA contributions on Schedule 1.", fix: "Cafeteria-plan HSA contributions are already excluded from wages. Only direct contributions go on Schedule 1." },
          { mistake: "Treating the full self-employment tax as an adjustment.", fix: "Only half of SE tax is deductible. Schedule SE line 13 carries the right number to Schedule 1." },
          { mistake: "Claiming more than $2,500 of student loan interest.", fix: "The deduction is capped at $2,500 per return and phases out at higher MAGI. /* TODO_VERIFY: cap and phase-out for tax year 2025 — IRS Topic 456 */" },
          { mistake: "Confusing AGI with taxable income.", fix: "AGI is before the standard or itemized deduction and before QBI. Taxable income comes after." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gross income", definition: "All taxable income before any deductions — wages, business net, interest, dividends, capital gains, etc." },
          { term: "Above-the-line deduction", definition: "Schedule 1 Part II adjustment that reduces gross income to get AGI." },
          { term: "MAGI (Modified AGI)", definition: "AGI with certain items added back. The exact add-backs depend on which provision is testing eligibility." },
          { term: "Schedule 1", definition: "Form 1040 attachment. Part I lists extra income; Part II lists above-the-line adjustments." },
          { term: "Form 1040 line 11", definition: "The line where AGI is reported on the federal return." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS — About Form 1040 and instructions", href: "https://www.irs.gov/forms-pubs/about-form-1040" },
          { label: "IRS Publication 17 — Your Federal Income Tax", href: "https://www.irs.gov/publications/p17" },
          { label: "IRS Topic 451 — Individual Retirement Arrangements (IRAs) modified AGI", href: "https://www.irs.gov/taxtopics/tc451" },
          { label: "IRS Publication 590-A — Contributions to IRAs (Roth MAGI tables)", href: "https://www.irs.gov/publications/p590a" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["1099-tax-calculator", "paycheck-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
