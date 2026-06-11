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

const SLUG = "pythagorean-theorem-calculator";
const TITLE = "Pythagorean Theorem Calculator";
const DESC =
  "Solve a^2 + b^2 = c^2 for any missing side of a right triangle. Enter two sides and get the third with a full worked solution.";

const FAQS: FaqItem[] = [
  {
    question: "What is a right triangle?",
    answer:
      "A right triangle is any triangle that has one 90-degree angle. The two sides that form that angle are called legs (a and b), and the side opposite the right angle is the hypotenuse (c). The Pythagorean theorem only works on right triangles.",
  },
  {
    question: "What is the hypotenuse?",
    answer:
      "The hypotenuse is the longest side of a right triangle and the side directly across from the 90-degree angle. In the equation a^2 + b^2 = c^2, the c always stands for the hypotenuse. It is always longer than either leg.",
  },
  {
    question: "What are common Pythagorean triples?",
    answer:
      "A Pythagorean triple is a set of three whole numbers that satisfy a^2 + b^2 = c^2. The most famous are 3-4-5, 5-12-13, and 8-15-17. Any multiple of a triple (like 6-8-10 from 3-4-5) is also a triple.",
  },
  {
    question: "How is the Pythagorean theorem related to the distance formula?",
    answer:
      "The distance formula is just the Pythagorean theorem applied to coordinates. The distance between (x1, y1) and (x2, y2) equals sqrt((x2 - x1)^2 + (y2 - y1)^2). The horizontal and vertical gaps become the two legs of a right triangle.",
  },
  {
    question: "What is the converse of the Pythagorean theorem?",
    answer:
      "The converse states that if a^2 + b^2 = c^2 for the three sides of a triangle, then the triangle must be a right triangle. This is how you can test whether an angle is actually 90 degrees using only side lengths.",
  },
  {
    question: "Does the Pythagorean theorem work in 3D?",
    answer:
      "Yes. For a rectangular box with edges a, b, and c, the space diagonal d follows d^2 = a^2 + b^2 + c^2. You apply the 2D theorem twice: once to find the floor diagonal, then again to combine that with the height.",
  },
  {
    question: "Can I use this for non-right triangles?",
    answer:
      "No. If the triangle does not have a 90-degree angle, use the Law of Cosines instead: c^2 = a^2 + b^2 - 2ab*cos(C). The Pythagorean theorem is the special case where angle C equals 90 degrees and cos(90) equals zero.",
  },
  {
    question: "Why does the calculator say the inputs are invalid?",
    answer:
      "When solving for a leg, the hypotenuse must be longer than the known leg. If you enter c smaller than a or b, no real number satisfies the equation. Double-check which side is the hypotenuse before trying again.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Solve for a, b, or c`,
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
      name: "How to solve a right triangle with the Pythagorean theorem",
      steps: [
        { name: "Identify the right angle", text: "Confirm the triangle has a 90-degree angle. The side across from it is the hypotenuse (c)." },
        { name: "Pick the side you need", text: "Decide which side is unknown — leg a, leg b, or the hypotenuse c." },
        { name: "Plug into a^2 + b^2 = c^2", text: "Use c = sqrt(a^2 + b^2) for the hypotenuse, or a = sqrt(c^2 - b^2) for a missing leg." },
        { name: "Check the result", text: "The hypotenuse must be the longest side. Verify by squaring all three and confirming the two smaller squares add to the largest." },
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

      <Hero title={TITLE} tagline="Find any missing side of a right triangle. Pick which side to solve, enter the other two, and read the full step-by-step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A right triangle has legs a = 3 and b = 4. What is the length of the hypotenuse c?"
        steps={[
          { label: "Formula: c = sqrt(a^2 + b^2)", value: "" },
          { label: "Square the legs: 3^2 + 4^2", value: "9 + 16" },
          { label: "Add", value: "25" },
          { label: "Take the square root", value: "sqrt(25)" },
          { label: "Result", value: "c = 5" },
        ]}
        result="The hypotenuse is 5. This is the classic 3-4-5 Pythagorean triple — the smallest set of whole-number sides that satisfy the theorem."
      />

      <FormulaExplained
        plainEnglish="In any right triangle, the area of the square built on the hypotenuse equals the combined area of the squares built on the two legs. That is what a^2 + b^2 = c^2 actually says — a statement about squares, not just numbers."
        formula={
          <span>
            a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup>
            <br />
            Solve for c: c = sqrt(a<sup>2</sup> + b<sup>2</sup>)
            <br />
            Solve for a leg: a = sqrt(c<sup>2</sup> − b<sup>2</sup>)
          </span>
        }
        citation={{
          label: "Euclid — Elements, Book I, Proposition 47 (Clark University digital edition)",
          href: "https://mathcs.clarku.edu/~djoyce/elements/bookI/propI47.html",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking homework on right triangles and want a fast verification step.",
          "You are framing or building something and need a square corner — measure 3, 4, and 5 to confirm.",
          "You are computing the straight-line distance between two points on a map or screen.",
          "You are studying geometry, trigonometry, or precalculus and want to practice the formula.",
          "You are working with vectors and need the magnitude of a 2D component pair.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Calling the wrong side the hypotenuse.", fix: "The hypotenuse is always opposite the right angle and always the longest side. If you have a side longer than the one you labeled c, you mislabeled." },
          { mistake: "Forgetting to take the square root at the end.", fix: "a^2 + b^2 gives you c-squared, not c. The final step is always sqrt of that sum." },
          { mistake: "Subtracting in the wrong order when solving for a leg.", fix: "It is c^2 − b^2, not b^2 − c^2. The hypotenuse-squared comes first, then subtract the known leg-squared." },
          { mistake: "Applying the theorem to a non-right triangle.", fix: "Only right triangles satisfy a^2 + b^2 = c^2. For any other triangle, use the Law of Cosines." },
          { mistake: "Mixing units.", fix: "All three sides must be in the same unit — inches with inches, meters with meters. Convert before you square." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Hypotenuse", definition: "The longest side of a right triangle, opposite the 90-degree angle." },
          { term: "Leg", definition: "Either of the two shorter sides of a right triangle that form the right angle." },
          { term: "Pythagorean triple", definition: "A set of three whole numbers a, b, c where a^2 + b^2 = c^2 (e.g., 3-4-5)." },
          { term: "Converse", definition: "If three sides satisfy a^2 + b^2 = c^2, the triangle must be a right triangle." },
          { term: "Distance formula", definition: "Two-point distance sqrt((x2 − x1)^2 + (y2 − y1)^2) — a direct application of the theorem." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Pythagorean theorem (geometry)", href: "https://www.khanacademy.org/math/geometry/hs-geo-trig/hs-geo-pyth-theorem/a/pythagorean-theorem" },
          { label: "OpenStax — Algebra and Trigonometry (Pythagorean theorem section)", href: "https://openstax.org/books/algebra-and-trigonometry-2e" },
          { label: "Euclid — Elements, Book I, Proposition 47 (Clark University)", href: "https://mathcs.clarku.edu/~djoyce/elements/bookI/propI47.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["trigonometry-calculator", "angle-calculator", "square-root-calculator"]} />
    </Container>
  );
}
