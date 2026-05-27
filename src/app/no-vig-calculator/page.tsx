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
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  jsonLd,
  personSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";

const SLUG = "no-vig-calculator";
const TITLE = "No-Vig Calculator";
const DESC =
  "Strip the bookmaker margin out of any two-way market and see the fair price for each side. Free, instant, with the math.";

const FAQS: FaqItem[] = [
  {
    question: "What is the vig in sports betting?",
    answer:
      "The vig (vigorish, juice, or hold) is the bookmaker's built-in margin. It's why two evenly matched sides are usually priced at −110 instead of +100. The vig is what you pay to play.",
  },
  {
    question: "How do you calculate no-vig odds?",
    answer:
      "Convert each side's American odds to implied probability, add them up, then divide each one by the total. That gives you fair probabilities that add to 100%. Convert back to American odds for the fair price.",
  },
  {
    question: "What is a fair price in betting?",
    answer:
      "A fair price is what the odds would be if the bookmaker took zero margin. It's the break-even line — any odds longer than fair carry positive expected value, any odds shorter carry negative EV.",
  },
  {
    question: "Multiplicative vs. additive devig — which is better?",
    answer:
      "Multiplicative is the simplest and works well for symmetric two-way markets. Shin and Power methods are more accurate when there's a heavy favorite, because vig isn't applied evenly. For most casual use, multiplicative is fine.",
  },
  {
    question: "How do sportsbooks set the vig?",
    answer:
      "Most US books default to roughly 4.5% on standard −110/−110 lines. Sharper limits (e.g., Pinnacle, Circa) operate closer to 2%. Reduced-juice promos drop it lower temporarily.",
  },
  {
    question: "Can you bet profitably with no-vig odds?",
    answer:
      "Yes — if you can find a real-market line that's longer than the no-vig fair price elsewhere. That difference is your edge. Sharp lines (Pinnacle, Circa, Bookmaker) are the usual fair-price reference.",
  },
  {
    question: "What is the Shin devig method?",
    answer:
      "Shin (1993) models the vig as protection against informed bettors and skews the devig toward the longshot. It's more accurate than multiplicative on lopsided markets but harder to compute by hand.",
  },
  {
    question: "How do I calculate the hold percentage?",
    answer:
      "Add the implied probabilities of every outcome. The amount over 100% is the hold. For a −110/−110 line: 0.524 + 0.524 = 1.048, so the hold is 4.8%.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} (Fair Odds, 2026)`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Betting", path: "/" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({
      name: TITLE,
      slug: SLUG,
      category: "betting",
      description: DESC,
    }),
    howToSchema({
      name: "How to devig a two-way market",
      steps: [
        { name: "Convert each price to implied probability", text: "American odds → implied probability. Negative odds: |odds| / (|odds| + 100). Positive: 100 / (odds + 100)." },
        { name: "Add the two implied probabilities", text: "The total will be slightly more than 100%. The excess is the bookmaker's margin." },
        { name: "Divide each side by the total", text: "This re-scales the two probabilities so they add to exactly 100%. Those are the fair probabilities." },
        { name: "Convert the fair probabilities back to American odds", text: "Use p ≥ 0.5 → −100p / (1 − p); p < 0.5 → 100(1 − p) / p. Round to the nearest integer." },
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <Hero
        title="No-Vig Calculator"
        tagline="Find the fair price hiding behind any two-way market — instantly, with the math shown."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="The Lakers are −150 home favorites over the Suns at +130. What's the fair price on each side?"
        steps={[
          { label: "Implied probability — Lakers (−150)", value: "60.00%" },
          { label: "Implied probability — Suns (+130)", value: "43.48%" },
          { label: "Sum of implied probabilities", value: "103.48%" },
          { label: "Vig (hold) = 103.48% − 100%", value: "3.48%" },
          { label: "Fair Lakers = 60.00 / 103.48", value: "57.98% (≈ −138)" },
          { label: "Fair Suns = 43.48 / 103.48", value: "42.02% (≈ +138)" },
        ]}
        result="Fair line is −138 / +138. The book's vig adds about 12 cents to the favorite price."
      />

      <FormulaExplained
        plainEnglish="A two-way bookmaker line sums to slightly more than 100% of implied probability. That extra is the vig. Multiplicative devig re-scales both sides proportionally to a clean 100%."
        formula={
          <span>
            p<sub>i</sub><sup>fair</sup> = p<sub>i</sub> / Σ p<sub>j</sub>
            <br />
            where p<sub>i</sub> is each side&apos;s implied probability and Σ p<sub>j</sub> is the bookmaker&apos;s total.
          </span>
        }
        citation={{
          label: "Pinnacle — Removing the margin from betting odds",
          href: "https://www.pinnacle.com/en/betting-articles/Betting-Strategy/removing-the-margin-from-betting-odds/UHE7TQNDHL3HMUSL",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're shopping a line and want to know if the sportsbook you're about to bet at is offering positive expected value vs. a sharper book.",
          "You want to grade your own bets against a fair-price benchmark instead of just W/L record.",
          "You're paper-trading a model and need a neutral price to evaluate edge.",
          "You're comparing two promotional boosts to see which one is actually +EV after the boost.",
          "You're writing about a market and want to attribute the implied probability honestly, with the vig stripped out.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Treating the bookmaker price as the true probability.", fix: "It includes the vig. Strip it before any EV calculation — that's exactly what this calculator does." },
          { mistake: "Using multiplicative devig on heavy favorites.", fix: "On lines like −400 / +320, multiplicative is biased. Switch to Shin or Power methods for sharper estimates." },
          { mistake: "Forgetting to devig before computing Kelly stakes.", fix: "Kelly uses fair probability. Plug in the bookmaker's implied probability and you'll consistently overbet." },
          { mistake: "Comparing across markets without converting to probability.", fix: "Odds in different formats (American, decimal, fractional) are deceptive at a glance. Always devig in probability space, then convert back." },
          { mistake: "Devigging just one side of a three-way (1X2) market.", fix: "Devig all legs at once — divide each by the sum of all three. The same multiplicative method generalises." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Implied probability", definition: "The probability of an outcome as priced by the bookmaker, derived from the offered odds." },
          { term: "Vig (juice, hold)", definition: "The bookmaker's built-in margin: how much the sum of implied probabilities exceeds 100%." },
          { term: "Fair odds", definition: "The price an outcome would carry if the bookmaker took zero margin. The benchmark for evaluating EV." },
          { term: "Expected value (EV)", definition: "Average profit or loss per unit staked over many identical bets. Positive EV means you expect to profit long-run." },
          { term: "Sharp line", definition: "A price from a low-margin, high-limit book (e.g., Pinnacle, Circa) widely treated as the market's fair-price reference." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "Pinnacle — Removing the margin from betting odds", href: "https://www.pinnacle.com/en/betting-articles/Betting-Strategy/removing-the-margin-from-betting-odds/UHE7TQNDHL3HMUSL" },
          { label: "Shin, H.S. (1993) — Measuring the Incidence of Insider Trading in a Market for State-Contingent Claims", href: "https://www.jstor.org/stable/2235260" },
          { label: "Miller & Davidow — Sharper: A guide to modern sports betting", href: "https://www.amazon.com/Sharper-Guide-Modern-Sports-Betting/dp/1545521611" },
        ]}
      />

      <Author />

      <LastReviewed date="2026-05-27" />

      <RelatedCalculators
        slugs={[
          "options-profit-calculator",
          "variance-calculator",
          "dividend-calculator",
        ]}
      />
    </Container>
  );
}
