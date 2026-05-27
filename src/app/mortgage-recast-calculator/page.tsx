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

const SLUG = "mortgage-recast-calculator";
const TITLE = "Mortgage Recast Calculator";
const DESC =
  "Estimate your new monthly payment and lifetime savings after a mortgage recast. Shows the math and the lender fee, free.";

const FAQS: FaqItem[] = [
  {
    question: "What are the downsides of a mortgage recast?",
    answer:
      "You give up liquid cash for a lower payment, the rate doesn't change, and the loan term doesn't shorten. If rates have fallen, refinancing usually saves more.",
  },
  {
    question: "What does Dave Ramsey say about recasting?",
    answer:
      "Ramsey generally favors paying down principal aggressively but isn't a strong public advocate for recasting specifically. He prefers an outright payoff or a 15-year refi when feasible.",
  },
  {
    question: "Is it hard to get a mortgage recast?",
    answer:
      "Eligibility is usually mechanical: a conforming conventional loan, current on payments, with a minimum lump sum (often $5,000–$10,000). FHA, VA, and most jumbos don't qualify.",
  },
  {
    question: "Is it better to recast or pay extra each month?",
    answer:
      "Extra payments shorten the term and reduce total interest more aggressively. A recast leaves the term unchanged but lowers your required monthly payment, freeing cash flow.",
  },
  {
    question: "How much does a recast cost?",
    answer:
      "Most servicers charge a flat fee of $150–$500. A few (notably some credit unions) waive it. Always confirm before sending the lump sum.",
  },
  {
    question: "Does recasting hurt my credit?",
    answer:
      "No. A recast is not a new loan and there's no hard credit pull. The original loan stays on your report with the same age.",
  },
  {
    question: "Which lenders allow mortgage recasts?",
    answer:
      "Major servicers including Chase, Wells Fargo, Bank of America, and Mr. Cooper typically allow recasts on conventional loans. Call your servicer first — eligibility and minimums vary.",
  },
  {
    question: "Can you recast an FHA or VA loan?",
    answer:
      "Generally no. FHA, VA, and USDA loans aren't eligible for recasts. Most jumbo and non-conforming loans also exclude recasting.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} (2026)`,
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
    { name: "Finance", path: "/" },
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
      name: "How to estimate savings from a mortgage recast",
      steps: [
        { name: "Get your current balance", text: "Check your most recent mortgage statement for the principal balance still owed." },
        { name: "Enter your rate and remaining term", text: "Use the APR and the number of years left on the loan." },
        { name: "Add the lump-sum prepayment", text: "This is the cash you'll send to the servicer alongside the recast request." },
        { name: "Compare payments and lifetime savings", text: "The calculator shows the old payment, the new payment, monthly savings, and net lifetime savings after the recast fee." },
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
        title="Mortgage Recast Calculator"
        tagline="See your new monthly payment and lifetime savings before you call your servicer."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You owe $300,000 on a 30-year mortgage at 6.50% with 28 years left. You inherit $50,000 and want to know what a recast would do to your payment."
        steps={[
          { label: "Current monthly payment (P=300,000, r=6.5%, n=336)", value: "$1,896.20" },
          { label: "Principal after lump sum (300,000 − 50,000)", value: "$250,000.00" },
          { label: "New monthly payment (P=250,000, r=6.5%, n=336)", value: "$1,580.17" },
          { label: "Monthly savings", value: "$316.03" },
          { label: "Lifetime savings (316.03 × 336 − 250 fee)", value: "$105,938.08" },
        ]}
        result="$316/month lower, ~$106k saved over the remaining 28 years."
      />

      <FormulaExplained
        plainEnglish="A recast keeps your interest rate and remaining term the same. It re-amortizes the lower balance, which lowers the required monthly payment. The standard amortization formula does the rest."
        formula={
          <span>
            M = P · [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
            <br />
            where P = new principal, r = monthly rate (APR / 12), n = months remaining.
          </span>
        }
        citation={{
          label: "Consumer Financial Protection Bureau — How loan amortization works",
          href: "https://www.consumerfinance.gov/owning-a-home/process/close/your-home-loan-toolkit/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You received a windfall (inheritance, bonus, home sale) and want lower monthly payments without refinancing.",
          "Rates have risen since you originated — refinancing into today's rate would be worse, but a recast at your existing rate still helps cash flow.",
          "You're approaching retirement and want a lower required payment for budgeting, while keeping the option to pay extra.",
          "You bought a new home before selling the old one and used a bridge loan; once the old home sells, recasting reduces the new mortgage.",
          "You want the payment reduction of a refi without paying 2–6% in closing costs.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming the rate or term changes after a recast.", fix: "Neither does. Only the principal (and therefore the required payment) changes. To change the rate, refinance." },
          { mistake: "Sending the lump sum without asking for the recast.", fix: "Servicers apply unscheduled payments to principal but won't re-amortize unless you explicitly request a recast and pay the fee." },
          { mistake: "Recasting an FHA, VA, or USDA loan.", fix: "These programs don't allow recasts. Refinance into a conventional loan first if eligible, then recast." },
          { mistake: "Ignoring the opportunity cost of the lump sum.", fix: "Compare the guaranteed return (your mortgage rate) against expected returns on the cash invested. A 6.5% mortgage is a tough benchmark, but not always the best move." },
          { mistake: "Forgetting the recast fee in the savings calculation.", fix: "The fee is small ($150–$500) but should be subtracted from gross savings to get the true number. The calculator above does this for you." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Principal", definition: "The remaining loan balance the interest is calculated against." },
          { term: "Amortization", definition: "The schedule that splits each payment between interest and principal over the loan's life." },
          { term: "APR", definition: "Annual Percentage Rate — the yearly cost of borrowing, including the interest rate plus most lender fees." },
          { term: "Reamortization", definition: "The recalculation of the monthly payment after a recast, refi, or other balance change." },
          { term: "Refinance", definition: "Replacing an existing mortgage with a new one — different rate, term, and closing costs. A recast does none of those things." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Consumer Financial Protection Bureau — Your Home Loan Toolkit", href: "https://www.consumerfinance.gov/owning-a-home/process/close/your-home-loan-toolkit/" },
          { label: "Investopedia — Mortgage Recast: How It Works", href: "https://www.investopedia.com/terms/m/mortgage-recast.asp" },
          { label: "Chase — Mortgage reamortization overview", href: "https://www.chase.com/personal/mortgage/education/managing/recast-mortgage" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed mortgage analyst" />

      <LastReviewed date="2026-05-27" />

      <RelatedCalculators
        slugs={[
          "dividend-calculator",
          "paycheck-calculator",
          "options-profit-calculator",
        ]}
      />
    </Container>
  );
}
