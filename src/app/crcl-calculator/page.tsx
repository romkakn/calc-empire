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
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  jsonLd,
  personSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";

const SLUG = "crcl-calculator";
const TITLE = "Creatinine Clearance Calculator";
const DESC =
  "Estimate kidney function with our Creatinine Clearance Calculator. Uses the Cockcroft-Gault formula for accurate CrCl results in mL/min. Plain-English math.";

const FAQS: FaqItem[] = [
  {
    question: "What is Creatinine Clearance (CrCl)?",
    answer:
      "Creatinine clearance is a measure of how well your kidneys are filtering waste products from your blood. It estimates the glomerular filtration rate (GFR), which is the volume of fluid filtered from the blood into the Bowman's capsule per unit time.",
  },
  {
    question: "What is the Cockcroft-Gault formula?",
    answer:
      "The Cockcroft-Gault formula is a mathematical equation used to estimate creatinine clearance based on a patient's age, weight, serum creatinine level, and sex. It was developed in 1976 and is widely used for drug dosing adjustments.",
  },
  {
    question: "Why is CrCl important for drug dosing?",
    answer:
      "Many medications are primarily cleared by the kidneys. If kidney function is impaired, these drugs can accumulate in the body, leading to toxicity. CrCl helps clinicians adjust drug dosages to prevent adverse effects.",
  },
  {
    question: "What is the difference between CrCl and eGFR?",
    answer:
      "Creatinine clearance (CrCl) and estimated glomerular filtration rate (eGFR) both assess kidney function. CrCl, often calculated by Cockcroft-Gault, estimates the volume of blood cleared of creatinine per minute. eGFR, often calculated by MDRD or CKD-EPI equations, estimates the rate at which blood is filtered by the glomeruli. While related, they are not identical, and the choice depends on clinical context and drug-specific guidelines.",
  },
  {
    question: "Can this calculator be used for patients with unstable renal function?",
    answer:
      "No, the Cockcroft-Gault formula, like most creatinine-based estimation equations, assumes stable renal function. It should not be used in situations of rapidly changing kidney function, such as acute kidney injury (AKI).",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cockcroft-Gault Equation`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `/${SLUG}`,
    type: "article",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({
      name: TITLE,
      slug: SLUG,
      category: "health",
      description: DESC,
    }),
    howToSchema({
      name: "How to estimate Creatinine Clearance",
      steps: [
        {
          name: "Enter Age, Weight, and Serum Creatinine",
          text: "Input the patient's age in years, weight in kilograms, and serum creatinine level in mg/dL.",
        },
        {
          name: "Select Gender",
          text: "Choose whether the patient is male or female, as the formula includes a gender-specific adjustment factor.",
        },
        {
          name: "View Result",
          text: "The calculator will display the estimated Creatinine Clearance in mL/min.",
        },
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <Hero
        title="Creatinine Clearance Calculator"
        tagline="Estimate kidney function using the Cockcroft-Gault equation for drug dosing and clinical assessment."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 65-year-old male patient weighs 80 kg and has a serum creatinine of 1.2 mg/dL."
        steps={[
          { label: "Age", value: "65 years" },
          { label: "Weight", value: "80 kg" },
          { label: "Serum Creatinine", value: "1.2 mg/dL" },
          { label: "Gender", value: "Male" },
          { label: "Formula (Male)", value: "((140 - Age) × Weight_kg) / (72 × Serum_Creatinine_mg_dL)" },
          { label: "Calculation", value: "((140 - 65) × 80) / (72 × 1.2)" },
          { label: "Result", value: "(75 × 80) / 86.4 = 6000 / 86.4 = 69.44 mL/min" },
        ]}
        result="The estimated Creatinine Clearance for this patient is 69.44 mL/min."
      />

      <FormulaExplained
        plainEnglish="The Cockcroft-Gault equation estimates creatinine clearance, a proxy for kidney function. It considers age, as muscle mass (and thus creatinine production) decreases with age; weight, as creatinine is produced by muscle; and serum creatinine, the concentration of creatinine in the blood. For females, a factor of 0.85 is applied because women generally have less muscle mass than men."
        formula={
          <span>
            CrCl (male) = ((140 - Age) × Weight_kg) / (72 × Serum_Creatinine_mg_dL)
            <br />
            CrCl (female) = CrCl (male) × 0.85
          </span>
        }
        citation={{
          label: "Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.",
          href: "https://pubmed.ncbi.nlm.nih.gov/1244564/",
        }}
      />

      <WhenToUse
        scenarios={[
          "Adjusting dosages for renally excreted medications (e.g., antibiotics, anticoagulants).",
          "Assessing kidney function in older adults or those with significant muscle mass variations.",
          "Monitoring kidney function in patients with chronic kidney disease (CKD) when eGFR equations are not preferred.",
          "Evaluating potential kidney toxicity of certain drugs.",
        ]}
      />

      <CommonMistakes
        items={[
          {
            mistake: "Using the calculator for unstable renal function (e.g., acute kidney injury).",
            fix: "The Cockcroft-Gault formula assumes stable serum creatinine levels. For acute changes, direct measurement or alternative assessments are needed.",
          },
          {
            mistake: "Not adjusting weight for obese or underweight patients.",
            fix: "For patients with extreme body weights, using ideal body weight (IBW) or adjusted body weight (AjBW) may provide a more accurate estimate than actual body weight.",
          },
          {
            mistake: "Using serum creatinine values in µmol/L without conversion.",
            fix: "The formula requires serum creatinine in mg/dL. Convert µmol/L to mg/dL by dividing by 88.4.",
          },
          {
            mistake: "Confusing Creatinine Clearance with GFR estimated by MDRD or CKD-EPI.",
            fix: "While related, these are distinct. CrCl is often used for drug dosing, while eGFR is preferred for CKD staging. Always refer to specific guidelines.",
          },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Creatinine", definition: "A waste product from muscle metabolism, filtered by the kidneys." },
          { term: "Glomerular Filtration Rate (GFR)", definition: "The rate at which blood is filtered by the glomeruli in the kidneys." },
          { term: "Serum Creatinine", definition: "The concentration of creatinine in the blood, used as an indicator of kidney function." },
          { term: "Acute Kidney Injury (AKI)", definition: "A sudden episode of kidney failure or kidney damage that happens within a few hours or a few days." },
          { term: "Chronic Kidney Disease (CKD)", definition: "A progressive loss of kidney function over time." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16(1):31-41.", href: "https://pubmed.ncbi.nlm.nih.gov/1244564/" },
          { label: "National Kidney Foundation. GFR Calculators. Available at: https://www.kidney.org/professionals/gfr_calculatorCoc", href: "https://www.kidney.org/professionals/gfr_calculatorCoc" },
          { label: "MDCalc. Creatinine Clearance (Cockcroft-Gault Equation). Available at: https://www.mdcalc.com/calc/43/creatinine-clearance-cockcroft-gault-equation", href: "https://www.mdcalc.com/calc/43/creatinine-clearance-cockcroft-gault-equation" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed nephrologist or pharmacist reviewer for production" />

      <LastReviewed date="2026-05-30" />

      <RelatedCalculators
        slugs={[
          "a1c-calculator",
          "chronological-age-calculator",
        ]}
      />
    </Container>
  );
}
 
