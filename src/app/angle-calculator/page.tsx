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

const SLUG = "angle-calculator";
const TITLE = "Angle Calculator";
const DESC =
  "Solve triangle angles and sides with the law of sines and law of cosines. SSS, SAS, SSA, ASA, and right-triangle modes.";

const FAQS: FaqItem[] = [
  {
    question: "When do I use the law of sines vs the law of cosines?",
    answer:
      "Use the law of sines when you know an angle paired with its opposite side (ASA or SSA cases). Use the law of cosines when you know two sides and the angle between them (SAS) or all three sides (SSS). The law of cosines is the safe choice when no angle-side pair is given.",
  },
  {
    question: "What is the ambiguous case in SSA?",
    answer:
      "The SSA setup (two sides and a non-included angle) can produce zero, one, or two valid triangles. If the given side opposite the known angle is shorter than the height of the other side times the sine of the angle, no triangle exists. If it equals or exceeds the other side, only one triangle fits; otherwise two are possible.",
  },
  {
    question: "Why do the three angles of a triangle add up to 180 degrees?",
    answer:
      "In Euclidean (flat) geometry, drawing a line through one vertex parallel to the opposite side creates alternate interior angles equal to the other two corners. Those three angles form a straight line, which is 180 degrees by definition. The rule fails on curved surfaces like a sphere.",
  },
  {
    question: "Should I enter angles in degrees or radians?",
    answer:
      "This calculator accepts degrees because they are the unit most students and tradespeople use day to day. Multiply degrees by pi divided by 180 to convert to radians if a math class or science context calls for it. One radian is roughly 57.296 degrees.",
  },
  {
    question: "Is there a faster way to solve a right triangle?",
    answer:
      "Yes. If one angle is exactly 90 degrees, you can skip the law of cosines and use plain SOHCAHTOA, plus the Pythagorean theorem for the missing side. The right-triangle mode here applies those shortcuts so you do not need to enter the 90 degree angle.",
  },
  {
    question: "Where are these formulas used in real life?",
    answer:
      "Surveyors triangulate land boundaries with the law of sines. Carpenters cut rafters and stair stringers using right-triangle trig. Navigators, machinists, and game developers all rely on these same triangle identities.",
  },
  {
    question: "What if my inputs do not form a valid triangle?",
    answer:
      "The calculator returns a dash and a short note when the numbers are impossible, such as side lengths that violate the triangle inequality or angles that already sum past 180 degrees. Double-check your measurements and try again.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Law of Sines and Cosines Solver`,
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
      name: "How to solve a triangle with the law of sines or cosines",
      steps: [
        { name: "Pick your mode", text: "Choose SSS, SAS, SSA, ASA, or right triangle based on which sides and angles you already know." },
        { name: "Enter the knowns", text: "Type the side lengths and angles you have. Angles go in degrees; sides share whatever unit you choose." },
        { name: "Apply the right law", text: "Law of cosines for SSS and SAS; law of sines for ASA and SSA; SOHCAHTOA shortcuts for the right-triangle case." },
        { name: "Check the angle sum", text: "All three angles should add to 180 degrees. If not, recheck the inputs for a triangle-inequality violation." },
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

      <Hero title={TITLE} tagline="Solve any triangle from the sides and angles you already know — without juggling formulas by hand.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A surveyor measures two sides of a triangular plot at a = 5 m and b = 7 m, with the included angle C = 60°. What is the third side?"
        steps={[
          { label: "Formula (law of cosines): c² = a² + b² − 2ab·cos C", value: "" },
          { label: "Plug in: 5² + 7² − 2·5·7·cos 60°", value: "25 + 49 − 70·0.5" },
          { label: "Simplify", value: "25 + 49 − 35 = 39" },
          { label: "Take the square root", value: "√39 ≈ 6.24" },
          { label: "Find A with law of sines: sin A = a·sin C / c", value: "sin A = 5·sin 60° / 6.24 ≈ 0.6939" },
          { label: "Angle A", value: "A ≈ 43.9°" },
          { label: "Angle B = 180 − 60 − 43.9", value: "B ≈ 76.1°" },
        ]}
        result="Third side c ≈ 6.24 m; angles A ≈ 43.9°, B ≈ 76.1°, C = 60°. The three angles sum to 180° — the answer checks out."
      />

      <FormulaExplained
        plainEnglish="Every triangle obeys two identities that link its sides to its angles. The law of sines says each side is proportional to the sine of the opposite angle. The law of cosines extends the Pythagorean theorem to triangles that are not right-angled."
        formula={
          <span>
            Law of sines: a / sin A = b / sin B = c / sin C
            <br />
            Law of cosines: c² = a² + b² − 2ab · cos C
            <br />
            Angle sum: A + B + C = 180°
          </span>
        }
        citation={{
          label: "NIST Digital Library of Mathematical Functions — Chapter 4: Elementary Functions",
          href: "https://dlmf.nist.gov/4",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're studying trigonometry and want to check a textbook problem step by step.",
          "You're surveying or laying out a plot of land where only some distances and bearings are known.",
          "You're cutting rafters, stair stringers, or mitered joints in carpentry.",
          "You're navigating with bearings and need to find an unknown leg of a triangular route.",
          "You're a teacher demonstrating SSS, SAS, SSA, and ASA cases for a class.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Mixing degrees and radians in the same calculation.", fix: "Pick one unit and stick with it. This calculator uses degrees throughout — convert only when a downstream tool expects radians." },
          { mistake: "Forgetting the SSA ambiguous case can have two solutions.", fix: "When two sides and a non-included angle are given, check whether a second valid triangle also fits before committing to one answer." },
          { mistake: "Violating the triangle inequality.", fix: "The longest side must be shorter than the sum of the other two. If your sides fail this test, no triangle exists and the math will return invalid results." },
          { mistake: "Confusing the included angle with an opposite angle.", fix: "The law of cosines needs the angle between the two known sides. The law of sines pairs each side with the angle facing it." },
          { mistake: "Rounding too early.", fix: "Keep at least four significant figures through intermediate steps. Round only the final answer to avoid drift." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "SSS / SAS / SSA / ASA", definition: "Shorthand for which sides (S) and angles (A) are known. The order matters: SAS means side–angle–side with the angle between the sides." },
          { term: "Included angle", definition: "The angle formed between two specific sides of a triangle." },
          { term: "Triangle inequality", definition: "The sum of any two sides of a triangle must exceed the third side." },
          { term: "Oblique triangle", definition: "Any triangle without a 90° angle. Solved with the laws of sines and cosines." },
          { term: "SOHCAHTOA", definition: "Mnemonic for right-triangle ratios: sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "OpenStax — Algebra and Trigonometry: Non-right Triangles (Law of Sines & Cosines)", href: "https://openstax.org/books/algebra-and-trigonometry-2e/pages/10-1-non-right-triangles-law-of-sines" },
          { label: "Khan Academy — Trigonometry: Solving general triangles", href: "https://www.khanacademy.org/math/trigonometry/trig-with-general-triangles" },
          { label: "NIST Digital Library of Mathematical Functions — Chapter 4 (Elementary Functions)", href: "https://dlmf.nist.gov/4" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["trigonometry-calculator", "pythagorean-theorem-calculator", "arc-length-calculator"]} />
    </Container>
  );
}
