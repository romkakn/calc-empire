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

const SLUG = "linear-equation-calculator";
const TITLE = "Linear Equation Calculator";
const DESC =
  "Solve y = mx + b from two points or slope-intercept. Graphs the line and finds y from any x (or x from any y).";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between slope and y-intercept?",
    answer:
      "Slope (m) is the steepness of the line — how much y changes for each step of x. The y-intercept (b) is where the line crosses the y-axis, the value of y when x is 0.",
  },
  {
    question: "What is point-slope form?",
    answer:
      "Point-slope form is y − y1 = m(x − x1). It is useful when you know one point on the line and the slope, and you want to write the equation without first solving for the y-intercept.",
  },
  {
    question: "How do I convert to standard form Ax + By = C?",
    answer:
      "Start from y = mx + b and move the x term to the left: −mx + y = b. Multiply through to clear fractions, then flip signs so A is non-negative. The result is Ax + By = C with integer coefficients.",
  },
  {
    question: "When are two lines parallel or perpendicular?",
    answer:
      "Two non-vertical lines are parallel when their slopes are equal. They are perpendicular when their slopes are negative reciprocals — that is, m1 × m2 = −1.",
  },
  {
    question: "Why are horizontal and vertical lines special?",
    answer:
      "A horizontal line has slope 0 and equation y = b. A vertical line has undefined slope and equation x = a — it cannot be written in y = mx + b form because x does not change as y changes.",
  },
  {
    question: "What does slope mean in the real world?",
    answer:
      "Slope is a rate of change. If x is hours and y is dollars earned, the slope is dollars per hour. The y-intercept is the starting value — pay before any hours worked, like a base fee.",
  },
  {
    question: "What if the two points have the same x value?",
    answer:
      "Then the line is vertical and the slope is undefined (division by zero). The equation is x = x1. The calculator flags this case rather than returning a misleading number.",
  },
  {
    question: "How do I find x when I know y?",
    answer:
      "Rearrange y = mx + b to x = (y − b) / m. This works whenever the slope is not zero. If the slope is zero, every x gives the same y, so x is not uniquely determined.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Solve y = mx + b From Two Points`,
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
      name: "How to find the equation of a line from two points",
      steps: [
        { name: "Pick your input mode", text: "Use two points if you have coordinates; use slope-intercept if you already know m and b." },
        { name: "Compute the slope", text: "m = (y2 − y1) / (x2 − x1). If x1 equals x2 the line is vertical and slope is undefined." },
        { name: "Solve for the y-intercept", text: "b = y1 − m × x1. Plug either point into y = mx + b — both give the same b." },
        { name: "Write the equation and evaluate", text: "y = mx + b. Substitute any x to get y, or rearrange to x = (y − b) / m to go the other way." },
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

      <Hero title={TITLE} tagline="Enter two points or a slope and intercept. Get y = mx + b, a graph of the line, and the value of y at any x.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A line passes through (1, 2) and (3, 8). Find the equation in slope-intercept form."
        steps={[
          { label: "Slope: m = (y2 − y1) / (x2 − x1) = (8 − 2) / (3 − 1)", value: "6 / 2 = 3" },
          { label: "Y-intercept: b = y1 − m × x1 = 2 − 3 × 1", value: "−1" },
          { label: "Equation", value: "y = 3x − 1" },
          { label: "Check with the second point: y = 3 × 3 − 1", value: "8 ✓" },
          { label: "Evaluate at x = 5: y = 3 × 5 − 1", value: "14" },
        ]}
        result="The line through (1, 2) and (3, 8) is y = 3x − 1. At x = 5 it gives y = 14."
      />

      <FormulaExplained
        plainEnglish="A linear equation in two variables draws a straight line on the xy-plane. From two points you can find the slope (rise over run) and the y-intercept (where the line crosses the y-axis), then write the line as y = mx + b."
        formula={
          <span>
            Slope: m = (y<sub>2</sub> − y<sub>1</sub>) / (x<sub>2</sub> − x<sub>1</sub>)
            <br />
            Y-intercept: b = y<sub>1</sub> − m × x<sub>1</sub>
            <br />
            Slope-intercept form: y = mx + b
            <br />
            Solve for x: x = (y − b) / m  (when m ≠ 0)
          </span>
        }
        citation={{
          label: "OpenStax — Elementary Algebra 2e, Ch. 4: Graphs of Linear Equations",
          href: "https://openstax.org/books/elementary-algebra-2e/pages/4-introduction",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have two data points and need the line that connects them — for a homework problem or a quick trend.",
          "You know a rate (slope) and a starting value (intercept) and want to predict future values.",
          "You're checking parallel or perpendicular relationships between two lines.",
          "You need to convert between slope-intercept, point-slope, and standard form.",
          "You're teaching algebra and want a worked example with a graph students can read.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Flipping the slope formula to (x2 − x1) / (y2 − y1).", fix: "Slope is rise over run — change in y on top, change in x on the bottom." },
          { mistake: "Subtracting in different orders for the numerator and denominator.", fix: "Use the same order in both: (y2 − y1) and (x2 − x1). Swapping one but not the other flips the sign." },
          { mistake: "Calling a vertical line's slope 'zero'.", fix: "Zero slope means a horizontal line (y = b). Vertical lines have undefined slope and equation x = a." },
          { mistake: "Using y = mx + b for a vertical line.", fix: "Vertical lines can't be written that way. Detect x1 = x2 and write x = x1 instead." },
          { mistake: "Forgetting to check both points.", fix: "After finding m and b, plug the second point into y = mx + b. If it doesn't match, you made an arithmetic slip." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Slope (m)", definition: "Rate of change of y with respect to x — rise over run." },
          { term: "Y-intercept (b)", definition: "Value of y when x = 0; where the line crosses the y-axis." },
          { term: "Point-slope form", definition: "y − y1 = m(x − x1). Built from one point and the slope." },
          { term: "Standard form", definition: "Ax + By = C with integer coefficients and A ≥ 0." },
          { term: "Linear function", definition: "A function f(x) = mx + b whose graph is a straight line." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Elementary Algebra 2e, Graphs of Linear Equations", href: "https://openstax.org/books/elementary-algebra-2e/pages/4-introduction" },
          { label: "Khan Academy — Linear equations and functions", href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:linear-equations-graphs" },
          { label: "Common Core State Standards — Grade 8 Expressions and Equations", href: "https://www.thecorestandards.org/Math/Content/8/EE/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["slope-calculator", "quadratic-formula-calculator", "interpolation-calculator"]} />
    </Container>
  );
}
