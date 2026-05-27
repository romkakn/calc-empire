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

const SLUG = "mixed-number-calculator";
const TITLE = "Mixed Number Calculator";
const DESC =
  "Add, subtract, multiply, and divide mixed numbers. Shows every step — convert, operate, reduce, convert back.";

const FAQS: FaqItem[] = [
  {
    question: "How do you add mixed numbers?",
    answer:
      "Convert each to an improper fraction, find a common denominator, add the numerators, then reduce and convert back to a mixed number.",
  },
  {
    question: "How do you subtract mixed numbers with regrouping?",
    answer:
      "If the second numerator is bigger than the first, borrow 1 whole from the first whole-number part (which equals den/den of the same fraction). Then subtract normally.",
  },
  {
    question: "How do you multiply mixed numbers?",
    answer:
      "Convert both to improper fractions, multiply numerators together and denominators together, then reduce. Don't multiply whole numbers and fractions separately — that's a common error.",
  },
  {
    question: "How do you divide mixed numbers?",
    answer:
      "Convert both to improper fractions. Multiply the first by the reciprocal of the second (flip numerator and denominator). Reduce and convert back.",
  },
  {
    question: "What is an improper fraction?",
    answer:
      "A fraction where the numerator is ≥ the denominator, like 7/4 or 9/3. Improper fractions and mixed numbers (1 3/4) represent the same value in different forms.",
  },
  {
    question: "How do you convert a mixed number to an improper fraction?",
    answer:
      "Multiply the whole number by the denominator, add the numerator, and put the result over the original denominator. Example: 2 1/2 = (2 × 2 + 1) / 2 = 5/2.",
  },
  {
    question: "How do you simplify a mixed number?",
    answer:
      "Reduce the fraction part by dividing numerator and denominator by their greatest common divisor (GCD). If the improper fraction has a numerator ≥ denominator, increase the whole part.",
  },
  {
    question: "Can a mixed number be negative?",
    answer:
      "Yes. The whole number carries the sign: −2 1/4 means −(2 + 1/4) = −2.25. Most calculators (and ours) place the minus sign on the whole part.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Add, Subtract, Multiply, Divide`,
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
      name: "How to compute with mixed numbers",
      steps: [
        { name: "Convert to improper fractions", text: "Multiply the whole number by the denominator and add the numerator. Keep the original denominator." },
        { name: "Find a common denominator (add / subtract only)", text: "Multiply each fraction by what's needed so both denominators match. Skip this step for multiply / divide." },
        { name: "Apply the operation", text: "Add or subtract numerators; multiply across or divide by the reciprocal." },
        { name: "Reduce", text: "Divide both numerator and denominator by their GCD." },
        { name: "Convert back to a mixed number", text: "Whole = numerator ÷ denominator (integer part). Remainder over original denominator is the fraction part." },
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

      <Hero title={TITLE} tagline="Add, subtract, multiply, divide — with every step shown and the result in both forms.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Compute 2 1/2 + 1 3/4."
        steps={[
          { label: "Convert 2 1/2 to improper", value: "5/2" },
          { label: "Convert 1 3/4 to improper", value: "7/4" },
          { label: "Common denominator (4): 5/2 → 10/4", value: "10/4" },
          { label: "Add: 10/4 + 7/4", value: "17/4" },
          { label: "Reduce (GCD = 1)", value: "17/4" },
          { label: "Convert back to mixed", value: "4 1/4" },
        ]}
        result="2 1/2 + 1 3/4 = 4 1/4 (or 4.25)."
      />

      <FormulaExplained
        plainEnglish="A mixed number is just an integer plus a fraction. To compute, convert each one to an improper fraction, do the arithmetic, then convert back."
        formula={
          <span>
            Improper = whole × den + num
            <br />
            Add / sub: a/b ± c/d = (a·d ± c·b) / (b·d)
            <br />
            Mul: (a/b) × (c/d) = (a·c) / (b·d)
            <br />
            Div: (a/b) ÷ (c/d) = (a·d) / (b·c)
            <br />
            Reduce: divide num and den by gcd(num, den).
          </span>
        }
        citation={{ label: "Khan Academy — Adding mixed numbers", href: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-mixed-num" }}
      />

      <WhenToUse
        scenarios={[
          "Helping a kid with homework on fractions and mixed numbers.",
          "Adjusting a recipe — half of 2 1/3 cups, doubling 1 1/4 tablespoons.",
          "Carpentry or sewing — adding board lengths or fabric widths given in inches and fractions.",
          "Music — adding rhythmic values like dotted halves and quarter notes.",
          "Brushing up before a math placement test or GRE quant section.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Adding whole parts and fraction parts separately without converting.", fix: "Convert each mixed number to an improper fraction first. Separating loses information when the fraction parts sum to more than 1." },
          { mistake: "Forgetting to flip when dividing.", fix: "Division of fractions = multiplication by the reciprocal. Flip the second number, then multiply." },
          { mistake: "Multiplying whole numbers and fractions separately.", fix: "Convert to improper first. (2 × 1)(1/2 × 3/4) is not (2 × 1 1/2)(3/4) — different answers." },
          { mistake: "Not reducing the final result.", fix: "Always divide numerator and denominator by their GCD. 4/8 should be 1/2." },
          { mistake: "Misplacing the negative sign.", fix: "On mixed numbers, the sign belongs to the whole. −2 1/2 means −(2 + 1/2), not −2 + 1/2." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Improper fraction", definition: "A fraction whose numerator is ≥ its denominator." },
          { term: "GCD (greatest common divisor)", definition: "The largest integer that divides both numerator and denominator. Used to reduce fractions." },
          { term: "LCM (least common multiple)", definition: "The smallest number both denominators divide evenly. Used to find a common denominator." },
          { term: "Reciprocal", definition: "Flip the numerator and denominator. The reciprocal of 3/4 is 4/3." },
          { term: "Equivalent fractions", definition: "Different-looking fractions that represent the same value — 1/2 = 2/4 = 50/100." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Mixed number arithmetic", href: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic/arith-review-mixed-num" },
          { label: "Math is Fun — Mixed Fractions", href: "https://www.mathsisfun.com/mixed-fractions.html" },
          { label: "PurpleMath — Mixed numbers", href: "https://www.purplemath.com/modules/fraction3.htm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-27" />

      <RelatedCalculators slugs={["variance-calculator", "asphalt-calculator", "dividend-calculator"]} />
    </Container>
  );
}
