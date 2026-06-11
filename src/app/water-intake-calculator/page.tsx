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

const SLUG = "water-intake-calculator";
const TITLE = "Water Intake Calculator";
const DESC =
  "Daily water in oz/L from body weight, activity, and climate.";

const FAQS: FaqItem[] = [
  {
    question: "Is 8 glasses a day a real rule?",
    answer:
      "No. The 8x8 figure is folklore — it does not appear in the National Academies water guidelines. Total water needs scale with body size, activity, climate, and diet, so a single number rarely fits everyone.",
  },
  {
    question: "Does food count toward daily water?",
    answer:
      "Yes. The National Academies estimate that food contributes about 20 percent of total water intake for typical eaters. Fruits, vegetables, soups, and dairy push that share higher.",
  },
  {
    question: "Can I just drink when I am thirsty?",
    answer:
      "For most healthy adults, thirst is a reliable guide during normal days. Thirst lags during heavy exercise, in hot weather, and in older adults, so plan ahead when those apply.",
  },
  {
    question: "Do I need electrolytes when it is hot?",
    answer:
      "If you sweat heavily for more than about an hour, sodium and other electrolytes matter. Plain water alone for long, sweaty sessions can dilute blood sodium and worsen performance.",
  },
  {
    question: "Can I drink too much water?",
    answer:
      "Yes. Drinking far more than the kidneys can excrete can cause hyponatremia, a dangerous drop in blood sodium. Endurance athletes and people on certain medications are most at risk.",
  },
  {
    question: "How much extra do I need during pregnancy or breastfeeding?",
    answer:
      "Pregnancy adds about 300 mL per day and breastfeeding adds about 700 mL per day on top of baseline, per the National Academies. Talk with your OB or midwife about your specific plan.",
  },
  {
    question: "Does coffee or tea count?",
    answer:
      "Yes. Moderate caffeinated drinks hydrate about as well as water for habitual coffee and tea drinkers. Alcohol is the exception — it has a net diuretic effect.",
  },
  {
    question: "Should kids and older adults follow the same target?",
    answer:
      "No. Children need less in absolute terms, and older adults often have a blunted thirst response. Pediatricians and primary care doctors set targets for those groups.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Daily Oz and Liters from Weight`,
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
      name: "How to estimate daily water intake",
      steps: [
        { name: "Enter body weight", text: "Use pounds or kilograms — the calculator converts internally." },
        { name: "Log exercise minutes", text: "Count minutes of vigorous activity that makes you sweat." },
        { name: "Pick climate", text: "Choose hot if you spend most of the day above about 80°F or 27°C." },
        { name: "Read total oz and liters", text: "The result is a starting point — adjust based on thirst, urine color, and medical advice." },
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

      <Hero title={TITLE} tagline="Estimate a daily water target in ounces and liters from your weight, exercise, and climate.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 160 lb adult does 60 minutes of vigorous exercise on a temperate day. What is a reasonable water target?"
        steps={[
          { label: "Base: 0.5 oz/lb × 160", value: "80 oz" },
          { label: "Exercise: 12 oz per 30 min × (60/30)", value: "24 oz" },
          { label: "Climate add-on (temperate)", value: "0 oz" },
          { label: "Total", value: "104 oz/day" },
          { label: "Converted (104 ÷ 33.814)", value: "~3.1 L" },
        ]}
        result="About 104 oz, or roughly 3.1 liters, including water from food and other drinks."
      />

      <FormulaExplained
        plainEnglish="The calculator starts from body weight, adds water lost during vigorous exercise, and adds a fixed amount for hot climates. It is a planning estimate — actual needs vary with diet, health, and the weather."
        formula={
          <span>
            base oz = 0.5 × weight (lb)
            <br />
            exercise oz = 12 × (minutes / 30)
            <br />
            climate oz = 16 if hot, else 0
            <br />
            total = min(base + exercise + climate, 150 oz)
          </span>
        }
        citation={{
          label: "National Academies — Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate (2005)",
          href: "https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate",
        }}
      />

      <WhenToUse
        scenarios={[
          "You want a starting daily water target instead of guessing.",
          "You are planning hydration for a long workout, hike, or hot-weather event.",
          "You are coaching a client or family member on healthier habits.",
          "You are recovering from a stomach bug or hot day and want a sanity check.",
          "You are a student or trainee learning fluid balance basics.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating the number as plain water only.", fix: "About 20 percent of daily water comes from food. Coffee, tea, milk, and juice also count." },
          { mistake: "Sticking to the target on sick or extreme days.", fix: "Fever, vomiting, diarrhea, very high heat, or long endurance work shift needs up. Adjust with a clinician." },
          { mistake: "Ignoring electrolytes during long sweaty workouts.", fix: "Water alone for hours of hard exercise can dilute blood sodium. Use a sports drink or salty snack." },
          { mistake: "Forcing water past thirst all day.", fix: "Healthy kidneys excrete excess water, but very high intake in a short window can cause hyponatremia." },
          { mistake: "Skipping medical advice for chronic conditions.", fix: "Heart failure, kidney disease, and some medications change safe intake. Ask your doctor about a personal target." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Total water intake", definition: "All water consumed from beverages plus water in food. The basis of the National Academies guideline." },
          { term: "Adequate intake (AI)", definition: "A reference intake set when there is not enough evidence for a strict RDA. The water number is an AI." },
          { term: "Hyponatremia", definition: "Low blood sodium, sometimes caused by drinking too much water too fast during endurance events." },
          { term: "Urine color guide", definition: "A practical check — pale straw color usually means well-hydrated; dark yellow suggests more fluid." },
          { term: "Sweat rate", definition: "Volume of fluid lost per hour of activity. Varies with fitness, heat, humidity, and clothing." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "National Academies — Dietary Reference Intakes for Water (2005)", href: "https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate" },
          { label: "CDC — Water and Healthier Drinks", href: "https://www.cdc.gov/healthy-weight-growth/water-healthy-drinks/index.html" },
          { label: "Mayo Clinic — Water: How much should you drink every day?", href: "https://www.mayoclinic.org/healthy-lifestyle/nutrition-and-healthy-eating/in-depth/water/art-20044256" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["protein-intake-calculator", "max-heart-rate-calculator", "steps-to-miles-calculator"]} />
    </Container>
  );
}
