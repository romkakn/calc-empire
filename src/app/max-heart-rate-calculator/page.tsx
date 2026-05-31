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

const SLUG = "max-heart-rate-calculator";
const TITLE = "Max Heart Rate Calculator";
const DESC =
  "Estimate your maximum heart rate and target HR zones for endurance, threshold, and VO2 max training.";

const FAQS: FaqItem[] = [
  {
    question: "Why is 220 − age inaccurate for many people?",
    answer:
      "Fox's 1971 equation was never meant as a precise predictor — it was a rough average across a small, mostly male sample. Real MHR varies by ±10–12 beats per minute between people of the same age. Use it as a starting estimate, not a hard target.",
  },
  {
    question: "When should I use Tanaka or Gulati instead?",
    answer:
      "Tanaka (208 − 0.7 × age) is a better fit for healthy adults over 40 and is the formula most sports scientists prefer. Gulati (206 − 0.88 × age) was derived from a study of asymptomatic women and tends to predict lower peaks than Fox or Tanaka.",
  },
  {
    question: "What is lactate-threshold heart rate and how does it differ from MHR?",
    answer:
      "Lactate-threshold HR (LTHR) is the heart rate at which blood lactate begins to climb sharply — usually 80–90% of MHR in trained athletes. LTHR is a more useful training anchor than MHR for endurance work because it reflects sustainable effort.",
  },
  {
    question: "What do the five training zones mean?",
    answer:
      "Zone 1 (50–60% MHR) is easy recovery. Zone 2 (60–70%) builds aerobic base. Zone 3 (70–80%) is tempo work. Zone 4 (80–90%) is threshold. Zone 5 (90–100%) is VO2 max and short, hard intervals.",
  },
  {
    question: "What is the Karvonen heart-rate reserve method?",
    answer:
      "Karvonen uses heart-rate reserve (HRR) — the gap between resting HR and MHR — to set target zones. The formula is target = resting HR + (MHR − resting HR) × intensity%. It accounts for fitness level by including resting HR in the calculation.",
  },
  {
    question: "How accurate are fitness watch readings?",
    answer:
      "Wrist optical sensors are reasonable at steady, moderate effort but lag and drift during intervals, sprints, or strength work. A chest strap with an ECG sensor stays closer to a clinical reading, especially at high intensity.",
  },
  {
    question: "When should I see a cardiologist before testing my MHR?",
    answer:
      "Talk to a doctor first if you are over 40, have chest pain, fainting episodes, a family history of sudden cardiac death, or known heart disease. A supervised stress test gives a true MHR safely.",
  },
  {
    question: "Does this calculator replace a stress test?",
    answer:
      "No. It gives a population-level estimate. A graded exercise test in a clinical setting is the only way to measure your actual MHR. Use this tool for planning training, not for diagnosis.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Fox, Tanaka & Gulati Formulas`,
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
      name: "How to estimate your maximum heart rate",
      steps: [
        { name: "Enter your age", text: "Use your current age in whole years." },
        { name: "Pick a formula", text: "Fox (220 − age) is the classic estimate. Tanaka is more accurate for healthy adults. Gulati was derived from women." },
        { name: "Read your MHR", text: "The calculator returns an estimated peak in beats per minute (bpm)." },
        { name: "Use the zone table", text: "Multiply MHR by 0.50–1.00 to get five training zones, from easy recovery to VO2 max." },
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

      <Hero title={TITLE} tagline="Estimate your peak heart rate and the five training zones — pick the formula that fits you best.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 35-year-old recreational runner wants a Zone 2 target using the Tanaka formula."
        steps={[
          { label: "Formula (Tanaka): MHR = 208 − 0.7 × age", value: "" },
          { label: "Plug in 35: 0.7 × 35", value: "24.5" },
          { label: "Subtract from 208", value: "183.5 bpm" },
          { label: "Zone 2 low: 183.5 × 0.60", value: "110 bpm" },
          { label: "Zone 2 high: 183.5 × 0.70", value: "128 bpm" },
        ]}
        result="Estimated MHR = 183.5 bpm. Zone 2 target: 110–128 bpm — the right band for steady aerobic base work."
      />

      <FormulaExplained
        plainEnglish="Maximum heart rate is the highest bpm your heart can hit during all-out effort. Three age-based equations estimate it from population data; pick the one that matches your group, then scale to get training zones."
        formula={
          <span>
            Fox (1971): MHR = 220 − age
            <br />
            Tanaka et al. (2001): MHR = 208 − 0.7 × age
            <br />
            Gulati et al. (2010, women): MHR = 206 − 0.88 × age
            <br />
            Zone target = MHR × intensity%
          </span>
        }
        citation={{
          label: "Tanaka H, Monahan KD, Seals DR — Age-Predicted Maximal Heart Rate Revisited (J Am Coll Cardiol 2001)",
          href: "https://www.jacc.org/doi/10.1016/S0735-1097%2800%2901054-8",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are planning a new training block and need target heart-rate zones.",
          "You bought a fitness watch and want to set realistic zone alerts.",
          "You are coaching a runner or cyclist and need a starting estimate before field testing.",
          "You are returning to exercise and want a conservative upper bound.",
          "You are studying exercise physiology and want a quick reference for the standard formulas.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating the estimate as your true peak.", fix: "MHR varies by ±10–12 bpm across people of the same age. A graded exercise test is the only way to know your real number." },
          { mistake: "Using Fox for adults over 40.", fix: "Fox tends to overestimate in older adults. Tanaka fits population data better above age 40." },
          { mistake: "Ignoring resting heart rate.", fix: "Use Karvonen (heart-rate reserve) instead of straight MHR percentages if you want zones that scale with fitness." },
          { mistake: "Pushing to Zone 5 without a base.", fix: "Spend most training time in Zones 1–2. Hard intervals are the seasoning, not the meal." },
          { mistake: "Trusting wrist-optical HR at high intensity.", fix: "Chest straps with ECG sensors stay closer to true HR during intervals and lifting." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "MHR", definition: "Maximum heart rate — the highest bpm your heart can reach during peak effort." },
          { term: "HRR", definition: "Heart-rate reserve — the gap between resting HR and MHR, used by the Karvonen method." },
          { term: "LTHR", definition: "Lactate-threshold heart rate — the HR at which lactate accumulation rises sharply." },
          { term: "VO2 max", definition: "Maximum rate the body uses oxygen during exercise; closely linked to Zone 5 intensity." },
          { term: "Zone 2", definition: "Steady aerobic effort at 60–70% MHR — the foundation of endurance training." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Tanaka, Monahan, Seals — Age-Predicted Maximal Heart Rate Revisited (J Am Coll Cardiol, 2001)", href: "https://www.jacc.org/doi/10.1016/S0735-1097%2800%2901054-8" },
          { label: "Gulati M et al. — Heart Rate Response to Exercise Stress Testing in Asymptomatic Women (Circulation, 2010)", href: "https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.110.939249" },
          { label: "American College of Sports Medicine — Guidelines for Exercise Testing and Prescription", href: "https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription" },
          { label: "American Heart Association — Target Heart Rates Chart", href: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or exercise physiologist) for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["protein-intake-calculator", "steps-to-miles-calculator", "a1c-calculator"]} />
    </Container>
  );
}
