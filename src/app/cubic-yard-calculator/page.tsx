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

const SLUG = "cubic-yard-calculator";
const TITLE = "Cubic Yard Calculator";
const DESC =
  "Calculate the cubic yards needed for concrete, gravel, mulch, or topsoil from length × width × depth.";

const FAQS: FaqItem[] = [
  {
    question: "How much does a cubic yard weigh?",
    answer:
      "It depends on the material. A cubic yard of concrete weighs about 4,050 lb, gravel about 2,700 lb, topsoil about 2,200 lb, and mulch about 800 lb. Always confirm with your supplier — moisture and compaction shift the number.",
  },
  {
    question: "Why add 10% waste to my order?",
    answer:
      "Real jobs have spillage, settling, uneven ground, and trim cuts. A 10% buffer covers typical projects; bump to 15–20% on sloped or irregular sites. It is cheaper to have a little extra than to short the pour.",
  },
  {
    question: "Are concrete, gravel, and mulch densities the same?",
    answer:
      "No. Concrete is the heaviest at roughly 4,050 lb per cubic yard, gravel sits near 2,700 lb, and mulch is light at 600–1,000 lb. That matters for delivery trucks, weight limits, and load-bearing surfaces.",
  },
  {
    question: "How do I handle sloped ground?",
    answer:
      "Measure the deepest point and the shallowest point, then average them for depth. If the slope is steep, split the area into smaller sections and add the volumes. Add an extra 5–10% on top to be safe.",
  },
  {
    question: "Cubic yard vs ton — which should I order in?",
    answer:
      "Cubic yards measure volume; tons measure weight. Bulk material like gravel and topsoil is often priced per ton. Multiply cubic yards by the material density (e.g., 1.35 tons per cu yd for gravel) to convert.",
  },
  {
    question: "What if my answer is a decimal like 1.4 cu yd?",
    answer:
      "Round up to the next whole yard for delivery, since most yards do not split a cubic yard. For bagged material, multiply the decimal by the bag count per yard (about 36 bags per cu yd for 2-cu-ft bags).",
  },
  {
    question: "What depth covers common landscaping jobs?",
    answer:
      "Mulch beds want 2–3 inches, new lawn topsoil 4–6 inches, gravel driveways 4 inches, and concrete patios 4 inches. Always check local building code for structural pours.",
  },
  {
    question: "How do contractors estimate quickly in the field?",
    answer:
      "Multiply length by width by depth (all in feet) and divide by 27. For circular pads, take pi times radius squared times depth in feet, then divide by 27. Memorize 27 — it is the only constant you need.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Concrete, Gravel, Mulch & Topsoil`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Construction", path: "/construction" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "construction", description: DESC }),
    howToSchema({
      name: "How to calculate cubic yards for a job",
      steps: [
        { name: "Measure length, width, and depth", text: "Use feet for length and width. Depth can stay in inches — the calculator converts." },
        { name: "Pick the shape", text: "Rectangle for slabs and beds; circle for round pads or fire pits. For circles, enter the diameter." },
        { name: "Apply the formula", text: "Rectangle: (L × W × D) / 27. Circle: (π × r² × D) / 27. All measurements in feet." },
        { name: "Add a waste factor", text: "10% covers most jobs; 15–20% for uneven ground. Round up to the next whole cubic yard when ordering." },
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

      <Hero title={TITLE} tagline="Find the cubic yards you need for concrete, gravel, mulch, or topsoil — rectangle or circle, any depth unit.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You are mulching a 10 ft × 8 ft garden bed to a 4-inch depth. How much mulch should you order?"
        steps={[
          { label: "Convert depth: 4 in ÷ 12", value: "0.333 ft" },
          { label: "Volume in cubic feet: 10 × 8 × 0.333", value: "26.67 cu ft" },
          { label: "Convert to cubic yards: 26.67 ÷ 27", value: "0.99 cu yd" },
          { label: "Round up for ordering", value: "1 cu yd" },
        ]}
        result="Order 1 cu yd of mulch. Add 10% waste on uneven ground and you are still well under 1.1 cu yd — one yard covers it."
      />

      <FormulaExplained
        plainEnglish="A cubic yard is a 3 ft × 3 ft × 3 ft cube — that is 27 cubic feet. To find cubic yards, measure your area in feet, multiply length × width × depth, then divide by 27. For round pads, swap length × width for π × radius²."
        formula={
          <span>
            Rectangle: cu yd = (length × width × depth) / 27
            <br />
            Circle: cu yd = (π × r² × depth) / 27
            <br />
            Depth in inches? Divide by 12 first. Depth in meters? Multiply by 3.281.
          </span>
        }
        citation={{
          label: "NIST Special Publication 811 — Guide for the Use of the International System of Units (SI)",
          href: "https://www.nist.gov/pml/special-publication-811",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are pouring a concrete slab or footing and need to size the order.",
          "You are filling a garden bed, lawn, or planter with topsoil or mulch.",
          "You are spreading gravel for a driveway, walkway, or french drain.",
          "You are pricing a landscaping or hardscape bid for a client.",
          "You are checking a contractor's material quote against your own measurements.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing units — feet for length, inches for depth, no conversion.", fix: "Convert everything to feet first. The calculator handles this when you pick the depth unit." },
          { mistake: "Forgetting the divide-by-27 step.", fix: "27 is the only constant. A cube 3 ft on a side holds 27 cu ft, which equals 1 cu yd." },
          { mistake: "Ordering the exact calculated amount.", fix: "Always add 10% for waste — more on sloped or irregular ground. Coming up short on a pour day is expensive." },
          { mistake: "Using radius when you measured diameter.", fix: "For circular areas, divide diameter by 2 before squaring. Or enter diameter — this calculator splits it for you." },
          { mistake: "Confusing weight (tons) with volume (cubic yards).", fix: "Suppliers may price either way. Multiply cubic yards by the material's pounds-per-yard to convert." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cubic yard", definition: "A volume measure equal to 27 cubic feet — a 3 ft cube." },
          { term: "Yield", definition: "Volume of fresh concrete produced per batch, used to confirm the mix delivered matches the order." },
          { term: "Waste factor", definition: "Extra material added to an order to cover spillage, settling, and overcuts. Typically 10%." },
          { term: "Density", definition: "Mass per unit volume — how heavy a material is. Used to convert cubic yards to tons." },
          { term: "Aggregate base", definition: "Crushed stone layer under pavement or concrete. Sized in cubic yards or tons depending on supplier." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "American Concrete Institute — ACI 308R Guide to External Curing of Concrete", href: "https://www.concrete.org/store/productdetail.aspx?ItemID=30816" },
          { label: "Federal Highway Administration — Aggregate and Base Course Specifications", href: "https://www.fhwa.dot.gov/pavement/pubs/013124.pdf" },
          { label: "NIST Special Publication 811 — Guide for the Use of the International System of Units", href: "https://www.nist.gov/pml/special-publication-811" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["square-footage-calculator", "gravel-calculator", "asphalt-calculator"]} />
    </Container>
  );
}
