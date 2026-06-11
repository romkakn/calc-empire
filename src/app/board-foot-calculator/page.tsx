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

const SLUG = "board-foot-calculator";
const TITLE = "Board Foot Calculator";
const DESC =
  "Board feet from thickness, width, length, and quantity. Hardwood lumber standard used by mills, sawyers, and woodworkers.";

const FAQS: FaqItem[] = [
  {
    question: "What is a board foot?",
    answer:
      "A board foot is a volume unit for lumber equal to 144 cubic inches — a piece 1 inch thick by 12 inches wide by 12 inches long, or any combination that multiplies to 144 cubic inches. It's the standard pricing unit for hardwoods in the United States.",
  },
  {
    question: "What's the difference between nominal and actual lumber dimensions?",
    answer:
      "Nominal sizes (like 2x4) describe the rough-sawn dimensions before drying and planing. The actual size of a finished 2x4 is 1.5 inches by 3.5 inches per the US NIST Voluntary Product Standard PS-20. Board-foot pricing for surfaced softwood usually still uses the nominal size.",
  },
  {
    question: "Should I use rough or surfaced dimensions for board feet?",
    answer:
      "Hardwood is typically sold and measured rough — use the rough thickness and width before surfacing. Many mills bill by rough board feet even after the wood is surfaced two sides (S2S) or four sides (S4S), so check the seller's invoicing convention.",
  },
  {
    question: "What do 4/4, 5/4, 6/4, and 8/4 mean?",
    answer:
      "These are quarter-inch thickness notations used by hardwood mills. 4/4 means four quarters of an inch (1 inch rough), 5/4 is 1.25 inches, 6/4 is 1.5 inches, and 8/4 is 2 inches. Surfaced thickness is about 3/16 inch less per face.",
  },
  {
    question: "Why does hardwood cost more per board foot than softwood?",
    answer:
      "Hardwoods like oak, walnut, and cherry grow slower and yield less usable wood per log, so mills charge more per board foot. Softwoods like pine and spruce are typically sold by the linear foot or piece rather than by board foot.",
  },
  {
    question: "How much waste should I add to my board-foot estimate?",
    answer:
      "Add 15 to 30 percent for waste depending on defects, grade, and how much you need to rip or crosscut for the project. Lower grades and figured woods need more — a clear straight cabinet job might only need 15 percent, while a curved or matched-grain project can need 35 percent or more.",
  },
  {
    question: "Does this calculator work for thickness in fractions like 5/4?",
    answer:
      "Yes — enter 1.25 inches for 5/4, 1.5 inches for 6/4, and 2 inches for 8/4. The formula uses decimal inches, so any decimal thickness produces an accurate result.",
  },
  {
    question: "Are linear feet and board feet the same thing?",
    answer:
      "No. A linear foot measures only length. A board foot measures volume — length, width, and thickness together. Two boards of the same length can have very different board-foot counts if their cross-sections differ.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Lumber Volume in Board Feet`,
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
      name: "How to calculate board feet",
      steps: [
        { name: "Measure thickness and width in inches", text: "Use rough dimensions for hardwood — measure before any surfacing." },
        { name: "Measure length", text: "Length can be in inches or feet — the calculator handles both." },
        { name: "Apply the board-foot formula", text: "BF = (thickness_in x width_in x length_in) / 144, or BF = (thickness_in x width_in x length_ft) / 12." },
        { name: "Multiply by quantity and add waste", text: "Multiply by the number of identical boards, then add 15-30 percent for cutting waste." },
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

      <Hero title={TITLE} tagline="Board feet from thickness, width, length, and quantity — the standard volume unit for hardwood lumber.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A woodworker needs four boards of 1 inch thick by 6 inch wide by 8 foot long red oak. How many board feet is that?"
        steps={[
          { label: "Formula: BF = (T_in x W_in x L_ft) / 12", value: "" },
          { label: "Per board: (1 x 6 x 8) / 12", value: "4 BF" },
          { label: "Quantity", value: "4 boards" },
          { label: "Total: 4 BF x 4 boards", value: "16 BF" },
        ]}
        result="Four 1 x 6 x 8 ft boards = 16 board feet total. At a hardwood price of $6 per BF, that's $96 before waste allowance."
      />

      <FormulaExplained
        plainEnglish="A board foot is the volume of a piece of lumber 1 inch thick, 12 inches wide, and 12 inches long — 144 cubic inches. Multiply thickness, width, and length, then divide by 144 (or 12 if length is in feet) to get the board-foot count for one piece. Multiply by quantity for the total."
        formula={
          <span>
            BF = (thickness<sub>in</sub> x width<sub>in</sub> x length<sub>in</sub>) / 144
            <br />
            BF = (thickness<sub>in</sub> x width<sub>in</sub> x length<sub>ft</sub>) / 12
            <br />
            Total = BF x quantity
          </span>
        }
        citation={{
          label: "National Hardwood Lumber Association — Rules for the Measurement and Inspection of Hardwood and Cypress",
          href: "https://www.nhla.com/rules",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're buying hardwood from a mill and need to convert a cut list into board feet to estimate cost.",
          "You're a sawyer milling logs and want to predict yield in board feet before cutting.",
          "You're a cabinetmaker planning a project and need to add waste allowance to a raw board-foot count.",
          "You're comparing two lumber suppliers whose prices are quoted per board foot but stocked in different thicknesses.",
          "You're a contractor specifying material for a custom timber-frame or millwork job.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using actual surfaced dimensions for hardwood.", fix: "Hardwood mills bill by rough dimensions. Use the pre-surfacing thickness and width — a 4/4 board surfaced to 13/16 inch is still 1 inch for billing." },
          { mistake: "Mixing inches and feet in the length without adjusting.", fix: "Length in inches divides by 144. Length in feet divides by 12. Pick the right denominator for the unit you entered." },
          { mistake: "Forgetting waste allowance.", fix: "Add 15 to 30 percent to the raw board-foot total. Figured or low-grade wood needs more — sometimes 35 percent or higher." },
          { mistake: "Treating a 2x4 as 2 inches by 4 inches.", fix: "Nominal softwood dimensions don't equal actual. A 2x4 is 1.5 x 3.5 inches finished, per NIST PS-20. Use actual size for engineering, nominal for board-foot pricing if the supplier does." },
          { mistake: "Counting linear feet as board feet.", fix: "Linear feet ignore thickness and width. Two pieces with the same length can have very different board-foot counts." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Board foot (BF or BdFt)", definition: "Lumber volume unit equal to 144 cubic inches — 1 in x 12 in x 12 in." },
          { term: "Nominal dimension", definition: "Pre-surfacing size used to name lumber (2x4, 1x6). Larger than the finished piece." },
          { term: "Actual dimension", definition: "True finished size after drying and planing — what you measure with a tape." },
          { term: "Quarter notation (4/4, 5/4, 8/4)", definition: "Hardwood thickness in quarters of an inch. 4/4 = 1 inch rough, 8/4 = 2 inch rough." },
          { term: "S2S / S4S", definition: "Surfaced two sides / four sides. Mill finish that reduces rough dimensions by about 3/16 inch per face." },
          { term: "Linear foot", definition: "Length-only measure, used for trim, molding, and many softwood products." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "National Hardwood Lumber Association — Rules for the Measurement and Inspection of Hardwood and Cypress", href: "https://www.nhla.com/rules" },
          { label: "USDA Forest Service — Wood Handbook, Wood as an Engineering Material (FPL-GTR-282)", href: "https://www.fpl.fs.usda.gov/documnts/fplgtr/fplgtr282/fpl_gtr282.pdf" },
          { label: "NIST — American Softwood Lumber Standard, Voluntary Product Standard PS 20", href: "https://www.nist.gov/wood-based-products/american-softwood-lumber-standard-ps-20" },
          { label: "USDA Forest Products Laboratory — Hardwood Lumber Grades", href: "https://www.fpl.fs.usda.gov/products/publications/specific_pub.php?posting_id=18743" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["cubic-yard-calculator", "stair-calculator", "gravel-calculator"]} />
    </Container>
  );
}
