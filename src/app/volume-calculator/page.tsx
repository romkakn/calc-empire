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

const SLUG = "volume-calculator";
const TITLE = "Volume Calculator";
const DESC =
  "Calculate volume of a cube, sphere, cylinder, cone, square pyramid, or rectangular prism — exact formulas, any unit, instant answer.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between volume and surface area?",
    answer:
      "Volume measures how much space fills the inside of a 3D shape — think of how much water a tank can hold. Surface area measures the total area of the outside skin — the paint you'd need to cover it. Volume is in cubic units (cm³, m³, ft³); surface area is in square units (cm², m², ft²).",
  },
  {
    question: "Why is volume always in cubic units?",
    answer:
      "Volume measures three dimensions at once: length, width, and height. Multiplying three lengths together gives you a unit raised to the third power. A box that is 2 m on every side has a volume of 2 × 2 × 2 = 8 m³, eight cubic meters.",
  },
  {
    question: "How do I convert cubic centimeters to liters?",
    answer:
      "Divide by 1,000. One liter equals 1,000 cm³ exactly. So a 2,500 cm³ container holds 2.5 liters. Going the other way, 1 m³ equals 1,000 liters.",
  },
  {
    question: "How do I convert cubic feet to gallons?",
    answer:
      "Multiply cubic feet by about 7.481 to get US gallons. So a 10 ft³ tank holds about 74.8 US gallons. For UK (imperial) gallons, multiply cubic feet by about 6.229 instead.",
  },
  {
    question: "What is Cavalieri's principle?",
    answer:
      "If two solids have the same height and the same cross-sectional area at every level, they have the same volume. That is why a tilted stack of coins has the same volume as a straight stack — the cross-sections match at every height.",
  },
  {
    question: "Where is volume used in real life?",
    answer:
      "Sizing water tanks, swimming pools, fish aquariums, concrete pours, shipping cartons, fuel drums, propane bottles, grain silos, and HVAC ductwork. Engineers, contractors, chefs, brewers, and divers all rely on volume calculations daily.",
  },
  {
    question: "Is capacity the same as volume?",
    answer:
      "Almost. Volume is the total interior space. Capacity is how much a container can actually hold — usually a little less than its full interior volume because of wall thickness and fill lines.",
  },
  {
    question: "How accurate is this calculator?",
    answer:
      "The formulas are exact. Results are rounded to two decimal places for display. The accuracy of your answer depends only on the accuracy of the dimensions you enter.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cube, Sphere, Cylinder, Cone & More`,
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
      name: "How to calculate the volume of a 3D shape",
      steps: [
        { name: "Pick your shape", text: "Choose cube, rectangular prism, sphere, cylinder, cone, or square pyramid." },
        { name: "Measure the dimensions", text: "Enter the required side lengths, radii, or heights in the same unit." },
        { name: "Apply the formula", text: "Cube: a³. Rectangular prism: l × w × h. Sphere: 4/3·π·r³. Cylinder: π·r²·h. Cone: 1/3·π·r²·h. Square pyramid: 1/3·a²·h." },
        { name: "Read the result in cubic units", text: "Volume is reported in cubic units of whatever you entered (cm³, m³, in³, ft³)." },
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

      <Hero title={TITLE} tagline="Pick a shape, type the dimensions, get an exact volume — for cubes, spheres, cylinders, cones, pyramids, and rectangular prisms.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A cylindrical water tank has a radius of 4 m and a height of 10 m. What is its volume?"
        steps={[
          { label: "Formula: V = π · r² · h", value: "" },
          { label: "Square the radius: 4²", value: "16" },
          { label: "Multiply by height: 16 × 10", value: "160" },
          { label: "Multiply by π", value: "160π" },
          { label: "Decimal value", value: "≈ 502.65 m³" },
        ]}
        result="V = 160π ≈ 502.65 m³. That is about 502,654 liters of capacity (1 m³ = 1,000 L)."
      />

      <FormulaExplained
        plainEnglish="Volume is the amount of 3D space a shape fills. Every standard shape has a closed-form formula derived from integral calculus or from cutting and stacking simpler pieces (Cavalieri's principle). Pick the right one for your shape and plug in the dimensions."
        formula={
          <span>
            Cube: V = a³
            <br />
            Rectangular prism: V = l · w · h
            <br />
            Sphere: V = (4/3) · π · r³
            <br />
            Cylinder: V = π · r² · h
            <br />
            Cone: V = (1/3) · π · r² · h
            <br />
            Square pyramid: V = (1/3) · a² · h
          </span>
        }
        citation={{
          label: "OpenStax Prealgebra — Volume and Surface Area",
          href: "https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area",
        }}
      />

      <WhenToUse
        scenarios={[
          "Sizing a water tank, swimming pool, or aquarium to know its capacity in liters or gallons.",
          "Estimating concrete or topsoil for a pour by computing a rectangular-prism volume.",
          "Checking a homework or geometry exam answer for any of the six standard shapes.",
          "Comparing two product packages of different shapes to see which holds more.",
          "Sizing a fuel drum, propane bottle, or grain silo for storage planning.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing units inside one calculation.", fix: "All dimensions must be in the same unit before applying the formula. Convert first, then compute." },
          { mistake: "Confusing radius and diameter on circular shapes.", fix: "The formulas use radius. If you measured across the full circle, divide by 2 to get the radius." },
          { mistake: "Forgetting the 1/3 factor on cones and pyramids.", fix: "A cone is exactly 1/3 the volume of a cylinder with the same base and height. A pyramid is 1/3 of its enclosing prism." },
          { mistake: "Reporting volume in square units.", fix: "Volume is always cubic — cm³, m³, in³, ft³. Square units (cm², m²) are surface area, a different quantity." },
          { mistake: "Treating capacity and volume as identical.", fix: "A container's interior volume is the upper bound on capacity. Wall thickness and fill lines mean usable capacity is usually a bit less." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cubic unit", definition: "A unit of volume, like cm³ or ft³, formed by raising a length unit to the third power." },
          { term: "Radius", definition: "The distance from the center of a circle or sphere to its edge. Half the diameter." },
          { term: "Cross-section", definition: "The 2D shape you get by slicing a 3D solid with a plane." },
          { term: "Cavalieri's principle", definition: "Two solids with matching cross-sectional areas at every height have equal volumes." },
          { term: "Capacity", definition: "How much a container can actually hold, usually expressed in liters or gallons." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax Prealgebra 2e — Volume and Surface Area", href: "https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area" },
          { label: "Khan Academy — Volume formulas review (geometry)", href: "https://www.khanacademy.org/math/geometry/hs-geo-solids/hs-geo-solids-intro/a/volume-formulas-review" },
          { label: "Common Core State Standards — Grade 6 Geometry (6.G)", href: "https://www.thecorestandards.org/Math/Content/6/G/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["surface-area-calculator", "cubic-yard-calculator", "circumference-calculator"]} />
    </Container>
  );
}
