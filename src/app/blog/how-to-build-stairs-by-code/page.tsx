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

const POST = getPostBySlug("how-to-build-stairs-by-code")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the maximum riser height under IRC 2024?",
    answer:
      "Section R311.7.5.1 caps riser height at 7.75 inches, measured vertically between the leading edges of adjacent treads. The largest riser in a flight cannot exceed the smallest by more than 3/8 inch. That tolerance is what most failed inspections trip on.",
  },
  {
    question: "What is the minimum tread depth?",
    answer:
      "10 inches under IRC R311.7.5.2, measured horizontally from nosing to nosing. If you're using nosings, the projection must be between 3/4 inch and 1.25 inch. Open risers are allowed if no 4-inch sphere can pass through, except on stairs serving more than one dwelling.",
  },
  {
    question: "How much headroom does code require?",
    answer:
      "80 inches minimum, measured plumb from the tread nosing to the lowest point of the ceiling or stairwell framing above (R311.7.2). That's the dimension you check before drywall, not after. A bulkhead you forgot about will eat 2 inches and put you under.",
  },
  {
    question: "What is the formula for stringer length?",
    answer:
      "Stringer length equals the square root of (total rise squared plus total run squared). It's the Pythagorean theorem applied to a right triangle where rise and run are the legs. A 9-step stair with 65.25 inches of rise and 80 inches of run gives a stringer around 103 inches.",
  },
  {
    question: "Why divide total rise by 7 to find the number of risers?",
    answer:
      "Seven inches is a comfortable target riser, sitting under the 7.75-inch maximum with room to round. Total rise divided by 7 gives a starting riser count, which you then round to a whole number. Dividing the rise by that whole count yields your actual riser height.",
  },
  {
    question: "When is a handrail required?",
    answer:
      "Any flight with four or more risers needs a handrail on at least one side (R311.7.8). Top of grip must sit between 34 and 38 inches above the nosings, and the grip must allow continuous sliding without obstruction from the bottom riser to the top riser.",
  },
  {
    question: "What is the maximum angle for code-compliant stairs?",
    answer:
      "The IRC doesn't list a maximum angle directly, but the geometry caps you near 37 degrees: arctan(7.75 / 10) is about 37.78. Most builders target 32 to 35 degrees because steeper flights feel cramped and fail the nosing-projection check more often.",
  },
  {
    question: "Do open risers count under the code?",
    answer:
      "Open risers are allowed on single-family stairs as long as the opening rejects a 4-inch sphere. On stairs serving multiple dwellings, open risers are prohibited. Either way, the tread depth and nosing rules still apply to the structural treads.",
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
        "https://codes.iccsafe.org/content/IRC2024P1/chapter-3-building-planning",
        "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.25",
        "https://www.access-board.gov/aba/guides/chapter-5-stairways/",
        "https://www.nist.gov/news-events/news/2017/03/nist-study-stairway-falls",
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
          Construction · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          Maximum riser 7.75 inches, minimum tread 10. Headroom 80. Maximum
          angle around 37 degrees, though you&apos;ll want less. The math for
          stringer length is one square root, and the four things inspectors
          actually catch are all dimensional, not structural. This is the
          shortest path from total rise to a flight that passes the first time.
        </p>
      </header>

      <CTACard
        slug="stair-calculator"
        label="Skip the math"
        title="Use our Stair Calculator"
        body="Plug in total rise and the calculator returns risers, treads, stringer length, and angle. The post below is for the people who want to understand why the answer is what it is, and catch the code-side mistakes a calculator can't flag."
      />

      <Section id="code-limits" title="The four numbers the IRC actually cares about">
        <p>
          Before any stringer math, lock the dimensions code gives you. The
          International Residential Code 2024, Section R311.7, sets the
          envelope every residential stair has to live inside. There are more
          than four rules in there, but four of them produce 90% of the
          inspection failures.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Maximum riser:</strong> 7.75 inches. Measured from leading
            edge of one tread to the leading edge of the next.
          </li>
          <li>
            <strong>Minimum tread depth:</strong> 10 inches, nosing to nosing.
          </li>
          <li>
            <strong>Headroom:</strong> 80 inches plumb, from any nosing to the
            ceiling above.
          </li>
          <li>
            <strong>Uniformity:</strong> the largest riser and smallest riser in
            a flight cannot differ by more than 3/8 inch. Same for tread depths.
          </li>
        </ul>
        <p>
          That uniformity rule is the sneaky one. You can spec perfect 7-inch
          risers all day, but if the slab at the bottom of the flight slopes a
          quarter inch, your bottom riser is now 7.25 and the rest are 7.00.
          Inspectors carry tape measures. They check.
        </p>
      </Section>

      <Section id="riser-count" title="Step one: turn total rise into a riser count">
        <p>
          Total rise is the vertical distance from finished floor to finished
          floor. Measure it after subfloor and finish flooring are accounted
          for, not before. Skipping the finished-floor step is the single most
          common mistake on remodels.
        </p>
        <Formula>
          riser count = ROUND(total rise<sub>in</sub> ÷ 7)
        </Formula>
        <p>
          Seven inches is the target. It sits comfortably under the 7.75
          maximum, it rounds cleanly, and it&apos;s the riser people actually
          enjoy climbing. Round to a whole number, then divide back the other
          way to get your real riser height.
        </p>
        <Formula>
          actual riser<sub>in</sub> = total rise<sub>in</sub> ÷ riser count
        </Formula>
        <p>
          If the actual riser blows past 7.75, you add one more riser and
          recalculate. If it drops below 4, you have too many risers, take one
          out. Practical range for residential: 6.5 to 7.75 inches.
        </p>
      </Section>

      <Section id="stringer-math" title="Step two: stringer length is just Pythagoras">
        <p>
          Once you have riser count and tread depth, you have total run (tread
          depth times number of treads, where treads = risers - 1). Stringer
          length is the hypotenuse of the right triangle made by total rise and
          total run. This is the same theorem your{" "}
          <Link href="/pythagorean-theorem-calculator">
            Pythagorean theorem calculator
          </Link>{" "}
          handles, applied to wood.
        </p>
        <Formula>
          stringer length<sub>in</sub> = √(rise² + run²)
        </Formula>
        <p>
          That gives you the diagonal length along the bottom edge of the
          stringer. Order stock long enough to lay out the full triangle plus a
          little extra for the bottom plumb cut and the top notch where it
          meets the header.
        </p>
      </Section>

      <Section id="examples" title="Two worked examples">
        <p>
          Same formulas, different jobs. Run them both, and the geometry stops
          feeling abstract.
        </p>

        <h3 className="md-title-large mt-6">1. Basement stair, 108-inch total rise</h3>
        <WorkedSteps
          steps={[
            { label: "Target riser", value: "108 ÷ 7 = 15.43" },
            { label: "Round riser count", value: "15 risers" },
            { label: "Actual riser height", value: "108 ÷ 15 = 7.20 in" },
            { label: "Tread count", value: "15 - 1 = 14 treads" },
            { label: "Total run at 10-in treads", value: "14 × 10 = 140 in" },
            { label: "Stringer length", value: "√(108² + 140²) ≈ 176.7 in" },
            { label: "Stair angle", value: "arctan(108 / 140) ≈ 37.6°" },
          ]}
        />
        <p>
          7.20-inch riser, 10-inch tread, 37.6 degrees. The angle is high but
          legal. If you want a friendlier stair, push tread depth to 11 inches
          (total run becomes 154 in) and the angle drops to 35 degrees. The
          stringer grows to about 186 inches but the climb feels civilized.
        </p>

        <h3 className="md-title-large mt-10">2. Deck stair, 36-inch rise</h3>
        <WorkedSteps
          steps={[
            { label: "Target riser", value: "36 ÷ 7 = 5.14" },
            { label: "Round riser count", value: "5 risers" },
            { label: "Actual riser height", value: "36 ÷ 5 = 7.20 in" },
            { label: "Tread count", value: "5 - 1 = 4 treads" },
            { label: "Total run at 11-in treads", value: "4 × 11 = 44 in" },
            { label: "Stringer length", value: "√(36² + 44²) ≈ 56.9 in" },
            { label: "Stair angle", value: "arctan(36 / 44) ≈ 39.3°" },
          ]}
        />
        <p>
          Here the angle nudges over 39 because the rise is short and rounding
          up forces a steep flight. Drop to 4 risers (9-inch riser) and you
          break code. The fix on a deck stair is to add a landing or stretch
          the run, not to cheat the riser.
        </p>
      </Section>

      <Section id="headroom-handrail" title="Headroom and handrails: the part people forget at framing">
        <p>
          Most homeowners think about treads and risers. Inspectors think about
          the two things you can&apos;t fix after drywall: headroom and
          handrail geometry.
        </p>
        <p>
          <strong>Headroom (R311.7.2):</strong> 80 inches minimum, measured
          plumb from any tread nosing to the lowest point above. That includes
          ductwork, a soffit, a beam, the underside of the next flight. When
          you frame a stairwell opening, the rough opening length plus the
          framing depth and finish ceiling has to leave you 80 clean inches at
          the worst point. The worst point is usually right where the flight
          enters the upper floor framing.
        </p>
        <p>
          <strong>Handrails (R311.7.8):</strong> required on flights with four
          or more risers. Top of grip between 34 and 38 inches above the
          nosings, measured along the slope. The graspable portion has to be
          continuous, no fat newel posts interrupting your hand. Type I handrail
          grips need a 1.25 to 2-inch round cross-section; Type II covers
          larger profiles with finger recesses.
        </p>
        <p>
          <strong>Guards (R312):</strong> any stair with a drop more than 30
          inches needs a guard 34 inches tall (some jurisdictions require 36).
          Balusters can&apos;t pass a 4-3/8 inch sphere. The triangle at the
          bottom of each tread between the bottom rail, the riser, and the
          tread is allowed to pass a 6-inch sphere. Worth knowing if you&apos;re
          building open-rise stairs.
        </p>
      </Section>

      <Section id="cutting-stringers" title="Laying out and cutting the stringer">
        <p>
          The math is done. Cutting is where it goes sideways. The standard
          method uses a framing square with stair gauges (little brass clamps)
          set to your rise and run.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Pick straight stock.</strong> 2x12 minimum for stringers
            carrying treads. Crown up. Reject anything with a knot in the
            critical cut path; a knot at a tread cut weakens the stringer.
          </li>
          <li>
            <strong>Clamp the gauges.</strong> Tongue (short leg) of the
            framing square at the riser dimension, blade (long leg) at the
            tread depth. The brass gauges hold the square in repeatable
            position.
          </li>
          <li>
            <strong>Step off all cuts.</strong> Walk the square down the
            stringer, marking each rise and tread in pencil. Number them as you
            go. Don&apos;t lift the square and re-place it in the middle of
            stepping off; cumulative error stacks up fast.
          </li>
          <li>
            <strong>Drop the bottom for tread thickness.</strong> The first
            riser sits on the floor with a tread thickness less material under
            it. If your tread is 1 inch, cut 1 inch off the bottom of the
            stringer. Skip this and your bottom riser is one tread thicker than
            the rest. Instant code violation.
          </li>
          <li>
            <strong>Cut with a circ saw, finish with a handsaw.</strong> The
            circular saw can&apos;t cut a corner cleanly. Stop before the
            corner and finish the last half inch with a handsaw or jigsaw.
            Overcutting into the stringer leg weakens it.
          </li>
        </ol>
        <p>
          For decks and any treated lumber work, calculate your board footage
          before you order. A 16-foot 2x12 has 21.3 board feet; if you&apos;re
          buying enough stringers and treads for a long flight, the{" "}
          <Link href="/board-foot-calculator">board foot calculator</Link>{" "}
          turns linear-foot pricing into a real number.
        </p>
      </Section>

      <Section id="inspector-checklist" title="What the inspector measures">
        <p>
          Five tools come out of the bag at the rough inspection. Know what
          they&apos;re checking and you&apos;ll know where to be careful.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Tool</th>
              <th>What it checks</th>
              <th>Threshold</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tape measure</td>
              <td>Riser height, tread depth, headroom, handrail height</td>
              <td>R311.7.5, R311.7.2, R311.7.8</td>
            </tr>
            <tr>
              <td>Story pole or laser</td>
              <td>Uniformity across the flight</td>
              <td>3/8 in max variation</td>
            </tr>
            <tr>
              <td>4-inch sphere (sometimes just a 4-in ball)</td>
              <td>Open-riser openings, guard balusters</td>
              <td>Sphere cannot pass</td>
            </tr>
            <tr>
              <td>Level</td>
              <td>Tread slope (level fore/aft, slight slope to drain on exterior)</td>
              <td>2% max on exterior treads</td>
            </tr>
            <tr>
              <td>Pull test on handrail</td>
              <td>250 lb concentrated load at any point</td>
              <td>R301.5</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          The 250-pound load test is rarely done in residential, but the
          attachment hardware has to be specified to it. Lag bolts into solid
          framing, not drywall anchors.
        </p>
      </Section>

      <Section id="why-stairs-fail" title="Why stairs fall, statistically">
        <p>
          The dimensional rules aren&apos;t arbitrary. A 2017 NIST study of
          stairway falls found that even small inconsistencies in riser
          height, on the order of half an inch, dramatically increase
          misstep frequency. The 3/8-inch uniformity rule comes from that body
          of research, not from code-writers being picky.
        </p>
        <p>
          The CDC tracks roughly one million ER visits per year in the US for
          stair-related falls. The two highest-risk conditions: non-uniform
          risers and treads shorter than 10 inches. Both of those are
          dimensional, both are catchable at layout, and both are what the
          inspector is checking with that tape measure.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Measuring total rise without finished flooring.",
            fix: "Add the future flooring thickness to both the bottom and top floor before dividing by 7. A 3/4-inch hardwood install on the upper floor changes a 108-inch rise to 108.75 if the basement stays bare concrete. That shifts riser height enough to bust the 3/8-inch uniformity rule.",
          },
          {
            mistake: "Forgetting to drop the bottom stringer cut by tread thickness.",
            fix: "The bottom riser sits with a tread thickness less material below it. Cut the bottom of the stringer down by the tread thickness, or your first step is one tread taller than the rest. Inspector catches it in 30 seconds.",
          },
          {
            mistake: "Building the stairs before checking headroom at framing.",
            fix: "Mock the flight in chalk on the floor with the upper-floor framing in mind. The 80-inch headroom threshold is plumb from nosing to the lowest framing above. Discovering a 78-inch headroom after the flight is built means you tear it out.",
          },
          {
            mistake: "Skipping the uniformity check after the slab is poured.",
            fix: "If the bottom slab pours high or low, your bottom riser changes. Re-measure after concrete cures and adjust the bottom stringer cut. 3/8 inch is the tolerance, not a target.",
          },
          {
            mistake: "Spec&apos;ing a handrail height in the middle of the range and missing.",
            fix: "34 to 38 inches above nosings. Pick 36 and mount to that, with the bracket through the wall framing not just drywall. Going for 38 leaves no margin for the slope measurement to drift, and going for 34 leaves none on the other side.",
          },
          {
            mistake: "Treating tread nosing as optional.",
            fix: "If you have closed risers, you need a 3/4-inch to 1.25-inch nosing projection unless the tread itself is 11 inches deep or more. Skip the nosing on a 10-inch tread and the inspector marks it as a tread-depth failure.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "IRC 2024 Chapter 3 Building Planning (R311 Stairways)",
            href: "https://codes.iccsafe.org/content/IRC2024P1/chapter-3-building-planning",
          },
          {
            label: "OSHA 1910.25: Stairways (commercial reference)",
            href: "https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.25",
          },
          {
            label: "US Access Board: ABA Chapter 5 Stairways",
            href: "https://www.access-board.gov/aba/guides/chapter-5-stairways/",
          },
          {
            label: "NIST: Stairway Falls Research Program",
            href: "https://www.nist.gov/news-events/news/2017/03/nist-study-stairway-falls",
          },
          {
            label: "CDC WISQARS: Nonfatal Stair-Related Injuries",
            href: "https://www.cdc.gov/injury/wisqars/",
          },
        ]}
      />

      <Author />
      <LastReviewed date={POST.dateModified} />

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
