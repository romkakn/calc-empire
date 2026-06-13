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

const POST = getPostBySlug("roth-vs-traditional-ira")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the 2024 IRA contribution limit?",
    answer:
      "$7,000 for anyone under 50, $8,000 if you&apos;re 50 or older (the $1,000 catch-up). That limit is combined across all your IRAs - Roth and Traditional together, not per account. The IRS confirms these figures in Notice 2023-75.",
  },
  {
    question: "Can I contribute to a Roth IRA at any income level?",
    answer:
      "No. Roth contributions phase out between $146,000 and $161,000 MAGI for single filers in 2024, and $230,000 to $240,000 for married filing jointly. Above the top of the band, direct Roth contributions are zero. The backdoor Roth still works above the cap.",
  },
  {
    question: "Are Traditional IRA contributions always deductible?",
    answer:
      "Only if neither you nor your spouse is covered by a workplace retirement plan, or your income falls below the deductibility phase-out. If you have a 401(k) at work, the 2024 deduction phases out between $77,000 and $87,000 single, $123,000 to $143,000 joint.",
  },
  {
    question: "When do Required Minimum Distributions start?",
    answer:
      "Traditional IRAs require RMDs starting at age 73 under SECURE 2.0 (75 if you were born in 1960 or later). Roth IRAs have no RMDs during the owner&apos;s lifetime, which is one of the largest planning differences between the two accounts.",
  },
  {
    question: "What is a Roth conversion ladder?",
    answer:
      "Converting Traditional IRA dollars to Roth in years your income (and tax bracket) is low, paying the tax now to skip RMDs and future tax later. The classic window is the gap between retirement and Social Security or pension income kicking in. Each conversion has its own 5-year clock.",
  },
  {
    question: "Roth or Traditional if I expect lower income in retirement?",
    answer:
      "The textbook answer is Traditional, but it&apos;s often wrong. RMDs, Social Security taxation, IRMAA brackets, and surviving-spouse rates routinely push retirees into higher effective brackets than they planned for. Run the math, don&apos;t assume.",
  },
  {
    question: "Does my employer 401(k) match affect IRA choice?",
    answer:
      "Indirectly. Always capture the full match first - it&apos;s a guaranteed 50% or 100% return that beats any IRA decision. After the match, IRA contributions are the next priority for most households. The 401(k) match is unrelated to Roth-vs-Traditional inside the IRA.",
  },
  {
    question: "Can I withdraw Roth contributions early without penalty?",
    answer:
      "Yes. Direct Roth contributions (not earnings, not conversions) come out any time, any age, tax-free and penalty-free. That makes a Roth IRA double as an emergency backstop, which a Traditional IRA can&apos;t. Conversions have a 5-year wait.",
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
        "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits",
        "https://www.irs.gov/pub/irs-drop/n-23-75.pdf",
        "https://www.congress.gov/bill/117th-congress/house-bill/2954",
        "https://www.ssa.gov/benefits/retirement/planner/taxes.html",
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
          Most guides reduce this to one question: will your tax rate be higher
          now or later? That heuristic skips three larger drivers - the employer
          match cap, the Roth income phase-outs, and the RMD problem that
          doesn&apos;t exist for Roth dollars. Below is the actual decision tree
          a planner uses, with the IRS numbers for 2024 and a worked case at a
          $120,000 household income.
        </p>
      </header>

      <CTACard
        slug="ira-calculator"
        label="Run the numbers"
        title="Use our IRA Calculator"
        body="Project Roth and Traditional balances side by side under your own assumptions for contribution amount, growth rate, current bracket, and retirement bracket. The decision tree below tells you which inputs actually matter."
      />

      <Section id="the-trap" title="The tax-rate heuristic, and why it fails">
        <p>
          The standard advice goes like this: if you expect to be in a higher
          tax bracket in retirement, pick Roth. If you expect lower, pick
          Traditional. It&apos;s clean, it&apos;s symmetric, and for the median
          household it&apos;s incomplete.
        </p>
        <p>
          The math behind the heuristic only works when three things hold: your
          marginal rate at contribution equals your average rate at withdrawal,
          you contribute the same dollar amount to either account, and you have
          full eligibility for both. None of those usually hold.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Marginal vs average.</strong> You contribute at your top
            bracket and withdraw across the full bracket stack. The withdrawal
            blended rate is almost always lower than your marginal rate today.
          </li>
          <li>
            <strong>Contribution parity.</strong> $7,000 to Roth is not equal to
            $7,000 to Traditional. Roth is post-tax, Traditional is pre-tax. A
            fair comparison adjusts for the tax savings you reinvest, and most
            people don&apos;t.
          </li>
          <li>
            <strong>Eligibility.</strong> Income phase-outs cap direct Roth
            contributions and the Traditional deduction. Above certain
            thresholds, the choice is made for you.
          </li>
        </ul>
        <p>
          Strip the heuristic away and the decision is a five-node tree. We&apos;ll
          walk it from the top.
        </p>
      </Section>

      <Section id="node-1-match" title="Node 1: Are you capturing the full employer 401(k) match?">
        <p>
          Before we touch the IRA question, settle the 401(k) one. A 100% match
          on the first 3% of salary is a guaranteed 100% return - in a single
          year, before market returns kick in. No IRA decision beats that.
        </p>
        <p>
          If you&apos;re leaving match money on the table and putting that cash
          into an IRA instead, you&apos;ve picked the wrong account. Fix the
          match first, then come back to this article. The order of priority for
          most households:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-1">
          <li>401(k) up to the full employer match.</li>
          <li>HSA if you have a qualified high-deductible plan.</li>
          <li>IRA (Roth or Traditional - this article).</li>
          <li>401(k) up to the federal limit ($23,000 for 2024).</li>
          <li>Taxable brokerage.</li>
        </ol>
        <p>
          The IRA fight only matters once the match is locked in. If you want to
          model how the IRA fits with the rest of your retirement picture, our{" "}
          <Link href="/ira-calculator" className="text-[var(--md-sys-color-primary)] underline underline-offset-4">
            IRA calculator
          </Link>{" "}
          handles the contribution-by-contribution growth math and lets you
          stress-test a few withdrawal scenarios.
        </p>
      </Section>

      <Section id="node-2-phaseouts" title="Node 2: What are your income phase-outs?">
        <p>
          The IRS sets a Modified AGI band for each account type. Cross the top
          of the band and the door closes. The 2024 numbers, straight from IRS
          Notice 2023-75:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Filing status</th>
              <th>Roth contribution phase-out</th>
              <th>Traditional deduction phase-out (covered by workplace plan)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Single / Head of household</td>
              <td>$146,000 – $161,000</td>
              <td>$77,000 – $87,000</td>
            </tr>
            <tr>
              <td>Married filing jointly</td>
              <td>$230,000 – $240,000</td>
              <td>$123,000 – $143,000</td>
            </tr>
            <tr>
              <td>Married filing separately</td>
              <td>$0 – $10,000</td>
              <td>$0 – $10,000</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          Three real branches come out of this node:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Below both bands:</strong> you have a full choice. The rest
            of the tree matters.
          </li>
          <li>
            <strong>Above the Roth band:</strong> direct Roth is closed. You can
            either go Traditional (deductible if you&apos;re also below that
            band, non-deductible if you&apos;re above) or run a backdoor Roth.
            Pre-existing pre-tax IRA balances complicate the backdoor via the
            pro-rata rule.
          </li>
          <li>
            <strong>Above the Traditional deduction band but below Roth:</strong>{" "}
            Roth wins by default. The Traditional contribution is post-tax going
            in and taxable on the growth coming out - the worst of both worlds.
          </li>
        </ul>
        <p>
          Note that MAGI is not your gross salary. It starts with AGI and adds
          back student loan interest, foreign earned income exclusion, and a few
          smaller items. If you&apos;re close to a band edge, our{" "}
          <Link href="/agi-calculator" className="text-[var(--md-sys-color-primary)] underline underline-offset-4">
            AGI calculator
          </Link>{" "}
          will get you closer than a back-of-napkin estimate.
        </p>
      </Section>

      <Section id="node-3-rmds" title="Node 3: How exposed are you to RMDs?">
        <p>
          Required Minimum Distributions are the single most underrated factor
          in this decision. The IRS forces you to start drawing down your
          Traditional IRA at age 73 (75 if born after 1959, per SECURE 2.0). The
          first-year withdrawal is around 3.8% of the balance, climbing to 6.3%
          by age 85.
        </p>
        <p>
          Roth IRAs have no RMDs for the original owner. None. You can let the
          balance compound until your kids inherit it, then they get 10 more
          years under the SECURE Act inherited-IRA rules.
        </p>
        <Formula>
          first-year RMD ≈ balance ÷ 26.5 (Uniform Lifetime Table, age 73)
        </Formula>
        <p>
          For someone with $1.5M in Traditional at age 73, that&apos;s a forced
          $56,600 withdrawal in year one, taxable as ordinary income. Stack that
          on top of Social Security and any pension, and the retiree who
          &quot;expected a lower bracket&quot; is now in 24% or 32% federal,
          paying IRMAA surcharges on Medicare premiums, and watching 85% of
          Social Security get taxed.
        </p>
        <p>
          The RMD problem grows with the balance. If you&apos;re a strong saver,
          this argument tilts harder toward Roth than the tax-rate heuristic
          suggests.
        </p>
      </Section>

      <Section id="node-4-bracket" title="Node 4: Now (and only now) compare brackets">
        <p>
          With the match, phase-outs, and RMD picture set, the bracket question
          becomes useful. The right comparison is your current marginal federal
          + state rate against your projected retirement effective rate -
          factoring in the RMD load you just calculated, Social Security
          taxation, and whether your state taxes retirement income at all.
        </p>

        <h3 className="md-title-large mt-6">Worked case: $120,000 single filer, age 35</h3>
        <WorkedSteps
          steps={[
            { label: "Gross income", value: "$120,000" },
            { label: "Standard deduction (2024)", value: "$14,600" },
            { label: "Taxable income", value: "$105,400" },
            { label: "Marginal federal rate", value: "24%" },
            { label: "State rate (illustrative CA)", value: "9.3%" },
            { label: "Combined marginal rate", value: "33.3%" },
            { label: "Tax saved by $7,000 Traditional contribution", value: "$2,331" },
            { label: "Projected balance at 65 (7% real, 30 yrs)", value: "$53,283" },
            { label: "Withdrawal-year effective rate target", value: "~22%" },
          ]}
        />
        <p>
          For this filer the Traditional deduction saves $2,331 in current tax.
          To make a fair comparison, that $2,331 has to be invested too -
          otherwise the Traditional contribution is just $7,000 of growth, same
          as Roth, with tax owed later. If the $2,331 goes into a taxable
          account at the same return, the math gets messy because the taxable
          account drags on dividends and capital gains. Our{" "}
          <Link href="/capital-gains-tax-calculator" className="text-[var(--md-sys-color-primary)] underline underline-offset-4">
            capital gains tax calculator
          </Link>{" "}
          handles that drag.
        </p>
        <p>
          The cleaner mental model: if you&apos;d spend the $2,331 (most people
          do), Roth wins by the full tax differential because the Traditional
          contribution isn&apos;t actually $7,000 of pre-tax money - it&apos;s
          $7,000 minus the savings you consumed.
        </p>
      </Section>

      <Section id="node-5-flex" title="Node 5: Do you need the Roth flexibility features?">
        <p>
          Two Roth-only features sometimes settle the decision on their own:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-2">
          <li>
            <strong>Contribution withdrawal at any time.</strong> The principal
            you put in (not earnings, not conversions) comes out tax-free and
            penalty-free at any age. That makes a Roth IRA function as a backup
            emergency fund without giving up the tax shelter on the growth. For
            a household with a thin cash buffer, this can be the deciding
            factor.
          </li>
          <li>
            <strong>First-home and education exceptions.</strong> Up to $10,000
            of Roth earnings come out tax-free for a first home after 5 years.
            Qualified education expenses also avoid the 10% penalty on early
            withdrawals from either account, but Roth wins on the tax side.
          </li>
        </ol>
        <p>
          Neither feature is a reason to pick Roth on its own, but if you&apos;re
          at the bracket-comparison tie-breaker, they should push you over.
        </p>
      </Section>

      <Section id="conversion-ladder" title="The conversion ladder play">
        <p>
          One more scenario worth its own section: the gap years between
          retirement and Social Security or pension start. Income drops, but
          required withdrawals haven&apos;t begun. That window is the cheapest
          opportunity in your financial life to convert Traditional dollars to
          Roth.
        </p>
        <Formula>
          ideal conversion = ((top of target bracket) − (taxable income)) per year
        </Formula>
        <p>
          A retiree at 62 with $30,000 of taxable income, targeting the top of
          the 12% bracket ($47,150 single, $94,300 joint in 2024), can convert
          roughly $17,000 to $64,000 per year and pay only 12% on it. Do that
          for eight years and you&apos;ve moved $150,000+ out of the Traditional
          bucket before RMDs ever start.
        </p>
        <p>
          Each conversion starts its own 5-year clock for penalty-free
          withdrawal. The conversion is irreversible - the 2017 Tax Cuts and
          Jobs Act removed the recharacterization option. Run the math, then
          commit.
        </p>
      </Section>

      <Section id="decision-summary" title="The whole tree on one page">
        <p>The five nodes, in the order you should hit them:</p>
        <ol className="mt-2 list-decimal pl-5 space-y-2">
          <li>
            <strong>Match first.</strong> Capture every dollar of employer match
            before any IRA contribution.
          </li>
          <li>
            <strong>Check phase-outs.</strong> Roth band, Traditional
            deductibility band, MAGI vs gross. Eligibility decides the
            conversation.
          </li>
          <li>
            <strong>Project RMD exposure.</strong> The bigger your projected
            Traditional balance, the more Roth pulls ahead.
          </li>
          <li>
            <strong>Compare brackets honestly.</strong> Marginal now vs
            blended effective later, including Social Security taxation and
            IRMAA.
          </li>
          <li>
            <strong>Weigh Roth flexibility.</strong> Emergency access and
            first-home exception break ties.
          </li>
        </ol>
        <p>
          For most households earning $50,000 to $130,000, Roth wins on three of
          the five nodes. For high earners blocked from direct Roth, the answer
          is backdoor Roth (if no existing pre-tax balances) or non-deductible
          Traditional. For retirees with large balances and gap years, the
          conversion ladder dominates either pure-Roth or pure-Traditional
          strategies.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Assuming retirement bracket will be lower without modeling RMDs.",
            fix: "A $1M Traditional balance generates a $37,700 forced withdrawal at 73, and that&apos;s before Social Security and pension. Project the actual RMD-year income before you assume lower brackets.",
          },
          {
            mistake: "Comparing $7,000 Roth to $7,000 Traditional as if they&apos;re equivalent.",
            fix: "They&apos;re not. Traditional is pre-tax, Roth is post-tax. A fair comparison either grosses up the Roth contribution by your marginal rate, or invests the Traditional tax savings in a taxable account. Most people skip both adjustments.",
          },
          {
            mistake: "Doing a backdoor Roth while holding a large pre-tax IRA balance.",
            fix: "The IRS pro-rata rule taxes the conversion proportionally across all your IRA balances. A $50,000 pre-tax IRA plus a $7,000 backdoor conversion means roughly 88% of the conversion is taxable. Roll the pre-tax IRA into your 401(k) first if your plan accepts incoming rollovers.",
          },
          {
            mistake: "Forgetting the 5-year clock on each conversion.",
            fix: "Roth contributions have one 5-year clock per person. Each conversion starts its own. Withdrawing converted dollars within 5 years triggers the 10% penalty even though the principal is technically yours.",
          },
          {
            mistake: "Skipping the spousal IRA for a non-working spouse.",
            fix: "A working spouse can fund an IRA for a non-working spouse up to the regular contribution limit. Married households leave $7,000 to $8,000 of tax-advantaged space on the table every year by missing this.",
          },
          {
            mistake: "Treating the deduction phase-out as a cliff.",
            fix: "It&apos;s a glide, not a cliff. Partial deductions exist throughout the band. The IRS worksheet in Pub 590-A walks the math; don&apos;t round yourself out of a legitimate $1,400 deduction.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "IRS: Retirement Topics - IRA Contribution Limits",
            href: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits",
          },
          {
            label: "IRS Notice 2023-75: 2024 Limits on Benefits and Contributions",
            href: "https://www.irs.gov/pub/irs-drop/n-23-75.pdf",
          },
          {
            label: "SECURE 2.0 Act of 2022 (H.R. 2954)",
            href: "https://www.congress.gov/bill/117th-congress/house-bill/2954",
          },
          {
            label: "SSA: Income Taxes on Social Security Benefits",
            href: "https://www.ssa.gov/benefits/retirement/planner/taxes.html",
          },
          {
            label: "IRS Publication 590-A: Contributions to IRAs",
            href: "https://www.irs.gov/publications/p590a",
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
