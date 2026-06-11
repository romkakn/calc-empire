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

const SLUG = "percent-decrease-calculator";
const TITLE = "Percent Decrease Calculator";
const DESC =
  "Percent decrease (or increase) between two numbers. Shows absolute change too, with both relative and dollar-style differences.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between percent decrease and percent increase?",
    answer:
      "Both use the same formula: (new − old) / old × 100. If the answer is negative, the value went down — that's a percent decrease. If positive, it went up — a percent increase. The size of the change is the absolute value, and the sign tells you the direction.",
  },
  {
    question: "What's the difference between percentage points and percent?",
    answer:
      "Percentage points measure the raw gap between two percentages — going from 5% to 7% is a 2 percentage-point rise. Percent change measures the relative gap — going from 5% to 7% is a 40% increase. Mixing the two is a common reporting error.",
  },
  {
    question: "What if the original value is zero?",
    answer:
      "Percent change is undefined when the denominator is zero. You can't divide by zero, and there's no meaningful baseline to compare against. Report the absolute change instead, or pick a different reference point.",
  },
  {
    question: "How do I calculate a sale price discount?",
    answer:
      "Subtract the sale price from the original, divide by the original, and multiply by 100. A shirt marked down from $40 to $30 is a $10 absolute drop and a 25% decrease. Most retailers display the percent number on the tag.",
  },
  {
    question: "How do I figure out percent weight loss?",
    answer:
      "Divide the pounds (or kilograms) lost by the starting weight, then multiply by 100. Losing 15 lb from a 200 lb start is a 7.5% decrease. Use the same starting weight as the baseline if you want consistent week-over-week numbers.",
  },
  {
    question: "What's the difference between absolute change and relative change?",
    answer:
      "Absolute change is the raw difference: new minus old, in the original units. Relative change scales that difference against the starting value, expressed as a percent. A $5 drop from $10 is 50%, but a $5 drop from $500 is only 1% — same absolute, very different relative.",
  },
  {
    question: "Why does a percent decrease followed by the same percent increase not return the original?",
    answer:
      "Because the second percentage is taken from a smaller base. A 20% drop from $100 gives $80, and a 20% rise from $80 only reaches $96, not $100. To fully undo a 20% drop you need a 25% rise.",
  },
  {
    question: "Can the percent decrease exceed 100%?",
    answer:
      "Not for a true decrease — losing more than 100% would push the value below zero, which doesn't make sense for things like prices or quantities. Percent increases, on the other hand, can go past 100% without limit.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Old vs New Value Change`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Math", path: "/math" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "math", description: DESC }),
    howToSchema({
      name: "How to calculate percent decrease between two numbers",
      steps: [
        { name: "Find the difference", text: "Subtract the original value from the new value: new − old." },
        { name: "Divide by the original", text: "Take that difference and divide by the original value (not the new one)." },
        { name: "Multiply by 100", text: "Convert the decimal to a percentage. A negative result means a decrease; positive means an increase." },
        { name: "Check the sign", text: "Report the absolute size as the percent change, and use the sign to label it as a decrease or increase." },
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

      <Hero title={TITLE} tagline="Compare an old value to a new one. Get the percent change, the direction, and the raw absolute difference in one place.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A jacket was originally priced at $120 and is now on sale for $90. What's the percent decrease and the absolute drop?"
        steps={[
          { label: "Formula: percent change = (new − old) / old × 100", value: "" },
          { label: "Difference: 90 − 120", value: "−30" },
          { label: "Divide by original: −30 / 120", value: "−0.25" },
          { label: "Multiply by 100", value: "−25%" },
          { label: "Absolute change", value: "$30" },
        ]}
        result="The jacket dropped by 25% — a $30 absolute decrease from the $120 starting price."
      />

      <FormulaExplained
        plainEnglish="Percent change measures how far a new value sits from an old one, scaled against the original. The sign tells you the direction: negative means a decrease, positive means an increase. The absolute change is the raw difference in the original units, without any scaling."
        formula={
          <span>
            percent change = (new − old) / old × 100
            <br />
            absolute change = new − old
            <br />
            decrease when result {"<"} 0 · increase when result {">"} 0
          </span>
        }
        citation={{
          label: "Khan Academy — Percent word problems (Arithmetic)",
          href: "https://www.khanacademy.org/math/arithmetic/arith-review-decimals/arith-review-percent-word-problems/v/percent-word-problems-1",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're comparing a sale price to the original tag and want the percent off in one shot.",
          "You're tracking weight, miles, or any metric week-over-week and need the relative change.",
          "You're reviewing a budget line that dropped and want both the dollar figure and the percentage.",
          "You're a student checking a homework answer against the standard formula.",
          "You're writing a report and need to clearly separate absolute change from percent change.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Dividing by the new value instead of the original.", fix: "The denominator is always the starting (old) value. Swapping it flips the size of the change and can mislead the reader." },
          { mistake: "Reporting a percent change when the original is zero.", fix: "Percent change is undefined at a zero baseline. Report the absolute change or note the baseline issue." },
          { mistake: "Confusing percentage points with percent.", fix: "Going from 5% to 7% is a 2 percentage-point rise but a 40% relative increase. Label which one you mean." },
          { mistake: "Assuming a 20% drop is undone by a 20% rise.", fix: "It isn't — the rise applies to a smaller base. A 20% drop needs a 25% rise to recover; a 50% drop needs a 100% rise." },
          { mistake: "Dropping the sign and calling every change a decrease.", fix: "Compute the signed value first, then label as decrease (negative) or increase (positive). The sign carries the meaning." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Percent change", definition: "Signed relative difference: (new − old) / old × 100. Negative for a decrease, positive for an increase." },
          { term: "Absolute change", definition: "Raw difference between two values in their original units, with no scaling." },
          { term: "Percentage point", definition: "The arithmetic gap between two percentages, not a relative change." },
          { term: "Baseline", definition: "The starting (old) value used as the denominator of percent change." },
          { term: "Relative change", definition: "Any change expressed as a fraction of a reference value, usually shown as a percentage." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Percent word problems", href: "https://www.khanacademy.org/math/arithmetic/arith-review-decimals/arith-review-percent-word-problems/v/percent-word-problems-1" },
          { label: "OpenStax — Prealgebra 2e (Chapter 6: Percents)", href: "https://openstax.org/books/prealgebra-2e/pages/6-introduction" },
          { label: "U.S. Bureau of Labor Statistics — Handbook of Methods: CPI calculation", href: "https://www.bls.gov/opub/hom/cpi/calculation.htm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["percent-off-calculator", "percent-error-calculator", "discount-calculator"]} />
    </Container>
  );
}
