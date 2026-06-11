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

const SLUG = "arc-length-calculator";
const TITLE = "Arc Length Calculator";
const DESC =
  "Length of a circular arc from radius and angle (degrees or radians). Also reports sector area and fraction of the full circle.";

const FAQS: FaqItem[] = [
  {
    question: "What is the arc length formula?",
    answer:
      "Arc length s equals the radius r times the central angle in radians: s = r × θ. If your angle is in degrees, convert first: s = r × θ° × π / 180.",
  },
  {
    question: "What is the difference between degrees and radians?",
    answer:
      "Degrees split a circle into 360 equal parts. Radians use the radius itself as the yardstick — one radian is the angle that produces an arc as long as the radius. A full circle is 2π radians, which equals 360 degrees.",
  },
  {
    question: "Why does the formula multiply by pi over 180?",
    answer:
      "π / 180 is the conversion factor from degrees to radians. Since 180 degrees equals π radians, dividing a degree value by 180 and multiplying by π gives the matching radian value. The arc length formula needs radians to work.",
  },
  {
    question: "How do I find the sector area from arc length?",
    answer:
      "Sector area equals one half times the radius squared times the angle in radians: A = ½ × r² × θ. You can also write it as A = ½ × r × s, where s is the arc length you already calculated.",
  },
  {
    question: "Is the circumference of a circle a special case?",
    answer:
      "Yes. When the central angle is a full turn — 360 degrees or 2π radians — the arc length equals the full circumference: s = r × 2π = 2πr. The arc length formula reduces to the familiar circumference formula at this angle.",
  },
  {
    question: "Where is arc length used in real life?",
    answer:
      "Engineers use it for pulley belts, conveyor wraps, and gear teeth spacing. Surveyors use it for curved roads and railway bends. Anywhere a wheel rolls or a curve needs measuring, the arc length formula shows up.",
  },
  {
    question: "What happens if the angle is bigger than a full circle?",
    answer:
      "The math still works — the arc wraps around the circle more than once. An angle of 720 degrees (4π radians) gives an arc length equal to two full circumferences. Most calculators accept any positive angle.",
  },
  {
    question: "Can the radius or angle be negative?",
    answer:
      "A negative radius has no geometric meaning, so the calculator expects a positive value. A negative angle is fine in math — it just means the arc sweeps the other direction — but the length is the same as its positive twin.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Radius, Angle, Sector Area`,
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
      name: "How to calculate the length of a circular arc",
      steps: [
        { name: "Measure the radius", text: "Pick the distance from the center of the circle to the arc, in any length unit (cm, in, m). The result will be in the same unit." },
        { name: "Pick the angle unit", text: "Decide whether the central angle is in degrees or radians, and toggle the calculator to match." },
        { name: "Enter the angle", text: "Type the central angle that the arc spans. A full circle is 360 degrees or 2π (~6.283) radians." },
        { name: "Read arc length and sector area", text: "The calculator returns s = r × θ_rad for arc length and A = ½ × r² × θ_rad for the wedge-shaped sector area." },
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

      <Hero title={TITLE} tagline="Get the length of any circular arc from radius and angle — degrees or radians, with sector area thrown in.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A circle has radius 10 cm. What is the length of the arc that spans a 60-degree central angle?"
        steps={[
          { label: "Formula: s = r × θ° × π / 180", value: "" },
          { label: "Plug in r = 10, θ = 60: 10 × 60 × π / 180", value: "" },
          { label: "Simplify 60 / 180 = 1/3, so s = 10 × π / 3", value: "" },
          { label: "Numeric value", value: "≈ 10.47 cm" },
          { label: "Sector area = ½ × 10² × (π/3)", value: "≈ 52.36 cm²" },
        ]}
        result="A 60° arc on a 10 cm circle is about 10.47 cm long, and the matching pie-slice sector covers about 52.36 cm²."
      />

      <FormulaExplained
        plainEnglish="Arc length is just the radius scaled by how big a slice of the circle you took. Measure the slice in radians and multiply — the radius does the rest. Degrees need one extra step to convert to radians first."
        formula={
          <span>
            s = r × θ (θ in radians)
            <br />
            s = r × θ° × π / 180 (θ in degrees)
            <br />
            Sector area: A = ½ × r² × θ<sub>rad</sub>
          </span>
        }
        citation={{
          label: "NIST Digital Library of Mathematical Functions — Chapter 4 (Elementary Functions)",
          href: "https://dlmf.nist.gov/4",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are a student checking a geometry or trigonometry homework answer.",
          "You are sizing a belt that wraps around a pulley and need the contact length.",
          "You are laying out a curved walkway, road, or railway section from a center point and angle.",
          "You are computing how far a wheel rolls per partial turn for a robotics or CNC project.",
          "You are a teacher generating worked examples for a circle-measure unit.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Plugging degrees straight into s = r × θ.", fix: "The formula s = r × θ only works in radians. Convert first by multiplying by π / 180, or switch the calculator to degree mode." },
          { mistake: "Mixing up arc length with chord length.", fix: "Arc length follows the curve; chord length is the straight line between the two endpoints. They are different formulas." },
          { mistake: "Forgetting the units carry through.", fix: "Arc length comes out in the same unit as the radius. If r is in meters, s is in meters — not radians, not degrees." },
          { mistake: "Using diameter instead of radius.", fix: "The formula expects the radius (center to edge). If you only have the diameter, divide by 2 first." },
          { mistake: "Treating sector area as arc length squared.", fix: "Sector area is ½ × r² × θ_rad, not s². Same θ, different formula." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Radian", definition: "An angle equal to the radius wrapped around the circle. 2π radians = 360°." },
          { term: "Central angle", definition: "The angle at the center of the circle subtending the arc." },
          { term: "Sector", definition: "The pie-slice region bounded by two radii and an arc." },
          { term: "Chord", definition: "A straight line segment joining the two endpoints of an arc." },
          { term: "Circumference", definition: "The arc length of a full circle: C = 2πr." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Circles, radians, and arc length", href: "https://www.khanacademy.org/math/geometry/hs-geo-circles" },
          { label: "OpenStax — Precalculus (Chapter 5: Trigonometric Functions, Angles)", href: "https://openstax.org/books/precalculus-2e/pages/5-1-angles" },
          { label: "NIST Digital Library of Mathematical Functions — Chapter 4", href: "https://dlmf.nist.gov/4" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["circumference-calculator", "trigonometry-calculator", "angle-calculator"]} />
    </Container>
  );
}
