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

const SLUG = "balancing-equations-calculator";
const TITLE = "Balancing Equations Calculator";
const DESC =
  "Balance any chemical equation. Mass and charge conservation, smallest integer coefficients.";

const FAQS: FaqItem[] = [
  {
    question: "Why must a chemical equation be balanced?",
    answer:
      "The law of conservation of mass says atoms are not created or destroyed in a chemical reaction. A balanced equation shows the same count of each element on both sides, which is what nature actually does.",
  },
  {
    question: "How do I balance an equation by inspection?",
    answer:
      "Start with the element that appears in the fewest formulas, then move to the next. Save free elements (like O2 or H2) for last because adjusting their coefficient only changes one count at a time.",
  },
  {
    question: "What is the half-reaction method for redox?",
    answer:
      "Split the reaction into an oxidation half and a reduction half. Balance each one separately for atoms, then for charge using electrons, and finally scale the two halves so the electrons cancel when you add them.",
  },
  {
    question: "How do I handle polyatomic ions like sulfate?",
    answer:
      "If a polyatomic ion appears unchanged on both sides, treat it as one unit rather than balancing each atom inside it. This saves steps and avoids mistakes when ions like SO4 or NO3 carry through.",
  },
  {
    question: "Why are the smallest whole-number coefficients required?",
    answer:
      "An equation balanced as 4 H2 + 2 O2 = 4 H2O is correct but not in lowest terms. Convention asks for the smallest positive integers because the ratio is what carries chemical meaning.",
  },
  {
    question: "What are common balancing mistakes students make?",
    answer:
      "Changing subscripts inside a formula instead of placing coefficients in front, forgetting to multiply through polyatomic groups, and not double-checking every element at the end are the top three errors.",
  },
  {
    question: "Can the calculator handle charges and ions?",
    answer:
      "It conserves both element counts and total charge across the reaction arrow. For redox in acidic or basic solution you usually add H+, OH-, or H2O explicitly to the input so the matrix has the right species.",
  },
  {
    question: "Does balancing tell me if a reaction actually happens?",
    answer:
      "No. A balanced equation only enforces conservation of mass and charge. Whether a reaction is spontaneous depends on thermodynamics and kinetics, which a separate calculation handles.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Chemical Equation Solver`,
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
      name: "How to balance a chemical equation",
      steps: [
        { name: "Write the skeleton equation", text: "Type reactants on the left and products on the right, separated by = (for example, H2 + O2 = H2O)." },
        { name: "Count each element", text: "List every element that appears, and write down how many atoms of each are on the reactant side and on the product side." },
        { name: "Solve for coefficients", text: "Set up a matrix of element counts and find a coefficient vector in the null space — the smallest positive integer solution is the balanced equation." },
        { name: "Verify mass and charge", text: "Multiply through and confirm every element count matches on both sides, and that total charge is equal." },
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

      <Hero title={TITLE} tagline="Type reactants and products, get smallest integer coefficients that conserve mass and charge.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student writes the synthesis of water as H2 + O2 = H2O. What are the balanced coefficients?"
        steps={[
          { label: "Skeleton equation", value: "H2 + O2 = H2O" },
          { label: "Reactant atoms: H = 2, O = 2", value: "" },
          { label: "Product atoms: H = 2, O = 1", value: "" },
          { label: "Double the water to fix oxygen: H2 + O2 = 2 H2O", value: "" },
          { label: "Now H is 2 on left, 4 on right — double H2", value: "" },
          { label: "Balanced", value: "2 H2 + O2 = 2 H2O" },
          { label: "Check: 4 H and 2 O on each side", value: "matches" },
        ]}
        result="2 H2 + O2 = 2 H2O. Each side has 4 hydrogen atoms and 2 oxygen atoms, so mass is conserved and the coefficients are the smallest positive integers."
      />

      <FormulaExplained
        plainEnglish="Every chemical formula is converted into a count of atoms per element. Stack the counts into a matrix where each column is a species and each row is an element, with products negated. The balanced coefficients are a vector in the matrix's null space, scaled to the smallest positive integers."
        formula={
          <span>
            For species s<sub>1</sub>, s<sub>2</sub>, …, s<sub>n</sub> and elements e<sub>1</sub>, …, e<sub>m</sub>:
            <br />
            M[i][j] = (atoms of e<sub>i</sub> in s<sub>j</sub>) · (+1 reactant, −1 product)
            <br />
            Solve M · c = 0 for integer c &gt; 0, then divide c by gcd(c) for smallest integers.
          </span>
        }
        citation={{
          label: "OpenStax Chemistry 2e — §4.1 Writing and Balancing Chemical Equations",
          href: "https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are doing chemistry homework and need to balance a reaction before computing stoichiometry.",
          "You are studying for a general-chemistry exam and want a fast check on your by-hand work.",
          "You are a teacher preparing worked examples and want to confirm the answer key.",
          "You are setting up a lab procedure and need correct mole ratios for reactants.",
          "You are a tutor explaining how the null-space view of balancing connects to linear algebra.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Changing a subscript inside a formula (H2O to H2O2) to make atoms match.", fix: "Only adjust the coefficient placed in front of the formula. Subscripts identify the substance and must not change." },
          { mistake: "Forgetting to multiply every atom inside a polyatomic group by its subscript.", fix: "Treat groups like (NO3)2 as 2 nitrogen and 6 oxygen atoms, not 1 and 3." },
          { mistake: "Leaving coefficients as fractions like 1/2 O2.", fix: "Multiply the whole equation by the denominator so every coefficient is a positive integer." },
          { mistake: "Skipping the final element check.", fix: "Tally every element on both sides after writing the balanced equation. One missed element invalidates the whole answer." },
          { mistake: "Ignoring charge in ionic or redox equations.", fix: "Total charge must be equal on both sides. Add electrons in half-reactions or balance with H+, OH-, or H2O as the medium requires." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Stoichiometry", definition: "The quantitative relationship between reactants and products, derived from the balanced equation." },
          { term: "Coefficient", definition: "The integer in front of a chemical formula that scales the number of molecules or moles." },
          { term: "Conservation of mass", definition: "The total mass of reactants equals the total mass of products in any closed reaction." },
          { term: "Half-reaction", definition: "Either the oxidation or reduction part of a redox reaction, written and balanced separately." },
          { term: "Polyatomic ion", definition: "A charged group of covalently bound atoms (for example, sulfate SO4 with a charge of minus two) that often travels through a reaction intact." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax Chemistry 2e — Writing and Balancing Chemical Equations", href: "https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations" },
          { label: "Khan Academy — Balancing chemical equations", href: "https://www.khanacademy.org/science/chemistry/chemical-reactions-stoichiome/balancing-chemical-equations/a/balancing-chemical-equations" },
          { label: "IUPAC — Nomenclature of Inorganic Chemistry (Red Book)", href: "https://iupac.org/what-we-do/nomenclature/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["dilution-calculator", "ohms-law-calculator", "scientific-notation-calculator"]} />
    </Container>
  );
}
