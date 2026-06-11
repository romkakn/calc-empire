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

const SLUG = "home-insurance-calculator";
const TITLE = "Home Insurance Calculator";
const DESC =
  "Premium estimate from dwelling coverage, deductible, location risk, and credit tier. Plain-English math, FEMA risk note, deductible tradeoff.";

const FAQS: FaqItem[] = [
  {
    question: "Replacement cost or market value — which one do I insure?",
    answer:
      "Insure the replacement cost: what it would take to rebuild the house with current materials and labor. Market value includes land and neighborhood pricing that don't burn down. Under-insuring on market value is the single biggest cause of underpaid claims.",
  },
  {
    question: "Should I raise my deductible to save money?",
    answer:
      "Going from a $500 to a $2,500 deductible can shave roughly 10–20% off the premium. It only pays off if you keep that extra $2,000 set aside for a claim. If a $2,500 surprise bill would hurt, keep the lower deductible.",
  },
  {
    question: "What is the difference between named-peril and open-peril?",
    answer:
      "A named-peril policy only covers losses from the perils listed in the contract — fire, theft, hail, and so on. An open-peril (all-risk) policy covers any sudden loss except what is specifically excluded. Open-peril is broader and costs more.",
  },
  {
    question: "HO-3 versus HO-5 — what is the difference?",
    answer:
      "HO-3 is the most common form: open-peril on the structure, named-peril on your belongings. HO-5 upgrades belongings to open-peril too and usually settles claims at replacement cost. HO-5 costs more but pays out more on a typical theft or accidental damage claim.",
  },
  {
    question: "Does home insurance cover flooding?",
    answer:
      "No. Standard HO-3 and HO-5 policies exclude flood damage from rising water. You need a separate policy through the NFIP (FEMA) or a private flood insurer. Sewer backup is also a separate endorsement on most policies.",
  },
  {
    question: "How does claim history affect my premium?",
    answer:
      "Carriers pull a CLUE report that lists property claims from the last seven years. Two or more claims in that window can raise your premium by 20% or more, or push you into a non-standard market. Small claims under the deductible are not reported.",
  },
  {
    question: "Why does my credit score affect my rate?",
    answer:
      "Most states allow credit-based insurance scoring because actuaries find a correlation with claim frequency. California, Massachusetts, Maryland, and Hawaii ban it for home insurance. Pulling your credit for an insurance quote is a soft pull and does not lower your score.",
  },
  {
    question: "Is this calculator a real quote?",
    answer:
      "No. It is a planning estimate based on national averages. A binding quote needs the carrier's underwriter to look at the roof age, wiring, distance to a fire hydrant, and dozens of other factors.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Premium Estimator With Deductible & Risk`,
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
      name: "How to estimate your homeowners insurance premium",
      steps: [
        { name: "Enter the rebuild cost", text: "Use your dwelling coverage — what it would cost to rebuild the house, not the market price." },
        { name: "Pick a deductible", text: "$1,000 is the default. Higher cuts the premium but raises your out-of-pocket at claim time." },
        { name: "Set location risk and credit tier", text: "FEMA flood and wildfire zones drive a 20–55% surcharge. Most states let carriers use a credit-based insurance score." },
        { name: "Apply discounts", text: "Bundling with auto typically saves about 10%. Alarm systems, new roofs, and impact-rated shingles add more." },
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

      <Hero
        title={TITLE}
        tagline="Estimate your annual homeowners premium from coverage amount, deductible, FEMA risk zone, and credit tier — with the math shown."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homeowner needs $300,000 in dwelling coverage, picks a $1,000 deductible, lives in a low-risk ZIP code, and has good credit. No bundling."
        steps={[
          { label: "Baseline rate: $3.50 per $1,000 of coverage", value: "" },
          { label: "300,000 / 1,000 × $3.50", value: "$1,050" },
          { label: "Deductible $1,000 multiplier × 1.00", value: "$1,050" },
          { label: "Low risk × 1.00 · good credit × 1.00", value: "$1,050" },
          { label: "No bundling discount", value: "$1,050/year" },
        ]}
        result="Estimated annual premium: about $1,050, or roughly $88 per month. Raising the deductible to $2,500 would drop it to about $945."
      />

      <FormulaExplained
        plainEnglish="Carriers start with a base rate per $1,000 of dwelling coverage, then multiply by adjustments for your deductible, ZIP-code risk, credit tier, and discounts. Lower deductibles and higher risk push the premium up; bundling and a clean credit file pull it down."
        formula={
          <span>
            Premium = (Coverage / 1,000) × BaseRate × Mult<sub>deductible</sub> × Mult<sub>risk</sub> × Mult<sub>credit</sub> × Discount<sub>bundling</sub>
            <br />
            BaseRate ≈ $3.50 per $1,000 (national average)
            <br />
            Deductible multipliers: $500 = 1.10 · $1,000 = 1.00 · $2,500 = 0.90 · $5,000 = 0.82
          </span>
        }
        citation={{
          label: "Insurance Information Institute — Facts + Statistics: Homeowners and Renters Insurance",
          href: "https://www.iii.org/fact-statistic/facts-statistics-homeowners-and-renters-insurance",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're shopping for a new home and want to budget a realistic annual premium before closing.",
          "Your renewal arrived with a big rate hike and you want a sanity check before calling an agent.",
          "You're deciding whether raising the deductible is worth the savings.",
          "You're a first-time buyer and want to understand what coverage amount your lender will require.",
          "You moved and want to see how a new ZIP code or risk zone changes the math.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Insuring the house at market value.", fix: "Market value includes land and location premium. Insure the rebuild cost — your local builder or the carrier's replacement-cost tool can quote it." },
          { mistake: "Assuming flood is covered.", fix: "Standard HO-3/HO-5 policies exclude flood. Buy a separate NFIP or private flood policy if your address is anywhere near a flood zone." },
          { mistake: "Filing small claims under the deductible.", fix: "Carriers see every reported claim on the CLUE database for seven years. Pay small losses yourself and save the policy for big events." },
          { mistake: "Picking the cheapest quote without checking coverage limits.", fix: "Compare dwelling, personal property, liability, and loss-of-use limits side by side. A $200/year savings often comes from $100k less in personal property coverage." },
          { mistake: "Forgetting to update coverage after a remodel.", fix: "A finished basement or new kitchen raises the rebuild cost. Tell your carrier or you'll be underinsured at claim time." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Dwelling coverage (Coverage A)", definition: "The dollar amount the policy will pay to rebuild the structure of your home." },
          { term: "Replacement cost value (RCV)", definition: "Cost to rebuild or replace property at today's prices, no depreciation deducted." },
          { term: "Actual cash value (ACV)", definition: "Replacement cost minus depreciation. Cheaper premium, smaller claim payout." },
          { term: "Deductible", definition: "The amount you pay out of pocket on a covered claim before insurance pays the rest." },
          { term: "CLUE report", definition: "Comprehensive Loss Underwriting Exchange — a seven-year history of property insurance claims tied to you and your address." },
          { term: "HO-3 / HO-5", definition: "Standard homeowners policy forms. HO-3 is the common baseline; HO-5 is broader (open-peril on belongings)." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Insurance Information Institute (III) — Facts + Statistics: Homeowners and Renters Insurance", href: "https://www.iii.org/fact-statistic/facts-statistics-homeowners-and-renters-insurance" },
          { label: "NAIC — A Consumer's Guide to Home Insurance", href: "https://content.naic.org/sites/default/files/publication-hoi-bu-home-insurance.pdf" },
          { label: "NAIC — Homeowners Insurance Topic Page", href: "https://content.naic.org/cipr-topics/homeowners-insurance" },
          { label: "FEMA — National Flood Insurance Program (NFIP)", href: "https://www.fema.gov/flood-insurance" },
          { label: "III — How Your Credit Score Affects Your Insurance", href: "https://www.iii.org/article/how-credit-affects-your-home-insurance" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["capital-gains-tax-calculator", "prorated-rent-calculator", "paycheck-calculator"]} />
    </Container>
  );
}
