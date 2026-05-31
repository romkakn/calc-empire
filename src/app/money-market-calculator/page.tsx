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

const SLUG = "money-market-calculator";
const TITLE = "Money Market Calculator";
const DESC =
  "Project the balance of a money-market account from a starting deposit, APY, monthly contribution, and time horizon. Daily compounding.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between a money-market account and a money-market fund?",
    answer:
      "A money-market account (MMA) is a deposit product at a bank or credit union — your principal is FDIC- or NCUA-insured up to the legal limit. A money-market fund (MMF) is a mutual fund holding short-term debt; it is not FDIC-insured and can break the buck in rare cases.",
  },
  {
    question: "Is my money-market account FDIC-insured?",
    answer:
      "MMAs at FDIC-member banks are insured up to $250,000 per depositor, per ownership category. Money-market funds at brokerages are covered by SIPC against broker failure, not investment loss, and only up to $500,000 ($250,000 cash sublimit).",
  },
  {
    question: "When should I pick an MMA over a high-yield savings account?",
    answer:
      "Pick an MMA if you want check-writing or debit access on the same account paying interest. Pick a high-yield savings account (HYSA) if you only need transfers and want the highest APY — HYSAs sometimes pay a touch more.",
  },
  {
    question: "What is the difference between APY and APR?",
    answer:
      "APY (annual percentage yield) includes the effect of compounding inside the year, so it is what you actually earn. APR (annual percentage rate) is the simple yearly rate before compounding and is mostly used for loans, not deposits.",
  },
  {
    question: "Does daily compounding really matter versus monthly?",
    answer:
      "On a 4.5% APY balance, daily versus monthly compounding changes the final number by only a few dollars per $10,000 per year. APY already bakes in the compounding frequency, so comparing APY to APY is the fair test.",
  },
  {
    question: "Are there still six-withdrawal-per-month limits on MMAs?",
    answer:
      "The federal Regulation D six-transfer cap was suspended in April 2020 and has not been reinstated. Many banks still impose their own limits, so check your account agreement before you plan frequent withdrawals.",
  },
  {
    question: "How liquid is a money-market account?",
    answer:
      "Most MMAs let you withdraw any business day by transfer, check, or debit. Watch for minimum-balance fees and per-item charges that can quietly cut into your interest.",
  },
  {
    question: "How is the interest taxed?",
    answer:
      "Interest from a money-market account is ordinary income on your federal return, reported on Form 1099-INT. State tax usually applies too unless the account is inside a tax-advantaged wrapper like an IRA.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — APY Growth With Monthly Contributions`,
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
      name: "How to project a money-market account balance",
      steps: [
        { name: "Enter your starting deposit", text: "Use the amount you have today, before any new contributions." },
        { name: "Set the APY", text: "Use the posted annual percentage yield from your bank — not the rate, not the APR." },
        { name: "Add a monthly contribution", text: "Pick a realistic recurring deposit; set it to 0 if you only want to grow the lump sum." },
        { name: "Choose a time horizon", text: "Read the projected balance, total contributions, and interest earned." },
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

      <Hero title={TITLE} tagline="See what your money-market balance becomes with daily compounding and a steady monthly contribution.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="You open a money-market account with $10,000, add $250 every month, and the APY stays at 4.5% for 5 years. What's the projected balance?"
        steps={[
          { label: "Daily rate: 0.045 / 365", value: "0.0001233" },
          { label: "Monthly growth factor: (1 + 0.045/365)^30", value: "1.003705" },
          { label: "Months: 5 × 12", value: "60" },
          { label: "Lump-sum growth: 10,000 × 1.003705^60", value: "$12,485" },
          { label: "Contributions growth: 250 × ((1.003705^60 − 1) / 0.003705)", value: "$16,740" },
          { label: "Projected balance", value: "≈ $29,225" },
          { label: "Total contributed: 10,000 + 250 × 60", value: "$25,000" },
          { label: "Interest earned", value: "≈ $4,225" },
        ]}
        result="A $10,000 opening deposit plus $250/month at 4.5% APY compounds to about $29,225 after 5 years. Roughly $4,225 of that is interest earned."
      />

      <FormulaExplained
        plainEnglish="A money-market account pays interest daily and credits it monthly at most banks. Each day the balance grows by a tiny fraction; once a month a fresh contribution lands and joins the compounding."
        formula={
          <span>
            Daily factor: d = 1 + APY / 365
            <br />
            Monthly factor: m = d<sup>30</sup>
            <br />
            Balance after n months: B<sub>0</sub> × m<sup>n</sup> + C × (m<sup>n</sup> − 1) / (m − 1)
            <br />
            B<sub>0</sub> = starting deposit, C = monthly contribution, n = months
          </span>
        }
        citation={{
          label: "FDIC — Money Market Deposit Accounts consumer guide",
          href: "https://www.fdic.gov/consumer-resource-center/2023-06/money-market-deposit-accounts",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're parking an emergency fund and want to see how interest grows over a few years.",
          "You're comparing an MMA APY to a high-yield savings APY before moving cash.",
          "You're saving for a down payment, tax bill, or tuition payment due in 1–5 years.",
          "You're modeling a sinking fund with steady monthly deposits.",
          "You want a quick sanity check before locking funds into a CD or T-bill ladder instead.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Plugging the APR into the APY field.", fix: "APY is the compounded figure your bank advertises. If you only have APR, the APY will be slightly higher and your projection will be too low." },
          { mistake: "Forgetting introductory or tiered rates expire.", fix: "Many MMAs advertise a promo APY for 3–6 months. Project the steady-state APY for anything past the promo window." },
          { mistake: "Ignoring monthly fees and minimum-balance penalties.", fix: "A $5 monthly fee cancels out ~$150 a year of interest on a $10k balance at 4.5%. Subtract fees before you compare products." },
          { mistake: "Treating an MMA like a checking account.", fix: "Frequent transfers can trigger bank-imposed limits or fee waivers being lost. Use a checking account for daily spend." },
          { mistake: "Skipping tax on the interest.", fix: "Interest is reported on 1099-INT and taxed as ordinary income. Hold inside an IRA if the goal is retirement." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "APY", definition: "Annual percentage yield — yearly return including the effect of compounding." },
          { term: "APR", definition: "Annual percentage rate — simple yearly rate before compounding is applied." },
          { term: "FDIC insurance", definition: "Federal deposit insurance, $250,000 per depositor per ownership category." },
          { term: "SIPC coverage", definition: "Protection against brokerage failure for fund accounts, not against investment loss." },
          { term: "Compounding frequency", definition: "How often earned interest is added back to the principal — daily, monthly, or annually." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "FDIC — Money Market Deposit Accounts consumer guide", href: "https://www.fdic.gov/consumer-resource-center/2023-06/money-market-deposit-accounts" },
          { label: "SEC Investor.gov — Money Market Funds", href: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-1" },
          { label: "Federal Reserve — H.6 Money Stock Measures", href: "https://www.federalreserve.gov/releases/h6/" },
          { label: "Consumer Financial Protection Bureau — What is the difference between APR and APY?", href: "https://www.consumerfinance.gov/ask-cfpb/what-is-the-difference-between-a-fixed-apr-and-a-variable-apr-en-45/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA for production review of tax treatment statements" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["dividend-calculator", "stock-profit-calculator", "capital-gains-tax-calculator"]} />
    </Container>
  );
}
