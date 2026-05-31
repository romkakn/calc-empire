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

const SLUG = "stock-profit-calculator";
const TITLE = "Stock Profit Calculator";
const DESC =
  "Compute your profit, return percentage, and break-even price on a stock trade. Optional commissions.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between profit and return?",
    answer:
      "Profit is the dollar amount you cleared after costs — proceeds minus cost basis. Return is that profit divided by what you invested, expressed as a percent. A $1,500 profit on a $5,000 position is a 30% return; the same $1,500 on a $50,000 position is only 3%.",
  },
  {
    question: "How do fees and slippage change my profit?",
    answer:
      "Commissions and per-share fees come straight off your gain. Slippage — the gap between the price you saw and the price you got — eats into thinly traded stocks the most. Add both legs of fees to your cost basis to get an honest number.",
  },
  {
    question: "Can this calculator handle a short sale?",
    answer:
      "Yes. Flip to the short side, enter the price you shorted at as the short price and the price you covered at as the cover price. Profit is still proceeds minus cost; you just sold first. It does not include margin interest or borrow fees, which can be material on long holds.",
  },
  {
    question: "Does this account for capital-gains tax?",
    answer:
      "No. The result is pre-tax. In the US, gains on shares held one year or less are taxed at your ordinary income rate; gains on shares held longer than a year get long-term capital-gains rates. See IRS Publication 550 and your tax pro.",
  },
  {
    question: "What's the difference between average cost basis and FIFO?",
    answer:
      "If you bought the same stock in multiple lots, the IRS lets you pick the cost basis method that applies on sale. FIFO (first-in, first-out) sells your oldest lot first. Average cost averages all your purchase prices into one number — common for mutual funds, allowed for ETFs if your broker supports it.",
  },
  {
    question: "How do I handle foreign stocks and currency conversion?",
    answer:
      "Convert the buy price using the exchange rate on the trade date, and the sell price using the rate on its trade date. A stock can rise in local currency and still lose money in dollars if the foreign currency weakened. This calculator assumes one currency end-to-end.",
  },
  {
    question: "Should I include reinvested dividends?",
    answer:
      "If you reinvested dividends, each reinvestment is a new tax lot at that day's price. To capture total return, add the share count from each reinvestment to your share total and use a weighted average buy price. This calculator treats one buy and one sell only.",
  },
  {
    question: "When should I take profit on a stock?",
    answer:
      "There's no single answer — it depends on your plan, time horizon, and tax situation. Common triggers are reaching a pre-set price target, a thesis break, or rebalancing back to your target allocation. Decide your rule before you enter the trade, not after the position moves.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Profit, Return %, and Break-Even`,
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
      name: "How to calculate stock profit and return",
      steps: [
        { name: "Add up your cost basis", text: "Multiply shares by buy price, then add the buy commission. That's what the position cost you." },
        { name: "Add up your sale proceeds", text: "Multiply shares by sell price, then subtract the sell commission. That's what you walked away with." },
        { name: "Subtract to get profit", text: "Proceeds minus cost equals dollar profit. Negative means a loss." },
        { name: "Divide for return percent", text: "Profit divided by cost basis, times 100. Compare that to your benchmark (S&P 500, savings rate, your other holdings)." },
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

      <Hero title={TITLE} tagline="Enter your shares, prices, and fees. Get profit, return percent, and the break-even sell price.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You bought 100 shares of a stock at $50 and sold all 100 at $65. Your broker charged $0 in commissions on both legs."
        steps={[
          { label: "Cost basis: 100 × $50 + $0", value: "$5,000" },
          { label: "Sale proceeds: 100 × $65 − $0", value: "$6,500" },
          { label: "Profit: $6,500 − $5,000", value: "$1,500" },
          { label: "Return: $1,500 / $5,000 × 100", value: "30%" },
          { label: "Break-even: ($5,000 + $0) / 100", value: "$50 per share" },
        ]}
        result="$1,500 profit, 30% return, break-even at $50. The trade made money the moment you sold above $50."
      />

      <FormulaExplained
        plainEnglish="A stock trade is just two cash flows: money out when you buy, money in when you sell. Profit is the gap between the two, after fees. Return scales that gap to what you put in, so you can compare trades of different sizes."
        formula={
          <span>
            cost = shares × buy_price + buy_fee
            <br />
            proceeds = shares × sell_price − sell_fee
            <br />
            profit = proceeds − cost
            <br />
            return_pct = profit / cost × 100
            <br />
            breakeven_price = (cost + sell_fee) / shares
          </span>
        }
        citation={{
          label: "SEC Investor.gov — Calculating an Investment's Total Return",
          href: "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just closed a position and want to confirm the broker's P&L number.",
          "You're sizing a trade and want to know the break-even price after commissions.",
          "You're comparing two candidate exits at different prices and fee structures.",
          "You're teaching a beginner the difference between dollar profit and percent return.",
          "You're modeling a short sale and need the cover price that wipes out your gain.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Confusing dollar profit with return.", fix: "Always divide profit by cost basis. A bigger dollar number on a much bigger position can be a worse trade." },
          { mistake: "Ignoring fees on both legs.", fix: "Most US brokers are commission-free on stocks, but SEC and FINRA pass-through fees still apply on the sell leg. Check your trade confirmation." },
          { mistake: "Forgetting that gains are taxed.", fix: "Short-term gains (held one year or less) are taxed at ordinary income rates. Long-term gains get preferential rates. The calculator shows pre-tax numbers." },
          { mistake: "Mixing tax lots without picking a basis method.", fix: "If you bought in pieces, FIFO is the IRS default unless your broker has your election on file. Average cost is only allowed for some account types." },
          { mistake: "Comparing a foreign-stock return in local currency.", fix: "Convert both sides to your home currency at each trade date. FX swings can flip a winner into a loser." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cost basis", definition: "What you paid for the shares, including commissions. Used to compute taxable gain or loss." },
          { term: "Proceeds", definition: "What you received from the sale, net of selling fees." },
          { term: "Break-even price", definition: "The sell price at which profit is exactly zero after all fees." },
          { term: "Return on investment (ROI)", definition: "Profit divided by cost basis, expressed as a percent." },
          { term: "Short sale", definition: "Selling borrowed shares first and buying them back later — the trade order is reversed but the math is the same." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "SEC Investor.gov — Investing Basics and Total Return", href: "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work" },
          { label: "FINRA — Understanding Cost Basis", href: "https://www.finra.org/investors/insights/cost-basis" },
          { label: "IRS Publication 550 — Investment Income and Expenses", href: "https://www.irs.gov/forms-pubs/about-publication-550" },
          { label: "IRS Topic 409 — Capital Gains and Losses", href: "https://www.irs.gov/taxtopics/tc409" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA review before publish — tax statements must be confirmed against current IRS guidance" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["options-profit-calculator", "dividend-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
