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

const SLUG = "stone-calculator";
const TITLE = "Stone Calculator";
const DESC =
  "Cubic yards and US tons of stone for a driveway or wall. Density override for crushed, decorative, or base stone.";

const FAQS: FaqItem[] = [
  {
    question: "How is gravel different from crushed stone?",
    answer:
      "Gravel is rounded by natural weathering, while crushed stone is mechanically broken to give angular faces that lock together. Crushed stone usually weighs about 1.4 to 1.6 tons per cubic yard; rounded pea gravel runs a bit lighter, near 1.3 to 1.4 tons. Use the density override if your supplier lists a specific weight.",
  },
  {
    question: "What density should I use for decorative stone vs base stone?",
    answer:
      "Decorative stone such as river rock or lava rock varies widely, from about 1.1 to 1.5 tons per cubic yard depending on porosity. Dense graded base rock like crushed limestone or 21A averages 1.5 to 1.7 tons per cubic yard. When the bag or invoice lists a weight, trust that over the default.",
  },
  {
    question: "Do I need geotextile fabric under stone?",
    answer:
      "For driveways and high-traffic paths, yes. A non-woven geotextile separates the stone from the soil so fines do not pump up and rut the surface. The USDA NRCS field handbook recommends a separation layer over soft or silty subgrade. Skip it only for shallow decorative beds.",
  },
  {
    question: "How deep should stone be for different uses?",
    answer:
      "Decorative beds and ground cover work at 2 to 3 inches. Walkways need 3 to 4 inches over a compacted base. Residential driveways typically use 4 to 6 inches of base plus 2 inches of surface stone. Heavier vehicle areas may need 8 inches or more.",
  },
  {
    question: "Why order 10 percent over the calculated amount?",
    answer:
      "Stone settles during compaction, fills uneven subgrade, and some is lost during spreading. A 10 percent buffer covers that without leaving you short. For driveways over soft ground, plan on 15 to 20 percent extra.",
  },
  {
    question: "What is the difference between a ton and a cubic yard of stone?",
    answer:
      "A cubic yard is a volume — 27 cubic feet — while a ton is a weight. One cubic yard of crushed stone weighs about 1.5 US tons on average. Suppliers may price by either unit, so converting matters for an accurate quote.",
  },
  {
    question: "Does compaction change how much stone I need?",
    answer:
      "Yes. Loose stone compacts down by roughly 10 to 20 percent when rolled or driven on. The calculator returns loose volume, so add a buffer if you want a specific finished depth after compaction.",
  },
  {
    question: "Can I use this calculator for stone retaining wall backfill?",
    answer:
      "Yes for the drainage stone behind a wall — measure the wedge length, width, and average depth. For the wall block itself, use a block count tool because units are sized, not poured.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cubic Yards and Tons`,
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
      name: "How to calculate stone for a driveway or wall",
      steps: [
        { name: "Measure the area", text: "Get length and width in feet. For odd shapes, break the area into rectangles and add the results." },
        { name: "Pick a depth", text: "Decorative beds 2–3 in, walkways 3–4 in, driveways 4–6 in of base plus 2 in surface." },
        { name: "Convert to cubic yards", text: "cubic_yards = length × width × depth_ft ÷ 27. Always convert depth to feet first (inches ÷ 12)." },
        { name: "Convert to tons", text: "Multiply cubic yards by density. Default 1.5 ton/yd³ for crushed stone; override if your supplier lists a different weight." },
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

      <Hero title={TITLE} tagline="Plug in length, width, and depth — get cubic yards and US tons of stone, with a density override for any aggregate type.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homeowner needs to top a 30 ft by 10 ft driveway section with 4 inches of crushed stone."
        steps={[
          { label: "Convert depth: 4 in ÷ 12", value: "0.333 ft" },
          { label: "Volume in cubic feet: 30 × 10 × 0.333", value: "100 ft³" },
          { label: "Cubic yards: 100 ÷ 27", value: "3.7 yd³" },
          { label: "Tons at 1.5 ton/yd³: 3.7 × 1.5", value: "5.6 US tons" },
          { label: "Add 10% buffer for settling and waste", value: "≈ 6.2 tons ordered" },
        ]}
        result="30 ft × 10 ft × 4 in of crushed stone ≈ 3.7 cubic yards or 5.6 US tons. Order about 6.2 tons to cover settling."
      />

      <FormulaExplained
        plainEnglish="Stone is sold by weight (tons) or volume (cubic yards). The math converts your project dimensions into volume, then multiplies by the stone's density to get weight."
        formula={
          <span>
            cubic_yards = (length × width × depth<sub>ft</sub>) ÷ 27
            <br />
            tons = cubic_yards × density (ton/yd³)
            <br />
            Default density: 1.5 ton/yd³ for crushed stone
          </span>
        }
        citation={{
          label: "AASHTO M 145 — Standard Specification for Classification of Soils and Soil-Aggregate Mixtures",
          href: "https://store.transportation.org/Common/DownloadContentFiles?id=2236",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're ordering stone for a new gravel driveway and need a delivery weight.",
          "You're topping up an existing driveway or path that has worn thin.",
          "You're building a French drain or drainage trench behind a retaining wall.",
          "You're a landscaper quoting a decorative rock bed for a client.",
          "You're a contractor estimating base aggregate under a paver patio or shed pad.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Entering depth in inches without converting to feet.", fix: "Divide inches by 12 before multiplying. The calculator's segmented unit picker handles this for you." },
          { mistake: "Using a single density for every stone type.", fix: "River rock, lava rock, and crushed limestone weigh different amounts. Ask the supplier for the actual ton/yd³ and override the default." },
          { mistake: "Forgetting a buffer for settling and waste.", fix: "Plan on 10% extra for level ground and 15–20% for soft or sloped subgrade." },
          { mistake: "Ignoring compaction in driveway specs.", fix: "Loose stone compacts down 10–20% under traffic. If the finished depth matters, order to the compacted target plus loss." },
          { mistake: "Skipping geotextile under deep base stone.", fix: "Without separation fabric over soft soil, fines migrate up and the surface ruts. The USDA NRCS field handbook calls this out for unpaved roads." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Crushed stone", definition: "Mechanically broken rock with angular faces that lock together when compacted." },
          { term: "Density", definition: "Weight per unit volume, here in US tons per cubic yard." },
          { term: "Base course", definition: "Compacted aggregate layer below a driveway surface, paver, or slab." },
          { term: "Geotextile", definition: "Permeable fabric placed between soil and stone to prevent mixing." },
          { term: "Cubic yard", definition: "27 cubic feet — the standard volume unit for bulk aggregate in the US." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "AASHTO M 145 — Classification of Soils and Soil-Aggregate Mixtures", href: "https://store.transportation.org/Common/DownloadContentFiles?id=2236" },
          { label: "USDA NRCS — National Engineering Handbook", href: "https://www.nrcs.usda.gov/resources/guides-and-instructions/national-engineering-handbook" },
          { label: "ASTM C33 / C33M — Standard Specification for Concrete Aggregates", href: "https://www.astm.org/c0033_c0033m-18.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["gravel-calculator", "mulch-calculator", "cubic-yard-calculator"]} />
    </Container>
  );
}
