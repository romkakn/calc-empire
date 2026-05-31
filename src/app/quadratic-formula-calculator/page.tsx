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

const SLUG = "quadratic-formula-calculator";
const TITLE = "Quadratic Formula Calculator";
const DESC =
  "Solve ax^2 + bx + c = 0. Returns real and complex roots, discriminant, and vertex of the parabola.";

const FAQS: FaqItem[] = [
  {
    question: "What does the discriminant tell you?",
    answer:
      "The discriminant is the part under the square root: D = b^2 - 4ac. Its sign decides how many real solutions the quadratic has. Positive means two real roots, zero means one repeated root, and negative means two complex conjugate roots.",
  },
  {
    question: "What is the difference between real and complex roots?",
    answer:
      "Real roots are x-values where the parabola actually crosses the x-axis. Complex roots happen when the parabola never touches the x-axis, so the solutions include the imaginary unit i = sqrt(-1). Complex roots always come in conjugate pairs like p + qi and p - qi.",
  },
  {
    question: "When should I factor instead of using the quadratic formula?",
    answer:
      "Factor when the coefficients are small whole numbers and you can spot two numbers that multiply to ac and add to b. The quadratic formula always works, even with decimals, fractions, or negative discriminants, so it is the safer fallback.",
  },
  {
    question: "What is vertex form and why does it matter?",
    answer:
      "Vertex form rewrites ax^2 + bx + c as a(x - h)^2 + k, where (h, k) is the vertex of the parabola. It makes the highest or lowest point of the curve obvious, which is useful for optimization problems and graphing.",
  },
  {
    question: "How does completing the square relate to the formula?",
    answer:
      "Completing the square is the proof of the quadratic formula. You move c to the other side, divide by a, add (b/2a)^2 to both sides, and then take the square root. The general result is the quadratic formula itself.",
  },
  {
    question: "What happens if a = 0?",
    answer:
      "If a is zero, the equation is not quadratic anymore. It collapses to bx + c = 0, which is a linear equation with one solution: x = -c/b. The calculator flags this case because dividing by 2a would be invalid.",
  },
  {
    question: "How do the roots show up on a graph?",
    answer:
      "Plot y = ax^2 + bx + c and the real roots are the x-intercepts. The vertex is the turning point: a minimum when a is positive, a maximum when a is negative. The axis of symmetry is the vertical line x = -b/(2a).",
  },
  {
    question: "Can you give a real-world physics example?",
    answer:
      "Projectile height often follows h(t) = -4.9 t^2 + v0 t + h0 in meters. Setting h(t) = 0 and solving with the quadratic formula tells you when the object hits the ground. The vertex gives the peak height and the time it occurs.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Roots, Discriminant, and Vertex`,
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
      name: "How to solve a quadratic equation with the quadratic formula",
      steps: [
        { name: "Identify a, b, c", text: "Write the equation in the standard form ax^2 + bx + c = 0 and read off the three coefficients." },
        { name: "Compute the discriminant", text: "Calculate D = b^2 - 4ac. The sign tells you whether the roots will be real or complex." },
        { name: "Apply the formula", text: "Plug into x = (-b +/- sqrt(D)) / (2a). Use +/- to get both roots." },
        { name: "Find the vertex", text: "Use x = -b/(2a) for the vertex x-coordinate, then substitute back to get y = c - b^2/(4a)." },
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

      <Hero title={TITLE} tagline="Enter a, b, c and get both roots, the discriminant, and the parabola's vertex — all from one form.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Solve x^2 - 3x + 2 = 0 (a = 1, b = -3, c = 2)."
        steps={[
          { label: "Discriminant: D = b^2 - 4ac = (-3)^2 - 4(1)(2)", value: "1" },
          { label: "sqrt(D)", value: "1" },
          { label: "Root 1: (-b + sqrt(D)) / (2a) = (3 + 1) / 2", value: "2" },
          { label: "Root 2: (-b - sqrt(D)) / (2a) = (3 - 1) / 2", value: "1" },
          { label: "Vertex x = -b/(2a) = 3/2", value: "1.5" },
          { label: "Vertex y = c - b^2/(4a) = 2 - 9/4", value: "-0.25" },
        ]}
        result="Two real roots: x = 2 and x = 1. Vertex at (1.5, -0.25). Because a > 0, the parabola opens upward, so -0.25 is the minimum value."
      />

      <FormulaExplained
        plainEnglish="A quadratic is any equation that fits ax^2 + bx + c = 0 with a not equal to zero. The quadratic formula returns the x-values that make the equation true. The discriminant b^2 - 4ac decides whether you get two real roots, one repeated root, or two complex roots."
        formula={
          <span>
            x = (-b &plusmn; &radic;(b<sup>2</sup> - 4ac)) / (2a)
            <br />
            Discriminant D = b<sup>2</sup> - 4ac
            <br />
            Vertex: x = -b/(2a), &nbsp; y = c - b<sup>2</sup>/(4a)
          </span>
        }
        citation={{
          label: "OpenStax — College Algebra 2e, The Quadratic Formula",
          href: "https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations",
        }}
      />

      <WhenToUse
        scenarios={[
          "You hit a quadratic in algebra homework and want to double-check your factoring.",
          "You are modeling projectile motion and need to know when height equals zero.",
          "You are designing a parabolic shape — antenna, arch, headlight — and need its turning point.",
          "You are studying for the SAT, ACT, or a college placement test.",
          "You are a teacher building worked examples and want a quick source of truth.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting the parentheses around -b.", fix: "When b is negative, -b becomes positive. Write -(-3) = 3 explicitly so the sign does not slip." },
          { mistake: "Dropping the square on b.", fix: "The discriminant uses b^2, not b. (-3)^2 is 9, not -9." },
          { mistake: "Dividing only the first term by 2a.", fix: "The entire numerator -b +/- sqrt(D) is divided by 2a. Keep it as one fraction." },
          { mistake: "Calling a negative discriminant 'no solution'.", fix: "There are still two solutions — they are complex, not real. Report them as p +/- qi." },
          { mistake: "Using the formula when a = 0.", fix: "If a is zero, the equation is linear: solve bx + c = 0 directly. The quadratic formula divides by 2a and breaks." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Discriminant", definition: "The expression b^2 - 4ac. Its sign tells you what kind of roots the quadratic has." },
          { term: "Vertex", definition: "The highest or lowest point of the parabola y = ax^2 + bx + c, at x = -b/(2a)." },
          { term: "Axis of symmetry", definition: "The vertical line x = -b/(2a). The parabola mirrors across it." },
          { term: "Complex conjugate", definition: "A pair like p + qi and p - qi. Complex roots of real-coefficient quadratics always come in this form." },
          { term: "Coefficient", definition: "The numbers a, b, and c in ax^2 + bx + c. They control the shape and position of the parabola." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — College Algebra 2e, The Quadratic Formula", href: "https://openstax.org/books/college-algebra-2e/pages/2-5-quadratic-equations" },
          { label: "Khan Academy — The Quadratic Formula", href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations/x2f8bb11595b61c86:quadratic-formula-a1/v/using-the-quadratic-formula" },
          { label: "MIT OpenCourseWare — 18.01 Single Variable Calculus", href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["square-root-calculator", "factor-calculator", "slope-calculator"]} />
    </Container>
  );
}
