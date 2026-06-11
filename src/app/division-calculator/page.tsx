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

const SLUG = "division-calculator";
const TITLE = "Division Calculator";
const DESC =
  "Integer and decimal division with quotient, remainder, and recurring digits.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between integer and decimal division?",
    answer:
      "Integer division gives a whole-number quotient plus a remainder. Decimal division keeps going past the decimal point until the answer terminates or starts repeating.",
  },
  {
    question: "What does the remainder mean?",
    answer:
      "The remainder is what is left over after you fit as many full divisors as possible into the dividend. For 22 divided by 7, three 7s fit (21) and 1 is left, so the remainder is 1.",
  },
  {
    question: "Why do some decimals repeat forever?",
    answer:
      "A fraction in lowest terms has a terminating decimal only when its denominator has no prime factors other than 2 and 5. Any other prime factor (like 3, 7, or 11) creates a repeating block of digits.",
  },
  {
    question: "What is the modulo operator?",
    answer:
      "Modulo (often written mod or %) is the remainder of an integer division. So 22 mod 7 equals 1, the same remainder you get from long division.",
  },
  {
    question: "What happens when I divide by zero?",
    answer:
      "Division by zero is undefined in standard arithmetic. The calculator flags it instead of returning a number, because there is no value that satisfies the equation a equals zero times q.",
  },
  {
    question: "How does this compare to long division?",
    answer:
      "Long division is the step-by-step pencil method that produces the same quotient and remainder you see here. This tool jumps to the answer and also detects the repeating block for you.",
  },
  {
    question: "Can I round the decimal quotient?",
    answer:
      "Yes. The calculator shows the decimal expansion to enough digits to reveal repetition. You can round to as many places as you need for your own work.",
  },
  {
    question: "What is the dividend and what is the divisor?",
    answer:
      "The dividend is the number being split. The divisor is the number you are splitting by. In 22 divided by 7, 22 is the dividend and 7 is the divisor.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Quotient, Remainder & Repeating Decimals`,
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
      name: "How to divide two numbers and find the remainder",
      steps: [
        { name: "Enter the dividend", text: "Type the number you want to split — for 22 / 7 that is 22." },
        { name: "Enter the divisor", text: "Type the number you are dividing by. The divisor cannot be zero." },
        { name: "Pick a mode", text: "Integer + remainder shows quotient and remainder. Decimal shows the full decimal expansion." },
        { name: "Read the result", text: "Check the quotient, remainder, or repeating block. Round the decimal to the precision you need." },
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

      <Hero title={TITLE} tagline="Divide any two numbers — get the quotient, the remainder, and the repeating-decimal block in one step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student needs to divide 22 by 7 and report both the integer answer with a remainder and the decimal answer."
        steps={[
          { label: "Integer mode: find how many full 7s fit into 22", value: "3" },
          { label: "Subtract 3 × 7 = 21 from 22 to get the remainder", value: "1" },
          { label: "Decimal mode: continue dividing past the decimal point", value: "3.142857..." },
          { label: "Detect the repeating block in the decimal expansion", value: "142857" },
        ]}
        result="22 ÷ 7 = 3 remainder 1 (integer mode), or 3.142857142857... with the block 142857 repeating forever (decimal mode)."
      />

      <FormulaExplained
        plainEnglish="Division splits a dividend into equal pieces sized by the divisor. The quotient is how many full pieces fit; the remainder is what is left over. In decimal form, the answer either stops at some place or settles into a repeating block of digits."
        formula={
          <span>
            quotient = floor(a / b)
            <br />
            remainder = a − quotient × b
            <br />
            decimal terminates only when b (in lowest terms) has prime factors of just 2 and 5
          </span>
        }
        citation={{
          label: "Khan Academy — Intro to long division (arithmetic)",
          href: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide/arith-review-long-division/v/long-division",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking a long-division homework answer and want both the quotient and remainder.",
          "You need to know whether a fraction has a terminating or repeating decimal expansion.",
          "You are programming and want to confirm what the modulo operator returns for a given pair.",
          "You are splitting items into equal groups and need to know how many are left over.",
          "You are teaching arithmetic and want a quick way to show repeating-decimal patterns.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing up dividend and divisor.", fix: "The dividend goes on top (or first); the divisor goes on the bottom (or second). 22 ÷ 7 is not the same as 7 ÷ 22." },
          { mistake: "Forgetting that division by zero is undefined.", fix: "Any divisor of zero has no answer. Re-check your divisor input before reading the result." },
          { mistake: "Rounding the decimal too early.", fix: "Round only at the final step. Rounding partway through changes the answer, especially for repeating decimals." },
          { mistake: "Treating a long non-repeating run as terminating.", fix: "Some repeating blocks are long. 1/17 repeats every 16 digits. Watch for the repeat marker, not just the visible digits." },
          { mistake: "Confusing remainder with the decimal part.", fix: "The remainder is an integer counted in divisor units. The decimal part is the remainder divided by the divisor again." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Dividend", definition: "The number being divided. In a ÷ b, a is the dividend." },
          { term: "Divisor", definition: "The number you are dividing by. In a ÷ b, b is the divisor." },
          { term: "Quotient", definition: "The result of division. In integer mode it is the whole-number part." },
          { term: "Remainder", definition: "What is left after fitting as many full divisors as possible into the dividend." },
          { term: "Repeating decimal", definition: "A decimal expansion in which a block of digits repeats forever, like 0.333... or 0.142857142857..." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Long division (arithmetic)", href: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide/arith-review-long-division/v/long-division" },
          { label: "OpenStax — Prealgebra 2e, Divide Whole Numbers", href: "https://openstax.org/books/prealgebra-2e/pages/1-5-divide-whole-numbers" },
          { label: "NIST Digital Library of Mathematical Functions — Numerical Methods", href: "https://dlmf.nist.gov/3" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["long-division-calculator", "fractions-calculator", "gcf-calculator"]} />
    </Container>
  );
}
