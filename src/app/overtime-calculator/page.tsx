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

const SLUG = "overtime-calculator";
const TITLE = "Overtime Calculator";
const DESC =
  "FLSA overtime — base hours, OT hours, time-and-a-half or double-time. Calculate weekly pay with federal and California rules.";

const FAQS: FaqItem[] = [
  {
    question: "Who is exempt from FLSA overtime?",
    answer:
      "Most salaried workers in executive, administrative, or professional roles earning above the federal salary threshold are exempt from overtime. Non-exempt employees must be paid 1.5x their regular rate for hours beyond 40 per workweek. Job title alone does not determine exempt status — duties and pay basis both matter.",
  },
  {
    question: "What is the salary basis test?",
    answer:
      "To qualify as exempt, an employee must be paid a fixed salary that does not vary based on quality or quantity of work. They must also earn at least the federal weekly minimum and perform exempt duties. All three prongs must be met.",
  },
  {
    question: "Which states require double-time pay?",
    answer:
      "California is the main one: 2x kicks in after 12 hours in a single workday or after 8 hours on the seventh consecutive day of work. Most other states follow only the federal 1.5x rule. Always check your state labor department for current thresholds.",
  },
  {
    question: "Do holidays count toward overtime?",
    answer:
      "Under federal law, holiday pay is a benefit, not a requirement, and holiday hours typically do not count toward the 40-hour overtime threshold unless you actually worked them. Some employers pay extra for holiday shifts, but that is contract or policy, not FLSA.",
  },
  {
    question: "Can my employer give comp time instead of overtime?",
    answer:
      "Private-sector employers generally cannot substitute compensatory time off for overtime pay under the FLSA. Public-sector employers can offer comp time at 1.5 hours off per OT hour worked, with limits. Always get such agreements in writing.",
  },
  {
    question: "What counts as off-the-clock work?",
    answer:
      "Time spent on required tasks before clocking in, after clocking out, or during unpaid meal breaks is compensable if the employer knew or should have known. Common examples include answering emails at home, donning protective gear, and short breaks under 20 minutes. Unpaid off-the-clock work is a common FLSA violation.",
  },
  {
    question: "Does overtime apply to tipped workers?",
    answer:
      "Yes. Tipped employees earn 1.5x their regular rate of pay for overtime, calculated using the full minimum wage rather than just the cash wage. The tip credit cannot be expanded for overtime hours.",
  },
  {
    question: "How is the regular rate calculated for bonuses?",
    answer:
      "Non-discretionary bonuses must be included in the regular rate when calculating overtime. The bonus is allocated across the workweeks it covers and added to the hourly rate. Discretionary bonuses and gifts are excluded.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — FLSA Time-and-a-Half & Double-Time`,
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
      name: "How to calculate weekly overtime pay",
      steps: [
        { name: "Enter your hourly rate", text: "Use your base regular rate of pay before taxes." },
        { name: "Enter regular hours worked", text: "Federal FLSA caps the regular workweek at 40 hours for non-exempt workers." },
        { name: "Enter overtime hours", text: "Any hours beyond 40 in a workweek count as overtime under federal law." },
        { name: "Pick the multiplier", text: "1.5x is standard FLSA time-and-a-half. 2x is California double-time after 12 hrs/day." },
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

      <Hero title={TITLE} tagline="See exactly what a week of OT adds to your paycheck — federal 1.5x or California 2x, with the math shown.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="An hourly worker earns $20/hr and works 40 regular hours plus 10 overtime hours at 1.5x time-and-a-half."
        steps={[
          { label: "Regular pay: 40 × $20", value: "$800.00" },
          { label: "OT rate: $20 × 1.5", value: "$30.00/hr" },
          { label: "OT pay: 10 × $30", value: "$300.00" },
          { label: "Total weekly pay", value: "$1,100.00" },
        ]}
        result="$1,100 gross for the week — $800 regular + $300 overtime."
      />

      <FormulaExplained
        plainEnglish="Overtime pay equals overtime hours multiplied by your regular hourly rate, multiplied by the overtime factor. The FLSA sets the floor at 1.5x for hours worked beyond 40 in a workweek for non-exempt employees. California adds a double-time rule for long days and the seventh consecutive workday."
        formula={
          <span>
            OT pay = OT hours × regular rate × multiplier
            <br />
            Total = (regular hours × rate) + OT pay
            <br />
            FLSA: 1.5x after 40 hrs/week (non-exempt)
            <br />
            California: 2x after 12 hrs/day or 8 hrs on 7th consecutive day
          </span>
        }
        citation={{
          label: "US DOL — Fair Labor Standards Act Overtime Pay",
          href: "https://www.dol.gov/agencies/whd/overtime",
        }}
      />

      <WhenToUse
        scenarios={[
          "You picked up extra shifts and want to verify the paycheck matches the hours.",
          "You are deciding whether an OT shift is worth it after the multiplier.",
          "You are a manager budgeting payroll for a busy week or holiday push.",
          "You are checking that an employer correctly applied federal or state OT rules.",
          "You are comparing job offers and want to model OT-heavy scenarios.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Confusing job title with exempt status.", fix: "Exempt status depends on salary basis, salary threshold, and actual duties — not the title on your offer letter." },
          { mistake: "Counting holiday or PTO hours toward the 40-hour OT threshold.", fix: "Federal law only counts hours actually worked. Paid leave does not trigger 1.5x unless your contract says so." },
          { mistake: "Averaging hours across two weeks to avoid OT.", fix: "FLSA overtime is calculated workweek by workweek. 30 hrs one week plus 50 the next still triggers 10 hours of OT." },
          { mistake: "Forgetting bonuses in the regular rate.", fix: "Non-discretionary bonuses must be included in the regular rate, which raises the OT multiplier base." },
          { mistake: "Treating comp time as a private-sector option.", fix: "Private employers generally must pay cash overtime. Comp time in lieu of OT is limited to public-sector workers." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "FLSA", definition: "Fair Labor Standards Act — the federal law setting minimum wage, overtime, and child labor rules." },
          { term: "Non-exempt", definition: "An employee entitled to FLSA overtime protections — typically hourly workers." },
          { term: "Regular rate", definition: "The hourly equivalent of all non-excluded compensation in a workweek. The base for OT math." },
          { term: "Workweek", definition: "A fixed, recurring 168-hour period. The FLSA OT trigger is per workweek, not per pay period." },
          { term: "Double-time", definition: "A 2x premium required by some state laws (notably California) for very long days or seventh-day work." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "US DOL — Fair Labor Standards Act Overtime Pay", href: "https://www.dol.gov/agencies/whd/overtime" },
          { label: "US DOL — Fact Sheet #23: Overtime Pay Requirements", href: "https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay" },
          { label: "California DIR — Overtime", href: "https://www.dir.ca.gov/dlse/faq_overtime.htm" },
          { label: "SHRM — Calculating Overtime Pay", href: "https://www.shrm.org/topics-tools/tools/hr-answers/how-to-calculate-overtime-rates" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["pay-raise-calculator", "1099-tax-calculator", "paycheck-calculator"]} />
    </Container>
  );
}
