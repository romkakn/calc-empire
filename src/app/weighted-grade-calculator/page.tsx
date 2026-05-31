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

const SLUG = "weighted-grade-calculator";
const TITLE = "Weighted Grade Calculator";
const DESC =
  "Compute your final course grade from weighted categories (homework, exams, etc.). Shows the math and your projected letter grade.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between a weighted and unweighted grade?",
    answer:
      "An unweighted grade is a simple average — every score counts the same. A weighted grade multiplies each score by how much that category matters (e.g., the final is worth 40%, homework only 10%), then divides by the total weight. Most college courses are weighted.",
  },
  {
    question: "Where do I find the weights for my class?",
    answer:
      "Check the syllabus first — there's usually a grading section that lists each category and its percentage. If it's missing, ask the instructor or look on the course site (Canvas, Blackboard, Moodle often show weights in the gradebook settings).",
  },
  {
    question: "What grade do I need on the final to get an A?",
    answer:
      "Subtract your current weighted total from your target, then divide by the final's weight. For example, if you have 82% locked in across 70% of the course and need 90% overall, you need (90 − 0.7 × 82) / 0.3 ≈ 109% — likely not possible. Aim earlier in the term.",
  },
  {
    question: "How does dropping the lowest score work?",
    answer:
      "Some instructors drop your lowest quiz or homework grade before averaging that category. To model it, remove the lowest score from that group and recalculate the category average, then plug the new number into the weighted formula.",
  },
  {
    question: "What is a plus/minus grading scale?",
    answer:
      "It splits each letter into three bands — A−, A, A+ — so a 91% is an A− and a 98% is an A+. Cutoffs are set by the school registrar and vary, so always check your institution's policy before relying on the letter shown here.",
  },
  {
    question: "How do I handle pass/fail courses?",
    answer:
      "Pass/fail courses usually don't factor into your weighted GPA at all, but they may still count toward credit hours. Check your registrar's policy — some schools count a P as a C-equivalent for prerequisites.",
  },
  {
    question: "Does extra credit change the calculation?",
    answer:
      "Yes — extra credit can either add points to a specific category (raising that category's average) or add a flat bonus to your final percentage. Treat it the same way the syllabus does: as part of an existing weight, or as a separate small-weight bucket.",
  },
  {
    question: "Is a weighted grade the same as a GPA?",
    answer:
      "No. A weighted course grade is your percentage in one class. A GPA averages your letter grades across every class, typically on a 4.0 scale. Use a GPA calculator after you have final letter grades for each course.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Final Grade From Weighted Categories`,
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
      name: "How to calculate a weighted course grade",
      steps: [
        { name: "List your categories", text: "From the syllabus, write down each grade bucket — homework, quizzes, midterm, final, project — and its weight." },
        { name: "Enter your score for each", text: "Use your current percentage in each category. For a category you have not started yet, plug in your target." },
        { name: "Multiply and sum", text: "Multiply each percentage by its weight, add the results together, then divide by the sum of the weights." },
        { name: "Compare to the letter scale", text: "Match the final percentage to your school's letter cutoffs. Plus/minus scales vary by institution." },
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

      <Hero title={TITLE} tagline="Add each category from your syllabus, enter your scores, and see your projected final grade with the math laid out.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student has three categories: Homework averaging 85% (worth 30%), a Midterm of 90% (worth 40%), and a Final of 78% (worth 30%). What is the course grade?"
        steps={[
          { label: "Formula: final = sum(grade × weight) / sum(weight)", value: "" },
          { label: "Homework: 85 × 30", value: "2550" },
          { label: "Midterm: 90 × 40", value: "3600" },
          { label: "Final: 78 × 30", value: "2340" },
          { label: "Weighted sum: 2550 + 3600 + 2340", value: "8490" },
          { label: "Divide by total weight (100)", value: "84.9" },
        ]}
        result="Final grade: 84.9% — a B on a standard A–F scale."
      />

      <FormulaExplained
        plainEnglish="Each category in your class carries a different share of the final grade. Multiply your percentage in each category by how much it is worth, add those products up, then divide by the total weight. The divisor lets you use percentages (totaling 100) or raw points interchangeably."
        formula={
          <span>
            final = ( g<sub>1</sub>·w<sub>1</sub> + g<sub>2</sub>·w<sub>2</sub> + … + g<sub>n</sub>·w<sub>n</sub> ) / ( w<sub>1</sub> + w<sub>2</sub> + … + w<sub>n</sub> )
            <br />
            where g<sub>i</sub> is your percentage in category i and w<sub>i</sub> is its weight.
          </span>
        }
        citation={{
          label: "U.S. Department of Education, NCES — Common Core of Data: high school grading practices",
          href: "https://nces.ed.gov/ccd/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You want to know where you stand mid-term before the final exam.",
          "You're deciding how much to study for an upcoming assignment based on its weight.",
          "Your syllabus lists category percentages and you want to verify the gradebook math.",
          "You're projecting an end-of-term grade using current category averages.",
          "A teacher or TA is showing students how each category contributes to the final number.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Adding the weights wrong (e.g., totaling 110% by accident).", fix: "Add the weight column first and confirm it matches the syllabus before trusting the result." },
          { mistake: "Averaging the category averages directly.", fix: "That treats every category as equally important. Multiply each by its weight first." },
          { mistake: "Forgetting categories you have not started yet.", fix: "Include zero-graded categories or plug in a target so the projection reflects what's still ahead." },
          { mistake: "Using the wrong letter scale.", fix: "Plus/minus cutoffs differ by school. Check your registrar's published policy before quoting a letter grade." },
          { mistake: "Mixing percentages and raw points carelessly.", fix: "Either keep everything as percentages on the same 0–100 scale, or convert all categories to raw points first." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Weight", definition: "How much a category counts toward the final grade, usually expressed as a percentage." },
          { term: "Category average", definition: "Your mean score across all assignments inside one weight bucket (e.g., all homework)." },
          { term: "Plus/minus scale", definition: "A grading scheme that splits each letter into three bands (A−, A, A+)." },
          { term: "Target grade", definition: "The percentage you need on a remaining assignment to reach a desired overall grade." },
          { term: "Cumulative GPA", definition: "A weighted average of letter grades across multiple courses, typically on a 4.0 scale." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "U.S. Department of Education, NCES — Common Core of Data", href: "https://nces.ed.gov/ccd/" },
          { label: "College Board — AP Course and Exam Score Information", href: "https://apcentral.collegeboard.org/courses/resources/about-ap-scores" },
          { label: "University of Washington Registrar — Grading System", href: "https://registrar.washington.edu/students/grading-system/" },
          { label: "Purdue University Registrar — Grade Information", href: "https://www.purdue.edu/registrar/currentStudents/students/gradesTrans.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["cumulative-gpa-calculator", "high-school-gpa-calculator", "rounding-calculator"]} />
    </Container>
  );
}
