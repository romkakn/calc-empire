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

const POST = getPostBySlug("options-trading-for-beginners")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the smallest amount of money I need to start trading options?",
    answer:
      "One contract is the unit. A January 2026 AAPL 200 call quoted at $8.50 costs $850 plus commission. Cash-secured puts need the full strike-times-100 in your account: a $190 put means $19,000 set aside. Brokers like Fidelity and Schwab have no account minimum, but margin and approval levels are separate gates.",
  },
  {
    question: "What does it mean when an option is in the money?",
    answer:
      "A call is in the money when the stock trades above the strike. A put is in the money when the stock trades below the strike. ITM options have intrinsic value: stock price minus strike for calls, strike minus stock for puts. Anything else in the premium is time value, which decays to zero by expiration.",
  },
  {
    question: "How is the premium of an option calculated?",
    answer:
      "Market makers quote premiums based on the Black-Scholes model: stock price, strike, time to expiry, risk-free rate, dividends, and implied volatility. You don&apos;t need to run the math; the chain shows the live bid-ask. What matters is that high IV makes both calls and puts more expensive, which is why earnings-week options look overpriced.",
  },
  {
    question: "What happens if my option expires in the money?",
    answer:
      "OCC&apos;s exercise-by-exception rule auto-exercises any long option ITM by $0.01 or more at expiration. A long call becomes 100 shares bought at the strike. A short put becomes 100 shares purchased at the strike. If you don&apos;t have the cash or margin to take delivery, your broker will close the position Friday afternoon, sometimes at a bad price.",
  },
  {
    question: "Can I lose more than I paid for an option?",
    answer:
      "Long calls and long puts: max loss is the premium paid. Short calls without owning the stock (naked calls): theoretically unlimited loss. Short puts: max loss is strike minus premium, times 100, if the stock goes to zero. Beginners should stick to long options and cash-secured puts until they understand margin calls.",
  },
  {
    question: "What is the difference between American and European style options?",
    answer:
      "American-style options can be exercised any day before expiration. Almost all single-stock options (AAPL, TSLA, etc.) are American. European-style can only be exercised at expiration; most cash-settled index options like SPX and NDX are European. The style affects assignment risk for short positions, especially around ex-dividend dates.",
  },
  {
    question: "How much time decay does an option lose per day?",
    answer:
      "Theta accelerates as expiration approaches. A 60-day option loses maybe $0.02 per day in time value. The same option at 7 days might lose $0.15 per day. CBOE data shows roughly two-thirds of time decay happens in the final 30 days. Long-option buyers fight that clock every session.",
  },
  {
    question: "Do I need special approval from my broker to trade options?",
    answer:
      "Yes. FINRA Rule 2360 requires brokers to assess your experience and finances before approving options. Most use tiers: Level 1 (covered calls), Level 2 (long calls/puts), Level 3 (spreads), Level 4 (naked options). You apply through the account-settings page; approval usually takes one to three business days.",
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
        "https://www.investor.gov/introduction-investing/investing-basics/investment-products/options",
        "https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document",
        "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360",
        "https://www.cboe.com/optionsinstitute/",
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
          Calls, puts, strikes, premiums, expirations, assignment. Skip the
          Greek soup. Here&apos;s what a new trader needs to know to read one
          option contract, run a long call and a cash-secured put through to the
          end, and stop confusing the lottery-ticket buyers on Reddit with
          actual practitioners.
        </p>
      </header>

      <CTACard
        slug="options-profit-calculator"
        label="Skip the math"
        title="Use our Options Profit Calculator"
        body="Plug in the strike, premium, and expected stock price and the calculator returns your breakeven, max profit, and max loss for any single-leg trade. This post is for the readers who want to understand the contract before they click buy."
      />

      <Section id="parse-a-ticker" title="Read one ticker before you read anything else">
        <p>
          Here&apos;s the ticker you&apos;ll see on a broker chain:{" "}
          <strong>AAPL 240117 200 C</strong>. Six pieces of information, each
          one a thing you must understand before you trade. Most beginner
          confusion is just not knowing what those characters mean.
        </p>
        <Formula>AAPL · 240117 · 200 · C</Formula>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>AAPL</strong> — the underlying stock. One option contract
            controls 100 shares of Apple. Every dollar Apple moves, the
            contract&apos;s intrinsic value moves $100.
          </li>
          <li>
            <strong>240117</strong> — expiration. January 17, 2024. Standard
            monthly options expire the third Friday. Weeklies expire every
            Friday. Long-dated LEAPS run two to three years out.
          </li>
          <li>
            <strong>200</strong> — the strike price. The agreed-upon
            transaction price. Above the current stock for a call means out of
            the money; below means in the money.
          </li>
          <li>
            <strong>C</strong> — call. The other option is P for put. That one
            letter changes everything about who&apos;s betting on what.
          </li>
        </ul>
        <p>
          That&apos;s the whole code. Stock, date, strike, type. If you can
          recite those four pieces back without a cheat sheet, you&apos;re
          already past where most r/wallstreetbets posters get stuck.
        </p>
      </Section>

      <Section id="calls-vs-puts" title="Calls versus puts in two sentences">
        <p>
          A <strong>call</strong> gives the buyer the right to buy 100 shares
          at the strike, any time before expiration. A <strong>put</strong>{" "}
          gives the buyer the right to sell 100 shares at the strike, same
          window.
        </p>
        <p>
          Long a call = bullish. You want the stock to go up so the right to
          buy at the strike becomes valuable. Long a put = bearish. You want
          the stock to go down so the right to sell at the strike becomes
          valuable. That&apos;s the whole directional bet.
        </p>
        <p>
          Sellers take the opposite side. A short call collects premium and
          hopes the stock stays flat or falls. A short put collects premium and
          hopes the stock stays flat or rises. Short premium pays you up front;
          long premium pays the seller up front and waits to see if it works.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Position</th>
              <th>Wants stock to</th>
              <th>Max gain</th>
              <th>Max loss</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Long call</td>
              <td>Go up</td>
              <td>Unlimited</td>
              <td>Premium paid</td>
            </tr>
            <tr>
              <td>Long put</td>
              <td>Go down</td>
              <td>Strike − premium (× 100)</td>
              <td>Premium paid</td>
            </tr>
            <tr>
              <td>Short call (naked)</td>
              <td>Stay flat or fall</td>
              <td>Premium received</td>
              <td>Unlimited</td>
            </tr>
            <tr>
              <td>Short put (cash-secured)</td>
              <td>Stay flat or rise</td>
              <td>Premium received</td>
              <td>Strike − premium (× 100)</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          The unlimited-loss row is why brokers require Level 4 approval for
          naked calls. Don&apos;t go near them yet.
        </p>
      </Section>

      <Section id="premium-breakdown" title="What you pay: intrinsic value plus time value">
        <p>
          The <strong>premium</strong> is the price quoted in the chain. Apple
          at $195, a $200 call expiring in 45 days might quote $4.80. You pay
          $480 for the contract. Half of that math you can do in your head:
        </p>
        <Formula>
          premium = intrinsic value + time value
        </Formula>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Intrinsic value</strong> = max(0, stock − strike) for a
            call. AAPL at 195, strike 200 → intrinsic is zero. The call is out
            of the money.
          </li>
          <li>
            <strong>Time value</strong> = premium − intrinsic. Whatever&apos;s
            left after you subtract the intrinsic. The whole $4.80 in this
            example is time value, also called extrinsic.
          </li>
        </ul>
        <p>
          Time value evaporates as expiration approaches. The shorthand is
          theta, but you don&apos;t need the Greek letter to feel it: that
          $4.80 might be $3.20 a week later if AAPL hasn&apos;t moved. The
          option seller&apos;s entire business is collecting that decay.
        </p>
        <p>
          Implied volatility (IV) is the third lever. When the market expects a
          big move, premiums fatten on both sides. Around earnings, IV often
          doubles, then crushes back to baseline the morning after the print.
          That&apos;s the IV-crush trap: you guess direction right, the stock
          moves, and your call still loses money because the IV reset. The{" "}
          <Link
            href="/options-profit-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            options profit calculator
          </Link>{" "}
          lets you flex IV and time to see how a position behaves before you
          enter it.
        </p>
      </Section>

      <Section id="expiration-breakeven" title="Expiration and breakeven: the date and the number">
        <p>
          Every option dies on a date. Standard monthlies expire the third
          Friday at market close, technically settled the next morning by the
          OCC. Weeklies expire every Friday. Zero-DTE options on SPX expire the
          same day, which is why volume there exploded after CBOE added
          Tuesday-Thursday expirations in 2022.
        </p>
        <p>
          Breakeven is the stock price at which your trade is exactly flat at
          expiration. For a long call, the math is one line:
        </p>
        <Formula>breakeven<sub>call</sub> = strike + premium</Formula>
        <Formula>breakeven<sub>put</sub> = strike − premium</Formula>
        <p>
          Buy that AAPL 200 call for $4.80 and breakeven is $204.80 at
          expiration. Anything above is profit, anything below is loss, max
          loss capped at $480.
        </p>
        <p>
          Sellers flip the sign. Sell a 190 put for $3.20 and your breakeven
          is $186.80 at expiration. Above $190, the put expires worthless and
          you keep $320 per contract. Below $186.80, you start losing real
          money — and you owe 100 shares at $190 each.
        </p>
      </Section>

      <Section id="example-long-call" title="Worked example 1: buying a long call">
        <p>
          January 2026. AAPL is trading at $195. You think the stock is heading
          to $220 by spring on a hardware refresh. The trade:
        </p>
        <WorkedSteps
          steps={[
            { label: "Underlying", value: "AAPL @ $195" },
            { label: "Contract", value: "AAPL Jan-26 200 C" },
            { label: "Premium quoted", value: "$4.80 (mid)" },
            { label: "Cost per contract", value: "$4.80 × 100 = $480" },
            { label: "Breakeven at expiration", value: "$200 + $4.80 = $204.80" },
            { label: "Max loss", value: "$480 (premium paid)" },
            { label: "Profit if AAPL @ $220", value: "(220 − 200 − 4.80) × 100 = $1,520" },
            { label: "Profit if AAPL @ $204.80", value: "$0 (breakeven)" },
            { label: "Loss if AAPL ≤ $200 at expiry", value: "−$480" },
          ]}
        />
        <p>
          The trade pays roughly 3-to-1 on the upside scenario and risks the
          full $480 on the downside. What the spreadsheet won&apos;t show: if
          AAPL hits $220 in three days, you bank most of that move with weeks
          of time value still inside. Hit $220 the day before expiration and
          your gain is roughly the same dollar amount, but the path was a
          rollercoaster.
        </p>
        <p>
          Same trade with weekly expiration: a 5-day 200 call probably costs
          $1.10. You&apos;ve cut your cost basis but cut your odds harder. Most
          short-dated long calls expire worthless. SEC investor bulletins on
          options call this out plainly: time decay is the single biggest
          headwind for retail call buyers.
        </p>
      </Section>

      <Section id="example-cash-secured-put" title="Worked example 2: a cash-secured put">
        <p>
          Same Apple. Now you&apos;d be happy to own 100 shares at $185 — call
          it your accumulation price. Instead of placing a limit order at $185
          and waiting, sell a cash-secured put.
        </p>
        <WorkedSteps
          steps={[
            { label: "Underlying", value: "AAPL @ $195" },
            { label: "Contract", value: "Sell 1 AAPL 45-day 185 P" },
            { label: "Premium received", value: "$2.20 (mid)" },
            { label: "Cash set aside (collateral)", value: "$185 × 100 = $18,500" },
            { label: "Net credit per contract", value: "$220" },
            { label: "Breakeven at expiration", value: "$185 − $2.20 = $182.80" },
            { label: "If AAPL > $185 at expiry", value: "Put expires worthless. Keep $220 (1.2% / 45 days)" },
            { label: "If AAPL < $185 at expiry", value: "Assigned 100 shares at $185 (cost basis $182.80)" },
            { label: "Worst case (AAPL → $0)", value: "−$18,280" },
          ]}
        />
        <p>
          Two outcomes, both acceptable if you actually wanted the shares. Door
          one: you make 1.2% on cash in 45 days, roughly 10% annualized. Door
          two: you buy AAPL at $182.80 effective, $12.20 under the price when
          you entered the trade. The risk is real — if AAPL drops to $150 you
          still buy at $185 — but it&apos;s the same risk you took when you
          decided $185 was your accumulation price.
        </p>
        <p>
          This is the strategy income-focused retirees use on dividend
          aristocrats. Pair it with the{" "}
          <Link
            href="/dividend-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            dividend calculator
          </Link>{" "}
          to compare put-selling yield against the underlying&apos;s dividend
          yield. On many blue chips, the put premium alone matches or beats
          two quarters of dividends.
        </p>
      </Section>

      <Section id="assignment-risk" title="Assignment: the one risk that surprises new sellers">
        <p>
          Assignment is what happens when the counterparty exercises an option
          you sold. Sell a 185 put, AAPL drops to $170 at expiration, you get
          assigned 100 shares at $185 — for which $18,500 leaves your account
          Monday morning. The OCC&apos;s exercise-by-exception rule auto-exercises
          any long option ITM by a penny or more at expiration unless the holder
          opts out.
        </p>
        <p>
          Three things to know about assignment risk:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>American-style options can be assigned early.</strong> Any
            day before expiration, especially the day before ex-dividend if the
            extrinsic value drops below the dividend. Single-stock options
            (AAPL, MSFT, etc.) are all American.
          </li>
          <li>
            <strong>Index options are usually European.</strong> SPX, NDX, RUT
            settle in cash at expiration only. No assignment surprises midweek.
            That&apos;s why pros sell credit spreads on SPX, not SPY.
          </li>
          <li>
            <strong>Cash settlement, not delivery.</strong> A SPX put doesn&apos;t
            deliver shares; it pays the cash difference. Stock options like AAPL
            deliver 100 actual shares, which means margin calls if you don&apos;t
            have the cash.
          </li>
        </ul>
        <p>
          The defense is simple: never sell a put on a stock you don&apos;t
          want to own at the strike, and never sell a call against shares you
          aren&apos;t willing to part with at the strike. If both halves are
          true, assignment is just the trade working out either way.
        </p>
      </Section>

      <Section id="approval-and-where-to-learn" title="Broker approval and where to learn next">
        <p>
          FINRA Rule 2360 requires brokers to vet you before they let you
          trade options. You fill out a form: investing experience, annual
          income, liquid net worth, employment. The broker assigns a level:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Level</th>
              <th>What it unlocks</th>
              <th>Typical requirement</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Level 1</td>
              <td>Covered calls, cash-secured puts</td>
              <td>Any approved account</td>
            </tr>
            <tr>
              <td>Level 2</td>
              <td>Long calls, long puts</td>
              <td>Some options experience disclosed</td>
            </tr>
            <tr>
              <td>Level 3</td>
              <td>Spreads (debit, credit, iron condors)</td>
              <td>Margin account + experience</td>
            </tr>
            <tr>
              <td>Level 4</td>
              <td>Naked calls and puts</td>
              <td>Significant net worth + experience</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          Start with Level 2 if you&apos;re buying calls and puts. Add the cash
          to qualify for cash-secured puts (Level 1, but most brokers fold it
          into Level 2 anyway). Skip Level 4 until you&apos;ve done at least
          100 trades and read the OCC&apos;s{" "}
          <em>Characteristics and Risks of Standardized Options</em> cover to
          cover — your broker is legally required to send it.
        </p>
        <p>
          Once you can run the math on a long call, want to compare it against
          just buying shares? Run both legs through the{" "}
          <Link
            href="/stock-profit-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            stock profit calculator
          </Link>{" "}
          alongside the options profit calculator. Most beginners discover the
          option only pays better in narrow scenarios that don&apos;t happen
          often enough to overcome the loss column.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Buying 0-DTE calls on a hunch.",
            fix: "Same-day options have almost no time value left and trade like coin flips. Studies from the CBOE show retail 0-DTE buyers as a group are net losers. If you&apos;re learning, trade 30 to 60-day contracts where direction matters more than the clock.",
          },
          {
            mistake: "Ignoring implied volatility before earnings.",
            fix: "An AAPL straddle the day before earnings might price in a 5% move. If AAPL moves 3%, both the call and the put lose money because IV crushes after the print. Check the IV percentile (under 50% is reasonable, over 80% is expensive) before buying.",
          },
          {
            mistake: "Thinking max profit means likely profit.",
            fix: "A long call has unlimited upside on paper. In practice, most expire worthless. The OCC&apos;s annual report shows the majority of single-leg long options held to expiration are not profitable. Plan for the boring outcome, not the screenshot.",
          },
          {
            mistake: "Selling puts on stocks you don&apos;t want to own.",
            fix: "The premium looks juicy on a meme stock with 200% IV. Then you get assigned 100 shares as it falls another 30%. Only sell cash-secured puts at strikes you&apos;d hit the buy button on with a limit order.",
          },
          {
            mistake: "Forgetting that one contract = 100 shares.",
            fix: "A $4.80 premium isn&apos;t $4.80. It&apos;s $480 per contract. Newcomers buy 10 contracts thinking they&apos;re spending $48, then watch $4,800 in premium evaporate over a long weekend.",
          },
          {
            mistake: "Holding through expiration with no plan.",
            fix: "If a long option is ITM by a penny at 4pm Friday, your broker exercises it. Suddenly you own 100 shares Monday morning. Either close the position by 3:55pm Friday, or have the capital and intent to take delivery.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "SEC Investor.gov: Options basics",
            href: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/options",
          },
          {
            label: "OCC: Characteristics and Risks of Standardized Options",
            href: "https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document",
          },
          {
            label: "FINRA Rule 2360: Options",
            href: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2360",
          },
          {
            label: "CBOE Options Institute: education center",
            href: "https://www.cboe.com/optionsinstitute/",
          },
          {
            label: "SEC Investor Bulletin: An Introduction to Options",
            href: "https://www.sec.gov/files/ib_introduction_options.pdf",
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
