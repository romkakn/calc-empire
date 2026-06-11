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

const SLUG = "percent-error-calculator";
const TITLE = "Percent Error Calculator";
const DESC =
  "Calculate percent error from an experimental value and the theoretical (accepted) value. Standard physics formula with absolute value.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between percent error and percent difference?",
    answer:
      "Percent error compares a measured value to a known accepted (theoretical) value. Percent difference compares two measured values when neither is the accepted truth — it divides by the average of the two, not by a reference.",
  },
  {
    question: "Why does the formula use absolute value?",
    answer:
      "Absolute value keeps the result non-negative so you report the size of the error, not its direction. If you need to know whether your measurement ran high or low, drop the bars and let the sign speak.",
  },
  {
    question: "What is the difference between accuracy and precision?",
    answer:
      "Accuracy is how close a measurement is to the true value — percent error captures this. Precision is how close repeated measurements are to each other, even if they are all wrong by the same amount.",
  },
  {
    question: "What counts as an acceptable percent error in a physics lab?",
    answer:
      "Introductory physics labs typically aim for under 5% for well-controlled experiments, with up to 10% tolerated for harder setups. Anything above 10% usually points to a systematic problem worth investigating.",
  },
  {
    question: "How does measurement uncertainty propagate into percent error?",
    answer:
      "Every instrument has a tolerance that becomes part of the experimental value. When you combine measurements through multiplication or division, relative uncertainties add in quadrature; for addition or subtraction, absolute uncertainties add in quadrature. NIST publishes the standard guide on this.",
  },
  {
    question: "When should I keep the sign instead of using absolute value?",
    answer:
      "When direction matters — for example, calibrating an instrument that consistently reads low, or comparing experimental yields against a theoretical maximum. Drop the absolute-value bars and report the signed value so a negative result means your measurement was below the accepted value.",
  },
  {
    question: "What if the theoretical value is zero?",
    answer:
      "Percent error is undefined when the accepted value is zero because you cannot divide by zero. In that case use absolute error (just the difference) or a different metric such as root-mean-square error.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Experimental vs Theoretical`,
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
      name: "How to calculate percent error",
      steps: [
        { name: "Identify the theoretical value", text: "Find the accepted or true value from a reference table, textbook, or theory." },
        { name: "Record the experimental value", text: "Use your measured result from the experiment or observation." },
        { name: "Apply the formula", text: "%error = |experimental − theoretical| / |theoretical| × 100." },
        { name: "Interpret the result", text: "Compare to the lab's tolerance — under 5% is strong, 5–10% is typical, above 10% suggests a systematic issue." },
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

      <Hero title={TITLE} tagline="Measure how far an experimental result drifted from the accepted value, in plain percent.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student measures the boiling point of a liquid at 9.5 units. The accepted theoretical value is 10 units. What is the percent error?"
        steps={[
          { label: "Formula: %error = |experimental − theoretical| / |theoretical| × 100", value: "" },
          { label: "Difference: 9.5 − 10", value: "−0.5" },
          { label: "Absolute value of the difference", value: "0.5" },
          { label: "Divide by |10|", value: "0.05" },
          { label: "Multiply by 100", value: "5%" },
        ]}
        result="The percent error is 5%. That sits within a typical introductory-lab tolerance, so the measurement is reasonable."
      />

      <FormulaExplained
        plainEnglish="Percent error answers one question: how far off was the measurement, expressed as a share of the accepted value? Wrap the difference in absolute-value bars so the answer is never negative."
        formula={
          <span>
            %error = |experimental − theoretical| / |theoretical| × 100
            <br />
            Signed form (direction matters): %error = (experimental − theoretical) / |theoretical| × 100
          </span>
        }
        citation={{
          label: "NIST — Guidelines for Evaluating and Expressing Uncertainty of Measurement (TN 1297)",
          href: "https://www.nist.gov/pml/nist-technical-note-1297",
        }}
      />

      <WhenToUse
        scenarios={[
          "You finished a physics or chemistry lab and need to grade your result against the textbook value.",
          "You are calibrating an instrument and want to quantify how far each reading drifts from a known standard.",
          "You are reviewing a student's lab report and need a quick sanity check on their error analysis.",
          "You are comparing a model prediction to the empirical answer in a homework problem.",
          "You are writing up a science-fair project and need the standard accuracy metric for the conclusion.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Dividing by the experimental value instead of the theoretical value.", fix: "The denominator is always the accepted (theoretical) value — that is the reference you are measuring against." },
          { mistake: "Forgetting the absolute value and reporting a negative percent.", fix: "Standard percent error is non-negative. Use the signed form only when direction matters, and label it clearly." },
          { mistake: "Confusing percent error with percent difference.", fix: "Percent difference is for comparing two measured values with no accepted truth — it divides by the average of the two." },
          { mistake: "Multiplying by 100 twice or forgetting it once.", fix: "The factor of 100 turns the ratio into a percent. Skip it and you are reporting a fraction; double it and you are at 10,000%." },
          { mistake: "Trying to compute percent error when the theoretical value is zero.", fix: "Division by zero is undefined. Report absolute error or another metric instead." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Absolute error", definition: "The raw difference between experimental and theoretical values, with no scaling." },
          { term: "Relative error", definition: "Absolute error divided by the theoretical value. Multiply by 100 and you have percent error." },
          { term: "Percent difference", definition: "Used when neither value is accepted truth. Divides by the average of the two values." },
          { term: "Accuracy", definition: "How close a measurement is to the true value. Percent error quantifies this." },
          { term: "Precision", definition: "How close repeated measurements are to each other. Independent of accuracy." },
          { term: "Systematic error", definition: "A consistent bias that pushes every reading the same direction. Often the cause of high percent error." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST — Guidelines for Evaluating and Expressing Uncertainty of Measurement (TN 1297)", href: "https://www.nist.gov/pml/nist-technical-note-1297" },
          { label: "OpenStax College Physics — Accuracy, Precision, and Significant Figures", href: "https://openstax.org/books/college-physics-2e/pages/1-3-accuracy-precision-and-significant-figures" },
          { label: "Khan Academy — Precision and Accuracy in Chemistry", href: "https://www.khanacademy.org/science/chemistry/chem-kinetics/types-of-reactions/a/precision-and-accuracy" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["percent-decrease-calculator", "rounding-calculator", "scientific-notation-calculator"]} />
    </Container>
  );
}
