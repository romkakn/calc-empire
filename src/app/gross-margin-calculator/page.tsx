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

const SLUG = "gross-margin-calculator";
const TITLE = "Gross Margin Calculator";
const DESC =
  "Gross margin and markup from cost and selling price, or work back from a target margin.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between margin and markup?",
    answer:
      "Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost. A $20 profit on a $60 sale of an item that cost $40 is a 33.3% margin but a 50% markup — same dollar profit, two different denominators.",
  },
  {
    question: "Is gross margin the same as net margin?",
    answer:
      "No. Gross margin only subtracts the cost of goods sold (COGS) from revenue. Net margin subtracts everything: COGS, operating expenses, interest, and taxes. Gross is always higher than net for a profitable business.",
  },
  {
    question: "What counts as COGS for the margin formula?",
    answer:
      "COGS includes the direct cost to make or buy the unit you sold: raw materials, factory labor, inbound freight, and packaging. It excludes office rent, salaries for non-production staff, marketing, and software — those go below the gross profit line.",
  },
  {
    question: "How do I set a price from a target margin?",
    answer:
      "Use price = cost / (1 - target margin / 100). For a 40% margin on a $30 cost, divide $30 by 0.60 to get a $50 price. Plugging back in: profit $20, margin 20/50 = 40%.",
  },
  {
    question: "What is a good gross margin by retail category?",
    answer:
      "Gross margins vary widely by sector. Grocery and big-box retail often run 20–30%, apparel and specialty retail 40–55%, and software 70–85%. Compare to peers in your category, not across categories.",
  },
  {
    question: "How is contribution margin different from gross margin?",
    answer:
      "Contribution margin subtracts only the variable costs that change with each unit sold. Gross margin subtracts all COGS, including some fixed production costs. Contribution margin is more useful for break-even and pricing decisions on the next unit.",
  },
  {
    question: "Can gross margin be negative?",
    answer:
      "Yes. If you sell below cost — a loss leader, a clearance sale, or a pricing mistake — your gross margin goes negative. Below the line, operating expenses make the loss bigger.",
  },
  {
    question: "Does this calculator handle sales tax or shipping?",
    answer:
      "No. Enter the price you receive (excluding sales tax) and the cost you pay (including inbound freight if you treat it as COGS). For more complex pricing, layer this output into a full cost build-up spreadsheet.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Margin, Markup & Target Price`,
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
      name: "How to calculate gross margin and markup",
      steps: [
        { name: "Pick a mode", text: "Compute margin and markup from cost and price, or solve for the price that hits a target margin." },
        { name: "Enter cost", text: "Use the unit cost of goods sold — direct materials, production labor, and inbound freight." },
        { name: "Enter price or target margin", text: "For the first mode enter the selling price you charge; for solver mode enter the gross margin you want to hit." },
        { name: "Read the result", text: "Gross profit per unit, margin as a percent of price, and markup as a percent of cost." },
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

      <Hero title={TITLE} tagline="Turn cost and price into margin, markup, and gross profit — or solve the price you need to hit a target margin.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You sell a unit for $60 and your COGS is $40. What are the gross profit, margin, and markup?"
        steps={[
          { label: "Gross profit = price − cost = 60 − 40", value: "$20.00" },
          { label: "Margin = profit / price = 20 / 60", value: "33.3%" },
          { label: "Markup = profit / cost = 20 / 40", value: "50.0%" },
          { label: "Sanity check: price = cost / (1 − margin) = 40 / (1 − 0.333)", value: "$60.00" },
        ]}
        result="A $40 cost sold for $60 yields $20 gross profit, a 33.3% gross margin, and a 50% markup."
      />

      <FormulaExplained
        plainEnglish="Gross profit is what is left after you subtract the direct cost of the goods sold from the price. Margin expresses that profit as a share of the sale; markup expresses it as a share of the cost. To plan a price from a target margin, divide the cost by one minus the margin written as a decimal."
        formula={
          <span>
            gross profit = price − cost
            <br />
            margin (%) = (price − cost) / price × 100
            <br />
            markup (%) = (price − cost) / cost × 100
            <br />
            price from target margin = cost / (1 − margin / 100)
          </span>
        }
        citation={{
          label: "U.S. SEC Investor.gov — Beginners' Guide to Financial Statements",
          href: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/beginners",
        }}
      />

      <WhenToUse
        scenarios={[
          "You priced a new product line and want to confirm the margin before launch.",
          "You're comparing a wholesale markup quote to the retail margin it implies.",
          "You're a small-business owner setting category-level pricing rules.",
          "You're preparing a pitch deck and need clean gross-profit numbers per SKU.",
          "You're a student learning the difference between margin, markup, and contribution margin.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Confusing margin with markup.", fix: "Margin uses price as the denominator; markup uses cost. A 50% markup is only a 33.3% margin." },
          { mistake: "Including operating expenses in COGS.", fix: "Office rent, salaries for non-production staff, and marketing belong below gross profit, not inside it." },
          { mistake: "Pricing at cost plus a flat percent and calling it the margin.", fix: "Cost + 30% is a 30% markup, which is only a 23.1% margin. Solve for price using cost / (1 − margin)." },
          { mistake: "Ignoring inbound freight and packaging.", fix: "If you treat outbound shipping as COGS, treat it that way every period. Be consistent so margins are comparable month to month." },
          { mistake: "Comparing margins across categories.", fix: "Grocery and software live in different ranges. Benchmark against peers in your own category, not against the whole market." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gross profit", definition: "Revenue minus the cost of goods sold, before operating expenses." },
          { term: "Margin", definition: "Profit as a percentage of selling price." },
          { term: "Markup", definition: "Profit as a percentage of cost." },
          { term: "COGS", definition: "Cost of goods sold — direct costs tied to the units you sold." },
          { term: "Contribution margin", definition: "Revenue minus variable costs only; the dollars each unit contributes to fixed costs and profit." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "U.S. SEC Investor.gov — Beginners' Guide to Financial Statements", href: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/beginners" },
          { label: "Harvard Business Review — A Refresher on Gross Margin", href: "https://hbr.org/2015/03/a-refresher-on-net-present-value" },
          { label: "U.S. Small Business Administration — Calculate your startup costs", href: "https://www.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["pay-raise-calculator", "cpm-calculator", "discount-calculator"]} />
    </Container>
  );
}
