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

const SLUG = "long-division-calculator";
const TITLE = "Long Division Calculator";
const DESC =
  "Divide one integer by another and see the full long-division steps: quotient, remainder, and each bring-down and subtraction.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between long division and short division?",
    answer:
      "Long division writes out every subtraction and bring-down on the page, so each step is visible. Short division keeps the same logic but tracks the carry mentally and only writes the running quotient on top.",
  },
  {
    question: "When should I use long division?",
    answer:
      "Use it when the divisor is large enough that you cannot divide in your head, or when a teacher or test asks you to show your work. It is also the easiest method to spot a mistake in, because every partial step is written down.",
  },
  {
    question: "How do I divide a decimal with long division?",
    answer:
      "Multiply both the dividend and divisor by the same power of ten until the divisor is a whole number, then divide normally. Place the decimal point in the quotient directly above its new position in the dividend.",
  },
  {
    question: "How does dividing by a two-digit number work?",
    answer:
      "The algorithm is the same, but at each step you estimate how many times the two-digit divisor fits the current chunk. A quick way is to round the divisor and dividend chunk to the nearest ten, divide those, then adjust by 1 if the trial multiplication is too large.",
  },
  {
    question: "What does the remainder represent?",
    answer:
      "The remainder is the part of the dividend that was left over after the divisor stopped fitting into it. It is always smaller than the divisor, and it tells you exactly how short the last group is from being a full one.",
  },
  {
    question: "How do I convert a remainder to a fraction or decimal?",
    answer:
      "As a fraction, write the remainder over the divisor: 1234 divided by 7 has remainder 2, so 1234 / 7 = 176 and 2/7. As a decimal, keep dividing past the decimal point by adding zeros to the remainder until you stop or hit a repeating pattern.",
  },
  {
    question: "What are the most common long-division mistakes?",
    answer:
      "Forgetting to bring down a zero when the divisor does not fit, misaligning digits in the quotient, and subtracting instead of multiplying when checking the answer. Always verify with quotient times divisor plus remainder equals dividend.",
  },
  {
    question: "Does this calculator handle negative numbers?",
    answer:
      "Yes. It uses the sign of the dividend and divisor to set the sign of the quotient, and it always returns a non-negative remainder smaller than the absolute value of the divisor, matching the standard math-class convention.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Step-by-Step Quotient and Remainder`,
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
      name: "How to do long division",
      steps: [
        { name: "Set up the problem", text: "Write the dividend under the long-division bracket and the divisor outside on the left." },
        { name: "Divide one digit chunk at a time", text: "From the leftmost digits, find how many times the divisor fits, and write that on top of the bracket." },
        { name: "Multiply and subtract", text: "Multiply the divisor by that quotient digit, subtract from the current chunk, then bring down the next digit." },
        { name: "Repeat until no digits remain", text: "When you run out of digits, what is left is the remainder. Verify: quotient times divisor plus remainder equals dividend." },
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

      <Hero title={TITLE} tagline="Divide two integers and see every bring-down, multiply, and subtract step laid out the way it is taught in school.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Divide 1234 by 7 using long division. Show each bring-down and the final remainder."
        steps={[
          { label: "First chunk: 7 fits into 12", value: "1 time, remainder 5" },
          { label: "Bring down 3 to make 53. 7 fits into 53", value: "7 times, remainder 4" },
          { label: "Bring down 4 to make 44. 7 fits into 44", value: "6 times, remainder 2" },
          { label: "Quotient digits stacked left to right", value: "176" },
          { label: "Check: 176 × 7 + 2", value: "1234" },
        ]}
        result="1234 ÷ 7 = 176 remainder 2 (or 176 and 2/7, or about 176.286)."
      />

      <FormulaExplained
        plainEnglish="Long division turns one big division problem into a row of small ones. At each step you ask how many times the divisor fits into the current chunk, write that digit on top, subtract the product from the chunk, and pull down the next digit."
        formula={
          <span>
            Given dividend D and divisor d (d ≠ 0):
            <br />
            quotient q = floor(D / d)
            <br />
            remainder r = D − q × d, with 0 ≤ r &lt; |d|
            <br />
            Check: q × d + r = D
          </span>
        }
        citation={{
          label: "Common Core State Standards — Grade 4 NBT.B.6 (multi-digit division algorithm)",
          href: "https://www.thecorestandards.org/Math/Content/4/NBT/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are a student showing work on a homework or test problem.",
          "You are a parent or tutor walking a child through the standard algorithm.",
          "You want to check a division you did by hand and see exactly where you went wrong.",
          "You are converting a fraction to a decimal and need to keep dividing past the decimal point.",
          "You are teaching place value and want every bring-down to be visible.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Skipping a quotient digit when the divisor does not fit.", fix: "Write a 0 in that position before bringing the next digit down. Otherwise the quotient ends up off by a power of 10." },
          { mistake: "Misaligning the digits of the quotient above the bracket.", fix: "Each quotient digit sits directly above the last digit you used from the dividend. Use grid paper if alignment slips." },
          { mistake: "Multiplying the wrong way during the subtract step.", fix: "Multiply the divisor by the new quotient digit only, not by the running quotient. Then subtract from the current chunk." },
          { mistake: "Leaving a remainder larger than the divisor.", fix: "If the remainder is greater than or equal to the divisor, the quotient digit was too small. Increase it by 1 and recompute." },
          { mistake: "Forgetting to check the answer.", fix: "Always confirm with q × d + r = D. It catches both arithmetic and alignment slips in seconds." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Dividend", definition: "The number being divided (the one under the bracket)." },
          { term: "Divisor", definition: "The number you are dividing by (the one outside the bracket)." },
          { term: "Quotient", definition: "The whole-number result of the division, written above the bracket." },
          { term: "Remainder", definition: "What is left after the divisor stops fitting. Always 0 ≤ r < |divisor|." },
          { term: "Partial quotient", definition: "A digit of the quotient produced at one step of the algorithm." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Common Core State Standards — Grade 4 NBT.B.6 (multi-digit whole-number division)", href: "https://www.thecorestandards.org/Math/Content/4/NBT/" },
          { label: "Khan Academy — Long division module", href: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide/arith-review-long-division/v/long-division-without-remainder" },
          { label: "OpenStax — Prealgebra 2e, Whole Numbers chapter", href: "https://openstax.org/details/books/prealgebra-2e" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["fractions-calculator", "decimal-fraction-converter", "factor-calculator"]} />
    </Container>
  );
}
