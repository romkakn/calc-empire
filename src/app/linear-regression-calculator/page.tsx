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

const SLUG = "linear-regression-calculator";
const TITLE = "Linear Regression Calculator";
const DESC =
  "Best-fit line from x,y data — slope, intercept, R-squared, residuals.";

const FAQS: FaqItem[] = [
  {
    question: "What is least squares regression?",
    answer:
      "Least squares finds the straight line that minimizes the sum of squared vertical distances between each data point and the line. Those distances are called residuals. The line it picks is the unique best fit under that rule.",
  },
  {
    question: "What does R-squared actually mean?",
    answer:
      "R-squared is the share of the variation in y that the line explains, from 0 to 1. An R-squared of 0.6 means the line accounts for 60% of the spread in y, and the other 40% is noise or missing variables. Higher is better, but a high value does not prove the model is correct.",
  },
  {
    question: "What is a residual?",
    answer:
      "A residual is the gap between an observed y value and the y value the line predicts at that x. If you plot residuals against x and see a clear curve or funnel, a straight line is the wrong model.",
  },
  {
    question: "When does linear regression fail?",
    answer:
      "It fails when the true relationship is curved, when variance grows with x, or when a few outliers pull the line. In those cases the slope and R-squared are misleading even when the math runs.",
  },
  {
    question: "Does a strong fit prove causation?",
    answer:
      "No. Regression measures association, not cause. Ice cream sales and drowning rates both rise in summer, but one does not cause the other. Causation needs an experiment or a careful causal model.",
  },
  {
    question: "What is the difference between simple and multiple regression?",
    answer:
      "Simple linear regression uses one predictor x to estimate y. Multiple regression uses two or more predictors at once and estimates a separate slope for each. This calculator handles the simple, one-predictor case.",
  },
  {
    question: "How many data points do I need?",
    answer:
      "Two points define a line, but you need more to estimate how good the fit is. A common rule of thumb is at least 10 to 20 points for a stable slope, more if the data is noisy.",
  },
  {
    question: "What does a negative slope mean?",
    answer:
      "A negative slope means y tends to fall as x rises. The size of the slope is the average change in y for a one-unit change in x.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Slope, Intercept, R-Squared`,
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
      name: "How to fit a linear regression line by hand",
      steps: [
        { name: "Compute the means", text: "Find x_mean = average of all x values and y_mean = average of all y values." },
        { name: "Compute the slope", text: "Slope b = sum of (x − x_mean)(y − y_mean), divided by sum of (x − x_mean) squared." },
        { name: "Compute the intercept", text: "Intercept a = y_mean − b × x_mean. The fitted line is y = a + b × x." },
        { name: "Check the fit", text: "R-squared = 1 − SS_res / SS_tot. Plot residuals — if they curve or fan out, a straight line is the wrong model." },
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

      <Hero title={TITLE} tagline="Paste two columns of numbers, get the best-fit line, its slope, intercept, and R-squared in one step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A small dataset has x = 1, 2, 3, 4, 5 and y = 2, 4, 5, 4, 5. Fit the best straight line and report R-squared."
        steps={[
          { label: "Means: x_mean = (1+2+3+4+5)/5, y_mean = (2+4+5+4+5)/5", value: "x_mean = 3, y_mean = 4" },
          { label: "Sum of (x − x_mean)(y − y_mean)", value: "6" },
          { label: "Sum of (x − x_mean)^2", value: "10" },
          { label: "Slope b = 6 / 10", value: "0.6" },
          { label: "Intercept a = 4 − 0.6 × 3", value: "2.2" },
          { label: "R-squared = 1 − SS_res / SS_tot = 1 − 2.4 / 6", value: "0.6" },
        ]}
        result="Best-fit line: y = 0.6 × x + 2.2. R-squared ≈ 0.6 — the line explains about 60% of the variation in y."
      />

      <FormulaExplained
        plainEnglish="Linear regression draws the one straight line that makes the gaps between the points and the line as small as possible, measured by squared vertical distance. The slope tells you how fast y moves with x, the intercept is where the line crosses the y-axis, and R-squared scores how well the line matches the data."
        formula={
          <span>
            slope b = Σ(x − x̄)(y − ȳ) / Σ(x − x̄)<sup>2</sup>
            <br />
            intercept a = ȳ − b × x̄
            <br />
            fitted line: ŷ = a + b × x
            <br />
            R<sup>2</sup> = 1 − SS<sub>res</sub> / SS<sub>tot</sub>
          </span>
        }
        citation={{
          label: "NIST/SEMATECH e-Handbook of Statistical Methods — Linear Least Squares Regression",
          href: "https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd141.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You have paired measurements and want a quick read on whether x and y move together.",
          "You need a forecasting line for a homework problem or a back-of-the-envelope estimate.",
          "You are checking a spreadsheet trendline by hand and want to confirm the slope and intercept.",
          "You are teaching or learning least squares and want to see each step on the same screen.",
          "You are exploring a dataset before reaching for a heavier tool like Python or R.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Reading a high R-squared as proof the model is right.", fix: "R-squared only measures fit on the data you used. Plot the residuals and check for curves, funnels, or outliers." },
          { mistake: "Confusing correlation with cause.", fix: "Regression shows association, not causation. A strong slope can come from a hidden third variable." },
          { mistake: "Forcing a straight line on curved data.", fix: "If the points clearly bend, try a transformation (log, square root) or a non-linear model." },
          { mistake: "Letting one outlier set the slope.", fix: "A single far-out point can swing the line. Inspect outliers before trusting the result." },
          { mistake: "Extrapolating far past the data range.", fix: "The line is only validated where you have observations. Predictions outside that range are guesses." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Slope", definition: "The change in y per one-unit change in x along the fitted line." },
          { term: "Intercept", definition: "The y value where the fitted line crosses x = 0." },
          { term: "Residual", definition: "Observed y minus predicted y at the same x. The error the line did not capture." },
          { term: "R-squared", definition: "Share of variation in y explained by the line, from 0 to 1." },
          { term: "Least squares", definition: "The fitting rule that picks the line minimizing the sum of squared residuals." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST/SEMATECH e-Handbook — Linear Least Squares Regression", href: "https://www.itl.nist.gov/div898/handbook/pmd/section1/pmd141.htm" },
          { label: "OpenStax — Introductory Statistics, Chapter 12: Linear Regression and Correlation", href: "https://openstax.org/books/introductory-statistics/pages/12-introduction" },
          { label: "Khan Academy — Introduction to least-squares regression", href: "https://www.khanacademy.org/math/statistics-probability/describing-relationships-quantitative-data" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["z-score-calculator", "standard-deviation-calculator", "interpolation-calculator"]} />
    </Container>
  );
}
