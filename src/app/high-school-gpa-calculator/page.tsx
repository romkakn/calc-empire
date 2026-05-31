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

const SLUG = "high-school-gpa-calculator";
const TITLE = "High School GPA Calculator";
const DESC =
  "Convert your letter grades + credit hours into a US high-school GPA on a 4.0 scale. Optional weighted boost for Honors/AP/IB.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between weighted and unweighted GPA?",
    answer:
      "Unweighted GPA caps every class at 4.0 — an A is an A whether it's PE or AP Chemistry. Weighted GPA adds a bonus for harder classes (usually +0.5 for Honors and +1.0 for AP/IB), so top students can land above 4.0. Most US high schools report both numbers on the transcript.",
  },
  {
    question: "Why do colleges recalculate my GPA?",
    answer:
      "Schools weight courses differently and grade on different curves, so admissions offices rebuild a common GPA from your transcript. Many recalculate as core-academic-only (English, math, science, social studies, foreign language) and strip PE or electives. The UC system, for example, uses its own a–g course list and capped-honors weight.",
  },
  {
    question: "Is a 4.0 GPA the maximum?",
    answer:
      "On the standard unweighted 4.0 scale, yes. On a weighted 5.0 scale a perfect transcript of AP courses can reach 5.0 (or higher in districts that weight differently). Always check which scale your school reports.",
  },
  {
    question: "Do plus/minus grades matter, or just A/B/C?",
    answer:
      "It depends on the district. Schools that use plus/minus grading typically map A- to 3.7 and B+ to 3.3, so a transcript full of A- grades lands at 3.7, not 4.0. Schools using straight letters treat any A as 4.0.",
  },
  {
    question: "Should PE and electives count in my GPA?",
    answer:
      "Your school's official GPA usually includes every graded class, including PE and electives. Many colleges, though, recalculate an academic-only GPA from the five core subjects. Check the school's admissions page to see which version they use.",
  },
  {
    question: "What's the difference between mid-year and end-of-year GPA?",
    answer:
      "Mid-year GPA only counts semester-one grades for the current year, while end-of-year GPA averages both semesters. College applications usually ask for cumulative GPA through the most recent completed semester, plus a mid-year report once second-semester grades close.",
  },
  {
    question: "How big is the AP/IB bonus in different districts?",
    answer:
      "The most common rule is +1.0 for AP/IB and +0.5 for Honors, but some districts only add +0.5 for AP, and a handful add nothing at all. Check your school's grading policy — the bonus shifts a 3.7 unweighted GPA to anywhere between 3.85 and 4.7 weighted.",
  },
  {
    question: "What's the fastest way to raise my GPA?",
    answer:
      "Earlier-grade courses count just as much as senior-year ones, so the math gets harder once you have many credits banked. The quickest moves: turn current C grades into B grades, retake any course with a D or F if your school allows replacement, and avoid dropping out of weighted classes mid-year.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Weighted & Unweighted 4.0 Scale`,
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
      name: "How to calculate your high school GPA",
      steps: [
        { name: "List every course", text: "Write down each class for the term — include PE, electives, and any pass/fail courses you want to count." },
        { name: "Convert letters to points", text: "A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0 on the standard US 4.0 scale." },
        { name: "Apply weighting if you want", text: "Add +0.5 to each Honors course point and +1.0 to each AP or IB course point before multiplying by credits." },
        { name: "Divide weighted points by total credits", text: "Sum (grade points × credit hours) for every course, then divide by the sum of credit hours. The result is your GPA." },
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

      <Hero title={TITLE} tagline="Drop in your letter grades and credit hours, pick weighted or unweighted, and see your GPA on the standard US 4.0 scale.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A sophomore takes four classes this semester: A in English (1 credit, regular), B+ in Honors Algebra II (1 credit), A- in AP US History (1 credit), B in PE (0.5 credit)."
        steps={[
          { label: "Convert letters to points", value: "4.0 · 3.3 · 3.7 · 3.0" },
          { label: "Unweighted points × credits", value: "4.0·1 + 3.3·1 + 3.7·1 + 3.0·0.5 = 12.5" },
          { label: "Total credit hours", value: "1 + 1 + 1 + 0.5 = 3.5" },
          { label: "Unweighted GPA = 12.5 / 3.5", value: "3.571" },
          { label: "Add Honors (+0.5) and AP (+1.0) bonuses", value: "4.0·1 + 3.8·1 + 4.7·1 + 3.0·0.5 = 14.0" },
          { label: "Weighted GPA = 14.0 / 3.5", value: "4.000" },
        ]}
        result="Unweighted GPA: 3.571 on a 4.0 scale. Weighted GPA with +0.5 Honors and +1.0 AP bonuses: 4.000."
      />

      <FormulaExplained
        plainEnglish="A GPA is a credit-weighted average of your grade points. Letter grades convert to numbers, each course's points get multiplied by its credit hours (so a year-long class counts more than a half-year elective), and the total is divided by the total credit hours."
        formula={
          <span>
            Letter → points: A=4.0, A−=3.7, B+=3.3, B=3.0, B−=2.7, C+=2.3, C=2.0, C−=1.7, D+=1.3, D=1.0, F=0
            <br />
            Weighted bonus: Honors +0.5, AP/IB +1.0 (per course, capped at 5.0)
            <br />
            GPA = Σ(points × credits) / Σ(credits)
          </span>
        }
        citation={{
          label: "College Board — How to Convert Your GPA to a 4.0 Scale (AP & weighted guidance)",
          href: "https://bigfuture.collegeboard.org/plan-for-college/your-high-school-record/how-to-convert-gpa-4.0-scale",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just got a report card and want to know your GPA before the transcript posts.",
          "You're filling out a college application and the form asks for both weighted and unweighted GPA.",
          "You're picking next semester's schedule and want to see how an AP class changes your weighted number.",
          "You're a parent checking that the school's printed GPA matches the grades on the report card.",
          "You're a counselor walking a student through how a retake or grade replacement would move the average.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Averaging GPAs across semesters instead of recomputing.", fix: "Always sum the raw points and credits from every course — a 3.5 plus a 3.0 is not a 3.25 once you account for different credit loads." },
          { mistake: "Forgetting that A− is 3.7, not 4.0.", fix: "On plus/minus scales the dash drops your points. Use the lookup in the calculator instead of estimating." },
          { mistake: "Applying the weighted bonus to every course.", fix: "Only Honors, AP, and IB courses get the boost. Regular classes stay on the 4.0 scale." },
          { mistake: "Counting credit hours as 1 for every course.", fix: "Half-credit classes (PE, study skills, semester electives) should be 0.5 — otherwise short classes carry the same weight as year-long ones." },
          { mistake: "Comparing your school's weighted GPA to a college's published averages.", fix: "Admissions GPAs are usually recalculated unweighted from core academic courses. Check the school's methodology before reading too much into the gap." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "GPA", definition: "Grade Point Average — a credit-weighted average of letter-grade points on a 4.0 (or 5.0 weighted) scale." },
          { term: "Credit hour", definition: "A unit of how much a course counts in your GPA. A full-year academic class is usually 1.0; a one-semester elective is often 0.5." },
          { term: "Honors course", definition: "A more demanding version of a standard high-school class. Most districts add +0.5 to weighted GPA points." },
          { term: "AP / IB course", definition: "Advanced Placement or International Baccalaureate. Most districts add +1.0 to weighted GPA points." },
          { term: "Cumulative GPA", definition: "Your GPA averaged across every course you've taken in high school, not just one term." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "College Board BigFuture — How to Convert Your GPA to a 4.0 Scale", href: "https://bigfuture.collegeboard.org/plan-for-college/your-high-school-record/how-to-convert-gpa-4.0-scale" },
          { label: "NCES — High School Transcript Study (HSTS) Methodology and Data", href: "https://nces.ed.gov/surveys/hst/" },
          { label: "NACAC — State of College Admission Report", href: "https://www.nacacnet.org/research/research-data/" },
          { label: "University of California — How GPA is Calculated for Freshman Admission", href: "https://admission.universityofcalifornia.edu/admission-requirements/freshman-requirements/gpa-requirement.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["cumulative-gpa-calculator", "weighted-grade-calculator", "rounding-calculator"]} />
    </Container>
  );
}
