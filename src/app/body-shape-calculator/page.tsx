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

const SLUG = "body-shape-calculator";
const TITLE = "Body Shape Calculator";
const DESC =
  "Identify your body shape — hourglass, pear, apple, rectangle, or inverted triangle — from bust, waist, and hip measurements in inches or centimeters.";

const FAQS: FaqItem[] = [
  {
    question: "How accurate is a body shape calculator?",
    answer:
      "Body shape labels are a useful shorthand, not a medical or fitness assessment. The math compares three circumferences and slots you into the closest category. Real bodies rarely fall perfectly into one shape, so treat the result as a starting point for styling or fit decisions.",
  },
  {
    question: "What is the difference between body shape and body composition?",
    answer:
      "Shape describes the outline — how your bust, waist, and hips compare to each other. Composition describes what makes up your weight, such as muscle, fat, and bone. Two people can share the same shape but have very different composition.",
  },
  {
    question: "How does waist-to-hip ratio relate to health?",
    answer:
      "The World Health Organization links a higher waist-to-hip ratio to greater cardiometabolic risk, with cutoffs around 0.85 for women and 0.90 for men. Body shape uses similar measurements but is meant for fit and styling, not screening. For a health read, use the dedicated waist-to-hip ratio guidance with a clinician.",
  },
  {
    question: "How do I measure my bust, waist, and hips correctly?",
    answer:
      "Stand relaxed, breathe out, and keep the tape level around your body. Measure the bust at the fullest point, the natural waist at the narrowest point between the lowest rib and the hip bone, and the hips at the widest point of the seat. Take each measurement twice and use the average.",
  },
  {
    question: "Why do I get a different shape every time I measure?",
    answer:
      "Small changes in tape position, posture, or which day of the cycle you measure can move the numbers by an inch or more. Try measuring at the same time of day in the same clothing, and average three reads per spot for a steadier result.",
  },
  {
    question: "Can I change my body shape?",
    answer:
      "Training and body composition changes can shift proportions a little, but the underlying skeleton — rib cage width, shoulder width, pelvis width — sets the frame. Most people see bigger differences in tone and fit than in their overall shape category.",
  },
  {
    question: "How do I use my body shape for wardrobe choices?",
    answer:
      "The shape gives you a fast read on which silhouettes will sit balanced on you — for example, hourglass figures often look tidy in fitted waists, while rectangles can fake a waist with belts or peplum details. It is a styling cue, not a rule, so wear what makes you feel good.",
  },
  {
    question: "Does this calculator work for men?",
    answer:
      "The same shape categories were built around bust-waist-hip ratios more common in womenswear sizing. Men can still measure chest, waist, and hips and read the result, but inverted triangle and rectangle are the most common menswear shapes.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Hourglass, Pear, Apple, Rectangle, Inverted`,
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
      name: "How to find your body shape from bust, waist, and hip measurements",
      steps: [
        { name: "Pick a unit", text: "Use inches or centimeters — just stay consistent across all three measurements." },
        { name: "Measure the three points", text: "Bust at the fullest point, waist at the narrowest point above the navel, hips at the widest point of the seat." },
        { name: "Compare the ratios", text: "Calculate bust-to-hip and waist-to-bust ratios to see which category fits — within 5% means roughly equal." },
        { name: "Read the shape", text: "Hourglass, pear, apple, rectangle, or inverted triangle, depending on which measurements lead." },
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

      <Hero title={TITLE} tagline="Type in bust, waist, and hips — get a shape label you can actually use when shopping or planning a workout split.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A person measures bust 36 in, waist 26 in, hips 38 in. Which shape?"
        steps={[
          { label: "Bust ÷ Hips: 36 ÷ 38", value: "0.95 (within 5% — roughly balanced)" },
          { label: "Waist ÷ Bust: 26 ÷ 36", value: "0.72 (≤ 0.75 — clear waist definition)" },
          { label: "Waist ÷ Hips: 26 ÷ 38", value: "0.68 (≤ 0.75 — clear waist definition)" },
          { label: "Bust and hips roughly equal, waist much smaller", value: "Hourglass" },
        ]}
        result="Bust 36, waist 26, hips 38 → hourglass shape. Bust-to-hip is 0.95 (balanced) and the waist sits at 72% of the bust, which is the hourglass signature."
      />

      <FormulaExplained
        plainEnglish="The calculator looks at three numbers — bust, waist, and hip circumference — and checks which pair is largest and how defined the waist is. Each shape has a simple ratio rule that decides which label fits best."
        formula={
          <span>
            Hourglass: |bust − hip| ≤ 5% of the larger AND waist ≤ 0.75 × min(bust, hip)
            <br />
            Pear: hip &gt; bust by more than 5%
            <br />
            Inverted triangle: bust &gt; hip by more than 5%
            <br />
            Apple: waist ≥ bust AND waist ≥ hip
            <br />
            Rectangle: bust, waist, hip all within ~5% of each other
          </span>
        }
        citation={{
          label: "CDC — Anthropometry Procedures Manual (waist and hip circumference protocol)",
          href: "https://wwwn.cdc.gov/nchs/data/nhanes/2017-2018/manuals/2017_Anthropometry_Procedures_Manual.pdf",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are shopping online and want a quick read on which silhouettes will fit without a tailor.",
          "You are planning a wardrobe refresh and want a starting point for cuts that work on your frame.",
          "You are a stylist or personal shopper and need a fast intake step with a new client.",
          "You are tracking body changes over time and want a stable shape reference alongside weight or waist alone.",
          "You are curious how your bust-to-hip ratio compares to common categories used in fashion sizing.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Measuring the waist at the belly button.", fix: "The natural waist sits above the navel, at the narrowest point between the lowest rib and the top of the hip bone." },
          { mistake: "Pulling the tape tight to get a smaller number.", fix: "Keep the tape snug but not compressing. A tape that indents the skin is too tight and will skew every ratio." },
          { mistake: "Mixing units between measurements.", fix: "Use inches for all three or centimeters for all three. The math only works when the units match." },
          { mistake: "Treating the shape label as a health screening.", fix: "Body shape is a styling tool. For cardiometabolic risk, use waist-to-hip ratio with the WHO cutoffs and a clinician." },
          { mistake: "Reading one borderline result as your true shape.", fix: "Measurements drift by an inch day to day. Average three measurements per spot before deciding which category is closest." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Bust", definition: "Circumference around the fullest part of the chest, with the tape level across the back." },
          { term: "Natural waist", definition: "Narrowest part of the torso between the lowest rib and the hip bone — usually a finger or two above the navel." },
          { term: "Hip circumference", definition: "Circumference at the widest part of the seat, including the buttocks." },
          { term: "Waist-to-hip ratio (WHR)", definition: "Waist divided by hip circumference — a separate health metric with WHO cutoffs around 0.85 (women) and 0.90 (men)." },
          { term: "Body composition", definition: "What your weight is made of — muscle, fat, bone, water. Different question from shape." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "CDC — Anthropometry Procedures Manual (NHANES)", href: "https://wwwn.cdc.gov/nchs/data/nhanes/2017-2018/manuals/2017_Anthropometry_Procedures_Manual.pdf" },
          { label: "WHO — Waist circumference and waist–hip ratio: report of a WHO expert consultation", href: "https://www.who.int/publications/i/item/9789241501491" },
          { label: "American Council on Exercise — Body Composition Resources", href: "https://www.acefitness.org/resources/everyone/blog/112/what-are-the-guidelines-for-percentage-of-body-fat-loss/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician for production review (general health context, not diagnostic)" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["height-calculator", "max-heart-rate-calculator", "protein-intake-calculator"]} />
    </Container>
  );
}
