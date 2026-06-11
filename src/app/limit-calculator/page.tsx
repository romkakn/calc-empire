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

const SLUG = "limit-calculator";
const TITLE = "Limit Calculator";
const DESC =
  "Evaluate limits of polynomials, rationals, and trig functions as x approaches a finite value or infinity — with steps.";

const FAQS: FaqItem[] = [
  {
    question: "What is a one-sided limit vs a two-sided limit?",
    answer:
      "A one-sided limit looks at the function as x approaches a value from only the left (x → a⁻) or only the right (x → a⁺). A two-sided limit exists only when both one-sided limits exist and equal the same number. If the left and right limits disagree, the two-sided limit does not exist.",
  },
  {
    question: "When can I use L'Hôpital's rule?",
    answer:
      "L'Hôpital's rule applies only when direct substitution gives an indeterminate form like 0/0 or ∞/∞, and both f and g are differentiable near the point. Then lim f(x)/g(x) = lim f'(x)/g'(x). If the result is still indeterminate, you can apply the rule again.",
  },
  {
    question: "What are the indeterminate forms?",
    answer:
      "The seven indeterminate forms are 0/0, ∞/∞, 0·∞, ∞−∞, 0⁰, ∞⁰, and 1^∞. These cannot be evaluated by substitution alone. You typically use algebra, L'Hôpital's rule, or a known limit identity to resolve them.",
  },
  {
    question: "What does continuity have to do with limits?",
    answer:
      "A function f is continuous at x = a when lim (x → a) f(x) equals f(a). For continuous functions like polynomials, direct substitution always works. Limits become interesting at points where the function is not continuous.",
  },
  {
    question: "How do I find a limit at infinity?",
    answer:
      "For a rational function as x → ∞, the highest-degree term dominates. Divide top and bottom by the highest power of x in the denominator and read off the result. If the numerator has higher degree the limit is ±∞; equal degrees give the ratio of leading coefficients; lower numerator degree gives 0.",
  },
  {
    question: "What is the squeeze theorem?",
    answer:
      "If g(x) ≤ f(x) ≤ h(x) near a point, and both g and h approach the same limit L at that point, then f also approaches L. It is the standard way to evaluate limits like lim (x → 0) x · sin(1/x) = 0, where direct methods fail but bounds are clear.",
  },
  {
    question: "Does this calculator do symbolic limits?",
    answer:
      "It handles the common patterns covered in a first calculus course: polynomials, rational functions, and basic trig forms, at a finite point or at ±∞. For unusual symbolic limits, a full computer algebra system like SymPy or WolframAlpha is a better tool.",
  },
  {
    question: "What if the limit does not exist?",
    answer:
      "The calculator reports DNE when the left and right one-sided limits disagree, when the function oscillates without settling, or when the result diverges to ±∞ from only one side. A divergent two-sided limit to +∞ or −∞ is reported as the infinite value, not as DNE.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Polynomial, Rational, Trig Limits with Steps`,
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
      name: "How to evaluate a limit",
      steps: [
        { name: "Try direct substitution", text: "If the function is continuous at the point, plug in x = a and you are done." },
        { name: "Identify the indeterminate form", text: "If substitution gives 0/0 or ∞/∞, you need algebra or L'Hôpital before you can finish." },
        { name: "Simplify or differentiate", text: "Factor and cancel, multiply by a conjugate, or apply L'Hôpital: lim f/g = lim f'/g'." },
        { name: "Check from both sides", text: "Confirm the left and right one-sided limits agree. For limits at infinity, compare degrees of numerator and denominator." },
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

      <Hero title={TITLE} tagline="Find limits of polynomial, rational, and trig functions as x approaches a number or infinity — see the substitution, factoring, or dominant-term step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Evaluate lim (x → 2) of (x² − 4)/(x − 2), and lim (x → ∞) of (3x² + 1)/x²."
        steps={[
          { label: "Substitute x = 2 into (x² − 4)/(x − 2)", value: "0 / 0  → indeterminate" },
          { label: "Factor the numerator: x² − 4 = (x − 2)(x + 2)", value: "" },
          { label: "Cancel the (x − 2) factor", value: "lim (x → 2) (x + 2)" },
          { label: "Substitute x = 2 into x + 2", value: "4" },
          { label: "Second limit: degrees equal, take ratio of leading coefficients 3/1", value: "3" },
        ]}
        result="lim (x → 2) (x² − 4)/(x − 2) = 4. lim (x → ∞) (3x² + 1)/x² = 3."
      />

      <FormulaExplained
        plainEnglish="A limit asks what value a function approaches as the input gets close to some target. When the function is continuous you just plug in. When you hit 0/0 or ∞/∞, you either simplify algebraically or differentiate the top and bottom with L'Hôpital. For x → ∞ on a rational function, the highest-degree term wins."
        formula={
          <span>
            Continuous case: lim (x → a) f(x) = f(a)
            <br />
            L&apos;Hôpital (0/0 or ∞/∞): lim f(x)/g(x) = lim f&apos;(x)/g&apos;(x)
            <br />
            Rational at infinity: lim (x → ∞) p(x)/q(x) depends on deg(p) vs deg(q)
            <br />
            Equal degrees: ratio of leading coefficients
          </span>
        }
        citation={{
          label: "OpenStax — Calculus Volume 1, Chapter 2: Limits",
          href: "https://openstax.org/books/calculus-volume-1/pages/2-introduction",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are checking a homework answer for a limit problem in a first calculus course.",
          "You need to confirm whether a 0/0 form simplifies by factoring or needs L'Hôpital.",
          "You are evaluating end behavior of a rational function before sketching its graph.",
          "You are reviewing limits before a derivative quiz and want the substitution-vs-algebra distinction reinforced.",
          "You are tutoring someone through indeterminate forms and want a worked answer to compare against.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Plugging in and reporting 0/0 as the answer.", fix: "0/0 is an indeterminate form, not a value. You must simplify, factor, or apply L'Hôpital before you have a real limit." },
          { mistake: "Using L'Hôpital on a form that is not indeterminate.", fix: "L'Hôpital only applies to 0/0 and ∞/∞ (and similar after rewriting). Applying it to a 1/0 or 2/3 form gives wrong answers." },
          { mistake: "Forgetting to check both one-sided limits.", fix: "A two-sided limit exists only when the left and right limits agree. Functions with jumps or vertical asymptotes need both sides checked." },
          { mistake: "Cancelling without noting the domain change.", fix: "Cancelling (x − 2) in (x² − 4)/(x − 2) is valid for the limit, but the simplified function still has a hole at x = 2 — the limit equals the filled-in value, not the original function value." },
          { mistake: "Comparing the wrong degree at infinity.", fix: "For rational limits at ∞, look at the highest power of x in the denominator first, then divide top and bottom by it." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Indeterminate form", definition: "An expression like 0/0 or ∞/∞ whose value depends on the specific functions, not just the form." },
          { term: "L'Hôpital's rule", definition: "For 0/0 or ∞/∞ forms, lim f/g equals lim f'/g' when the right-hand limit exists." },
          { term: "One-sided limit", definition: "The value a function approaches from only the left (x → a⁻) or only the right (x → a⁺)." },
          { term: "Continuity at a point", definition: "f is continuous at a when lim (x → a) f(x) = f(a). Polynomials are continuous everywhere." },
          { term: "Squeeze theorem", definition: "If g ≤ f ≤ h near a point and g and h share a limit, then f has the same limit." },
          { term: "Limit at infinity", definition: "The value a function approaches as x grows without bound. For rational functions, leading degrees decide." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Calculus Volume 1 (Limits, Chapter 2)", href: "https://openstax.org/books/calculus-volume-1/pages/2-introduction" },
          { label: "Khan Academy — Limits and continuity (AP Calculus AB)", href: "https://www.khanacademy.org/math/ap-calculus-ab/ab-limits-new" },
          { label: "Paul's Online Math Notes — Limits", href: "https://tutorial.math.lamar.edu/Classes/CalcI/limitsIntro.aspx" },
          { label: "MIT OpenCourseWare — Single Variable Calculus (18.01)", href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["derivative-calculator", "integral-calculator", "quadratic-formula-calculator"]} />
    </Container>
  );
}
