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

const SLUG = "stair-calculator";
const TITLE = "Stair Calculator";
const DESC =
  "Stringer length, riser height, and tread depth from your total rise. IRC 2024 code limits flagged automatically.";

const FAQS: FaqItem[] = [
  {
    question: "What is the maximum riser height allowed by code?",
    answer:
      "The IRC 2024 caps riser height at 7.75 inches for residential stairs. OSHA limits fixed industrial stairs to 9.5 inches. Anything taller gets uncomfortable and trips inspections.",
  },
  {
    question: "What is the minimum tread depth?",
    answer:
      "IRC 2024 requires at least 10 inches of tread depth on residential stairs, measured from nosing to nosing. Deeper treads (11 inches or more) feel safer for descent.",
  },
  {
    question: "How do I figure out how many steps I need?",
    answer:
      "Divide your total rise by the max riser height (7.75 inches) and round up. That gives the number of risers. Treads are always one fewer than risers because the top floor counts as the last landing.",
  },
  {
    question: "What is the steepest a staircase can be?",
    answer:
      "IRC 2024 limits residential stair angle to about 36 degrees from horizontal. A 7.75-inch riser paired with a 10-inch tread sits right at that ceiling.",
  },
  {
    question: "How much headroom do I need above the stairs?",
    answer:
      "IRC 2024 requires a minimum 80 inches of clearance, measured vertically from the nosing line. Older codes allowed less, so check your local amendments.",
  },
  {
    question: "When do I need a handrail?",
    answer:
      "IRC 2024 requires a handrail on any stair flight with four or more risers. The grip must sit between 34 and 38 inches above the nosing.",
  },
  {
    question: "What is a stringer?",
    answer:
      "A stringer is the angled board that supports the treads and risers. Open stringers expose the step cutouts on the side; closed stringers hide them inside a routed channel.",
  },
  {
    question: "Is total rise the same as ceiling height?",
    answer:
      "No. Total rise is the vertical distance from finished floor below to finished floor above. That usually equals ceiling height plus floor joist depth plus subfloor and finished floor thickness.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Stringer, Rise & Run from Total Rise`,
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
      name: "How to calculate stair dimensions from total rise",
      steps: [
        { name: "Measure total rise", text: "Measure floor to floor in inches — finished surface to finished surface, not ceiling height." },
        { name: "Solve for riser count", text: "Divide total rise by 7.75 (IRC max riser) and round up. That is the number of risers." },
        { name: "Find riser height and run", text: "Riser height = total rise / risers. Run = (risers − 1) × tread depth." },
        { name: "Compute stringer length", text: "Stringer = √(rise² + run²). This is the diagonal cut length of the support board." },
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

      <Hero title={TITLE} tagline="Plug in your floor-to-floor measurement and a preferred tread depth — get riser height, run, and stringer length with IRC 2024 limits flagged.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homeowner is framing a basement stair with 108 inches of total rise (9 ft) and wants 10-inch treads."
        steps={[
          { label: "Risers needed: ceil(108 / 7.75)", value: "14" },
          { label: "Riser height: 108 / 14", value: "7.71 in" },
          { label: "Treads: 14 − 1", value: "13" },
          { label: "Total run: 13 × 10", value: "130 in" },
          { label: "Stringer: √(108² + 130²)", value: "169 in" },
        ]}
        result="14 risers at 7.71 in, 13 treads at 10 in, 130 in run, 169 in stringer. Sits at the IRC 2024 riser ceiling — safe for inspection."
      />

      <FormulaExplained
        plainEnglish="A staircase is a right triangle. Total rise is the vertical leg, total run is the horizontal leg, and the stringer is the hypotenuse. Codes cap riser height and tread depth so the angle stays walkable."
        formula={
          <span>
            risers = ceil(total_rise / 7.75)
            <br />
            riser_height = total_rise / risers
            <br />
            treads = risers − 1
            <br />
            run = treads × tread_depth
            <br />
            stringer = √(rise² + run²)
          </span>
        }
        citation={{
          label: "International Residential Code (IRC) 2024 — Section R311.7 Stairways",
          href: "https://codes.iccsafe.org/content/IRC2024P1/chapter-3-building-planning",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are framing a new staircase and need to size the stringers before cutting lumber.",
          "You are replacing an old stair and want to confirm the geometry meets current IRC code.",
          "You are designing a deck or porch stair and need to verify riser and tread limits.",
          "You are a contractor estimating material for a job before ordering stringers.",
          "You are a homeowner doing a permit sketch and need the headroom and angle numbers.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Measuring ceiling height instead of total rise.", fix: "Total rise is finished floor to finished floor. Add joist depth and flooring thickness to the room height." },
          { mistake: "Using uneven riser heights.", fix: "IRC limits riser variation to 3/8 inch across the entire flight. Divide total rise evenly across all risers." },
          { mistake: "Forgetting that treads = risers − 1.", fix: "The top landing replaces the last tread. A 14-riser stair has 13 treads, not 14." },
          { mistake: "Ignoring nosing overhang.", fix: "Most treads need a 3/4 to 1 1/4 inch nosing per IRC. Tread board width is greater than your tread depth measurement." },
          { mistake: "Skipping the permit and inspection.", fix: "Stairs are a top-five cause of home injury. Permit drawings catch math errors before the saw comes out." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Total rise", definition: "Vertical distance from finished floor below to finished floor above." },
          { term: "Riser", definition: "The vertical face between two treads. Height limited by code." },
          { term: "Tread", definition: "The horizontal step surface. Depth measured nosing to nosing." },
          { term: "Stringer", definition: "The angled support board that carries the treads and risers." },
          { term: "Nosing", definition: "The front edge of the tread that overhangs the riser below." },
          { term: "Headroom", definition: "Vertical clearance above the stair, measured from the nosing line." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "International Code Council — IRC 2024 Section R311.7 Stairways", href: "https://codes.iccsafe.org/content/IRC2024P1/chapter-3-building-planning" },
          { label: "OSHA 1910.25 — Stairways (fixed industrial stairs)", href: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.25" },
          { label: "ADA Standards Section 504 — Stairways", href: "https://www.access-board.gov/ada/#ada-504" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["board-foot-calculator", "square-footage-calculator", "btu-calculator"]} />
    </Container>
  );
}
