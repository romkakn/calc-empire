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

const SLUG = "trigonometry-calculator";
const TITLE = "Trigonometry Calculator";
const DESC =
  "sin, cos, tan, and inverses. Degrees or radians, plus a right-triangle solver that gives you the missing side or angle.";

const FAQS: FaqItem[] = [
  {
    question: "What is SOH CAH TOA?",
    answer:
      "It's a memory trick for the three basic trig ratios in a right triangle. SOH = sin is Opposite over Hypotenuse, CAH = cos is Adjacent over Hypotenuse, TOA = tan is Opposite over Adjacent. Pick the side names relative to the angle you care about.",
  },
  {
    question: "What's the difference between degrees and radians?",
    answer:
      "Degrees split a full turn into 360 parts. Radians measure the same angle as a length of arc on a unit circle, so a full turn is 2π radians (about 6.283). To convert, multiply degrees by π/180 to get radians.",
  },
  {
    question: "What is the unit circle?",
    answer:
      "A circle of radius 1 centered at the origin. For any angle, the point where the circle meets that angle has x = cos(angle) and y = sin(angle). It's the cleanest way to see why sin and cos repeat every 360 degrees.",
  },
  {
    question: "What is inverse trig (arcsin, arccos, arctan)?",
    answer:
      "Inverse trig undoes a trig function: you give it a ratio and it gives back an angle. arcsin returns angles from -90 to 90 degrees, arccos from 0 to 180, and arctan from -90 to 90. Pick which inverse you need based on the sides you measured.",
  },
  {
    question: "What are csc, sec, and cot?",
    answer:
      "Reciprocal trig functions. csc(x) = 1/sin(x), sec(x) = 1/cos(x), and cot(x) = 1/tan(x). They show up in calculus identities and some physics formulas, but most everyday geometry problems only need sin, cos, and tan.",
  },
  {
    question: "What is the Pythagorean identity?",
    answer:
      "sin squared plus cos squared equals 1, for any angle. It comes straight from the unit circle and the Pythagorean theorem. Two related forms are 1 + tan squared = sec squared, and 1 + cot squared = csc squared.",
  },
  {
    question: "Where is trigonometry used in real life?",
    answer:
      "Surveyors use it to measure land distances and heights with theodolites. Navigation, GPS, and aviation use it to compute headings and positions. Engineers use it for force vectors, signal waves, and structural angles.",
  },
  {
    question: "Why do I get a different answer when I switch degrees and radians?",
    answer:
      "Most calculators and programming languages assume radians by default. Plugging 30 (meaning 30 degrees) into a function expecting radians gives sin(30 rad), which is about -0.988, not 0.5. Always check the angle-unit toggle before reading the result.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — sin, cos, tan + Right Triangle Solver`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Math", path: "/math" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "math", description: DESC }),
    howToSchema({
      name: "How to evaluate a trig function or solve a right triangle",
      steps: [
        { name: "Pick a mode", text: "Use 'Function eval' for sin/cos/tan of an angle, or 'Right triangle solver' when you know two sides and want the third and the angles." },
        { name: "Set the angle unit", text: "Choose degrees or radians. Degrees use 360 per turn; radians use 2π per turn. Mixing them is the most common trig mistake." },
        { name: "Enter the angle or the two sides", text: "Function eval needs one angle. The solver needs any two sides of the right triangle (legs a, b, or hypotenuse c)." },
        { name: "Read the result", text: "Function eval gives the ratio plus its reciprocal. The solver gives the missing side and both non-right angles." },
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

      <Hero title={TITLE} tagline="Evaluate sin, cos, tan, and their inverses in degrees or radians — or hand it two sides of a right triangle and get every missing piece.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Find sin(30°), then solve a right triangle with legs a = 3 and b = 4."
        steps={[
          { label: "Function eval: sin(30°)", value: "0.5" },
          { label: "Right triangle: a = 3, b = 4", value: "" },
          { label: "Pythagoras: c² = 3² + 4² = 9 + 16", value: "25" },
          { label: "Hypotenuse c = √25", value: "5" },
          { label: "Angle opposite a: arctan(3/4)", value: "≈ 36.87°" },
          { label: "Angle opposite b: 90° − 36.87°", value: "≈ 53.13°" },
        ]}
        result="sin(30°) = 0.5. The 3-4-5 triangle has hypotenuse 5, and its non-right angles are about 36.87° and 53.13°."
      />

      <FormulaExplained
        plainEnglish="Trig ties an angle in a right triangle to the ratio of two of its sides. Pick the angle you care about, then name the sides relative to it: opposite, adjacent, hypotenuse. The three core ratios (sin, cos, tan) and their inverses cover almost every right-triangle problem."
        formula={
          <span>
            sin(θ) = opposite / hypotenuse
            <br />
            cos(θ) = adjacent / hypotenuse
            <br />
            tan(θ) = opposite / adjacent
            <br />
            Inverses give the angle from a ratio: θ = arcsin(opp/hyp), etc.
            <br />
            Pythagoras: a² + b² = c²
          </span>
        }
        citation={{
          label: "NIST Digital Library of Mathematical Functions — Chapter 4: Elementary Functions",
          href: "https://dlmf.nist.gov/4",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're checking homework on sin, cos, tan, or one of the inverses.",
          "You measured two sides of a right triangle and need the third side or an angle.",
          "You're prepping for a test and want a quick degree/radian sanity check.",
          "You're a hobbyist (woodworking, 3D printing) and need a rise/run or a roof-pitch angle.",
          "You're translating a physics or engineering formula that mixes degrees and radians.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Calculator stuck in radians when you meant degrees.", fix: "Check the angle-unit toggle first. sin(30°) = 0.5, but sin(30 rad) ≈ −0.988." },
          { mistake: "Mislabeling opposite and adjacent.", fix: "Opposite is across from the angle you picked. Adjacent is the leg that touches it (not the hypotenuse)." },
          { mistake: "Using tan instead of arctan.", fix: "If you have a ratio and want the angle, use the inverse (arctan, arcsin, arccos). tan goes angle → ratio." },
          { mistake: "Treating arcsin/arccos as one-to-one over all angles.", fix: "arcsin returns −90° to 90°; arccos returns 0° to 180°. For angles outside that range, add or subtract a full turn or use symmetry." },
          { mistake: "Forgetting the Pythagorean identity sign.", fix: "sin²(θ) + cos²(θ) = 1 always. If you solve for cos and take a square root, decide the sign from the quadrant of θ." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Hypotenuse", definition: "The longest side of a right triangle — the one across from the 90° angle." },
          { term: "Opposite / adjacent", definition: "Named relative to a chosen non-right angle. Opposite faces it; adjacent touches it (and is not the hypotenuse)." },
          { term: "Radian", definition: "Angle measure based on arc length on a unit circle. 2π radians = 360°." },
          { term: "Unit circle", definition: "Radius-1 circle centered at the origin. Used to define sin and cos for any angle." },
          { term: "Inverse trig", definition: "arcsin, arccos, arctan — they take a ratio and return an angle." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST Digital Library of Mathematical Functions — Chapter 4: Elementary Functions", href: "https://dlmf.nist.gov/4" },
          { label: "OpenStax — Algebra and Trigonometry 2e", href: "https://openstax.org/details/books/algebra-and-trigonometry-2e" },
          { label: "Khan Academy — Trigonometry", href: "https://www.khanacademy.org/math/trigonometry" },
          { label: "OpenStax — Precalculus 2e (Trigonometric Functions)", href: "https://openstax.org/details/books/precalculus-2e" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["pythagorean-theorem-calculator", "arc-length-calculator", "angle-calculator"]} />
    </Container>
  );
}
