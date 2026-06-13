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

const POST = getPostBySlug("fractions-vs-decimals")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "When should I use fractions instead of decimals?",
    answer:
      "Use fractions when the underlying scale is built on halves and quarters: cooking, carpentry, sheet music, gear ratios. Measuring cups go 1/4, 1/3, 1/2, not 0.25, 0.33, 0.5. A 7/16 socket fits a 7/16 bolt. Reaching for decimals there adds a conversion step every single time.",
  },
  {
    question: "Why does money use decimals and not fractions?",
    answer:
      "US currency is base-10: 100 cents in a dollar. Decimals line up with that exactly. $12.43 is twelve dollars and 43/100, but writing it as a mixed number wastes ink and breaks every spreadsheet. Stock prices used eighths until 2001, when the SEC mandated decimalization to tighten spreads.",
  },
  {
    question: "What's the fastest way to convert a fraction to a decimal?",
    answer:
      "Divide the top number by the bottom: 3/8 = 3 ÷ 8 = 0.375. For eighths, memorize the table once and you'll never divide again. 1/8 = 0.125, then add 0.125 for each step up: 2/8 = 0.25, 3/8 = 0.375, and so on.",
  },
  {
    question: "How do I convert a decimal back to a fraction?",
    answer:
      "Count the digits after the decimal point, put the number over that many zeros, then reduce. 0.75 has two digits, so 75/100, which simplifies to 3/4. For repeating decimals like 0.333... use 1/3 directly; long division won't terminate.",
  },
  {
    question: "Which is more accurate, a fraction or a decimal?",
    answer:
      "Fractions are exact for rational numbers like 1/3 or 2/7. Decimals truncate them: 1/3 becomes 0.333 and loses precision at every cut-off. For irrationals like pi, both forms approximate. Engineering uses decimals because tools measure in tenths and thousandths, not in odd denominators.",
  },
  {
    question: "Do recipes work with decimal measurements?",
    answer:
      "They can, but you'll fight your equipment. Standard US measuring cups are 1/4, 1/3, 1/2, 2/3, 3/4, 1. A recipe calling for 0.66 cups of flour is asking you to eyeball something the cup set already does cleanly with 2/3. Convert the recipe, not the tools.",
  },
  {
    question: "Why do carpenters still measure in 16ths of an inch?",
    answer:
      "Because lumber, fasteners, and tape measures are all calibrated that way. A 2x4 is nominal, but a 7/16 OSB sheet, a 3/8 lag bolt, and a 1/2-inch drill bit are exact. Carpenters reading a tape don't pause to convert 7/16 to 0.4375; they just see the mark.",
  },
  {
    question: "When do I need both fractions and decimals on the same job?",
    answer:
      "Construction is the classic case. The plan is drawn in feet and inches (fractions), but the laser measures in decimal feet, and the spreadsheet sums everything in decimal. A good carpenter converts at the boundaries: read the tape in 16ths, type the total in decimal, cut back to 16ths.",
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
        "https://www.nist.gov/pml/owm/metric-si/si-units",
        "https://www.sec.gov/news/press/2001-14.txt",
        "https://www.bls.gov/cpi/factsheets/cpi-math-calculations.pdf",
        "https://nrich.maths.org/2515",
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
          Math · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          Recipes love fractions. Money loves decimals. Construction needs both,
          and the difference between a clean cut and a wasted board is knowing
          which form fits the job. Here&apos;s the practical guide, plus three
          mental-math conversion tricks that turn 7/16 into 0.4375 without a
          calculator.
        </p>
      </header>

      <CTACard
        slug="fractions-calculator"
        label="Skip the math"
        title="Use our Fractions Calculator"
        body="Add, subtract, multiply, divide, and reduce fractions in one shot. The post below is for the cooks, carpenters, and accountants who want to know when each form earns its keep, and how to switch between them in their head."
      />

      <Section id="the-rule" title="The rule, in one sentence">
        <p>
          Use the form your tool uses. Measuring cups go 1/4, 1/3, 1/2. Bank
          statements go $12.43. Sockets go 7/16. Reach for the form that matches
          the scale you&apos;re already working in, and you skip a conversion
          every single time.
        </p>
        <p>
          That sounds obvious until you watch a new home cook squint at &quot;0.66
          cups&quot; on a Pinterest recipe, or an accountant try to add 1/3 of a
          dollar to a spreadsheet. The mismatch isn&apos;t math; it&apos;s tooling.
          Once you know which world a number lives in, the form picks itself.
        </p>
      </Section>

      <Section id="cooking" title="Cooking: fractions win, every time">
        <p>
          Walk into any kitchen with a US measuring cup set. The cups are 1/4,
          1/3, 1/2, 2/3, 3/4, 1. Notice what&apos;s missing: no 0.1, no 0.2, no
          0.25. The cup set was designed for a world that thinks in halves and
          thirds, because that&apos;s how recipes scale.
        </p>
        <p>
          Doubling a recipe? 3/4 cup becomes 1 1/2 cups. Halving? 2/3 becomes
          1/3. Both moves take half a second of thought. Try the same with
          decimals: 0.75 × 2 = 1.5 cups, fine, but 0.66 ÷ 2 = 0.33 and now you&apos;re
          eyeballing a third of a cup with the 1/3 measure anyway. The fraction
          was already the answer.
        </p>
        <p>
          The one exception: baking by weight. A digital scale reads in grams or
          ounces with a decimal, and serious bakers prefer it because volume
          measurements vary by how you scoop flour. King Arthur Baking publishes
          weight conversions for every recipe for exactly this reason. But the
          fraction-vs-decimal choice there is really weight-vs-volume in
          disguise.
        </p>
        <h3 className="md-title-large mt-6">Recipe scaling cheatsheet</h3>
        <WorkedSteps
          steps={[
            { label: "Half of 3/4 cup", value: "3/8 cup (between 1/4 and 1/2)" },
            { label: "Double 2/3 cup", value: "1 1/3 cups" },
            { label: "Triple 1/4 tsp", value: "3/4 tsp" },
            { label: "1.5x of 1/2 cup", value: "3/4 cup" },
            { label: "Half of 1 1/4 cups", value: "5/8 cup (or 1/2 + 1/8)" },
          ]}
        />
      </Section>

      <Section id="money" title="Money: decimals own this turf">
        <p>
          US currency is base-10. One hundred cents in a dollar. The decimal
          system was built for exactly this kind of scale, which is why every
          financial number you&apos;ll ever see uses two decimal places: $12.43,
          $1,200.00, 4.25% APR.
        </p>
        <p>
          Stocks used to be different. Before 2001, US stocks were quoted in
          eighths, then sixteenths, then thirty-seconds of a dollar. The SEC
          ordered full decimalization that year, and the bid-ask spreads on the
          NYSE compressed from around 12.5 cents to a couple of pennies almost
          overnight. The fraction system had survived for two hundred years; it
          died because decimals were tighter, faster, and machine-readable.
        </p>
        <p>
          When you compute interest, loan payments, or tax withholding, you&apos;re
          working in decimals because the IRS publishes the rates that way. Pub
          15-T (Federal Income Tax Withholding Methods) lists every bracket as a
          decimal percentage. The mortgage on a $300,000 home at 7.0% APR doesn&apos;t
          care about fractions; it cares about a payment of $1,995.91 a month,
          calculated with a decimal interest rate compounded monthly.
        </p>
        <p>
          The one place fractions still sneak into money: split bills. &quot;Each
          of us owes a third of $84.&quot; That&apos;s 28, clean. The decimal form
          ($28.00) is what hits Venmo, but the mental math happened in fractions.
          If you want to flip between them on the fly, the{" "}
          <Link href="/decimal-fraction-converter">decimal-fraction converter</Link>{" "}
          handles the boundary cases.
        </p>
      </Section>

      <Section id="measurement" title="Measurement: it depends which side of the Atlantic">
        <p>
          The US system runs on fractions because the inch was never base-10. A
          foot is 12 inches. A yard is 3 feet. A mile is 5,280 feet. None of
          those divide cleanly by 10, but they all divide cleanly by 2, 3, and 4,
          which is why tape measures go down to 1/16 of an inch and machinists
          work in 1/64s and 1/128s.
        </p>
        <p>
          The metric system, by contrast, was deliberately designed in 1795 to
          be decimal end-to-end. A meter is 100 centimeters. A kilogram is 1,000
          grams. There are no metric fractions in normal use; you just shift the
          decimal point. NIST maintains the modern SI definitions, and every
          serious engineering spec written outside the US is in millimeters with
          two decimal places.
        </p>
        <h3 className="md-title-large mt-6">7/16 inch vs 0.4375 inch</h3>
        <Formula>0.4375 in = 7/16 in (exactly)</Formula>
        <p>
          Both numbers are the same length. The carpenter reads 7/16 off the tape
          because the marks are physically there. The CAD operator types 0.4375
          because the software wants a decimal. Neither one is &quot;better&quot;;
          they&apos;re translations of the same measurement into the language of
          two different tools.
        </p>
        <p>
          When the same job uses both, convert at the boundary. Measure in 16ths,
          type the total in decimal, sum the column, then convert back to 16ths
          for the cut. A{" "}
          <Link href="/mixed-number-calculator">mixed-number calculator</Link>{" "}
          handles the &quot;3 ft 7 5/16 in&quot; arithmetic without forcing you
          to pick one form for the whole job.
        </p>
      </Section>

      <Section id="conversion-tricks" title="Three mental-math conversion tricks">
        <p>
          You don&apos;t need a calculator for the common cases. Three tricks
          cover most of what comes up in cooking, carpentry, and quick mental
          arithmetic.
        </p>

        <h3 className="md-title-large mt-6">1. The 1/8 rule (memorize once, use forever)</h3>
        <p>
          Every eighth is 0.125. Memorize the table and you&apos;ll never divide
          again for the rest of your life:
        </p>
        <WorkedSteps
          steps={[
            { label: "1/8", value: "0.125" },
            { label: "2/8 = 1/4", value: "0.250" },
            { label: "3/8", value: "0.375" },
            { label: "4/8 = 1/2", value: "0.500" },
            { label: "5/8", value: "0.625" },
            { label: "6/8 = 3/4", value: "0.750" },
            { label: "7/8", value: "0.875" },
          ]}
        />
        <p>
          For 16ths, halve any eighth: 1/16 = 0.0625, 3/16 = 0.1875, and so on.
          For 32nds, halve a 16th. Three layers of doubling covers every
          carpentry fraction you&apos;ll ever see on a tape measure.
        </p>

        <h3 className="md-title-large mt-10">2. Doubling (or halving) trick</h3>
        <p>
          Most kitchen fractions live within one or two doublings of something
          easy. 5/8 cup feels exotic until you see it as 1/2 + 1/8: half a cup
          plus a tablespoon. Same with 3/8: 1/4 + 1/8. The trick is to break the
          fraction into the nearest familiar landmark plus a small adjustment.
        </p>
        <Formula>
          5/8 = 1/2 + 1/8 = 0.5 + 0.125 = 0.625
        </Formula>
        <p>
          This works because eighths and quarters add cleanly. You&apos;re not
          really doing math; you&apos;re snapping to a known anchor and adding a
          step.
        </p>

        <h3 className="md-title-large mt-10">3. The decimal-point shift (for percents)</h3>
        <p>
          To convert any decimal to a percent, move the point two places right.
          0.45 becomes 45%. 0.0625 becomes 6.25%. Backwards: 23% becomes 0.23,
          which is 23/100, which reduces to whatever it reduces to (23 is prime,
          so 23/100 stays as 23/100).
        </p>
        <p>
          The same shift works for money in cents: $1.43 is 143 cents. Slide the
          point two places. The mortgage rate on your bank statement (7.125%) is
          0.07125 in your spreadsheet&apos;s amortization formula. Same number,
          two notations, one decimal-point move between them.
        </p>
      </Section>

      <Section id="other-domains" title="Music, gears, and other fraction strongholds">
        <p>
          Beyond the kitchen and the workshop, a few specialized worlds still
          run on fractions because the underlying scale isn&apos;t base-10.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Sheet music.</strong> Time signatures are 4/4, 3/4, 6/8. A
            whole note is 1, a half note 1/2, a quarter 1/4, an eighth 1/8. The
            entire notation system is fractional because music subdivides time by
            doubling and halving, not by tens.
          </li>
          <li>
            <strong>Gear ratios.</strong> A bike with a 50-tooth chainring and a
            25-tooth cog has a 2:1 gear ratio. Engineers write it as 50/25, or
            2/1, never as 2.000. The ratio form preserves the meaning (two
            wheel turns per pedal stroke) in a way the decimal can&apos;t.
          </li>
          <li>
            <strong>Odds and probability.</strong> Horse racing odds are 5/2 or
            8/1. The fraction shows the payout structure directly: bet $2 to win
            $5 plus your stake back. Decimal odds (3.50) carry the same info but
            require a translation step every time.
          </li>
          <li>
            <strong>Calendars and time.</strong> A quarter past three is
            3:15, but the &quot;quarter&quot; is 1/4 of an hour. Half-hour and
            quarter-hour aren&apos;t decimals; they&apos;re fractions baked into
            how we talk about time.
          </li>
        </ul>
        <p>
          What these all share: the scale was built before decimal notation
          dominated, and the tools (instruments, sprockets, clock faces) still
          show the fractional marks. Trying to decimalize them costs you precision
          and clarity for zero benefit.
        </p>
      </Section>

      <Section id="when-decimals-win" title="When decimals genuinely beat fractions">
        <p>
          Outside cooking and carpentry, decimals usually win. A short list of
          the strongest cases:
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Anything in a spreadsheet.</strong> Excel and Sheets treat
            fractions as text unless you go out of your way. =A1/B1 gives a
            decimal. Sorting, summing, and charting all assume decimals. Fight
            this at your peril.
          </li>
          <li>
            <strong>Scientific measurement.</strong> NIST defines the SI base
            units (meter, kilogram, second) with decimal sub-units. A precision
            instrument reads 2.3456 mm, not 2 mm and some fraction. Repeatability
            and tolerance specs are written in decimal form.
          </li>
          <li>
            <strong>Programming.</strong> Floats are decimal. Anyone who tries
            to write business logic in fractions ends up reinventing them as a
            ratio object, then converting to decimal for display anyway.
          </li>
          <li>
            <strong>Tax and interest math.</strong> The IRS, banks, and every
            financial institution publishes rates as decimal percentages.
            Mortgage amortization, payroll withholding, and capital-gains
            calculations all need decimals to plug into standard formulas.
          </li>
          <li>
            <strong>Statistical reporting.</strong> P-values, confidence
            intervals, and effect sizes are decimal. The ASA&apos;s 2016
            statement on statistical significance discusses p &lt; 0.05 as a
            convention, not p &lt; 1/20. Same number, but the field standardized
            on decimal notation a century ago.
          </li>
        </ol>
      </Section>

      <Section id="quick-decision-table" title="Quick decision table">
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Job</th>
              <th>Use</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Recipes, kitchen measurements</td>
              <td>Fractions</td>
              <td>Cup set goes 1/4, 1/3, 1/2. Doubling and halving stay clean.</td>
            </tr>
            <tr>
              <td>Money, taxes, interest</td>
              <td>Decimals</td>
              <td>Currency is base-10. Spreadsheets demand it. IRS publishes it.</td>
            </tr>
            <tr>
              <td>Carpentry, tape-measure work</td>
              <td>Fractions</td>
              <td>Tape marks are 1/16 and 1/32. Sockets and bolts ship in fractions.</td>
            </tr>
            <tr>
              <td>CAD, engineering drawings</td>
              <td>Decimals</td>
              <td>Software wants decimal millimeters or inches. Tolerances ±0.005.</td>
            </tr>
            <tr>
              <td>Music notation</td>
              <td>Fractions</td>
              <td>Note values double and halve: whole, 1/2, 1/4, 1/8, 1/16.</td>
            </tr>
            <tr>
              <td>Probability and statistics</td>
              <td>Decimals</td>
              <td>p-values, confidence intervals, and effect sizes all decimal.</td>
            </tr>
            <tr>
              <td>Cooking by weight (baking)</td>
              <td>Decimals</td>
              <td>Digital scale reads 245.3 g. Grams are base-10 by design.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Need to flip between forms mid-job? The{" "}
          <Link href="/decimal-fraction-converter">decimal-fraction converter</Link>{" "}
          handles the boundary cases, including repeating decimals like 0.333... = 1/3.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Truncating 1/3 as 0.33 in a recipe.",
            fix: "Use the 1/3 measuring cup. Decimal 0.33 cups is roughly a tablespoon short of 1/3 of a cup, and across three eggs of substitution math, you lose enough volume to dry out a cake.",
          },
          {
            mistake: "Adding fractions with unlike denominators by adding tops and bottoms.",
            fix: "1/2 + 1/3 is not 2/5. Find the common denominator (6), restate as 3/6 + 2/6 = 5/6. Or convert to decimals: 0.5 + 0.333 = 0.833 and back to 5/6.",
          },
          {
            mistake: "Mixing 0.06 and 6% in interest calculations.",
            fix: "6% means 6/100 = 0.06. A mortgage formula wants the decimal form. Plug in 6 instead of 0.06 and your payment will be 100x too large. Always shift the decimal point two places when moving between percent and decimal.",
          },
          {
            mistake: "Reading 7/16 as 'almost half' on a tape measure.",
            fix: "7/16 is 0.4375, exactly 1/16 short of 1/2. If you cut at 'almost half' you'll be 1/16 long. On trim work, that gap is visible. Read the mark, not the vibe.",
          },
          {
            mistake: "Using fractions for sums in a spreadsheet.",
            fix: "Excel doesn't natively add 1/3 + 1/4. It converts both to decimal, sums, then displays whatever you formatted the cell as. If the cell is fraction-formatted, you'll see 7/12, but the underlying value is 0.5833. Trust the decimal.",
          },
          {
            mistake: "Forgetting that 0.999... = 1.",
            fix: "Repeating 9s are exactly equal to 1, not 'almost' 1. This trips up people who think decimals are always more accurate than fractions. Both notations have edge cases; pick the form that matches your tool and stop arguing with the math.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "NIST: SI Units",
            href: "https://www.nist.gov/pml/owm/metric-si/si-units",
          },
          {
            label: "SEC: Decimalization of US securities markets (2001)",
            href: "https://www.sec.gov/news/press/2001-14.txt",
          },
          {
            label: "BLS: CPI math and rounding conventions",
            href: "https://www.bls.gov/cpi/factsheets/cpi-math-calculations.pdf",
          },
          {
            label: "NRICH (University of Cambridge): Fractions and decimals",
            href: "https://nrich.maths.org/2515",
          },
          {
            label: "IRS Publication 15-T: Federal Income Tax Withholding Methods",
            href: "https://www.irs.gov/pub/irs-pdf/p15t.pdf",
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
