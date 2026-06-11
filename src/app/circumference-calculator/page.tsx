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

const SLUG = "circumference-calculator";
const TITLE = "Circumference Calculator";
const DESC =
  "Circumference and area of a circle from radius, diameter, or area. Step-by-step, with the formulas behind every result.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between circumference and perimeter?",
    answer:
      "Circumference is the perimeter of a circle — the distance around its edge. Perimeter is the general word for any closed shape's boundary length; for circles specifically we call it the circumference.",
  },
  {
    question: "How precise is pi in this calculator?",
    answer:
      "The calculator uses JavaScript's Math.PI, which is accurate to about 15 decimal digits — far more precision than any tape measure or ruler can match. Rounding error in your input will dwarf any error from pi.",
  },
  {
    question: "What is the difference between radius and diameter?",
    answer:
      "The radius is the distance from the center to the edge. The diameter is the distance straight across through the center — exactly twice the radius. So d = 2r, and r = d / 2.",
  },
  {
    question: "How is circumference related to arc length?",
    answer:
      "Arc length is a slice of the full circumference. For a central angle of theta radians, arc length = r * theta. The full circle is 2 * pi radians, which gives back C = 2 * pi * r.",
  },
  {
    question: "Where do I use this in real life?",
    answer:
      "Tire sizing (rolling distance per revolution = circumference), fencing or edging a circular garden bed, calculating belt length around a pulley, and wrapping a pipe with insulation are common uses.",
  },
  {
    question: "Why is the formula 2 * pi * r and not pi * r?",
    answer:
      "Pi is defined as the ratio of circumference to diameter: pi = C / d. Since d = 2r, multiplying both sides by d gives C = pi * d = 2 * pi * r. The factor of 2 comes from the diameter being twice the radius.",
  },
  {
    question: "Can I find the radius from just the area?",
    answer:
      "Yes. Rearrange A = pi * r^2 to get r = sqrt(A / pi). This calculator does that for you when you pick area as the known input.",
  },
  {
    question: "What units should I use?",
    answer:
      "Use whatever length unit you like — the formula does not care. If radius is in cm, circumference is in cm and area is in cm^2. Stay consistent and the units take care of themselves.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Find C and Area from Radius, Diameter, or Area`,
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
      name: "How to calculate the circumference of a circle",
      steps: [
        { name: "Identify what you know", text: "Pick which value you have: radius, diameter, or area of the circle." },
        { name: "Enter the value", text: "Type the number using consistent units (cm, m, in — whatever you like)." },
        { name: "Apply the formula", text: "C = 2 * pi * r if you know the radius. C = pi * d if you know the diameter. If you have area, first compute r = sqrt(A / pi), then C = 2 * pi * r." },
        { name: "Read both results", text: "The calculator returns circumference and area side by side so you can sanity-check both." },
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

      <Hero title={TITLE} tagline="Find the circumference and area of any circle from its radius, diameter, or area — with the formulas shown step by step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A circular pond has a radius of 5 meters. What is its circumference and surface area?"
        steps={[
          { label: "Formula: C = 2 * pi * r", value: "" },
          { label: "Plug in r = 5: 2 * pi * 5", value: "10 * pi" },
          { label: "Multiply: 10 * 3.14159...", value: "31.42 m" },
          { label: "Area: A = pi * r^2 = pi * 25", value: "78.54 m^2" },
        ]}
        result="A 5 m radius pond has a circumference of about 31.42 m and an area of about 78.54 m^2."
      />

      <FormulaExplained
        plainEnglish="Pi is the ratio of a circle's circumference to its diameter — the same number for every circle, about 3.14159. That single fact gives every formula here: circumference from radius or diameter, area from radius, and radius back from area."
        formula={
          <span>
            C = 2 * pi * r = pi * d
            <br />
            A = pi * r<sup>2</sup>
            <br />
            From area: r = sqrt(A / pi)
          </span>
        }
        citation={{
          label: "Khan Academy — Radius, diameter, circumference and pi",
          href: "https://www.khanacademy.org/math/geometry/hs-geo-circles/hs-geo-circles-basics/v/circles-radius-diameter-and-circumference",
        }}
      />

      <WhenToUse
        scenarios={[
          "Figuring out how much edging or fencing you need around a round garden bed or patio.",
          "Sizing a belt or rope to wrap around a pulley, drum, or pipe.",
          "Converting a tire's diameter into rolling distance per revolution.",
          "Checking a geometry homework answer or studying for a test.",
          "Estimating the surface area of a circular pool, table, or cake before buying a cover or cloth.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing up radius and diameter.", fix: "The diameter goes all the way across; the radius is half of that. If you measured edge-to-edge through the center, you have the diameter — divide by 2 to get r." },
          { mistake: "Squaring the diameter for area.", fix: "Area uses the radius: A = pi * r^2, not pi * d^2. If you only have d, compute r = d / 2 first." },
          { mistake: "Using 3.14 for high-precision work.", fix: "3.14 is fine for back-of-envelope work. For engineering or anything precise, use at least 3.14159 — this calculator uses ~15 digits of pi." },
          { mistake: "Forgetting to square the units for area.", fix: "Circumference is in meters; area is in square meters. Always carry the units through so you spot mistakes." },
          { mistake: "Confusing arc length with circumference.", fix: "Circumference is the full distance around. Arc length is a piece of it, given by r * theta for a central angle theta in radians." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Radius (r)", definition: "Distance from the center of the circle to any point on its edge." },
          { term: "Diameter (d)", definition: "Distance straight across the circle through the center. d = 2r." },
          { term: "Circumference (C)", definition: "Distance around the circle. C = 2 * pi * r." },
          { term: "Pi (pi)", definition: "Ratio of a circle's circumference to its diameter, about 3.14159. The same value for every circle." },
          { term: "Arc length", definition: "Distance along a portion of the circle's edge, given by r * theta for an angle theta in radians." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Khan Academy — Radius, diameter, circumference and pi", href: "https://www.khanacademy.org/math/geometry/hs-geo-circles/hs-geo-circles-basics/v/circles-radius-diameter-and-circumference" },
          { label: "Khan Academy — Area of a circle", href: "https://www.khanacademy.org/math/geometry/hs-geo-circles/hs-geo-area-circle/v/area-of-a-circle" },
          { label: "OpenStax — Precalculus 2e (Chapter on circles and trigonometry)", href: "https://openstax.org/details/books/precalculus-2e" },
          { label: "Archimedes — Measurement of a Circle (historical estimate of pi)", href: "https://en.wikisource.org/wiki/Page:The_Works_of_Archimedes.djvu/123" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["arc-length-calculator", "surface-area-calculator", "volume-calculator"]} />
    </Container>
  );
}
