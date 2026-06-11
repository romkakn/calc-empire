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

const SLUG = "simplify-calculator";
const TITLE = "Simplify Calculator";
const DESC =
  "Simplify algebraic expressions: combine like terms, distribute multiplication, and reduce fractions step by step.";

const FAQS: FaqItem[] = [
  {
    question: "What are like terms?",
    answer:
      "Like terms have the same variable raised to the same power. For example, 3x and 5x are like terms, but 3x and 5x² are not. You can add or subtract like terms by combining their coefficients.",
  },
  {
    question: "How does the distributive property work?",
    answer:
      "Distribution multiplies a factor across each term inside parentheses: a(b + c) becomes ab + ac. Use it to remove grouping symbols before combining like terms. Watch the sign — a negative outside the parentheses flips every sign inside.",
  },
  {
    question: "How do you reduce a fraction to lowest terms?",
    answer:
      "Find the greatest common divisor (GCD) of the numerator and denominator, then divide both by it. For example, 12/18 has a GCD of 6, so it reduces to 2/3. A fraction is in lowest terms when the GCD of its parts is 1.",
  },
  {
    question: "What is the order of operations?",
    answer:
      "PEMDAS: Parentheses, Exponents, Multiplication and Division (left to right), Addition and Subtraction (left to right). When simplifying, work inside parentheses first, then apply exponents, then multiply or divide, and finally add or subtract.",
  },
  {
    question: "Can you combine radicals?",
    answer:
      "Only if they have the same index and the same radicand. For example, 2√3 + 5√3 = 7√3, but √2 + √3 cannot be combined. Simplify each radical first — sometimes terms that look different share a factor under the root.",
  },
  {
    question: "Why simplify expressions at all?",
    answer:
      "A simplified expression is easier to evaluate, compare, and use in further steps. It also reveals structure — like a hidden common factor — that helps solve equations. Most graders expect final answers in simplest form.",
  },
  {
    question: "What is a common mistake when distributing a negative sign?",
    answer:
      "Forgetting to flip every sign inside the parentheses. For example, −(2x − 5) is −2x + 5, not −2x − 5. Treat the leading minus as multiplication by −1 and apply it to each term.",
  },
  {
    question: "Does the order I combine terms matter?",
    answer:
      "No — addition is commutative and associative, so you can reorder and regroup like terms freely. Many people group same-variable terms first for clarity, then handle constants at the end.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Combine, Distribute, and Reduce`,
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
      name: "How to simplify an algebraic expression",
      steps: [
        { name: "Distribute first", text: "Apply the distributive property to clear any parentheses: a(b + c) becomes ab + ac." },
        { name: "Group like terms", text: "Collect terms that share the same variable and exponent — for example, all x terms together, all constants together." },
        { name: "Combine coefficients", text: "Add or subtract the numeric coefficients of like terms while keeping the variable part unchanged." },
        { name: "Reduce fractions", text: "If the result has a fraction, divide the numerator and denominator by their greatest common divisor." },
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

      <Hero title={TITLE} tagline="Combine like terms, distribute, and reduce — see each simplification step explained.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Simplify the expression 2x + 3x − 4 + 6 by combining like terms."
        steps={[
          { label: "Identify like terms: x terms and constants", value: "2x, 3x | −4, 6" },
          { label: "Add the x coefficients: 2 + 3", value: "5x" },
          { label: "Add the constants: −4 + 6", value: "2" },
          { label: "Write the simplified expression", value: "5x + 2" },
        ]}
        result="2x + 3x − 4 + 6 simplifies to 5x + 2."
      />

      <FormulaExplained
        plainEnglish="Simplifying an expression means rewriting it in a shorter equivalent form. You distribute to clear parentheses, collect coefficients on each variable power, and reduce any fractions by their greatest common divisor."
        formula={
          <span>
            Combine like terms: a·x<sup>n</sup> + b·x<sup>n</sup> = (a + b)·x<sup>n</sup>
            <br />
            Distribute: a(b + c) = ab + ac
            <br />
            Reduce fraction: p/q = (p ÷ gcd) / (q ÷ gcd)
          </span>
        }
        citation={{
          label: "OpenStax — Elementary Algebra 2e, Chapter on Simplifying Expressions",
          href: "https://openstax.org/details/books/elementary-algebra-2e",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're checking algebra homework and want a step-by-step simplification.",
          "You're prepping for a quiz on combining like terms or the distributive property.",
          "You're teaching pre-algebra or algebra 1 and need quick worked examples.",
          "You're solving an equation and want to simplify each side before isolating the variable.",
          "You're reducing a fraction inside a larger expression and want a GCD-based reduction.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Combining unlike terms.", fix: "3x and 4x² are not like terms — different exponents. Only combine when the variable and the power match exactly." },
          { mistake: "Dropping the sign when distributing a negative.", fix: "−(2x − 5) = −2x + 5. Multiply the leading −1 across every term inside the parentheses." },
          { mistake: "Mixing up coefficients and exponents.", fix: "2x + 3x = 5x, not 5x². Adding like terms adds the coefficients only; the exponent stays the same." },
          { mistake: "Reducing a fraction by subtracting instead of dividing.", fix: "12/18 reduces to 2/3 (divide by 6), not to 6/12 (don't subtract)." },
          { mistake: "Ignoring order of operations.", fix: "Follow PEMDAS: parentheses, exponents, multiplication and division, then addition and subtraction." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Like terms", definition: "Terms with the same variable raised to the same power. Only like terms can be combined by addition or subtraction." },
          { term: "Coefficient", definition: "The numeric factor in front of a variable. In 5x, the coefficient is 5." },
          { term: "Distributive property", definition: "a(b + c) = ab + ac. Used to remove parentheses." },
          { term: "Greatest common divisor (GCD)", definition: "The largest integer that divides two numbers evenly. Used to reduce fractions to lowest terms." },
          { term: "PEMDAS", definition: "Order of operations: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Elementary Algebra 2e (free open textbook)", href: "https://openstax.org/details/books/elementary-algebra-2e" },
          { label: "Khan Academy — Algebra basics: Foundations", href: "https://www.khanacademy.org/math/algebra-basics" },
          { label: "Common Core State Standards — Grade 6 Expressions and Equations", href: "https://www.thecorestandards.org/Math/Content/6/EE/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["fractions-calculator", "quadratic-formula-calculator", "factor-calculator"]} />
    </Container>
  );
}
