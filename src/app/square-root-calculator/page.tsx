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

const SLUG = "square-root-calculator";
const TITLE = "Square Root Calculator";
const DESC =
  "Compute the principal square root of any non-negative number with 10-digit precision. Plus simplified-radical form when possible.";

const FAQS: FaqItem[] = [
  {
    question: "What is the principal square root?",
    answer:
      "Every positive number has two square roots — one positive and one negative — because squaring either gives the same result. The principal square root is the non-negative one, and that's what the √ symbol means by convention.",
  },
  {
    question: "What is a perfect square?",
    answer:
      "A perfect square is a whole number that equals an integer times itself, like 1, 4, 9, 16, 25, 36, 49. Their square roots come out as exact integers with no decimal tail.",
  },
  {
    question: "Why is the square root of a negative number imaginary?",
    answer:
      "No real number squared gives a negative result, because a negative times a negative is positive. To handle √−1 mathematicians defined the imaginary unit i, so √−9 = 3i and answers live in the complex number system.",
  },
  {
    question: "What does simplified radical form mean?",
    answer:
      "Simplified radical form pulls out the biggest perfect-square factor and leaves the rest under the radical. For example, √50 becomes 5√2 because 50 = 25 × 2 and √25 = 5. The number under the radical is as small as possible.",
  },
  {
    question: "Why does √2 have an endless decimal expansion?",
    answer:
      "Numbers whose square roots are not perfect squares are irrational — they cannot be written as a fraction of two whole numbers. That means their decimal form never ends and never repeats, so any printed value is a rounded approximation.",
  },
  {
    question: "How do calculators actually find a square root?",
    answer:
      "Most use Newton's iteration: start with a guess, then replace it with the average of the guess and the number divided by the guess. Each pass roughly doubles the number of correct digits, so a handful of steps gets you 10 digits of accuracy.",
  },
  {
    question: "How is a cube root different from a square root?",
    answer:
      "A square root asks what number times itself gives x, while a cube root asks what number used three times in a product gives x. Cube roots of negative numbers are real — for example, the cube root of −8 is −2 — because a negative cubed stays negative.",
  },
  {
    question: "Where do square roots show up in real life?",
    answer:
      "They appear any time a distance is recovered from squared quantities — the Pythagorean theorem in geometry, the standard deviation in statistics, the magnitude of a vector in physics, and the diagonal of a square or screen. They are the inverse operation of squaring.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Decimal and Simplified Radical Form`,
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
      name: "How to compute a square root by hand or with this calculator",
      steps: [
        { name: "Enter the number", text: "Type any non-negative value into the input. Decimals are fine. For a negative number the result is reported with the imaginary unit i." },
        { name: "Read the decimal root", text: "The principal square root is shown to 10 digits. If the input is a perfect square the result is exact." },
        { name: "Check the simplified form", text: "When the input is a whole number, the calculator extracts the largest perfect-square factor and shows a√b — for example √50 = 5√2." },
        { name: "Verify by squaring", text: "Square the answer to confirm it returns the original input. Rounding may leave a tiny residual in the last digit." },
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

      <Hero title={TITLE} tagline="Get the principal square root of any number to 10 digits — and the simplified a√b form when one exists.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Find the square root of 50, and express it in simplified radical form."
        steps={[
          { label: "Formula: √x = x^0.5", value: "" },
          { label: "Compute 50^0.5", value: "7.0710678…" },
          { label: "Factor 50 into a perfect square and a remainder", value: "50 = 25 × 2" },
          { label: "Take √25 outside the radical", value: "5" },
          { label: "Simplified radical form", value: "5√2" },
        ]}
        result="√50 ≈ 7.0710678 (decimal) = 5√2 (simplified). Squaring 5√2 gives 25 × 2 = 50, which confirms the answer."
      />

      <FormulaExplained
        plainEnglish="The square root of x is the non-negative number that, when multiplied by itself, gives x. In exponent form it is just x raised to the one-half power, which is how calculators compute it internally."
        formula={
          <span>
            √x = x<sup>0.5</sup>
            <br />
            If x = a²·b with a, b whole numbers and b square-free, then √x = a·√b
            <br />
            If x &lt; 0, then √x = √|x| · i, where i² = −1
          </span>
        }
        citation={{
          label: "NIST Digital Library of Mathematical Functions — Powers and Roots (Chapter 4)",
          href: "https://dlmf.nist.gov/4.2",
        }}
      />

      <WhenToUse
        scenarios={[
          "You need a quick decimal value for a square root and want more digits than a phone keypad shows.",
          "You are simplifying a radical expression for an algebra or geometry assignment and need a√b form.",
          "You are checking a hand-calculated answer for the Pythagorean theorem or distance formula.",
          "You are computing a standard deviation, a magnitude of a vector, or any quantity that involves a √.",
          "You are tutoring or studying and want to see perfect-square factoring laid out step by step.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting the negative root.", fix: "The equation x² = 9 has two solutions: x = 3 and x = −3. The √ symbol returns only the principal (positive) root, so write ±√9 when both matter." },
          { mistake: "Writing √(a + b) = √a + √b.", fix: "Square roots do not distribute over addition. √(9 + 16) = √25 = 5, not √9 + √16 = 3 + 4 = 7. They do distribute over multiplication: √(ab) = √a · √b." },
          { mistake: "Treating √−4 as undefined.", fix: "It is undefined in the real numbers but well-defined in the complex numbers as 2i. This calculator returns the imaginary form when the input is negative." },
          { mistake: "Leaving √50 instead of 5√2.", fix: "Most graders expect simplified radical form. Pull out the largest perfect-square factor before submitting." },
          { mistake: "Trusting every printed digit.", fix: "Irrational square roots have non-terminating decimals. The last digit shown is rounded — square the result to see a tiny residual." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Radical", definition: "An expression using the √ symbol. The number inside is the radicand." },
          { term: "Radicand", definition: "The value under the radical sign. In √50 the radicand is 50." },
          { term: "Perfect square", definition: "A whole number equal to an integer times itself, such as 1, 4, 9, 16, 25." },
          { term: "Irrational number", definition: "A real number that cannot be written as a fraction of two integers. Its decimal expansion never ends and never repeats." },
          { term: "Imaginary unit (i)", definition: "Defined by i² = −1. Square roots of negative numbers are expressed as a real number multiplied by i." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST Digital Library of Mathematical Functions — Powers and Roots", href: "https://dlmf.nist.gov/4.2" },
          { label: "OpenStax — College Algebra: Radicals and Rational Exponents", href: "https://openstax.org/books/college-algebra-2e/pages/1-3-radicals-and-rational-exponents" },
          { label: "MIT OpenCourseWare — 18.01 Single Variable Calculus, Lecture Notes", href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/pages/lecture-notes/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["quadratic-formula-calculator", "scientific-notation-calculator", "factor-calculator"]} />
    </Container>
  );
}
