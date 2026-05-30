import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { Hero } from "@/components/eeat/Hero";
import { FormulaExplained } from "@/components/eeat/FormulaExplained";
import { CommonMistakes } from "@/components/eeat/CommonMistakes";
import { FAQ } from "@/components/eeat/FAQ";
import { References } from "@/components/eeat/References";
import { Author } from "@/components/eeat/Author";
import { LastReviewed } from "@/components/eeat/LastReviewed";
import { RelatedCalculators } from "@/components/eeat/RelatedCalculators";
import { Calculator } from "../Calculator";
import { PAYROLL_STATES, PAYROLL_STATE_SLUGS } from "../../../../data/payroll-states";
import {
  breadcrumbListSchema,
  faqPageSchema,
  howToSchema,
  jsonLd,
  personSchema,
  softwareApplicationSchema,
  type FaqItem,
} from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return PAYROLL_STATE_SLUGS.map((state) => ({ state }));
}

type Params = { state: string };

function lookup(state: string) {
  return PAYROLL_STATES[state.toLowerCase()] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state } = await params;
  const meta = lookup(state);
  if (!meta) return {};
  const title = `${meta.name} Paycheck Calculator — Take-Home Pay (2025)`;
  const desc = meta.noIncomeTax
    ? `Estimate your ${meta.name} take-home pay. No state income tax on wages — federal + FICA only. Shows where every dollar goes.`
    : `Estimate your ${meta.name} take-home pay with federal, FICA, and a ${meta.topRatePct}% state rate pre-filled. Edit any input — the math updates live.`;
  return {
    title,
    description: desc,
    alternates: { canonical: `/paycheck-calculator/${meta.slug}` },
    openGraph: { title, description: desc, url: `/paycheck-calculator/${meta.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title, description: desc },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { state } = await params;
  const meta = lookup(state);
  if (!meta) notFound();

  const SLUG = `paycheck-calculator/${meta.slug}`;
  const TITLE = `${meta.name} Paycheck Calculator`;
  const DESC = meta.noIncomeTax
    ? `Estimate ${meta.name} take-home pay. No state income tax on wages.`
    : `Estimate ${meta.name} take-home pay with the state's ${meta.topRatePct}% top marginal rate pre-filled.`;

  const FAQS: FaqItem[] = meta.noIncomeTax
    ? [
        {
          question: `Does ${meta.name} have a state income tax?`,
          answer: `No. ${meta.name} does not levy a personal income tax on wages, so your only income-tax withholding comes from federal sources.`,
        },
        {
          question: "What withholdings will I see on my paycheck?",
          answer:
            "Federal income tax (per IRS Pub 15-T), Social Security (6.2% up to the wage base), and Medicare (1.45% + 0.9% above the high-earner threshold). State income tax is $0.",
        },
        {
          question: `Are there any local taxes in ${meta.name}?`,
          answer:
            "Most localities in no-income-tax states do not levy a wage tax either, but a few cities and counties have payroll-type levies. Check your municipality.",
        },
        {
          question: `Is moving to ${meta.name} a net-pay win?`,
          answer:
            "Often yes — skipping a 5–10% state tax meaningfully raises take-home. Compare cost of living and any local taxes before deciding.",
        },
        {
          question: "What about FICA and the wage base?",
          answer:
            "FICA is federal: 6.2% Social Security up to $176,100 (2025 base) and 1.45% Medicare on every dollar. Above $200k single, an extra 0.9% Medicare kicks in.",
        },
        {
          question: "Does this calculator handle bonuses?",
          answer:
            "Use the gross-pay field to model a single check, including bonuses. Standard bonus withholding is a flat 22% federal — your real bracket is reconciled at year-end.",
        },
      ]
    : [
        {
          question: `What's the ${meta.name} income tax rate?`,
          answer: `${meta.note} Pre-filled rate is ${meta.topRatePct}%; override the field with your effective rate if you're below the top bracket.`,
        },
        {
          question: `How is ${meta.name} state tax calculated?`,
          answer:
            "This v0 uses a single flat-rate input applied to federal taxable wages (gross minus pre-tax deductions). Per-state bracket math is planned for v1.",
        },
        {
          question: "What deductions reduce my taxable wages?",
          answer:
            "Pre-tax contributions (401(k), HSA, traditional pre-tax health insurance) reduce federal taxable wages and, in most states, state taxable wages too.",
        },
        {
          question: `Are local taxes included for ${meta.name}?`,
          answer:
            "Not in this v0. NYC, Philadelphia, Maryland counties, Indiana counties, Ohio municipalities, and others levy local payroll taxes — add them manually or use the post-tax field.",
        },
        {
          question: "What's my effective tax rate?",
          answer:
            "Total taxes (federal + FICA + state) divided by gross pay. Pre-tax 401(k) and HSA don't lower the effective tax rate the same way as a credit would — but they do lower the dollar amount of federal tax owed.",
        },
        {
          question: "How accurate is this number?",
          answer:
            "Federal withholding uses the IRS Pub 15-T 2025 percentage-method tables and is exact for the inputs you provide. State is a flat-rate approximation against your federal taxable wages. Use the result as an estimate.",
        },
      ];

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Payroll", path: "/payroll" },
    { name: "Paycheck Calculator", path: "/paycheck-calculator" },
    { name: meta.name, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "payroll", description: DESC }),
    howToSchema({
      name: `How to estimate ${meta.name} take-home pay`,
      steps: [
        { name: "Enter gross pay and frequency", text: "Use the amount from a recent stub before deductions and pick your pay schedule." },
        { name: "Pick filing status", text: "Single, married filing jointly, or head of household — this sets the federal bracket." },
        { name: "Enter pre-tax deductions", text: "401(k), HSA, and pre-tax health premiums reduce the wages federal tax is calculated on." },
        { name: "Confirm state rate", text: meta.noIncomeTax ? `${meta.name} doesn't tax wages — state rate is 0%.` : `Pre-filled with ${meta.name}'s top marginal rate of ${meta.topRatePct}%. Override if your effective rate is lower.` },
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
        title={TITLE}
        tagline={
          meta.noIncomeTax
            ? `${meta.name} doesn't tax wages — only federal and FICA come out of your check. See the dollar figure in seconds.`
            : `${meta.name} take-home pay with federal, FICA, and the state's ${meta.topRatePct}% top marginal rate pre-filled. Override any field.`
        }
      >
        <Calculator defaultStatePct={meta.topRatePct} stateLabel={meta.name} />
      </Hero>

      <FormulaExplained
        plainEnglish={
          meta.noIncomeTax
            ? `${meta.name} take-home is gross minus pre-tax contributions, minus federal income tax (computed on the reduced wages), minus FICA (Social Security + Medicare), minus any post-tax deductions. State tax is $0.`
            : `${meta.name} take-home is gross minus pre-tax, minus federal income tax (computed on the reduced wages), minus FICA, minus ${meta.topRatePct}% state on federal taxable wages, minus any post-tax deductions.`
        }
        formula={
          <span>
            net = gross − pre-tax − federalWH(gross − pre-tax) − FICA(gross) − state(taxable)
            <br />
            state(taxable) = taxable × {meta.topRatePct}% (v0 flat-rate approximation)
          </span>
        }
        citation={{
          label: `${meta.name} Department of Revenue — Individual Income Tax`,
          href: meta.sourceUrl,
        }}
      />

      <CommonMistakes
        items={[
          { mistake: "Confusing top marginal with effective rate.", fix: `The pre-filled ${meta.topRatePct}% is ${meta.name}'s top marginal rate. Your effective rate is lower unless you're in the top bracket — override the field if so.` },
          { mistake: "Forgetting pre-tax reduces both federal and state.", fix: "A 401(k) contribution reduces both federal and state taxable wages in nearly every state." },
          { mistake: "Treating bonus withholding as your final tax.", fix: "Federal bonus withholding is a flat 22%; your actual rate is reconciled at year-end." },
          { mistake: "Missing local taxes.", fix: meta.noIncomeTax ? `Most ${meta.name} localities don't tax wages, but check your city/county.` : `Some ${meta.name} localities levy a wage tax. Add them via the post-tax field.` },
          { mistake: "Comparing offers by gross.", fix: "Always compare net (take-home). State and pre-tax structure can flip a 'higher' offer into a 'lower' offer." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: `${meta.name} Department of Revenue`, href: meta.sourceUrl },
          { label: "IRS Publication 15-T (2025) — Federal Income Tax Withholding Methods", href: "https://www.irs.gov/pub/irs-pdf/p15t.pdf" },
          { label: "Social Security Administration — 2025 wage base + COLA", href: "https://www.ssa.gov/news/press/factsheets/colafacts2025.pdf" },
          { label: "IRS — Topic 751: Social Security and Medicare Withholding Rates", href: "https://www.irs.gov/taxtopics/tc751" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: enrolled agent or CPA reviewer for production; refresh state rate against the linked DOR source each January" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators
        slugs={["mortgage-recast-calculator", "dividend-calculator", "options-profit-calculator"]}
      />
    </Container>
  );
}
