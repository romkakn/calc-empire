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

const SLUG = "gravel-calculator";
const TITLE = "Gravel Calculator";
const DESC =
  "Estimate the cubic yards and US tons of gravel needed for a driveway, walkway, or base layer.";

const FAQS: FaqItem[] = [
  {
    question: "How much does a cubic yard of gravel weigh?",
    answer:
      "Most washed gravel weighs about 1.4 US tons per cubic yard (2,800 lb). Crushed stone runs heavier at roughly 1.5 tons, and wet or compacted material can reach 1.7 tons per yard. Always confirm the density with your supplier before ordering.",
  },
  {
    question: "What is the difference between pea gravel and crushed stone?",
    answer:
      "Pea gravel is small, smooth, rounded stone — easy to walk on but it shifts under load. Crushed stone is angular, locks together when compacted, and is the better pick for driveways and structural bases.",
  },
  {
    question: "Should I order washed or unwashed gravel?",
    answer:
      "Washed gravel has the fines (dust and clay) rinsed out, which means cleaner stone and faster drainage. Unwashed (or 'crusher run') keeps the fines and packs into a firmer base. Use washed for decorative or drainage layers and unwashed when you need a hard, bound surface.",
  },
  {
    question: "How much extra gravel should I order for waste?",
    answer:
      "A 5–10% overage covers compaction, spillage, and uneven edges. For long driveways or when you compact aggressively, order 10% extra. For a small flat patch, 5% is usually enough.",
  },
  {
    question: "Do I need a geotextile fabric under the gravel?",
    answer:
      "Fabric stops the gravel from sinking into the soil and keeps weeds from pushing through. Skip the fabric on a firm, well-drained base; add it on clay, soft soil, or anywhere you've seen ruts form.",
  },
  {
    question: "How deep should I lay gravel?",
    answer:
      "Walkways and decorative beds work at about 2 inches. Driveways usually want 4 inches over a prepared base. Heavy-use base layers under pavers or sheds go 6 inches or more, depending on the load.",
  },
  {
    question: "Is delivery cheaper than picking gravel up myself?",
    answer:
      "For more than about 1 cubic yard, delivery almost always beats hauling it yourself once you count truck rental, fuel, and time. Most yards charge a flat delivery fee plus the gravel, with discounts on bigger loads.",
  },
  {
    question: "Why does my calculator result differ from the supplier's quote?",
    answer:
      "Suppliers round up to the nearest half-yard or to a fixed truckload, and they may use a different density for the exact product you ordered. Use the calculator as your starting estimate, then ask the yard for their density and minimum load.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cubic Yards & Tons of Gravel`,
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
      name: "How to calculate how much gravel you need",
      steps: [
        { name: "Measure the area", text: "Get length and width in feet. For round or odd shapes, break the area into rectangles and add them up." },
        { name: "Pick a depth", text: "About 2 in for walkways, 4 in for driveways, 6 in for a structural base. Convert inches to feet by dividing by 12." },
        { name: "Compute cubic yards", text: "cubic yards = length × width × depth (all in feet) ÷ 27." },
        { name: "Convert to tons", text: "tons = cubic yards × density. Use 1.4 ton/yd³ for washed gravel as a default; ask your supplier for the exact figure." },
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

      <Hero title={TITLE} tagline="Length × width × depth, divided by 27, multiplied by density — turned into a clean order quantity in cubic yards and US tons.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homeowner wants to top up a 30 ft × 10 ft driveway with 4 inches of washed gravel. How much do they order?"
        steps={[
          { label: "Convert depth: 4 in ÷ 12", value: "0.333 ft" },
          { label: "Volume in cubic feet: 30 × 10 × 0.333", value: "100 cu ft" },
          { label: "Convert to cubic yards: ÷ 27", value: "3.70 cu yd" },
          { label: "Weight: 3.70 × 1.4 ton/yd³", value: "5.19 US tons" },
          { label: "Order with 10% waste", value: "4.07 cu yd · 5.71 tons" },
        ]}
        result="Order about 4 cubic yards (≈ 5.7 US tons) of washed gravel to cover the 30 × 10 ft driveway at 4 inches with a 10% overage."
      />

      <FormulaExplained
        plainEnglish="Gravel is sold by volume (cubic yards) and by weight (tons). Multiply length, width, and depth in feet, divide by 27 to get cubic yards, then multiply by the density of your product to get tons."
        formula={
          <span>
            cubic_yards = length_ft × width_ft × depth_ft ÷ 27
            <br />
            US_tons = cubic_yards × density (ton/yd³)
            <br />
            Default density: 1.4 ton/yd³ (washed gravel)
          </span>
        }
        citation={{
          label: "USDA NRCS — National Engineering Handbook, soil mechanics and aggregate sections",
          href: "https://directives.sc.egov.usda.gov/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're planning a new gravel driveway and need to call a supplier with a real number.",
          "You're refreshing the top layer of an existing drive and want to know how many tons to order.",
          "You're putting in a French drain or trench and need a base of clean stone.",
          "You're a landscaper quoting a path or patio base.",
          "You're a DIY builder spec'ing the sub-base under pavers, a shed, or a hot tub pad.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting to convert inches to feet.", fix: "Depth must be in feet before you multiply. Inches ÷ 12 = feet, so 4 in = 0.333 ft." },
          { mistake: "Using sand or topsoil density for gravel.", fix: "Gravel runs 1.4–1.7 ton/yd³. Sand and topsoil are different — use the right number or your tons estimate will be off." },
          { mistake: "Ordering exactly the calculated volume.", fix: "Add 5–10% for compaction, spread, and clean edges. Otherwise you'll come up short by the last few feet." },
          { mistake: "Going too shallow on a driveway.", fix: "Less than about 3 inches over a soft base and ruts form fast. Aim for 4 inches on driveways and prep the sub-base properly." },
          { mistake: "Skipping the geotextile on soft soil.", fix: "On clay or wet ground the stone migrates down. A geotextile separator keeps your gravel where you put it." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cubic yard", definition: "A volume of 27 cubic feet (3 ft × 3 ft × 3 ft). The standard sell unit for bulk gravel." },
          { term: "Density", definition: "Weight per unit volume. Expressed for gravel in tons per cubic yard." },
          { term: "Crusher run", definition: "Unwashed crushed stone with fines mixed in. Packs tight, common as a base layer." },
          { term: "Pea gravel", definition: "Small (~3/8 in) rounded stone. Good for paths and decorative beds, poor for load-bearing." },
          { term: "Geotextile", definition: "Woven or non-woven fabric placed between soil and gravel to stop migration and weed growth." },
          { term: "Sub-base", definition: "The compacted layer of aggregate or stone beneath a wear surface — pavers, asphalt, or a driveway top." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "USDA NRCS — National Engineering Handbook (soil mechanics, aggregate)", href: "https://directives.sc.egov.usda.gov/" },
          { label: "AASHTO M 145 — Classification of Soils and Soil-Aggregate Mixtures for Highway Construction Purposes", href: "https://store.transportation.org/Item/CollectionDetail?ID=152" },
          { label: "US DOT FHWA — Standard Specifications for Construction of Roads and Bridges on Federal Highway Projects (FP-14)", href: "https://highways.dot.gov/federal-lands/specs/2014" },
          { label: "USDA NRCS — Soils web portal (engineering properties)", href: "https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-and-mapping" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["cubic-yard-calculator", "square-footage-calculator", "asphalt-calculator"]} />
    </Container>
  );
}
