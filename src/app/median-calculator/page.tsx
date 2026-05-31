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

const SLUG = "median-calculator";
const TITLE = "Median Calculator";
const DESC =
  "Find the median, quartiles, and IQR of any number set. Sorted view, plain-English explanation, resistant to outliers.";

const FAQS: FaqItem[] = [
  {
    question: "What is the median, and how is it different from the mean?",
    answer:
      "The median is the middle value of a sorted list — half the numbers sit below it, half above. The mean is the arithmetic average. They diverge when a few extreme values pull the mean away from the center of the data.",
  },
  {
    question: "When should I prefer the median over the mean?",
    answer:
      "Pick the median when the data is skewed or has outliers — income, home prices, response times, exam scores with a few zeros. The mean is fine when values are roughly symmetric around a center.",
  },
  {
    question: "Why is the median resistant to outliers?",
    answer:
      "Adding one huge number changes only the position of the middle, not the middle value itself. Doubling the largest salary in a company barely moves the median; it can shift the mean by a lot.",
  },
  {
    question: "How do you compute Q1 and Q3 (the quartiles)?",
    answer:
      "Sort the data and split it at the median. Q1 is the median of the lower half; Q3 is the median of the upper half. When the count is odd, this calculator excludes the overall median from both halves (the Tukey hinge method).",
  },
  {
    question: "What does the IQR tell you?",
    answer:
      "The interquartile range (IQR = Q3 − Q1) measures the spread of the middle 50% of your data. A small IQR means values cluster tightly; a large IQR means they spread out. IQR is also the basis for the standard outlier rule: values below Q1 − 1.5×IQR or above Q3 + 1.5×IQR.",
  },
  {
    question: "What if I have an even number of values?",
    answer:
      "With an even count there is no single middle value. The median is the average of the two middle numbers after sorting. For 4 and 6 in the middle, the median is 5.",
  },
  {
    question: "What is a weighted median?",
    answer:
      "When each value has a frequency or weight, the weighted median is the value at which the cumulative weight first reaches half the total. This calculator returns the unweighted median; weight each entry by repeating it if you need the weighted version.",
  },
  {
    question: "Why does median income matter more than mean income?",
    answer:
      "A handful of very high earners pull the mean far above what a typical household earns. The median household income shows where the middle family actually sits, which is why agencies like the U.S. Census Bureau report it.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Median, Quartiles, and IQR`,
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
      name: "How to find the median of a number set",
      steps: [
        { name: "Sort the numbers", text: "Arrange every value from smallest to largest. Tied values keep their place." },
        { name: "Count how many values you have", text: "Call that count n. The position of the middle depends on whether n is odd or even." },
        { name: "Pick the middle", text: "If n is odd, the median is the value at position (n + 1) / 2. If n is even, it is the average of the two middle values." },
        { name: "Split for quartiles", text: "The median of the lower half is Q1; the median of the upper half is Q3. The interquartile range is Q3 − Q1." },
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

      <Hero title={TITLE} tagline="Type or paste any list of numbers. Get the median, quartiles, IQR, and a sorted view — with the math spelled out.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Find the median, quartiles, and IQR of 3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5."
        steps={[
          { label: "Sort ascending", value: "1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9" },
          { label: "Count (n)", value: "11 (odd)" },
          { label: "Median = middle value (position 6)", value: "4" },
          { label: "Lower half (5 values below the median)", value: "1, 1, 2, 3, 3" },
          { label: "Q1 = median of lower half", value: "2" },
          { label: "Upper half (5 values above the median)", value: "5, 5, 5, 6, 9" },
          { label: "Q3 = median of upper half", value: "5" },
          { label: "IQR = Q3 − Q1", value: "3" },
        ]}
        result="Median = 4, Q1 = 2, Q3 = 5, IQR = 3. The middle half of the data spans the values 2 through 5."
      />

      <FormulaExplained
        plainEnglish="The median is the middle of a sorted list. Quartiles split the data into four equal parts; Q1 sits a quarter of the way in, Q3 three-quarters of the way in. IQR measures how spread out the middle half is."
        formula={
          <span>
            Sort x<sub>(1)</sub> ≤ x<sub>(2)</sub> ≤ … ≤ x<sub>(n)</sub>
            <br />
            If n is odd: median = x<sub>((n+1)/2)</sub>
            <br />
            If n is even: median = (x<sub>(n/2)</sub> + x<sub>(n/2+1)</sub>) / 2
            <br />
            Q1 = median of the lower half · Q3 = median of the upper half
            <br />
            IQR = Q3 − Q1
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — Percentiles and Quartiles",
          href: "https://www.itl.nist.gov/div898/handbook/prc/section2/prc252.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have a skewed dataset — income, home prices, page-load times — and the mean would mislead.",
          "You want a center value that does not lurch when a single outlier appears.",
          "You need quartiles and IQR for a box plot or to flag potential outliers.",
          "You are summarizing exam scores, survey ratings, or any small set where one or two extremes would distort an average.",
          "You are checking a result from a textbook or a stats class.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Picking the middle value without sorting first.", fix: "Always sort the list. The median is defined on the ordered data, not the order it was typed in." },
          { mistake: "Forgetting to average when the count is even.", fix: "With 10 values, the median is the mean of the 5th and 6th values after sorting — not the 5th alone." },
          { mistake: "Including the overall median in both quartile halves.", fix: "When n is odd, exclude the median from each half before finding Q1 and Q3. This calculator uses that Tukey-hinge convention." },
          { mistake: "Reporting the mean for skewed data.", fix: "If a histogram is asymmetric or has a long tail, the median describes the typical value far better than the mean." },
          { mistake: "Treating IQR as the full spread.", fix: "IQR covers only the middle 50%. The full range goes from the minimum to the maximum and is much more sensitive to outliers." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Median", definition: "The middle value of a sorted dataset; the 50th percentile." },
          { term: "Quartile", definition: "A value that divides the data into four equal parts. Q1, Q2 (the median), and Q3." },
          { term: "IQR", definition: "Interquartile range — Q3 minus Q1. Measures the spread of the middle 50% of values." },
          { term: "Outlier", definition: "A value far from the bulk of the data. The 1.5 × IQR rule flags values outside [Q1 − 1.5·IQR, Q3 + 1.5·IQR]." },
          { term: "Skew", definition: "Asymmetry in a distribution. Right-skewed data has a long right tail and a mean greater than its median." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — Percentiles and Quartiles", href: "https://www.itl.nist.gov/div898/handbook/prc/section2/prc252.htm" },
          { label: "NIST/SEMATECH e-Handbook — Location: mean, median, and mode", href: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm" },
          { label: "OpenStax — Introductory Statistics, Measures of the Location of the Data", href: "https://openstax.org/books/introductory-statistics/pages/2-3-measures-of-the-location-of-the-data" },
          { label: "Stanford CS109 — Probability for Computer Scientists, lecture notes", href: "https://web.stanford.edu/class/cs109/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["average-calculator", "standard-deviation-calculator", "variance-calculator"]} />
    </Container>
  );
}
