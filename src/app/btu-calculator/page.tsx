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

const SLUG = "btu-calculator";
const TITLE = "BTU Calculator";
const DESC =
  "Estimate heating and cooling BTU/h for a room from square footage, ceiling height, sun exposure, and occupant count.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between BTU and tons of cooling?",
    answer:
      "A ton of cooling equals 12,000 BTU/h. So a 24,000 BTU/h system is a 2-ton unit. The term comes from how much heat is needed to melt one ton of ice in 24 hours.",
  },
  {
    question: "Is rule-of-thumb sizing as good as Manual J?",
    answer:
      "No. Rule-of-thumb (square footage times a baseline BTU/h number) is a quick estimate for planning. Manual J is a full room-by-room load calculation that accounts for windows, insulation R-values, infiltration, and climate. HVAC pros use Manual J for any actual install.",
  },
  {
    question: "Why is oversizing an air conditioner a problem?",
    answer:
      "An oversized AC cools the air fast but does not run long enough to pull humidity out. You end up with a clammy room, short-cycling, higher energy bills, and shorter equipment life.",
  },
  {
    question: "How does climate zone change the BTU number?",
    answer:
      "Hotter and more humid zones need more BTU/h per square foot. A room in Phoenix may need 25 to 30 BTU/h per sq ft for cooling, while a similar room in Seattle can do well at 15 to 20 BTU/h per sq ft.",
  },
  {
    question: "Should I pick a mini-split or central AC?",
    answer:
      "Mini-splits work well for a single room, a home addition, or a house without ductwork. Central AC is usually a better fit for whole-home cooling when ducts already exist. Both are sized in BTU/h.",
  },
  {
    question: "What does SEER mean and how is it different from BTU?",
    answer:
      "BTU/h is the cooling capacity. SEER (Seasonal Energy Efficiency Ratio) is how efficiently the system delivers that capacity over a cooling season. A higher SEER means less electricity for the same BTU.",
  },
  {
    question: "Do I need to add BTU for a kitchen?",
    answer:
      "Yes. Kitchens generate extra heat from cooking and appliances, so add about 1,000 BTU/h beyond the room baseline.",
  },
  {
    question: "Does this calculator give a final equipment spec?",
    answer:
      "No. It is a planning estimate. For any install, get a licensed HVAC contractor to run a Manual J calculation on your specific home.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Room BTU/h Sizing Estimate`,
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
      name: "How to estimate cooling BTU/h for a room",
      steps: [
        { name: "Measure square footage", text: "Multiply room length by width in feet. For an L-shaped room, break it into rectangles and sum them." },
        { name: "Apply the baseline", text: "Multiply square footage by 20 BTU/h per sq ft as a starting point for cooling." },
        { name: "Adjust for sun and use", text: "Add 10 percent for a sunny room, subtract 10 percent for a heavily shaded one, add 1,000 BTU/h if it is a kitchen." },
        { name: "Add for occupants", text: "Add 600 BTU/h for each regular occupant beyond two." },
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

      <Hero title={TITLE} tagline="Get a planning estimate of cooling BTU/h for any room — square footage, ceiling height, sun, and occupants in one place.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 300 sq ft living room with 8 ft ceilings, average sun, two occupants, no kitchen load."
        steps={[
          { label: "Baseline: 300 sq ft × 20 BTU/h per sq ft", value: "6,000 BTU/h" },
          { label: "Sun adjustment (average)", value: "× 1.00" },
          { label: "Occupants over 2: 0 extra people × 600 BTU/h", value: "+ 0 BTU/h" },
          { label: "Kitchen load", value: "+ 0 BTU/h" },
          { label: "Total estimate", value: "6,000 BTU/h" },
        ]}
        result="About 6,000 BTU/h of cooling — a typical 5,000 to 6,000 BTU/h window unit or a small mini-split head will cover this room."
      />

      <FormulaExplained
        plainEnglish="Cooling load is mostly a function of room size. The 20 BTU/h per square foot baseline comes from the U.S. Department of Energy and ENERGY STAR room-AC sizing guidance. Sun exposure, occupants, and kitchen heat then nudge the number up or down."
        formula={
          <span>
            Base BTU/h = sq ft × 20
            <br />
            Sunny room: × 1.10 &nbsp; · &nbsp; Shaded room: × 0.90
            <br />
            Occupants &gt; 2: + 600 BTU/h each
            <br />
            Kitchen: + 1,000 BTU/h
          </span>
        }
        citation={{
          label: "ENERGY STAR — Room Air Conditioner sizing guidance",
          href: "https://www.energystar.gov/products/heating_cooling/air_conditioning_room",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're shopping for a window AC and need to know what BTU rating to buy.",
          "You're planning a mini-split for a home addition or converted garage.",
          "You're a landlord pricing AC replacements for a rental unit.",
          "You're a DIY homeowner sanity-checking a contractor's proposal before signing.",
          "You're a student or new HVAC tech learning how rule-of-thumb sizing works.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Buying the biggest AC you can afford.", fix: "Oversized units short-cycle, leave humidity behind, and cost more to run. Match BTU to the load." },
          { mistake: "Ignoring ceiling height.", fix: "A room with 10 ft ceilings has 25 percent more air to cool than the same footprint with 8 ft ceilings. Adjust upward." },
          { mistake: "Using cooling BTU as heating BTU.", fix: "Heating loads depend on outdoor temperature, insulation, and infiltration. They're not the same number — get a Manual J for any furnace or heat pump sizing." },
          { mistake: "Skipping insulation and window quality.", fix: "A poorly insulated room with single-pane windows can need 30 to 50 percent more BTU/h than the baseline suggests." },
          { mistake: "Treating this estimate as a final spec.", fix: "Use it for planning only. A licensed HVAC contractor running Manual J is the standard for any real install." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "BTU/h", definition: "British Thermal Units per hour — the rate at which a system moves heat." },
          { term: "Ton of cooling", definition: "12,000 BTU/h. A 3-ton AC is rated at 36,000 BTU/h." },
          { term: "Manual J", definition: "ACCA's residential load calculation standard. The accepted method for sizing HVAC in a home." },
          { term: "SEER", definition: "Seasonal Energy Efficiency Ratio. Higher SEER means less electricity per BTU of cooling." },
          { term: "Sensible vs latent load", definition: "Sensible load is air temperature; latent load is humidity. AC systems handle both." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "ACCA — Manual J Residential Load Calculation", href: "https://www.acca.org/standards/technical-manuals/manual-j" },
          { label: "ENERGY STAR — Room Air Conditioner sizing guidance", href: "https://www.energystar.gov/products/heating_cooling/air_conditioning_room" },
          { label: "U.S. Department of Energy — Sizing a New Heating and Cooling System", href: "https://www.energy.gov/energysaver/sizing-new-heating-and-cooling-system" },
          { label: "ASHRAE — Standard 90.1 Energy Standard for Buildings", href: "https://www.ashrae.org/technical-resources/bookstore/standard-90-1" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["square-footage-calculator", "stair-calculator", "cubic-yard-calculator"]} />
    </Container>
  );
}
