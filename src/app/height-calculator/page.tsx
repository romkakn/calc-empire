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

const SLUG = "height-calculator";
const TITLE = "Height Calculator";
const DESC =
  "Predict a child's adult height with the mid-parental-height method. Inch and centimeter units, 95% confidence range, plain-English explanation.";

const FAQS: FaqItem[] = [
  {
    question: "How accurate is a mid-parental-height prediction?",
    answer:
      "The mid-parental method lands within about 4 inches (10 cm) of the child's final adult height 95% of the time. That is a wide band — a predicted 70 inches can land anywhere from 66 to 74. For a tighter estimate, a pediatric endocrinologist can read a bone-age x-ray.",
  },
  {
    question: "How do nutrition and growth plates affect final height?",
    answer:
      "Growth plates at the ends of long bones are the factories that add length, and they close near the end of puberty. Steady protein, calories, sleep, and iron during the growth years let those plates do their full job. Long stretches of undernutrition or chronic illness can shrink final height by an inch or more.",
  },
  {
    question: "What does a bone-age x-ray actually tell you?",
    answer:
      "A doctor compares an x-ray of the left hand and wrist against a standard atlas to estimate skeletal maturity. If bone age lags behind real age, more growing time is likely left — and the predicted adult height goes up. The Tanner-Whitehouse method uses this idea and is more accurate than parental height alone.",
  },
  {
    question: "Why is genetics only about 80% of the answer?",
    answer:
      "Twin studies put the heritability of adult height at roughly 0.8, meaning about 80% of person-to-person variation in a well-fed population traces to genes. The remaining 20% is environment: nutrition, sleep, illness, hormones, and stress during the growth years. Most kids fall close to the parental mid-point, but the 20% gap is why siblings can differ by several inches.",
  },
  {
    question: "Does exercise make a child taller?",
    answer:
      "Exercise does not stretch the long bones beyond what genes plan, and no specific sport adds inches. What activity does is support bone density, posture, sleep quality, and appetite — all helpful for hitting your genetic potential. Hanging from a bar, basketball, and swimming will not make a kid taller than their growth plates allow.",
  },
  {
    question: "What is a late bloomer?",
    answer:
      "A late bloomer enters puberty a year or two after peers and keeps growing longer. Their bone age is often behind their real age, so the mid-parental method may underestimate their final height. A doctor can confirm with a hand x-ray if the family wants a clearer picture.",
  },
  {
    question: "When should we see a pediatric endocrinologist?",
    answer:
      "Talk to your pediatrician if a child is below the 3rd or above the 97th percentile on the CDC growth chart, if growth speed drops to under 2 inches (5 cm) per year between ages 4 and puberty, or if a child crosses two major percentile lines downward. The pediatrician can refer to an endocrinologist for hormone, thyroid, and bone-age testing.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Predict Adult Height from Parents`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "health", description: DESC }),
    howToSchema({
      name: "How to predict a child's adult height",
      steps: [
        { name: "Pick the child's sex", text: "Boy and girl formulas differ by a 5 in (13 cm) adjustment." },
        { name: "Enter both parents' heights", text: "Use today's heights — same unit for both parents." },
        { name: "Apply the mid-parental formula", text: "Boy: (dad + mom + 5 in) / 2. Girl: (dad + mom − 5 in) / 2. Metric uses 13 cm instead of 5 in." },
        { name: "Read the 95% range", text: "Final adult height usually lands within ±4 in (±10 cm) of the prediction." },
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

      <Hero title={TITLE} tagline="Predict a child's adult height from the parents' heights — with the 95% range that pediatricians actually quote.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario={`A boy whose father is 70 in (5'10") and mother is 65 in (5'5"). What's the predicted adult height?`}
        steps={[
          { label: "Formula (boy, inches): (dad + mom + 5) / 2", value: "" },
          { label: "Add the parents' heights: 70 + 65", value: "135" },
          { label: "Add 5 in for the boy adjustment", value: "140" },
          { label: "Divide by 2", value: "70.0 in" },
          { label: "95% range: ±4 in", value: "66 in to 74 in" },
        ]}
        result={`Predicted adult height ≈ 70.0 in (5'10"), with a likely range of 66 in to 74 in (5'6" to 6'2").`}
      />

      <FormulaExplained
        plainEnglish="The mid-parental-height method takes the average of the two parents' heights, then nudges it up for a boy or down for a girl by the typical adult sex difference. It gives the single best guess and a wide 95% range that catches almost every child."
        formula={
          <span>
            Boy: adult height ≈ (dad + mom + 5 in) / 2
            <br />
            Girl: adult height ≈ (dad + mom − 5 in) / 2
            <br />
            95% range: ±4 in (±10 cm). Metric: swap 5 in for 13 cm.
          </span>
        }
        citation={{
          label: "Tanner JM, Goldstein H, Whitehouse RH — Standards for children's height at ages 2–9 (Arch Dis Child 1970)",
          href: "https://pubmed.ncbi.nlm.nih.gov/5491878/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're a parent curious whether a child is on track for their genetic potential.",
          "You're a pediatrician giving a family a quick estimate during a well-child visit.",
          "You're a coach in a height-sensitive sport planning long-term development.",
          "You're a student or teacher exploring how heritability works in real numbers.",
          "You're sanity-checking a more detailed bone-age prediction from a specialist.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating the single number as a guarantee.", fix: "The ±4 in (±10 cm) range is part of the answer. Two siblings with the same parents can land 8 inches apart and both be 'normal'." },
          { mistake: "Mixing inches and centimeters between parents.", fix: "Convert both heights to the same unit first. 1 in = 2.54 cm." },
          { mistake: "Using a parent's old peak height.", fix: "Use the parent's current adult height. Adults can lose up to 1–2 in by age 70 — for the formula, use the height around age 25–40 if known." },
          { mistake: "Ignoring growth-chart percentile trends.", fix: "A child dropping across two major CDC percentile lines deserves a doctor's review, even if the mid-parental number still looks tall." },
          { mistake: "Skipping the doctor for an outlier.", fix: "Heights below the 3rd or above the 97th percentile warrant a pediatric workup. This calculator estimates — it does not diagnose." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Mid-parental height", definition: "The averaged-and-adjusted prediction of a child's adult height from the two biological parents' heights." },
          { term: "Bone age", definition: "Skeletal maturity read from a hand-and-wrist x-ray, used to refine height prediction." },
          { term: "Growth plate (epiphysis)", definition: "Cartilage zone at the end of long bones where new bone is added — closes near the end of puberty." },
          { term: "Heritability", definition: "Fraction of trait variation in a population that traces to genes. Adult height heritability is ~0.8." },
          { term: "CDC growth chart", definition: "Reference percentile curves for height and weight by age and sex, used in US clinical practice." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "CDC Growth Charts — Clinical Reference (2–20 years)", href: "https://www.cdc.gov/growthcharts/clinical_charts.htm" },
          { label: "Tanner JM, Goldstein H, Whitehouse RH — Standards for children's height (Arch Dis Child, 1970)", href: "https://pubmed.ncbi.nlm.nih.gov/5491878/" },
          { label: "AAP — Evaluation of Short and Tall Stature in Children (Pediatrics in Review)", href: "https://publications.aap.org/pediatricsinreview/article/37/10/433/35026/Evaluation-of-Short-and-Tall-Stature-in-Children" },
          { label: "NIH MedlinePlus — Growth chart, child and adolescent", href: "https://medlineplus.gov/ency/article/002080.htm" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (pediatrician or pediatric endocrinologist) for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["chronological-age-calculator", "a1c-calculator", "protein-intake-calculator"]} />
    </Container>
  );
}
