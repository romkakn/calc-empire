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

const SLUG = "cumulative-gpa-calculator";
const TITLE = "Cumulative GPA Calculator";
const DESC =
  "Roll up semester GPAs into a cumulative GPA weighted by credit hours. Plus the GPA boost you would need next term.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between cumulative GPA and major GPA?",
    answer:
      "Cumulative GPA averages every graded course on your transcript, weighted by credit hours. Major GPA only counts the courses in your declared major. Graduate programs and employers often look at both.",
  },
  {
    question: "How does retaking a course change my cumulative GPA?",
    answer:
      "It depends on your school's grade-replacement policy. Some registrars replace the old grade entirely; others keep both grades on the transcript and average them. Check your registrar's policy before assuming a retake will erase a low grade.",
  },
  {
    question: "Do transfer credits count toward my cumulative GPA?",
    answer:
      "Usually not. Most US universities accept the credit hours but exclude the transfer grades from the GPA calculation. Your new school's GPA only reflects courses taken there.",
  },
  {
    question: "What is the difference between weighted and unweighted GPA?",
    answer:
      "Unweighted GPA caps every course at 4.0. Weighted GPA gives extra points (often 0.5 or 1.0) for honors, AP, or IB courses, so a 5.0 is possible. College admissions offices typically recalculate using their own scale.",
  },
  {
    question: "Can I recover from one bad semester?",
    answer:
      "Yes, especially early in your degree. The math gets harder as you accumulate credits because each new semester is a smaller share of the total. Use the boost calculator above to see what GPA you would need next term to hit a target.",
  },
  {
    question: "What cumulative GPA do graduate schools want?",
    answer:
      "Most US graduate programs set a 3.0 minimum, with competitive programs expecting 3.5 or higher. Top law and medical schools often look for 3.7 plus. Standardized test scores, research, and recommendations can offset a lower GPA.",
  },
  {
    question: "How does a course withdrawal (W) affect my GPA?",
    answer:
      "A W does not factor into your GPA at most schools because no grade is assigned. It does show on your transcript, and too many Ws can raise questions with admissions committees or financial aid offices.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Weighted by Credit Hours`,
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
      name: "How to calculate cumulative GPA across semesters",
      steps: [
        { name: "List each semester", text: "Write down the GPA you earned each term and the number of graded credit hours you took that term." },
        { name: "Multiply GPA by credits", text: "For every row, multiply the semester GPA by the credit hours. This gives quality points for that term." },
        { name: "Sum and divide", text: "Add up all the quality points, then divide by the total credit hours across every semester." },
        { name: "Plan the next term", text: "Enter a target GPA and the credits you plan to take next term to see the GPA you would need to hit that target." },
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

      <Hero title={TITLE} tagline="Combine semester GPAs into one weighted cumulative number — and see what you need next term to hit a target.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A junior has finished three semesters: 3.5 in 15 credits, 3.2 in 16 credits, and 3.8 in 14 credits. What is the cumulative GPA, and what GPA does she need next term in 15 credits to reach a 3.6 cumulative?"
        steps={[
          { label: "Quality points term 1: 3.5 × 15", value: "52.5" },
          { label: "Quality points term 2: 3.2 × 16", value: "51.2" },
          { label: "Quality points term 3: 3.8 × 14", value: "53.2" },
          { label: "Total quality points: 52.5 + 51.2 + 53.2", value: "156.9" },
          { label: "Total credits: 15 + 16 + 14", value: "45" },
          { label: "Cumulative GPA: 156.9 / 45", value: "3.487" },
          { label: "Required next-term GPA: (3.6 × 60 − 156.9) / 15", value: "3.94" },
        ]}
        result="Cumulative GPA is 3.487. To raise it to 3.6 across 15 more credits, she needs about a 3.94 next term — tough but not impossible."
      />

      <FormulaExplained
        plainEnglish="Cumulative GPA is a credit-weighted average. A 4.0 in a 1-credit lab matters less than a 4.0 in a 4-credit lecture. The same idea works in reverse: to plan the GPA you need next term, you set the cumulative you want and back out the answer."
        formula={
          <span>
            Cumulative GPA = Σ (semester GPA × credits) / Σ credits
            <br />
            Required GPA<sub>next</sub> = ((target × (totalCredits + n)) − (current × totalCredits)) / n
            <br />
            where n is the number of new credits next term
          </span>
        }
        citation={{
          label: "NCES IPEDS — Glossary entry for grade point average (cumulative)",
          href: "https://nces.ed.gov/ipeds/report-your-data/data-tip-sheet-reporting-graduation-rates",
        }}
      />

      <WhenToUse
        scenarios={[
          "You finished a semester and want to roll the new grades into your overall GPA before transcripts post.",
          "You are applying to graduate, law, or medical school and need to check where you stand against a stated minimum.",
          "You are choosing whether to retake a low-grade course or push forward with a strong next semester.",
          "You are an academic advisor running quick what-if scenarios with a student in office hours.",
          "You are a parent or student planning course loads to keep a scholarship GPA threshold.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Averaging semester GPAs as a plain mean.", fix: "A semester with 18 credits weighs more than one with 9. Always multiply by credits before averaging." },
          { mistake: "Including pass/fail or transfer credits in the GPA math.", fix: "Pass/fail courses have no grade points. Most schools also exclude transfer grades. Count only graded courses from the same institution." },
          { mistake: "Assuming a retake erases the old grade.", fix: "Many schools keep both the original and the retake in the GPA. Read your registrar's grade-replacement policy first." },
          { mistake: "Forgetting that withdrawals do not change GPA but do show on the transcript.", fix: "A W keeps your GPA flat, but a string of them looks weak to admissions committees and can affect financial aid." },
          { mistake: "Setting an unreachable target.", fix: "If the required next-term GPA comes out above 4.0, the target is mathematically out of reach in one term. Stretch the plan over more semesters or lower the target." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Quality points", definition: "The product of a course's grade points and its credit hours. The numerator in the GPA formula." },
          { term: "Credit hour", definition: "The unit a course is worth. A typical US semester course is 3 or 4 credit hours." },
          { term: "Grade-replacement policy", definition: "A registrar rule that says whether a retaken course replaces the original grade in the GPA or averages with it." },
          { term: "Major GPA", definition: "A GPA computed using only courses in the declared major or required for it." },
          { term: "Latin honors", definition: "Cumulative GPA thresholds — typically cum laude, magna cum laude, summa cum laude — used at graduation." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NCES IPEDS — Grade point average definitions and reporting guidance", href: "https://nces.ed.gov/ipeds/report-your-data/data-tip-sheet-reporting-graduation-rates" },
          { label: "American Council on Education — Policy briefs on credit and transfer", href: "https://www.acenet.edu/Research-Insights/Pages/Student-Support/Transfer.aspx" },
          { label: "MIT Registrar — Grades and grade point average policy", href: "https://registrar.mit.edu/registration-academics/academic-policies-procedures/grades" },
          { label: "University of Michigan Registrar — GPA calculation guide", href: "https://ro.umich.edu/calendars/transcripts/gpa" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["weighted-grade-calculator", "high-school-gpa-calculator", "rounding-calculator"]} />
    </Container>
  );
}
