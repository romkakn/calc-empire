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

const SLUG = "derivative-calculator";
const TITLE = "Derivative Calculator";
const DESC =
  "Take the derivative of polynomials, exponentials, logs, sin/cos. Step-by-step rules.";

const FAQS: FaqItem[] = [
  {
    question: "What is the power rule?",
    answer:
      "The power rule says d/dx of x^n equals n times x^(n-1). For example, d/dx of x^3 is 3x^2. It is the most common rule you will use for polynomials.",
  },
  {
    question: "What is the product rule?",
    answer:
      "The product rule covers two functions multiplied together: (fg)' = f'g + fg'. You take the derivative of the first, multiply by the second, then add the first times the derivative of the second. Use it when neither factor is a simple constant.",
  },
  {
    question: "What is the quotient rule?",
    answer:
      "For a fraction f over g, the derivative is (f'g - fg') divided by g squared. A common memory aid is low d-high minus high d-low over low squared. Make sure the bottom is not zero at your point of interest.",
  },
  {
    question: "What is the chain rule?",
    answer:
      "The chain rule handles nested functions: (f(g(x)))' = f'(g(x)) times g'(x). Differentiate the outer function evaluated at the inner one, then multiply by the derivative of the inner function. Example: d/dx of sin(2x) is 2cos(2x).",
  },
  {
    question: "What are the most common derivatives I should memorize?",
    answer:
      "Memorize: d/dx of x^n is n x^(n-1), d/dx of e^x is e^x, d/dx of ln(x) is 1/x, d/dx of sin(x) is cos(x), and d/dx of cos(x) is -sin(x). These cover roughly 80 percent of first-year calculus problems.",
  },
  {
    question: "What is the difference between a derivative and a differential?",
    answer:
      "A derivative is a rate, written dy/dx, that tells you how fast y changes per unit of x. A differential, written dy, is a small change in y predicted by the derivative: dy = f'(x) dx. The derivative is the slope; the differential is the rise that goes with a given run.",
  },
  {
    question: "What is implicit differentiation?",
    answer:
      "Use implicit differentiation when y is tied to x by an equation you cannot easily solve for y, like x^2 + y^2 = 25. Differentiate both sides with respect to x, treating y as a function of x and applying the chain rule, then solve for dy/dx.",
  },
  {
    question: "What is a second derivative used for?",
    answer:
      "The second derivative, f''(x), measures how fast the slope itself is changing. In physics it is acceleration when the first derivative is velocity. In graphing it tells you whether a curve is concave up or concave down.",
  },
  {
    question: "How do derivatives show up in the real world?",
    answer:
      "If position is s(t), velocity is s'(t) and acceleration is s''(t). Derivatives also model marginal cost in economics, reaction rates in chemistry, and the slope of any curve you fit to data. Anywhere a rate of change matters, a derivative is the tool.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Step-by-Step Rules`,
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
      name: "How to take a derivative",
      steps: [
        { name: "Pick the function type", text: "Polynomial, exponential, logarithm, or trig function — each has its own base rule." },
        { name: "Enter the coefficient and power", text: "For 3x^4 the coefficient is 3 and the power is 4. For sin(2x) the inside multiplier is 2." },
        { name: "Apply the matching rule", text: "Power rule for x^n, e^x stays e^x, ln(x) becomes 1/x, sin becomes cos, cos becomes -sin." },
        { name: "Chain rule for nesting", text: "If there is an inside function, multiply by its derivative. Example: d/dx of sin(2x) = 2cos(2x)." },
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

      <Hero title={TITLE} tagline="Differentiate polynomials, exponentials, logs, and trig functions — with the rule and the worked step shown each time.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student needs d/dx of 3x^4, and then d/dx of sin(2x) using the chain rule."
        steps={[
          { label: "Power rule: d/dx(x^n) = n·x^(n-1)", value: "" },
          { label: "Apply to 3x^4: multiply coefficient by power", value: "3 · 4 = 12" },
          { label: "Subtract 1 from the power", value: "12x^3" },
          { label: "Chain rule on sin(2x): outer derivative is cos(2x)", value: "cos(2x)" },
          { label: "Multiply by inner derivative d/dx(2x) = 2", value: "2cos(2x)" },
        ]}
        result="d/dx(3x^4) = 12x^3. d/dx(sin(2x)) = 2cos(2x)."
      />

      <FormulaExplained
        plainEnglish="A derivative measures the slope of a function at a point — how fast the output changes when you nudge the input. Each function family has a short rule, and the chain rule glues them together when functions are nested."
        formula={
          <span>
            d/dx(x<sup>n</sup>) = n·x<sup>n−1</sup>
            <br />
            d/dx(e<sup>x</sup>) = e<sup>x</sup> · d/dx(ln x) = 1/x
            <br />
            d/dx(sin x) = cos x · d/dx(cos x) = −sin x
            <br />
            Product: (fg)′ = f′g + fg′
            <br />
            Chain: (f(g(x)))′ = f′(g(x)) · g′(x)
          </span>
        }
        citation={{
          label: "OpenStax — Calculus Volume 1, Chapter 3 (Derivatives)",
          href: "https://openstax.org/books/calculus-volume-1/pages/3-introduction",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are working through a Calculus 1 homework set and want to check each step.",
          "You need the slope of a curve at a specific point for a physics or engineering problem.",
          "You are studying for the AP Calculus AB or BC exam and want a quick rule reminder.",
          "You are reviewing optimization or related-rates problems and want to verify the derivative before solving.",
          "You are a tutor explaining the power, product, or chain rule to a student.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting to subtract 1 from the exponent.", fix: "Power rule is n·x^(n−1), not n·x^n. The exponent always drops by 1." },
          { mistake: "Skipping the chain rule on inside functions.", fix: "For sin(2x), the derivative is 2cos(2x), not cos(2x). Multiply by the derivative of the inside." },
          { mistake: "Using the product rule when one factor is a constant.", fix: "d/dx of 5·x^3 is just 5·3x^2 = 15x^2. Constants pull out — no product rule needed." },
          { mistake: "Treating ln(x) like 1/x^2 or other shortcuts.", fix: "d/dx of ln(x) is exactly 1/x for x > 0. Do not confuse with the integral or with d/dx of 1/x." },
          { mistake: "Mixing up the sign on d/dx of cos(x).", fix: "d/dx(cos x) = −sin x. The minus sign is the most missed point on quizzes." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Derivative", definition: "The instantaneous rate of change of a function — the slope of its tangent line at a point." },
          { term: "Differential", definition: "A small change dy linked to dx by dy = f'(x)·dx. Used in linear approximation and integration." },
          { term: "Chain rule", definition: "The rule for differentiating a function of a function: (f(g(x)))' = f'(g(x))·g'(x)." },
          { term: "Second derivative", definition: "The derivative of the derivative, f''(x). Signals concavity and acceleration." },
          { term: "Tangent line", definition: "A straight line that touches a curve at one point and has the same slope as the curve there." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Calculus 1: Differentiation", href: "https://www.khanacademy.org/math/calculus-1" },
          { label: "OpenStax — Calculus Volume 1", href: "https://openstax.org/details/books/calculus-volume-1" },
          { label: "MIT OpenCourseWare — 18.01 Single Variable Calculus", href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["integral-calculator", "limit-calculator", "quadratic-formula-calculator"]} />
    </Container>
  );
}
