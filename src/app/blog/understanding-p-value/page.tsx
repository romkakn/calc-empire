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

const POST = getPostBySlug("understanding-p-value")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Is a p-value the probability the null hypothesis is true?",
    answer:
      "No. A p-value is the probability of seeing data this extreme (or more) assuming the null is true. The reverse direction (probability the null is true given the data) requires a prior and Bayes&apos; rule. The ASA&apos;s 2016 statement calls this the single most common misinterpretation.",
  },
  {
    question: "What does p < 0.05 actually mean?",
    answer:
      "It means that if the null hypothesis were true, you&apos;d see a result this extreme less than 5% of the time by chance. That&apos;s a threshold for surprise, not a verdict on truth. The 0.05 cutoff is a 1925 convention from Fisher, not a law of nature.",
  },
  {
    question: "Why is p-hacking such a big deal?",
    answer:
      "Because if you run 20 comparisons and report only the one with p < 0.05, you&apos;ve manufactured significance. The math guarantees one false positive in 20 tries at the 5% level. Pre-registration and corrections like Bonferroni exist to stop this; the replication crisis in psychology and medicine is partly the bill coming due.",
  },
  {
    question: "What&apos;s the difference between statistical and practical significance?",
    answer:
      "A drug can lower blood pressure by 0.1 mmHg with p < 0.001 in a 100,000-person trial. That&apos;s statistically significant and clinically meaningless. P-values scale with sample size; effect sizes (Cohen&apos;s d, odds ratios, confidence intervals) tell you whether the result matters.",
  },
  {
    question: "Should I still use 0.05 as my threshold?",
    answer:
      "Depends on the cost of a wrong answer. Particle physics uses 5-sigma (p ≈ 3 × 10⁻⁷). The 2018 Benjamin et al. paper in Nature Human Behaviour proposed 0.005 for new claims. Pick the threshold before you look at the data, and report exact p-values, not just &quot;p &lt; 0.05.&quot;",
  },
  {
    question: "What replaces p-values, if anything?",
    answer:
      "Nothing fully replaces them, but most statisticians now want them paired with confidence intervals, effect sizes, and pre-registered analysis plans. Bayesian methods report posterior probabilities directly. The ASA recommends reporting and interpreting p-values in context, not as a binary gatekeeper.",
  },
  {
    question: "How is a p-value calculated for a z-test?",
    answer:
      "Compute the z-statistic (observed minus expected, divided by standard error), then look up the tail probability in a standard normal table. Two-tailed tests double the one-tail area. Most software does this in one call; the math is on the back of every intro stats textbook.",
  },
  {
    question: "Why did the replication crisis happen if everyone was using p < 0.05?",
    answer:
      "Because p < 0.05 controls one specific error rate under one specific assumption (the test is the only one you ran, on data you didn&apos;t peek at). Real research violates both routinely. Combine that with publication bias (null results don&apos;t get printed) and you get a literature where roughly 40% of high-profile findings fail to replicate.",
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
        "https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf",
        "https://www.nature.com/articles/s41562-017-0189-z",
        "https://www.science.org/doi/10.1126/science.aac4716",
        "https://www.nature.com/articles/d41586-019-00857-9",
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
          Statistics · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          A p-value is not the probability the null is true. It&apos;s not the
          probability your result is real. It&apos;s not even the probability
          you&apos;re wrong. It&apos;s one specific thing - and that thing has been
          misread so often that the American Statistical Association issued a
          formal statement in 2016 trying to fix it.
        </p>
      </header>

      <CTACard
        slug="p-value-calculator"
        label="Run the numbers"
        title="Use our P-Value Calculator"
        body="Plug in a z-score or t-statistic and get an exact two-tailed p-value, plus the confidence interval the result is hiding. The post below is for understanding what that number actually says, and what it doesn't."
      />

      <Section id="what-it-is" title="What a p-value actually is">
        <p>
          A p-value answers exactly one question: <em>if the null hypothesis
          were true, how often would I see data this extreme, or more extreme,
          by chance alone?</em> That&apos;s the whole definition. Small p-value:
          your data would be surprising under the null. Large p-value: your data
          would not be surprising under the null.
        </p>
        <p>
          Notice what&apos;s missing. The p-value says nothing about whether
          the null is true. It says nothing about whether your alternative
          hypothesis is true. It says nothing about the size of the effect, the
          importance of the effect, or whether you should publish the paper. It
          is a conditional probability, and the condition is &quot;assume the
          null.&quot;
        </p>
        <Formula>
          p = P(data this extreme or more | H<sub>0</sub> true)
        </Formula>
        <p>
          The bar in that formula is doing the heavy lifting. Read it as
          &quot;given.&quot; Flipping the direction (probability H<sub>0</sub> is
          true given the data) is a different calculation and requires a prior
          probability that the p-value doesn&apos;t include. That swap is the
          mistake at the root of nearly every popular-press misreading of a
          study.
        </p>
      </Section>

      <Section id="worked-example" title="One worked example: a coin flip and a z-test">
        <p>
          Concrete numbers. You suspect a coin is biased toward heads. You flip
          it 100 times and get 58 heads. Is that evidence the coin is rigged?
        </p>
        <p>
          The null hypothesis is fair: probability of heads = 0.5. Under that
          null, the count of heads follows a binomial distribution with mean 50
          and standard deviation √(100 × 0.5 × 0.5) = 5. The z-score for 58
          heads is:
        </p>
        <Formula>
          z = (observed − expected) ÷ SE = (58 − 50) ÷ 5 = 1.6
        </Formula>
        <WorkedSteps
          steps={[
            { label: "Observed heads", value: "58 out of 100" },
            { label: "Expected under H₀", value: "50" },
            { label: "Standard error", value: "√(npq) = √25 = 5" },
            { label: "Z-statistic", value: "(58 − 50) / 5 = 1.6" },
            { label: "One-tailed p-value", value: "P(Z ≥ 1.6) ≈ 0.0548" },
            { label: "Two-tailed p-value", value: "2 × 0.0548 ≈ 0.1096" },
          ]}
        />
        <p>
          Two-tailed p = 0.11. Under a fair coin, you&apos;d see a deviation
          this big or bigger about 11% of the time. That doesn&apos;t prove the
          coin is fair. It says you haven&apos;t cleared the conventional
          surprise threshold. If you want a quick check, our{" "}
          <Link href="/z-score-calculator">z-score calculator</Link> handles
          the lookup; if you want to skip straight to the tail probability, the{" "}
          <Link href="/p-value-calculator">p-value calculator</Link> does it
          directly.
        </p>
        <p>
          Flip the coin 1,000 times and get 580 heads (same proportion). Now SE
          drops to √250 ≈ 15.81, z = (580 − 500) / 15.81 ≈ 5.06, and the
          two-tailed p is around 4 × 10⁻⁷. Same effect size, totally different
          p-value. That&apos;s the sample-size lever in action, and it&apos;s
          why p-values alone are a terrible measure of effect strength.
        </p>
      </Section>

      <Section id="five-misreads" title="The five misreadings the ASA called out">
        <p>
          In 2016 the American Statistical Association published &quot;The ASA
          Statement on P-Values: Context, Process, and Purpose&quot; - the first
          time in its 177-year history that the ASA issued a formal position on
          a single statistical practice. They listed six principles. The
          subtext: stop reading p-values this way.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>&quot;p &lt; 0.05 means the effect is real.&quot;</strong>{" "}
            No. It means the data is unlikely under the null. A real effect that
            doesn&apos;t clear the threshold (false negative) and a chance
            fluctuation that does (false positive) are both routine.
          </li>
          <li>
            <strong>&quot;p = 0.04 is meaningfully different from p = 0.06.&quot;</strong>{" "}
            No. The 0.05 line is a convention from Ronald Fisher&apos;s 1925
            book, not a phase transition. Two studies on either side of the
            line can be telling the same story.
          </li>
          <li>
            <strong>&quot;A large p-value means the null is true.&quot;</strong>{" "}
            No. It means you don&apos;t have evidence against the null at this
            sample size. Absence of evidence is not evidence of absence; a
            confidence interval makes that explicit, a p-value hides it.
          </li>
          <li>
            <strong>&quot;p-value measures the size of the effect.&quot;</strong>{" "}
            No. It measures how surprising the data is, which depends on sample
            size, effect size, and noise. Report Cohen&apos;s d, relative risk,
            or a confidence interval if you want size.
          </li>
          <li>
            <strong>&quot;p-value is the probability the result was due to
            chance.&quot;</strong> No. It&apos;s the probability of the data
            under the chance-only model. Subtle distinction, enormous
            consequences in interpretation.
          </li>
        </ol>
      </Section>

      <Section id="p-hacking" title="P-hacking and why one study is never enough">
        <p>
          Here&apos;s the trap. Run 20 tests at the 5% level on pure noise. On
          average, one of them comes up &quot;significant.&quot; Report only
          that one, leave the other 19 in the file drawer, and you&apos;ve
          published a false positive that looks identical to a real finding.
          That&apos;s p-hacking, and it&apos;s the engine that drove the
          replication crisis.
        </p>
        <p>
          Simmons, Nelson, and Simonsohn&apos;s 2011 paper &quot;False-Positive
          Psychology&quot; in <em>Psychological Science</em> showed that
          flexibility in data collection, analysis, and reporting can push the
          false-positive rate above 60% while every individual decision looks
          defensible. The Open Science Collaboration&apos;s 2015 paper in{" "}
          <em>Science</em> tried to replicate 100 psychology findings; only 36
          replicated at the original significance level, and the average effect
          size shrank by half.
        </p>
        <p>The mechanism is usually some combination of:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>Trying multiple outcome variables, reporting whichever hit p &lt; 0.05.</li>
          <li>
            Adding subjects until significance appears, then stopping. (Each
            additional peek inflates the false-positive rate.)
          </li>
          <li>
            Slicing the data by subgroups until one slice looks significant.
          </li>
          <li>
            Choosing the covariate set, transformation, or exclusion rule that
            gives the smallest p.
          </li>
          <li>
            Switching from a two-tailed to a one-tailed test after seeing the
            direction.
          </li>
        </ul>
        <p>
          The fix isn&apos;t to throw out p-values; it&apos;s to constrain
          analyst flexibility before the data comes in. Pre-registration
          (writing the analysis plan down on OSF or AsPredicted before
          collecting), multiple-comparisons corrections (Bonferroni, Holm,
          Benjamini-Hochberg), and reporting all outcomes - not just the
          winners - are the standard tools. The{" "}
          <Link href="/standard-deviation-calculator">standard deviation</Link>{" "}
          of a sample doesn&apos;t lie; what you choose to report about it can.
        </p>
      </Section>

      <Section id="sample-size" title="Statistical vs. practical significance">
        <p>
          A pill that lowers systolic blood pressure by 0.1 mmHg in a trial of
          200,000 people will produce a p-value near zero. That doesn&apos;t
          mean you should take it. The effect is real (probably) and clinically
          worthless. P-values scale with √n; effect sizes don&apos;t.
        </p>
        <p>
          Practical significance lives in the units the decision is being made
          in. A patient cares about millimeters of mercury, not z-scores. A
          marketing team cares about lift in conversion rate, not Wald
          statistics. The way to surface this is to report the effect size and
          its confidence interval next to the p-value.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Scenario</th>
              <th>p-value</th>
              <th>Effect size</th>
              <th>Worth acting on?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BP drug, n = 200,000</td>
              <td>&lt; 0.001</td>
              <td>0.1 mmHg</td>
              <td>No - too small to matter clinically.</td>
            </tr>
            <tr>
              <td>Tutoring program, n = 60</td>
              <td>0.12</td>
              <td>+8 percentile points</td>
              <td>Maybe - underpowered, real-world meaningful effect.</td>
            </tr>
            <tr>
              <td>A/B test on landing page, n = 5,000</td>
              <td>0.03</td>
              <td>+0.4% conversion</td>
              <td>Depends - is 0.4% worth the engineering cost?</td>
            </tr>
            <tr>
              <td>Vaccine efficacy trial, n = 40,000</td>
              <td>&lt; 0.0001</td>
              <td>95% efficacy</td>
              <td>Yes - large effect, large sample, both matter.</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section id="thresholds" title="Where does 0.05 even come from?">
        <p>
          Ronald Fisher, 1925, <em>Statistical Methods for Research Workers</em>.
          He wrote that 0.05 was &quot;convenient&quot; for routine use and
          warned that a single test isn&apos;t conclusive. The convenience
          ossified into a rule, and the rule turned into a publishability
          gate. Fisher himself revisited it later, suggesting the threshold
          should depend on the cost of being wrong.
        </p>
        <p>
          Different fields settled on different cutoffs based on stakes:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Field</th>
              <th>Conventional threshold</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Most social sciences</td>
              <td>0.05</td>
              <td>Fisher&apos;s convention, historical inertia.</td>
            </tr>
            <tr>
              <td>Clinical trials (FDA)</td>
              <td>0.05 two-tailed, often with pre-specified primary endpoint</td>
              <td>Regulatory standard; alpha-spending rules for interim looks.</td>
            </tr>
            <tr>
              <td>Particle physics (discovery)</td>
              <td>5σ ≈ 3 × 10⁻⁷</td>
              <td>You only get to discover the Higgs once; cost of false positive is enormous.</td>
            </tr>
            <tr>
              <td>Genome-wide association studies</td>
              <td>5 × 10⁻⁸</td>
              <td>Bonferroni correction for ~1 million SNPs.</td>
            </tr>
            <tr>
              <td>Benjamin et al. 2018 proposal</td>
              <td>0.005 for new claims, 0.05 as &quot;suggestive&quot;</td>
              <td>Addresses replication crisis in soft sciences.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          The rule that matters more than the cutoff: pick the threshold before
          you look at the data. Anything else is hindsight masquerading as
          inference.
        </p>
      </Section>

      <Section id="what-to-report" title="What to report instead of just &quot;p &lt; 0.05&quot;">
        <p>
          The ASA&apos;s recommendation, distilled: stop using p-values as a
          binary decision and start using them as one piece of evidence in a
          fuller picture. Concretely, every statistical claim should travel with
          four numbers, not one.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Exact p-value, not just an inequality.</strong> Report p =
            0.032, not p &lt; 0.05. The reader can apply their own threshold;
            you can&apos;t hide a borderline result behind a coarse cutoff.
          </li>
          <li>
            <strong>Effect size.</strong> Cohen&apos;s d, odds ratio, relative
            risk, mean difference - whatever fits the design. A p-value without
            an effect size tells you nothing about magnitude.
          </li>
          <li>
            <strong>Confidence interval.</strong> A 95% CI gives the range of
            effect sizes compatible with the data. If the CI is [−0.2, 8.3],
            you learned the effect could be anywhere from negligible to large;
            that&apos;s honest, where p = 0.04 would have hidden it.
          </li>
          <li>
            <strong>Pre-registered analysis or transparency about
            exploration.</strong> If the test was pre-specified, say so. If it
            wasn&apos;t, call it exploratory and don&apos;t treat the p-value
            as confirmatory evidence.
          </li>
        </ol>
        <p>
          A finding reported as &quot;d = 0.42 (95% CI 0.08-0.76), p = 0.018,
          pre-registered primary outcome&quot; tells a future replicator
          everything they need. &quot;p &lt; 0.05&quot; tells them nothing
          useful.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Reading p as the probability the null is true.",
            fix: "It&apos;s the other direction: probability of the data given the null. To get probability of the null given the data, you need Bayes&apos; rule and a prior. The ASA statement calls this misreading the &quot;single most common&quot; one.",
          },
          {
            mistake: "Treating p = 0.049 and p = 0.051 as different conclusions.",
            fix: "They&apos;re essentially the same evidence. The 0.05 line is a convention, not a discontinuity in nature. Report the exact p and let the reader judge.",
          },
          {
            mistake: "Confusing statistical and practical significance.",
            fix: "A tiny effect in a huge sample produces a tiny p-value. Always report the effect size and its confidence interval alongside p; the magnitude is the part decisions actually run on.",
          },
          {
            mistake: "Peeking at the data and adding subjects until p &lt; 0.05.",
            fix: "Each peek inflates the false-positive rate. Either fix the sample size before collecting, or use a sequential analysis with proper alpha-spending (O&apos;Brien-Fleming, Pocock).",
          },
          {
            mistake: "Running 20 tests, reporting the one that hit p &lt; 0.05.",
            fix: "At alpha = 0.05, you expect one false positive in 20 tests by chance. Use Bonferroni, Holm, or Benjamini-Hochberg corrections - or pre-register a single primary outcome.",
          },
          {
            mistake: "Calling a non-significant result &quot;no effect.&quot;",
            fix: "It means you didn&apos;t detect an effect at this sample size. The confidence interval might be wide enough to include both zero and a clinically important effect. Underpowered nulls are a known source of false reassurance.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Wasserstein & Lazar (2016): The ASA Statement on P-Values, The American Statistician",
            href: "https://www.amstat.org/asa/files/pdfs/P-ValueStatement.pdf",
          },
          {
            label: "Benjamin et al. (2018): Redefine statistical significance, Nature Human Behaviour",
            href: "https://www.nature.com/articles/s41562-017-0189-z",
          },
          {
            label: "Open Science Collaboration (2015): Estimating the reproducibility of psychological science, Science",
            href: "https://www.science.org/doi/10.1126/science.aac4716",
          },
          {
            label: "Amrhein, Greenland, McShane (2019): Retire statistical significance, Nature",
            href: "https://www.nature.com/articles/d41586-019-00857-9",
          },
          {
            label: "Simmons, Nelson, Simonsohn (2011): False-Positive Psychology, Psychological Science",
            href: "https://journals.sagepub.com/doi/10.1177/0956797611417632",
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
