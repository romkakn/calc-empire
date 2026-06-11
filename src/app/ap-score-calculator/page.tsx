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

const SLUG = "ap-score-calculator";
const TITLE = "AP Score Calculator";
const DESC =
  "Estimate your AP exam score (1–5) from MCQ and FRQ raw points. Uses College Board section weights and typical curve cutoffs by subject.";

const FAQS: FaqItem[] = [
  {
    question: "How does College Board decide the AP score curve?",
    answer:
      "College Board uses a process called equating. Each year a panel of college faculty reviews the exam difficulty and sets the composite cutoffs so that a 3 on this year's test reflects the same skill as a 3 on past tests. The exact cutoffs are not published, so all online calculators show estimates based on previously released exams.",
  },
  {
    question: "When are AP scores released?",
    answer:
      "Scores come out in early to mid July for exams taken that May. You view them in your College Board account using the same login you used to register. If your school orders a paper report, it arrives later in the summer.",
  },
  {
    question: "What is Score Choice and how does it affect college credit?",
    answer:
      "AP Score Choice lets you decide which exam scores to send to each college. Most colleges grant credit for a 4 or 5, some accept a 3, and a few selective schools want a 5 only. Check each school's AP credit policy on their registrar website before deciding what to send.",
  },
  {
    question: "Is AP credit treated the same as IB credit at most colleges?",
    answer:
      "Not always. Many universities post separate AP and IB credit charts. AP credit is usually awarded per exam, while IB credit often requires the full diploma or a higher-level (HL) score of 5 or above. Always read the school's specific policy.",
  },
  {
    question: "Can I retake an AP exam if I do not like my score?",
    answer:
      "Yes. You can take the same AP exam in any later May administration, but you cannot retake it in the same year. Both scores stay on your record unless you ask College Board to withhold or cancel one.",
  },
  {
    question: "What does it mean to withhold or cancel an AP score?",
    answer:
      "Withholding hides a score from one specific college; you can release it later. Cancelling permanently deletes the score from your record. College Board charges a small fee per withhold request and offers cancellation for free.",
  },
  {
    question: "Is this calculator official?",
    answer:
      "No. College Board does not publish the exact composite-to-1-5 cutoffs. This tool uses published section weights and the cutoff ranges from past released exams, which is the same method AP teachers use for practice tests.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Estimate Your 1–5 AP Score`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Education", path: "/education" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "education", description: DESC }),
    howToSchema({
      name: "How to estimate an AP exam score from raw section points",
      steps: [
        { name: "Pick your AP subject", text: "Section weights differ. AP Calculus AB splits 50/50 between MCQ and FRQ; other subjects use different splits." },
        { name: "Enter raw points", text: "Use the points you earned out of the section maximum, not a percentage." },
        { name: "Compute the weighted composite", text: "composite = MCQ_raw × MCQ_weight + FRQ_raw × FRQ_weight, scaled to a common 100- or 150-point total." },
        { name: "Look up the 1–5 score", text: "Compare the composite to the cutoff bands from the most recent released exam for that subject." },
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

      <Hero title={TITLE} tagline="Plug in your multiple-choice and free-response raw points to project a 1–5 AP score before official results land in July.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student takes AP Calculus AB and earns 30 out of 45 MCQ points and 35 out of 54 FRQ points. What score is likely?"
        steps={[
          { label: "Subject", value: "AP Calculus AB (50% MCQ / 50% FRQ)" },
          { label: "MCQ scaled: (30 / 45) × 54", value: "36.0" },
          { label: "FRQ scaled (already on 54)", value: "35.0" },
          { label: "Composite total (out of 108)", value: "71.0" },
          { label: "Composite cutoff band for a 4 (~63–79)", value: "Score = 4" },
        ]}
        result="A 30/45 MCQ and 35/54 FRQ on AP Calculus AB projects to a composite of about 71, which lands inside the typical 4 band."
      />

      <FormulaExplained
        plainEnglish="Every AP exam has a multiple-choice section and a free-response section. College Board scales each section so the two halves carry the weight described in the official Course and Exam Description, adds them into one composite, and then assigns a 1–5 score using cutoff ranges set each year by a panel of college faculty."
        formula={
          <span>
            composite = MCQ<sub>raw</sub> × MCQ<sub>weight</sub> + FRQ<sub>raw</sub> × FRQ<sub>weight</sub>
            <br />
            score (1–5) = lookup(composite, subject cutoff table)
            <br />
            Example weights — AP Calc AB: MCQ 50%, FRQ 50%
          </span>
        }
        citation={{
          label: "College Board — AP Course and Exam Descriptions (section weighting source)",
          href: "https://apcentral.collegeboard.org/courses",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just finished an AP practice test and want to know roughly where you stand.",
          "You are deciding whether to send a score to a college that requires a 4 or 5.",
          "You are an AP teacher grading practice exams and need a quick projection per student.",
          "You are choosing which AP exams to take next year based on realistic outcomes.",
          "You are weighing a retake against an SAT Subject-style alternative for college credit.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a 50/50 weight for every subject.", fix: "Weights differ. AP English Language is 45% MCQ / 55% FRQ; AP Physics 1 is 50/50; AP Calc BC is 50/50. Always confirm with the current AP Course and Exam Description." },
          { mistake: "Forgetting to subtract for blank or wrong answers.", fix: "AP exams no longer deduct points for wrong MCQ answers. Guess on every question you cannot solve." },
          { mistake: "Treating the cutoff bands as exact.", fix: "College Board does not publish current cutoffs. These calculators use the most recent released exam, so a borderline composite can move up or down a band in any given year." },
          { mistake: "Counting FRQ points by your own rubric.", fix: "FRQ scoring uses the official AP rubric. A self-graded FRQ score is usually one to two points generous." },
          { mistake: "Ignoring the college's AP credit policy.", fix: "A 4 earns credit at most schools, but some Ivy-tier schools only accept a 5 and a handful give no credit at all. Check each school first." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "MCQ", definition: "Multiple-choice questions. One section of every AP exam, machine scored." },
          { term: "FRQ", definition: "Free-response questions. Hand-graded essays or problem sets that make up the other section." },
          { term: "Composite score", definition: "The combined weighted score used to look up the final 1–5 result." },
          { term: "Score Choice", definition: "Option to choose which AP scores get reported to each college." },
          { term: "Equating", definition: "Statistical process College Board uses to keep score meaning consistent across years." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "College Board — AP Central (official course and exam descriptions)", href: "https://apcentral.collegeboard.org/" },
          { label: "College Board — About AP Scores", href: "https://apstudents.collegeboard.org/about-ap-scores" },
          { label: "College Board — AP Score Reporting", href: "https://apstudents.collegeboard.org/getting-your-scores" },
          { label: "College Board — AP Daily for AP Teachers", href: "https://apcentral.collegeboard.org/learning-development/ap-daily" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["sat-score-calculator", "weighted-grade-calculator", "cumulative-gpa-calculator"]} />
    </Container>
  );
}
