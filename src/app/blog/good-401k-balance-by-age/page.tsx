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

const POST = getPostBySlug("good-401k-balance-by-age")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the Fidelity 401(k) rule of thumb?",
    answer:
      "Fidelity recommends saving 1x your salary by 30, 3x by 40, 6x by 50, 8x by 60, and 10x by 67. It assumes a 15% annual savings rate (employee plus employer), a 5.5% real return, and Social Security covering part of retirement income. The targets are multiples of your current salary, not a flat dollar number.",
  },
  {
    question: "What is the average 401(k) balance by age?",
    answer:
      "Per Vanguard&apos;s 2024 How America Saves report: under 25 averages $7,351 (median $1,948), 35-44 averages $91,281 (median $35,537), 55-64 averages $244,750 (median $87,571). Medians sit far below averages because a small number of high-balance accounts skew the mean upward. Use median when judging where you actually stand.",
  },
  {
    question: "Am I behind if I have no 401(k) at 30?",
    answer:
      "By the Fidelity target, yes. By the Vanguard median, no, because the median 25-34 balance is around $14,933. Behind the curve is fixable in your 30s. You have 30+ years of compounding left. The math is unforgiving past 50.",
  },
  {
    question: "Should I max out my 401(k) or contribute to an IRA first?",
    answer:
      "Always grab the full employer match in your 401(k) first. After that, IRAs usually offer better investment options and lower fees. The 2026 401(k) employee limit is $24,500 ($31,000 with catch-up at 50+). The IRA limit is $7,500 ($8,500 with catch-up).",
  },
  {
    question: "What savings rate hits the 10x by 67 target?",
    answer:
      "Roughly 15% of gross income, starting at 25, with a 50% employer match on the first 6%. If you start at 35, you need 20-22% to land in the same place. Start at 45 and the required rate climbs past 30%, which is why early years matter so much.",
  },
  {
    question: "What return should I assume for projections?",
    answer:
      "Fidelity&apos;s rule uses 5.5% real (after inflation). The S&P 500&apos;s long-term real return is closer to 7%, but lifecycle funds blend in bonds as you age, dragging the average down. Use 5-6% real for planning. Anything higher and you&apos;re hoping, not planning.",
  },
  {
    question: "Does the 10x target include Social Security?",
    answer:
      "Yes. Fidelity&apos;s number assumes Social Security covers roughly 25-40% of pre-retirement income, depending on earnings history. If you expect Social Security cuts, plan for 12-15x salary instead. The SSA&apos;s 2024 trustees report projects the trust fund runs short in 2033 absent legislative changes.",
  },
  {
    question: "How do I catch up if I'm 50 and behind?",
    answer:
      "Use the 50+ catch-up: an extra $7,500 in your 401(k) and $1,000 in your IRA each year. Push your savings rate to 25-30%. Delay retirement by 2-5 years; each delayed year is roughly an 8% boost to lifetime Social Security plus more compounding. Downsize housing if your home equity is large.",
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
        "https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire",
        "https://institutional.vanguard.com/content/dam/inst/iig-transformation/has/2024/pdf/has-insights/how-america-saves-report-2024.pdf",
        "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits",
        "https://www.ssa.gov/oact/TR/2024/",
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
          Finance · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          Fidelity says 1x salary by 30, 3x by 40, 10x by 67. Useful benchmark
          or unrealistic? Run the math on three real careers and you decide.
          We&apos;ll walk a $50k starter, an $80k mid-career engineer, and a
          $150k high earner through 40 years of compounding, then show where
          the rule breaks.
        </p>
      </header>

      <CTACard
        slug="ira-calculator"
        label="Project your own number"
        title="Use our IRA & Retirement Calculator"
        body="The post walks the math by hand so you can sanity-check what the planner tells you. Once you understand the levers (savings rate, return assumption, years of compounding), the calculator will swap in your real salary, balance, and timeline in 30 seconds."
      />

      <Section id="the-fidelity-rule" title="The Fidelity rule, exactly as written">
        <p>
          Fidelity publishes the most-cited 401(k) benchmark in the US.
          It&apos;s a salary multiple, not a flat dollar amount, which is the
          first thing most people get wrong about it.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Age</th>
              <th>Target balance</th>
              <th>Example at $80k salary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>30</td>
              <td>1× current salary</td>
              <td>$80,000</td>
            </tr>
            <tr>
              <td>35</td>
              <td>2×</td>
              <td>$160,000</td>
            </tr>
            <tr>
              <td>40</td>
              <td>3×</td>
              <td>$240,000</td>
            </tr>
            <tr>
              <td>45</td>
              <td>4×</td>
              <td>$320,000</td>
            </tr>
            <tr>
              <td>50</td>
              <td>6×</td>
              <td>$480,000</td>
            </tr>
            <tr>
              <td>55</td>
              <td>7×</td>
              <td>$560,000</td>
            </tr>
            <tr>
              <td>60</td>
              <td>8×</td>
              <td>$640,000</td>
            </tr>
            <tr>
              <td>67</td>
              <td>10×</td>
              <td>$800,000</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          The assumptions baked in: you save 15% of gross income every year
          starting at 25, you earn a 5.5% real return after inflation, you
          retire at 67 (full Social Security age for anyone born after 1960),
          and Social Security covers about a third of pre-retirement income.
          Change any of those and the multiples shift.
        </p>
      </Section>

      <Section id="trajectory-50k" title="Trajectory 1: The $50k starter">
        <p>
          Sarah graduates at 22, takes a $50k job in Columbus, contributes 6%
          to grab the full 3% employer match. Her salary grows 3% a year for
          inflation plus 1% real. By 67 she earns about $130k in today&apos;s
          dollars.
        </p>
        <p>
          Total contribution rate: 9% of salary. Return: 6% real (slightly
          aggressive for a target-date fund but reasonable for a 100% equity
          allocation in early years).
        </p>
        <WorkedSteps
          steps={[
            { label: "Starting salary at 22", value: "$50,000" },
            { label: "Annual contribution (9% of salary)", value: "$4,500 year 1" },
            { label: "Balance at 30 (8 years in)", value: "$48,200 — below Fidelity 1× target of $54k" },
            { label: "Balance at 40", value: "$185,000 — below 3× target of $200k" },
            { label: "Balance at 50", value: "$465,000 — below 6× target of $540k" },
            { label: "Balance at 67", value: "$1.42M — short of 10× ($1.3M target, so close)" },
          ]}
        />
        <p>
          Sarah lands within shouting distance of the 10x target without
          extraordinary effort. The math works because she started at 22 and
          captured the full employer match every year. A 401(k) employer match
          is the closest thing to free money in the tax code; skipping it is
          the single most expensive mistake a young earner can make.
        </p>
        <p>
          The catch: if Sarah pauses contributions for five years in her 30s
          (kids, a sabbatical, a layoff), her end balance drops to roughly
          $1.05M. Those five years cost her $370k in compounding.
        </p>
      </Section>

      <Section id="trajectory-80k" title="Trajectory 2: The $80k mid-career pivot">
        <p>
          Mike spent his 20s paying off student loans and didn&apos;t start a
          401(k) until 32. He earns $80k as a software engineer, contributes
          10% with a 5% employer match (15% total), and aims to retire at 65.
        </p>
        <Formula>
          FV = PMT × [((1 + r)<sup>n</sup> − 1) ÷ r]
        </Formula>
        <p>
          The future-value-of-an-annuity formula. PMT is annual contribution,
          r is real return, n is years. For a deeper dive on how time and rate
          interact, see our <Link href="/time-value-of-money-calculator">time value of money calculator</Link>.
        </p>
        <WorkedSteps
          steps={[
            { label: "Starting salary at 32", value: "$80,000" },
            { label: "Total contribution (15%)", value: "$12,000 year 1, grows with salary" },
            { label: "Years of contributions", value: "33 (age 32 to 65)" },
            { label: "Balance at 40 (8 years in)", value: "$135,000 — below 3× target of $240k" },
            { label: "Balance at 50", value: "$485,000 — close to 6× target of $480k" },
            { label: "Balance at 60", value: "$1.12M — above 8× target of $640k" },
            { label: "Balance at 65", value: "$1.72M — well above 10× ($800k) at 67 target" },
          ]}
        />
        <p>
          Mike starts ten years behind Sarah but contributes 67% more per year
          relative to salary. The 15% rate is the Fidelity sweet spot, and it
          carries him from looking hopelessly behind at 40 to comfortably
          ahead by 60. Compounding rewards higher contribution rates more in
          the back half of a career than the front, because the dollars are
          larger.
        </p>
        <p>
          Where Mike still loses ground: he can&apos;t use the years 22-31.
          Sarah&apos;s $50k starter ends with more lifetime contributions
          dollar-for-dollar despite a lower salary, because her first $4,500
          gets 45 years of growth instead of 33.
        </p>
      </Section>

      <Section id="trajectory-150k" title="Trajectory 3: The $150k high earner">
        <p>
          Priya makes $150k at 35 after an MBA and clears the 401(k) employee
          limit ($24,500 in 2026) every year. Employer adds 6%, so total going
          in is roughly 22% of comp. She also funds a backdoor Roth IRA at the
          $7,500 limit, but we&apos;ll keep this projection 401(k)-only to
          match the topic.
        </p>
        <WorkedSteps
          steps={[
            { label: "Starting salary at 35", value: "$150,000" },
            { label: "Total 401(k) contribution", value: "$33,500 year 1 (capped at IRS limits)" },
            { label: "Balance at 40 (5 years in)", value: "$195,000 — below 3× target of $450k" },
            { label: "Balance at 50", value: "$770,000 — below 6× target of $900k" },
            { label: "Balance at 60", value: "$1.92M — above 8× target of $1.2M" },
            { label: "Balance at 67", value: "$3.4M — above 10× target of $1.5M" },
          ]}
        />
        <p>
          Priya looks behind at 40 and 50 because the Fidelity multiples scale
          with salary, and high earners get hammered by IRS contribution
          limits. She can&apos;t save 15% of $150k inside her 401(k); the
          $24,500 employee cap is 16% of her gross. Once you cross roughly
          $160k in salary, the standard 401(k) alone can&apos;t carry you to
          the multiplier targets and you need taxable brokerage or a
          mega-backdoor Roth to fill the gap.
        </p>
        <p>
          Past 55, Priya pulls ahead fast. The 50+ catch-up adds $7,500/year.
          By 60 she&apos;s above target. By 67 she&apos;s sitting on roughly
          22x salary, more than double the rule.
        </p>
        <p>
          For the cash sitting outside her 401(k) while she waits to deploy
          it, a <Link href="/money-market-calculator">money market account</Link> typically
          beats a regular checking account by 4-5 percentage points in 2026.
        </p>
      </Section>

      <Section id="what-rate-hits-target" title="What savings rate hits the 10x target?">
        <p>
          Strip away the trajectories and the question collapses to one
          variable: what percentage of gross income do you need to save?
          Answer depends almost entirely on when you start.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Start age</th>
              <th>Years to 67</th>
              <th>Required savings rate</th>
              <th>Including 3% employer match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>25</td>
              <td>42</td>
              <td>12%</td>
              <td>9% from you</td>
            </tr>
            <tr>
              <td>30</td>
              <td>37</td>
              <td>15%</td>
              <td>12% from you</td>
            </tr>
            <tr>
              <td>35</td>
              <td>32</td>
              <td>20%</td>
              <td>17% from you</td>
            </tr>
            <tr>
              <td>40</td>
              <td>27</td>
              <td>26%</td>
              <td>23% from you</td>
            </tr>
            <tr>
              <td>45</td>
              <td>22</td>
              <td>34%</td>
              <td>31% from you</td>
            </tr>
            <tr>
              <td>50</td>
              <td>17</td>
              <td>45%+</td>
              <td>Hits IRS limits before target</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          Two things jump out. First, every five-year delay roughly triples
          the required savings rate by the time you hit 50. Second, the
          contribution limits become the binding constraint past 50, which is
          why catch-up contributions exist and why the 401(k) alone stops
          being enough.
        </p>
      </Section>

      <Section id="where-rule-breaks" title="Where the Fidelity rule breaks">
        <p>
          The 10x multiplier is a useful benchmark for someone who earns
          $50k-$120k, works continuously from 25 to 67, and gets a normal
          employer match. It breaks at the edges:
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>High earners ($200k+).</strong> The IRS 401(k) limit
            doesn&apos;t scale with salary. 10x at $250k is $2.5M; you
            literally cannot put enough into a 401(k) to hit it without help
            from a brokerage account or a mega-backdoor Roth.
          </li>
          <li>
            <strong>Lower earners.</strong> 10x of a $40k salary is $400k,
            which sounds modest until you realize Social Security replaces a
            larger share of low income (roughly 55% vs 25-30% for high
            earners), so the target is over-engineered. 6-8x is probably
            enough.
          </li>
          <li>
            <strong>Pension holders.</strong> Teachers, government employees,
            and union workers with defined-benefit pensions already have a
            big chunk of retirement income locked in. 4-5x in the 401(k) is
            often sufficient.
          </li>
          <li>
            <strong>Late starters.</strong> If you start at 45, the
            multiplier targets are demoralizing and impossible. Better
            benchmark: aim for 25× annual spending (the 4% rule), not 10×
            salary. Spending and salary are different numbers.
          </li>
          <li>
            <strong>Anyone planning early retirement.</strong> Retire at 55,
            not 67, and you need 12 extra years of withdrawals plus no
            Social Security until 62. The number jumps to 14-16x salary.
          </li>
        </ol>
        <p>
          A better single rule for most people: save 15% of gross income
          starting in your 20s, increase by 1% every year you get a raise
          until you hit 20%, never touch it. That mechanical rule does
          everything the multiplier targets do and you can run it without
          recalculating each year.
        </p>
      </Section>

      <Section id="behind-now-what" title="If you're behind: a real catch-up plan">
        <p>
          Most readers are behind some version of this curve. The Vanguard
          2024 medians say so directly. Behind isn&apos;t fatal; behind plus
          inaction is.
        </p>
        <p>Five moves, ranked by impact-per-effort:</p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Capture the full employer match. Today.</strong> If your
            match is 50% on the first 6%, contributing 6% gets you a 50%
            instant return. Skipping it because you&apos;re &quot;not ready
            yet&quot; is the most expensive mistake on this list.
          </li>
          <li>
            <strong>Auto-escalate 1% per year.</strong> Most plans let you
            set this once and forget. You won&apos;t feel the raise getting
            partially absorbed; by year five you&apos;re saving 15% without
            ever &quot;deciding&quot; to.
          </li>
          <li>
            <strong>Open an IRA for the next dollar.</strong> After the
            match, IRAs typically have lower fees and better fund choices.
            See the <Link href="/ira-calculator">IRA calculator</Link> for
            traditional vs Roth math at your bracket.
          </li>
          <li>
            <strong>Use the 50+ catch-up.</strong> An extra $7,500/year in
            the 401(k) and $1,000 in the IRA from age 50. Over 17 years to
            retirement, that&apos;s an additional $215k saved plus
            compounding.
          </li>
          <li>
            <strong>Delay retirement two years.</strong> Each year past 62
            boosts Social Security by roughly 8% until 70. Two extra working
            years also means two fewer withdrawal years. The combination is
            worth ~25% of your nest egg in lifetime income.
          </li>
        </ol>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Comparing your balance to averages, not medians.",
            fix: "The Vanguard 35-44 average is $91,281 but the median is $35,537. Averages get dragged up by a handful of $5M accounts. If you&apos;re at the median, you&apos;re right in the middle of your peer group, not behind.",
          },
          {
            mistake: "Treating the 10x target as a dollar amount instead of a multiplier.",
            fix: "10x means 10 times your current salary, which grows as you get raises. The target moves with you. Someone who hit $500k at 45 thinking they&apos;re done is wrong if their salary just jumped to $200k.",
          },
          {
            mistake: "Skipping the employer match to pay off low-rate debt.",
            fix: "A 50% match is a 50% instant return. The only debt that beats it is consumer credit cards at 20%+. Mortgage at 4%? Student loans at 6%? Take the match first, always.",
          },
          {
            mistake: "Assuming you&apos;ll work until 67.",
            fix: "Per the Employee Benefit Research Institute&apos;s 2024 Retirement Confidence Survey, the median worker plans to retire at 65 but actually retires at 62. Plan for involuntary early retirement (layoff, health, family).",
          },
          {
            mistake: "Picking the highest-return fund without checking the expense ratio.",
            fix: "A 1% fee compounded over 40 years eats roughly 25% of your final balance. Target-date funds at Vanguard, Fidelity, and Schwab are 0.04-0.15%. Avoid anything above 0.5% unless you have a specific reason.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Fidelity: How much do I need to retire? (Age-based savings benchmarks)",
            href: "https://www.fidelity.com/viewpoints/retirement/how-much-do-i-need-to-retire",
          },
          {
            label: "Vanguard: How America Saves 2024 (median and average balances by age)",
            href: "https://institutional.vanguard.com/content/dam/inst/iig-transformation/has/2024/pdf/has-insights/how-america-saves-report-2024.pdf",
          },
          {
            label: "IRS: 401(k) and Profit-Sharing Plan Contribution Limits",
            href: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits",
          },
          {
            label: "SSA: 2024 OASDI Trustees Report",
            href: "https://www.ssa.gov/oact/TR/2024/",
          },
          {
            label: "EBRI: 2024 Retirement Confidence Survey",
            href: "https://www.ebri.org/retirement/retirement-confidence-survey",
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
