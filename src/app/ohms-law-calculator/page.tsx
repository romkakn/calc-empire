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

const SLUG = "ohms-law-calculator";
const TITLE = "Ohms Law Calculator";
const DESC =
  "V = IR. Solve for voltage, current, resistance, or power from any two values.";

const FAQS: FaqItem[] = [
  {
    question: "What is Ohms law in plain English?",
    answer:
      "Ohms law says the current through a conductor between two points is proportional to the voltage across those points. The constant of proportionality is the resistance: V equals I times R. Double the voltage at the same resistance, and current doubles.",
  },
  {
    question: "When does Ohms law not apply?",
    answer:
      "It only describes linear (ohmic) conductors at steady temperature. Diodes, LEDs, transistors, and incandescent filaments are non-ohmic because their resistance shifts with voltage or temperature. You still use V, I, and R at a point, but the simple proportionality breaks.",
  },
  {
    question: "What are the units?",
    answer:
      "Voltage is in volts (V), current in amperes (A), resistance in ohms (Ω), and power in watts (W). All four are SI units defined by NIST. One watt equals one volt times one ampere.",
  },
  {
    question: "Does Ohms law work for AC circuits?",
    answer:
      "For purely resistive AC loads, yes, using RMS values of voltage and current. With capacitors or inductors you also need impedance (Z) and phase, so V = IZ replaces V = IR for general AC analysis.",
  },
  {
    question: "How do resistors combine in series and parallel?",
    answer:
      "In series, resistances add: R total equals R1 plus R2 plus R3. In parallel, the reciprocals add: 1 over R total equals 1 over R1 plus 1 over R2. Series circuits share the same current; parallel branches share the same voltage.",
  },
  {
    question: "How do I pick a resistor for an LED?",
    answer:
      "Subtract the LED forward voltage from your supply voltage, then divide by the desired current. For a 5 V supply, a 2 V LED, and 20 mA target, R equals (5 minus 2) divided by 0.02, which is 150 ohms. Round up to the next standard value.",
  },
  {
    question: "What is the power formula?",
    answer:
      "Power dissipated by a resistor equals V times I, which also equals I squared times R, and V squared divided by R. All three forms give the same answer in watts. Use whichever variables you already know.",
  },
  {
    question: "Why does my calculator show scientific notation?",
    answer:
      "Very small or very large results are easier to read in scientific notation. A 1 kΩ resistor at 5 V draws 0.005 A, which prints as 5.00e-3. The underlying math is identical.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — V, I, R, and Power from Any Two Values`,
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
      name: "How to solve a circuit with Ohms law",
      steps: [
        { name: "Pick the unknown", text: "Decide whether you need V, I, R, or P. The other three identities follow once one is known." },
        { name: "Enter two known values", text: "Use SI units: volts, amperes, and ohms. Convert milli- or kilo- prefixes first (1 kΩ = 1000 Ω, 20 mA = 0.020 A)." },
        { name: "Apply the formula", text: "V = I × R for the basic law. Power follows from P = V × I, or equivalently I²R or V²/R." },
        { name: "Check the power rating", text: "Confirm the calculated wattage is below your resistor or component spec — a 0.25 W part will overheat at 0.5 W." },
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

      <Hero title={TITLE} tagline="Solve for voltage, current, resistance, or power from any two known values — with power dissipation in one step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 2 A current flows through a 5 Ω resistor. What is the voltage across it, and how much power does it dissipate?"
        steps={[
          { label: "Formula: V = I × R", value: "" },
          { label: "Plug in I = 2 A, R = 5 Ω: V = 2 × 5", value: "10 V" },
          { label: "Power: P = I² × R = 2² × 5", value: "20 W" },
          { label: "Check: P = V × I = 10 × 2", value: "20 W" },
        ]}
        result="V = 10 V across the resistor and P = 20 W dissipated as heat. A 0.25 W or 1 W resistor would burn out — this calls for a 25 W or larger power resistor with heatsinking."
      />

      <FormulaExplained
        plainEnglish="Ohms law links voltage, current, and resistance with a single multiplication. Power is whatever the circuit turns into heat, light, or motion, and it falls out of the same three quantities."
        formula={
          <span>
            V = I × R
            <br />
            P = V × I = I² × R = V² / R
            <br />
            Series: R<sub>total</sub> = R<sub>1</sub> + R<sub>2</sub> + ...
            <br />
            Parallel: 1 / R<sub>total</sub> = 1 / R<sub>1</sub> + 1 / R<sub>2</sub> + ...
          </span>
        }
        citation={{
          label: "HyperPhysics — Ohms Law (Georgia State University)",
          href: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/ohmlaw.html",
        }}
      />

      <WhenToUse
        scenarios={[
          "Sizing a current-limiting resistor for an LED on a 5 V or 12 V rail.",
          "Estimating the heat a resistor will dissipate before choosing its wattage rating.",
          "Checking whether a wire gauge can carry a circuit's expected current safely.",
          "Working a physics or electronics homework problem and wanting a quick sanity check.",
          "Designing a voltage divider or simple sensor bias network for a microcontroller input.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing units — milliamps with volts and kilo-ohms without converting.", fix: "Convert everything to base SI first: amperes, volts, ohms. 20 mA is 0.020 A; 1 kΩ is 1000 Ω." },
          { mistake: "Applying Ohms law to a diode or LED as if it were a resistor.", fix: "Diodes have a roughly fixed forward voltage. Subtract that drop first, then use V = IR on the series resistor." },
          { mistake: "Ignoring resistor wattage.", fix: "A 0.25 W resistor dissipating 0.5 W will char or open. Always check P against the part's rating with a comfortable margin." },
          { mistake: "Confusing series and parallel sums.", fix: "Series resistances add directly. Parallel resistances combine by reciprocals — two equal resistors in parallel give half the resistance, not double." },
          { mistake: "Using peak AC voltage when you should use RMS.", fix: "Wall outlet AC is quoted as RMS for a reason: V = IR with RMS gives the equivalent DC heating. Peak is roughly 1.414 times RMS." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Voltage (V)", definition: "Electric potential difference between two points, measured in volts." },
          { term: "Current (I)", definition: "Rate of charge flow through a conductor, measured in amperes." },
          { term: "Resistance (R)", definition: "Opposition to current flow, measured in ohms (Ω). Equal to V divided by I for ohmic materials." },
          { term: "Power (P)", definition: "Rate of energy transfer, measured in watts. One watt equals one volt times one ampere." },
          { term: "Impedance (Z)", definition: "Generalized resistance for AC circuits. Combines resistive and reactive components and has both magnitude and phase." },
          { term: "Ohmic vs non-ohmic", definition: "Ohmic conductors hold a constant R across voltage. Non-ohmic parts (diodes, LEDs, filaments) do not, so V = IR is only locally true." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST — The International System of Units (SI), 9th Edition", href: "https://www.nist.gov/pml/owm/metric-si/si-units" },
          { label: "HyperPhysics — Ohms Law (Georgia State University)", href: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/ohmlaw.html" },
          { label: "HyperPhysics — Resistors in Series and Parallel", href: "http://hyperphysics.phy-astr.gsu.edu/hbase/electric/seri.html" },
          { label: "IEEE 100 — The Authoritative Dictionary of IEEE Standards Terms", href: "https://ieeexplore.ieee.org/document/4116787" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["balancing-equations-calculator", "dilution-calculator", "scientific-notation-calculator"]} />
    </Container>
  );
}
