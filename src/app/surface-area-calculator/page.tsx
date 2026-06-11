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

const SLUG = "surface-area-calculator";
const TITLE = "Surface Area Calculator";
const DESC =
  "Surface area for a cube, sphere, cylinder, cone, square pyramid, or rectangular prism. Exact formulas with the work shown step by step.";

const FAQS: FaqItem[] = [
  {
    question: "What is surface area and how is it different from volume?",
    answer:
      "Surface area is the total flat area you would get if you peeled the outside of a solid and laid it flat. Volume measures how much space fits inside. Surface area uses square units; volume uses cubic units.",
  },
  {
    question: "Why is the answer always in square units?",
    answer:
      "Area measures a two-dimensional region, so it multiplies one length by another. If your inputs are in feet, every term is feet × feet, which gives square feet. Use the same unit on every input — mixing centimeters with meters will give a wrong answer.",
  },
  {
    question: "What is lateral surface area vs total surface area?",
    answer:
      "Lateral surface area covers only the side faces of a solid — the curved wall of a cylinder, for example, but not the top and bottom circles. Total surface area adds the bases back in. This calculator returns the total surface area by default.",
  },
  {
    question: "What is slant height and why does a cone need it?",
    answer:
      "Slant height runs from the apex of a cone or pyramid down along a side, not straight down the middle. Vertical height runs straight down from the apex to the base. The side of a cone unrolls into a piece of a circle whose radius equals the slant height, which is why the formula uses slant rather than vertical height.",
  },
  {
    question: "How is surface area used in real life?",
    answer:
      "Painters use it to estimate how much paint a wall, tank, or silo will need. Manufacturers use it to price sheet metal, fabric, and packaging. Heat-transfer and biology problems use it because surfaces are where heat, light, and gas exchange happen.",
  },
  {
    question: "What are the most common mistakes?",
    answer:
      "Confusing radius with diameter, plugging vertical height into a cone or pyramid formula that needs slant height, and forgetting to add the base. Mixing units across inputs is the other big one. Double-check that every number is in the same unit before pressing calculate.",
  },
  {
    question: "Can I use this for an open-top container?",
    answer:
      "Yes — calculate the total surface area, then subtract the area of the missing face. For an open-top cylinder, subtract one circle (πr²). For an open-top box, subtract one rectangle (length × width).",
  },
  {
    question: "Does this work for irregular shapes?",
    answer:
      "Not directly. Split an irregular solid into the standard shapes listed above, find the surface area of each piece, and add them — but subtract any shared interior faces, because they are not on the outside.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cube, Sphere, Cylinder, Cone, Pyramid, Prism`,
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
      name: "How to calculate the surface area of a 3D solid",
      steps: [
        { name: "Pick the shape", text: "Cube, sphere, cylinder, cone, rectangular prism, or square pyramid." },
        { name: "Measure in one unit", text: "All inputs (radius, height, side, slant) must share the same unit." },
        { name: "Apply the formula", text: "Cube: 6a². Sphere: 4πr². Cylinder: 2πr(r+h). Cone: πr(r+ℓ). Rect prism: 2(lw+lh+wh). Sq pyramid: a²+2aℓ." },
        { name: "Read the square units", text: "The result is in square units of whatever unit you put in." },
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

      <Hero title={TITLE} tagline="Pick a shape, enter the dimensions, get the total surface area with the formula and the math shown step by step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A closed cylinder has radius 5 and height 10. What is its total surface area?"
        steps={[
          { label: "Formula: SA = 2πr(r + h)", value: "" },
          { label: "Plug in r = 5, h = 10: 2 × π × 5 × (5 + 10)", value: "" },
          { label: "Simplify the parenthesis: 5 + 10", value: "15" },
          { label: "Multiply: 2 × 5 × 15", value: "150" },
          { label: "Keep π exact", value: "150π" },
          { label: "Decimal (π ≈ 3.14159)", value: "≈ 471.24 sq units" },
        ]}
        result="A cylinder with r = 5 and h = 10 has a total surface area of 150π ≈ 471.24 square units."
      />

      <FormulaExplained
        plainEnglish="Every standard solid has a closed-form surface area formula. The shape determines which lengths matter. Cubes and prisms care about edges; spheres, cylinders, and cones care about the radius; pyramids and cones also need the slant height because their side faces are tilted."
        formula={
          <span>
            Cube: SA = 6a²
            <br />
            Sphere: SA = 4πr²
            <br />
            Cylinder (closed): SA = 2πr(r + h)
            <br />
            Cone (closed): SA = πr(r + ℓ)
            <br />
            Rectangular prism: SA = 2(lw + lh + wh)
            <br />
            Square pyramid: SA = a² + 2aℓ
          </span>
        }
        citation={{
          label: "OpenStax Prealgebra 2e — Section 9.6 Solve Geometry Applications: Volume and Surface Area",
          href: "https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area",
        }}
      />

      <WhenToUse
        scenarios={[
          "Estimating how much paint, varnish, or coating is needed to cover an object.",
          "Pricing sheet metal, fabric, wrapping paper, or packaging for a product.",
          "Solving 6th–8th grade geometry homework on cubes, prisms, cylinders, and pyramids.",
          "Sanity-checking a CAD or 3D-printing slicer's reported surface area before quoting a job.",
          "Working through a heat-transfer or biology problem where surface area drives the rate.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Reporting the answer in cubic units.", fix: "Surface area is always squared (in², ft², m²). Cubic units belong to volume." },
          { mistake: "Plugging diameter in where the formula asks for radius.", fix: "Radius is half the diameter. If you only have the diameter, divide by 2 first." },
          { mistake: "Using vertical height in a cone or pyramid surface-area formula.", fix: "The side formulas use slant height (ℓ), not the straight-down height. Convert with the Pythagorean theorem if needed: ℓ² = h² + r² for a cone." },
          { mistake: "Forgetting the base(s).", fix: "Total surface area includes every outside face. A closed cylinder has two circles plus the wall. An open-top container has one less face — subtract it." },
          { mistake: "Mixing units across inputs.", fix: "Convert everything to the same unit first. Inches in, square inches out — no exceptions." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Lateral surface area", definition: "The area of the side faces only, excluding the base(s)." },
          { term: "Slant height (ℓ)", definition: "Distance along the slanted side of a cone or pyramid, from base edge to apex." },
          { term: "Apothem", definition: "Distance from the center of a regular polygon to the middle of a side — appears in pyramid surface-area work." },
          { term: "Net", definition: "The flat unfolded version of a 3D solid. Adding up the areas of every piece of the net gives the total surface area." },
          { term: "Square units", definition: "Units of area: in², ft², cm², m². Always squared because area multiplies two lengths." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax Prealgebra 2e — Volume and Surface Area", href: "https://openstax.org/books/prealgebra-2e/pages/9-6-solve-geometry-applications-volume-and-surface-area" },
          { label: "Khan Academy — Surface area (high-school geometry)", href: "https://www.khanacademy.org/math/geometry/hs-geo-solids/hs-geo-solids-intro/v/surface-area" },
          { label: "Common Core State Standards — Grade 6 Geometry (6.G.A.4)", href: "https://www.thecorestandards.org/Math/Content/6/G/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["volume-calculator", "circumference-calculator", "square-root-calculator"]} />
    </Container>
  );
}
