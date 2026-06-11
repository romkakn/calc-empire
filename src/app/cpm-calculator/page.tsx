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

const SLUG = "cpm-calculator";
const TITLE = "CPM Calculator";
const DESC =
  "Cost per mille (1,000 impressions) for ad spend. Reverse-solve impressions or budget from any two known values.";

const FAQS: FaqItem[] = [
  {
    question: "What does CPM mean?",
    answer:
      "CPM stands for cost per mille — Latin for cost per thousand. It is the price you pay for 1,000 ad impressions, regardless of clicks or conversions.",
  },
  {
    question: "What is the difference between CPM, CPC, and CPA?",
    answer:
      "CPM charges for impressions (views), CPC charges per click, and CPA charges per acquisition (a signup, sale, or other goal). Awareness campaigns usually buy CPM; performance campaigns usually buy CPC or CPA so you only pay for outcomes.",
  },
  {
    question: "What is the difference between served and viewable impressions?",
    answer:
      "A served impression counts whenever the ad is sent to the page; a viewable impression only counts when at least 50% of the pixels are on-screen for one second (two seconds for video). The IAB MRC sets the viewable standard, and most major platforms report both numbers.",
  },
  {
    question: "What is a typical CPM on Meta, Google, and LinkedIn?",
    answer:
      "CPMs move with auction demand and audience, so use this as a rough order of magnitude. Meta and Google Display typically land in the low-to-mid single digits per 1,000 impressions, YouTube and Google Search RPMs run higher, and LinkedIn often clears 20 dollars or more because of the professional targeting.",
  },
  {
    question: "Why does CPM matter for awareness campaigns?",
    answer:
      "When the goal is reach and brand lift, you are buying eyeballs rather than clicks. CPM lets you compare the cost of reaching 1,000 people across publishers, formats, and audience segments on equal terms.",
  },
  {
    question: "How does a frequency cap change my effective CPM?",
    answer:
      "A frequency cap limits how many times one user can see the ad. Tighter caps raise effective CPM because the platform has to find new people instead of re-serving the cheapest available impression, but they protect reach and reduce ad fatigue.",
  },
  {
    question: "Does CPM include taxes and platform fees?",
    answer:
      "It depends on the report. Native dashboards usually show CPM before VAT and agency fees, while media plans built by buyers often show a loaded CPM that includes data, ad-serving, and agency margin. Always confirm which number you are quoting.",
  },
  {
    question: "How do I budget a campaign from a target CPM?",
    answer:
      "Pick the audience size you want to reach, decide how many impressions per person you need, and multiply by the target CPM divided by 1,000. This calculator does the math when you switch to Solve for cost.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Cost Per 1,000 Impressions`,
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
      name: "How to calculate CPM for ad spend",
      steps: [
        { name: "Pick what you are solving for", text: "CPM when you know spend and impressions, impressions when you know spend and CPM, cost when you know CPM and impressions." },
        { name: "Enter the two known values", text: "Use the platform report or media plan for the inputs — keep served vs viewable consistent across both numbers." },
        { name: "Apply the CPM formula", text: "CPM = cost ÷ impressions × 1,000. The reverse forms come from the same equation." },
        { name: "Compare to a benchmark", text: "Check the result against platform and audience benchmarks to flag a buy that is unusually cheap or expensive." },
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

      <Hero title={TITLE} tagline="Calculate cost per 1,000 impressions, or reverse-solve impressions or budget when you know the other two.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A brand-awareness flight spent $500 and delivered 250,000 impressions. What was the CPM?"
        steps={[
          { label: "Formula: CPM = cost ÷ impressions × 1,000", value: "" },
          { label: "Plug in: 500 ÷ 250,000", value: "0.002" },
          { label: "Multiply by 1,000", value: "2.00" },
          { label: "CPM", value: "$2.00" },
        ]}
        result="A $500 spend on 250,000 impressions works out to a $2.00 CPM — competitive for broad social display, expensive for LinkedIn, cheap for premium video."
      />

      <FormulaExplained
        plainEnglish="CPM is the price of 1,000 ad impressions. Divide spend by impressions to get the cost of one impression, then multiply by 1,000 to scale it to the per-mille unit that media plans use."
        formula={
          <span>
            CPM = cost ÷ impressions × 1,000
            <br />
            impressions = cost ÷ CPM × 1,000
            <br />
            cost = CPM × impressions ÷ 1,000
          </span>
        }
        citation={{
          label: "IAB MRC — Viewable Ad Impression Measurement Guidelines",
          href: "https://www.iab.com/guidelines/iab-measurement-guidelines/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are pricing an awareness campaign and need to compare publisher rate cards on equal terms.",
          "You are reconciling a media-plan estimate against a delivered platform report.",
          "You are sizing a flight from a target audience and want to back-solve the budget.",
          "You are auditing an agency invoice and need to confirm the loaded CPM matches the media plan.",
          "You are pitching a sponsorship and need to translate a flat fee into a CPM that buyers recognize.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting the × 1,000 step.", fix: "Cost ÷ impressions gives the cost of a single impression. Multiply by 1,000 to get the per-mille figure." },
          { mistake: "Mixing served and viewable impressions.", fix: "Pick one definition and use it for both inputs. A served CPM and a viewable CPM are not the same buy." },
          { mistake: "Comparing CPMs across formats without context.", fix: "Video, display, native, and connected-TV CPMs live in different ranges. Compare like-for-like before judging a rate." },
          { mistake: "Treating a low CPM as automatically good.", fix: "Cheap impressions on the wrong audience waste budget. Pair CPM with reach, frequency, viewability, and on-target percentage." },
          { mistake: "Ignoring platform fees and data costs.", fix: "Loaded CPM includes data, ad serving, and agency margin. Always confirm which CPM you are quoting." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Impression", definition: "One delivery of an ad to a user. Served when sent; viewable when seen per IAB MRC criteria." },
          { term: "Reach", definition: "Unique users exposed to a campaign at least once over a defined window." },
          { term: "Frequency", definition: "Average number of times each unique user saw the ad — impressions divided by reach." },
          { term: "Viewability", definition: "Share of served impressions that met the IAB MRC viewable threshold." },
          { term: "vCPM", definition: "Cost per 1,000 viewable impressions. Usually higher than served CPM on the same buy." },
          { term: "CPC", definition: "Cost per click. Charges only when the user clicks the ad." },
          { term: "CPA", definition: "Cost per acquisition. Charges only when a defined conversion fires." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "IAB MRC — Viewable Ad Impression Measurement Guidelines", href: "https://www.iab.com/guidelines/iab-measurement-guidelines/" },
          { label: "Google Ads Help — How cost-per-thousand-impressions (CPM) bidding works", href: "https://support.google.com/google-ads/answer/2472735" },
          { label: "Meta Business Help — About cost per 1,000 impressions (CPM)", href: "https://www.facebook.com/business/help/675615482516035" },
          { label: "LinkedIn Marketing Solutions — Ad pricing and bidding overview", href: "https://business.linkedin.com/marketing-solutions/cx/17/06/ads-guide" },
          { label: "SimilarWeb — Digital advertising guides", href: "https://www.similarweb.com/corp/blog/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["gross-margin-calculator", "discount-calculator", "percent-off-calculator"]} />
    </Container>
  );
}
