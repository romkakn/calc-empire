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

const SLUG = "rounding-calculator";
const TITLE = "Rounding Calculator";
const DESC =
  "Round a number to any decimal place, integer, ten, hundred, or more. Supports nearest, up, down, and banker's (IEEE 754) rounding.";

const FAQS: FaqItem[] = [
  {
    question: "What is banker's rounding and why does it matter?",
    answer:
      "Banker's rounding (round half to even) breaks ties by picking the even neighbor instead of always rounding .5 up. Over many additions it cancels out instead of drifting upward, which keeps long sums unbiased. It is the IEEE 754 default and what Python, R, and most spreadsheet engines use by default.",
  },
  {
    question: "Why does Math.round in JavaScript sometimes surprise me?",
    answer:
      "JavaScript's Math.round rounds .5 toward positive infinity, so Math.round(-0.5) returns 0, not -1. Floating-point storage also bites: 1.005 is actually stored as 1.00499999…, so a naive round gives 1.00 instead of the expected 1.01. This calculator absorbs that noise with an epsilon adjustment.",
  },
  {
    question: "How are negative numbers rounded?",
    answer:
      "Nearest rounding pulls a negative number toward zero on .5 in many languages, but mathematically half-away-from-zero is more common. Floor sends -2.3 to -3 (toward minus infinity); ceil sends -2.3 to -2 (toward zero). Pick the rule that matches the system you are feeding the number into.",
  },
  {
    question: "How do I round to the nearest 5 or nearest 10?",
    answer:
      "To round to the nearest 5, divide by 5, round to an integer, then multiply by 5. To round to the nearest 10, set the decimal places to -1 in this calculator. The same divide-round-multiply trick works for nearest 25, 50, or any step.",
  },
  {
    question: "What rounding rule does the IRS use on tax forms?",
    answer:
      "IRS Publication 17 lets you round dollar amounts to whole dollars: drop amounts under 50 cents and round 50 cents through 99 cents up to the next dollar. You must round all entries the same way and the totals must still tie out. TODO_VERIFY: IRS Pub 17 2025 edition — confirm the rule is unchanged before publish.",
  },
  {
    question: "What rounding does the SEC require for financial filings?",
    answer:
      "SEC EDGAR rules let filers present figures in thousands or millions and round to that unit, but the rounding must be consistent across the filing. Public-company accounting under GAAP usually rounds half to even on per-share figures to avoid a positive bias.",
  },
  {
    question: "What are significant figures and how do they differ from decimal places?",
    answer:
      "Decimal places count digits after the point; significant figures count all meaningful digits from the first non-zero digit. 0.00456 has 5 decimal places but only 3 significant figures. The NIST guide to expressing measurement uncertainty recommends rounding to one or two significant figures in the uncertainty itself.",
  },
  {
    question: "Does rounding lose information?",
    answer:
      "Yes — rounding is lossy by design. Round only once, as late as possible, and keep extra digits during intermediate calculations. Rounding twice (for example to 4 decimals, then to 2) can give a different answer than rounding the original number once.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Decimal, Integer & Banker's Rounding`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Math", path: "/math" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "math", description: DESC }),
    howToSchema({
      name: "How to round a number to a chosen place",
      steps: [
        { name: "Pick the place", text: "Decide how many decimal places you need, or whether you want to round to the nearest integer, ten, hundred, etc. Negative places mean tens (-1), hundreds (-2), and so on." },
        { name: "Pick the rule", text: "Nearest is the default school rule. Up (ceiling) and down (floor) always push in one direction. Banker's rounds .5 to the even neighbor and is the IEEE 754 default." },
        { name: "Multiply, round, divide", text: "Multiply by 10 to the power of the chosen place, apply the rule to get an integer, then divide back. This avoids the floating-point traps of rounding the original directly." },
        { name: "Check the sign", text: "Confirm the sign of negatives is what you expect — floor pushes toward minus infinity, ceil toward zero." },
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

      <Hero title={TITLE} tagline="Round any number to the place you need — decimals, integers, tens, or banker's rounding for fair long sums.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Round 3.14159265 to 2 decimal places using the nearest rule."
        steps={[
          { label: "Formula: round(x × 10^n) / 10^n with n = 2", value: "" },
          { label: "Multiply by 100: 3.14159265 × 100", value: "314.159265" },
          { label: "Round to nearest integer", value: "314" },
          { label: "Divide by 100", value: "3.14" },
        ]}
        result="3.14159265 rounded to 2 decimals is 3.14."
      />

      <FormulaExplained
        plainEnglish="Every rounding rule follows the same three-step pattern: scale the number to where the rounding place sits at the ones digit, apply an integer rule, then scale back. The rule you pick — nearest, up, down, or banker's — changes only what happens at exact halves."
        formula={
          <span>
            nearest: round(x × 10<sup>n</sup>) / 10<sup>n</sup>
            <br />
            up: ⌈x × 10<sup>n</sup>⌉ / 10<sup>n</sup>
            <br />
            down: ⌊x × 10<sup>n</sup>⌋ / 10<sup>n</sup>
            <br />
            banker&apos;s: round-half-to-even per IEEE 754-2019
          </span>
        }
        citation={{
          label: "IEEE 754-2019 — IEEE Standard for Floating-Point Arithmetic (§5.4.1 roundTiesToEven)",
          href: "https://standards.ieee.org/ieee/754/6210/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You need a clean number for a report and want to control how .5 is handled.",
          "You are writing code that must match a spreadsheet or finance system and need banker's rounding.",
          "You are preparing tax forms and need whole-dollar rounding per IRS Publication 17.",
          "You are presenting scientific results and need to round to the right number of significant figures.",
          "You are teaching or learning math and want to see the multiply-round-divide steps written out.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Assuming Math.round is symmetric for negatives.", fix: "In JavaScript, Math.round(-0.5) is 0, not -1. Use half-away-from-zero or banker's when negatives matter." },
          { mistake: "Rounding twice.", fix: "Round once, at the final step. Rounding to 4 decimals and then to 2 can give a different answer than rounding the original directly." },
          { mistake: "Trusting that 1.005 rounds to 1.01.", fix: "Floating-point stores it as 1.00499999…, so a naive round drops it to 1.00. Add an epsilon, use a decimal library, or use banker's mode." },
          { mistake: "Mixing decimal places with significant figures.", fix: "0.00456 has 5 decimal places but 3 significant figures. Pick one and label it clearly in your report." },
          { mistake: "Using always-round-up on a long list of charges.", fix: "Half-up introduces a positive bias over thousands of rows. Banker's rounding cancels out and is the finance and IEEE 754 default." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Banker's rounding", definition: "Round half to even. The IEEE 754 default tie-breaker; avoids bias on long sums." },
          { term: "Half up", definition: "The school rule — .5 goes up. Simple but introduces a small positive bias." },
          { term: "Floor", definition: "Round toward minus infinity. ⌊2.9⌋ = 2; ⌊-2.1⌋ = -3." },
          { term: "Ceiling", definition: "Round toward positive infinity. ⌈2.1⌉ = 3; ⌈-2.9⌉ = -2." },
          { term: "Significant figures", definition: "Count of meaningful digits from the first non-zero digit. Used in science and engineering reporting." },
          { term: "Truncation", definition: "Drop the digits past the cut point — round toward zero. Not the same as floor for negatives." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IEEE 754-2019 — IEEE Standard for Floating-Point Arithmetic", href: "https://standards.ieee.org/ieee/754/6210/" },
          { label: "NIST — Guidelines for Evaluating and Expressing Measurement Uncertainty (TN 1297)", href: "https://www.nist.gov/pml/nist-technical-note-1297" },
          { label: "IRS Publication 17 — Your Federal Income Tax (rounding to whole dollars)", href: "https://www.irs.gov/publications/p17" },
          { label: "MDN — Math.round (JavaScript rounding semantics)", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["decimal-fraction-converter", "scientific-notation-calculator", "fractions-calculator"]} />
    </Container>
  );
}
