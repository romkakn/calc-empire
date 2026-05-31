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

const SLUG = "protein-intake-calculator";
const TITLE = "Protein Intake Calculator";
const DESC =
  "Calculate daily protein grams from your body weight, activity level, and goal (maintenance / muscle gain / fat loss).";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between the RDA and an optimal protein intake?",
    answer:
      "The US RDA is 0.8 g/kg/day — the minimum to prevent deficiency in most healthy adults. Sports nutrition research consistently shows higher intakes (1.2–2.2 g/kg) support better muscle retention, recovery, and body composition for active people.",
  },
  {
    question: "Will high protein hurt my kidneys?",
    answer:
      "In people with healthy kidneys, intakes up to about 2.0 g/kg/day have not been shown to cause harm in controlled studies. If you have chronic kidney disease, diabetes-related kidney concerns, or a family history, ask your doctor before going high. The risk is specific to existing disease, not high protein itself.",
  },
  {
    question: "Does protein per meal matter, or just the daily total?",
    answer:
      "Both matter. The daily total drives most of the result, but spreading protein across 3–5 meals of 25–40 g each appears to support muscle protein synthesis better than one or two huge meals. Aim for the total first, then distribute it.",
  },
  {
    question: "Is plant protein as good as animal protein?",
    answer:
      "Plant proteins tend to be lower in leucine and other essential amino acids per gram, so vegan and vegetarian lifters often aim about 10–20% higher in total grams. Combining sources (legumes plus grains, soy, pea isolate) closes the gap.",
  },
  {
    question: "What is the leucine threshold for muscle synthesis?",
    answer:
      "Research suggests around 2.5–3 g of leucine per meal maximally stimulates muscle protein synthesis in younger adults — roughly what's in 25–30 g of high-quality animal protein. Older adults may need slightly more per meal to hit the same response.",
  },
  {
    question: "Does protein timing around workouts matter?",
    answer:
      "The post-workout 'anabolic window' is wider than once thought — several hours, not 30 minutes. As long as you hit your daily total and eat protein within a few hours of training, exact timing has small effects.",
  },
  {
    question: "Why do older adults need more protein?",
    answer:
      "Aging muscle is less responsive to protein (anabolic resistance), so adults over 65 often benefit from about 1.0–1.2 g/lb (2.2–2.6 g/kg) to preserve lean mass and reduce fall risk. Strength training amplifies the benefit.",
  },
  {
    question: "Should I eat more protein when cutting fat?",
    answer:
      "Yes. During a calorie deficit, higher protein (around 0.82 g/lb or 1.8 g/kg) helps preserve muscle while losing fat. Protein is also the most filling macronutrient, which makes the diet easier to sustain.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Daily Grams by Goal & Activity`,
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
      name: "How to calculate your daily protein intake",
      steps: [
        { name: "Weigh in", text: "Use your current body weight in pounds or kilograms. Use lean weight if you carry a lot of body fat." },
        { name: "Pick your activity and goal", text: "Sedentary, generally active, strength training, fat loss (cutting), or muscle gain / older adult." },
        { name: "Multiply by the right factor", text: "0.36 g/lb sedentary · 0.55 g/lb active · 0.73 g/lb strength · 0.82 g/lb cutting · 1.0 g/lb bulking or 65+." },
        { name: "Spread across 3–5 meals", text: "Aim for 25–40 g per meal to keep muscle protein synthesis topped up across the day." },
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

      <Hero title={TITLE} tagline="Find your daily protein target in grams — based on your weight, training, and whether you're maintaining, cutting, or building.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 160 lb adult doing strength training 3–4 times per week. What's the daily protein target?"
        steps={[
          { label: "Formula: grams = body weight (lb) × 0.73", value: "" },
          { label: "Plug in 160 × 0.73", value: "116.8" },
          { label: "Round", value: "117 g/day" },
          { label: "Spread across 4 meals: 117 / 4", value: "~29 g/meal" },
          { label: "Same target in kg terms: 73 kg × 1.6", value: "~117 g/day" },
        ]}
        result="160 lb lifter targets 117 g of protein per day, or about 29 g across each of 4 meals."
      />

      <FormulaExplained
        plainEnglish="Daily protein needs scale with body weight, training stress, and goal. The minimum (RDA) keeps you out of deficiency. The higher tiers come from sports nutrition research on muscle retention, recovery, and body composition in trained people."
        formula={
          <span>
            Sedentary: grams = lb × 0.36 (kg × 0.8)
            <br />
            Generally active: grams = lb × 0.55 (kg × 1.2)
            <br />
            Strength training: grams = lb × 0.73 (kg × 1.6)
            <br />
            Cutting (fat loss): grams = lb × 0.82 (kg × 1.8)
            <br />
            Bulking or older adult (65+): grams = lb × 1.0 (kg × 2.2)
          </span>
        }
        citation={{
          label: "Jäger R, et al. — ISSN Position Stand: Protein and Exercise (J Int Soc Sports Nutr, 2017)",
          href: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8",
        }}
      />

      <WhenToUse
        scenarios={[
          "You started lifting and want to know how much protein to hit each day.",
          "You're cutting fat and want to preserve as much muscle as possible.",
          "You're 65 or older and want to slow age-related muscle loss.",
          "You eat mostly plant-based and want to know if you're getting enough.",
          "You're a coach setting a starting target for a new client.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using total body weight when very overweight.", fix: "If your body fat is high, base the math on lean body mass or a target weight to avoid an unrealistically large number." },
          { mistake: "Eating it all in one or two big meals.", fix: "Spread protein across 3–5 meals of about 25–40 g to keep muscle protein synthesis topped up." },
          { mistake: "Assuming more is always better.", fix: "Beyond ~2.2 g/kg, extra protein crowds out carbs and fats with no added muscle benefit for most people." },
          { mistake: "Ignoring quality with plant sources.", fix: "Lower leucine per gram means you usually need ~10–20% more total grams when fully plant-based, or you should combine sources." },
          { mistake: "Treating the target as exact.", fix: "Hit a range, not a precise number. ±10 g day-to-day is normal and fine." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "RDA", definition: "Recommended Dietary Allowance — US minimum to prevent deficiency. 0.8 g/kg for adults." },
          { term: "Muscle protein synthesis (MPS)", definition: "The rebuilding process that adds or repairs muscle. Triggered by training and a protein-rich meal." },
          { term: "Leucine threshold", definition: "Roughly 2.5–3 g of leucine per meal to maximally trigger MPS in younger adults." },
          { term: "Anabolic resistance", definition: "Reduced muscle response to protein with age. Older adults need more per meal to compensate." },
          { term: "Body composition", definition: "Ratio of fat to lean mass. Higher protein helps shift this toward more lean mass." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Jäger R et al. — International Society of Sports Nutrition Position Stand: Protein and Exercise (2017)", href: "https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8" },
          { label: "Phillips SM & Van Loon LJC — Dietary protein for athletes: from requirements to optimum adaptation (J Sports Sci, 2011)", href: "https://www.tandfonline.com/doi/full/10.1080/02640414.2011.619204" },
          { label: "US National Academies — Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids (2005)", href: "https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids" },
          { label: "Bauer J et al. — Evidence-Based Recommendations for Optimal Dietary Protein Intake in Older People (PROT-AGE Study Group, JAMDA 2013)", href: "https://www.jamda.com/article/S1525-8610(13)00326-5/fulltext" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["max-heart-rate-calculator", "steps-to-miles-calculator", "a1c-calculator"]} />
    </Container>
  );
}
