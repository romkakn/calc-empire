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

const SLUG = "slope-calculator";
const TITLE = "Slope Calculator";
const DESC =
  "Find the slope of a line from two points, the y-intercept, and the slope-intercept equation y = mx + b.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between positive and negative slope?",
    answer:
      "A positive slope means the line rises as you move from left to right — y grows when x grows. A negative slope means the line falls as you move from left to right — y shrinks when x grows.",
  },
  {
    question: "What does a zero slope mean?",
    answer:
      "A slope of zero describes a horizontal line. The y-value stays the same no matter what x is, so the equation is just y = b.",
  },
  {
    question: "Why is a vertical line's slope undefined?",
    answer:
      "A vertical line has the same x-value at every point, so the run (x₂ − x₁) is zero. Dividing by zero is undefined, so vertical lines have no slope number — they are written as x = c instead.",
  },
  {
    question: "How does slope relate to rate of change?",
    answer:
      "Slope is the rate of change of y with respect to x. If x is time and y is distance, the slope is speed. If x is hours worked and y is pay, the slope is the hourly wage.",
  },
  {
    question: "When are two lines parallel or perpendicular?",
    answer:
      "Two non-vertical lines are parallel when their slopes are equal. They are perpendicular when their slopes multiply to −1 — for example, a line with slope 2 is perpendicular to a line with slope −1/2.",
  },
  {
    question: "How is slope used in real life, like the grade of a road?",
    answer:
      "Road grade is slope written as a percent. A 6% grade rises 6 feet for every 100 feet of horizontal distance, which is a slope of 0.06. Roof pitch, wheelchair ramps, and ski runs all use the same idea.",
  },
  {
    question: "What units does slope have?",
    answer:
      "Slope is a ratio of the y-units to the x-units. If y is in dollars and x is in hours, the slope is in dollars per hour. When x and y use the same unit, the slope is a pure number.",
  },
  {
    question: "How do I find the y-intercept from two points?",
    answer:
      "First compute the slope m = (y₂ − y₁) / (x₂ − x₁). Then plug either point into y = mx + b and solve for b: b = y − m·x. The y-intercept is where the line crosses the y-axis.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Two Points to y = mx + b`,
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
      name: "How to find the slope of a line from two points",
      steps: [
        { name: "Label the points", text: "Call your two points (x₁, y₁) and (x₂, y₂). The order does not matter as long as you stay consistent." },
        { name: "Compute rise over run", text: "Slope m = (y₂ − y₁) / (x₂ − x₁). Rise is the change in y; run is the change in x." },
        { name: "Find the y-intercept", text: "Plug one point into y = mx + b and solve: b = y₁ − m·x₁." },
        { name: "Write the equation", text: "Put m and b back into y = mx + b. That is the slope-intercept form of your line." },
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
        tagline="Enter two points and get the slope, the y-intercept, and the line's equation in slope-intercept form."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A line passes through the points (1, 2) and (4, 8). Find the slope, the y-intercept, and the equation of the line."
        steps={[
          { label: "Slope formula: m = (y₂ − y₁) / (x₂ − x₁)", value: "" },
          { label: "Plug in: (8 − 2) / (4 − 1)", value: "6 / 3" },
          { label: "Simplify", value: "m = 2" },
          { label: "y-intercept: b = y₁ − m·x₁ = 2 − 2·1", value: "b = 0" },
          { label: "Slope-intercept equation", value: "y = 2x" },
        ]}
        result="The line through (1, 2) and (4, 8) has slope 2, y-intercept 0, and equation y = 2x."
      />

      <FormulaExplained
        plainEnglish="Slope is rise over run — how much the line goes up for each step to the right. The y-intercept is where the line crosses the y-axis. Together they give you the equation y = mx + b, which lets you find y for any x."
        formula={
          <span>
            m = (y<sub>2</sub> − y<sub>1</sub>) / (x<sub>2</sub> − x<sub>1</sub>)
            <br />
            b = y<sub>1</sub> − m · x<sub>1</sub>
            <br />
            Equation: y = m · x + b
          </span>
        }
        citation={{
          label: "OpenStax — Elementary Algebra 2e, Section 4.5: Use the Slope-Intercept Form of an Equation of a Line",
          href: "https://openstax.org/books/elementary-algebra-2e/pages/4-5-use-the-slope-intercept-form-of-an-equation-of-a-line",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have two points from a graph or table and need the line's equation.",
          "You are studying linear equations for algebra, pre-calculus, or an SAT review.",
          "You are working out the grade of a road, ramp, roof, or ski run.",
          "You are checking whether two lines are parallel or perpendicular.",
          "You are interpreting a rate of change in science, business, or economics — speed, cost per unit, growth per year.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Subtracting the coordinates in different orders.", fix: "If you start with y₂ − y₁ on top, you must use x₂ − x₁ on the bottom. Mixing the order flips the sign of the slope." },
          { mistake: "Swapping rise and run.", fix: "Rise is the change in y (up or down). Run is the change in x (left or right). m = rise / run, not run / rise." },
          { mistake: "Calling a vertical line's slope zero.", fix: "A vertical line's slope is undefined, not zero. Zero slope belongs to horizontal lines." },
          { mistake: "Forgetting the sign on a negative slope.", fix: "If y decreases when x increases, the slope is negative. Double-check the sign before writing the equation." },
          { mistake: "Mixing up the y-intercept and the x-intercept.", fix: "The y-intercept is the value of y when x = 0. The x-intercept is the value of x when y = 0. They are not the same point." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Rise", definition: "The vertical change between two points: y₂ − y₁." },
          { term: "Run", definition: "The horizontal change between two points: x₂ − x₁." },
          { term: "y-intercept", definition: "The y-value where a line crosses the y-axis. In y = mx + b, it is b." },
          { term: "Slope-intercept form", definition: "The equation y = mx + b, where m is the slope and b is the y-intercept." },
          { term: "Point-slope form", definition: "An equivalent form: y − y₁ = m(x − x₁), useful when you know one point and the slope." },
          { term: "Rate of change", definition: "How fast one quantity changes as another changes. Slope is the rate of change of y with respect to x." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Elementary Algebra 2e, Section 4.5 (Slope-Intercept Form)", href: "https://openstax.org/books/elementary-algebra-2e/pages/4-5-use-the-slope-intercept-form-of-an-equation-of-a-line" },
          { label: "OpenStax — Elementary Algebra 2e, Section 4.4 (Understand Slope of a Line)", href: "https://openstax.org/books/elementary-algebra-2e/pages/4-4-understand-slope-of-a-line" },
          { label: "Khan Academy — Linear equations and graphs (Algebra 1)", href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:linear-equations-graphs" },
          { label: "U.S. Bureau of Labor Statistics — Handbook of Methods, Consumer Price Index", href: "https://www.bls.gov/opub/hom/cpi/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["quadratic-formula-calculator", "square-root-calculator", "fractions-calculator"]} />
    </Container>
  );
}
