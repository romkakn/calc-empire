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

const SLUG = "savings-bond-calculator";
const TITLE = "Savings Bond Calculator";
const DESC =
  "Estimate EE and I bond value at maturity. Treasury rates, semi-annual compounding, 30-year accrual, and the 5-year early-redemption penalty.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between EE and I bonds?",
    answer:
      "EE bonds pay a fixed rate set at purchase and are guaranteed by Treasury to double in value after 20 years. I bonds pay a fixed rate plus an inflation rate that resets every 6 months, so the yield tracks CPI-U.",
  },
  {
    question: "How do the fixed and inflation rates on I bonds work?",
    answer:
      "Each I bond has a fixed rate locked in at purchase that lasts the full 30 years. The inflation rate is announced every May and November and adjusts every 6 months from your issue date. The composite rate combines both using the Treasury formula.",
  },
  {
    question: "How are savings bonds taxed?",
    answer:
      "Interest is exempt from state and local income tax and subject only to federal income tax. You can defer reporting interest until you redeem the bond or it reaches final maturity at 30 years. Used for qualified higher education, interest may be fully or partially excluded under the Education Savings Bond Program.",
  },
  {
    question: "Is there a penalty for cashing a savings bond early?",
    answer:
      "Yes. EE and I bonds can be redeemed after 12 months, but if you cash one before 5 years you lose the last 3 months of interest. After 5 years there is no penalty.",
  },
  {
    question: "When does a savings bond stop earning interest?",
    answer:
      "EE and I bonds reach final maturity 30 years after the issue date and stop earning interest at that point. The Treasury recommends redeeming bonds at or after final maturity since they no longer grow.",
  },
  {
    question: "Can I give a savings bond as a gift?",
    answer:
      "Yes. You can buy a savings bond as a gift through TreasuryDirect for any U.S. person who has a TreasuryDirect account. Gift bonds count toward the recipient's annual purchase limit, not yours, in the year they are delivered.",
  },
  {
    question: "Does this calculator give the exact Treasury redemption value?",
    answer:
      "No. It is an educational estimate based on the EE 20-year doubling rule and a steady I bond composite rate. Real I bond values use a sequence of 6-month rate periods. For an exact figure use the TreasuryDirect Savings Bond Calculator.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — EE & I Bond Value at Maturity`,
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
      name: "How to estimate the value of a U.S. savings bond",
      steps: [
        { name: "Pick the bond type", text: "EE bonds double in 20 years. I bonds pay a fixed rate plus a CPI-U inflation rate that resets every 6 months." },
        { name: "Enter face value and issue date", text: "Use the principal you paid and the month and year on the bond. Modern EE and I bonds are sold at face value through TreasuryDirect." },
        { name: "Apply semi-annual compounding", text: "Both series compound interest every 6 months from the issue month, so value grows in discrete steps." },
        { name: "Check the 5-year and 30-year rules", text: "Before 5 years you forfeit the last 3 months of interest if you redeem. At 30 years the bond reaches final maturity and stops earning." },
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

      <Hero title={TITLE} tagline="See what an EE or I bond is worth today, what it will hit at 20-year doubling, and how the early-redemption penalty bites.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A grandparent bought a $100 EE bond in June 2010 for a newborn grandchild. What is the bond guaranteed to be worth at 20-year maturity in June 2030?"
        steps={[
          { label: "Series", value: "EE bond" },
          { label: "Face value (purchase price)", value: "$100.00" },
          { label: "Treasury guarantee at 20 years: value doubles", value: "$100 × 2" },
          { label: "Guaranteed value at June 2030", value: "$200.00" },
          { label: "Implied effective rate to reach doubling", value: "≈ 3.5% APR" },
        ]}
        result="The EE bond is guaranteed by Treasury to be worth $200 at 20-year maturity. After 20 years it keeps earning at its original fixed rate until final maturity at 30 years."
      />

      <FormulaExplained
        plainEnglish="EE bonds carry a Treasury guarantee that the bond will be worth at least double its issue price after 20 years — that works out to an effective rate of about 3.5% APR. I bonds use a composite rate that blends a fixed rate (locked at purchase) with a CPI-U inflation rate that resets every 6 months. Both compound semi-annually from the issue month."
        formula={
          <span>
            EE value (20-yr guarantee) = face × 2
            <br />
            Effective EE rate = 2<sup>1/20</sup> − 1 ≈ 3.526% APR {/* TODO_VERIFY: EE 20-year doubling guarantee — https://www.treasurydirect.gov/savings-bonds/ee-bonds/ */}
            <br />
            I bond composite = fixed + 2 × semi + (fixed × semi) {/* TODO_VERIFY: I bond composite rate formula — https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/ */}
            <br />
            Value<sub>t</sub> = principal × (1 + rate/2)<sup>2t</sup>
          </span>
        }
        citation={{
          label: "TreasuryDirect — EE and I Savings Bonds (U.S. Department of the Treasury)",
          href: "https://www.treasurydirect.gov/savings-bonds/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You inherited a stack of paper EE or I bonds and want a quick read on what they are worth today.",
          "You are choosing between EE and I bonds for a long-term gift to a child or grandchild.",
          "You are deciding whether to redeem an I bond now or hold it through another 6-month rate period.",
          "You are weighing the 3-month interest penalty against cashing out before the 5-year mark.",
          "You are a financial coach explaining bond mechanics to a client new to fixed income.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming EE bonds always double exactly at 20 years.", fix: "The doubling is a Treasury guarantee. If the posted fixed rate would not get there, Treasury adds a one-time adjustment at the 20-year mark." },
          { mistake: "Treating the I bond fixed rate as the full yield.", fix: "Your real yield is the composite rate: fixed plus the current inflation component. Inflation can push the composite well above the fixed rate." },
          { mistake: "Cashing before 5 years and forgetting the penalty.", fix: "Bonds redeemed before 5 years forfeit the last 3 months of interest. Calculate the net before you click redeem on TreasuryDirect." },
          { mistake: "Holding past 30-year final maturity.", fix: "EE and I bonds stop earning at 30 years from issue. Redeem on or just after final maturity — there is no upside in waiting." },
          { mistake: "Ignoring federal tax on the accrued interest.", fix: "Interest is state-tax-free but federally taxable. Most holders defer until redemption, which lands a big 1099-INT in one tax year." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "EE bond", definition: "Treasury savings bond with a fixed rate at purchase and a 20-year doubling guarantee." },
          { term: "I bond", definition: "Inflation-indexed Treasury savings bond. Composite rate = fixed + CPI-U inflation component." },
          { term: "Composite rate", definition: "Blended I bond rate combining the fixed rate and the semi-annual inflation rate." },
          { term: "Final maturity", definition: "30 years from issue. Bond stops earning interest." },
          { term: "TreasuryDirect", definition: "U.S. Treasury platform for buying, holding, and redeeming electronic savings bonds." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "TreasuryDirect — EE and I Savings Bonds (U.S. Treasury)", href: "https://www.treasurydirect.gov/savings-bonds/" },
          { label: "TreasuryDirect — I Bond Composite Rate Formula", href: "https://www.treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/" },
          { label: "IRS Publication 550 — Investment Income and Expenses", href: "https://www.irs.gov/publications/p550" },
          { label: "SEC Investor.gov — Savings Bonds", href: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/bonds-or-fixed-income-products/savings" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["money-market-calculator", "ira-calculator", "time-value-of-money-calculator"]} />
    </Container>
  );
}
