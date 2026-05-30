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
  "Estimate CrCl with Cockcroft-Gault (drug-dosing) or eGFR with CKD-EPI 2021 (staging). Race-free, KDIGO band, both unit systems.";

const FAQS: FaqItem[] = [
  {
    question: "What is creatinine clearance?",
    answer:
      "Creatinine clearance (CrCl) estimates how much blood the kidneys filter of creatinine per minute. It's a practical proxy for glomerular filtration rate and is the standard for adjusting drug doses in renal impairment.",
  },
  {
    question: "Cockcroft-Gault or CKD-EPI — which should I use?",
    answer:
      "Cockcroft-Gault is the FDA-referenced equation for drug-dose adjustment. CKD-EPI 2021 is the current standard for staging chronic kidney disease. Match the equation to the clinical question.",
  },
  {
    question: "Does CKD-EPI 2021 use race?",
    answer:
      "No. The 2021 update from NKF and ASN removed the race coefficient. The equation uses age, sex, and serum creatinine only.",
  },
  {
    question: "What units should I enter?",
    answer:
      "Both. Weight accepts kg or lb. Serum creatinine accepts mg/dL (US) or µmol/L (SI). The calculator converts internally — pick whichever matches your lab report.",
  },
  {
    question: "Does Cockcroft-Gault work for obese patients?",
    answer:
      "Actual body weight in Cockcroft-Gault tends to overestimate CrCl in obesity. Many institutions use adjusted body weight or ideal body weight above a BMI threshold. Check your local protocol.",
  },
  {
    question: "What's a normal CrCl?",
    answer:
      "Roughly ≥ 90 mL/min for a healthy young adult. Filtration slowly declines with age; a 70-year-old at 70 mL/min is still in the mild-impairment band and usually doesn't need dose reduction.",
  },
  {
    question: "Does this calculator give a diagnosis?",
    answer:
      "No. It estimates kidney function. Diagnosis of acute kidney injury or chronic kidney disease requires a clinician integrating serial labs, urine studies, and the clinical picture.",
  },
  {
    question: "How accurate are these estimates?",
    answer:
      "Both equations are estimates with population-level error bars. For decisions in critical illness, pregnancy, or unstable renal function, a measured clearance (24-hour urine or iohexol) is more reliable.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cockcroft-Gault & CKD-EPI 2021`,
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
      name: "How to estimate creatinine clearance",
      steps: [
        { name: "Pick an equation", text: "Cockcroft-Gault for drug-dose adjustment. CKD-EPI 2021 for CKD staging." },
        { name: "Enter age, sex, and weight", text: "Use actual body weight by default. Consider adjusted weight in obesity." },
        { name: "Enter serum creatinine", text: "Use the most recent stable lab value. Acute changes invalidate the estimate." },
        { name: "Read the result + KDIGO band", text: "G1–G5 maps to the kidney-function stage. Confirm any dose change against the drug label." },
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
        title={TITLE}
        tagline="Cockcroft-Gault for drug dosing. CKD-EPI 2021 for staging. Both unit systems, race-free, with the KDIGO band built in."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 65-year-old male, 80 kg, serum creatinine 1.2 mg/dL — what's the Cockcroft-Gault CrCl?"
        steps={[
          { label: "Formula: ((140 − age) × weight_kg) / (72 × SCr_mg/dL)", value: "" },
          { label: "Numerator: (140 − 65) × 80", value: "6,000" },
          { label: "Denominator: 72 × 1.2", value: "86.4" },
          { label: "Divide: 6,000 / 86.4", value: "69.4 mL/min" },
          { label: "If female: × 0.85", value: "59.0 mL/min" },
        ]}
        result="Mild renal impairment for both. Many drugs don't need dose reduction until CrCl falls below 50–60 mL/min — check the label."
      />

      <FormulaExplained
        plainEnglish="Cockcroft-Gault estimates kidney clearance from age, weight, sex, and creatinine — the four cheapest pieces of bedside information. CKD-EPI 2021 swaps weight for a body-surface-area normalization and a power function in creatinine, which performs better for staging across the population."
        formula={
          <span>
            CrCl (mL/min) = ((140 − age) × weight<sub>kg</sub>) / (72 × SCr<sub>mg/dL</sub>) × (0.85 if female)
            <br />
            eGFR<sub>CKD-EPI 2021</sub> = 142 × min(SCr/κ, 1)<sup>α</sup> × max(SCr/κ, 1)<sup>-1.200</sup> × 0.9938<sup>age</sup> × (1.012 if female)
            <br />
            κ = 0.7 (female) / 0.9 (male); α = -0.241 (female) / -0.302 (male)
          </span>
        }
        citation={{
          label: "Inker LA et al. — New Creatinine- and Cystatin C–Based Equations to Estimate GFR (NEJM, 2021)",
          href: "https://www.nejm.org/doi/full/10.1056/NEJMoa2102953",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're adjusting a renally cleared drug dose (DOACs, vancomycin, gabapentin, metformin) at the bedside.",
          "You're staging chronic kidney disease for a primary-care follow-up plan.",
          "You're a pharmacy resident verifying a label's renal dose-adjustment cutoff.",
          "You're a nursing student studying clinical pharmacology.",
          "You're a patient who got a lab back and wants to understand the eGFR number on the report.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using Cockcroft-Gault for CKD staging.", fix: "CKD-EPI 2021 is the staging standard. Cockcroft-Gault is for drug-dose decisions." },
          { mistake: "Using an old, race-based CKD-EPI value.", fix: "The 2021 race-free equation is what guidelines now recommend. Update your tool." },
          { mistake: "Trusting CrCl in unstable renal function.", fix: "Steady-state assumption fails when creatinine is rising or falling fast. Use clinical judgment in AKI." },
          { mistake: "Ignoring obesity in Cockcroft-Gault.", fix: "Actual body weight overestimates CrCl. Many protocols switch to adjusted body weight above BMI 30." },
          { mistake: "Skipping the drug label.", fix: "The label always wins. A calculator gives an estimate — the drug label gives the rule." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "CrCl", definition: "Creatinine clearance — milliliters of blood cleared of creatinine per minute." },
          { term: "eGFR", definition: "Estimated glomerular filtration rate — preferred for staging chronic kidney disease." },
          { term: "KDIGO", definition: "International CKD-guideline body. Defines stages G1–G5 by GFR and A1–A3 by albuminuria." },
          { term: "Cockcroft-Gault", definition: "1976 equation using age, sex, weight, and creatinine. Still FDA-referenced for drug dose adjustment." },
          { term: "CKD-EPI 2021", definition: "Race-free update of CKD-EPI. Endorsed by NKF and ASN as the staging standard." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Cockcroft DW, Gault MH — Prediction of creatinine clearance from serum creatinine (Nephron, 1976)", href: "https://pubmed.ncbi.nlm.nih.gov/1244564/" },
          { label: "Inker LA et al. — New Creatinine- and Cystatin C–Based Equations to Estimate GFR (NEJM, 2021)", href: "https://www.nejm.org/doi/full/10.1056/NEJMoa2102953" },
          { label: "National Kidney Foundation — CKD-EPI 2021 calculator", href: "https://www.kidney.org/professionals/kdoqi/gfr_calculator" },
          { label: "FDA Guidance — Pharmacokinetics in Patients with Impaired Renal Function (2020)", href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/pharmacokinetics-patients-impaired-renal-function-study-design-data-analysis-and-impact-dosing" },
          { label: "KDIGO 2024 Clinical Practice Guideline for CKD Evaluation and Management", href: "https://kdigo.org/guidelines/ckd-evaluation-and-management/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinical pharmacist or nephrologist for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators
        slugs={["a1c-calculator", "chronological-age-calculator", "variance-calculator"]}
      />
    </Container>
  );
}
