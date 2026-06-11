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

const SLUG = "mulch-calculator";
const TITLE = "Mulch Calculator";
const DESC =
  "Cubic yards and bags of mulch from L x W x depth. Hardwood, cypress, rubber densities.";

const FAQS: FaqItem[] = [
  {
    question: "How deep should mulch be?",
    answer:
      "Two to four inches is the standard recommendation for most landscape beds. Less than two inches will not block weeds well, while more than four can suffocate roots and trap moisture against bark.",
  },
  {
    question: "Hardwood vs cypress vs rubber — which lasts longest?",
    answer:
      "Rubber mulch lasts the longest (10+ years) because it does not decompose, but it can leach zinc and other compounds. Cypress mulch lasts about 2–3 years and resists rot. Hardwood mulch breaks down in 1–2 years and adds organic matter to the soil as it decomposes.",
  },
  {
    question: "When should I refresh mulch?",
    answer:
      "Top off mulch once a year, usually in spring, to bring the layer back to a 2–4 inch depth. Fully replace organic mulch every 2–3 years once it has broken down into soil-like material.",
  },
  {
    question: "Do I need a weed barrier underneath?",
    answer:
      "Landscape fabric helps for the first season but tends to clog and tear over time. A 3-inch mulch layer alone blocks most weeds. For paths and inorganic beds, a barrier is worth it; for planting beds, skip it so soil can breathe.",
  },
  {
    question: "Is dyed mulch safe for pets and plants?",
    answer:
      "Dyed mulch made from clean wood and iron-oxide or carbon-based colorants is generally safe. Avoid mulch made from recycled treated lumber (CCA wood), which can contain arsenic. Look for the Mulch and Soil Council certification logo to confirm the source.",
  },
  {
    question: "How much does a cubic yard of mulch cost?",
    answer:
      "Bulk mulch typically runs $30–$60 per cubic yard for hardwood, $40–$75 for cypress, and $100–$200 for rubber. Bagged mulch costs more per cubic yard but is easier to transport and store for small jobs.",
  },
  {
    question: "How many bags of mulch are in a cubic yard?",
    answer:
      "A cubic yard equals 27 cubic feet. That works out to 13.5 bags of 2 cubic foot mulch, 9 bags of 3 cubic foot, or 27 bags of 1 cubic foot.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cubic Yards & Bags by Bed Size`,
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
      name: "How to calculate mulch for a landscape bed",
      steps: [
        { name: "Measure the bed", text: "Record length and width in feet. For irregular beds, break them into rectangles and sum the areas." },
        { name: "Pick a depth", text: "Two to four inches is standard. Use 2 in for refresh, 3 in for new beds, 4 in for weed-prone areas." },
        { name: "Convert to cubic yards", text: "Multiply length × width × depth (all in feet), then divide by 27 to get cubic yards." },
        { name: "Convert to bags", text: "Multiply cubic yards by 13.5 for 2 cu ft bags, by 27 for 1 cu ft bags, or by 9 for 3 cu ft bags." },
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

      <Hero title={TITLE} tagline="Enter length, width, and depth — get cubic yards plus the exact bag count for hardwood, cypress, or rubber mulch.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homeowner is mulching a 20 ft by 10 ft front bed at 3 in deep and wants to know how many 2 cu ft bags to buy."
        steps={[
          { label: "Convert depth to feet: 3 in ÷ 12", value: "0.25 ft" },
          { label: "Volume in cubic feet: 20 × 10 × 0.25", value: "50 cu ft" },
          { label: "Convert to cubic yards: 50 ÷ 27", value: "1.85 cu yd" },
          { label: "Bags of 2 cu ft mulch: 50 ÷ 2", value: "25 bags" },
        ]}
        result="A 20 × 10 ft bed at 3 in deep needs 1.85 cubic yards — 25 bags of 2 cu ft mulch."
      />

      <FormulaExplained
        plainEnglish="Mulch is sold by volume. Multiply the bed's length and width by the desired depth (all in the same unit) to get cubic feet, then divide by 27 to get cubic yards. Bag count is total cubic feet divided by bag size."
        formula={
          <span>
            cubic yards = (L<sub>ft</sub> × W<sub>ft</sub> × depth<sub>ft</sub>) ÷ 27
            <br />
            depth<sub>ft</sub> = depth<sub>in</sub> ÷ 12
            <br />
            bags = (L × W × depth) ÷ bag size (cu ft)
          </span>
        }
        citation={{
          label: "USDA NRCS — Mulching Conservation Practice Standard",
          href: "https://www.nrcs.usda.gov/conservation-basics/conservation-by-state",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're planning a spring mulch refresh and need to know how many bags fit in the car.",
          "You're pricing bulk vs bagged mulch for a large yard.",
          "You're a landscaper estimating a quote for a client's beds.",
          "You're a homeowner figuring out whether a delivery makes sense for a small project.",
          "You're comparing hardwood, cypress, and rubber mulch costs at the same depth.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mulching too deep around tree trunks.", fix: "Keep mulch at 2–4 in and pull it back from the trunk. Volcano mulching traps moisture against bark and invites rot and pests." },
          { mistake: "Measuring in inches but forgetting to convert.", fix: "Depth must be in feet for the cubic-yard formula. 3 in = 0.25 ft, 4 in = 0.333 ft." },
          { mistake: "Ordering by the cubic foot when sellers price by the yard.", fix: "Bulk yards sell by cubic yard (27 cu ft). Convert before comparing prices to bagged mulch." },
          { mistake: "Skipping the bag-size check.", fix: "Bag sizes vary — 1, 2, and 3 cu ft are all common. A 50% smaller bag means 50% more bags to haul." },
          { mistake: "Ignoring compaction.", fix: "Loose mulch settles by about 15–20% in the first month. Order a touch extra for a 3 in finished depth." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cubic yard", definition: "27 cubic feet — the standard bulk unit for landscape materials." },
          { term: "Organic mulch", definition: "Plant-based mulch (hardwood, cypress, pine straw) that decomposes and feeds the soil." },
          { term: "Inorganic mulch", definition: "Non-living mulch (rubber, stone, glass) that does not break down." },
          { term: "Mulch ring", definition: "A 2–4 in mulch layer around a tree, kept off the trunk by 3–6 in." },
          { term: "Bulk yard", definition: "A landscape-supply unit equal to one cubic yard, often sold by the scoop or truckload." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "USDA NRCS — Mulching Conservation Practice Standard (Code 484)", href: "https://www.nrcs.usda.gov/conservation-basics/conservation-by-state" },
          { label: "National Gardening Association — Mulch basics", href: "https://garden.org/learn/articles/view/424/" },
          { label: "Mulch and Soil Council — Product certification", href: "https://mulchandsoilcouncil.org/" },
          { label: "ASTM D6155 — Standard Specification for Nonmetallic Vapor-Permeable Sheet Mulch", href: "https://www.astm.org/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["gravel-calculator", "cubic-yard-calculator", "stone-calculator"]} />
    </Container>
  );
}
