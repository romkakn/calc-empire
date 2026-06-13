import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { Author } from "@/components/eeat/Author";
import { LastReviewed } from "@/components/eeat/LastReviewed";
import { FAQ } from "@/components/eeat/FAQ";
import { References } from "@/components/eeat/References";
import { CommonMistakes } from "@/components/eeat/CommonMistakes";
import { RelatedCalculators } from "@/components/eeat/RelatedCalculators";
import {
  articleSchema,
  breadcrumbListSchema,
  faqPageSchema,
  jsonLd,
  personSchema,
  type FaqItem,
} from "@/lib/schema";
import { getPostBySlug } from "@/lib/blog";

const POST = getPostBySlug("how-to-calculate-tip-without-calculator")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the easiest way to calculate a 20% tip in your head?",
    answer:
      "Move the decimal one place to the left to get 10% of the bill, then double it. On a $47.83 check that's $4.78 doubled to $9.57. Round to $10 and you're done in about three seconds.",
  },
  {
    question: "How do I calculate an 18% tip without a calculator?",
    answer:
      "Find 10% (move the decimal), find 20% (double the 10%), then take the average. So 10% of $112 is $11.20, 20% is $22.40, and 18% sits at $21.30. Or just take 20% and shave off a tenth.",
  },
  {
    question: "What is the standard tip percentage in 2026?",
    answer:
      "In the US, 18% to 20% is the current standard for sit-down restaurants, per Pew Research and the National Restaurant Association. Counter service and takeout sit closer to 10% or a flat couple of dollars, though the prompt screens on tablets often suggest 15-25%.",
  },
  {
    question: "Should I tip on pre-tax or post-tax totals?",
    answer:
      "Etiquette guides like Emily Post recommend tipping on the pre-tax subtotal, since the tax isn't service. In practice most diners just tip on the bottom-line total because it's faster and the difference is a few cents to a few dollars.",
  },
  {
    question: "How much do servers actually make per hour?",
    answer:
      "Federal tipped minimum wage is $2.13 per hour and hasn't changed since 1991, per the US Department of Labor. Tipped servers must legally make at least the regular federal minimum of $7.25 once tips are counted, but in 43 states the base tipped wage is still below $7.25.",
  },
  {
    question: "How do I split a tip between multiple people?",
    answer:
      "Calculate the tip on the full bill first, then divide the new total by the headcount. Splitting first and tipping per person is mathematically the same but invites rounding errors that leave the server short. The all-in total divided by the table works better.",
  },
  {
    question: "Do I tip on alcohol the same as food?",
    answer:
      "Yes, tip on the full subtotal including drinks. The server poured the wine, opened the bottle, and carried the round. Some old-school guides suggest 15% on the bottle and 20% on food, but tipping the same percentage on the whole check is the modern standard.",
  },
  {
    question: "Is rounding up the same as tipping?",
    answer:
      "No. Rounding a $47 check to $50 is a 6% tip, well below standard for sit-down service. Rounding works at a coffee counter, not at a restaurant where servers depend on percentage-based gratuity for the bulk of their income.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: `/${SLUG_PATH}` },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: `/${SLUG_PATH}`,
    type: "article",
    publishedTime: POST.datePublished,
    modifiedTime: POST.dateModified,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: TITLE, path: `/${SLUG_PATH}` },
  ];

  const schemas = [
    articleSchema({
      headline: TITLE,
      slug: SLUG_PATH,
      datePublished: POST.datePublished,
      dateModified: POST.dateModified,
      citations: [
        "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped",
        "https://www.pewresearch.org/short-reads/2023/11/09/tipping-culture-in-america-public-sees-a-changed-landscape/",
        "https://emilypost.institute/tipping",
        "https://restaurant.org/research-and-media/research/industry-statistics/",
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

      <header className="mt-2">
        <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
          Finance · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          Move the decimal, double it, split the bill. All in 5 seconds without
          pulling out your phone. Three mental-math tricks that work for any
          check &mdash; 15%, 18%, 20% &mdash; demonstrated on $47.83, $112.00,
          and $216.50 the way servers actually do it in their heads at the end
          of a shift.
        </p>
      </header>

      <CTACard
        slug="tip-calculator"
        label="Want the shortcut"
        title="Use our Tip Calculator"
        body="If you'd rather just type in the bill and get the answer, the calculator splits between any number of people, lets you toggle pre-tax or post-tax, and handles the rounding. The post below is for everyone who wants to stop reaching for their phone every time a check lands."
      />

      <Section id="why-mental-math" title="Why this still matters in 2026">
        <p>
          Card readers do the math for you. Tablets at the counter suggest 18,
          22, 25%, with an angry-looking &quot;no tip&quot; button hidden in the
          corner. Splitwise will divide a $216.50 dinner four ways before you
          finish your espresso. So why bother memorizing this?
        </p>
        <p>
          Because the prompts are designed to anchor you high. A 2023 Pew
          Research survey found that 72% of Americans say tipping is expected in
          more places than it was five years ago, and the suggested percentages
          on screens have crept up from a 15-18-20 spread to 18-22-25. If you
          can&apos;t do the math in your head, you can&apos;t check the
          screen&apos;s suggestion against what the service actually warranted.
        </p>
        <p>
          The other reason is dignity. Standing at the table fumbling with a
          phone while three friends watch is a small thing, but a thing. The
          three tricks below take a weekend to internalize and a lifetime to
          use.
        </p>
      </Section>

      <Section id="trick-one-decimal" title="Trick 1: Move the decimal (10%)">
        <p>
          This is the foundation. Every other trick stacks on it. To find 10% of
          any number, slide the decimal point one place to the left. That&apos;s
          it. No multiplication, no long division.
        </p>
        <Formula>
          10% of bill = bill ÷ 10 = bill with decimal moved 1 left
        </Formula>
        <p>
          Three examples, all the same move:
        </p>
        <WorkedSteps
          steps={[
            { label: "10% of $47.83", value: "$4.78" },
            { label: "10% of $112.00", value: "$11.20" },
            { label: "10% of $216.50", value: "$21.65" },
          ]}
        />
        <p>
          That&apos;s your launch pad. 10% by itself is a stingy tip in the US,
          but every common percentage is a quick combination away. Memorize the
          decimal move and the next two tricks become arithmetic you can do
          while listening to someone&apos;s story about their flight.
        </p>
      </Section>

      <Section id="trick-two-double" title="Trick 2: Double it (20%)">
        <p>
          20% is the standard tip for full-service restaurants in 2026, and
          it&apos;s the easiest non-trivial percentage to compute. Find 10% with
          the decimal move, then double it.
        </p>
        <Formula>
          20% of bill = (bill ÷ 10) × 2
        </Formula>
        <p>
          The doubling step is the only real arithmetic. Pair the dollars with
          the dollars and the cents with the cents, then add. On $47.83:
        </p>
        <WorkedSteps
          steps={[
            { label: "Bill", value: "$47.83" },
            { label: "10% (decimal move)", value: "$4.78" },
            { label: "Double the dollars", value: "$4 × 2 = $8" },
            { label: "Double the cents", value: "78¢ × 2 = $1.56" },
            { label: "Add them", value: "$8 + $1.56 = $9.56" },
            { label: "Round up", value: "$10 tip, $57.83 total" },
          ]}
        />
        <p>
          Five seconds, maybe seven if the bill ends in awkward cents. The
          rounding step at the end matters more than getting the cents exact.
          Servers don&apos;t care about your $9.56 vs $9.60 &mdash; they care
          that the tip cleared 20% and the math wasn&apos;t a fight.
        </p>

        <h3 className="md-title-large mt-8">Two more, faster</h3>
        <WorkedSteps
          steps={[
            { label: "20% of $112.00", value: "$11.20 → $22.40" },
            { label: "20% of $216.50", value: "$21.65 → $43.30" },
            { label: "Round-friendly tip on $112", value: "$22 or $25" },
            { label: "Round-friendly tip on $216.50", value: "$43 or $45" },
          ]}
        />
        <p>
          A $216.50 dinner with $43.30 in tip lands you at $259.80. Round to
          $260 if you want even-money on the credit card slip, or punch in
          exactly $43.30 if you&apos;re tipping cash and you&apos;ve got the
          coins. Either way you computed a 20% tip on a three-figure check in
          less time than it takes to unlock your phone.
        </p>
      </Section>

      <Section id="trick-three-split" title="Trick 3: Split and add (15%, 18%, 25%)">
        <p>
          What if you want a percentage that isn&apos;t a clean multiple of 10?
          15%, 18%, and 25% are the three you&apos;ll hit most. The trick: break
          each one into pieces you already know how to compute, then add.
        </p>

        <h3 className="md-title-large mt-6">15% = 10% + half of 10%</h3>
        <p>
          The classic. Get 10% with the decimal move, then take half of it for
          the 5%, then add the two.
        </p>
        <WorkedSteps
          steps={[
            { label: "Bill", value: "$47.83" },
            { label: "10%", value: "$4.78" },
            { label: "Half of 10% (= 5%)", value: "$2.39" },
            { label: "Add: 10% + 5%", value: "$4.78 + $2.39 = $7.17" },
            { label: "15% tip", value: "$7.17 → round to $7.20 or $8" },
          ]}
        />
        <p>
          15% used to be standard. It&apos;s now considered low for sit-down
          service but appropriate for counter service, delivery, or anywhere
          the labor is lighter. Use it without guilt at a coffee shop. Save the
          18-20% for tables where someone walked over four times.
        </p>

        <h3 className="md-title-large mt-8">18% = 20% &minus; a tenth of 20%</h3>
        <p>
          The screens often default to 18%. To match it, compute 20% (double the
          10%), then knock off a tenth.
        </p>
        <WorkedSteps
          steps={[
            { label: "Bill", value: "$112.00" },
            { label: "10%", value: "$11.20" },
            { label: "20% (double)", value: "$22.40" },
            { label: "Tenth of 20%", value: "$2.24" },
            { label: "Subtract: 20% − 10% of 20%", value: "$22.40 − $2.24 = $20.16" },
            { label: "18% tip", value: "$20.16 → round to $20 or $21" },
          ]}
        />
        <p>
          18% sits at a useful psychological line. It signals you noticed the
          service and decided not to round up to the full 20. Use it when the
          food was good but the table got missed during a busy stretch. Avoid
          punishing the server for the kitchen&apos;s mistakes &mdash;
          that&apos;s what asking for the manager is for.
        </p>

        <h3 className="md-title-large mt-8">25% = 20% + a quarter of 20%</h3>
        <p>
          Above-and-beyond service, large parties, regular spots where you
          plan to come back. Get 20%, then add a quarter of it. Or just take a
          quarter of the bill directly: $216.50 ÷ 4 ≈ $54.
        </p>
        <WorkedSteps
          steps={[
            { label: "Bill", value: "$216.50" },
            { label: "Quarter of bill (= 25%)", value: "$216.50 ÷ 4 ≈ $54.13" },
            { label: "Round up", value: "$55 tip" },
            { label: "Total to leave", value: "$271.50 or $272" },
          ]}
        />
        <p>
          Dividing by 4 is the fast lane for 25%. Half, then half again. On
          $112 that&apos;s $56 → $28 → $14 (which is half, then a quarter, then
          an eighth, so back up one step). The doubling-and-halving rhythm is
          the same skill you use when you&apos;re running a{" "}
          <Link
            href="/percent-off-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            percent-off calculation
          </Link>{" "}
          at a sale rack &mdash; mental math is mental math.
        </p>
      </Section>

      <Section id="three-bills" title="Three real bills, three tricks">
        <p>
          Same three checks you saw above, now with each trick applied
          side-by-side. Pick the percentage that matches the service. Round to
          the nearest dollar at the end &mdash; nobody&apos;s grading you on
          the cents.
        </p>

        <h3 className="md-title-large mt-6">$47.83 (small lunch)</h3>
        <WorkedSteps
          steps={[
            { label: "10%", value: "$4.78" },
            { label: "15% (10% + 5%)", value: "$7.17 → $7" },
            { label: "18% (20% − tenth)", value: "$8.61 → $9" },
            { label: "20% (double)", value: "$9.57 → $10" },
            { label: "25% (quarter)", value: "$11.96 → $12" },
          ]}
        />

        <h3 className="md-title-large mt-8">$112.00 (dinner for two)</h3>
        <WorkedSteps
          steps={[
            { label: "10%", value: "$11.20" },
            { label: "15%", value: "$16.80 → $17" },
            { label: "18%", value: "$20.16 → $20" },
            { label: "20%", value: "$22.40 → $22" },
            { label: "25%", value: "$28.00" },
          ]}
        />

        <h3 className="md-title-large mt-8">$216.50 (group dinner)</h3>
        <WorkedSteps
          steps={[
            { label: "10%", value: "$21.65" },
            { label: "15%", value: "$32.48 → $33" },
            { label: "18%", value: "$38.97 → $39" },
            { label: "20%", value: "$43.30 → $43" },
            { label: "25%", value: "$54.13 → $55" },
          ]}
        />
        <p>
          Three checks, fifteen tip calculations, zero phones. The pattern
          repeats across every meal you&apos;ll eat for the rest of your life.
          Cost of the skill: maybe twenty minutes of practice over a few
          dinners. Payoff: not standing there squinting at suggested-tip
          screens that may or may not be computing on the pre-tax total.
        </p>
      </Section>

      <Section id="the-social-stuff" title="Tipping isn&apos;t really about math">
        <p>
          Here is the uncomfortable part: in the US, tip percentages aren&apos;t
          arbitrary. They&apos;re the difference between a server&apos;s
          take-home and minimum wage. The federal tipped minimum wage has been
          frozen at $2.13 per hour since 1991, per the US Department of Labor.
          Forty-three states still allow that subminimum, with the assumption
          that tips will close the gap.
        </p>
        <p>
          That&apos;s why 20% became standard and why the suggested defaults on
          screens keep creeping up. It&apos;s also why &quot;rounding up&quot;
          on a $50 check feels wrong: $3 is a 6% tip, well below what the
          server&apos;s pay structure assumes. Rounding works at a coffee
          counter where the barista makes the full minimum wage. It doesn&apos;t
          work at a sit-down restaurant where the host stand is doing math
          based on 18-20% of food sales.
        </p>
        <p>
          You can have opinions about whether this is a sane way to run a labor
          market. (The restaurant industry, in coordination with the National
          Restaurant Association, has lobbied to keep tipped minimums frozen
          since the 80s.) But the system you&apos;re tipping into right now
          assumes percentage-based gratuity, not generosity in the abstract.
          Knowing the math lets you tip at the level the service warranted,
          neither shamed into a higher default nor shorting the person who
          actually carried your food.
        </p>
      </Section>

      <Section id="splits-and-groups" title="Splitting checks and tipping on groups">
        <p>
          Split-the-bill scenarios are where mental math earns its keep.
          Servers see this every shift and they have opinions about how it
          goes wrong.
        </p>
        <p>
          The right sequence: tip on the full bill first, then divide. Tipping
          per-person, then summing, invites rounding errors. Four people each
          tipping $5 on what should have been a $22 tip leaves the server
          $2 short. Tip the table, then split the table.
        </p>
        <WorkedSteps
          steps={[
            { label: "Bill (group of 4)", value: "$216.50" },
            { label: "20% tip", value: "$43.30" },
            { label: "Total with tip", value: "$259.80" },
            { label: "Divide by 4", value: "$259.80 ÷ 4 = $64.95" },
            { label: "Each person owes", value: "$65" },
          ]}
        />
        <p>
          Many restaurants add an automatic gratuity (usually 18%) for parties
          of six or more. Look at the bottom of the receipt before you tip
          again on top of it &mdash; double-tipping is one of the most common
          group-dinner mistakes, and it&apos;s baked into the bill so quietly
          that even the server won&apos;t flag it. If gratuity&apos;s already
          there and the service was great, add a few dollars cash on top
          rather than re-running the percentage.
        </p>
        <p>
          When the bill includes a{" "}
          <Link
            href="/discount-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            discount or a coupon
          </Link>
          , etiquette guides like Emily Post recommend tipping on the original
          pre-discount amount, since the server&apos;s work didn&apos;t go on
          sale. Most diners don&apos;t bother, but if the discount is big
          (50% off, two-for-one) the difference is large enough to matter.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Tipping on the post-tax total without thinking about it.",
            fix: "Etiquette is to tip on the pre-tax subtotal. In high-tax states (New York at 8.875%, California up to 10.25%), tipping on the post-tax line adds 1-2% extra. Not the end of the world, but worth knowing you&apos;re doing it.",
          },
          {
            mistake: "Trusting the suggested-tip screen on the tablet.",
            fix: "Square and Toast prompts sometimes compute on the pre-tax subtotal and sometimes on the post-tax total &mdash; you can&apos;t tell which without doing the math. Do the 10% decimal move yourself and check that the screen&apos;s &quot;20%&quot; matches.",
          },
          {
            mistake: "Rounding down on the tip to clean up the total.",
            fix: "If a $9.57 tip on $47.83 brings you to $57.40, you might round down to $57. That&apos;s a 7.9% tip. Round the tip up, not the total down. $10 tip → $57.83 → round the total to $58 if you want.",
          },
          {
            mistake: "Tipping the wrong amount on automatic gratuity bills.",
            fix: "Large parties often get 18% gratuity added automatically. Diners tip again on top, computing 20% on a number that already includes 18%. Read the bill. If it says &quot;gratuity included,&quot; only tip extra if service was exceptional.",
          },
          {
            mistake: "Treating buffet and counter service like sit-down.",
            fix: "10% at a buffet, $1-2 at a coffee counter, 18-20% only when someone took your order at a table and brought food repeatedly. The tablet doesn&apos;t know what kind of service you got. You do.",
          },
          {
            mistake: "Forgetting the bar tab on a split check.",
            fix: "Group dinners often split the food evenly and then re-litigate the cocktails. The server poured all of them. Tip on the full bill including drinks, and split the tip the same way you split the food &mdash; otherwise drinkers underpay the gratuity by 3-4%.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "US Department of Labor: Tipped Minimum Wages by State",
            href: "https://www.dol.gov/agencies/whd/state/minimum-wage/tipped",
          },
          {
            label:
              "Pew Research: Tipping Culture in America (2023)",
            href: "https://www.pewresearch.org/short-reads/2023/11/09/tipping-culture-in-america-public-sees-a-changed-landscape/",
          },
          {
            label: "Emily Post Institute: General Tipping Guide",
            href: "https://emilypost.institute/tipping",
          },
          {
            label: "National Restaurant Association: Industry Statistics",
            href: "https://restaurant.org/research-and-media/research/industry-statistics/",
          },
          {
            label: "US Department of Labor Fact Sheet #15: Tipped Employees Under the FLSA",
            href: "https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa",
          },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={POST.relatedCalcs} />
    </Container>
  );
}

/* ----- small inline helpers, scoped to the post ----- */

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-10 scroll-mt-24">
      <h2 className="md-headline-small text-[var(--md-sys-color-on-surface)]">
        {title}
      </h2>
      <div className="mt-3 md-body-large max-w-prose text-[var(--md-sys-color-on-surface)] space-y-3">
        {children}
      </div>
    </section>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <Card
      variant="outlined"
      className="my-4 px-4 py-3 font-[var(--md-sys-typescale-mono-font)] md-body-medium"
    >
      {children}
    </Card>
  );
}

function WorkedSteps({ steps }: { steps: { label: string; value: string }[] }) {
  return (
    <ol className="mt-4 space-y-2 list-none">
      {steps.map((s, i) => (
        <li
          key={i}
          className="rounded-[var(--md-sys-shape-corner-sm)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] px-4 py-2 flex justify-between gap-4 md-body-medium"
        >
          <span>{s.label}</span>
          <span className="font-[var(--md-sys-typescale-mono-font)] tabular-nums">
            {s.value}
          </span>
        </li>
      ))}
    </ol>
  );
}

function CTACard({
  slug,
  label,
  title,
  body,
}: {
  slug: string;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <Card variant="filled" className="mt-6 p-5">
      <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
        {label}
      </p>
      <h2 className="md-title-large mt-1 text-[var(--md-sys-color-on-surface)]">
        <Link
          href={`/${slug}`}
          className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
        >
          {title}
        </Link>
      </h2>
      <p className="md-body-medium mt-2 text-[var(--md-sys-color-on-surface)]">
        {body}
      </p>
    </Card>
  );
}
