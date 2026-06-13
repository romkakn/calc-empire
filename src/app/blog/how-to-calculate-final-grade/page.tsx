import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { Author } from "@/components/eeat/Author";
import { LastReviewed } from "@/components/eeat/LastReviewed";
import { FAQ } from "@/components/eeat/FAQ";
import { References } from "@/components/eeat/References";
import { CommonMistakes } from "@/components/eeat/CommonMistakes";
import { RelatedCalculators } from "@/components/eeat/RelatedCalculators";
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
  jsonLd,
  personSchema,
  type FaqItem,
} from "@/lib/schema";
import { getPostBySlug } from "@/lib/blog";

const POST = getPostBySlug("how-to-calculate-final-grade")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "How do I calculate my final grade with weighted categories?",
    answer:
      "Multiply each category grade by its weight as a decimal, then add the products. If homework is 30% at 88, quizzes are 20% at 92, and the exam is 50% at 80, the final is 0.30 × 88 + 0.20 × 92 + 0.50 × 80 = 84.8. The weights must sum to 1.00 or you&apos;ve missed a column.",
  },
  {
    question: "What grade do I need on the final exam to get an A?",
    answer:
      "Use the target formula: needed = (target − current × (1 − exam weight)) ÷ exam weight. If your pre-exam average is 87, the final is worth 25%, and you want a 90 overall, you need (90 − 87 × 0.75) ÷ 0.25 = 99. That&apos;s the honest answer most students don&apos;t want to hear.",
  },
  {
    question: "How is cumulative GPA different from semester GPA?",
    answer:
      "Semester GPA averages one term&apos;s grade points weighted by credit hours. Cumulative GPA averages every term you&apos;ve completed. Add this semester&apos;s total quality points to your running total, divide by the new total credit hours. One bad semester pulls cumulative down less the further you are into your degree.",
  },
  {
    question: "Can I mix percentages and letter grades in the same formula?",
    answer:
      "Not directly. Convert everything to one scale first. Most schools use a 4.0 GPA scale where A = 4.0, B = 3.0, C = 2.0, or a 100-point scale where A = 93+, B = 83-86, C = 73-76. Pick one, convert all entries, then run the weighted average.",
  },
  {
    question: "What&apos;s the highest possible final grade if I bomb the exam?",
    answer:
      "Plug 0 (or the floor) into the exam slot and run the weighted average. If your pre-exam average is 92 and the final is 30%, the worst case is 0.70 × 92 + 0.30 × 0 = 64.4. That&apos;s your safety net. Anything above 0 on the exam pulls you up from there.",
  },
  {
    question: "Do plus and minus grades change the GPA calculation?",
    answer:
      "Yes, at most colleges. A− is 3.7, B+ is 3.3, B is 3.0, B− is 2.7. Check your school&apos;s catalog because some institutions use straight letters (A = 4.0, B = 3.0) with no plus-minus distinction. The math is the same; only the conversion table changes.",
  },
  {
    question: "How do I calculate my GPA if some classes are pass-fail?",
    answer:
      "Pass-fail courses usually don&apos;t count toward GPA, even though they earn credit. Exclude their grade points from the numerator and exclude their credit hours from the denominator. A &apos;P&apos; doesn&apos;t hurt or help your average; an &apos;F&apos; on a pass-fail is treated like a regular F at most schools.",
  },
  {
    question: "Why is my calculated grade different from what the LMS shows?",
    answer:
      "Three usual causes: a category is dropping the lowest score (so the visible average isn&apos;t the simple average), the syllabus weights don&apos;t match the gradebook setup, or extra credit is bumping things outside the weighted formula. Pull the actual syllabus weights and a full point list, then redo the math.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `/${SLUG_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `/${SLUG_PATH}`,
    type: "article",
    publishedTime: POST.datePublished,
    modifiedTime: POST.dateModified,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: TITLE, path: `/${SLUG_PATH}` },
  ];

  const schemas = [
    articleSchema({
      headline: TITLE,
      slug: SLUG_PATH,
      datePublished: POST.datePublished,
      dateModified: POST.dateModified,
      citations: [
        "https://nces.ed.gov/fastfacts/display.asp?id=51",
        "https://www.ets.org/research/policy_research_reports.html",
        "https://www.aacrao.org/resources/transcripts-records/grading-systems",
        "https://www.collegeboard.org/",
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="mt-2">
        <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
          Education · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          Term 1 was 85, term 2 was 90, the exam is 20%. Final is 86.5. To hit a
          90 you need a 105 on the exam, which means the A is gone and the
          smarter play is to lock in a B+ and stop losing sleep. Three formulas
          handle 95% of the grade questions students ask: weighted average,
          target-grade-on-exam, and cumulative GPA. One worked answer each,
          plus the mistake that wrecks every spreadsheet attempt.
        </p>
      </header>

      <CTACard
        slug="semester-grade-calculator"
        label="Skip the math"
        title="Use our Semester Grade Calculator"
        body="If you'd rather just type in your scores and weights and see the answer, the calculator runs the same formulas this post walks through. The post is here for anyone who wants to understand the math, catch their LMS when it's wrong, and figure out what they actually need on the final."
      />

      <Section id="weighted-average" title="Formula 1: the weighted average">
        <p>
          A weighted average is one multiplication and one addition per
          category. Each category has a grade (your average in it) and a weight
          (its share of the final). Multiply, add, done.
        </p>
        <Formula>
          final = Σ (category<sub>grade</sub> × category<sub>weight</sub>)
        </Formula>
        <p>
          Weights must sum to 1.00 (or 100%). If they don&apos;t, you&apos;ve
          either missed a column or your syllabus has a typo. Both happen more
          than professors admit. The most common syllabus layout is four
          categories: homework, quizzes, midterm, final.
        </p>
        <h3 className="md-title-large mt-6">Worked example: a typical biology class</h3>
        <p>
          Homework averaged 88, quizzes averaged 92, the midterm was an 81, and
          the final exam was a 79. The syllabus weights them 20 / 20 / 25 / 35.
        </p>
        <WorkedSteps
          steps={[
            { label: "Homework contribution", value: "0.20 × 88 = 17.6" },
            { label: "Quizzes contribution", value: "0.20 × 92 = 18.4" },
            { label: "Midterm contribution", value: "0.25 × 81 = 20.25" },
            { label: "Final exam contribution", value: "0.35 × 79 = 27.65" },
            { label: "Final grade (sum)", value: "83.9" },
          ]}
        />
        <p>
          83.9 rounds to a B on a 100-point scale at most US schools. If your
          institution uses plus-minus grading, that&apos;s a straight B (typically
          83-86). The same math works for any class: change the weights, change
          the categories, sum to 1.00, multiply, add.
        </p>
        <p>
          The fastest way to run this for a whole semester is our{" "}
          <Link href="/weighted-grade-calculator">weighted grade calculator</Link>,
          which lets you add as many categories as the syllabus requires and
          flags the weight-sum error before you submit.
        </p>
      </Section>

      <Section id="target-exam" title="Formula 2: what you need on the final exam">
        <p>
          This is the formula students actually search for. You know your grade
          going into the exam, you know the exam&apos;s weight, and you have a
          target letter grade. Algebra solves for the rest.
        </p>
        <Formula>
          needed = (target − current × (1 − exam<sub>weight</sub>)) ÷ exam
          <sub>weight</sub>
        </Formula>
        <p>
          Read it left to right: the score you need on the exam equals your
          target final grade minus the credit your current average already
          guarantees, divided by what percent of the grade the exam controls.
        </p>
        <h3 className="md-title-large mt-6">Worked example: chasing an A in econ</h3>
        <p>
          Your pre-exam average is 87. The final is worth 25% of the grade. You
          want a 90 overall (the A line at your school).
        </p>
        <WorkedSteps
          steps={[
            { label: "Current grade locked in", value: "87 × (1 − 0.25) = 65.25" },
            { label: "Points the exam still controls", value: "target − 65.25" },
            { label: "For a 90 target", value: "90 − 65.25 = 24.75" },
            { label: "Score needed on exam", value: "24.75 ÷ 0.25 = 99" },
          ]}
        />
        <p>
          A 99 on the final. Theoretically possible. Practically, you should
          also run the formula for an 87 (B+) target. That requires a 0.87
          score, or 87, which matches your current average and is realistic.
          The point of running both numbers isn&apos;t to lower your standards;
          it&apos;s to decide where to spend your study hours.
        </p>
        <h3 className="md-title-large mt-10">The floor: what happens if you bomb the exam</h3>
        <p>
          Same formula, plug 0 into the exam slot. With an 87 pre-exam average
          and a 25%-weighted final, your floor is 0.75 × 87 + 0.25 × 0 = 65.25.
          So even a complete blank pulls you to a D. Now you know the worst case
          before you walk in. Most students overestimate how much an exam can
          drag them down, and underestimate how much it can lift them up.
        </p>
      </Section>

      <Section id="gpa-formula" title="Formula 3: cumulative GPA">
        <p>
          GPA stops being percentages and starts being a credit-hour-weighted
          average of grade points. A 3-credit class counts three times as much
          as a 1-credit class in the final number. The conversion table varies
          slightly by institution, but the standard 4.0 scale is the default.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Letter</th>
              <th>Percent</th>
              <th>Grade points</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>A</td><td>93 – 100</td><td>4.0</td></tr>
            <tr><td>A−</td><td>90 – 92</td><td>3.7</td></tr>
            <tr><td>B+</td><td>87 – 89</td><td>3.3</td></tr>
            <tr><td>B</td><td>83 – 86</td><td>3.0</td></tr>
            <tr><td>B−</td><td>80 – 82</td><td>2.7</td></tr>
            <tr><td>C+</td><td>77 – 79</td><td>2.3</td></tr>
            <tr><td>C</td><td>73 – 76</td><td>2.0</td></tr>
            <tr><td>C−</td><td>70 – 72</td><td>1.7</td></tr>
            <tr><td>D</td><td>60 – 69</td><td>1.0</td></tr>
            <tr><td>F</td><td>below 60</td><td>0.0</td></tr>
          </tbody>
        </table>
        <Formula>
          GPA = Σ (grade<sub>points</sub> × credits) ÷ Σ credits
        </Formula>
        <h3 className="md-title-large mt-6">Worked example: a 15-credit semester</h3>
        <p>
          Five classes, 3 credits each. Grades: A, A−, B+, B, C. Convert to
          grade points (4.0, 3.7, 3.3, 3.0, 2.0). Multiply each by 3 credits,
          sum, divide by 15.
        </p>
        <WorkedSteps
          steps={[
            { label: "A in class 1", value: "4.0 × 3 = 12.0 quality points" },
            { label: "A− in class 2", value: "3.7 × 3 = 11.1" },
            { label: "B+ in class 3", value: "3.3 × 3 = 9.9" },
            { label: "B in class 4", value: "3.0 × 3 = 9.0" },
            { label: "C in class 5", value: "2.0 × 3 = 6.0" },
            { label: "Total quality points", value: "48.0" },
            { label: "Semester GPA", value: "48.0 ÷ 15 = 3.20" },
          ]}
        />
        <p>
          To get cumulative GPA, add this semester&apos;s 48 quality points and
          15 credit hours to whatever you had at the start of the term, then
          divide. If you walked in with 105 quality points across 30 credits
          (a 3.50), you walk out with (105 + 48) ÷ (30 + 15) = 153 ÷ 45 = 3.40.
          One semester of 3.2 pulled a 3.5 down to a 3.4. The further you are
          into your degree, the harder it is to move the number in either
          direction.
        </p>
        <p>
          For multi-semester projections (will this term land me on academic
          probation? can I still graduate with honors?), our{" "}
          <Link href="/cumulative-gpa-calculator">cumulative GPA calculator</Link>{" "}
          takes prior credits + the current term and gives you the new number
          plus what you&apos;d need next semester to hit a target.
        </p>
      </Section>

      <Section id="weights-vs-points" title="Don&apos;t mix percentages with raw points">
        <p>
          Half the gradebook arguments at office hours come from this one
          confusion. A category that&apos;s &quot;30% of your grade&quot; isn&apos;t the
          same as a category that&apos;s &quot;300 of the 1000 total points.&quot;
          They produce the same number only if every assignment is identically
          weighted inside the category, which is rare.
        </p>
        <p>
          Two common gradebook styles:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Categorical weights.</strong> Syllabus says 30% homework,
            20% quizzes, 50% exams. Each category&apos;s average is computed
            first, then weighted. A 100 on a 5-point quiz and a 100 on a
            100-point quiz count equally inside the quiz category.
          </li>
          <li>
            <strong>Point totals.</strong> Syllabus says &quot;1000 points
            total: 300 from homework, 200 from quizzes, 500 from exams.&quot; A
            100-point exam counts 20× more than a 5-point quiz. The final
            grade is your earned points divided by 1000.
          </li>
        </ul>
        <p>
          These look identical on paper and produce different answers. If your
          syllabus uses categorical weights, never compute by summing raw
          points. If it uses point totals, never compute by averaging within
          categories first. The mismatch usually surfaces when a student is
          0.5% from a higher letter grade and starts auditing.
        </p>
      </Section>

      <Section id="dropping-scores" title="Handling dropped scores and extra credit">
        <p>
          Most syllabi drop the lowest score in at least one category. That
          changes the average inside the category but doesn&apos;t change the
          category&apos;s weight in the final formula. Compute the in-category
          average without the dropped score, then plug that into the weighted
          average.
        </p>
        <p>
          Extra credit is messier. There are three common patterns:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-2">
          <li>
            <strong>Bonus points inside a category.</strong> Adds to the
            numerator but not the denominator. A 105 on a 100-point quiz lifts
            the quiz average, which lifts the final via the weighted formula.
            Cleanest pattern.
          </li>
          <li>
            <strong>Flat points added to the final.</strong> The professor adds
            2 percentage points to the calculated final grade for attendance
            or a project. Apply this after the weighted average, not inside it.
          </li>
          <li>
            <strong>A separate weighted category.</strong> &quot;Extra credit
            is 5% of the grade.&quot; Now the weights sum to 1.05 and the
            formula still works, you just need to know it. Some instructors
            cap the contribution at the original 100; some don&apos;t.
          </li>
        </ol>
        <p>
          When the LMS-displayed grade disagrees with your hand calculation by
          more than a rounding error, extra credit is the culprit two times out
          of three. Drop policies are the other.
        </p>
      </Section>

      <Section id="grading-scales" title="Grading scales aren&apos;t universal">
        <p>
          A 90 is an A at most US schools. At some, the A line is 93. A few
          institutions use a 10-point scale where 93+ is an A and there are no
          plus or minus grades. A handful of programs (especially nursing,
          pharmacy, and certain engineering tracks) require 75 or 80 to pass
          rather than 60.
        </p>
        <p>
          Some international systems are wildly different. The UK runs a 0-100
          scale where 70+ is a First (the top grade), 60-69 is a 2:1, and 40
          is the pass line. German Gymnasium grades run 1-6 with 1 being best
          and 4 being the pass cutoff. Israeli universities use 0-100 with a
          minimum pass around 60 and honors typically requiring 85+.
        </p>
        <p>
          The math doesn&apos;t change across scales. Weighted average is
          weighted average. What changes is the conversion table and where the
          cutoffs sit. Check your syllabus or registrar before you celebrate
          (or panic) over a number. AACRAO&apos;s grading-systems reference
          covers the 50 states; for everything else, the catalog at your
          institution is the source of truth.
        </p>
      </Section>

      <Section id="when-to-recalculate" title="When to recalculate during the semester">
        <p>
          Three checkpoints catch problems early.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>After the first major exam.</strong> You now have a real
            data point in the heaviest-weighted category. Run the weighted
            average using your current numbers and zeros for everything
            you haven&apos;t taken yet to see your floor.
          </li>
          <li>
            <strong>Two weeks before drop deadline.</strong> If your
            target-on-exam math says you need a 110 to keep a B, the W on
            your transcript is sometimes the smarter move. Talk to your
            advisor before the deadline, not after.
          </li>
          <li>
            <strong>The week before the final.</strong> Run formula 2 for
            three targets: the grade you want, the grade you&apos;d accept,
            and the worst case where you bomb the exam. Now you know exactly
            how much the exam matters and you can budget study time across
            classes accordingly.
          </li>
        </ol>
        <p>
          The single biggest mistake is waiting until grades post to find out
          you were 0.3 points from a higher letter. Three minutes of math
          mid-semester catches that. The{" "}
          <Link href="/semester-grade-calculator">semester grade calculator</Link>{" "}
          handles all three checkpoints in one input form.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Writing weights as whole numbers instead of decimals.",
            fix: "30% means 0.30 in the formula, not 30. If you multiply your 88 homework average by 30, you get 2640 and a final grade that looks like the GDP of a small country. Always convert percent to decimal before multiplying.",
          },
          {
            mistake: "Forgetting the weights have to sum to 1.00.",
            fix: "If your syllabus has 20 + 20 + 25 + 30 = 95%, you&apos;re missing a category. Could be participation, could be a project, could be a syllabus typo. Email the professor before you spend an hour on a formula that&apos;s short a column.",
          },
          {
            mistake: "Computing GPA from percentages directly.",
            fix: "GPA uses grade points (4.0, 3.7, 3.3...) weighted by credit hours, not percentages weighted by themselves. A 92 in a 3-credit class contributes 3.7 × 3 = 11.1 quality points, not 92 × 3.",
          },
          {
            mistake: "Mixing dropped scores into the weighted average wrong.",
            fix: "Drops happen inside a category. Average the surviving scores in the category first, then plug that average into the weighted formula. Don&apos;t drop a score and then re-weight the categories.",
          },
          {
            mistake: "Trusting the LMS &apos;current grade&apos; mid-semester.",
            fix: "Most LMS gradebooks show your average across what&apos;s been graded, not your projected final. If 70% of the weight hasn&apos;t been entered yet, that big-looking number is partial. Run formula 1 yourself with zeros in the empty slots for the real floor.",
          },
          {
            mistake: "Solving for an impossible exam score and giving up.",
            fix: "If you need a 112 on the final to keep an A, the A is gone. That&apos;s not the end of the formula; it&apos;s the start of a better question. Run it again for the next letter grade down. Knowing you only need a 78 for a B+ changes how you study tonight.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "AACRAO: Grading systems by US institution",
            href: "https://www.aacrao.org/resources/transcripts-records/grading-systems",
          },
          {
            label: "NCES: Postsecondary grading and credit-hour standards",
            href: "https://nces.ed.gov/fastfacts/display.asp?id=51",
          },
          {
            label: "ETS Research: Educational assessment policy reports",
            href: "https://www.ets.org/research/policy_research_reports.html",
          },
          {
            label: "College Board: Course credit and GPA guidance",
            href: "https://www.collegeboard.org/",
          },
          {
            label: "US Dept. of Education: Title IV satisfactory academic progress",
            href: "https://studentaid.gov/help-center/answers/article/satisfactory-academic-progress",
          },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={POST.relatedCalcs} />
    </Container>
  );
}

/* ----- small inline helpers, scoped to the post ----- */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="md-headline-small text-[var(--md-sys-color-on-surface)]">
        {title}
      </h2>
      <div className="mt-3 md-body-large max-w-prose text-[var(--md-sys-color-on-surface)] space-y-3">
        {children}
      </div>
    </section>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <Card
      variant="outlined"
      className="my-4 px-4 py-3 font-[var(--md-sys-typescale-mono-font)] md-body-medium"
    >
      {children}
    </Card>
  );
}

function WorkedSteps({ steps }: { steps: { label: string; value: string }[] }) {
  return (
    <ol className="mt-4 space-y-2 list-none">
      {steps.map((s, i) => (
        <li
          key={i}
          className="rounded-[var(--md-sys-shape-corner-sm)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] px-4 py-2 flex justify-between gap-4 md-body-medium"
        >
          <span>{s.label}</span>
          <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
            {s.value}
          </span>
        </li>
      ))}
    </ol>
  );
}

function CTACard({
  slug,
  label,
  title,
  body,
}: {
  slug: string;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <Card variant="filled" className="mt-6 p-5">
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <h2 className="md-title-large mt-1 text-[var(--md-sys-color-on-surface)]">
        <Link
          href={`/${slug}`}
          className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
        >
          {title}
        </Link>
      </h2>
      <p className="md-body-medium mt-2 text-[var(--md-sys-color-on-surface)]">
        {body}
      </p>
    </Card>
  );
}
