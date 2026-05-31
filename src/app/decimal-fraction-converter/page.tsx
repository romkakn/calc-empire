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

const SLUG = "decimal-fraction-converter";
const TITLE = "Decimal to Fraction Converter";
const DESC =
  "Convert any decimal to a reduced fraction (and back). Handles repeating decimals with explicit notation.";

const FAQS: FaqItem[] = [
  {
    question: "What makes a decimal repeating?",
    answer:
      "A decimal repeats when its fraction form has a denominator with prime factors other than 2 or 5. For example, 1/3 = 0.333... because 3 is not a factor of any power of ten. The repeating digits are called the repetend.",
  },
  {
    question: "How do I spot a terminating decimal?",
    answer:
      "Reduce the fraction first. If the reduced denominator only has the prime factors 2 and 5, the decimal will terminate. 7/40 terminates because 40 = 2 x 2 x 2 x 5. 7/30 does not, because 30 includes a 3.",
  },
  {
    question: "Why do you reduce by the greatest common divisor?",
    answer:
      "The gcd is the largest number that divides both the numerator and denominator with no remainder. Dividing both by it gives the smallest equivalent fraction. Any smaller divisor would leave the fraction not yet in lowest terms.",
  },
  {
    question: "When should I use a mixed number?",
    answer:
      "Use a mixed number when the fraction is greater than one and you want to see the whole part at a glance. 7/4 becomes 1 and 3/4. For arithmetic, the plain fraction form is usually easier to work with.",
  },
  {
    question: "Can every decimal be written as a fraction?",
    answer:
      "Every terminating or repeating decimal can. Irrational numbers like pi or sqrt(2) have decimals that never end and never repeat, so no exact fraction exists. Calculators show a rounded approximation instead.",
  },
  {
    question: "How do I turn a repeating decimal into a fraction by hand?",
    answer:
      "Write x equal to the decimal, multiply both sides by 10 raised to the length of the repeat, then subtract the original equation. For 0.(3): 10x - x = 3.333... - 0.333..., so 9x = 3 and x = 1/3.",
  },
  {
    question: "What is the infinite-series view of a repeating decimal?",
    answer:
      "0.333... is the sum 3/10 + 3/100 + 3/1000 and so on. This is a geometric series with ratio 1/10, which sums to (3/10) / (1 - 1/10) = 1/3. Every repeating decimal can be summed the same way.",
  },
  {
    question: "Is 0.999... really equal to 1?",
    answer:
      "Yes. By the same infinite-series argument, 0.999... = (9/10) / (1 - 1/10) = 1. Two different decimal strings can name the same number.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Reduced Fraction & Mixed Number`,
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
      name: "How to convert a decimal to a reduced fraction",
      steps: [
        { name: "Count the decimal digits", text: "Count the digits after the decimal point. Call that count k." },
        { name: "Write as x over 10^k", text: "Multiply the decimal by 10^k to get a whole numerator; the denominator is 10^k." },
        { name: "Find the gcd", text: "Compute the greatest common divisor of the numerator and denominator." },
        { name: "Divide both sides", text: "Divide numerator and denominator by the gcd. The result is the reduced fraction." },
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

      <Hero title={TITLE} tagline="Turn a decimal into a clean reduced fraction — or run a fraction back to its decimal form.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student needs to express 0.75 as a fraction in lowest terms."
        steps={[
          { label: "Count digits after the point (k)", value: "2" },
          { label: "Write as 75 / 10^2", value: "75/100" },
          { label: "gcd(75, 100)", value: "25" },
          { label: "Divide both by 25", value: "3/4" },
          { label: "Check: 3 / 4", value: "0.75" },
        ]}
        result="0.75 = 3/4. Reverse direction: 3/4 = 0.75 exactly."
      />

      <FormulaExplained
        plainEnglish="Every terminating decimal is already a fraction in disguise. Count the digits after the point, write the number over the matching power of ten, then divide top and bottom by their greatest common divisor."
        formula={
          <span>
            Decimal → Fraction: x = n / 10<sup>k</sup>, then reduce by gcd(n, 10<sup>k</sup>)
            <br />
            Fraction → Decimal: n / d
            <br />
            Repeating: 0.(a<sub>1</sub>…a<sub>k</sub>) = a / (10<sup>k</sup> − 1)
          </span>
        }
        citation={{
          label: "Wikipedia — Repeating decimal (fraction conversion section)",
          href: "https://en.wikipedia.org/wiki/Repeating_decimal",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking homework and need the lowest-terms answer.",
          "You are translating a measurement from a digital readout into a fraction for a tape measure.",
          "You are writing a recipe and want 0.375 cup as 3/8.",
          "You are teaching place value and want to show why 0.5 and 1/2 name the same number.",
          "You are coding a price-display routine and need to render decimals as fractions for a parts catalog.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting to reduce the fraction.", fix: "75/100 is correct but not in lowest terms. Divide top and bottom by gcd(75, 100) = 25 to get 3/4." },
          { mistake: "Treating a rounded display as exact.", fix: "If your calculator shows 0.3333333, the underlying number may be 1/3. Watch for trailing repeats before claiming the decimal terminates." },
          { mistake: "Dropping the sign.", fix: "Reduce the absolute value, then attach the sign back to the numerator. -0.5 = -1/2, not 1/-2." },
          { mistake: "Mixing up numerator and denominator in mixed form.", fix: "7/4 is 1 and 3/4, not 3 and 1/4. The whole part is the quotient, the new numerator is the remainder." },
          { mistake: "Trying to convert pi or sqrt(2).", fix: "Irrational numbers have no exact fraction. Any fraction you get is a rational approximation, not equality." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Numerator", definition: "The top number of a fraction — how many parts you have." },
          { term: "Denominator", definition: "The bottom number — how many equal parts make up one whole." },
          { term: "GCD", definition: "Greatest common divisor. The largest integer that divides two numbers with no remainder." },
          { term: "Repetend", definition: "The block of digits that repeats forever in a repeating decimal, such as the 3 in 0.(3)." },
          { term: "Mixed number", definition: "A whole number plus a proper fraction, like 1 and 3/4." },
          { term: "Irrational number", definition: "A number whose decimal never ends and never repeats. Cannot be written as a fraction of two integers." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST — Guide for the Use of the International System of Units (decimal notation)", href: "https://physics.nist.gov/cuu/Units/checklist.html" },
          { label: "Khan Academy — Converting decimals to fractions", href: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-decimals-to-fractions/v/converting-decimals-to-fractions-1" },
          { label: "Wikipedia — Repeating decimal", href: "https://en.wikipedia.org/wiki/Repeating_decimal" },
          { label: "Wolfram MathWorld — Repeating decimal", href: "https://mathworld.wolfram.com/RepeatingDecimal.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["fractions-calculator", "mixed-number-calculator", "rounding-calculator"]} />
    </Container>
  );
}
