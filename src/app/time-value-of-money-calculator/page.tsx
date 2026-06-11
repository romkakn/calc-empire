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

const SLUG = "time-value-of-money-calculator";
const TITLE = "Time Value of Money Calculator";
const DESC =
  "Present value, future value, payment, rate, or periods. Standard TVM equation — solve any one unknown given the other four.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between present value and future value?",
    answer:
      "Present value (PV) is what a future amount is worth today; future value (FV) is what a present amount grows into later. They're two sides of the same compounding equation — discount with the rate to move backward, compound to move forward.",
  },
  {
    question: "Why does money have time value?",
    answer:
      "A dollar today can be invested and earn a return, so it's worth more than the same dollar received later. Inflation also chips away at purchasing power. The interest rate captures both effects in one number.",
  },
  {
    question: "What's the difference between an annuity and a lump sum?",
    answer:
      "A lump sum is one cash flow; an annuity is a series of equal payments over time. TVM handles both at once — the PMT input drives the annuity portion, while PV and FV drive the lump-sum portion.",
  },
  {
    question: "What does BGN vs END mode mean?",
    answer:
      "END (ordinary annuity) means each payment lands at the end of the period — common for mortgages and most loans. BGN (annuity due) means payments arrive at the start — common for rent and leases. BGN balances grow slightly larger because every payment earns one extra period of interest.",
  },
  {
    question: "How do I pick a discount rate?",
    answer:
      "Use the return you'd realistically earn on a similar-risk alternative. For personal savings, your high-yield account or bond rate is reasonable; for a business project, weighted-average cost of capital (WACC) is standard. Higher rates shrink present value.",
  },
  {
    question: "Is NPV the same as TVM?",
    answer:
      "Net present value (NPV) is one TVM application. NPV discounts an entire stream of uneven cash flows back to today and sums them. The TVM equation here assumes flat, equal payments — useful for loans, savings goals, and annuities, but not irregular project cash flows.",
  },
  {
    question: "Does the calculator handle negative cash flows?",
    answer:
      "Yes — use signs the way a financial calculator does. Money you pay out is negative; money you receive is positive. For a savings plan, PV (your deposit) and PMT are typically negative, FV positive.",
  },
  {
    question: "What if the interest rate is zero?",
    answer:
      "The formula simplifies to FV = PV + PMT × n. The calculator handles this edge case so you don't divide by zero. Useful for interest-free loans or pure savings without yield.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Solve PV, FV, PMT, Rate, or Periods`,
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
      name: "How to solve a time value of money problem",
      steps: [
        { name: "Pick the unknown", text: "Choose which variable you want to solve for: PV, FV, PMT, rate, or periods." },
        { name: "Enter the four knowns", text: "Fill in the other four TVM variables with the right signs (outflows negative, inflows positive)." },
        { name: "Choose payment timing", text: "END for ordinary annuities (loans), BGN for annuities due (rent, leases)." },
        { name: "Read the result", text: "The calculator applies the standard TVM equation and returns the unknown rounded to the appropriate precision." },
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

      <Hero title={TITLE} tagline="One equation, five variables. Pick the unknown, fill in the rest, and get an answer that matches a financial calculator.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You deposit $10,000 today into an account earning 5% per year, compounded annually, with no additional payments. What will it be worth in 10 years?"
        steps={[
          { label: "Formula: FV = PV × (1 + r)^n", value: "" },
          { label: "Plug in: 10,000 × (1.05)^10", value: "" },
          { label: "Compute (1.05)^10", value: "1.628895" },
          { label: "Multiply", value: "$16,288.95" },
          { label: "Rounded", value: "$16,289" },
        ]}
        result="$10,000 today at 5% for 10 years grows to approximately $16,289. That's $6,289 of interest on a $10,000 principal — the magic of compounding."
      />

      <FormulaExplained
        plainEnglish="The TVM equation ties together five variables: present value, future value, payment, periodic interest rate, and number of periods. Given any four, you can solve for the fifth. It's the backbone of mortgages, savings goals, retirement planning, and bond pricing."
        formula={
          <span>
            FV = PV × (1 + r)<sup>n</sup> + PMT × [(1 + r)<sup>n</sup> − 1] / r
            <br />
            For annuity due (BGN), multiply the PMT term by (1 + r).
            <br />
            When r = 0: FV = PV + PMT × n
          </span>
        }
        citation={{
          label: "SEC Investor.gov — Compound Interest Calculator and Time Value of Money",
          href: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're comparing a lump-sum offer today to a stream of payments later (lottery, settlement, pension buyout).",
          "You want to know how much to save monthly to hit a retirement target by a certain age.",
          "You're pricing a bond or fixed-income instrument by discounting its coupons and face value.",
          "You're a student in a finance, accounting, or CFA program checking textbook problem answers.",
          "You're evaluating a loan offer and want to see what rate is actually being charged given the payment, term, and amount financed.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing annual and monthly units.", fix: "If payments are monthly, use the monthly rate (annual / 12) and the total number of months. Consistency between r and n is the most common error." },
          { mistake: "Getting signs wrong.", fix: "Treat outflows (deposits, loan payments you make) as negative and inflows (loan proceeds, future withdrawals) as positive. Mixing signs randomly will produce nonsense answers." },
          { mistake: "Confusing nominal and effective rates.", fix: "A 6% APR compounded monthly is not the same as 6% annually. The effective annual rate is (1 + 0.06/12)^12 − 1 ≈ 6.17%." },
          { mistake: "Using END mode for rent or leases.", fix: "Rent and most leases are paid at the start of the period — that's BGN (annuity due). The difference compounds over long horizons." },
          { mistake: "Forgetting inflation.", fix: "Nominal TVM ignores purchasing power. For long horizons, also compute a real-dollar version using (1 + nominal) / (1 + inflation) − 1 as your rate." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Present Value (PV)", definition: "What a future cash amount is worth today, after discounting at a chosen rate." },
          { term: "Future Value (FV)", definition: "What a present amount will be worth at a future date after compounding." },
          { term: "Annuity", definition: "A series of equal cash flows over equal time intervals." },
          { term: "Discount Rate", definition: "The rate used to convert future cash flows into present value. Reflects risk and opportunity cost." },
          { term: "Compounding", definition: "Earning interest on previously earned interest. The engine behind long-term growth." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "SEC Investor.gov — Compound Interest Calculator", href: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
          { label: "SEC Investor.gov — Savings Goal Calculator", href: "https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator" },
          { label: "CFA Institute — The Time Value of Money (Refresher Reading)", href: "https://www.cfainstitute.org/insights/professional-learning/refresher-readings/time-value-money" },
          { label: "Bodie, Kane & Marcus — Investments (McGraw-Hill, 12th ed.)", href: "https://www.mheducation.com/highered/product/investments-bodie-kane/M9781260013832.html" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["money-market-calculator", "ira-calculator", "dividend-calculator"]} />
    </Container>
  );
}
