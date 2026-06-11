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

const SLUG = "target-heart-rate-calculator";
const TITLE = "Target Heart Rate Calculator";
const DESC =
  "Target HR zones via Karvonen and percent of max. Resting HR refinement.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between Karvonen and percent of max?",
    answer:
      "Percent of max multiplies your max heart rate by an intensity percentage. Karvonen uses heart rate reserve — the gap between max and resting HR — so a fitter person with a lower resting HR gets a target tuned to them. Karvonen is generally more personalized.",
  },
  {
    question: "Why include resting heart rate?",
    answer:
      "Resting HR drops as your cardiovascular fitness improves. Plugging it into the Karvonen formula keeps your target zone honest as you get fitter. Without it, the math ignores how trained you actually are.",
  },
  {
    question: "What are the five training zones?",
    answer:
      "Zone 1 is very easy (50–60% HRR), zone 2 is easy aerobic (60–70%), zone 3 is moderate (70–80%), zone 4 is hard threshold work (80–90%), and zone 5 is near-max (90–100%). Most weekly volume should sit in zones 1 and 2 for endurance.",
  },
  {
    question: "How does heart rate link to VO2 max?",
    answer:
      "VO2 max is the most oxygen your body can use during hard exercise. Heart rate rises roughly in line with oxygen use up to your max, which is why training in zones 3–5 is a common way to push VO2 max higher.",
  },
  {
    question: "How accurate is 220 minus age?",
    answer:
      "The Fox 220 minus age rule is a fast estimate with a standard deviation of about 10 to 12 bpm. It can be off by 20 bpm or more for a given person. For a more accurate population estimate, see the Tanaka question below.",
  },
  {
    question: "When should I use the Tanaka formula instead?",
    answer:
      "Use Tanaka (208 minus 0.7 times age) when you want a research-backed estimate that better fits adults over 40. It tends to predict a higher max HR than the Fox rule for older adults, which can change your target zone by several bpm.",
  },
  {
    question: "Is a chest strap better than a wrist monitor?",
    answer:
      "Chest straps read the electrical signal of your heart and stay accurate during intervals and strength work. Wrist optical sensors lag and drop signal during gripping or arm motion. For zone training, a chest strap is the safer bet.",
  },
  {
    question: "Should I see a doctor before starting?",
    answer:
      "Talk to your doctor before a new exercise plan if you have heart disease, take heart or blood pressure medication, are pregnant, or have symptoms like chest pain or fainting. This calculator does not replace medical screening.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Karvonen and Percent of Max`,
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
      name: "How to calculate your target heart rate zone",
      steps: [
        { name: "Estimate your max heart rate", text: "Use 220 minus your age in years (Fox rule) for a quick estimate." },
        { name: "Measure your resting heart rate", text: "Take your pulse for 60 seconds first thing in the morning, before getting out of bed." },
        { name: "Pick a method", text: "Karvonen uses heart rate reserve and your resting HR. Percent of max uses only your max HR." },
        { name: "Set an intensity range", text: "Choose a low and high intensity percentage that matches your workout goal, then read off the target bpm range." },
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

      <Hero title={TITLE} tagline="Find the heart rate range that matches your training goal — Karvonen for personalized zones, percent of max for a quick estimate.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 35-year-old with a resting heart rate of 60 bpm wants an easy aerobic zone of 60 to 70 percent intensity using the Karvonen method."
        steps={[
          { label: "Max heart rate (220 − age): 220 − 35", value: "185 bpm" },
          { label: "Heart rate reserve (MHR − resting): 185 − 60", value: "125 bpm" },
          { label: "Low end: 60 + 0.60 × 125", value: "135 bpm" },
          { label: "High end: 60 + 0.70 × 125", value: "147 bpm" },
        ]}
        result="Karvonen target zone at 60–70% intensity: 135 to 147 bpm."
      />

      <FormulaExplained
        plainEnglish="Your max heart rate is the ceiling your heart can hit during all-out effort. Karvonen takes the gap between that ceiling and your resting heart rate — your heart rate reserve — and aims the workout at a percentage of that gap. Percent of max skips resting HR and just takes a slice of the ceiling."
        formula={
          <span>
            MHR = 220 − age (Fox)
            <br />
            HRR = MHR − resting HR
            <br />
            Karvonen target = resting HR + intensity × HRR
            <br />
            Percent-of-max target = intensity × MHR
          </span>
        }
        citation={{
          label: "Karvonen MJ, Kentala E, Mustala O — The effects of training on heart rate (Annales Medicinae Experimentalis et Biologiae Fenniae 1957)",
          href: "https://pubmed.ncbi.nlm.nih.gov/13470504/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are starting an aerobic program and want a heart rate range to aim at.",
          "You are training for a 5K, 10K, half marathon, or longer event and want to split easy days from threshold days.",
          "You wear a chest strap or wrist monitor and want zones that mean something on your watch.",
          "You are a coach or trainer building a plan for a client and need a defensible target range.",
          "You are returning to exercise after time off and want a sane intensity cap.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating 220 minus age as an exact number.", fix: "It is a population average with about plus or minus 10 to 12 bpm of error. Use a field test or recent max effort if you want a sharper number." },
          { mistake: "Measuring resting HR after coffee or after standing up.", fix: "Caffeine, standing, and stress all raise pulse. Measure in bed, before caffeine, ideally on a few mornings and average." },
          { mistake: "Spending every session in zone 4 or 5.", fix: "Most endurance gains come from zones 1 and 2. High intensity belongs in 1 to 2 sessions per week for most people." },
          { mistake: "Trusting a wrist optical reading during intervals.", fix: "Optical sensors drift during sprints and strength work. A chest strap is more reliable for zone training." },
          { mistake: "Ignoring how heat and dehydration raise heart rate.", fix: "Cardiac drift adds 10 or more bpm at the same effort in hot weather. Adjust pace, not heart rate, on hot days." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Max heart rate (MHR)", definition: "The highest heart rate you can hit during all-out effort, in beats per minute." },
          { term: "Resting heart rate (RHR)", definition: "Your pulse at full rest, measured first thing in the morning before getting up." },
          { term: "Heart rate reserve (HRR)", definition: "Max heart rate minus resting heart rate. The headroom you have between rest and max." },
          { term: "Karvonen method", definition: "Target = resting HR + intensity percentage of heart rate reserve. Personalizes zones to fitness." },
          { term: "VO2 max", definition: "The peak rate at which your body uses oxygen during hard exercise. A common fitness benchmark." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "American College of Sports Medicine — ACSM's Guidelines for Exercise Testing and Prescription", href: "https://www.acsm.org/education-resources/books/guidelines-exercise-testing-prescription" },
          { label: "Karvonen MJ, Kentala E, Mustala O — The effects of training on heart rate (1957, PubMed)", href: "https://pubmed.ncbi.nlm.nih.gov/13470504/" },
          { label: "CDC — Target Heart Rate and Estimated Maximum Heart Rate", href: "https://www.cdc.gov/physical-activity-basics/measuring/target-heart-rate.html" },
          { label: "Tanaka H, Monahan KD, Seals DR — Age-predicted maximal heart rate revisited (JACC 2001)", href: "https://pubmed.ncbi.nlm.nih.gov/11153730/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (MD or RD) for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["max-heart-rate-calculator", "protein-intake-calculator", "steps-to-miles-calculator"]} />
    </Container>
  );
}
