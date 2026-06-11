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

const SLUG = "gold-calculator";
const TITLE = "Gold Calculator";
const DESC =
  "Value of gold by weight and purity (10k, 14k, 18k, 22k, 24k). Live spot price input — works for jewelry, scrap, and bullion.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between karat and carat?",
    answer:
      "Karat (k) measures gold purity out of 24 parts — 18k is 18/24 (75%) pure gold. Carat (ct) measures gemstone weight, where 1 ct = 0.2 grams. The terms sound the same but mean different things.",
  },
  {
    question: "How pure is each karat grade?",
    answer:
      "10k is 41.67% pure gold, 14k is 58.33%, 18k is 75%, 22k is 91.67%, and 24k is 99.9%+ pure. The rest is alloy metals like silver, copper, or zinc that add strength and color.",
  },
  {
    question: "Why is a troy ounce different from a regular ounce?",
    answer:
      "Precious metals are weighed in troy ounces (31.1035 grams), not the avoirdupois ounces used for groceries (28.3495 grams). One troy ounce is about 10% heavier. All gold spot prices quote troy ounces.",
  },
  {
    question: "Will a buyer actually pay the calculated value?",
    answer:
      "No. Scrap and pawn buyers typically pay 60–80% of the melt value to cover refining and profit margin. Retail jewelry sells well above melt value because of craftsmanship and brand markup. This calculator gives you the raw metal value as a baseline.",
  },
  {
    question: "Do I owe taxes when I sell gold?",
    answer:
      "In the US, gold is treated as a collectible by the IRS, with long-term gains taxed up to 28%. Dealers may file Form 1099-B for certain bullion sales. See IRS Publication 525 and consult a CPA for your situation.",
  },
  {
    question: "Where does the spot price come from?",
    answer:
      "The LBMA Gold Price is the global benchmark, set twice daily in London. Live tick prices come from the COMEX futures market. Spot prices update every few seconds during trading hours.",
  },
  {
    question: "Does this work for gold-plated or gold-filled items?",
    answer:
      "No. Plated items have a microscopic gold layer worth almost nothing. Gold-filled is 5% gold by weight — you would need to estimate the gold layer weight separately. This calculator assumes solid gold of the chosen karat.",
  },
  {
    question: "How do I know the karat of an item?",
    answer:
      "Look for a stamp inside rings, on clasps, or on the back of pendants — common marks include 10K, 14K, 417, 585, 750, or 999. Unmarked or worn pieces may need a professional acid test or XRF scan.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Melt Value by Karat & Weight`,
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
      name: "How to calculate the value of gold",
      steps: [
        { name: "Weigh your gold", text: "Use a gram scale or convert from troy ounces. One troy ounce = 31.1035 g." },
        { name: "Identify the karat", text: "Check the stamp: 10k, 14k, 18k, 22k, or 24k. Each karat is a fraction of 24 parts pure gold." },
        { name: "Get the spot price", text: "Look up the current gold price per troy ounce from LBMA or a live market feed. Divide by 31.1035 for the per-gram price." },
        { name: "Apply the formula", text: "Value = weight (g) × (karat / 24) × spot price per gram. Buyers usually pay 60–80% of this melt value." },
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

      <Hero title={TITLE} tagline="Estimate the melt value of jewelry, scrap, or bullion by weight and karat — with a live spot-price input.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You have a 14k gold chain weighing 10 grams. Spot gold is trading at $2,400 per troy ounce. What's the melt value?"
        steps={[
          { label: "Convert spot to per-gram: 2400 / 31.1035", value: "$77.16/g" },
          { label: "14k purity fraction: 14 / 24", value: "0.5833" },
          { label: "Pure gold weight: 10 g × 0.5833", value: "5.833 g" },
          { label: "Multiply by per-gram price: 5.833 × 77.16", value: "$450.10" },
          { label: "Rounded", value: "$450" },
        ]}
        result="The 10 g 14k chain has a melt value of about $450. A scrap buyer at 70% would offer near $315; a refiner paying 90% would offer near $405."
      />

      <FormulaExplained
        plainEnglish="Gold value depends on three numbers: how much you have (weight), how pure it is (karat), and what the market pays per unit (spot price). Multiply them and you get the raw metal value — the floor any buyer starts from."
        formula={
          <span>
            value = weight (g) × (karat / 24) × spot per gram
            <br />
            spot per gram = spot per troy oz / 31.1035
            <br />
            Karat fractions: 10k = 0.4167 · 14k = 0.5833 · 18k = 0.75 · 22k = 0.9167 · 24k = 1.0
          </span>
        }
        citation={{
          label: "World Gold Council — Gold purity and karat reference",
          href: "https://www.gold.org/goldhub/gold-focus/2020/04/gold-purity-and-karats",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're cleaning out old jewelry and want a baseline before walking into a pawn or scrap buyer.",
          "You inherited gold pieces and need a rough estimate for probate or insurance.",
          "You're shopping for a wedding band and want to know what the metal alone is worth.",
          "You're a coin or bullion buyer comparing dealer offers to the melt floor.",
          "You're tracking the value of a gold position as the spot price moves.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a regular kitchen ounce instead of a troy ounce.", fix: "Spot prices always quote troy ounces (31.1035 g). A regular ounce is 28.35 g — using it overstates per-gram price by about 10%." },
          { mistake: "Expecting full melt value from a buyer.", fix: "Scrap and pawn shops typically pay 60–80% of melt. Refiners pay more but require minimum quantities. Build the discount into your expectations." },
          { mistake: "Treating plated or filled items as solid gold.", fix: "Gold-plated is essentially zero melt value. Gold-filled is ~5% gold by weight. Only solid karat gold (stamped 10K through 24K, or 417/585/750/916/999) applies here." },
          { mistake: "Ignoring gemstones and findings in jewelry weight.", fix: "Weigh stones and non-gold parts separately. A 10 g ring with a 2 ct diamond has less than 10 g of gold." },
          { mistake: "Using a stale spot price.", fix: "Gold moves daily, sometimes 1–3% in a single session. Pull a fresh price right before you negotiate." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Karat (k)", definition: "Gold purity out of 24 parts. 24k is pure gold; 14k is 14/24 (58.3%) gold." },
          { term: "Troy ounce (oz t)", definition: "Precious-metals unit equal to 31.1035 grams. Used for all gold and silver spot quotes." },
          { term: "Pennyweight (dwt)", definition: "Older jewelry trade unit. 1 dwt = 1.5552 g; 20 dwt = 1 troy oz." },
          { term: "Spot price", definition: "Current market price per troy ounce for immediate delivery, set by global trading." },
          { term: "Melt value", definition: "Raw metal value of an item if it were melted down — ignores craftsmanship and brand." },
          { term: "LBMA Gold Price", definition: "The global benchmark, fixed twice daily in London by the London Bullion Market Association." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "World Gold Council — Gold purity and karats", href: "https://www.gold.org/goldhub/gold-focus/2020/04/gold-purity-and-karats" },
          { label: "LBMA — Gold Price benchmark", href: "https://www.lbma.org.uk/prices-and-data/precious-metal-prices" },
          { label: "IRS Publication 525 — Taxable and Nontaxable Income", href: "https://www.irs.gov/publications/p525" },
          { label: "NIST — Troy weight reference", href: "https://www.nist.gov/pml/owm/si-units-mass" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA review for the tax answer before publishing" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["stock-profit-calculator", "money-market-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
