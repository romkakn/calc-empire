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

const SLUG = "percent-off-calculator";
const TITLE = "Percent Off Calculator";
const DESC =
  "Find the sale price after a percent-off discount. Shows you the dollars saved and the final price you pay.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between percent off and total discount?",
    answer:
      "Percent off is the share of the original price the store knocks down. Total discount is the dollar amount you save. A 25% off tag on a $79.99 item is a $20.00 total discount.",
  },
  {
    question: "How do I stack two percent-off discounts?",
    answer:
      "Stacked discounts apply one after the other, not added together. A 20% off coupon on top of a 30% off sale is 0.80 × 0.70 = 0.56 of original, or 44% off in total — not 50%.",
  },
  {
    question: "Is sales tax calculated before or after the discount?",
    answer:
      "In every US state, sales tax is charged on the discounted price when the discount comes from the store. Manufacturer coupons can be different — some states tax the pre-coupon price. Check your receipt to see which rule your retailer used.",
  },
  {
    question: "How do stores round the sale price?",
    answer:
      "Most US retailers round to the nearest cent using standard half-up rounding. A 33% discount on $14.99 is $4.9467, which prints as $4.95 off and a $10.04 sale price. Small differences from your own math are usually a rounding step.",
  },
  {
    question: "How do I compare two percent-off deals?",
    answer:
      "Convert both to the final price you'd pay, not the percent on the tag. A $60 jacket at 40% off is $36; a $50 jacket at 30% off is $35. The smaller percent off wins here.",
  },
  {
    question: "Can I use more than one coupon on the same item?",
    answer:
      "It depends on the store. Most retailers limit you to one percent-off coupon per item, but many will let a percent-off coupon stack with a dollar-off coupon or a loyalty reward. Check the coupon's fine print for words like \"cannot be combined.\"",
  },
  {
    question: "What about return policies on discounted items?",
    answer:
      "Final-sale and clearance items often cannot be returned, even with the receipt. Items bought at a regular percent-off sale usually follow the store's standard return window, but you'll get back the discounted price you paid — not the original tag price.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Sale Price + Dollars Saved`,
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
      name: "How to calculate a percent-off sale price",
      steps: [
        { name: "Enter the original price", text: "Use the pre-discount tag price in dollars." },
        { name: "Enter the percent off", text: "Type the percent from the sale sign — for example, 25 for 25% off." },
        { name: "Multiply to find savings", text: "Savings = original price × (percent ÷ 100). A 25% discount on $79.99 is $20.00." },
        { name: "Subtract for the sale price", text: "Sale price = original − savings. $79.99 − $20.00 = $59.99." },
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

      <Hero title={TITLE} tagline="Type the price and the percent off — see the dollars saved and the final price side by side.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A jacket is tagged $79.99 with a 25% off sale. What do you save and what do you pay?"
        steps={[
          { label: "Formula: savings = original × (percent ÷ 100)", value: "" },
          { label: "Plug in: 79.99 × 0.25", value: "$20.00" },
          { label: "Sale price = original − savings: 79.99 − 20.00", value: "$59.99" },
          { label: "Effective share paid: 100% − 25%", value: "75%" },
        ]}
        result="A $79.99 item at 25% off saves $20.00 and rings up at $59.99 — you pay 75% of the tag price."
      />

      <FormulaExplained
        plainEnglish="Percent off is a share of the original price the store removes. Multiply the price by the percent (as a decimal) to get the dollar savings, then subtract from the original to find the sale price."
        formula={
          <span>
            savings = original × (percent ÷ 100)
            <br />
            sale price = original − savings
            <br />
            effective paid % = 100 − percent
          </span>
        }
        citation={{
          label: "FTC Guides Against Deceptive Pricing — 16 CFR Part 233",
          href: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're standing in a store and want to know the final price before you get to checkout.",
          "You're comparing two sale tags and need to see which one really costs less.",
          "You're planning a budget for a shopping trip and want to estimate cart totals.",
          "You're a small-business owner pricing a promotion and want to model the discount.",
          "You're teaching kids or students how percentages work with real-world prices.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Adding stacked discounts together.", fix: "Two 20% off coupons aren't 40% off — they multiply. 0.80 × 0.80 = 0.64, or 36% off total." },
          { mistake: "Forgetting sales tax.", fix: "The sale price is pre-tax. Add your local sales tax rate to the discounted price for the real out-the-door cost." },
          { mistake: "Reading the percent as the price.", fix: "30% off does not mean the item costs 30% of the tag. You pay 70%. Always subtract from 100." },
          { mistake: "Trusting the bigger percent on the bigger tag.", fix: "A 40%-off luxury item can still cost more than a 20%-off mid-tier one. Compare final dollar prices, not percents." },
          { mistake: "Assuming final-sale items can be returned.", fix: "Clearance and percent-off promos often waive the return policy. Read the receipt or the sign before you buy." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "MSRP", definition: "Manufacturer's Suggested Retail Price — the reference price a percent discount is measured against." },
          { term: "Markdown", definition: "A retailer's permanent price reduction, often shown as percent off the original tag." },
          { term: "Stacked discount", definition: "Two or more discounts applied to the same item in sequence, multiplying rather than adding." },
          { term: "Effective discount", definition: "The combined percent off after stacking, rounding, and any added coupons resolve." },
          { term: "Tax-inclusive price", definition: "The cart total after sales tax is added to the discounted subtotal." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "FTC Guides Against Deceptive Pricing — 16 CFR Part 233", href: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233" },
          { label: "U.S. Bureau of Labor Statistics — CPI Methodology (price collection and discounts)", href: "https://www.bls.gov/cpi/quality-adjustment/questions-and-answers.htm" },
          { label: "NIST Handbook 130 — Uniform Laws and Regulations in Weights, Measures, and Pricing", href: "https://www.nist.gov/pml/owm/publications/nist-handbook-130" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["discount-calculator", "tip-calculator", "stock-profit-calculator"]} />
    </Container>
  );
}
