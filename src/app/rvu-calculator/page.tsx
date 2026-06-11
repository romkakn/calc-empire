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

const SLUG = "rvu-calculator";
const TITLE = "RVU Calculator";
const DESC =
  "Convert Medicare RVUs to dollars. Work, PE, and MP RVUs combined with locality GPCIs and the annual conversion factor.";

const FAQS: FaqItem[] = [
  {
    question: "What do RVUs measure?",
    answer:
      "Relative Value Units (RVUs) measure the resources a clinician uses to deliver a CPT-coded service. Medicare assigns three components — physician work, practice expense, and malpractice — that together drive the payment.",
  },
  {
    question: "What's the difference between Work, PE, and MP RVUs?",
    answer:
      "Work RVUs (wRVU) reflect the clinician's time, skill, and effort. Practice Expense (PE) covers staff, supplies, and equipment. Malpractice (MP) covers professional liability insurance. The three RVUs are added together after locality adjustment.",
  },
  {
    question: "What is a GPCI?",
    answer:
      "Geographic Practice Cost Index. CMS publishes a wGPCI, peGPCI, and mpGPCI per locality so that payments reflect the cost of doing business in that area. A GPCI of 1.0 means national average; higher than 1.0 means above average.",
  },
  {
    question: "How often does the conversion factor change?",
    answer:
      "The Medicare Physician Fee Schedule conversion factor is updated each calendar year by CMS through the Final Rule, usually published in November. Mid-year congressional adjustments also happen — always confirm the rate in effect on the date of service.",
  },
  {
    question: "What is a typical wRVU productivity benchmark?",
    answer:
      "MGMA publishes annual wRVU benchmarks by specialty and percentile. Median ranges vary widely — primary care often falls near 4,500–5,500 wRVU per year while procedural specialties can exceed 8,000. Use your own specialty's MGMA percentile, not a generic average.",
  },
  {
    question: "How does RVU-based pay compare to capitation?",
    answer:
      "RVU compensation pays per unit of work produced, rewarding volume and complexity. Capitation pays a fixed amount per patient per month regardless of services delivered. Many group practices use a blend so clinicians share both productivity and value-based incentives.",
  },
  {
    question: "Are facility and non-facility RVUs different?",
    answer:
      "Yes. CMS publishes separate PE RVUs for facility (hospital outpatient) and non-facility (office) settings because overhead differs. Pick the setting that matches where the service was rendered.",
  },
  {
    question: "Does this calculator give a final Medicare payment?",
    answer:
      "It estimates the allowed amount under the Physician Fee Schedule. Actual payment can differ due to modifiers, sequestration, MIPS adjustments, deductible status, and secondary insurance.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Medicare RVU to Dollars`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "health", description: DESC }),
    howToSchema({
      name: "How to calculate a Medicare RVU payment",
      steps: [
        { name: "Look up the CPT code's RVUs", text: "Get the Work, Practice Expense, and Malpractice RVUs from the CMS Physician Fee Schedule lookup tool for the code you're billing." },
        { name: "Find your locality's GPCIs", text: "Pull the wGPCI, peGPCI, and mpGPCI for the locality where the service was rendered (defaults to 1.0 if national)." },
        { name: "Apply the formula", text: "Payment = (wRVU × wGPCI + peRVU × peGPCI + mpRVU × mpGPCI) × Conversion Factor." },
        { name: "Use the current conversion factor", text: "For 2025 the Medicare CF is approximately $32.35. Confirm the rate in effect on your date of service." },
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

      <Hero title={TITLE} tagline="Convert Medicare RVUs into a dollar payment using the published conversion factor and your locality GPCIs.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A clinician bills a CPT code with 2.5 work RVUs, 1.2 PE RVUs, and 0.2 MP RVUs. The locality GPCIs are all 1.0 (national average) and the 2025 conversion factor is $32.35."
        steps={[
          { label: "Formula: (wRVU × wGPCI + peRVU × peGPCI + mpRVU × mpGPCI) × CF", value: "" },
          { label: "Sum adjusted RVUs: 2.5 × 1.0 + 1.2 × 1.0 + 0.2 × 1.0", value: "3.9" },
          { label: "Multiply by CF: 3.9 × $32.35", value: "$126.165" },
          { label: "Rounded", value: "$126.17" },
        ]}
        result="Total Medicare allowed amount ≈ $126.17 for this CPT code at the national rate."
      />

      <FormulaExplained
        plainEnglish="Medicare pays physicians using a formula that converts three relative value components into dollars. Each component is multiplied by a geographic cost adjustment, summed, and then multiplied by an annual conversion factor."
        formula={
          <span>
            Payment = (wRVU × wGPCI + peRVU × peGPCI + mpRVU × mpGPCI) × CF
            <br />
            2025 CF ≈ $32.35
            <br />
            wRVU portion is typically the largest of the three components for most CPT codes
          </span>
        }
        citation={{
          label: "CMS — Medicare Physician Fee Schedule (PFS) Look-Up Tool",
          href: "https://www.cms.gov/medicare/physician-fee-schedule/search",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're a practice manager modeling expected Medicare reimbursement for a new service line.",
          "You're a physician negotiating compensation and want to translate wRVU targets into dollars.",
          "You're a coder or biller estimating allowed amounts before claims are submitted.",
          "You're a residency or fellowship trainee learning how the Medicare PFS works.",
          "You're a health system finance analyst comparing payment across CPT codes or localities.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using last year's conversion factor.", fix: "CMS updates the CF every January. Check the current rate at the CMS Physician Fee Schedule page before quoting payment." },
          { mistake: "Mixing facility and non-facility PE RVUs.", fix: "Hospital outpatient (facility) and office (non-facility) PE values differ. Use the value matching the place of service." },
          { mistake: "Assuming all GPCIs equal 1.0.", fix: "GPCIs vary by locality — high-cost metros can exceed 1.10. Pull the published GPCI for your locality each year." },
          { mistake: "Forgetting modifiers and adjustments.", fix: "Sequestration, MIPS, multiple-procedure reductions, and bilateral modifiers all change the final paid amount." },
          { mistake: "Comparing wRVU productivity across specialties.", fix: "MGMA benchmarks are specialty-specific. A 50th-percentile cardiologist and 50th-percentile pediatrician produce very different wRVU totals." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "wRVU", definition: "Work RVU — the clinician-effort portion of a CPT code's value." },
          { term: "PE RVU", definition: "Practice Expense RVU — staff, supplies, rent, and equipment." },
          { term: "MP RVU", definition: "Malpractice RVU — professional liability insurance cost." },
          { term: "GPCI", definition: "Geographic Practice Cost Index — locality cost adjustment by CMS." },
          { term: "Conversion Factor", definition: "Dollar multiplier set annually in the Medicare PFS Final Rule." },
          { term: "RBRVS", definition: "Resource-Based Relative Value Scale — the system that produces RVU values." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "CMS — Physician Fee Schedule Look-Up Tool", href: "https://www.cms.gov/medicare/physician-fee-schedule/search" },
          { label: "CMS — Medicare Physician Fee Schedule overview", href: "https://www.cms.gov/medicare/payment/fee-schedules/physician" },
          { label: "AMA — RBRVS overview", href: "https://www.ama-assn.org/practice-management/cpt/rbrvs-overview" },
          { label: "MGMA — Provider Compensation and Productivity Data", href: "https://www.mgma.com/data/data-dive/provider-compensation-and-productivity" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or practice-management CPA) for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["1099-tax-calculator", "overtime-calculator", "paycheck-calculator"]} />
    </Container>
  );
}
