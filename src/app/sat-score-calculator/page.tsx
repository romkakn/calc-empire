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

const SLUG = "sat-score-calculator";
const TITLE = "SAT Score Calculator";
const DESC =
  "Estimate your SAT composite score from EBRW and Math raw correct counts using a College Board average scaled-score curve.";

const FAQS: FaqItem[] = [
  {
    question: "How is the digital SAT scored?",
    answer:
      "The digital SAT is multistage adaptive. Your performance on the first module of each section determines whether the second module is easier or harder, and your scaled section score reflects both modules. The composite is still EBRW (200–800) plus Math (200–800), for a total range of 400–1600.",
  },
  {
    question: "What is the SAT score range?",
    answer:
      "The composite SAT ranges from 400 to 1600. Each section (EBRW and Math) is scored from 200 to 800, in 10-point steps.",
  },
  {
    question: "What is a good SAT percentile?",
    answer:
      "A 1200 composite is roughly the 75th percentile nationally, meaning you scored higher than about three quarters of test takers. A 1400 is about the 94th percentile, and a 1500 is about the 98th. Selective colleges typically expect 1400 or higher.",
  },
  {
    question: "How do SAT and ACT scores compare?",
    answer:
      "The College Board and ACT publish a concordance table that maps scores between tests. As a rough guide, an SAT 1200 maps to an ACT 25, an SAT 1400 maps to an ACT 31, and an SAT 1500 maps to an ACT 34. Use the official concordance for college applications.",
  },
  {
    question: "What is SAT superscoring?",
    answer:
      "Superscoring means a college takes your highest EBRW score from any test date and your highest Math score from any test date, then adds them for a new composite. Many colleges superscore the SAT, which can raise your reported score if you take the test more than once.",
  },
  {
    question: "What is Score Choice?",
    answer:
      "Score Choice lets you pick which SAT test dates you send to colleges. Some colleges require you to send all scores; check each college's policy before applying.",
  },
  {
    question: "Why does the scaled score change between test dates?",
    answer:
      "The College Board equates each test form so that a given scaled score reflects the same ability across dates. This means the raw-to-scaled curve shifts slightly: a tougher form needs fewer raw correct for the same scaled score, and an easier form needs more.",
  },
  {
    question: "Does this calculator give an official score?",
    answer:
      "No. It uses an average raw-to-scaled curve to estimate a likely composite. Your actual score depends on the specific form's equating table, which only the College Board publishes after each test.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — EBRW + Math to 1600 Composite`,
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
      name: "How to estimate your SAT composite score",
      steps: [
        { name: "Count EBRW raw correct", text: "Add up the questions you answered correctly across the Reading and Writing modules (out of 96 on the digital SAT)." },
        { name: "Count Math raw correct", text: "Add up the questions you answered correctly across both Math modules (out of 58 on the digital SAT)." },
        { name: "Apply the scaled-score curve", text: "Map each raw score to a 200–800 scaled score using an average curve. The College Board publishes the exact curve per test form." },
        { name: "Add the section scores", text: "Composite = EBRW scaled + Math scaled, giving a total from 400 to 1600." },
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

      <Hero title={TITLE} tagline="Enter your raw correct counts and get an estimated 400–1600 SAT composite using an average College Board curve.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student takes a digital SAT practice test. They get 80 out of 96 EBRW questions correct and 50 out of 58 Math questions correct. What composite should they expect?"
        steps={[
          { label: "EBRW raw correct", value: "80 / 96" },
          { label: "Map EBRW to average scaled score", value: "~ 720" },
          { label: "Math raw correct", value: "50 / 58" },
          { label: "Map Math to average scaled score", value: "~ 700" },
          { label: "Composite = EBRW + Math", value: "720 + 700" },
        ]}
        result="Estimated SAT composite ~ 1420. The actual score depends on the equating curve for that specific test form."
      />

      <FormulaExplained
        plainEnglish="Each SAT section converts raw correct answers into a 200–800 scaled score using a curve set by the College Board. The composite is just the two section scores added together. Because every test form is equated, the same raw count can scale slightly higher on a harder form and slightly lower on an easier one."
        formula={
          <span>
            EBRW scaled = curve(EBRW raw correct), range 200–800
            <br />
            Math scaled = curve(Math raw correct), range 200–800
            <br />
            SAT composite = EBRW scaled + Math scaled, range 400–1600
          </span>
        }
        citation={{
          label: "College Board — Understanding SAT Scores",
          href: "https://satsuite.collegeboard.org/sat/scores/understanding-scores",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just finished a digital SAT practice test and want a quick composite estimate.",
          "You are comparing practice tests across providers to see if your score is trending up.",
          "You are setting a target score for college applications and want to know what raw counts you need.",
          "You are a tutor or teacher giving students a quick read on a practice diagnostic.",
          "You are deciding whether to retake the SAT and want to model the raw-correct change that would lift your composite.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating an estimated score as an official score.", fix: "Only the College Board's equating table for your exact test form produces a real score. Use this estimate for direction, not for college reporting." },
          { mistake: "Subtracting points for wrong answers.", fix: "The SAT has no guessing penalty. Only correct answers count toward your raw score, so always answer every question." },
          { mistake: "Ignoring the adaptive second module on the digital SAT.", fix: "On the digital test, the second module's difficulty depends on the first. Your scaled score reflects both modules, not just raw count." },
          { mistake: "Mixing paper SAT and digital SAT raw counts.", fix: "The paper SAT had 154 questions total with different section maxes. The digital SAT uses 96 EBRW and 58 Math. Use the matching format." },
          { mistake: "Assuming a fixed raw-to-scaled curve.", fix: "The curve shifts per test form. The same raw count can scale 20 to 40 points higher or lower depending on the form's equating." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Composite score", definition: "The 400–1600 total, equal to EBRW plus Math section scores." },
          { term: "EBRW", definition: "Evidence-Based Reading and Writing — one of the two SAT sections, scored 200–800." },
          { term: "Raw score", definition: "Number of questions answered correctly. No deductions for wrong answers." },
          { term: "Scaled score", definition: "Raw score converted to the 200–800 reporting scale through the College Board's equating process." },
          { term: "Equating", definition: "The statistical adjustment that makes scaled scores comparable across different test forms and dates." },
          { term: "Percentile", definition: "Share of test takers you scored at or above, from 1 to 99." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "College Board — Understanding SAT Scores", href: "https://satsuite.collegeboard.org/sat/scores/understanding-scores" },
          { label: "College Board — SAT/ACT Concordance Tables", href: "https://satsuite.collegeboard.org/media/pdf/higher-ed-brief-sat-concordance.pdf" },
          { label: "College Board — Digital SAT Suite", href: "https://satsuite.collegeboard.org/digital" },
          { label: "ACT — ACT/SAT Concordance Information", href: "https://www.act.org/content/act/en/products-and-services/the-act/scores/act-sat-concordance.html" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["ap-score-calculator", "weighted-grade-calculator", "cumulative-gpa-calculator"]} />
    </Container>
  );
}
