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

const SLUG = "asphalt-calculator";
const TITLE = "Asphalt Calculator";
const DESC =
  "Estimate how many tons of asphalt — and how much it'll cost — for a driveway, overlay, or paving project.";

const FAQS: FaqItem[] = [
  {
    question: "How much asphalt do I need for a driveway?",
    answer:
      "A typical 12 ft × 50 ft residential driveway at 2 in thick takes about 7.5 tons of hot-mix asphalt (HMA), plus a 5% waste factor. Enter your exact dimensions above for a precise number.",
  },
  {
    question: "How thick should a driveway be?",
    answer:
      "Residential driveways: 2 in over a 4 in compacted base for cars; 3 in for occasional trucks. Commercial lots: 3–4 in over a 6–8 in base. Local frost depth and soil type matter.",
  },
  {
    question: "How much does asphalt cost per ton in 2026?",
    answer:
      "$100–$150 per ton delivered in most US markets, varying with oil prices, haul distance, and quantity. Smaller jobs run higher per-ton because of mobilisation costs.",
  },
  {
    question: "Asphalt vs concrete — which is cheaper?",
    answer:
      "Asphalt is cheaper upfront (often 30–40% less than concrete) but has a shorter life cycle (15–25 years vs 30–40) and needs sealcoating every 3–5 years.",
  },
  {
    question: "What's the difference between hot mix and cold mix asphalt?",
    answer:
      "Hot mix (HMA) is the standard for new builds and large repairs — placed and compacted at 275–325°F. Cold mix is a patching material for potholes that works at ambient temperature; weaker and shorter-lived.",
  },
  {
    question: "Why use a waste factor?",
    answer:
      "Irregular edges, compaction loss, and surface variation eat material. A 5% waste factor is the industry default for rectangular jobs; bump to 10% for curves, transitions, or steep grades.",
  },
  {
    question: "How is asphalt tonnage calculated?",
    answer:
      "Multiply length × width × thickness (all in consistent units) to get volume. Multiply volume by density (typically 145 lb/ft³ for HMA), then divide by 2,000 to convert pounds to tons. Add a waste factor.",
  },
  {
    question: "Do I need to remove existing asphalt before paving?",
    answer:
      "For an overlay (2 in or thicker on top of stable existing asphalt) — no, but mill the edges. For a full rebuild — yes, remove and rework the base. A contractor's assessment is worth the call.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Tons & Cost (2026)`,
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
      name: "How to estimate asphalt tonnage",
      steps: [
        { name: "Measure length × width × thickness", text: "Length and width in feet, thickness in inches." },
        { name: "Compute volume in cubic feet", text: "Volume = L × W × (thickness ÷ 12)." },
        { name: "Multiply by density", text: "Hot mix asphalt is roughly 145 lb/ft³. Cold mix and porous mixes are lower." },
        { name: "Divide by 2,000 to get tons", text: "1 short ton = 2,000 lb." },
        { name: "Add a waste factor", text: "5% for rectangular jobs; 10% for curves or steep grades." },
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

      <Hero
        title={TITLE}
        tagline="Tons, volume, and a price estimate for any rectangular asphalt job — driveway, overlay, or new build."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 50 ft × 12 ft residential driveway, 2 in thick, paved with hot-mix asphalt (145 lb/ft³), 5% waste, at $110 / ton."
        steps={[
          { label: "Area = 50 × 12", value: "600 sq ft" },
          { label: "Volume = 600 × (2 / 12)", value: "100 ft³" },
          { label: "Weight = 100 × 145", value: "14,500 lb" },
          { label: "Tons (no waste) = 14,500 / 2,000", value: "7.25 tons" },
          { label: "With 5% waste = 7.25 × 1.05", value: "7.61 tons" },
          { label: "Cost = 7.61 × $110", value: "$837" },
        ]}
        result="Plan for ~7.6 tons and a material cost near $840 — labor, base prep, and mobilisation are separate."
      />

      <FormulaExplained
        plainEnglish="Asphalt is sold by weight, but you measure your project by area and thickness. Convert area + thickness to volume, multiply by the mix density, divide by 2,000 to get short tons, then add a small buffer for compaction and edge loss."
        formula={
          <span>
            tons = (L<sub>ft</sub> × W<sub>ft</sub> × T<sub>in</sub> ÷ 12) × density<sub>lb/ft³</sub> ÷ 2,000 × (1 + waste)
          </span>
        }
        citation={{
          label: "National Asphalt Pavement Association — Design & Construction",
          href: "https://www.asphaltpavement.org/expertise/design",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're getting bids for a new driveway and want to sanity-check the contractor's tonnage estimate.",
          "You're planning a parking-lot overlay and need to budget the material cost.",
          "You're patching a road shoulder or a walking path and need to order the right amount of mix.",
          "You're a landscaper or general contractor scoping a paving job for a client.",
          "You're a homeowner deciding whether sealcoating or repaving is the right move.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting to convert thickness to feet.", fix: "Thickness is in inches but length and width are in feet. Divide thickness by 12 before multiplying for volume." },
          { mistake: "Using cold-mix density for a hot-mix job.", fix: "Cold mix is closer to 130 lb/ft³; hot mix is 145. The wrong density throws tonnage off by ~10%." },
          { mistake: "Ignoring the waste factor.", fix: "Compaction alone loses 10–15% of loose volume. The 5% waste buffer is on top of that — your contractor's quote already assumes compacted density." },
          { mistake: "Paving over a failing base.", fix: "If the base is cracked or unstable, an overlay will reflect the cracks within a year. Spend the money on base prep first." },
          { mistake: "Mixing tons of asphalt with cubic yards.", fix: "Different units, different jobs. Tonnage is what you'll be billed in; cubic yards is what fits in the truck." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Hot mix asphalt (HMA)", definition: "Standard paving mix produced at ~300°F. Most common for driveways, roads, and lots." },
          { term: "Density", definition: "Weight per unit volume. Affects how much your job will weigh in tons." },
          { term: "Compaction", definition: "Rolling the laid asphalt to reach design density. Reduces loose volume by 10–15%." },
          { term: "Base course", definition: "Compacted aggregate under the asphalt. Distributes load and prevents settling." },
          { term: "Binder course", definition: "The intermediate asphalt layer between base and surface in thicker pavements." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "National Asphalt Pavement Association — Design & Construction", href: "https://www.asphaltpavement.org/expertise/design" },
          { label: "Asphalt Institute — Pavement design & maintenance", href: "https://www.asphaltinstitute.org/engineering/" },
          { label: "FHWA — Asphalt mixture characterization", href: "https://www.fhwa.dot.gov/pavement/asphalt/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-27" />

      <RelatedCalculators slugs={["mortgage-recast-calculator", "mixed-number-calculator", "variance-calculator"]} />
    </Container>
  );
}
