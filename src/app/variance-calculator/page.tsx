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

const SLUG = "variance-calculator";
const TITLE = "Variance Calculator";
const DESC =
  "Compute sample or population variance, standard deviation, and mean from any list of numbers. Shows every step.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between sample and population variance?",
    answer:
      "Sample variance divides by n − 1 (Bessel's correction) because you're estimating from a subset. Population variance divides by N when your data is the entire population. Sample is the default for almost every real-world use.",
  },
  {
    question: "Why use n − 1 instead of n?",
    answer:
      "Dividing by n − 1 corrects a bias that creeps in when you use the sample mean instead of the true population mean. Without the correction, sample variance systematically underestimates the true value.",
  },
  {
    question: "What does standard deviation tell me that variance doesn't?",
    answer:
      "Standard deviation is the square root of variance, so it's in the same units as your data. A variance of 4 dollars² is meaningless; a standard deviation of $2 is intuitive.",
  },
  {
    question: "How is variance related to mean absolute deviation (MAD)?",
    answer:
      "Both measure spread. Variance squares the deviations (so outliers count more) before averaging; MAD takes the absolute value. Variance is more mathematically convenient but more sensitive to extreme values.",
  },
  {
    question: "Can variance be negative?",
    answer:
      "No. Variance is the average of squared values, so it's always ≥ 0. A zero variance means every value equals the mean — no spread at all.",
  },
  {
    question: "What's a coefficient of variation?",
    answer:
      "Standard deviation ÷ mean. It's a unitless measure of relative spread, useful for comparing variability across datasets in different units or scales.",
  },
  {
    question: "Should I remove outliers before computing variance?",
    answer:
      "It depends. If an outlier is a data-entry error, fix it. If it's a real extreme value, keep it — but consider also reporting the median and interquartile range, which are more robust.",
  },
  {
    question: "What if my dataset has only one value?",
    answer:
      "Population variance is 0 (one value is its own mean, no deviation). Sample variance is undefined because n − 1 = 0. Add at least one more observation.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Sample & Population (Step-by-Step)`,
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
      name: "How to calculate variance",
      steps: [
        { name: "Find the mean", text: "Add every value, divide by the count." },
        { name: "Compute each deviation", text: "Subtract the mean from every value." },
        { name: "Square each deviation", text: "This penalises larger gaps more, and removes negatives." },
        { name: "Sum the squared deviations", text: "Add them all up." },
        { name: "Divide by n − 1 (sample) or N (population)", text: "Use n − 1 unless your data is the entire population." },
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

      <Hero
        title={TITLE}
        tagline="Sample or population variance, in your browser, with the math shown step by step."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Dataset: 4, 8, 6, 5, 3 (five test scores)."
        steps={[
          { label: "Mean (x̄) = (4 + 8 + 6 + 5 + 3) / 5", value: "5.2" },
          { label: "(4 − 5.2)² = 1.44", value: "1.44" },
          { label: "(8 − 5.2)² = 7.84", value: "7.84" },
          { label: "(6 − 5.2)² = 0.64", value: "0.64" },
          { label: "(5 − 5.2)² = 0.04", value: "0.04" },
          { label: "(3 − 5.2)² = 4.84", value: "4.84" },
          { label: "Σ(xᵢ − x̄)²", value: "14.80" },
          { label: "Sample variance = 14.80 / (5 − 1)", value: "3.70" },
          { label: "Population variance = 14.80 / 5", value: "2.96" },
        ]}
        result="Sample s² = 3.70; population σ² = 2.96; sample s = 1.92."
      />

      <FormulaExplained
        plainEnglish="Variance is the average squared distance from the mean. Squaring keeps each contribution positive and gives a number you can work with mathematically. Standard deviation is the square root — same units as your data."
        formula={
          <span>
            Sample: s² = Σ(xᵢ − x̄)² / (n − 1)
            <br />
            Population: σ² = Σ(xᵢ − μ)² / N
            <br />
            Standard deviation = √variance
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods, §1.3.5",
          href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're analysing test scores or survey results and need to report spread alongside the average.",
          "You're comparing two processes (manufacturing batches, A/B test arms) and need to know which is more consistent.",
          "You're computing a Sharpe ratio, beta, or any risk metric that builds on standard deviation.",
          "You're sizing a sample and need the variance for a power calculation.",
          "You're a student verifying a textbook problem and want to see every step.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using population variance when you only have a sample.", fix: "Use sample variance (n − 1) unless you genuinely have every member of the population. The bias correction matters." },
          { mistake: "Forgetting to square the deviations.", fix: "Sum of raw deviations is always zero. Squaring fixes that and makes variance non-negative." },
          { mistake: "Reporting variance in the wrong units.", fix: "Variance is in squared units (e.g., dollars²). Use standard deviation when you want a number readers can compare to the original data." },
          { mistake: "Letting outliers dominate the result.", fix: "Variance squares deviations, so one big outlier can balloon it. Check your data first — and consider robust alternatives like the IQR." },
          { mistake: "Confusing variance with range.", fix: "Range is max − min; it ignores everything in between. Variance uses every value." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Mean (x̄ or μ)", definition: "The arithmetic average — sum divided by count." },
          { term: "Standard deviation", definition: "Square root of the variance. Same units as the data; easier to interpret." },
          { term: "Bessel's correction", definition: "The n − 1 divisor in sample variance that removes systematic bias." },
          { term: "Coefficient of variation", definition: "Standard deviation ÷ mean. Unitless measure of relative variability." },
          { term: "Interquartile range (IQR)", definition: "Spread between the 25th and 75th percentile. Robust to outliers." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods", href: "https://www.itl.nist.gov/div898/handbook/" },
          { label: "Khan Academy — Sample vs. population variance", href: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/variance-standard-deviation-sample" },
          { label: "Wikipedia — Bessel's correction", href: "https://en.wikipedia.org/wiki/Bessel%27s_correction" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-27" />

      <RelatedCalculators
        slugs={["mixed-number-calculator", "dividend-calculator", "options-profit-calculator"]}
      />
    </Container>
  );
}
