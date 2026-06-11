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

const SLUG = "army-body-fat-calculator";
const TITLE = "Army Body Fat Calculator";
const DESC =
  "Estimate body fat with the AR 600-9 tape test. Height, neck, waist (plus hip for women), in inches or centimeters.";

const FAQS: FaqItem[] = [
  {
    question: "What is the AR 600-9 tape test?",
    answer:
      "AR 600-9 is the Army Body Composition Program regulation. The tape test uses a few circumference measurements with a non-stretch tape to estimate body fat when a Soldier exceeds the screening weight for height. It is the Army's standard field method.",
  },
  {
    question: "What is the maximum body fat allowed in the Army?",
    answer:
      "Men: 20% (age 17–20), 22% (21–27), 24% (28–39), 26% (40+). Women: 30% (17–20), 32% (21–27), 34% (28–39), 36% (40+). Exceeding the limit triggers the body composition program and a path back into standard.",
  },
  {
    question: "How accurate is the tape test versus DEXA?",
    answer:
      "The tape test is a screening tool, not a lab measurement. Compared to DEXA or hydrostatic weighing it can differ by several percentage points either way, with the largest errors at the high and low ends. It is intended to be fast and repeatable, not lab-grade.",
  },
  {
    question: "Where do I place the tape?",
    answer:
      "Neck: just below the larynx, tape perpendicular to the long axis of the neck. Men measure waist at the navel; women measure waist at the narrowest point and hip at the widest. Keep the tape parallel to the floor and snug without compressing skin.",
  },
  {
    question: "How can I make measurements more consistent?",
    answer:
      "Measure first thing in the morning, no heavy meal or drink, no recent exercise, light clothing. Take three readings, drop any outlier, average the rest. Use the same tape and same landmarks every time.",
  },
  {
    question: "Is the Navy tape test the same equation?",
    answer:
      "Yes — the Navy circumference method uses the same body-fat equation as AR 600-9. The Marine Corps and Air Force have used variants of the same approach. Maximum allowed body-fat percentages differ by service.",
  },
  {
    question: "Does this calculator make me pass or fail an Army weigh-in?",
    answer:
      "No. Only an authorized measurer using AR 600-9 procedures determines compliance. Use this to estimate where you stand and to track progress between official measurements.",
  },
  {
    question: "Why does the result look wrong if my waist is smaller than my neck?",
    answer:
      "The formula takes a logarithm of waist minus neck (men) or waist plus hip minus neck (women). If that value is not positive the result is undefined. Re-check landmarks and that you used the same unit for every input.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — AR 600-9 Tape Test`,
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
      name: "How to estimate body fat with the AR 600-9 tape test",
      steps: [
        { name: "Pick your sex and unit", text: "The female equation also needs a hip measurement. Inches and centimeters are interchangeable." },
        { name: "Measure height, neck, and waist", text: "Stand tall, tape parallel to the floor, snug but not pinching skin. Men measure waist at the navel; women measure waist at the narrowest point." },
        { name: "Apply the AR 600-9 equation", text: "Male: 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76. Female: 163.205 × log10(waist + hip − neck) − 97.684 × log10(height) − 78.387." },
        { name: "Compare to the max for your age", text: "Men 18–26 max 22–24% by age band; women 18–26 max 32%. Older age bands allow more." },
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

      <Hero
        title={TITLE}
        tagline="AR 600-9 tape-test body-fat estimate from height, neck, waist (and hip for women). Inches or centimeters."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 25-year-old male Soldier: height 70 in, neck 16 in, waist 34 in. What does the tape test estimate?"
        steps={[
          { label: "Formula: BF% = 86.010 × log10(waist − neck) − 70.041 × log10(height) + 36.76", value: "" },
          { label: "waist − neck = 34 − 16", value: "18 in" },
          { label: "log10(18) ≈ 1.2553 · 86.010 × 1.2553", value: "107.96" },
          { label: "log10(70) ≈ 1.8451 · 70.041 × 1.8451", value: "129.22" },
          { label: "107.96 − 129.22 + 36.76", value: "15.5%" },
          { label: "AR 600-9 max at age 25 (men 21–27)", value: "22%" },
        ]}
        result="BF% ≈ 15.5%, well inside the 22% AR 600-9 limit for a 25-year-old male Soldier."
      />

      <FormulaExplained
        plainEnglish="The Army tape test fits a curve to body-fat percentage using a few easy circumference measurements. Neck and waist for men; neck, waist, and hip for women. Height anchors the scale because taller people carry the same fat over more frame."
        formula={
          <span>
            Male BF% = 86.010 × log<sub>10</sub>(waist − neck) − 70.041 × log<sub>10</sub>(height) + 36.76
            <br />
            Female BF% = 163.205 × log<sub>10</sub>(waist + hip − neck) − 97.684 × log<sub>10</sub>(height) − 78.387
            <br />
            All measurements in inches.
          </span>
        }
        citation={{
          label: "Army Regulation 600-9 — The Army Body Composition Program",
          href: "https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1023368",
        }}
      />

      <WhenToUse
        scenarios={[
          "You exceeded the Army screening weight-for-height table and need a body-fat estimate.",
          "You are preparing for a board, school, or assignment with a body-composition standard.",
          "You are tracking progress between official AR 600-9 measurements.",
          "You are a recruiter or trainer giving a candidate a realistic preview of the tape test.",
          "You are a civilian comparing yourself to the Army standard for general fitness goals.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Compressing the skin with the tape.", fix: "Snug, not tight. The tape should sit flat against skin without indenting it. A flexible non-stretch fiberglass tape is the standard." },
          { mistake: "Measuring the waist in the wrong spot.", fix: "Men: at the navel, level with the floor. Women: narrowest point of the torso. Mixing landmarks changes the result by several percent." },
          { mistake: "Mixing units mid-measurement.", fix: "Enter all four values in the same unit. The page converts internally, but inputs must agree with the unit toggle." },
          { mistake: "Treating one measurement as truth.", fix: "Take two or three reads at each site, average the close ones, drop a clear outlier." },
          { mistake: "Using the result to argue with an official measurer.", fix: "Only AR 600-9 procedure with an authorized measurer determines compliance. This page is a self-screen." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "AR 600-9", definition: "Army Regulation governing the Army Body Composition Program, including the tape-test method." },
          { term: "Tape test", definition: "Circumference-based body-fat estimate used by the US military." },
          { term: "Screening weight", definition: "Maximum weight for a given height before the tape test is required." },
          { term: "DEXA", definition: "Dual-energy X-ray absorptiometry. A clinical body-composition scan used as a reference standard." },
          { term: "Body fat percentage", definition: "Share of total body mass that is fat tissue, the rest being lean mass, water, and bone." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Army Regulation 600-9 — The Army Body Composition Program", href: "https://armypubs.army.mil/ProductMaps/PubForm/Details.aspx?PUB_ID=1023368" },
          { label: "DoD Instruction 1308.03 — DoD Physical Fitness/Body Composition Program", href: "https://www.esd.whs.mil/Portals/54/Documents/DD/issuances/dodi/130803p.pdf" },
          { label: "ACSM — Body Composition Assessment Position Stand", href: "https://www.acsm.org/education-resources/trending-topics-resources/acsm-position-stands" },
          { label: "Hodgdon JA, Beckett MB — Naval Health Research Center body-fat equations (1984)", href: "https://apps.dtic.mil/sti/citations/ADA143890" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["body-shape-calculator", "protein-intake-calculator", "max-heart-rate-calculator"]} />
    </Container>
  );
}
