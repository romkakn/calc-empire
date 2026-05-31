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

const SLUG = "square-footage-calculator";
const TITLE = "Square Footage Calculator";
const DESC =
  "Calculate room or area square footage from length × width with ft, in, or m units. Add multiple rooms for a running total in sq ft and m².";

const FAQS: FaqItem[] = [
  {
    question: "How do I measure square footage for an irregular room?",
    answer:
      "Split the floor plan into rectangles, measure each one, and add the results. An L-shaped room is two rectangles; a bay window is a third. The calculator's add-room button is built for this — give each section its own entry and read the total.",
  },
  {
    question: "Should I include closets in the square footage?",
    answer:
      "For ANSI Z765 home measurements, finished closets inside the heated living space count. Garages, unfinished basements, and detached storage do not. Real-estate listings should follow the same rule so buyers can compare homes fairly.",
  },
  {
    question: "Why is an apartment's listed square footage bigger than what I measured?",
    answer:
      "Landlords sometimes add a share of hallways, lobbies, and amenity rooms — the common-area factor or loss factor. Ask whether the listed number is usable (carpetable) or gross square feet. The two can differ by 15–35% in older buildings.",
  },
  {
    question: "How do I convert square feet to square meters?",
    answer:
      "Multiply square feet by 0.092903 to get square meters. Going the other way, multiply square meters by 10.7639. A 120 sq ft room is about 11.15 m².",
  },
  {
    question: "When should I round my square-footage result?",
    answer:
      "Round to the nearest whole square foot for listings and most home-improvement quotes. Keep one decimal for materials math when waste matters. Anything more precise is false confidence — tape measures introduce their own error.",
  },
  {
    question: "How much extra material should I buy for flooring or tile?",
    answer:
      "Add about 10% waste for straight-lay flooring in a simple rectangular room. Bump to 15% for diagonal patterns or rooms with many cuts, and 20% for tile with a complex layout. Confirm the waste rule with your installer before ordering.",
  },
  {
    question: "How much paint do I need per square foot?",
    answer:
      "One gallon of interior wall paint typically covers 350–400 sq ft in a single coat. For two coats — the usual recommendation — divide your wall area by about 175. Calculate wall area separately from floor area; they are not the same number.",
  },
  {
    question: "What is the standard for real-estate square footage?",
    answer:
      "In the United States, ANSI Z765-2021 is the widely used residential measurement standard. It defines finished area as enclosed, heated, and accessible space measured to the exterior wall surfaces. Many MLS systems and appraisers reference it.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Length × Width in ft, in, or m`,
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
      name: "How to calculate square footage",
      steps: [
        { name: "Pick your unit", text: "Choose ft, in, or m so the inputs match your tape measure." },
        { name: "Measure length and width", text: "Measure wall-to-wall along the longest and shortest sides of each rectangle." },
        { name: "Multiply", text: "Square footage = length × width. The calculator converts inches and meters to feet automatically." },
        { name: "Add irregular sections", text: "For L-shapes or alcoves, split into rectangles and use Add Room to sum them." },
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

      <Hero title={TITLE} tagline="Multiply length by width — in feet, inches, or meters — and add rooms for a running total in sq ft and m².">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A bedroom measures 12 ft long by 10 ft wide. What is the square footage, and how does that translate to square meters?"
        steps={[
          { label: "Formula: sq ft = length × width", value: "" },
          { label: "Plug in 12 ft × 10 ft", value: "120 sq ft" },
          { label: "Convert each side to meters: 12 ft × 0.3048", value: "3.66 m" },
          { label: "Width: 10 ft × 0.3048", value: "3.05 m" },
          { label: "Multiply: 3.66 × 3.05", value: "11.15 m²" },
          { label: "Or convert directly: 120 × 0.0929", value: "11.15 m²" },
        ]}
        result="A 12 × 10 ft bedroom is 120 sq ft — about 11.15 m²."
      />

      <FormulaExplained
        plainEnglish="Square footage is the area of a rectangle measured in feet. Multiply how long the room is by how wide it is. If you measured in inches, divide by 12 first; if you measured in meters, multiply by 3.28084."
        formula={
          <span>
            sq ft = length<sub>ft</sub> × width<sub>ft</sub>
            <br />
            inches → feet: value ÷ 12
            <br />
            meters → feet: value × 3.28084
            <br />
            sq ft → m²: value × 0.0929
          </span>
        }
        citation={{
          label: "NIST SP 811 — Guide for the Use of the International System of Units (SI)",
          href: "https://www.nist.gov/pml/special-publication-811",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're pricing flooring, carpet, or tile and need a material estimate.",
          "You're listing a home and want a clean number for the MLS or ad.",
          "You're comparing two apartments and one quotes usable while the other quotes gross.",
          "You're sizing an HVAC unit or a rug and need the floor area in m².",
          "You're a student or contractor double-checking a takeoff before ordering materials.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting to convert inches before multiplying.", fix: "Divide inches by 12 first, or use the in toggle in the calculator. 144 inches is 12 feet, not 144 feet." },
          { mistake: "Mixing usable and gross square footage when comparing rentals.", fix: "Ask each landlord which number they quoted. A 1,000 sq ft gross listing can mean ~750 sq ft of usable floor." },
          { mistake: "Treating an L-shaped room as one big rectangle.", fix: "Split into two or more rectangles, measure each, and add the totals. The Add Room button is built for this." },
          { mistake: "Ordering exactly the calculated quantity of flooring.", fix: "Add 10% waste for straight lay, 15% for diagonals, 20% for complex tile. Cuts and defects always burn material." },
          { mistake: "Reporting more precision than your tape allows.", fix: "Round to the nearest sq ft for listings. Two decimals only matters when you're matching a quote to a delivery." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gross floor area (GFA)", definition: "Total enclosed area including interior walls. Often used in commercial leases." },
          { term: "Usable square footage", definition: "Floor space inside the tenant's walls, excluding shared corridors and mechanical rooms." },
          { term: "Loss factor", definition: "The percentage difference between rentable and usable square footage in a multi-tenant building." },
          { term: "ANSI Z765", definition: "The 2021 American National Standard for measuring single-family residential square footage." },
          { term: "Square meter (m²)", definition: "SI unit of area. 1 m² ≈ 10.7639 sq ft." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST SP 811 — Guide for the Use of the International System of Units (SI)", href: "https://www.nist.gov/pml/special-publication-811" },
          { label: "ANSI Z765-2021 — Square Footage Method for Calculating: Single-Family Residential Buildings", href: "https://webstore.ansi.org/standards/nahb/ansiz7652021" },
          { label: "HUD — Single Family Housing Policy Handbook 4000.1 (area measurement guidance)", href: "https://www.hud.gov/program_offices/housing/sfh/handbook_4000-1" },
          { label: "NIST — Office of Weights and Measures unit conversions", href: "https://www.nist.gov/pml/owm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["cubic-yard-calculator", "gravel-calculator", "asphalt-calculator"]} />
    </Container>
  );
}
