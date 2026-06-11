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

const SLUG = "interpolation-calculator";
const TITLE = "Interpolation Calculator";
const DESC =
  "Linear interpolation between two points. Solve for y at any x — with a step-by-step worked example and the lerp formula.";

const FAQS: FaqItem[] = [
  {
    question: "What is linear interpolation?",
    answer:
      "Linear interpolation estimates a value between two known points by drawing a straight line through them. You move along that line to your target x, and read off the matching y. It assumes the underlying relationship is roughly straight between the two points.",
  },
  {
    question: "Linear vs cubic interpolation — what's the difference?",
    answer:
      "Linear uses two points and a straight segment. Cubic interpolation uses four points and a smooth curve, giving a closer fit when the data bends. Cubic is more accurate for curved data but needs more inputs and is slower to compute by hand.",
  },
  {
    question: "What is extrapolation, and why is it risky?",
    answer:
      "Extrapolation extends the line past your two known points to predict values outside that range. It's risky because real data often changes direction outside the sampled window, so the straight-line guess can be far off. Stay inside x1 and x2 when you can.",
  },
  {
    question: "When is linear interpolation safe to use?",
    answer:
      "It's safe when the data is smooth and roughly straight between the two points, and your target x sits between them. Closely spaced sample points also help. If the data is noisy or curved, prefer cubic or spline interpolation.",
  },
  {
    question: "What is spline interpolation?",
    answer:
      "A spline fits a series of low-degree polynomials (often cubic) across many data points, joining them smoothly. The result is a single curve that passes through every sample without sharp corners. Splines are common in graphics, engineering, and scientific computing.",
  },
  {
    question: "Where is interpolation used in real life?",
    answer:
      "Table lookup is the classic case — steam tables, tax brackets, statistical tables, and lookup tables in older engineering handbooks all use linear interpolation between rows. Animation, audio resampling, GPS path smoothing, and sensor calibration also rely on it.",
  },
  {
    question: "What's the lerp formula?",
    answer:
      "Lerp stands for linear interpolation. The compact form is lerp(t) = y1 + t × (y2 − y1), where t = (x − x1) / (x2 − x1). When t is 0 you get y1, when t is 1 you get y2, and values between give the in-between point.",
  },
  {
    question: "What if my two x values are the same?",
    answer:
      "Then the formula divides by zero and there's no unique answer — a vertical line passes through every y. The calculator flags this case. Pick two distinct x values to interpolate.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Linear Interpolation Between Two Points`,
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
      name: "How to linearly interpolate between two points",
      steps: [
        { name: "Enter the first point", text: "Type the known coordinates (x1, y1) — the lower end of your range." },
        { name: "Enter the second point", text: "Type the known coordinates (x2, y2) — the upper end of your range." },
        { name: "Enter your target x", text: "The x value you want the y for. Keep it between x1 and x2 to avoid extrapolation." },
        { name: "Read the y result", text: "The calculator returns y = y1 + (x − x1) × (y2 − y1) / (x2 − x1)." },
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

      <Hero title={TITLE} tagline="Plug in two points and a target x. Get y, the interpolation fraction t, and a warning if you wander outside the known range.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You know two points on a line: (0, 10) and (10, 30). What is y when x = 4?"
        steps={[
          { label: "Formula: y = y1 + (x − x1) × (y2 − y1) / (x2 − x1)", value: "" },
          { label: "Plug in: 10 + (4 − 0) × (30 − 10) / (10 − 0)", value: "" },
          { label: "Compute the slope (30 − 10) / (10 − 0)", value: "2" },
          { label: "Multiply by (x − x1) = 4", value: "8" },
          { label: "Add y1 = 10", value: "18" },
        ]}
        result="y = 18. Your point on the line is (4, 18), and the interpolation fraction t = 0.4 — 40% of the way from the first point to the second."
      />

      <FormulaExplained
        plainEnglish="Two points define a straight line. To find any y on that line, take the slope between the points, scale it by how far x has moved past x1, then add y1. The lerp form does the same thing using a 0-to-1 fraction t."
        formula={
          <span>
            y = y1 + (x − x1) × (y2 − y1) / (x2 − x1)
            <br />
            lerp(t) = y1 + t × (y2 − y1), where t = (x − x1) / (x2 − x1)
            <br />
            At t = 0 you get y1; at t = 1 you get y2.
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — Linear Interpolation",
          href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda33.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have a printed lookup table (steam, tax, statistics) and need a value between two listed rows.",
          "You're animating a value from a start to an end over time — lerp is the standard tool.",
          "You're calibrating a sensor and need to convert a raw reading using two known reference points.",
          "You're studying algebra and want to check linear-equation homework against a worked example.",
          "You're resampling audio, image, or GPS data and need an in-between sample.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Extrapolating past the two known points without a warning.", fix: "Keep your target x between x1 and x2. If you must go outside, expect error to grow with distance." },
          { mistake: "Swapping x and y in the formula.", fix: "x is the input (the value you choose), y is the output (the answer). Label your inputs carefully." },
          { mistake: "Using linear interpolation on clearly curved data.", fix: "If the data bends between samples, switch to cubic or spline interpolation, or add more sample points." },
          { mistake: "Picking two x values that are equal.", fix: "Identical x values make the slope undefined (division by zero). Choose distinct x1 and x2." },
          { mistake: "Trusting interpolation on noisy measurements.", fix: "Smooth or fit the data first (e.g., linear regression), then interpolate the fit — not the raw noise." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Lerp", definition: "Short for linear interpolation. y1 + t × (y2 − y1), with t in [0, 1]." },
          { term: "Extrapolation", definition: "Using the same formula outside the [x1, x2] range. Less reliable than interpolation." },
          { term: "Slope", definition: "Rise over run between the two points: (y2 − y1) / (x2 − x1)." },
          { term: "Spline", definition: "A piecewise low-degree polynomial fit, often cubic, joined smoothly across many points." },
          { term: "Cubic interpolation", definition: "Fits a cubic polynomial through four points for a smoother result than a straight line." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — Linear Interpolation", href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda33.htm" },
          { label: "OpenStax College Physics — Mathematics Appendix", href: "https://openstax.org/books/college-physics-2e/pages/a-atomic-masses" },
          { label: "Khan Academy — Linear equations and functions", href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:linear-equations-graphs" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["linear-equation-calculator", "linear-regression-calculator", "slope-calculator"]} />
    </Container>
  );
}
