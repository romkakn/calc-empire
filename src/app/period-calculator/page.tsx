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

const SLUG = "period-calculator";
const TITLE = "Period Calculator";
const DESC =
  "Estimate your next period start, ovulation window, and fertile days from your last period and average cycle length.";

const FAQS: FaqItem[] = [
  {
    question: "Why does my cycle length change from month to month?",
    answer:
      "A cycle counted from day 1 of one period to day 1 of the next typically ranges from 21 to 35 days. Stress, travel, sleep changes, illness, weight shifts, and age all nudge that number. Variation of a few days from cycle to cycle is normal.",
  },
  {
    question: "How accurate is the ovulation date this calculator shows?",
    answer:
      "Calendar math assumes a fixed 14-day luteal phase, which is the population average. Your own luteal phase may be a day or two shorter or longer, so treat the ovulation date as a 3-day window, not a single day. Basal body temperature or an ovulation predictor kit gives a sharper read.",
  },
  {
    question: "What is the basal body temperature method?",
    answer:
      "You take your temperature first thing every morning, before getting out of bed. After ovulation, progesterone raises your resting temperature by about 0.5 F (0.3 C) and keeps it there until your next period. The shift confirms ovulation already happened — it does not predict the next one.",
  },
  {
    question: "I have PCOS or take hormonal birth control. Does this work for me?",
    answer:
      "Probably not well. PCOS often causes long or skipped cycles, so calendar predictions miss. Hormonal contraception suppresses ovulation entirely, so a fertile window does not apply. Talk to a clinician about tracking options that fit your situation.",
  },
  {
    question: "Are period-tracking apps private?",
    answer:
      "It depends on the app. Some sell or share cycle data with advertisers and data brokers; some store data only on your device. Check the privacy policy and look for apps that use on-device encryption and do not require an account. This calculator stores nothing — your inputs stay in your browser tab.",
  },
  {
    question: "What is the difference between a late period and a missed period?",
    answer:
      "A period is late once it is a day or two past your usual start date. It is generally called missed at about 7 days past the expected start. A late or missed period is a common early sign of pregnancy, but stress, illness, and cycle variability also cause it.",
  },
  {
    question: "When should I take a pregnancy test?",
    answer:
      "Home urine tests are most reliable from the first day of a missed period. Testing earlier can give a false negative because hCG levels are still rising. A blood test at a clinic can detect pregnancy about a week after ovulation.",
  },
  {
    question: "When should I see a clinician about my cycle?",
    answer:
      "See a clinician if cycles are consistently shorter than 21 days or longer than 35, if bleeding is very heavy or lasts more than 7 days, if you have severe pain, or if you have missed 3 cycles in a row without a known cause. Trouble conceiving after 12 months of trying (6 months if over 35) is also a reason to seek care.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Next Period, Ovulation & Fertile Window`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "health", description: DESC }),
    howToSchema({
      name: "How to estimate your next period and fertile window",
      steps: [
        { name: "Mark day 1 of your last period", text: "Day 1 is the first day of real bleeding — spotting the day before does not count." },
        { name: "Enter your average cycle length", text: "Count from day 1 of one period to day 1 of the next. Typical range is 21 to 35 days; default is 28." },
        { name: "Add cycle length to last period date", text: "That gives the predicted start of your next period." },
        { name: "Subtract 14 days for ovulation", text: "Ovulation is roughly 14 days before the next period. The fertile window is the 5 days before through 1 day after." },
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
        tagline="Predict your next period, ovulation day, and 6-day fertile window from one date and your average cycle length."
      >
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Your last period started May 17, 2026. Your average cycle is 28 days. When is your next period, and when are you most likely to ovulate?"
        steps={[
          { label: "Last period start", value: "2026-05-17" },
          { label: "Add cycle length (28 days)", value: "2026-06-14" },
          { label: "Subtract 14 days for ovulation", value: "2026-05-31" },
          { label: "Fertile window start (ovulation − 5)", value: "2026-05-26" },
          { label: "Fertile window end (ovulation + 1)", value: "2026-06-01" },
        ]}
        result="Next period around Sun, Jun 14, 2026. Ovulation around Sun, May 31, 2026. Fertile window: May 26 through Jun 1, 2026."
      />

      <FormulaExplained
        plainEnglish="A menstrual cycle is counted from the first day of one period to the first day of the next. Ovulation usually happens about 14 days before the next period — not 14 days after the last one. Sperm can survive up to 5 days, and an egg lives about a day, so the fertile window covers the 5 days before ovulation plus 1 day after."
        formula={
          <span>
            next period start = last period start + cycle length
            <br />
            ovulation day = next period start − 14 days
            <br />
            fertile window = [ovulation − 5 days, ovulation + 1 day]
          </span>
        }
        citation={{
          label: "ACOG — Your First Period and Menstrual Cycle FAQ",
          href: "https://www.acog.org/womens-health/faqs/your-first-period",
        }}
      />

      <WhenToUse
        scenarios={[
          "You want a quick estimate of when your next period will start so you can plan travel, events, or a doctor visit.",
          "You are trying to conceive and want to know which days this month are most likely to lead to pregnancy.",
          "You are tracking cycle changes and want a baseline against your apps or paper journal.",
          "You are teaching a teen about how menstrual cycles work and want a worked example.",
          "You are reviewing whether a period is late and want to compare today against the predicted start.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Counting ovulation as day 14 from the start of your last period.", fix: "Ovulation is 14 days before the next period — not 14 days after the last one. The two only match in a textbook 28-day cycle." },
          { mistake: "Treating the fertile window as a contraception tool.", fix: "Calendar predictions are not reliable birth control. Failure rates are high even with careful tracking. Use a method designed for contraception." },
          { mistake: "Using one cycle to predict the next.", fix: "Average several recent cycles. A single short or long cycle skews the math, especially after illness, travel, or stress." },
          { mistake: "Ignoring spotting versus a real period.", fix: "Day 1 is the first day of regular flow. Light brown spotting the day before does not count as day 1." },
          { mistake: "Assuming the math applies on hormonal birth control.", fix: "Combined and most progestin contraceptives suppress ovulation. The fertile-window logic does not apply while you are on them." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Cycle length", definition: "Days from day 1 of one period to day 1 of the next. Normal range 21–35 days for most adults." },
          { term: "Follicular phase", definition: "First half of the cycle, from period start to ovulation. Length varies most between people." },
          { term: "Luteal phase", definition: "From ovulation to the next period. Usually 12–14 days; relatively stable within an individual." },
          { term: "Ovulation", definition: "Release of an egg from the ovary. Window for fertilization is about 24 hours." },
          { term: "Fertile window", definition: "The 6-day span ending on ovulation day during which intercourse can lead to pregnancy." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "American College of Obstetricians and Gynecologists — Your First Period FAQ", href: "https://www.acog.org/womens-health/faqs/your-first-period" },
          { label: "Office on Women's Health (HHS) — Your Menstrual Cycle", href: "https://www.womenshealth.gov/menstrual-cycle/your-menstrual-cycle" },
          { label: "CDC — Reproductive Health: Women's Reproductive Health", href: "https://www.cdc.gov/reproductive-health/about/index.html" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician (OB-GYN or MD) for production" />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["chronological-age-calculator", "a1c-calculator", "height-calculator"]} />
    </Container>
  );
}
