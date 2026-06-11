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

const SLUG = "puppy-weight-calculator";
const TITLE = "Puppy Weight Calculator";
const DESC =
  "Estimate your puppy's adult weight from current age and weight. Size-class formulas for toy, small, medium, large, and giant breeds.";

const FAQS: FaqItem[] = [
  {
    question: "Why does size class matter for predicting adult weight?",
    answer:
      "Toy and small puppies finish growing by 9–12 months, while large and giant breeds keep adding weight until 18–24 months. The same age-and-weight inputs predict very different adult sizes depending on growth curve. Picking the right size class is the single biggest factor in accuracy.",
  },
  {
    question: "Are breed-specific weight charts more accurate than this calculator?",
    answer:
      "Yes. AKC breed standards and breeder growth charts use real data for one breed and beat any general formula. Use this calculator when the breed is mixed or unknown, and use a breed chart when you have a confirmed purebred.",
  },
  {
    question: "When do a puppy's growth plates close?",
    answer:
      "Growth plates typically close between 8 and 18 months — sooner in small breeds, later in giants. Once they fuse, the long bones stop lengthening. High-impact exercise is safer after plate closure.",
  },
  {
    question: "When should I switch from puppy food to adult food?",
    answer:
      "AAHA suggests switching when the puppy reaches about 80% of expected adult weight. For small breeds that is around 9–10 months; for giant breeds it can be 18–24 months. Feeding puppy food too long can over-supply calories and calcium.",
  },
  {
    question: "Does the 'double the 6-month weight' rule work for large breeds?",
    answer:
      "It is a reasonable rule of thumb for large and giant breeds because they grow steadily into their second year. A puppy weighing 40 lb at 6 months often lands near 80 lb as an adult. Toy and small breeds finish too early for this rule to apply.",
  },
  {
    question: "How does neuter or spay timing affect growth?",
    answer:
      "Removing sex hormones before growth plates close can delay plate fusion, producing a slightly taller adult. AAHA recommends timing decisions by breed and size class rather than a fixed age. Talk to your veterinarian about the right window for your dog.",
  },
  {
    question: "How accurate is this estimate?",
    answer:
      "Expect roughly plus or minus 15% on the predicted adult weight. Mixed breeds, late-blooming giants, and overweight puppies are the most common reasons for an estimate that misses. Weigh again every 4 weeks to refine the prediction.",
  },
  {
    question: "Is this calculator medical advice?",
    answer:
      "No. It is an educational estimate. Your veterinarian can assess body condition score, growth trajectory, and nutrition far better than any formula.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Predict Adult Size by Breed Class`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Pets", path: "/pets" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "pets", description: DESC }),
    howToSchema({
      name: "How to estimate a puppy's adult weight",
      steps: [
        { name: "Pick the size class", text: "Toy under 12 lb adult, small 12–25 lb, medium 25–50 lb, large 50–90 lb, giant over 90 lb." },
        { name: "Weigh the puppy", text: "Use a flat scale in pounds or kilograms. Record current age in weeks." },
        { name: "Apply the size-class formula", text: "Small/medium: adult ≈ current_weight × (52 / age_weeks). Large/giant: 6-month weight × 2." },
        { name: "Compare to breed chart", text: "If the breed is known, cross-check with the AKC breed standard or a breeder growth chart." },
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

      <Hero title={TITLE} tagline="Estimate your puppy's adult weight from age and current weight, with size-class adjustments for toy through giant breeds.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A medium-breed puppy is 16 weeks old and weighs 12 lb. What adult weight should the owner plan for?"
        steps={[
          { label: "Formula (small/medium): adult ≈ current_weight × (52 / age_weeks)", value: "" },
          { label: "Plug in 12 lb and 16 weeks: 12 × (52 / 16)", value: "12 × 3.25" },
          { label: "Multiply", value: "39 lb" },
          { label: "Apply ±15% range", value: "33–45 lb" },
        ]}
        result="Adult weight ≈ 39 lb (range 33–45 lb). Plan food, crate size, and harness fit around the upper end of that band."
      />

      <FormulaExplained
        plainEnglish="Puppy growth is fast then slow — small breeds finish by about a year, giants keep growing past 18 months. A simple ratio of current weight to age handles small and medium dogs; large and giant breeds use a doubling rule from 6-month weight."
        formula={
          <span>
            Toy / small / medium: adult_lb ≈ current_lb × (52 / age_weeks)
            <br />
            Large / giant: adult_lb ≈ weight_at_6_months_lb × 2
            <br />
            Range band: ±15% on the point estimate
          </span>
        }
        citation={{
          label: "AAHA Canine Life Stage Guidelines (2019) — growth curves and size-class transitions",
          href: "https://www.aaha.org/aaha-guidelines/life-stage-canine-2019/life-stage-canine-2019/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just brought a puppy home and need to plan crate, harness, and food-bag sizes.",
          "You are picking out a collar and want to avoid buying three replacements in a year.",
          "You adopted a mixed-breed and the shelter could only guess the adult size.",
          "You are deciding when to switch from puppy food to adult food.",
          "You are setting an exercise plan and want to know how long to wait before high-impact activity.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a toy-breed formula on a Labrador puppy.", fix: "Large breeds finish growing months after small breeds. Always pick the right size class first." },
          { mistake: "Predicting adult weight from a single 8-week measurement.", fix: "Estimates stabilize after 16 weeks. Weigh again at 4-week intervals and re-run the math." },
          { mistake: "Treating the estimate as a hard target.", fix: "Adult weight depends on genetics, neuter timing, and diet. Use body condition score, not a number on a scale, to judge weight." },
          { mistake: "Switching to adult food too early for a giant breed.", fix: "Giants stay on large-breed puppy food until 18–24 months. Early switches risk skeletal problems." },
          { mistake: "Skipping the vet visit.", fix: "Your veterinarian can flag failure-to-thrive or obesity far earlier than a calculator can." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Size class", definition: "Toy, small, medium, large, or giant — based on expected adult weight." },
          { term: "Growth plate", definition: "Cartilage zone at the end of long bones where new bone forms during growth." },
          { term: "Body condition score (BCS)", definition: "Veterinary 9-point scale that rates a dog as underweight, ideal, or overweight." },
          { term: "Doubling rule", definition: "Rule of thumb that a large-breed puppy's 6-month weight is roughly half its adult weight." },
          { term: "AAHA life stages", definition: "American Animal Hospital Association framework for puppy, young adult, mature adult, and senior care." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "AAHA — Canine Life Stage Guidelines (2019)", href: "https://www.aaha.org/aaha-guidelines/life-stage-canine-2019/life-stage-canine-2019/" },
          { label: "American Kennel Club — Breed Standards", href: "https://www.akc.org/dog-breeds/" },
          { label: "WSAVA — Global Nutrition Guidelines", href: "https://wsava.org/global-guidelines/global-nutrition-guidelines/" },
          { label: "WSAVA — Body Condition Score chart", href: "https://wsava.org/wp-content/uploads/2020/01/Body-Condition-Score-Dog.pdf" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed veterinarian (DVM) for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["dog-age-calculator", "protein-intake-calculator", "a1c-calculator"]} />
    </Container>
  );
}
