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

const SLUG = "semester-grade-calculator";
const TITLE = "Semester Grade Calculator";
const DESC =
  "Find your final semester grade from term grades and exam weight — plus a target-grade solver that tells you the exam score you need.";

const FAQS: FaqItem[] = [
  {
    question: "How are term and exam weights set?",
    answer:
      "Your teacher or syllabus sets them, and the weights always add up to 100%. A common split is 40% per term plus 20% for the final exam, but block schedules, AP courses, and honors classes often weight the exam more heavily.",
  },
  {
    question: "What if my teacher drops the lowest term grade?",
    answer:
      "Enter only the grades that count. If two of three terms are kept at 50% each and the exam is worth nothing, set the dropped term's weight to 0 and split the remaining 100% between the kept terms.",
  },
  {
    question: "Does the mid-term exam carry the same weight as the final?",
    answer:
      "Usually not. Mid-terms are often folded into a term grade (10–20% of that term), while the final exam is broken out separately at 10–25% of the semester. Check your course syllabus for the exact split.",
  },
  {
    question: "How do letter grades line up with the plus/minus scale?",
    answer:
      "A common US scale uses A 93–100, A− 90–92, B+ 87–89, B 83–86, B− 80–82, and so on down through D− 60–62, with anything below 60 a failing F. Some districts use a 10-point straight scale (A 90–100). Check your school's grading handbook.",
  },
  {
    question: "I want an A — what do I need on the final exam?",
    answer:
      "Switch the calculator to Target-grade solver mode and enter the grade you want (typically 90 for an A on a 10-point scale or 93 on a plus/minus scale). The calculator returns the minimum exam score required given your current term grades and the exam weight.",
  },
  {
    question: "How does a semester grade convert to GPA?",
    answer:
      "Most US high schools convert letter grades to a 4.0 scale: A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0. Honors and AP courses usually add 0.5 or 1.0 to the unweighted GPA. Use a high-school or cumulative GPA calculator to convert and combine semesters.",
  },
  {
    question: "Why don't my weights add up to 100?",
    answer:
      "If they don't, the result will be skewed — the calculator shows a warning when the entered weights total less or more than 100%. Adjust the term and exam weights so they sum to exactly 100 before reading the result.",
  },
  {
    question: "Can I use this for college classes?",
    answer:
      "Yes — the math is the same. College syllabi often add more components (homework, participation, papers). For more than two terms plus an exam, use a weighted grade calculator that lets you add arbitrary categories.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Final Exam Grade Solver`,
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
      name: "How to calculate your final semester grade",
      steps: [
        { name: "List each component and its weight", text: "Pull the term grades and final-exam grade from your gradebook. Note each weight from the syllabus — they must total 100%." },
        { name: "Multiply each grade by its weight", text: "Convert each weight to a decimal (40% → 0.4) and multiply by the corresponding grade." },
        { name: "Add the weighted parts", text: "Sum every (grade × weight). That total is your semester grade." },
        { name: "Or solve for the score you need", text: "To hit a target, subtract the term contribution from the target and divide by the exam's weight." },
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

      <Hero title={TITLE} tagline="Compute your final semester grade from two term grades and an exam — or flip it around to find the exam score you need to hit a target.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student has Term 1 = 85 (40% weight), Term 2 = 90 (40%), and a final exam = 80 (20%). What's the semester grade, and what would they need on the exam to finish with a 90?"
        steps={[
          { label: "Term 1 contribution: 85 × 0.40", value: "34.0" },
          { label: "Term 2 contribution: 90 × 0.40", value: "36.0" },
          { label: "Exam contribution: 80 × 0.20", value: "16.0" },
          { label: "Sum", value: "86.0" },
          { label: "Target solver: term contribution so far = 34 + 36", value: "70.0" },
          { label: "Exam needed: (90 − 70) / 0.20", value: "100" },
        ]}
        result="Semester grade is 86. To finish with a 90, the student needs a 100 on the final exam."
      />

      <FormulaExplained
        plainEnglish="A semester grade is a weighted average. Each piece (term grade, exam) is multiplied by its share of the total, then added up. The target-grade solver inverts the formula to tell you what's left to earn."
        formula={
          <span>
            semester = (T<sub>1</sub> × w<sub>1</sub>) + (T<sub>2</sub> × w<sub>2</sub>) + (Exam × w<sub>exam</sub>)
            <br />
            weights are decimals and must sum to 1.00
            <br />
            target solver: Exam<sub>needed</sub> = (target − T<sub>1</sub>w<sub>1</sub> − T<sub>2</sub>w<sub>2</sub>) / w<sub>exam</sub>
          </span>
        }
        citation={{
          label: "NCES — Common Core of Data: high school grading practices in US public schools",
          href: "https://nces.ed.gov/ccd/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You finished term 2 and want to know your semester grade before the final.",
          "You're studying for the final exam and need to know the minimum score that keeps your letter grade.",
          "You're a parent checking that the report card grade matches the syllabus weights.",
          "You're a teacher modeling 'what if' scenarios for students at the borderline between two letter grades.",
          "You're picking which class to put extra study hours into based on what's still movable.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Weights that don't add to 100%.", fix: "Re-check the syllabus and adjust. If a category is dropped, set its weight to 0 and redistribute the rest so the total is exactly 100." },
          { mistake: "Using percentages and decimals together.", fix: "Pick one. The calculator treats the weight field as a percentage (40 means 40%) — don't enter 0.4 there." },
          { mistake: "Assuming the final exam can rescue any grade.", fix: "If the exam is worth 20%, a 100 only moves the semester grade up by the gap × 0.20. The target solver flags exam scores above 100 as impossible." },
          { mistake: "Counting the mid-term twice.", fix: "If the mid-term is already inside your term grade, don't add it as a separate exam line." },
          { mistake: "Mixing scales.", fix: "Make sure all grades use the same 0–100 scale before computing. Don't enter a 3.7 GPA grade alongside numeric grades." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Weighted average", definition: "An average where each value has a different importance (weight). The standard tool for grades that mix term work and exams." },
          { term: "Term (or quarter)", definition: "A grading period inside a semester. Most US semesters contain two terms or quarters." },
          { term: "Final exam", definition: "A cumulative exam at the end of a semester, usually weighted separately from term grades." },
          { term: "Plus/minus grading", definition: "A letter-grade scale that splits each letter into +/− bands (B+, B, B−). Common in US high schools and colleges." },
          { term: "GPA", definition: "Grade Point Average on a 4.0 (or weighted 5.0) scale. Letter grades convert to GPA points before averaging." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NCES — Common Core of Data (CCD), US public school grading and assessment statistics", href: "https://nces.ed.gov/ccd/" },
          { label: "NCES — Digest of Education Statistics", href: "https://nces.ed.gov/programs/digest/" },
          { label: "College Board — Academic Rigor and the AP / SAT research library", href: "https://research.collegeboard.org/" },
          { label: "US Department of Education — Title I and high school accountability", href: "https://www.ed.gov/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["weighted-grade-calculator", "high-school-gpa-calculator", "cumulative-gpa-calculator"]} />
    </Container>
  );
}
