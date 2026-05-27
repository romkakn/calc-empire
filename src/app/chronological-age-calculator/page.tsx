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

const SLUG = "chronological-age-calculator";
const TITLE = "Chronological Age Calculator";
const DESC =
  "Compute exact age in years, months, and days between any two dates. Supports corrected age for premature infants (AAP guidance).";

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate my child's age in months?",
    answer:
      "Years × 12 + months gives total months. Our calculator does this automatically — see the Y/M/D output and convert by multiplying years by 12.",
  },
  {
    question: "What is corrected age?",
    answer:
      "Corrected (or adjusted) age subtracts the weeks a baby was born early from their chronological age. The AAP recommends using corrected age for developmental milestones until age 2.",
  },
  {
    question: "Do you count the birthday day or the next day?",
    answer:
      "By convention, a child born on May 27 turns 1 year old on May 27 the following year — not May 28. Our calculator follows the same rule.",
  },
  {
    question: "How is decimal age different from Y/M/D?",
    answer:
      "Decimal age expresses everything as a fraction of a year using 365.25 days. Used in research and in some clinical scales (e.g., growth charts).",
  },
  {
    question: "What's the formula for chronological age in SLP testing?",
    answer:
      "For speech-language pathology tests, subtract DOB from test date with borrowing across months and years. Most standardised tests (e.g., GFTA, CELF, REEL) require Y;M format with M < 12.",
  },
  {
    question: "When do I stop using corrected age?",
    answer:
      "AAP guidance: stop adjusting at 24 months chronological age. Some neonatal-follow-up programs extend to 36 months for extremely preterm infants.",
  },
  {
    question: "How accurate is the calculator across leap years?",
    answer:
      "We use real calendar math (not 30-day months or 365-day years), so February 29 birthdays and leap-year gaps are handled correctly down to the day.",
  },
  {
    question: "Can I use this for pets or for legal age verification?",
    answer:
      "Yes for pets — the math is the same. For legal age verification (driving, voting, insurance), check the specific jurisdiction's rules — most use chronological age but a few use the next birthday.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Years, Months, Days (Corrected for Prematurity)`,
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
      name: "How to calculate chronological age",
      steps: [
        { name: "Enter date of birth", text: "Use ISO format (YYYY-MM-DD) for unambiguous dates." },
        { name: "Enter a reference date", text: "Defaults to today. Use the test/report date for clinical work." },
        { name: "Subtract with borrowing", text: "Subtract years, then months (borrow 12 if needed), then days (borrow from the previous month's day count if needed)." },
        { name: "Adjust for prematurity (if applicable)", text: "Subtract weeks early until age 2, per AAP." },
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

      <Hero title={TITLE} tagline="Exact age in Y/M/D — with optional corrected age for premature infants, per AAP guidance.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A child was born on 2020-03-15. Today is 2026-05-27. What is their chronological age?"
        steps={[
          { label: "Years (2026 − 2020)", value: "6" },
          { label: "Months (May − March)", value: "2" },
          { label: "Days (27 − 15)", value: "12" },
          { label: "Result", value: "6y 2m 12d" },
          { label: "Decimal years (total days ÷ 365.25)", value: "≈ 6.2027" },
        ]}
        result="6 years, 2 months, and 12 days — or ~6.2 decimal years."
      />

      <FormulaExplained
        plainEnglish="Subtract dates the way a calendar reads them: years first, then months (borrowing 12 from years if negative), then days (borrowing from the previous month's day count). Total days is the raw difference in milliseconds divided by a day."
        formula={
          <span>
            Y = ref.year − birth.year
            <br />
            M = ref.month − birth.month (if &lt; 0, borrow 12 from Y)
            <br />
            D = ref.day − birth.day (if &lt; 0, borrow previous-month days from M)
            <br />
            decimal years = total days ÷ 365.25
          </span>
        }
        citation={{
          label: "AAP — Age Terminology During the Perinatal Period",
          href: "https://publications.aap.org/pediatrics/article/114/5/1362/64635/",
        }}
      />

      <WhenToUse
        scenarios={[
          "Determining a child's exact age for a standardised SLP, OT, or psych assessment.",
          "Logging milestones for a preemie using corrected (adjusted) age.",
          "Filling in a school enrolment form that asks for age on a specific cutoff date.",
          "Computing a pet's exact age in human-comparable terms.",
          "Quickly answering 'how old will I be on X date?' for travel, insurance, or legal questions.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating Y;M as a decimal (5;3 ≠ 5.3).", fix: "In SLP and pediatric reports, 5;3 means 5 years, 3 months — not 5.3 years. Our Y/M/D output keeps them separate." },
          { mistake: "Forgetting to subtract prematurity for an infant under 2.", fix: "Per AAP, use corrected age for developmental milestones until 24 months chronological. Our calculator does this when you enter weeks early." },
          { mistake: "Using a 30-day month shortcut.", fix: "Real months range 28–31 days. Our calculator uses the actual previous-month length when borrowing." },
          { mistake: "Off-by-one on leap years.", fix: "365.25 in decimal years handles this on average. For exact days, we use Date math, not a year length constant." },
          { mistake: "Confusing chronological age with developmental age.", fix: "Chronological age is calendar time since birth. Developmental age (assessed) reflects skills — they can diverge and that's the point of milestone tracking." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Corrected age", definition: "Chronological age minus weeks born premature. Used for milestone tracking under age 2." },
          { term: "Gestational age", definition: "Weeks since the mother's last menstrual period. Different from chronological age — chronological starts at birth." },
          { term: "Y;M format", definition: "Years and months separated by a semicolon, used in standardised pediatric assessments." },
          { term: "Decimal age", definition: "Total days ÷ 365.25. Used in growth-chart percentiles and some research." },
          { term: "AAP", definition: "American Academy of Pediatrics — the source of corrected-age guidance." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "AAP — Age Terminology During the Perinatal Period (Pediatrics, 2004)", href: "https://publications.aap.org/pediatrics/article/114/5/1362/64635/" },
          { label: "CDC — Growth Charts and Age in Months", href: "https://www.cdc.gov/growthcharts/index.htm" },
          { label: "ASHA — Standard Scores and Chronological Age in SLP", href: "https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/assessment-tools-techniques-and-data-sources/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-27" />

      <RelatedCalculators slugs={["a1c-calculator", "crcl-calculator", "mortgage-recast-calculator"]} />
    </Container>
  );
}
