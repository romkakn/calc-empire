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

const SLUG = "standard-deviation-calculator";
const TITLE = "Standard Deviation Calculator";
const DESC =
  "Compute population and sample standard deviation, variance, mean, and count from a list of numbers. Plain-English math.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between sample and population standard deviation?",
    answer:
      "Population SD describes the spread of every value in the whole group, dividing by n. Sample SD estimates the population spread from a subset, dividing by n − 1. The smaller divisor makes sample SD slightly larger, correcting for the fact that a sample mean tends to sit a bit closer to its own data than the true population mean does.",
  },
  {
    question: "When should I use sample SD versus population SD?",
    answer:
      "Use sample SD (n − 1) when your numbers are a subset drawn to learn about a larger group — survey responses, lab measurements, test scores from one class. Use population SD (n) only when you genuinely have every member of the group, like the salaries of all 12 people on a team. Most real-world data is a sample, so sample SD is the safer default.",
  },
  {
    question: "How is standard deviation related to variance?",
    answer:
      "Variance is the average of the squared deviations from the mean. Standard deviation is the square root of variance, which brings the answer back into the original units (dollars, inches, seconds). SD is easier to interpret; variance is easier to combine across independent variables.",
  },
  {
    question: "Why divide by n − 1 instead of n?",
    answer:
      "This is Bessel's correction. When you compute deviations from a sample mean instead of the true population mean, the deviations are systematically a little too small. Dividing by n − 1 instead of n compensates and gives an unbiased estimate of the population variance.",
  },
  {
    question: "How do I interpret a standard deviation value?",
    answer:
      "SD has the same units as your data, so an SD of 5 cm means a typical point sits about 5 cm from the mean. For roughly bell-shaped data, about 68% of values fall within 1 SD of the mean and about 95% within 2 SD. A small SD means values cluster tightly; a large SD means they spread out.",
  },
  {
    question: "What is the difference between standard deviation and mean absolute deviation?",
    answer:
      "Mean absolute deviation (MAD) averages the unsigned distances from the mean. SD averages the squared distances and then takes a square root. SD penalizes large outliers more, which is why it pairs naturally with the normal distribution. MAD is more resistant to outliers and easier to explain.",
  },
  {
    question: "What is a real-world example of standard deviation?",
    answer:
      "Two basketball players both average 20 points per game. Player A scores 18, 20, 22 each game (SD ≈ 2); Player B scores 5, 20, 35 (SD ≈ 15). Same mean, very different consistency. SD turns that intuition into a number you can compare across players, products, or experiments.",
  },
  {
    question: "Does standard deviation work for any data shape?",
    answer:
      "You can compute it on any numeric data set, but it is most informative when the data is roughly symmetric and free of extreme outliers. For heavily skewed data, the median and interquartile range often describe the spread more honestly. Always plot your data before trusting a single summary number.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Sample & Population, Variance, Mean`,
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
      name: "How to calculate standard deviation",
      steps: [
        { name: "List your numbers", text: "Paste or type your data set. Separate values with commas, spaces, or new lines." },
        { name: "Pick sample or population", text: "Use sample (n − 1) if your data is a subset of a larger group. Use population (n) only when you have every member." },
        { name: "Find the mean and squared deviations", text: "Subtract the mean from each value, square the result, and add them up. That sum is Σ(x − x̄)²." },
        { name: "Divide and take the square root", text: "Divide the sum by n − 1 (sample) or n (population). The square root of that quotient is the standard deviation." },
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

      <Hero title={TITLE} tagline="Paste your numbers, pick sample or population, and get the standard deviation, variance, mean, and count — with the formula spelled out.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Compute the standard deviation of the data set 2, 4, 4, 4, 5, 5, 7, 9."
        steps={[
          { label: "Count the values (n)", value: "8" },
          { label: "Mean: (2 + 4 + 4 + 4 + 5 + 5 + 7 + 9) / 8", value: "5" },
          { label: "Squared deviations: 9, 1, 1, 1, 0, 0, 4, 16", value: "" },
          { label: "Sum of squared deviations Σ(x − x̄)²", value: "32" },
          { label: "Sample variance: 32 / (8 − 1)", value: "4.571" },
          { label: "Sample SD: sqrt(4.571)", value: "2.138" },
          { label: "Population variance: 32 / 8", value: "4.000" },
          { label: "Population SD: sqrt(4.000)", value: "2.000" },
        ]}
        result="Sample SD ≈ 2.138, population SD = 2.000, variance ≈ 4.571 (sample) or 4.000 (population), mean = 5, n = 8."
      />

      <FormulaExplained
        plainEnglish="Standard deviation measures how far a typical value sits from the mean. You subtract the mean from each value, square the differences, average them, then take a square root to get back to the original units. The only twist: divide by n − 1 instead of n when your data is a sample, not the entire group."
        formula={
          <span>
            Sample SD = sqrt( Σ(x − x̄)² / (n − 1) )
            <br />
            Population SD = sqrt( Σ(x − μ)² / n )
            <br />
            Variance = SD²
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — §1.3.6.2 Sample variance and standard deviation",
          href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have a data set and want a single number for how spread out it is.",
          "You're comparing two groups with similar means to see which is more consistent.",
          "You're a student working through a statistics assignment and want to verify each step.",
          "You're an analyst checking the volatility of a metric over time.",
          "You're a teacher or coach showing how the same average can hide very different patterns.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Dividing by n when you have a sample.", fix: "Sample SD uses n − 1 (Bessel's correction). Dividing by n underestimates the population SD." },
          { mistake: "Forgetting to square the deviations.", fix: "Plain deviations from the mean always sum to zero. Squaring is what makes the spread measurable." },
          { mistake: "Confusing variance with standard deviation.", fix: "Variance is in squared units (dollars², minutes²). SD is the square root of variance and reads in the original units." },
          { mistake: "Reporting SD for heavily skewed data.", fix: "For long-tailed distributions, the median and interquartile range describe the spread more honestly than mean ± SD." },
          { mistake: "Comparing SDs across different units or scales.", fix: "Use the coefficient of variation (SD ÷ mean) when comparing spread across data sets with different magnitudes or units." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Variance", definition: "The average of the squared deviations from the mean. SD is its square root." },
          { term: "Mean (x̄)", definition: "The arithmetic average — sum of values divided by count." },
          { term: "Bessel's correction", definition: "Dividing by n − 1 instead of n when computing sample variance, to give an unbiased estimate." },
          { term: "Mean absolute deviation (MAD)", definition: "Average unsigned distance from the mean. More resistant to outliers than SD." },
          { term: "Coefficient of variation (CV)", definition: "SD divided by the mean, often shown as a percent. Lets you compare spread across data sets with different units." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — §1.3.6.2 Variance and standard deviation", href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm" },
          { label: "Khan Academy — Sample standard deviation and bias", href: "https://www.khanacademy.org/math/ap-statistics/summarizing-quantitative-data-ap/measuring-spread-quantitative/v/sample-standard-deviation-and-bias" },
          { label: "OpenStax — Introductory Statistics, §2.7 Measures of the spread of the data", href: "https://openstax.org/books/introductory-statistics/pages/2-7-measures-of-the-spread-of-the-data" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["variance-calculator", "median-calculator", "average-calculator"]} />
    </Container>
  );
}
