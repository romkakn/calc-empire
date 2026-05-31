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

const SLUG = "steps-to-miles-calculator";
const TITLE = "Steps to Miles Calculator";
const DESC =
  "Convert daily steps to miles using your height to estimate stride length. Or work backwards from a mile goal.";

const FAQS: FaqItem[] = [
  {
    question: "How is stride length estimated from height?",
    answer:
      "A common rule of thumb is height (inches) × 0.413 for women or × 0.415 for men, giving stride length in inches. Divide by 12 to get feet. Your real stride varies with pace, terrain, and fitness, so treat this as an estimate.",
  },
  {
    question: "Why do men and women have different multipliers?",
    answer:
      "The 0.413 / 0.415 ratios come from population-average gait studies that found a small sex-based difference in stride proportion at a given height. Individual variation is much larger than the male-female gap, so use them as starting points.",
  },
  {
    question: "How is walking stride different from running stride?",
    answer:
      "Running stride is longer than walking stride at the same height, often by 20% or more. If you mix walking and running, log them separately for a closer mileage estimate.",
  },
  {
    question: "Does treadmill walking count the same as outdoor walking?",
    answer:
      "Step counts are similar, but treadmill belts assist your push-off, so calorie burn is a bit lower than outdoor walking at the same pace. Distance per step stays close enough to use the same stride estimate.",
  },
  {
    question: "Is 10,000 steps a day a real medical target?",
    answer:
      "No. The number came from a 1960s Japanese pedometer marketing campaign, not a clinical study. Newer research suggests health gains start around 4,000 steps and plateau between 7,000 and 10,000 for most adults.",
  },
  {
    question: "How many calories does a mile of walking burn?",
    answer:
      "A rough estimate is 80 to 100 calories per mile for an average adult, depending on weight and pace. Hills, wind, and load (a backpack, a stroller) push the number higher.",
  },
  {
    question: "How accurate are step-counting apps?",
    answer:
      "Wrist trackers are usually within 5 to 10 percent of true step counts for normal walking. Accuracy drops when you push a cart, hold a phone, or walk very slowly because the device misses the arm-swing pattern it looks for.",
  },
  {
    question: "GPS distance vs. step-based distance — which is right?",
    answer:
      "GPS measures the path you actually traveled and is usually closer to truth outdoors. Step-based distance is an estimate from stride length, so the two will not match exactly. Use GPS for outdoor mileage when you can.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Stride-Based Mileage Converter`,
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
      name: "How to convert steps to miles",
      steps: [
        { name: "Pick your direction", text: "Choose steps → miles for a daily total, or miles → steps if you have a distance goal." },
        { name: "Enter your height and sex", text: "Height in inches sets stride length. The sex toggle picks the 0.413 (women) or 0.415 (men) multiplier." },
        { name: "Enter steps or miles", text: "Type today's step count, or the mile goal you want to reach." },
        { name: "Read the result", text: "The calculator shows miles for a given step count, or the steps needed to hit a mile target." },
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

      <Hero title={TITLE} tagline="Turn step counts into miles using your height — or work backwards from a distance goal.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A woman who is 67 inches tall (5 ft 7 in) hit 10,000 steps today. How many miles is that?"
        steps={[
          { label: "Stride (inches) = 67 × 0.413", value: "27.67 in" },
          { label: "Stride in feet = 27.67 / 12", value: "2.306 ft" },
          { label: "Total feet = 10,000 × 2.306", value: "23,059 ft" },
          { label: "Miles = 23,059 / 5,280", value: "4.37 mi" },
        ]}
        result="10,000 steps at 67 in (woman) ≈ 4.37 miles. The CDC's 2,000 steps-per-mile rule of thumb would estimate 5.00 miles — stride-based is usually more accurate."
      />

      <FormulaExplained
        plainEnglish="Your stride is the distance one foot covers between consecutive heel strikes — and it scales roughly with your height. Multiply step count by stride length, then divide by 5,280 feet to get miles."
        formula={
          <span>
            stride (in) = height (in) × 0.413 (women) or × 0.415 (men)
            <br />
            miles = steps × stride (in) / 12 / 5,280
            <br />
            Quick rule: ~2,000 steps ≈ 1 mile (CDC)
          </span>
        }
        citation={{
          label: "CDC — Physical Activity Basics, step-count guidance",
          href: "https://www.cdc.gov/physical-activity-basics/index.html",
        }}
      />

      <WhenToUse
        scenarios={[
          "You wear a step tracker and want a mileage estimate without a GPS watch.",
          "You're building up to a 5K or longer walk and want to plan daily step targets.",
          "You're a coach or PE teacher converting class step totals into distance.",
          "You're a researcher logging activity in self-reported step counts.",
          "You hike or walk indoors where GPS is unreliable and want a closer-to-truth distance.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a one-size-fits-all 2,500 steps per mile.", fix: "Stride scales with height. A 5'2\" walker and a 6'4\" walker can differ by a mile or more per 10,000 steps." },
          { mistake: "Trusting GPS indoors.", fix: "Indoors, GPS loses signal and the watch falls back to step-based distance — which is what this calculator estimates." },
          { mistake: "Mixing walking and running steps as one stride.", fix: "Log them separately. Running stride is meaningfully longer at the same height." },
          { mistake: "Aiming for 10,000 steps as a medical target.", fix: "That number came from marketing, not a clinical study. Health gains start lower; pick a target that fits your routine." },
          { mistake: "Ignoring stride drift over time.", fix: "Stride shortens with fatigue, age, and injury. Recalibrate every few months if you rely on step-based distance." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Stride length", definition: "Distance from one heel strike to the next strike of the same foot. Twice the step length." },
          { term: "Step length", definition: "Distance from heel strike of one foot to heel strike of the opposite foot. Half a stride." },
          { term: "Cadence", definition: "Steps per minute. Higher cadence usually means a shorter stride at a given pace." },
          { term: "Pedometer", definition: "Device that counts steps using motion sensors. Modern phones and watches act as pedometers." },
          { term: "MET (metabolic equivalent)", definition: "A measure of activity intensity. Walking 3 mph is about 3.5 METs." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "CDC — Physical Activity Basics", href: "https://www.cdc.gov/physical-activity-basics/index.html" },
          { label: "Tudor-Locke C, Bassett DR — How Many Steps/Day Are Enough? (Sports Medicine, 2004)", href: "https://pubmed.ncbi.nlm.nih.gov/14715035/" },
          { label: "U.S. Department of Health and Human Services — Physical Activity Guidelines for Americans, 2nd edition", href: "https://health.gov/sites/default/files/2019-09/Physical_Activity_Guidelines_2nd_edition.pdf" },
          { label: "Saint-Maurice PF et al. — Association of Daily Step Count and Mortality (JAMA, 2020)", href: "https://jamanetwork.com/journals/jama/fullarticle/2763292" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["max-heart-rate-calculator", "protein-intake-calculator", "height-calculator"]} />
    </Container>
  );
}
