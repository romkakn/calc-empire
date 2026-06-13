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

const POST = getPostBySlug("mean-median-mode-when-to-use")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between mean, median, and mode?",
    answer:
      "The mean is the arithmetic average: add everything up, divide by the count. The median is the middle value when you sort the data. The mode is whatever value shows up most often. Three different questions, three different answers.",
  },
  {
    question: "When should I use median instead of mean?",
    answer:
      "Use the median when the data has outliers or a skewed shape. Incomes, home prices, response times, and net worth are all heavily right-skewed. The mean drifts toward the tail; the median sits where the typical case actually lives.",
  },
  {
    question: "Why is median income lower than mean income?",
    answer:
      "Because a few extremely high earners pull the mean up. The Census Bureau reports median US household income near $80,610 (2023), while the mean is roughly $114,500. The $34,000 gap is the outlier effect at work.",
  },
  {
    question: "Can a dataset have more than one mode?",
    answer:
      "Yes. A set with two modes is bimodal, three or more is multimodal. Shoe sizes in a store often look bimodal because men and women cluster around different peaks. If every value appears the same number of times, statisticians usually say there's no mode.",
  },
  {
    question: "Which measure is best for skewed data?",
    answer:
      "The median, almost always. It ignores the magnitude of outliers and reports the middle of the distribution. For income, housing, wealth, and any duration-style metric (page load, support response, surgery wait), lead with median.",
  },
  {
    question: "Is the mode useful for numeric data?",
    answer:
      "Rarely. Mode shines on categorical data: most-sold product, most-common diagnosis, most-common shoe size. For continuous numbers like income or weight, the mode is usually a binning artifact and not very meaningful.",
  },
  {
    question: "How do outliers affect the mean?",
    answer:
      "A single extreme value can move the mean by a lot, especially in small samples. Add Jeff Bezos to a room of 100 people and the average net worth jumps into the billions. The median barely moves because only one position in the sorted list changed.",
  },
  {
    question: "What does the gap between mean and median tell me?",
    answer:
      "It signals skew and inequality. Mean much higher than median: right-skewed (income, wealth, wait times). Mean much lower than median: left-skewed (test scores with a ceiling, exam pass rates). Mean equals median: roughly symmetric, often normal.",
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
        "https://www.census.gov/library/publications/2024/demo/p60-282.html",
        "https://www.bls.gov/cps/cpsaat39.htm",
        "https://www.nist.gov/pml/sed/statistical-engineering-division",
        "https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf",
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
          Average US household income is around $114,500. Typical US household
          income is around $80,610. Both numbers are correct. One is the mean,
          one is the median, and the $34,000 gap between them tells you more
          about American inequality than either number alone. Five datasets
          below, and which measure each one calls for.
        </p>
      </header>

      <CTACard
        slug="average-calculator"
        label="Skip the math"
        title="Use our Average Calculator"
        body="Paste a list, get mean, median, and mode in one shot. The post below is for people who want to know which one to actually report, and why picking the wrong one quietly misleads the reader."
      />

      <Section id="three-definitions" title="The three numbers, in one paragraph">
        <p>
          <strong>Mean</strong> is the arithmetic average. Sum the values,
          divide by how many you have. <strong>Median</strong> is the middle
          value after you sort the list, or the average of the two middle
          values if the count is even. <strong>Mode</strong> is the value that
          appears most often, with no math involved beyond counting.
        </p>
        <p>
          The trap is that all three answer questions phrased almost
          identically. &quot;What&apos;s a typical income?&quot; sounds like
          one question. It&apos;s three. The right one depends on whether the
          distribution is symmetric, whether outliers exist, and whether the
          data is numeric or categorical.
        </p>
        <Formula>
          mean = (x<sub>1</sub> + x<sub>2</sub> + ... + x<sub>n</sub>) / n
        </Formula>
        <p>
          For a quick numeric example, the set {`{2, 4, 4, 4, 5, 6, 100}`} has
          a mean of 17.86, a median of 4, and a mode of 4. The mean is
          nowhere near any actual data point. That&apos;s the lie people are
          worried about when they say &quot;averages lie.&quot; They mean the
          mean lies, in the presence of outliers. Run the same numbers
          through the <Link href="/median-calculator">median calculator</Link>{" "}
          and the answer matches what your eyes already told you.
        </p>
      </Section>

      <Section id="income" title="Dataset 1: US household income">
        <p>
          The Census Bureau publishes both numbers every year in Report P60.
          For 2023:
        </p>
        <WorkedSteps
          steps={[
            { label: "Median household income (2023)", value: "$80,610" },
            { label: "Mean household income (2023)", value: "≈ $114,500" },
            { label: "Mean ÷ median ratio", value: "1.42" },
            { label: "Skew direction", value: "Right (positive)" },
            { label: "Honest summary for a reader", value: "Median" },
          ]}
        />
        <p>
          The gap exists because income distributions have a long right tail.
          Most households cluster between $30k and $150k. Then there&apos;s
          a thin tail of $1M, $10M, and $100M+ earners. Those handful of
          billionaires don&apos;t change where most people live, but they
          drag the mean up by tens of thousands of dollars.
        </p>
        <p>
          When a news headline reports &quot;average American makes $X,&quot;
          read it as a tell. If the writer means the median, the number sits
          near where the typical reader lives. If they mean the arithmetic
          mean, they&apos;ve quietly included Elon Musk in the average. Both
          can be defended; only one matches the intuitive sense of
          &quot;typical.&quot;
        </p>
        <p>
          The mode is useless here. Almost no two households earn exactly the
          same dollar amount, so the mode is whatever rounding bin you
          picked, and it tells you about your binning more than about
          incomes.
        </p>
      </Section>

      <Section id="home-prices" title="Dataset 2: home sale prices">
        <p>
          Same shape, sharper outliers. Zillow and Redfin both lead with
          median sale price, and for good reason. Take a sample week of
          single-family closings in a mixed neighborhood:
        </p>
        <WorkedSteps
          steps={[
            { label: "Sample sales", value: "$320k, $355k, $410k, $445k, $480k, $510k, $2.8M" },
            { label: "Count", value: "7" },
            { label: "Sum", value: "$5,320,000" },
            { label: "Mean", value: "$760,000" },
            { label: "Median (4th value sorted)", value: "$445,000" },
            { label: "Most honest summary", value: "Median" },
          ]}
        />
        <p>
          One $2.8M sale dragged the mean to $760k, a number that doesn&apos;t
          describe any actual house in the sample. The median of $445k sits
          inside the cluster six of the seven houses belong to. If you&apos;re
          a buyer trying to read a market, the median is the only number that
          tells you what a normal house in this neighborhood costs.
        </p>
        <p>
          The S&amp;P CoreLogic Case-Shiller Index, the National Association
          of Realtors, and HUD all report medians for the same reason. When
          the gap between median and mean home price in a metro widens,
          that&apos;s usually news: it means the high end pulled away from
          the middle, not that everyone got richer.
        </p>
      </Section>

      <Section id="test-scores" title="Dataset 3: test scores (the other direction)">
        <p>
          Now flip the shape. A 50-question exam where most students did
          well and a handful did badly looks like this:
        </p>
        <WorkedSteps
          steps={[
            { label: "Scores", value: "12, 28, 41, 44, 45, 46, 47, 48, 49, 50" },
            { label: "Count", value: "10" },
            { label: "Sum", value: "410" },
            { label: "Mean", value: "41.0" },
            { label: "Median (avg of 5th and 6th)", value: "45.5" },
            { label: "Mode", value: "No mode (every value unique)" },
            { label: "Skew direction", value: "Left (negative)" },
          ]}
        />
        <p>
          Mean below median means a left-skewed distribution. Two students
          who tanked the exam pulled the mean down to 41. The median of 45.5
          better describes how the typical student performed. Teachers who
          report the mean alone make a passing class look struggling; the
          median plus a note about the two low scores tells the real story.
        </p>
        <p>
          Test data with a ceiling (a max score everyone bunches against)
          is one of the cleanest examples of left skew you&apos;ll see in
          the wild. Survey satisfaction scores capped at 5 stars behave the
          same way: tons of 5s, a few angry 1s, and a mean that lands
          somewhere in the 4s while the median sits at 5. Pair this with a{" "}
          <Link href="/standard-deviation-calculator">
            standard deviation calculator
          </Link>{" "}
          and you&apos;ll see the spread that the mean alone hides.
        </p>
      </Section>

      <Section id="response-times" title="Dataset 4: API response times (where p50 lives)">
        <p>
          Engineers don&apos;t report the mean response time of an API.
          They report p50, p95, and p99: the 50th, 95th, and 99th
          percentiles. The 50th percentile is the median. The reason is the
          same reason housing reports use median, with extra teeth.
        </p>
        <WorkedSteps
          steps={[
            { label: "Sample latencies (ms)", value: "42, 45, 48, 51, 53, 55, 58, 60, 63, 2,800" },
            { label: "Mean", value: "327.5 ms" },
            { label: "Median (p50)", value: "54 ms" },
            { label: "p95", value: "≈ 2,556 ms" },
            { label: "What an SLO targets", value: "p50, p95, p99 (not mean)" },
          ]}
        />
        <p>
          One stalled request in the tail moved the mean by a factor of
          six. The median didn&apos;t budge. Google&apos;s site reliability
          handbook is explicit about this: report percentiles, set SLOs on
          percentiles, and treat the mean response time as a red flag if
          it&apos;s the only number a team has. The mean hides the tail
          where users actually feel pain.
        </p>
        <p>
          This is the same logic as income, dressed in engineering
          clothes. The tail of slow requests is the billionaire of the API
          world. You can&apos;t average it away; you have to look at it
          directly.
        </p>
      </Section>

      <Section id="shoe-sizes" title="Dataset 5: shoe sizes (finally, the mode wins)">
        <p>
          Four sections in, the mode has been a benchwarmer. Here&apos;s
          where it earns its place. A store sells shoes in discrete sizes:
          7, 7.5, 8, 8.5, 9, and so on. A week of sales might look like:
        </p>
        <WorkedSteps
          steps={[
            { label: "Sales by size", value: "7: 4, 7.5: 6, 8: 11, 8.5: 14, 9: 9, 9.5: 5, 10: 3" },
            { label: "Count of sales", value: "52" },
            { label: "Mean size", value: "8.41" },
            { label: "Median size", value: "8.5" },
            { label: "Mode", value: "8.5" },
            { label: "What to restock first", value: "8.5, then 8, then 9" },
          ]}
        />
        <p>
          The buyer ordering next month&apos;s stock doesn&apos;t care about
          the mean shoe size. There&apos;s no such thing as size 8.41; the
          factory doesn&apos;t make it. The mode tells the buyer which size
          to stock most. The median confirms that half the sales sit at or
          below 8.5, which is the same thing the mode is saying for this
          shape of data.
        </p>
        <p>
          The mode is the right answer for any categorical or discrete
          dataset where you need to pick a single bin: most-common
          diagnosis in an ER, most-common product SKU, most-common bug
          source in a sprint, most-common shirt size. The arithmetic mean
          of these is a category error, literally.
        </p>
      </Section>

      <Section id="picking" title="A 30-second rule for picking">
        <p>
          Most of statistics teaching makes this harder than it is. The
          decision usually collapses to three questions:
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Is the data categorical?</strong> Mode. End of decision.
          </li>
          <li>
            <strong>Is the data numeric and roughly symmetric?</strong> Mean
            is fine, and it carries useful properties (it plays well with
            standard deviation, hypothesis tests, and regression). Heights,
            adult weights within a population, manufacturing tolerances,
            many physical measurements.
          </li>
          <li>
            <strong>Is the data numeric and skewed, or has outliers?</strong>{" "}
            Median. Income, home prices, response times, wait times, net
            worth, file sizes, ad revenue per user. If you&apos;re ever
            tempted to drop outliers before computing the mean, that&apos;s
            your gut telling you to use the median instead.
          </li>
        </ol>
        <p>
          When in real doubt, report both. A 2016 American Statistical
          Association statement on responsible data reporting argues that a
          single summary number almost always misleads; pairing the mean
          with the median (and often the standard deviation) gives readers
          enough to spot skew on their own. Plug your numbers into the{" "}
          <Link href="/average-calculator">average calculator</Link> to get
          all three at once.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Reporting mean income, wealth, or home price as &quot;typical.&quot;",
            fix: "Use the median for any heavily skewed dollar metric. The Census, NAR, and Fed all do this. If a headline says &quot;average,&quot; check whether they mean arithmetic mean (often) or median (rarely, but more honest).",
          },
          {
            mistake: "Quoting a mode for continuous data without binning.",
            fix: "On continuous data like income or weight, the raw mode is whatever value happened to repeat once, which is noise. If you need a most-common bucket, bin the data first (e.g., income brackets of $10k) and report the mode of those bins.",
          },
          {
            mistake: "Dropping outliers to make the mean &quot;look right.&quot;",
            fix: "If you find yourself trimming the data so the mean matches your intuition, you&apos;re reaching for the median the hard way. Just compute the median directly. Document the trim only if there&apos;s a real data-quality reason (sensor error, duplicate entry).",
          },
          {
            mistake: "Treating &quot;average response time&quot; as a service health metric.",
            fix: "Report p50, p95, p99. A 50 ms mean can hide a tail of 5-second requests that affects 1% of users every minute. Google&apos;s SRE book and most modern observability platforms default to percentiles for this reason.",
          },
          {
            mistake: "Saying a dataset &quot;has no mode&quot; when every value is unique.",
            fix: "By the strict definition, a set where every value appears once has no mode. In practice, this is also a sign that mode wasn&apos;t the right measure for the data. Switch to mean or median depending on shape.",
          },
          {
            mistake: "Comparing means across groups of different size without weighting.",
            fix: "If group A has 10 people and group B has 1,000, the simple mean of their means is misleading. Use a weighted mean, or report the medians of each group separately.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "US Census Bureau: Income in the United States, 2023 (P60-282)",
            href: "https://www.census.gov/library/publications/2024/demo/p60-282.html",
          },
          {
            label: "Bureau of Labor Statistics: Median weekly earnings tables (CPS)",
            href: "https://www.bls.gov/cps/cpsaat39.htm",
          },
          {
            label: "ASA Statement on Statistical Significance and P-Values (2016)",
            href: "https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf",
          },
          {
            label: "NIST/SEMATECH e-Handbook of Statistical Methods",
            href: "https://www.itl.nist.gov/div898/handbook/",
          },
          {
            label: "Google SRE Book: Service Level Objectives (percentiles)",
            href: "https://sre.google/sre-book/service-level-objectives/",
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
