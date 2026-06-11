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

const SLUG = "z-score-calculator";
const TITLE = "Z-Score Calculator";
const DESC =
  "Z-score from a raw value, mean, and standard deviation. Plus z-to-probability — Φ(z) via Hastings polynomial.";

const FAQS: FaqItem[] = [
  {
    question: "What does a z-score actually mean?",
    answer:
      "A z-score tells you how many standard deviations a value sits above or below the mean. A z of 0 is right at the mean, +1 is one SD above, −1 is one SD below. The sign tells you direction; the size tells you how unusual.",
  },
  {
    question: "What is standardisation?",
    answer:
      "Standardisation rescales any normal variable to a common axis with mean 0 and SD 1. That lets you compare apples to oranges — a test score in one class against a score in another, for example.",
  },
  {
    question: "Does my data have to be normally distributed?",
    answer:
      "The z-score itself is just (x − mean) / SD, so you can compute it for anything. But converting a z to a probability assumes a roughly normal distribution. For heavy-tailed or skewed data the probability will be misleading.",
  },
  {
    question: "What is a z-table?",
    answer:
      "A z-table is a lookup of the standard normal cumulative distribution Φ(z) — the area under the curve to the left of a given z. This calculator computes the same thing using a polynomial approximation, accurate to about 7 decimal places.",
  },
  {
    question: "What are 1.96 and 2.58?",
    answer:
      "1.96 is the z that brackets the middle 95% of a normal distribution — the basis of the standard 95% confidence interval. 2.58 brackets 99%. You see these constants in confidence intervals, hypothesis tests, and quality control limits.",
  },
  {
    question: "What is the difference between a z-score and a t-score?",
    answer:
      "Use z when the population standard deviation is known or the sample is large (rule of thumb: n ≥ 30). Use a t-score when the SD is estimated from a small sample — the t distribution has heavier tails to account for the extra uncertainty.",
  },
  {
    question: "Where are z-scores used in real life?",
    answer:
      "Test score reporting (SAT, IQ, growth charts), quality control on a production line, finance for measuring how far a return is from average, and most statistical hypothesis tests. Anywhere you need a fair comparison across different scales.",
  },
  {
    question: "Can a z-score be negative?",
    answer:
      "Yes. A negative z just means the value is below the mean. A z of −1.5 is 1.5 standard deviations below the average, exactly as far from the mean as +1.5 is above.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Standardise Any Value, Get the Probability`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Statistics", path: "/stats" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "stats", description: DESC }),
    howToSchema({
      name: "How to calculate a z-score",
      steps: [
        { name: "Identify the raw value", text: "Pick the observation x you want to standardise — a test score, a measurement, a return." },
        { name: "Find the mean", text: "Use the population mean μ if you know it, or the sample mean as a substitute." },
        { name: "Find the standard deviation", text: "Use the population SD σ when available. Otherwise the sample SD with n ≥ 30 keeps the z approximation reasonable." },
        { name: "Apply the formula", text: "z = (x − μ) / σ. A positive z is above the mean; a negative z is below." },
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

      <Hero title={TITLE} tagline="Convert any raw value into standard-deviation units — then read the probability straight off Φ(z).">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A student scores 85 on a test where the class mean is 70 and the standard deviation is 10. How far above the mean is that score, and what is the cumulative probability?"
        steps={[
          { label: "Formula: z = (x − μ) / σ", value: "" },
          { label: "Plug in: (85 − 70) / 10", value: "15 / 10" },
          { label: "Z-score", value: "1.5" },
          { label: "Cumulative probability Φ(1.5)", value: "0.9332" },
        ]}
        result="The student is 1.5 standard deviations above the mean. About 93.3% of test takers score at or below that mark."
      />

      <FormulaExplained
        plainEnglish="A z-score subtracts the mean to centre your value at zero, then divides by the standard deviation to put it on a universal scale. Converting that z into a probability uses the standard normal cumulative distribution — the area under the bell curve to the left of z."
        formula={
          <span>
            z = (x − μ) / σ
            <br />
            P(X ≤ x) = Φ(z)
            <br />
            Φ(z) approximated via the Hastings polynomial (A&amp;S 26.2.17), error &lt; 7.5 × 10⁻⁸
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — Normal Distribution",
          href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "Comparing two scores measured on different scales (a 1450 SAT against a 32 ACT).",
          "Building a 95% confidence interval and you need the cutoff z = 1.96.",
          "Spotting outliers in a dataset — anything beyond |z| > 3 is worth a second look.",
          "Quality control: flagging parts whose dimension is more than 2 SD from spec.",
          "Standardising features before feeding them into a regression or classifier.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a z-score on small samples with estimated SD.", fix: "Switch to a t-score when n is small and σ is estimated from the data — t-distribution tails are heavier and give honest intervals." },
          { mistake: "Reading the probability without checking normality.", fix: "Plot a histogram or run a normality check. Φ(z) only maps to the true probability when the underlying data is approximately normal." },
          { mistake: "Dividing by variance instead of standard deviation.", fix: "The denominator is σ (the SD), not σ². Variance has the wrong units." },
          { mistake: "Treating a positive z as 'good' or a negative z as 'bad'.", fix: "Direction depends on context. A negative z on a defect-rate chart is good. Read the sign in context." },
          { mistake: "Using the population SD when you only have a sample.", fix: "If σ is unknown, use the sample SD s and acknowledge the extra uncertainty — or move to a t-score for small samples." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Standard normal distribution", definition: "Normal distribution with mean 0 and standard deviation 1. The reference scale for z-scores." },
          { term: "Φ(z) (cumulative distribution function)", definition: "Probability that a standard normal random variable is at or below z." },
          { term: "Standard deviation (σ)", definition: "Average distance of values from the mean. The denominator of the z formula." },
          { term: "Mean (μ)", definition: "Arithmetic average of a population or sample. The centre point a z-score is measured from." },
          { term: "T-score", definition: "Like a z-score but uses the t-distribution — appropriate when SD is estimated from a small sample." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — Normal Distribution", href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm" },
          { label: "OpenStax — Introductory Statistics (Z-scores chapter)", href: "https://openstax.org/books/introductory-statistics/pages/6-1-the-standard-normal-distribution" },
          { label: "Khan Academy — AP Statistics: Z-scores", href: "https://www.khanacademy.org/math/ap-statistics/density-curves-normal-distribution-ap/measuring-position/v/z-score-introduction" },
          { label: "Abramowitz & Stegun — Handbook of Mathematical Functions, equation 26.2.17", href: "https://personal.math.ubc.ca/~cbm/aands/page_932.htm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["p-value-calculator", "standard-deviation-calculator", "linear-regression-calculator"]} />
    </Container>
  );
}
