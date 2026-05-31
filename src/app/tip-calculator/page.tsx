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

const SLUG = "tip-calculator";
const TITLE = "Tip Calculator";
const DESC =
  "Calculate the tip and your share when splitting a bill. US tipping norms built in.";

const FAQS: FaqItem[] = [
  {
    question: "How much should I tip at a US restaurant?",
    answer:
      "15% is the floor for adequate service, 18% is the modern standard, and 20% is what most diners leave for good service. Tip on the pretax amount if you want to be precise — the difference is small but adds up at a steakhouse.",
  },
  {
    question: "What if the menu says service is included?",
    answer:
      "If a service charge or gratuity is already on the check, you don't owe an additional tip. Many people add a few extra dollars for memorable service, but it's a courtesy, not an expectation.",
  },
  {
    question: "Should I tip on takeout or delivery?",
    answer:
      "For takeout, 10% is a polite acknowledgment, especially for a large order someone packed carefully. For delivery, tip the driver 15–20% or at least $5, whichever is higher — gas, mileage, and time all come out of their pocket.",
  },
  {
    question: "Do I tip the bartender separately?",
    answer:
      "Yes. The US norm is $1–$2 per beer or wine pour, and 18–20% on cocktails or a tab. If you camp at the bar for a long conversation, tip on the higher end.",
  },
  {
    question: "What about hotel housekeeping?",
    answer:
      "The Emily Post Institute suggests $2–$5 per night, left daily rather than in a lump sum at checkout — different staff may clean your room on different days. Leave it in an envelope or with a note so it's clearly a tip.",
  },
  {
    question: "When does the restaurant add an automatic gratuity?",
    answer:
      "Most US restaurants auto-apply 18–20% gratuity for groups of 6 or more. The percentage and threshold are printed on the menu — check before tipping again on top.",
  },
  {
    question: "Should I tip on pretax or post-tax?",
    answer:
      "Etiquette guides say pretax, since tax doesn't reflect service. In practice most people tip on the bottom line because it's easier and the difference is a dollar or two. Use the pretax toggle in this calculator if you want the precise number.",
  },
  {
    question: "Is tipping really optional in the US?",
    answer:
      "Technically yes, but US servers are paid a federal subminimum cash wage of $2.13 per hour with tips making up the rest — withholding a tip for routine service hurts the worker more than the restaurant. Talk to a manager if service was a real problem.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Split the Bill With US Tipping Norms`,
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
      name: "How to calculate a restaurant tip and split the bill",
      steps: [
        { name: "Enter the bill", text: "Use the total from the bottom of your check, or switch to the pretax mode if you want to tip on the subtotal only." },
        { name: "Pick a tip percentage", text: "15% is the US floor, 18% is the modern standard, 20% rewards good service. Tap a preset or type your own number." },
        { name: "Set the split", text: "Type how many people are sharing the check. The calculator divides the total — tip included — evenly." },
        { name: "Read the result", text: "You get the tip amount, the new total, and what each person owes. Round up at the table if you're paying cash." },
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

      <Hero title={TITLE} tagline="Type the bill, pick a percentage, split between friends — get the per-person number you actually owe.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Two friends share a $60 dinner check (tax included) and want to leave a standard 18% tip."
        steps={[
          { label: "Formula: tip = bill × (tip% / 100)", value: "" },
          { label: "Plug in: 60 × 0.18", value: "$10.80" },
          { label: "Total: 60 + 10.80", value: "$70.80" },
          { label: "Per person: 70.80 / 2", value: "$35.40" },
        ]}
        result="Tip $10.80 · Total $70.80 · Each person pays $35.40."
      />

      <FormulaExplained
        plainEnglish="A tip is a percentage of the bill. Multiply the bill by the tip rate to get the tip itself, add it to the bill for the total, then divide by the number of people sharing the check. If you tip on pretax, swap the bill for the subtotal and add tax back separately at the end."
        formula={
          <span>
            tip = bill × (tip% / 100)
            <br />
            total = bill + tip
            <br />
            per person = total / split
            <br />
            Pretax mode: tip = subtotal × (tip% / 100); total = subtotal + tax + tip
          </span>
        }
        citation={{
          label: "Emily Post Institute — General Tipping Guide",
          href: "https://emilypost.com/advice/general-tipping-guide",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're splitting a restaurant check with friends and want everyone to pay the same number.",
          "A waiter just dropped the bill and you want to leave a polite tip without doing math at the table.",
          "You're tipping on a pretax subtotal and need the precise number.",
          "You're ordering delivery and want a sensible tip on a quick keyboard.",
          "You're traveling in the US and unsure what the local norm actually is.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Tipping on a bill that already includes a service charge.", fix: "Scan the bottom of the check for 'service charge' or 'gratuity' before adding more — that line is the tip." },
          { mistake: "Splitting only the food cost and forgetting the tip.", fix: "Divide the total — bill plus tip — by the number of people, not the subtotal." },
          { mistake: "Tipping the same percent on takeout as on a sit-down meal.", fix: "10% on takeout is fine. Save 18–20% for table service where staff is paid below minimum wage and depends on tips." },
          { mistake: "Forgetting the auto-gratuity on groups of 6 or more.", fix: "Many US restaurants auto-add 18–20% for big tables. Read the menu fine print before tipping a second time." },
          { mistake: "Stiffing the server because the food was bad.", fix: "Servers don't cook. Tip on the service you got and ask a manager to fix the food complaint." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Gratuity", definition: "Formal name for a tip — money added to a bill for service." },
          { term: "Service charge", definition: "A fixed percentage the restaurant adds itself, which may or may not go entirely to staff." },
          { term: "Pretax subtotal", definition: "The amount on the bill before sales tax — etiquette guides use this as the base for a tip." },
          { term: "Tipped wage", definition: "US federal subminimum cash wage of $2.13/hour for workers who customarily receive tips." },
          { term: "Auto-gratuity", definition: "A tip the restaurant adds automatically, usually for groups of 6 or more." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "US Department of Labor — Tipped Employees (Fact Sheet #15)", href: "https://www.dol.gov/agencies/whd/fact-sheets/15-flsa-tipped-employees" },
          { label: "US Department of Labor — Minimum Wages for Tipped Employees", href: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped" },
          { label: "Bureau of Labor Statistics — Waiters and Waitresses (OEWS)", href: "https://www.bls.gov/oes/current/oes353031.htm" },
          { label: "Emily Post Institute — General Tipping Guide", href: "https://emilypost.com/advice/general-tipping-guide" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["percent-off-calculator", "discount-calculator", "stock-profit-calculator"]} />
    </Container>
  );
}
