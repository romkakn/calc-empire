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
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  jsonLd,
  personSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";

const SLUG = "options-profit-calculator";
const TITLE = "Options Profit Calculator";
const DESC =
  "Single-leg call and put P&L at expiration — long or short. Native chart, max profit, max loss, breakeven, and a per-spot table.";

const FAQS: FaqItem[] = [
  {
    question: "How is options profit calculated?",
    answer:
      "At expiration: a long call returns max(0, spot − strike) − premium per share. A long put returns max(0, strike − spot) − premium. Short legs flip the sign. Multiply by 100 shares per standard contract.",
  },
  {
    question: "What is breakeven on an option?",
    answer:
      "For calls, breakeven is strike + premium paid. For puts, breakeven is strike − premium paid. At that spot price, the position is exactly flat at expiration.",
  },
  {
    question: "What's max loss on a long option?",
    answer:
      "The premium paid, times 100 shares per contract, times the number of contracts. A long option can expire worthless but cannot lose more than the cost basis.",
  },
  {
    question: "What's max loss on a short option?",
    answer:
      "Short call: theoretically unlimited (the stock can rise without bound). Short put: strike − premium received, times 100 (the stock falls to zero). Brokers require option-approval levels for shorts.",
  },
  {
    question: "Does this include Greeks?",
    answer:
      "Not in v1. The calculator shows P&L at expiration only. Mid-life P&L depends on delta, gamma, theta, vega — out of v1 scope. Use a Black-Scholes tool for mid-life valuations.",
  },
  {
    question: "Are options taxed differently from stock?",
    answer:
      "Section 1256 contracts (broad-based index options) get the 60/40 long-term/short-term split. Equity options generally follow standard short- or long-term capital-gains rules based on holding period. See IRS Pub 550.",
  },
  {
    question: "What's a contract?",
    answer:
      "A standard US equity option contract controls 100 shares of the underlying. Mini contracts (10 shares) exist but are uncommon and not assumed here.",
  },
  {
    question: "Is this a recommendation?",
    answer:
      "No. Educational only. Options carry risk of total loss. Per FINRA, confirm the strategy matches your risk tolerance and account approval before trading.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Long/Short Calls & Puts (2026)`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Finance", path: "/finance" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "finance", description: DESC }),
    howToSchema({
      name: "How to calculate options profit at expiration",
      steps: [
        { name: "Pick a position", text: "Long call, long put, short call, or short put." },
        { name: "Enter strike and premium per share", text: "Strike is the price you have the right to transact at. Premium is the per-share price of the contract." },
        { name: "Enter contracts and the current spot price", text: "Each contract controls 100 shares. Spot is optional, used for current-price P&L." },
        { name: "Read max profit, max loss, breakeven", text: "Confirm against the chart. Short legs may be unlimited on one side — read the risk before sizing." },
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

      <Hero
        title={TITLE}
        tagline="Single-leg call and put P&L at expiration. Native chart. No login, no email, no plugin."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You buy 1 long call: strike $100, premium $3 per share. The stock closes at $110 at expiration."
        steps={[
          { label: "Per-share intrinsic: max(0, 110 − 100)", value: "$10" },
          { label: "Per-share P&L: $10 − $3 premium", value: "$7" },
          { label: "Per contract (× 100 shares)", value: "$700" },
          { label: "Breakeven: strike + premium = 100 + 3", value: "$103" },
          { label: "Max loss: −premium × 100", value: "−$300" },
          { label: "Max profit: unlimited above $103", value: "—" },
        ]}
        result="One contract makes $700 at a $110 close, with a $103 breakeven and $300 max loss."
      />

      <FormulaExplained
        plainEnglish="At expiration, a long call only has value above the strike. A long put only has value below the strike. Subtract the premium paid and you have profit per share. Multiply by 100 shares × contracts for the dollar number."
        formula={
          <span>
            Long call P&L = max(0, S − K) − premium
            <br />
            Long put P&L = max(0, K − S) − premium
            <br />
            Short call = premium − max(0, S − K)
            <br />
            Short put = premium − max(0, K − S)
            <br />
            Multiply per-share P&L by 100 shares × contracts.
          </span>
        }
        citation={{
          label: "CBOE Options Toolbox — Single-leg payoff diagrams",
          href: "https://www.cboe.com/optionstools/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're considering a single-leg trade and want to see breakeven and max loss before placing it.",
          "You're learning options and want to compare long vs. short payoff shapes side by side.",
          "You're explaining a position to a non-options partner and want a clean chart.",
          "You're sanity-checking a broker's order screen against the math.",
          "You're a student studying derivatives and want a fast worked-example tool.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating premium as a fee rather than the full cost basis.", fix: "For a long option, premium × 100 × contracts is the entire amount you can lose. Size accordingly." },
          { mistake: "Selling naked calls without margin awareness.", fix: "Short call loss is theoretically unlimited. Brokers require approval levels and large margin posts." },
          { mistake: "Computing P&L on the stock side and forgetting the premium.", fix: "The intrinsic value at expiration tells you the option's value — your P&L still subtracts the premium paid (or adds the premium received)." },
          { mistake: "Assuming this models mid-life value.", fix: "This is expiration-only. Mid-life value requires Greeks (delta, gamma, theta, vega) and an option-pricing model." },
          { mistake: "Forgetting tax treatment.", fix: "Index options (1256 contracts) get a 60/40 split. Equity options follow standard cap-gains rules. See IRS Pub 550." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Strike", definition: "The price the contract gives you the right to buy (call) or sell (put) at." },
          { term: "Premium", definition: "Per-share price of the contract. Paid by the long, received by the short." },
          { term: "Breakeven", definition: "Spot price at expiration that makes the position exactly flat." },
          { term: "Intrinsic value", definition: "max(0, S − K) for calls, max(0, K − S) for puts. The expiration payoff before premium." },
          { term: "Section 1256", definition: "IRS designation for broad-based index options. Gets a 60/40 long-term/short-term tax split." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "CBOE — Options Toolbox", href: "https://www.cboe.com/optionstools/" },
          { label: "Hull JC — Options, Futures, and Other Derivatives (9th ed.)", href: "https://www-2.rotman.utoronto.ca/~hull/ofod/index.html" },
          { label: "IRS Publication 550 — Investment Income and Expenses", href: "https://www.irs.gov/forms-pubs/about-publication-550" },
          { label: "FINRA — Trading Options", href: "https://www.finra.org/investors/learn-to-invest/types-investments/options" },
          { label: "OCC — Characteristics and Risks of Standardized Options", href: "https://www.theocc.com/components/docs/riskstoc.pdf" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators
        slugs={["dividend-calculator", "mortgage-recast-calculator", "variance-calculator"]}
      />
    </Container>
  );
}
