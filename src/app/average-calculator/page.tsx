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

const SLUG = "average-calculator";
const TITLE = "Average Calculator";
const DESC =
  "Compute mean, median, and mode of any list of numbers. Knows the difference and tells you which one to use.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between mean, median, and mode?",
    answer:
      "Mean is the arithmetic average — add up the numbers and divide by how many there are. Median is the middle value once the list is sorted. Mode is the value that appears most often.",
  },
  {
    question: "When should I use the median instead of the mean?",
    answer:
      "Use the median when your data has outliers or is skewed, like home prices or incomes. The median ignores how extreme the high or low values are, so it describes a 'typical' number better than the mean does in those cases.",
  },
  {
    question: "Can a dataset have more than one mode?",
    answer:
      "Yes. If two values tie for the highest count, the data is bimodal; three or more is multimodal. This calculator lists every value that ties for the top frequency.",
  },
  {
    question: "What happens when every number appears the same number of times?",
    answer:
      "There is no mode. If you saw 1, 2, 3, 4 each once, no value is more frequent than the others, so the mode is undefined. The calculator says 'no mode' in that case.",
  },
  {
    question: "How do outliers affect the mean?",
    answer:
      "A single very large or very small value can pull the mean far from the bulk of the data. For example, adding one billionaire to a small town's income list will spike the mean but barely move the median.",
  },
  {
    question: "What is a weighted average?",
    answer:
      "A weighted average multiplies each value by an importance weight, sums those products, and divides by the sum of weights. It's how GPAs are computed — a 4-credit A counts more than a 1-credit A.",
  },
  {
    question: "When is the geometric mean better than the arithmetic mean?",
    answer:
      "Use the geometric mean for ratios, growth rates, or percentages compounded over time — investment returns, for example. It multiplies the values and takes the n-th root, which avoids the upward bias the arithmetic mean has on volatile series.",
  },
  {
    question: "Does the arithmetic mean assume anything about the data?",
    answer:
      "It assumes the values are on an interval or ratio scale and that an additive sum is meaningful. Averaging zip codes or phone numbers, for instance, produces a number with no real-world meaning.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Mean, Median, Mode in One Shot`,
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
      name: "How to compute mean, median, and mode",
      steps: [
        { name: "Enter your numbers", text: "Paste a list separated by commas, spaces, or new lines. Decimals and negatives are allowed." },
        { name: "Compute the mean", text: "Add every value and divide by the count. Mean = sum / count." },
        { name: "Compute the median", text: "Sort the list. The median is the middle value, or the average of the two middle values when the count is even." },
        { name: "Compute the mode", text: "Find the value that appears most often. If two or more tie, the dataset is multimodal." },
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
        tagline="Mean, median, and mode of any list — plus a plain-English nudge toward the one that fits your data."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A short quiz scored eight students. Their points: 5, 8, 12, 3, 5, 10, 8, 5. What are the mean, median, and mode?"
        steps={[
          { label: "Count the values", value: "8" },
          { label: "Sum them: 5 + 8 + 12 + 3 + 5 + 10 + 8 + 5", value: "56" },
          { label: "Mean: 56 / 8", value: "7" },
          { label: "Sort the list", value: "3, 5, 5, 5, 8, 8, 10, 12" },
          { label: "Median: even count, average of the two middles (5 and 8) = (5 + 8) / 2", value: "6.5" },
          { label: "Mode: 5 appears three times — more than any other value", value: "5" },
        ]}
        result="Mean 7, median 6.5, mode 5. The mode being lower than the mean is the giveaway that a high score (12) is pulling the mean up."
      />

      <FormulaExplained
        plainEnglish="Three different answers to 'what's the average?' Mean adds and divides. Median sorts and picks the middle. Mode counts and picks the most common. They agree when the data is symmetric; they disagree when it isn't."
        formula={
          <span>
            mean = (x<sub>1</sub> + x<sub>2</sub> + … + x<sub>n</sub>) / n
            <br />
            median = middle value of the sorted list (average of the two middles when n is even)
            <br />
            mode = value(s) with the highest frequency
            <br />
            weighted mean = Σ(x<sub>i</sub> · w<sub>i</sub>) / Σ w<sub>i</sub>
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — Summary Statistics",
          href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're summarizing test scores or survey responses for a quick read.",
          "You're cleaning a spreadsheet and need to spot whether outliers are skewing the average.",
          "You're explaining 'average' in a report and want to pick the measure that fits the data.",
          "You're a student checking a homework answer for a statistics class.",
          "You're computing a weighted score, like a GPA or a project grade made of differently weighted parts.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Reporting only the mean for skewed data.", fix: "If the distribution has a long tail — incomes, home prices, response times — pair the mean with the median so readers see both." },
          { mistake: "Confusing 'no mode' with 'mode is zero'.", fix: "When every value appears the same number of times, the mode is undefined, not zero. Say 'no mode' explicitly." },
          { mistake: "Averaging averages without weighting.", fix: "Two groups of different sizes need a weighted mean. A simple average of group means overweights the smaller group." },
          { mistake: "Mixing up the median and the middle index.", fix: "For an even count, the median is the average of the two middle values, not just one of them." },
          { mistake: "Using the arithmetic mean for growth rates.", fix: "Compounded returns and ratios call for the geometric mean — multiply the values and take the n-th root." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Arithmetic mean", definition: "Sum of the values divided by their count. The everyday 'average'." },
          { term: "Median", definition: "Middle value of the sorted list. Resistant to outliers." },
          { term: "Mode", definition: "Value (or values) that appear most often in the dataset." },
          { term: "Weighted mean", definition: "Average where each value is multiplied by an importance weight before summing." },
          { term: "Geometric mean", definition: "n-th root of the product of n values. Used for rates, ratios, and compounded growth." },
          { term: "Outlier", definition: "A value far from the rest of the data. Pulls the mean but not the median." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — Summary Statistics", href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm" },
          { label: "OECD Glossary of Statistical Terms — Arithmetic Mean", href: "https://stats.oecd.org/glossary/detail.asp?ID=2904" },
          { label: "Khan Academy — Mean, Median, and Mode Review", href: "https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/mean-median-basics/a/mean-median-and-mode-review" },
          { label: "NIST/SEMATECH e-Handbook — Measures of Location", href: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["median-calculator", "standard-deviation-calculator", "variance-calculator"]} />
    </Container>
  );
}
