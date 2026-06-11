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

const SLUG = "integral-calculator";
const TITLE = "Integral Calculator";
const DESC =
  "Antiderivative for polynomials, exponentials, and basic trig — definite and indefinite, with steps you can follow.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between an indefinite and a definite integral?",
    answer:
      "An indefinite integral returns a family of antiderivatives — a function plus a constant of integration (+ C). A definite integral evaluates that antiderivative at two bounds and subtracts, giving a single number that represents net signed area.",
  },
  {
    question: "Why does the indefinite integral need a + C?",
    answer:
      "Because differentiating a constant returns zero, infinitely many functions share the same derivative. The + C captures that whole family. When you then apply bounds for a definite integral, the constants cancel and disappear.",
  },
  {
    question: "What is the Fundamental Theorem of Calculus?",
    answer:
      "It connects differentiation and integration. If F is an antiderivative of f, then the definite integral of f from a to b equals F(b) minus F(a). That is what lets you evaluate areas without summing infinitely many rectangles.",
  },
  {
    question: "What is u-substitution in plain English?",
    answer:
      "It is the chain rule played backwards. You rename a chunk of the integrand as u, rewrite du in the same variable, and the integral usually becomes a basic one you already know. Once integrated, swap u back to x.",
  },
  {
    question: "When do I use integration by parts?",
    answer:
      "Use it when the integrand is a product of two unlike functions — for example, x times e^x, or x times ln x. The rule is integral of u dv equals u times v minus the integral of v du. Pick u so that du is simpler than u.",
  },
  {
    question: "How does a definite integral relate to area under a curve?",
    answer:
      "Geometrically, the definite integral is the signed area between the curve and the x-axis between the bounds. Area above the axis counts positive, area below counts negative. If the function crosses zero inside the interval, the result can be smaller than the visible area.",
  },
  {
    question: "What are the most common integrals to memorize?",
    answer:
      "Power rule x^n integrates to x^(n+1)/(n+1) for n not equal to -1. The integral of 1/x is ln|x|. The integral of e^x is e^x. The integral of sin x is -cos x, and the integral of cos x is sin x. Each gets a + C in the indefinite form.",
  },
  {
    question: "Does this calculator handle every integral?",
    answer:
      "No. It covers the basic building blocks — single-term polynomials, exponentials, and basic trig — that show up in introductory calculus. For products, quotients, and chained expressions, work the algebra by hand or step up to a computer algebra system.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Definite and Indefinite Antiderivatives`,
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
      name: "How to compute a basic integral",
      steps: [
        { name: "Pick a function type", text: "Choose power, exponential, or trig — the form decides which antiderivative rule applies." },
        { name: "Enter the coefficient and exponent", text: "For 2x^3, the coefficient is 2 and the power is 3. For sin or cos, only the coefficient matters." },
        { name: "Apply the matching rule", text: "Power rule x^n integrates to x^(n+1)/(n+1) for n not equal to -1. e^x integrates to e^x. sin x integrates to -cos x. cos x integrates to sin x." },
        { name: "If definite, evaluate F(b) minus F(a)", text: "Plug the upper bound into the antiderivative, plug the lower bound, then subtract. The constant of integration cancels." },
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

      <Hero title={TITLE} tagline="Get the antiderivative of a basic term — or evaluate it between two bounds — with the steps spelled out.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Evaluate the definite integral of 2x with respect to x from 0 to 3."
        steps={[
          { label: "Power rule: integral of x^n dx = x^(n+1)/(n+1) + C", value: "" },
          { label: "Antiderivative of 2x", value: "x^2 + C" },
          { label: "Evaluate at upper bound x = 3", value: "9" },
          { label: "Evaluate at lower bound x = 0", value: "0" },
          { label: "Subtract F(b) − F(a)", value: "9 − 0 = 9" },
        ]}
        result="The definite integral of 2x from 0 to 3 equals 9 — the area of the triangle under y = 2x on [0, 3]."
      />

      <FormulaExplained
        plainEnglish="Integration reverses differentiation. The power rule handles polynomials, the exponential rule handles e^x, and the trig rules handle sin and cos. For a definite integral, evaluate the antiderivative at the upper bound and subtract its value at the lower bound — that is the Fundamental Theorem of Calculus."
        formula={
          <span>
            integral x^n dx = x^(n+1)/(n+1) + C &nbsp;(n ≠ -1)
            <br />
            integral 1/x dx = ln|x| + C
            <br />
            integral e^x dx = e^x + C
            <br />
            integral sin x dx = -cos x + C
            <br />
            integral cos x dx = sin x + C
            <br />
            Definite: integral from a to b of f(x) dx = F(b) − F(a)
          </span>
        }
        citation={{
          label: "OpenStax — Calculus Volume 1, Chapter 5: Integration",
          href: "https://openstax.org/books/calculus-volume-1/pages/5-introduction",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking homework on basic antiderivatives before submitting it.",
          "You want to confirm a power-rule integral after applying u-substitution by hand.",
          "You are a tutor walking a student through the Fundamental Theorem of Calculus.",
          "You are studying for an AP Calculus or first-year college calculus exam.",
          "You need a quick sanity check on a definite integral before plotting net signed area.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting the + C on an indefinite integral.", fix: "Every antiderivative includes a constant of integration. Drop it only after you apply bounds — the constants cancel in a definite integral." },
          { mistake: "Applying the power rule when n = -1.", fix: "x^(-1) integrates to ln|x|, not x^0/0. The power rule explicitly excludes n = -1." },
          { mistake: "Mixing up the sign on integral of sin x.", fix: "Integral of sin x is -cos x + C. Integral of cos x is +sin x + C. Differentiate your answer to check the sign." },
          { mistake: "Subtracting F(a) − F(b) instead of F(b) − F(a).", fix: "Always upper minus lower. Reversing it negates the result." },
          { mistake: "Treating a negative definite integral as a bug.", fix: "A definite integral measures signed area. If the curve sits below the x-axis on part of the interval, the result can be negative or smaller than the visible area." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Antiderivative", definition: "A function F whose derivative equals f. Indefinite integration returns the family F + C." },
          { term: "Constant of integration (+ C)", definition: "The arbitrary constant added to every indefinite integral, accounting for the fact that constants vanish when differentiated." },
          { term: "Definite integral", definition: "The signed area between a curve and the x-axis between bounds a and b, computed as F(b) − F(a)." },
          { term: "Fundamental Theorem of Calculus", definition: "Links differentiation and integration: the definite integral of f from a to b equals F(b) − F(a) for any antiderivative F." },
          { term: "u-substitution", definition: "A technique that reverses the chain rule by renaming an inner function as u so the integrand becomes a basic form." },
          { term: "Integration by parts", definition: "Rule for products of unlike functions: integral of u dv equals u·v minus integral of v du." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Calculus Volume 1, Chapter 5: Integration", href: "https://openstax.org/books/calculus-volume-1/pages/5-introduction" },
          { label: "Khan Academy — AP Calculus AB: Integration and accumulation of change", href: "https://www.khanacademy.org/math/ap-calculus-ab/ab-integration-new" },
          { label: "MIT OpenCourseWare — 18.01 Single Variable Calculus", href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" },
          { label: "Paul's Online Math Notes — Calculus I: Integrals", href: "https://tutorial.math.lamar.edu/Classes/CalcI/IntegralsIntro.aspx" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["derivative-calculator", "limit-calculator", "surface-area-calculator"]} />
    </Container>
  );
}
