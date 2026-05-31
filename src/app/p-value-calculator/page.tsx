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

const SLUG = "p-value-calculator";
const TITLE = "P-Value Calculator";
const DESC =
  "Convert a z-score to a one-tailed or two-tailed p-value. Plain-English interpretation of statistical significance.";

const FAQS: FaqItem[] = [
  {
    question: "What does a p-value actually mean?",
    answer:
      "A p-value is the probability of seeing a result at least as extreme as the one you got, assuming the null hypothesis is true. It is not the probability that the null hypothesis is true, and it is not the probability that your result happened by chance.",
  },
  {
    question: "What are common p-value thresholds?",
    answer:
      "The most common cutoff is 0.05 — a 5% chance of a false alarm if the null is true. Tighter studies use 0.01 or 0.001. The threshold is a convention, not a law of nature, and many fields are moving away from a single bright line.",
  },
  {
    question: "One-tailed or two-tailed — which should I use?",
    answer:
      "Use two-tailed by default. It tests whether the effect differs from zero in either direction. Only use one-tailed when you have a pre-registered, directional hypothesis and would treat an effect in the opposite direction as no effect at all.",
  },
  {
    question: "How do p-values relate to confidence intervals?",
    answer:
      "A 95% confidence interval that excludes zero corresponds to a two-tailed p-value below 0.05 for the same data. Confidence intervals also show the size and precision of the effect, so they often communicate more than a p-value alone.",
  },
  {
    question: "When should I not use a p-value?",
    answer:
      "Skip the p-value when your study is exploratory and you have not pre-specified a hypothesis, when the sample is tiny, or when the question is about effect size rather than yes/no significance. Bayesian estimates or simple effect sizes with confidence intervals can fit better.",
  },
  {
    question: "Does a big sample size guarantee a small p-value?",
    answer:
      "Large samples can push a tiny, unimportant effect below 0.05. Statistical significance is not the same as practical importance. Always report the effect size next to the p-value so readers can judge whether the result matters.",
  },
  {
    question: "What about multiple comparisons?",
    answer:
      "Running many tests inflates the chance that one will look significant by accident. With 20 independent tests at the 0.05 threshold, you expect about one false positive even if nothing is real. Use a correction such as Bonferroni or the Benjamini–Hochberg false discovery rate.",
  },
  {
    question: "Is a significant result the same as a true result?",
    answer:
      "No. A p-value below 0.05 means the data are surprising under the null, not that the finding will replicate. Independent replication, pre-registration, and looking at effect sizes are what build evidence that a result is real.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — One-Tailed and Two-Tailed from a Z-Score`,
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
      name: "How to convert a z-score to a p-value",
      steps: [
        { name: "Enter your z-score", text: "Use the test statistic from your hypothesis test. A z-score of 1.96 is a common landmark." },
        { name: "Pick one-tailed or two-tailed", text: "Two-tailed is the default. Use one-tailed only with a pre-registered, directional hypothesis." },
        { name: "Look up the standard normal probability", text: "The calculator uses Phi(z), the standard normal CDF, via the Hastings approximation (Abramowitz and Stegun 26.2.17)." },
        { name: "Compare to your threshold", text: "Compare the p-value to your alpha (commonly 0.05 or 0.01). Smaller p-values are more surprising under the null." },
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

      <Hero title={TITLE} tagline="Turn a z-score into a one-tailed or two-tailed p-value, with a plain-English read on whether the result is statistically significant.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A study reports a z-score of 1.96 for a two-tailed test. What is the p-value?"
        steps={[
          { label: "Formula (two-tailed): p = 2 × (1 − Phi(|Z|))", value: "" },
          { label: "Look up Phi(1.96) — standard normal CDF", value: "0.9750" },
          { label: "Upper tail: 1 − 0.9750", value: "0.0250" },
          { label: "Double it for both tails: 2 × 0.0250", value: "0.0500" },
          { label: "Compare to alpha = 0.05", value: "p ≈ 0.050 — right at the classical threshold" },
        ]}
        result="Z = 1.96 (two-tailed) gives p ≈ 0.050. This is the textbook 5% boundary — borderline significant at the standard alpha."
      />

      <FormulaExplained
        plainEnglish="A z-score says how many standard deviations a result sits from the mean under the null hypothesis. The p-value translates that distance into a probability: how often would you see a result this far out, or further, if nothing real were going on?"
        formula={
          <span>
            One-tailed: p = 1 − Phi(|Z|)
            <br />
            Two-tailed: p = 2 × (1 − Phi(|Z|))
            <br />
            Phi(z) is the standard normal CDF, approximated by the Hastings polynomial
            (Abramowitz and Stegun 26.2.17).
          </span>
        }
        citation={{
          label: "Abramowitz & Stegun — Handbook of Mathematical Functions, formula 26.2.17 (NIST DLMF)",
          href: "https://personal.math.ubc.ca/~cbm/aands/page_932.htm",
        }}
      />

      <WhenToUse
        scenarios={[
          "You ran a hypothesis test and have a z-score but need the matching p-value.",
          "You are reading a paper that reports z but not p, and want to know if the result clears 0.05.",
          "You are teaching or studying intro statistics and want to sanity-check textbook values.",
          "You are deciding between one-tailed and two-tailed reporting before pre-registering a study.",
          "You are converting a confidence interval landmark (like z = 1.96) into the p-value it corresponds to.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Reading the p-value as the probability the null is true.", fix: "It is the probability of the data (or more extreme) given the null is true — not the probability the null is true given the data." },
          { mistake: "Picking one-tailed after seeing the data.", fix: "Choosing the tail post-hoc roughly doubles your false-positive rate. Pre-register the direction or use two-tailed." },
          { mistake: "Treating p = 0.049 and p = 0.051 as different worlds.", fix: "The 0.05 cutoff is a convention. Effect sizes and confidence intervals carry the real story." },
          { mistake: "Ignoring multiple comparisons.", fix: "Running many tests inflates false positives. Apply Bonferroni, Holm, or a false discovery rate correction." },
          { mistake: "Calling a non-significant result 'no effect'.", fix: "Failing to reject the null is not the same as proving the null. Report the confidence interval and consider statistical power." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Null hypothesis (H0)", definition: "The default claim — usually 'no effect' or 'no difference' — that a statistical test tries to rule out." },
          { term: "Z-score", definition: "How many standard deviations a value sits from the mean under the null distribution." },
          { term: "Standard normal CDF (Phi)", definition: "The cumulative probability of a standard normal variable being at or below a given value." },
          { term: "Alpha (significance level)", definition: "The threshold for declaring a result significant — commonly 0.05 or 0.01. Set before you see the data." },
          { term: "Type I error", definition: "Rejecting the null hypothesis when it is actually true — a false positive." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Wasserstein RL & Lazar NA — The ASA Statement on p-Values: Context, Process, and Purpose (The American Statistician, 2016)", href: "https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108" },
          { label: "NIST/SEMATECH e-Handbook of Statistical Methods — Hypothesis Testing chapter", href: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc13.htm" },
          { label: "Abramowitz & Stegun — Handbook of Mathematical Functions, formula 26.2.17", href: "https://personal.math.ubc.ca/~cbm/aands/page_932.htm" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["standard-deviation-calculator", "variance-calculator", "average-calculator"]} />
    </Container>
  );
}
