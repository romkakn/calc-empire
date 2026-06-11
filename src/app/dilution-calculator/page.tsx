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

const SLUG = "dilution-calculator";
const TITLE = "Dilution Calculator";
const DESC =
  "Solve M1V1 = M2V2 for solution dilution. Enter stock concentration, target concentration, and target volume — get the exact stock volume to draw and diluent to add.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between molarity and molality?",
    answer:
      "Molarity (M) is moles of solute per liter of solution. Molality (m) is moles of solute per kilogram of solvent. M1V1 = M2V2 uses molarity, so the calculator returns volume — not mass.",
  },
  {
    question: "What is a dilution factor?",
    answer:
      "The dilution factor is the ratio of final volume to initial volume (V2 / V1). A 1:10 dilution has a factor of 10 — one part stock plus nine parts diluent. The final concentration drops by the same factor.",
  },
  {
    question: "What is a serial dilution?",
    answer:
      "A serial dilution is a stepwise sequence where each new tube is diluted from the previous one by the same factor. Five 1:10 steps from 1 M gives 0.1, 0.01, 0.001, 0.0001, and 0.00001 M. It is the standard way to reach very low concentrations accurately.",
  },
  {
    question: "Do M1 and M2 have to use the same units?",
    answer:
      "Yes. If your stock is in mM and your target is in M, convert one of them first. The calculator includes a unit picker so 1000 mM and 1 M return the same answer. V1 and V2 must also share a unit.",
  },
  {
    question: "How is this used in cell culture or buffer prep?",
    answer:
      "Lab benches use M1V1 = M2V2 daily — making a 1x running buffer from a 10x stock, plating 10 uM drug from a 10 mM DMSO aliquot, or thinning a 5 mg/mL antibody to a working dilution. The same algebra works for percent (w/v) and mg/mL — just keep the units consistent.",
  },
  {
    question: "Where does dilution error usually come from?",
    answer:
      "Pipetting volumes under 2 uL, viscous stocks, and temperature changes are the biggest culprits. Mix thoroughly after adding diluent, and prefer two larger transfers over one tiny one when the target volume is small.",
  },
  {
    question: "Can I use this for percent (w/v) or mg/mL?",
    answer:
      "Yes. C1V1 = C2V2 is the general form. As long as C1 and C2 share a unit (mg/mL with mg/mL, % with %), the same arithmetic applies. The unit picker is labeled with molar units, but the math does not care.",
  },
  {
    question: "What if V1 comes out larger than V2?",
    answer:
      "That means your target concentration is higher than your stock, which is not a dilution — it would require concentrating, not diluting. Double-check that M1 is greater than M2 before pipetting anything.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — M1V1 = M2V2 Solver`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Science", path: "/science" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "science", description: DESC }),
    howToSchema({
      name: "How to dilute a stock solution with M1V1 = M2V2",
      steps: [
        { name: "Write down M1, M2, V2", text: "M1 is the stock concentration on the bottle. M2 is the target concentration you want. V2 is the final volume you need to make." },
        { name: "Solve for V1", text: "V1 = (M2 × V2) / M1. This is the volume of stock to draw." },
        { name: "Calculate diluent", text: "Diluent volume = V2 − V1. This is the water, buffer, or media to add." },
        { name: "Mix and verify", text: "Add stock to diluent, mix thoroughly, and label with concentration and date." },
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

      <Hero title={TITLE} tagline="Calculate exactly how much stock and diluent to mix using M1V1 = M2V2 — for molarity, mg/mL, or percent solutions.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You have a 10 M stock of HCl and need 100 mL of a 2 M working solution. How much stock do you draw, and how much water do you add?"
        steps={[
          { label: "Formula: M1 × V1 = M2 × V2 → V1 = (M2 × V2) / M1", value: "" },
          { label: "Plug in: V1 = (2 × 100) / 10", value: "" },
          { label: "Numerator: 2 × 100", value: "200" },
          { label: "Divide by M1: 200 / 10", value: "20 mL stock" },
          { label: "Diluent: V2 − V1 = 100 − 20", value: "80 mL water" },
        ]}
        result="Draw 20 mL of the 10 M HCl stock, add 80 mL of water — final 100 mL at 2 M. Always add acid to water, never the reverse."
      />

      <FormulaExplained
        plainEnglish="A dilution is just conservation of solute. The number of moles you start with (M1 × V1) has to equal the number of moles you end with (M2 × V2) — you are spreading the same solute across a larger volume. Rearrange to solve for whatever is unknown."
        formula={
          <span>
            M<sub>1</sub> × V<sub>1</sub> = M<sub>2</sub> × V<sub>2</sub>
            <br />
            Stock to draw: V<sub>1</sub> = (M<sub>2</sub> × V<sub>2</sub>) / M<sub>1</sub>
            <br />
            Diluent to add: V<sub>2</sub> − V<sub>1</sub>
          </span>
        }
        citation={{
          label: "OpenStax Chemistry 2e — Section 3.5, Solution Dilution",
          href: "https://openstax.org/books/chemistry-2e/pages/3-5-other-units-for-solution-concentrations",
        }}
      />

      <WhenToUse
        scenarios={[
          "Preparing working buffers from a concentrated stock (10x to 1x TBS, PBS, SSC).",
          "Plating drug dilutions from a DMSO aliquot for a dose-response curve.",
          "Thinning antibodies, primers, or enzymes to a working concentration before an assay.",
          "Making cleaning or reagent solutions in a teaching lab from a stockroom bottle.",
          "Checking a colleague's calculation before pipetting an expensive or hazardous reagent.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing units between M1 and M2 (e.g., mM with M).", fix: "Convert to one unit first. 1 M = 1000 mM = 1,000,000 uM." },
          { mistake: "Forgetting to subtract V1 from V2 to find the diluent.", fix: "Total volume is V2. Diluent = V2 − V1, not V2 itself." },
          { mistake: "Pipetting volumes below 2 uL directly.", fix: "Do an intermediate dilution first — pipettes lose accuracy fast under 2 uL." },
          { mistake: "Adding stock to an empty tube and topping up by eye.", fix: "Add diluent to a marked volume, then add stock and mix. For acids, always add acid to water." },
          { mistake: "Assuming volumes are additive for very concentrated stocks.", fix: "For dilute solutions this is fine. For highly concentrated stocks (>50% v/v), final volume can shrink — measure V2 in the final container." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Molarity (M)", definition: "Moles of solute per liter of solution. The unit M1 and M2 carry by default." },
          { term: "Stock solution", definition: "A concentrated solution kept on hand and diluted as needed for working solutions." },
          { term: "Diluent", definition: "The solvent (often water, buffer, or media) added to lower the concentration." },
          { term: "Serial dilution", definition: "A chain of dilutions, each taking from the previous tube — used to reach very low concentrations." },
          { term: "Dilution factor", definition: "Ratio of final to initial volume (V2 / V1). A 1:10 dilution has a factor of 10." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax Chemistry 2e — 3.5 Other Units for Solution Concentrations", href: "https://openstax.org/books/chemistry-2e/pages/3-5-other-units-for-solution-concentrations" },
          { label: "Khan Academy — Dilution and Concentration", href: "https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/mixtures-and-solutions/a/molarity" },
          { label: "NIST — Guidelines for Evaluating and Expressing Uncertainty (TN 1297)", href: "https://www.nist.gov/pml/nist-technical-note-1297" },
          { label: "LibreTexts Chemistry — Dilutions of Solutions", href: "https://chem.libretexts.org/Bookshelves/General_Chemistry/Map%3A_Chemistry_(Zumdahl_and_Decoste)/04%3A_Types_of_Chemical_Reactions_and_Solution_Stoichiometry/4.03%3A_The_Composition_of_Solutions" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["balancing-equations-calculator", "ohms-law-calculator", "fractions-calculator"]} />
    </Container>
  );
}
