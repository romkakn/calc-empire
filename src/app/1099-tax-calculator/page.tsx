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

const SLUG = "1099-tax-calculator";
const TITLE = "1099 Tax Calculator";
const DESC =
  "Self-employment tax + federal income tax estimate for 1099 contractors. Quarterly estimates with 2025 brackets, SE deduction, and retirement contributions.";

const FAQS: FaqItem[] = [
  {
    question: "What is self-employment tax and how is it different from payroll tax?",
    answer:
      "Self-employment (SE) tax is the contractor version of FICA: 12.4% Social Security + 2.9% Medicare on 92.35% of net earnings. As a W-2 employee, your employer pays half. As a 1099 contractor, you pay both halves yourself — but you can deduct the employer half from your income tax.",
  },
  {
    question: "When are quarterly estimated taxes due?",
    answer:
      "Form 1040-ES payments are due April 15, June 15, September 15, and January 15 of the following year. If a date lands on a weekend or holiday, it shifts to the next business day. Skip a quarter and the IRS charges an underpayment penalty even if you square up in April.",
  },
  {
    question: "What is the safe-harbor rule?",
    answer:
      "You avoid the underpayment penalty if your quarterly payments cover at least 90% of this year's tax or 100% of last year's tax (110% if your prior-year AGI was over $150,000). Most contractors aim for the prior-year number because it's a fixed target.",
  },
  {
    question: "Should I open a Solo 401(k) or SEP-IRA?",
    answer:
      "Both let 1099 income reduce taxable income. A Solo 401(k) allows employee elective deferrals plus employer contributions, which often lets a single-person business put away more than a SEP-IRA at the same income level. A SEP-IRA is simpler paperwork. Talk to a CPA before choosing.",
  },
  {
    question: "Can I deduct a home office?",
    answer:
      "Yes, if a portion of your home is used regularly and exclusively for the business. The simplified method is $5 per square foot up to 300 sq ft ($1,500 cap). The actual-expense method prorates utilities, rent or mortgage interest, and depreciation by the office percentage.",
  },
  {
    question: "What 1099 write-offs do contractors miss most?",
    answer:
      "Health insurance premiums (above-the-line for self-employed), half of SE tax, the Qualified Business Income (QBI) deduction up to 20%, business mileage, software subscriptions, and a portion of phone and internet. Keep receipts and a mileage log.",
  },
  {
    question: "Do I owe state tax too?",
    answer:
      "Probably. Most states tax 1099 income at their regular rate; nine states currently have no income tax. This tool adds a flat state rate to your estimate — your actual state return may have its own brackets and credits.",
  },
  {
    question: "Does this calculator replace a CPA?",
    answer:
      "No. It estimates federal SE tax + federal income tax on a single 1099 income stream. Real returns involve credits, multi-state filing, depreciation, QBI phase-outs, and audit risk. Use this to plan quarterly payments — file with a professional.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Self-Employment + Federal Tax Estimate`,
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
      name: "How to estimate 1099 taxes for the year",
      steps: [
        { name: "Find net SE income", text: "Subtract business expenses (and any pre-tax retirement contributions) from gross 1099 income." },
        { name: "Compute SE tax", text: "Net SE income × 0.9235 × 15.3% = SE tax. Half of that is deductible from income tax." },
        { name: "Compute taxable income", text: "Net SE − half SE tax − standard deduction = taxable income. Apply 2025 federal brackets." },
        { name: "Divide by four", text: "Add state tax, then split the total into four quarterly Form 1040-ES payments." },
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

      <Hero title={TITLE} tagline="See your full 1099 tax bill — self-employment tax, federal income tax, and a quarterly estimate to send the IRS.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A single contractor earned $80,000 in 1099 income with $10,000 of business expenses. What's the SE tax bill?"
        steps={[
          { label: "Net SE income: $80,000 − $10,000", value: "$70,000" },
          { label: "Taxable SE base: $70,000 × 0.9235", value: "$64,645" },
          { label: "SE tax: $64,645 × 15.3%", value: "$9,893" },
          { label: "Half SE tax (deductible from income tax)", value: "$4,946" },
          { label: "Taxable income (single, $15,000 std deduction): $70,000 − $4,946 − $15,000", value: "$50,054" },
        ]}
        result="SE tax ≈ $9,893. The $4,946 half-SE-tax deduction lowers federal income tax owed on the remaining $50,054 of taxable income."
      />

      <FormulaExplained
        plainEnglish="A 1099 contractor owes two federal taxes: self-employment (SE) tax that funds Social Security and Medicare, plus regular income tax on profits. Run the SE math first, then deduct half of it before applying income brackets."
        formula={
          <span>
            Net SE = Gross 1099 − Expenses − Pre-tax retirement
            <br />
            SE tax = Net SE × 0.9235 × 15.3%
            <br />
            Taxable income = Net SE − ½ SE tax − Standard deduction
            <br />
            Total tax = SE tax + Federal income tax + (Net SE × State rate)
          </span>
        }
        citation={{
          label: "IRS Publication 334 — Tax Guide for Small Business",
          href: "https://www.irs.gov/publications/p334",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just took on your first 1099 client and need to know how much to set aside.",
          "You're planning the next quarterly Form 1040-ES payment and want to avoid the safe-harbor penalty.",
          "You're deciding whether to incorporate as an S-corp to lower the SE tax bite.",
          "You're sizing a Solo 401(k) or SEP-IRA contribution at year end.",
          "You're a recruiter or staffing agency explaining 1099 vs W-2 to candidates.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Calculating SE tax on gross 1099 income.", fix: "Subtract business expenses first, then multiply by 0.9235 before the 15.3% rate. Skipping the 0.9235 overstates the bill by ~7.65%." },
          { mistake: "Forgetting the half-SE-tax deduction.", fix: "Half of SE tax is an above-the-line deduction on Schedule 1 that lowers your income tax base. The calculator applies it automatically." },
          { mistake: "Spending the full 1099 deposit.", fix: "Move 25–35% of each payment into a tax-only account. Quarterly bills come whether or not the cash is there." },
          { mistake: "Skipping a quarterly payment.", fix: "Even if your April refund is huge, the IRS still charges an underpayment penalty for missed Q1–Q3. Pay something each quarter." },
          { mistake: "Ignoring state tax.", fix: "Most states tax 1099 income on top of federal. Add your state rate to the estimate — or talk to a local CPA in a high-tax state." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "SE tax", definition: "Self-employment tax — the 15.3% Social Security + Medicare bill that 1099 contractors pay on net earnings." },
          { term: "Form 1040-ES", definition: "Quarterly estimated tax voucher used to remit federal tax during the year." },
          { term: "Safe harbor", definition: "Rule that protects you from underpayment penalties if quarterly payments cover 90% of this year or 100/110% of last year." },
          { term: "QBI deduction", definition: "Qualified Business Income deduction — up to 20% of business profit, subject to phase-outs at higher incomes." },
          { term: "AGI", definition: "Adjusted Gross Income. The number federal tax brackets are applied against, after above-the-line deductions." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IRS Publication 334 — Tax Guide for Small Business", href: "https://www.irs.gov/publications/p334" },
          { label: "IRS Publication 535 — Business Expenses", href: "https://www.irs.gov/forms-pubs/about-publication-535" },
          { label: "IRS Form 1040-ES — Estimated Tax for Individuals", href: "https://www.irs.gov/forms-pubs/about-form-1040-es" },
          { label: "IRS Self-Employed Individuals Tax Center", href: "https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center" },
          { label: "SBA — Small Business Tax Information", href: "https://www.sba.gov/business-guide/manage-your-business/pay-taxes" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["paycheck-calculator", "agi-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
