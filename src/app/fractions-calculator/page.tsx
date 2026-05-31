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

const SLUG = "fractions-calculator";
const TITLE = "Fractions Calculator";
const DESC =
  "Add, subtract, multiply, divide two fractions and get a reduced answer plus mixed-number form. Step-by-step.";

const FAQS: FaqItem[] = [
  {
    question: "Least common denominator or just cross-multiply?",
    answer:
      "Cross-multiplying (a·d + c·b over b·d) always works and is what this calculator does. The least common denominator gives smaller intermediate numbers when b and d share factors, which means less reducing at the end. Both reach the same final answer.",
  },
  {
    question: "Why reduce a fraction at all?",
    answer:
      "Reducing turns 4/8 into 1/2 — same value, simpler form. Teachers expect simplest form, and reduced fractions are easier to compare and combine in later steps.",
  },
  {
    question: "What is an improper fraction and how is it different from a mixed number?",
    answer:
      "An improper fraction has a numerator equal to or larger than the denominator, like 7/3. A mixed number splits the same value into a whole part plus a proper fraction, like 2 1/3. They are interchangeable: divide the top by the bottom to get the whole part, and the remainder becomes the new numerator.",
  },
  {
    question: "How do I divide by a fraction?",
    answer:
      "Flip the second fraction and multiply. Dividing by 2/3 is the same as multiplying by 3/2. This is why a/b ÷ c/d simplifies to (a·d) / (b·c).",
  },
  {
    question: "How do I turn a fraction into a decimal?",
    answer:
      "Divide the numerator by the denominator. 3/4 becomes 3 ÷ 4 = 0.75. Some fractions, like 1/3, give a repeating decimal (0.333…), and you may need to round.",
  },
  {
    question: "Where do fractions actually show up in real life?",
    answer:
      "Recipes (half a cup, three quarters of a teaspoon), construction (5/8 inch drill bit), music (3/4 time), finance (a quarter of a percent), and any time something is split into equal parts.",
  },
  {
    question: "How do negative fractions work?",
    answer:
      "The sign can sit on the numerator, the denominator, or out front — they all mean the same thing. This calculator normalizes the sign onto the numerator, so −1/2, 1/−2, and −(1/2) all display as −1/2.",
  },
  {
    question: "What is the Euclidean gcd algorithm?",
    answer:
      "It is the trick the calculator uses to reduce. Replace the larger of two numbers with its remainder when divided by the smaller, repeat until one is zero, and the other is the greatest common divisor. For 12 and 18: 18 mod 12 = 6, 12 mod 6 = 0, so gcd = 6.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Add, Subtract, Multiply, Divide with Steps`,
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
      name: "How to add, subtract, multiply, or divide two fractions",
      steps: [
        { name: "Pick an operation", text: "Choose +, −, ×, or ÷ for the two fractions." },
        { name: "Enter the four numbers", text: "Type the numerator and denominator for each fraction. Whole numbers go in as n/1." },
        { name: "Apply the formula", text: "Add/subtract: (a·d ± c·b) / (b·d). Multiply: (a·c)/(b·d). Divide: (a·d)/(b·c)." },
        { name: "Reduce and convert", text: "Divide top and bottom by their gcd, then split into whole + remainder/denominator for the mixed-number form." },
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

      <Hero
        title={TITLE}
        tagline="Add, subtract, multiply, or divide two fractions. See the reduced answer, the mixed-number form, and every step."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="What is 1/2 + 1/3? Reduce the answer and show it as a mixed number."
        steps={[
          { label: "Add formula: a/b + c/d = (a·d + c·b) / (b·d)", value: "" },
          { label: "Plug in 1/2 + 1/3: (1·3 + 1·2) / (2·3)", value: "5/6" },
          { label: "Reduce by gcd(5, 6) = 1", value: "5/6" },
          { label: "Convert to mixed: 5 ÷ 6 = 0 remainder 5", value: "0 5/6" },
        ]}
        result="1/2 + 1/3 = 5/6. Already reduced (gcd 1). As mixed number: 0 5/6."
      />

      <FormulaExplained
        plainEnglish="Two fractions can only be added or subtracted when they share a denominator. Cross-multiplying gives you that shared denominator in one move: b·d. Multiplication and division are simpler — multiply tops with tops and bottoms with bottoms, and dividing is just multiplying by the flipped second fraction."
        formula={
          <span>
            a/b + c/d = (a·d + c·b) / (b·d)
            <br />
            a/b − c/d = (a·d − c·b) / (b·d)
            <br />
            a/b × c/d = (a·c) / (b·d)
            <br />
            a/b ÷ c/d = (a·d) / (b·c)
            <br />
            Reduce by gcd(num, den); convert improper to whole + remainder/den.
          </span>
        }
        citation={{
          label: "Common Core State Standards — Grade 5 Number & Operations: Fractions (5.NF)",
          href: "https://www.thecorestandards.org/Math/Content/5/NF/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking a homework answer and want to see each step.",
          "You are scaling a recipe up or down and need to combine measurements like 1/2 cup and 1/3 cup.",
          "You are converting an improper fraction back to a mixed number for a woodworking cut list.",
          "You are a parent helping a kid learn why cross-multiplying works.",
          "You are a teacher generating extra practice problems and want the worked solution.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Adding the tops and the bottoms separately.", fix: "1/2 + 1/3 is not 2/5. You need a common denominator first — multiply by b·d, then add the numerators." },
          { mistake: "Forgetting to flip when dividing.", fix: "a/b ÷ c/d is a/b × d/c. The second fraction inverts, the first does not." },
          { mistake: "Skipping the reduce step.", fix: "4/8 and 1/2 are the same value, but most graders want simplest form. Divide top and bottom by their gcd." },
          { mistake: "Letting a zero into the denominator.", fix: "Division by zero is undefined. This calculator blocks results when any denominator is 0, or when the second numerator is 0 in a division." },
          { mistake: "Confusing 'mixed number' with multiplication.", fix: "'2 1/3' means 2 + 1/3, not 2 × 1/3. The space is shorthand for a plus sign." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Numerator", definition: "Top number — how many parts you have." },
          { term: "Denominator", definition: "Bottom number — how many equal parts make a whole." },
          { term: "Proper fraction", definition: "Numerator smaller than the denominator, like 3/4." },
          { term: "Improper fraction", definition: "Numerator equal to or larger than the denominator, like 7/3." },
          { term: "Mixed number", definition: "A whole number plus a proper fraction, like 2 1/3." },
          { term: "Greatest common divisor (gcd)", definition: "The largest integer that divides both numbers cleanly. Used to reduce." },
          { term: "Least common denominator (LCD)", definition: "The smallest denominator two fractions can share. Equal to lcm(b, d)." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Common Core State Standards — Grade 5 Number & Operations: Fractions (5.NF)", href: "https://www.thecorestandards.org/Math/Content/5/NF/" },
          { label: "Common Core State Standards — Grade 6 The Number System (6.NS)", href: "https://www.thecorestandards.org/Math/Content/6/NS/" },
          { label: "Khan Academy — Arithmetic with Fractions", href: "https://www.khanacademy.org/math/arithmetic/fraction-arithmetic" },
          { label: "NIST Digital Library of Mathematical Functions — Rational arithmetic background", href: "https://dlmf.nist.gov/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["mixed-number-calculator", "decimal-fraction-converter", "rounding-calculator"]} />
    </Container>
  );
}
