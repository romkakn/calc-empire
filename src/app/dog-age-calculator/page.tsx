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

const SLUG = "dog-age-calculator";
const TITLE = "Dog Age Calculator";
const DESC =
  "Convert your dog's age to human years using the modern epigenetic-clock formula or the classic 7x rule for comparison.";

const FAQS: FaqItem[] = [
  {
    question: "Why is the old 'multiply by 7' rule wrong?",
    answer:
      "The 7x rule assumes dogs age at a steady pace, but they don't. Puppies mature very fast in the first two years, then aging slows down. A 1-year-old dog is closer to a 15-year-old human than a 7-year-old.",
  },
  {
    question: "What is the epigenetic clock for dogs?",
    answer:
      "Researchers at UC San Diego measured DNA methylation patterns in Labrador Retrievers and compared them to human samples. The result is a logarithmic curve that maps dog age to human age much better than a linear rule. The formula was published in Cell Systems in 2019.",
  },
  {
    question: "Do small dogs really live longer than large dogs?",
    answer:
      "Yes. Small breeds often reach 14–16 years, while giant breeds like Great Danes average 7–10. Large dogs grow faster, which appears to speed up cellular aging. Use the formula as a starting point, then adjust your expectations down for giant breeds.",
  },
  {
    question: "When is a dog considered a senior?",
    answer:
      "AAHA's life-stage guidelines call most dogs senior in the last 25% of expected lifespan. For a medium-size dog that lands around age 7–9. Giant breeds may be seniors by age 5–6.",
  },
  {
    question: "How often should my dog see a vet?",
    answer:
      "Puppies need monthly visits during vaccination rounds. Healthy adults visit yearly. Seniors should switch to every 6 months so blood work catches issues earlier.",
  },
  {
    question: "How much do puppy years count?",
    answer:
      "A lot. By age 1 most dogs have hit the human equivalent of about 15 years, and by age 2 they are roughly 24 in human years. After that the curve flattens — each calendar year adds 4–5 human years.",
  },
  {
    question: "Does diet or exercise change how my dog ages?",
    answer:
      "It does. Lean body weight, dental care, and steady exercise extend healthy lifespan in dogs the same way they do in people. The Dog Aging Project at the University of Washington is collecting long-term data on this.",
  },
  {
    question: "What about cats — same formula?",
    answer:
      "No. Cats age fast in the first two years (about 24 human years), then add 4 human years per cat year. A 5-year-old cat is roughly 36 in human years. The dog epigenetic formula does not apply to cats.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Epigenetic Clock & 7x Rule`,
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
      name: "How to convert dog years to human years",
      steps: [
        { name: "Enter your dog's age", text: "Use the calendar age in years. Months work too — enter 0.5 for a 6-month-old puppy." },
        { name: "Pick a formula", text: "The epigenetic clock matches biological aging. The 7x rule is the old shortcut, kept for comparison." },
        { name: "Apply the math", text: "Epigenetic: human age = 16 × ln(dog age) + 31. Classic: human age = dog age × 7." },
        { name: "Adjust for breed size", text: "Small breeds age slower than the formula suggests; giant breeds age faster. Use the size note as a sanity check." },
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

      <Hero title={TITLE} tagline="See your dog's age in human years using the formula vets actually trust — not the old 7x rule.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A 5-year-old dog. How old is that in human years using the epigenetic clock?"
        steps={[
          { label: "Formula: human age = 16 × ln(dog age) + 31", value: "" },
          { label: "Natural log of 5", value: "1.609" },
          { label: "Multiply by 16", value: "25.75" },
          { label: "Add 31", value: "56.75" },
          { label: "Rounded", value: "56.7 human years" },
        ]}
        result="A 5-year-old dog is about 56.7 in human years. The old 7x rule would say 35 — off by more than 20 years."
      />

      <FormulaExplained
        plainEnglish="Dogs do not age in a straight line. They sprint through puppyhood, then aging slows. The epigenetic clock — built from DNA methylation patterns in 100+ Labrador Retrievers compared to human samples — captures that curve."
        formula={
          <span>
            Epigenetic: human age = 16 × ln(dog age in years) + 31
            <br />
            Classic (for comparison): human age = dog age × 7
            <br />
            ln() is the natural logarithm.
          </span>
        }
        citation={{
          label: "Wang T, et al. — Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome (Cell Systems, 2020)",
          href: "https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9",
        }}
      />

      <WhenToUse
        scenarios={[
          "You adopted a dog and want a quick read on what 'middle-aged' means for them.",
          "You're planning vet visits and need to know when senior care should start.",
          "You're explaining to kids why the 7x rule from school is outdated.",
          "You're comparing two dogs of different ages to set realistic energy expectations.",
          "You're a breeder or trainer setting age-appropriate milestones for clients.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Trusting the 7x rule for any dog over 2 years old.", fix: "The rule overshoots puppies and undershoots adults. Use the epigenetic formula instead." },
          { mistake: "Using the same formula for a Chihuahua and a Great Dane.", fix: "Body size shifts the curve. Giant breeds age 1.5–2x faster in the senior years; small breeds age slower." },
          { mistake: "Skipping senior screenings because the dog 'seems fine'.", fix: "Blood work and a dental check every 6 months past age 7 catch kidney, thyroid, and dental issues early." },
          { mistake: "Counting a 6-month-old puppy as a baby in human years.", fix: "Dogs hit puberty by 6–9 months. In human terms that's already a young teenager." },
          { mistake: "Treating the number as medical advice.", fix: "The calculator is a translation tool. Health decisions need a licensed veterinarian who knows your dog." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Epigenetic clock", definition: "A biological-age estimate built from DNA methylation patterns rather than calendar years." },
          { term: "DNA methylation", definition: "Chemical tags on DNA that change with age. The pattern is the basis of the epigenetic clock." },
          { term: "Life stage", definition: "AAHA grouping: puppy, young adult, mature adult, senior, geriatric. Drives vet care recommendations." },
          { term: "Lifespan", definition: "Total years lived. Varies from ~7 (giant breeds) to ~16 (small breeds)." },
          { term: "Healthspan", definition: "Years lived in good health, without chronic disease. The Dog Aging Project is the main long-term study." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Wang T et al. — Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome (Cell Systems, 2020)", href: "https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9" },
          { label: "AAHA — Canine Life Stage Guidelines (2019)", href: "https://www.aaha.org/aaha-guidelines/life-stage-canine-2019/life-stage-canine-2019/" },
          { label: "American Veterinary Medical Association — Selecting a Pet & Senior Pet Care", href: "https://www.avma.org/resources-tools/pet-owners/petcare/senior-pet-care-faq" },
          { label: "Dog Aging Project — University of Washington", href: "https://dogagingproject.org/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed veterinarian for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["chronological-age-calculator", "a1c-calculator", "protein-intake-calculator"]} />
    </Container>
  );
}
