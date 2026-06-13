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

const POST = getPostBySlug("how-to-pay-off-mortgage-faster")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Does paying biweekly really save money?",
    answer:
      "Yes, but not because biweekly is magic. The savings come from making 26 half-payments per year, which equals 13 monthly payments instead of 12. You can replicate it free by adding 1/12 of your payment to each month, no enrollment fee required.",
  },
  {
    question: "Is it better to recast or refinance?",
    answer:
      "Recast if your rate is already good and you have a lump sum. Costs $150–$500 and keeps your existing loan. Refinance if current rates are at least 0.75% below yours and you'll stay in the home long enough to recoup closing costs, usually 24–36 months.",
  },
  {
    question: "Should I pay off my mortgage or invest the extra cash?",
    answer:
      "Compare guaranteed return (your mortgage rate) to expected after-tax investment return. At 7% mortgage rates, paying down beats most fixed-income investments. At 3% rates, the S&P 500's long-run 10% return wins on paper. Risk tolerance and the peace-of-mind factor matter too.",
  },
  {
    question: "What's the cheapest way to shave years off a mortgage?",
    answer:
      "Adding one extra principal payment per year. On a $300k 30-year loan at 7%, one extra payment annually cuts the term to about 24 years and saves around $87,000 in interest. Zero fees, fully reversible if cash gets tight.",
  },
  {
    question: "Does my lender penalize early payoff?",
    answer:
      "Most conventional Fannie Mae and Freddie Mac loans have no prepayment penalty. Some non-QM, jumbo, or older FHA loans do. Read your note for a 'prepayment penalty rider' before sending a big check. The CFPB has a free lookup for standard mortgage disclosures.",
  },
  {
    question: "How does a mortgage recast actually work?",
    answer:
      "You send the lender a lump sum (usually $5k minimum), they re-amortize the loan over the remaining term at your existing rate. Monthly payment drops, but the term stays the same. To shorten the term instead, keep paying the original amount after the recast.",
  },
  {
    question: "Does refinancing to a 15-year loan make sense at 7% rates?",
    answer:
      "Only if you can absorb the higher payment without strain. 15-year rates run about 0.5–0.75% below 30-year, so a $300k loan saves roughly $150k in interest. But the monthly jumps from around $2,000 to $2,700. Recasting plus self-discipline often gets you there cheaper.",
  },
  {
    question: "Is dropping PMI the same as paying off faster?",
    answer:
      "Not exactly, but they pair well. Once you hit 20% equity, request PMI removal (free under HPA 1998). That frees up $100–$300 monthly that can go straight to principal. Stacking PMI removal with extra principal payments is one of the highest-ROI moves a homeowner has.",
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
        "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/",
        "https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/",
        "https://singlefamily.fanniemae.com/servicing/servicing-guide",
        "https://www.federalreserve.gov/releases/h15/",
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
          A 30-year $300,000 mortgage at 7% costs $418,527 in interest. More
          than the loan itself. The good news: seven well-known methods can each
          take a bite out of that number. The bad news: most homeowner blogs
          rank them by effort or popularity, not by dollars saved. Here&apos;s
          the actual ranking, with the math behind each move.
        </p>
      </header>

      <CTACard
        slug="mortgage-recast-calculator"
        label="Skip to the numbers"
        title="Use our Mortgage Recast Calculator"
        body="Plug your loan balance, rate, and a hypothetical lump sum into the recast calculator to see exact monthly savings and how much interest disappears. The post below explains why recasting beats refinancing in some scenarios and loses badly in others."
      />

      <Section id="baseline" title="The baseline number to beat">
        <p>
          Start with a $300,000 loan at 7% fixed over 30 years. The monthly
          principal and interest payment is $1,995.91. Across 360 payments,
          you&apos;ll send the lender $718,527. That&apos;s $418,527 in
          interest on top of the original $300,000.
        </p>
        <Formula>
          monthly P&amp;I = P × [r(1 + r)<sup>n</sup>] ÷ [(1 + r)<sup>n</sup> − 1]
        </Formula>
        <p>
          Where P = principal, r = monthly rate (annual ÷ 12), n = number of
          payments. Every method below changes one of those three variables, or
          throws extra dollars at the principal so the equation runs out of
          payments sooner. Keep the $418,527 in your head as we go.
        </p>
      </Section>

      <Section id="ranking" title="The 7 methods, ranked by total interest saved">
        <p>
          Each row assumes the same $300k / 7% / 30-year baseline. Savings are
          rounded to the nearest hundred. Effort is what it takes to set up and
          maintain. The order matters: top of the list is most dollars saved.
        </p>
        <WorkedSteps
          steps={[
            { label: "1. Refinance to 15-year at 6.25%", value: "Saves ~$165,000" },
            { label: "2. Double the monthly payment", value: "Saves ~$226,000 (but doubles outflow)" },
            { label: "3. Add $500/mo to principal", value: "Saves ~$120,000" },
            { label: "4. Lump sum $50k + recast", value: "Saves ~$93,000" },
            { label: "5. One extra payment per year", value: "Saves ~$87,000" },
            { label: "6. Biweekly schedule (1 extra/yr)", value: "Saves ~$87,000" },
            { label: "7. Round payment up to $2,100", value: "Saves ~$28,000" },
          ]}
        />
        <p>
          A few things jump out. Doubling the payment saves the most absolute
          dollars but requires income that most homeowners don&apos;t have
          sitting around. The 15-year refi beats it on a risk-adjusted basis
          because you lock in the lower rate. Biweekly and one-extra-payment-per-year
          produce identical savings because they&apos;re the same thing in
          disguise. We&apos;ll get into each below.
        </p>
      </Section>

      <Section id="method-1-refi-15" title="Method 1: Refinance to a 15-year loan">
        <p>
          The 15-year mortgage is the most effective tool homeowners ignore.
          Rates run roughly 0.5% to 0.75% below 30-year equivalents because the
          lender&apos;s risk window is shorter. At 6.25% on a 15-year, that
          same $300k costs $172,841 in total interest. Compared to the 30-year
          baseline, you save $245,686 in interest, but pay $577 more per month.
        </p>
        <p>
          The trade-off: payment goes from $1,996 to $2,573. That&apos;s real
          money, and it&apos;s the reason most people don&apos;t do it. But if
          your budget can absorb it, no other method comes close. The forced
          discipline is the feature, not the bug. Compare that to picking up
          dividend stocks with the spare cash (the math on which we cover in
          our <Link href="/dividend-calculator">dividend calculator</Link>{" "}
          guide); the guaranteed 7% return from paying down debt usually wins.
        </p>
        <p>
          One caveat: refinancing costs 2–5% of the loan in closing fees. On
          $300k, that&apos;s $6,000–$15,000 you need to recoup. Divide closing
          costs by monthly savings to get the break-even month. If you might
          move before then, the refi loses.
        </p>
      </Section>

      <Section id="method-2-double" title="Method 2: Double the monthly payment">
        <p>
          Pay $3,992 instead of $1,996, and the 30-year loan finishes in about
          10 years and 4 months. Total interest drops to roughly $123,000.
          Massive savings, but only viable if you&apos;ve got the cash flow.
          Most households tapping their entire mortgage payment again every
          month are sacrificing retirement contributions or emergency reserves
          to do it.
        </p>
        <p>
          A smarter version: park the extra in a high-yield account first. If a
          money-market fund pays 4.5% and your mortgage is 7%, paying down wins.
          But the liquidity matters. Once the money goes to principal, getting
          it back requires a HELOC or cash-out refi. See our{" "}
          <Link href="/money-market-calculator">money market calculator</Link>{" "}
          to compare actual after-tax returns. The right answer is usually
          &quot;keep 6 months expenses liquid, send the rest to principal.&quot;
        </p>
      </Section>

      <Section id="method-3-extra-500" title="Method 3: Extra $500/month to principal">
        <p>
          The middle ground. $500 extra principal each month on the $300k/7%
          baseline cuts the term from 30 years to about 21.5 years. Total
          interest drops from $418k to roughly $298k. Savings: $120k. Effort:
          set up an automatic transfer with the principal-only memo and forget
          it.
        </p>
        <WorkedSteps
          steps={[
            { label: "Baseline interest", value: "$418,527" },
            { label: "Extra principal per year", value: "$500 × 12 = $6,000" },
            { label: "New payoff window", value: "~258 months (21.5 yr)" },
            { label: "Total interest paid", value: "~$298,500" },
            { label: "Interest saved", value: "~$120,000" },
            { label: "Years cut from term", value: "~8.5 years" },
          ]}
        />
        <p>
          The reason this works: every dollar of extra principal kills the
          interest that dollar would have generated for the rest of the loan.
          A $500 payment in month 12 saves you 7% per year on $500 for the
          next 348 months. That compounds to about $3,400 in avoided interest
          per single $500 payment, given enough runway. It&apos;s the same
          math as compound growth, just running backwards.
        </p>
      </Section>

      <Section id="method-4-recast" title="Method 4: Lump sum + recast">
        <p>
          You inherited $50k, sold a car, hit a bonus. A recast lets you apply
          the lump sum to principal, then re-amortize the remaining balance
          over the original term at your existing rate. Same 7%, same 30 years,
          new lower payment.
        </p>
        <WorkedSteps
          steps={[
            { label: "Lump sum", value: "$50,000 in month 12" },
            { label: "Balance after lump sum", value: "$246,841" },
            { label: "Re-amortize over 348 months @ 7%", value: "—" },
            { label: "New monthly P&I", value: "$1,656.18" },
            { label: "Monthly savings vs original", value: "$339.73" },
            { label: "Total interest saved", value: "~$93,000" },
            { label: "Recast fee (typical)", value: "$150–$500" },
          ]}
        />
        <p>
          The catch: a vanilla recast lowers your payment but keeps the
          original term. To actually shorten the loan, keep paying the original
          $1,995.91 even after the recast. That puts $339 of extra principal at
          work every month, which combined with the lump sum saves closer to
          $165,000 in interest and chops 7+ years off the term. Best of both
          worlds. Run your scenario through our{" "}
          <Link href="/mortgage-recast-calculator">mortgage recast calculator</Link>{" "}
          before sending the check.
        </p>
      </Section>

      <Section id="method-5-and-6" title="Methods 5 & 6: One extra payment / biweekly">
        <p>
          These are the same method dressed up two ways. The biweekly schedule
          enrolls you in 26 half-payments per year, which adds up to 13 monthly
          payments instead of 12. The &quot;one extra payment&quot; approach
          does it directly: send a 13th payment every December, or add 1/12 of
          a payment to each month.
        </p>
        <p>
          On the $300k/7% baseline, either approach saves around $87,000 and
          cuts the term by about 6 years. The difference between them is
          fees. Many lenders charge $200–$500 to enroll in a formal biweekly
          program, plus a small per-transaction fee. The DIY version costs
          zero. If your lender doesn&apos;t accept biweekly principal
          natively, the bank often holds your half-payment in a non-interest
          account for two weeks before forwarding it, which means you&apos;re
          giving them an interest-free loan every two weeks.
        </p>
        <p>
          The honest move: don&apos;t pay anyone to set up biweekly. Just add
          $166 ($1,996 ÷ 12) to each monthly payment and mark it
          &quot;principal only.&quot; Same savings, no fees.
        </p>
      </Section>

      <Section id="method-7-round-up" title="Method 7: Round up the payment">
        <p>
          The gateway drug. Pay $2,100 instead of $1,995.91. The extra $104 a
          month drops the term by about 2 years and saves roughly $28,000 in
          interest. It&apos;s the smallest impact on the list, but the easiest
          to actually do. If you&apos;re not ready to commit to anything
          bigger, round up and graduate to method 3 or 4 once it feels normal.
        </p>
        <p>
          The psychology matters. A homeowner who promises themselves
          $500/month in extra principal and breaks the habit after 8 months
          ends up saving less than someone who quietly rounds up for 30 years.
          Pick the method you&apos;ll actually maintain.
        </p>
      </Section>

      <Section id="what-most-get-wrong" title="The one thing most homeowners get wrong">
        <p>
          People obsess over biweekly enrollment and ignore principal-versus-investment
          math. With a 7% mortgage, paying down debt is a guaranteed 7% after-tax
          return. To beat that in the market, you need a pre-tax return of
          roughly 9.5% in a taxable account, factoring in long-term capital
          gains and the loss of the mortgage interest deduction (which, since
          the 2017 TCJA raised the standard deduction to $14,600 single /
          $29,200 married for 2024, most homeowners don&apos;t itemize anymore
          anyway).
        </p>
        <p>
          At sub-4% mortgage rates from 2020–2021, the math flipped. Paying
          down a 3% mortgage when the S&amp;P 500 returns a long-run 10% is
          throwing money away. But at 7%, mortgage paydown is one of the
          best risk-adjusted returns available to a household. The rate
          environment changes the answer; check what your rate actually is
          before you optimize.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Sending a check without writing &apos;principal only&apos; on it.",
            fix: "Default behavior at most lenders is to apply extra to the next month&apos;s payment instead of principal. Add a memo or use the lender&apos;s online &apos;principal-only&apos; payment option. Check the next statement to confirm the balance dropped by the full extra amount.",
          },
          {
            mistake: "Paying down the mortgage before maxing 401(k) match.",
            fix: "Employer match is a 50%–100% instant return. Capture it first, then attack the mortgage. Skipping a $6k match to send $6k to principal is leaving $3k–$6k on the table every year.",
          },
          {
            mistake: "Enrolling in a paid biweekly program when DIY is free.",
            fix: "Lenders and third parties charge $200–$500 plus monthly fees for what amounts to spreadsheet math. Add 1/12 of your payment monthly with the principal-only memo and you&apos;ve got the same outcome for $0.",
          },
          {
            mistake: "Recasting without checking the minimum lump sum.",
            fix: "Most servicers require $5,000–$10,000 minimum to trigger a recast. Some require 10% of the balance. Smaller principal payments just get applied to the balance without re-amortizing, which is fine but doesn&apos;t lower your monthly payment.",
          },
          {
            mistake: "Refinancing to a 15-year without an emergency fund.",
            fix: "Locking in a 30%+ higher monthly payment with three weeks of cash in checking is a foreclosure waiting to happen. Build 6 months of expenses liquid first, then refinance. The recast-with-extra-payments strategy keeps the flexibility a refi removes.",
          },
          {
            mistake: "Ignoring the prepayment penalty clause.",
            fix: "Most conforming loans don&apos;t have one, but FHA loans before 2014, some VA loans, and most jumbo or non-QM products do. Search your closing disclosure for &apos;prepayment penalty&apos; before sending five figures to principal.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Consumer Financial Protection Bureau: Prepayment penalties",
            href: "https://www.consumerfinance.gov/ask-cfpb/what-is-a-prepayment-penalty-en-1957/",
          },
          {
            label: "CFPB: PMI removal under the Homeowners Protection Act",
            href: "https://www.consumerfinance.gov/ask-cfpb/when-can-i-remove-private-mortgage-insurance-pmi-from-my-loan-en-202/",
          },
          {
            label: "Fannie Mae Servicing Guide (recast / re-amortization rules)",
            href: "https://singlefamily.fanniemae.com/servicing/servicing-guide",
          },
          {
            label: "Federal Reserve H.15: Selected interest rates",
            href: "https://www.federalreserve.gov/releases/h15/",
          },
          {
            label: "IRS Publication 936: Home Mortgage Interest Deduction",
            href: "https://www.irs.gov/publications/p936",
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
