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

const SLUG = "discount-calculator";
const TITLE = "Discount Calculator";
const DESC =
  "Find the discounted price after one or more percent-off coupons. Handles stacked discounts and the dollar-amount form.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between percent off and dollar off?",
    answer:
      "Percent off scales with the price: 30% off a $120 item saves $36, but 30% off a $50 item only saves $15. Dollar off is a fixed cut no matter the price, so $10 off is always $10. Percent discounts hit pricier items harder; flat dollar discounts help cheaper items more.",
  },
  {
    question: "What does BOGO actually mean?",
    answer:
      "BOGO stands for Buy One Get One. The free version (BOGO free) means you pay for one and get a second of equal or lesser value at no charge — an effective 50% off when you buy two. BOGO 50% means the second item is half price, which works out to 25% off the pair.",
  },
  {
    question: "Do discounts stack on top of each other?",
    answer:
      "When two percent-off discounts stack, they apply multiplicatively, not additively. A 30% coupon plus a 20% coupon is not 50% off — it is 0.70 times 0.80 = 0.56, so 44% off. Some stores cap stacking or block coupon combos in their terms.",
  },
  {
    question: "Is sales tax added before or after the discount?",
    answer:
      "In most US states, sales tax applies to the discounted price when the discount is a store coupon. Manufacturer coupons can be different — some states still tax the pre-coupon price. Check your state's department of revenue rules to be sure.",
  },
  {
    question: "What is MAP pricing?",
    answer:
      "MAP stands for Minimum Advertised Price — the lowest price a retailer is allowed to advertise for a product. It does not control the final sale price, only the advertised one, which is why you sometimes have to add an item to your cart to see the real discount.",
  },
  {
    question: "When is a sale price misleading?",
    answer:
      "The FTC's Guides Against Deceptive Pricing say a comparison price like an MSRP or 'was' price must reflect a real, recent selling price — not an inflated number used only to make the discount look bigger. Constant 'sales' from a fake reference price are deceptive under those guides.",
  },
  {
    question: "Can I return a final-sale item?",
    answer:
      "Final-sale items are usually non-returnable and non-refundable by store policy, even if the item is defective in some cases. Federal law does not require any store to take returns, so the posted policy controls. Always read the return rules before you buy a deeply discounted final-sale item.",
  },
  {
    question: "Does the order of stacked discounts change the final price?",
    answer:
      "If both discounts are percent off, the order does not matter — multiplication is commutative. If you mix a percent off with a dollar off, the order matters: taking the dollar off first lets the percent off apply to a smaller base. Read the coupon fine print to see which goes first.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Percent Off, Dollar Off & Stacked Coupons`,
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
      name: "How to calculate a discount",
      steps: [
        { name: "Enter the original price", text: "Use the sticker or list price before any discount is applied." },
        { name: "Pick the discount type", text: "Choose percent off for a percentage coupon, or dollar off for a flat amount." },
        { name: "Apply the discount", text: "For percent off, final = original times (1 minus percent divided by 100). For dollar off, final = original minus amount." },
        { name: "Stack a second discount if you have one", text: "Apply each percent-off discount multiplicatively in order; a dollar-off coupon subtracts from the running total." },
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

      <Hero title={TITLE} tagline="Type the original price, pick percent off or dollar off, and see the final price with stacked coupons.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A $120 jacket has a 30%-off coupon plus an extra $10-off promo. What is the final price?"
        steps={[
          { label: "Original price", value: "$120.00" },
          { label: "Apply 30% off: $120 × (1 − 0.30)", value: "$84.00" },
          { label: "Apply $10 off: $84 − $10", value: "$74.00" },
          { label: "Total saved", value: "$46.00" },
          { label: "Effective discount: $46 ÷ $120", value: "38.3%" },
        ]}
        result="The jacket rings up at $74.00 — a $46.00 saving, or about 38.3% off the original $120 sticker."
      />

      <FormulaExplained
        plainEnglish="A percent-off coupon multiplies the price by what is left after the discount. A dollar-off coupon subtracts a fixed amount. When two percent-off coupons stack, you multiply both remainders together, which is always less than simply adding the two percentages."
        formula={
          <span>
            Percent off: final = original × (1 − pct / 100)
            <br />
            Dollar off: final = original − amount
            <br />
            Stacked percent off: final = original × (1 − p₁/100) × (1 − p₂/100)
          </span>
        }
        citation={{
          label: "FTC Guides Against Deceptive Pricing — 16 CFR Part 233",
          href: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are at the register comparing a percent-off coupon to a dollar-off coupon and want to know which saves more.",
          "You are shopping a sale that stacks a storewide promo on top of an item discount.",
          "You are budgeting a holiday purchase and need to know the after-coupon price before adding sales tax.",
          "You are pricing a bundle and want to see the effective discount across the whole order.",
          "You are a retailer or marketer setting a promo and checking what the customer will actually pay.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Adding two percent-off coupons together.", fix: "Percent discounts stack multiplicatively. 30% plus 20% is not 50% — it is 1 − (0.7 × 0.8) = 44% off." },
          { mistake: "Forgetting sales tax when comparing the final price.", fix: "Most US states tax the discounted price for store coupons, but the math is different for manufacturer coupons. Check your state rule." },
          { mistake: "Trusting the 'was' price at face value.", fix: "The FTC requires comparison prices to be real, recent selling prices. A permanent 'sale' off a phantom MSRP can be deceptive pricing." },
          { mistake: "Mixing dollar off and percent off in the wrong order.", fix: "Stores usually apply percent off first, then dollar off. The order can change the final price — read the coupon fine print." },
          { mistake: "Assuming final-sale items can be returned.", fix: "Federal law does not require any store to take returns. Final-sale and clearance items are usually non-returnable; read the policy before you buy." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "MSRP", definition: "Manufacturer's Suggested Retail Price. A reference number, not the price a retailer must charge." },
          { term: "MAP", definition: "Minimum Advertised Price. The lowest price a retailer is allowed to advertise, not the actual sale price." },
          { term: "BOGO", definition: "Buy One Get One. BOGO free is 50% off the pair; BOGO 50% is 25% off the pair." },
          { term: "Stacked discount", definition: "Two or more discounts applied to the same purchase, usually multiplicatively for percent off." },
          { term: "Effective discount rate", definition: "Total saved divided by the original price, expressed as a percent." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "FTC Guides Against Deceptive Pricing — 16 CFR Part 233", href: "https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233" },
          { label: "FTC Business Guidance — Advertising and Marketing Basics", href: "https://www.ftc.gov/business-guidance/advertising-marketing" },
          { label: "NIST Handbook 130 — Uniform Laws and Regulations in the Areas of Legal Metrology and Engine Fuel Quality", href: "https://www.nist.gov/pml/owm/publications/handbook-130" },
          { label: "BBB — Tips for Smart Coupon Shopping", href: "https://www.bbb.org/article/news-releases/22921-bbb-tip-smart-coupon-shopping" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for tax-related claims at publish" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["percent-off-calculator", "tip-calculator", "stock-profit-calculator"]} />
    </Container>
  );
}
