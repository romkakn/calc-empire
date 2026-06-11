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

const SLUG = "prorated-rent-calculator";
const TITLE = "Prorated Rent Calculator";
const DESC =
  "Prorated rent for a partial month — by days, weeks, or banker month. Pick the method, enter the move-in date, see the exact amount owed.";

const FAQS: FaqItem[] = [
  {
    question: "Which prorating method is most fair?",
    answer:
      "The daily method (rent × days occupied ÷ actual days in the month) is the most precise and what most tenant advocates recommend. The banker method (divide by 30) is simpler but slightly favors the landlord in 31-day months and the tenant in February. Both are common — what matters is that you and your landlord agree in writing before you sign.",
  },
  {
    question: "How does prorating work for an end-of-month move-in?",
    answer:
      "If you move in on the 28th of a 30-day month, you owe rent for 3 days (28, 29, 30). On $1,500 rent that's $1,500 × 3 ÷ 30 = $150. Some landlords roll a few end-of-month days into the next full month's rent to keep one combined payment — get this in writing.",
  },
  {
    question: "Should the security deposit be prorated too?",
    answer:
      "No. Security deposits are a fixed amount set by the lease, not tied to occupancy. You pay the full deposit regardless of when you move in. Prorating only applies to rent.",
  },
  {
    question: "Is the last month of a lease ever prorated?",
    answer:
      "Yes, if your lease ends partway through a month. The same daily formula applies: rent × days occupied ÷ days in the month. If you paid a full last month at lease signing, your landlord owes you a refund for the unused days.",
  },
  {
    question: "Are partial-month rules different by state?",
    answer:
      "Most US states do not have a statute that mandates a specific proration formula — it's lease-driven. A few jurisdictions (notably some California cities) have stricter tenant-protection rules. Check your local tenant rights office or a state-specific tenant guide before assuming.",
  },
  {
    question: "Why should I get the prorated amount in writing?",
    answer:
      "Verbal agreements about money cause disputes at move-out and when deposits are returned. A short written addendum stating the method used, the days occupied, and the dollar amount protects both sides. Email counts as written in most states.",
  },
  {
    question: "What if my landlord uses a different method than I expected?",
    answer:
      "Politely ask which formula they used and request it in writing. If the difference is small, it's usually not worth a fight. If it's large or the lease specifies a different method, point to the lease language. Local tenant rights organizations can help mediate.",
  },
  {
    question: "Does this calculator handle leap-year February?",
    answer:
      "Yes. The daily method uses the actual number of days in the month you select, so February 2028 (29 days) is handled correctly. The banker method always divides by 30, regardless of the actual month.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Daily, Banker & Weekly Methods`,
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
      name: "How to calculate prorated rent for a partial month",
      steps: [
        { name: "Pick a method", text: "Daily (most precise) uses actual days in the month. Banker uses a 30-day month. Confirm which one your lease specifies." },
        { name: "Count occupied days", text: "Count from your move-in date through the last day of the month, inclusive on both ends." },
        { name: "Apply the formula", text: "Daily: rent × days occupied ÷ days in month. Banker: rent × days occupied ÷ 30." },
        { name: "Get it in writing", text: "Send the landlord an email confirming the method, days, and dollar amount before you pay." },
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

      <Hero title={TITLE} tagline="Move-in mid-month? Get the exact prorated rent owed — by daily, banker, or weekly method.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Rent is $1,500. The tenant moves in on the 16th of a 30-day month. What's the prorated rent?"
        steps={[
          { label: "Days occupied: 16th through 30th (inclusive)", value: "15 days" },
          { label: "Formula (daily): rent × days ÷ days in month", value: "" },
          { label: "Plug in: 1500 × 15 ÷ 30", value: "750" },
          { label: "Prorated rent owed", value: "$750.00" },
          { label: "Same inputs, banker method: 1500 × 15 ÷ 30", value: "$750.00" },
        ]}
        result="The tenant owes $750 for the partial month. Both methods match here because the month has exactly 30 days. In a 31-day month, the daily method would be slightly lower."
      />

      <FormulaExplained
        plainEnglish="Prorated rent splits a full month's rent so you only pay for the days you actually occupied. The two common formulas give slightly different numbers in 31-day months and February — pick one and write it into the lease."
        formula={
          <span>
            Daily: prorated rent = monthly rent × days occupied ÷ days in month
            <br />
            Banker: prorated rent = monthly rent × days occupied ÷ 30
            <br />
            Weekly: prorated rent = (monthly rent ÷ 4) × weeks occupied
          </span>
        }
        citation={{
          label: "HUD — Renter's Rights and Resources",
          href: "https://www.hud.gov/topics/rental_assistance/tenantrights",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're moving into a new apartment partway through the month.",
          "You're a landlord setting a fair first-month invoice for a new tenant.",
          "Your lease ends mid-month and you want to confirm the refund owed.",
          "You're reviewing a lease addendum and want to verify the math.",
          "You're a property manager standardizing first-month billing across units.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming the daily and banker methods always match.", fix: "They only match in 30-day months. In a 31-day month, the banker method overcharges by roughly 1 day's rent. February underercharges by 1–2 days. Pick one method in writing." },
          { mistake: "Prorating the security deposit.", fix: "Deposits are a fixed lease amount, not occupancy-based. Pay the full deposit regardless of move-in date." },
          { mistake: "Forgetting to count the move-in day.", fix: "If you take possession on the 16th, the 16th counts as day one. Most landlords include both the move-in day and the last day of the month." },
          { mistake: "Paying without written confirmation.", fix: "Send an email stating the method, day count, and dollar amount before you transfer money. It prevents disputes at move-out." },
          { mistake: "Skipping local tenant law.", fix: "A few cities have specific proration rules. Check your local tenant rights office before assuming the lease language controls." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Proration", definition: "Splitting a fixed cost across the portion of a period actually used." },
          { term: "Daily method", definition: "Divide monthly rent by the actual number of days in the month, then multiply by days occupied." },
          { term: "Banker month", definition: "A standardized 30-day month used to simplify proration math." },
          { term: "Lease addendum", definition: "A short written agreement attached to the main lease that records the prorated amount." },
          { term: "Security deposit", definition: "Refundable amount held against damage or unpaid rent. Not subject to proration." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "HUD — Renter's Rights and Resources", href: "https://www.hud.gov/topics/rental_assistance/tenantrights" },
          { label: "National Apartment Association — Resident Resources", href: "https://www.naahq.org/resident-resources" },
          { label: "Consumer Financial Protection Bureau — Renting Basics", href: "https://www.consumerfinance.gov/consumer-tools/renting/" },
          { label: "USA.gov — Tenant Rights by State", href: "https://www.usa.gov/tenant-rights" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["pay-raise-calculator", "overtime-calculator", "home-insurance-calculator"]} />
    </Container>
  );
}
