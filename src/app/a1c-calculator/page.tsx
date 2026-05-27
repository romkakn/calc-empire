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

const SLUG = "a1c-calculator";
const TITLE = "A1C Calculator";
const DESC =
  "Convert A1C to estimated average glucose (eAG) — or eAG back to A1C. ADA-endorsed formula, both mg/dL and mmol/L.";

const FAQS: FaqItem[] = [
  {
    question: "What does an A1C of 7% mean?",
    answer:
      "An A1C of 7% corresponds to an average glucose of about 154 mg/dL (8.6 mmol/L) over the past 2–3 months. The ADA suggests < 7% as a typical goal for many adults with diabetes — your doctor may set a different target.",
  },
  {
    question: "What is eAG?",
    answer:
      "eAG stands for estimated Average Glucose. It translates your A1C into the same units (mg/dL or mmol/L) you see on a meter or CGM, making the number easier to relate to daily readings.",
  },
  {
    question: "How accurate is the A1C-to-eAG conversion?",
    answer:
      "The Nathan formula has a 95% confidence interval of roughly ±15–25 mg/dL around the estimate. Individual variation in red-blood-cell lifespan and glycation can shift the relationship.",
  },
  {
    question: "What A1C is considered prediabetes?",
    answer:
      "5.7%–6.4% is the ADA prediabetes band. Below 5.7% is normal; 6.5% or higher (confirmed) is the diabetes threshold.",
  },
  {
    question: "Can A1C be falsely high or low?",
    answer:
      "Yes. Conditions affecting red-blood-cell turnover (anemia, hemolysis, recent transfusion, hemoglobinopathies) can skew A1C. In those cases, fasting glucose or a continuous glucose monitor is more reliable.",
  },
  {
    question: "How often should I check my A1C?",
    answer:
      "ADA recommends every 6 months if you're meeting goals on stable therapy, and every 3 months if therapy changed or you're not at goal.",
  },
  {
    question: "What's the difference between A1C and HbA1c?",
    answer:
      "Nothing — they're the same test. HbA1c (glycated hemoglobin A1c) is the technical name; A1C is the common short form.",
  },
  {
    question: "Does this calculator give a diagnosis?",
    answer:
      "No. It converts between A1C and eAG. Diabetes diagnosis requires confirmed testing in a clinical setting. Talk to your doctor.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — A1C ↔ eAG Conversion`,
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
      name: "How to convert A1C to estimated average glucose",
      steps: [
        { name: "Pick your unit", text: "Most US labs report glucose in mg/dL; most of the world uses mmol/L." },
        { name: "Enter your A1C", text: "Use the percentage from your most recent lab report." },
        { name: "Apply the Nathan formula", text: "eAG (mg/dL) = 28.7 × A1C − 46.7. For mmol/L use 1.59 × A1C − 2.59." },
        { name: "Compare to ADA bands", text: "< 5.7% normal · 5.7–6.4% prediabetes · ≥ 6.5% diabetes range." },
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

      <Hero title={TITLE} tagline="Convert A1C to an average glucose number that matches your meter — or back again, in either unit.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A patient's most recent lab shows an A1C of 7.0%. What's the estimated average glucose?"
        steps={[
          { label: "Formula (mg/dL): eAG = 28.7 × A1C − 46.7", value: "" },
          { label: "Plug in 7.0: 28.7 × 7.0", value: "200.9" },
          { label: "Subtract 46.7", value: "154.2" },
          { label: "Rounded", value: "154 mg/dL" },
          { label: "Same A1C in mmol/L: 1.59 × 7 − 2.59", value: "8.6 mmol/L" },
        ]}
        result="A1C 7.0% ≈ 154 mg/dL (8.6 mmol/L) average glucose. ADA puts this above the prediabetes band — diabetes range."
      />

      <FormulaExplained
        plainEnglish="A1C reports the fraction of hemoglobin coated in sugar — a 2–3 month average. The Nathan equation (2008) converts that percentage into the average glucose number you see on meters and CGMs."
        formula={
          <span>
            eAG (mg/dL) = 28.7 × A1C − 46.7
            <br />
            eAG (mmol/L) = 1.59 × A1C − 2.59
            <br />
            Reverse: A1C ≈ (eAG<sub>mg/dL</sub> + 46.7) / 28.7
          </span>
        }
        citation={{
          label: "Nathan DM, et al. — Translating the A1C Assay Into Estimated Average Glucose Values (Diabetes Care 2008)",
          href: "https://care.diabetesjournals.org/content/31/8/1473",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just got A1C results back and want to understand them in the units you see daily.",
          "You're tracking trends over months and need a way to compare a CGM average to a lab A1C.",
          "You're educating a newly diagnosed family member on what their numbers mean.",
          "You're a clinician or coach explaining lab results to a patient.",
          "You're a student studying endocrinology and want a quick sanity check.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating eAG as your fasting glucose target.", fix: "eAG is an average across the day, sleep included. Fasting goals (e.g., 80–130 mg/dL per ADA) are different." },
          { mistake: "Comparing meter averages over 2 weeks to your A1C.", fix: "A1C reflects 2–3 months. Two-week averages can diverge meaningfully, especially after a regimen change." },
          { mistake: "Ignoring conditions that skew A1C.", fix: "Anemia, hemoglobinopathies, recent blood loss, or pregnancy can falsely raise or lower A1C. Confirm with your doctor." },
          { mistake: "Using a single high reading to redefine 'control'.", fix: "One spike doesn't make a trend. Look at multi-day averages or CGM time-in-range before adjusting therapy." },
          { mistake: "Skipping the doctor.", fix: "This calculator converts numbers — it doesn't diagnose, treat, or replace medical advice." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "HbA1c", definition: "Technical name for A1C — glycated hemoglobin. Same test." },
          { term: "eAG", definition: "Estimated Average Glucose. Same units as a glucose meter." },
          { term: "Glycation", definition: "Sugar attaching non-enzymatically to hemoglobin. The basis of the A1C measurement." },
          { term: "Time in range (TIR)", definition: "Percentage of CGM readings within a target glucose band, typically 70–180 mg/dL." },
          { term: "Fasting plasma glucose (FPG)", definition: "Blood glucose after ≥ 8 hours fasting. Another tool for diabetes screening." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Nathan DM et al. — Translating A1C into Estimated Average Glucose (Diabetes Care, 2008)", href: "https://care.diabetesjournals.org/content/31/8/1473" },
          { label: "American Diabetes Association — Standards of Care", href: "https://diabetesjournals.org/care/issue/47/Supplement_1" },
          { label: "NIH National Library of Medicine — A1C and eAG", href: "https://medlineplus.gov/lab-tests/hemoglobin-a1c-hba1c-test/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-05-27" />

      <RelatedCalculators slugs={["chronological-age-calculator", "crcl-calculator", "paycheck-calculator"]} />
    </Container>
  );
}
