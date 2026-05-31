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

const SLUG = "scientific-notation-calculator";
const TITLE = "Scientific Notation Calculator";
const DESC =
  "Convert any number to scientific notation (a × 10^n) and back. Supports engineering notation (powers of 3).";

const FAQS: FaqItem[] = [
  {
    question: "Why do scientists use scientific notation?",
    answer:
      "It keeps very large and very small numbers readable. Writing 0.0000000000667 as 6.67 × 10⁻¹¹ removes the long zero runs that hide significant digits. It also makes multiplication and division of huge numbers a matter of adding or subtracting exponents.",
  },
  {
    question: "What is the difference between scientific and engineering notation?",
    answer:
      "Scientific notation forces the coefficient to fall between 1 and 10, so 47,000 becomes 4.7 × 10⁴. Engineering notation keeps the exponent as a multiple of 3 (matching kilo, mega, giga), so the same number becomes 47 × 10³. Engineers prefer the latter because each step lines up with a metric prefix.",
  },
  {
    question: "How do significant figures work in scientific notation?",
    answer:
      "Every digit in the coefficient counts as significant. Writing 6.022 × 10²³ tells the reader four significant figures; writing 6.0 × 10²³ tells them only two. That is one of the reasons textbooks prefer this format over decimal strings full of trailing zeros.",
  },
  {
    question: "How do I multiply or divide numbers in scientific notation?",
    answer:
      "Multiply the coefficients and add the exponents: (3 × 10²) × (2 × 10⁵) = 6 × 10⁷. Divide the coefficients and subtract the exponents: (8 × 10⁶) ÷ (2 × 10²) = 4 × 10⁴. If the new coefficient drifts outside the 1 to 10 range, shift the decimal and adjust the exponent to put it back.",
  },
  {
    question: "What does the 'E' on my calculator mean?",
    answer:
      "Calculators and programming languages write 4.56 × 10⁻⁵ as 4.56E-5 or 4.56e-5. The letter E stands for 'exponent of 10' and has nothing to do with Euler's number. The IEEE 754 floating-point standard uses the same convention.",
  },
  {
    question: "When should I use scientific notation instead of a plain decimal?",
    answer:
      "Reach for it when the number has more than four leading or trailing zeros, when you need to highlight significant figures, or when you are reporting a measurement with uncertainty. For everyday quantities like a price or a body weight, a plain decimal stays easier to read.",
  },
  {
    question: "What are the most common conversion mistakes?",
    answer:
      "Counting the wrong direction is the top trap: moving the decimal left makes the exponent more positive, and moving it right makes it more negative. Forgetting the sign of the exponent on small numbers is a close second. The third is leaving the coefficient outside 1 to 10, which is technically not standard scientific notation.",
  },
  {
    question: "Can you give real-world examples?",
    answer:
      "The mass of a hydrogen atom is about 1.67 × 10⁻²⁷ kg. A light-year is about 9.46 × 10¹⁵ meters. Avogadro's number is 6.022 × 10²³. Each of these would be unreadable without the exponent.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Convert Numbers to a × 10^n`,
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
      name: "How to convert a number to scientific notation",
      steps: [
        { name: "Pick a direction", text: "Decimal → scientific to compress a long number, or scientific → decimal to expand a × 10^n back out." },
        { name: "Enter your value", text: "For decimal input, type the number as you'd see it. For scientific input, enter the coefficient and the exponent separately." },
        { name: "Apply the formula", text: "n = floor(log10(|x|)). The coefficient a = x / 10^n. For engineering notation, round n down to the nearest multiple of 3." },
        { name: "Read the result", text: "The coefficient stays between 1 and 10 (scientific) or 1 and 1000 (engineering). The exponent counts how many places to shift the decimal." },
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

      <Hero title={TITLE} tagline="Convert any number to scientific notation (a × 10^n) or back to a plain decimal — with an engineering-notation option for metric-prefix work.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A biology student measures a cell membrane thickness of 0.0000456 meters and needs to report it in scientific notation."
        steps={[
          { label: "Take the absolute value", value: "0.0000456" },
          { label: "Compute log10(0.0000456)", value: "≈ -4.3410" },
          { label: "Floor it to get the exponent n", value: "-5" },
          { label: "Coefficient a = 0.0000456 ÷ 10^-5 = 0.0000456 × 10^5", value: "4.56" },
          { label: "Assemble a × 10^n", value: "4.56 × 10^-5" },
        ]}
        result="0.0000456 m written in scientific notation is 4.56 × 10⁻⁵ m. In engineering notation it is 45.6 × 10⁻⁶ m (45.6 micrometers)."
      />

      <FormulaExplained
        plainEnglish="Scientific notation splits a number into a coefficient and a power of ten. The exponent is whichever integer makes the coefficient land between 1 and 10. Engineering notation uses the same idea but locks the exponent to multiples of 3, lining up with the kilo, mega, giga, milli, micro, nano prefixes."
        formula={
          <span>
            Scientific: x = a × 10<sup>n</sup>, where 1 ≤ |a| &lt; 10
            <br />
            n = floor(log<sub>10</sub>(|x|))
            <br />
            a = x / 10<sup>n</sup>
            <br />
            Engineering: same form, but n is a multiple of 3 and 1 ≤ |a| &lt; 1000
          </span>
        }
        citation={{
          label: "NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)",
          href: "https://www.nist.gov/pml/special-publication-811",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are writing a lab report and need to keep significant figures explicit.",
          "You are reading a science paper that uses E notation and want the plain-decimal value.",
          "You are an engineer converting between metric prefixes and need the exponent locked to multiples of 3.",
          "You are a student checking a homework answer against the textbook.",
          "You are a programmer reading floating-point output and want to confirm the magnitude.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Moving the decimal the wrong direction.", fix: "Decimal left means the exponent goes up; decimal right means it goes down. For 0.0034, the decimal moved right 3 places, so n = -3 (not +3)." },
          { mistake: "Leaving the coefficient outside 1 to 10.", fix: "Writing 47 × 10³ is engineering notation, not scientific. Standard scientific form requires 4.7 × 10⁴." },
          { mistake: "Dropping the sign on small-number exponents.", fix: "0.0001 is 1 × 10⁻⁴, not 1 × 10⁴. The negative exponent is what makes it small." },
          { mistake: "Losing significant figures during conversion.", fix: "Keep every digit from the original number. 6.022 × 10²³ has four significant figures; writing 6 × 10²³ silently throws three away." },
          { mistake: "Mixing scientific and engineering notation in the same table.", fix: "Pick one style per column or per report. Readers expect consistency, and mixing styles makes comparisons harder." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Coefficient (mantissa)", definition: "The 'a' in a × 10^n. In scientific notation it sits in [1, 10); in engineering notation it sits in [1, 1000)." },
          { term: "Exponent", definition: "The 'n' in a × 10^n. Counts how many places the decimal moves to recover the original number." },
          { term: "Significant figures", definition: "Every digit shown in the coefficient. Scientific notation makes them explicit, which is why measurement data uses it." },
          { term: "E notation", definition: "The calculator and programming shorthand for a × 10^n, written as aEn (for example, 4.56E-5)." },
          { term: "Order of magnitude", definition: "The exponent itself. Two numbers are 'the same order of magnitude' when their exponents match." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST Special Publication 811 — Guide for the Use of the SI", href: "https://www.nist.gov/pml/special-publication-811" },
          { label: "IEEE 754 — Standard for Floating-Point Arithmetic", href: "https://standards.ieee.org/ieee/754/6210/" },
          { label: "OpenStax College Physics — Appendix on Powers of Ten and Units", href: "https://openstax.org/books/college-physics-2e/pages/1-introduction-to-science-and-the-realm-of-physics-physical-quantities-and-units" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["rounding-calculator", "square-root-calculator", "decimal-fraction-converter"]} />
    </Container>
  );
}
