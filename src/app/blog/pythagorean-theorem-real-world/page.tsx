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

const POST = getPostBySlug("pythagorean-theorem-real-world")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the Pythagorean theorem in plain English?",
    answer:
      "In any right triangle, the square of the longest side equals the sum of the squares of the other two. Written as a² + b² = c², where c is the hypotenuse. It only works when one angle is exactly 90°.",
  },
  {
    question: "Why does the 3-4-5 trick square a corner?",
    answer:
      "Because 3² + 4² = 9 + 16 = 25, and 25 = 5². If you measure 3 feet along one wall, 4 feet along the other, and the diagonal between them is exactly 5 feet, the corner is a true right angle. Carpenters scale it up: 6-8-10, 9-12-15, 12-16-20.",
  },
  {
    question: "How do TV manufacturers measure screen size?",
    answer:
      "Diagonally, corner to corner of the visible panel. A 55-inch TV is 55 inches from one corner to the opposite, not the width. The width and height come from the Pythagorean theorem once you know the aspect ratio (almost always 16:9 today).",
  },
  {
    question: "Does GPS actually use the Pythagorean theorem?",
    answer:
      "Yes, in 3D. GPS receivers solve for distance to each satellite using the 3D version of the formula: d² = (x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)². That's just a² + b² + c² = d² extended one dimension. Four satellites give you a position fix.",
  },
  {
    question: "What's the longest ladder I can lean against an 8-foot wall safely?",
    answer:
      "OSHA recommends a 4-to-1 angle: base 1 foot out for every 4 feet of vertical reach. For an 8-ft reach, the base sits 2 ft out and the ladder length is √(8² + 2²) ≈ 8.25 ft. Buy the next size up so the top extends 3 ft above the contact point.",
  },
  {
    question: "How far is it from home plate to second base?",
    answer:
      "On a standard MLB diamond, the bases are 90 feet apart and the diamond is a square. The diagonal from home to second is √(90² + 90²) = √16,200 ≈ 127.28 feet. Little League uses 60-foot bases, so the diagonal is √7,200 ≈ 84.85 feet.",
  },
  {
    question: "Can the Pythagorean theorem give me a wrong answer?",
    answer:
      "Only if the triangle isn't a right triangle, or the surface isn't flat. On a globe (long-haul flights, surveying across counties), the curvature of the earth matters and you need spherical trig. For anything under a mile on flat ground, the flat-plane formula is accurate enough.",
  },
  {
    question: "Why is it named after Pythagoras if Babylonians knew it first?",
    answer:
      "Plimpton 322, a clay tablet from around 1800 BCE, lists Pythagorean triples 1,200 years before Pythagoras was born. The Greeks get the name because they wrote the first formal proof. The relationship was known and used in construction across Egypt, India, and China long before.",
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
        "https://www.osha.gov/portable-ladders",
        "https://www.gps.gov/systems/gps/performance/accuracy/",
        "https://www.mlb.com/glossary/rules/field-dimensions",
        "https://mathworld.wolfram.com/PythagoreanTheorem.html",
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
          TV diagonal sizing, hanging a level shelf, the squareness of a deck
          frame, GPS triangulation. Ten places a² + b² = c² shows up outside
          the classroom, with the numbers worked out. If you remember nothing
          else from ninth-grade geometry, remember this one.
        </p>
      </header>

      <CTACard
        slug="pythagorean-theorem-calculator"
        label="Skip the arithmetic"
        title="Use our Pythagorean Theorem Calculator"
        body="Plug in any two sides and the calculator returns the third, plus the angle. Same math the carpenters and surveyors below do by hand. Faster when you're standing in a lumberyard."
      />

      <Section id="the-formula" title="The formula in 30 seconds">
        <p>
          Take a right triangle. The two short sides are <em>legs</em>, the
          long one is the <em>hypotenuse</em>. The theorem says the area of a
          square drawn on the hypotenuse equals the combined area of squares
          drawn on the two legs.
        </p>
        <Formula>
          a² + b² = c² &nbsp;&nbsp; (where c is the side opposite the 90° angle)
        </Formula>
        <p>
          Rearrange for the side you don&apos;t know.
          c = √(a² + b²) when you have both legs.
          a = √(c² − b²) when you have the hypotenuse and one leg. That&apos;s
          it. Every example below is one of those two equations applied to
          a different object. If the arithmetic feels slow, the{" "}
          <Link href="/square-root-calculator">square root calculator</Link>{" "}
          does the radical step in one click.
        </p>
      </Section>

      <Section id="tv-size" title="1. Sizing a TV for the wall above your couch">
        <p>
          A 65-inch TV is 65 inches measured corner to corner, not edge to
          edge. Manufacturers chose the diagonal in the 1950s because it gave
          a single number across square and widescreen sets. The width and
          height come from Pythagoras and the aspect ratio.
        </p>
        <p>
          Modern sets are 16:9. Call the width 16x and the height 9x.
          Diagonal² = (16x)² + (9x)² = 337x². For a 65-inch diagonal:
        </p>
        <WorkedSteps
          steps={[
            { label: "Diagonal", value: "65 in" },
            { label: "337x² = 65²", value: "337x² = 4,225" },
            { label: "x²", value: "12.54" },
            { label: "x", value: "3.54" },
            { label: "Width", value: "16 × 3.54 ≈ 56.6 in" },
            { label: "Height", value: "9 × 3.54 ≈ 31.9 in" },
          ]}
        />
        <p>
          So a 65-inch TV is about 57 inches wide and 32 inches tall before
          you add the bezel. If your wall niche is 54 inches across, you
          need to drop down to a 60-inch (≈52.3 wide). Measure the niche
          before you buy. Returns on 65-inch boxes are not fun.
        </p>
      </Section>

      <Section id="3-4-5" title="2. The 3-4-5 carpenter's trick for squaring a corner">
        <p>
          Every framer knows this one. You&apos;re laying out a deck or
          a wall plate and you need a true 90° corner. A speed square is fine
          for a 6-inch cut. It lies to you over 20 feet because a quarter
          degree of error walks out into inches.
        </p>
        <p>
          The fix: 3-4-5. Mark a point 3 feet along one board from the corner.
          Mark a point 4 feet along the perpendicular board. The straight-line
          distance between those two points must be exactly 5 feet. If it is,
          the corner is square. If the diagonal reads 4 ft 11 in, the corner
          is leaning open; 5 ft 1 in, it&apos;s leaning closed.
        </p>
        <p>
          The math: 3² + 4² = 9 + 16 = 25 = 5². It&apos;s a Pythagorean
          triple, a set of whole-number side lengths that satisfy the
          theorem exactly. Scale it up for bigger work:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>6-8-10 for a deck frame.</li>
          <li>9-12-15 for a small slab.</li>
          <li>12-16-20 for a garage pad. Twenty feet of diagonal catches errors a 5-ft check misses.</li>
        </ul>
        <p>
          Always use the longest sides your tape will reach. Squareness error
          stays constant in inches but shrinks as a percentage of the
          measurement. A 1/4-inch slop on 5 feet is 4%. On 20 feet,
          it&apos;s 1%. That&apos;s the difference between a wobbly door
          frame and a square one.
        </p>
      </Section>

      <Section id="ladder" title="3. Picking the right ladder length">
        <p>
          OSHA 1926.1053 says extension ladders should sit at a 1-in-4 angle:
          the base 1 foot out for every 4 feet of vertical reach. Set it
          steeper and the ladder kicks out under load. Set it shallower and
          the top loses contact when you climb.
        </p>
        <p>
          Suppose you need to clean gutters at 12 feet. Base sits 3 feet out
          (12 ÷ 4 = 3). The ladder is the hypotenuse:
        </p>
        <WorkedSteps
          steps={[
            { label: "Vertical reach (a)", value: "12 ft" },
            { label: "Base offset (b)", value: "3 ft" },
            { label: "Required length (c)", value: "√(12² + 3²) = √153" },
            { label: "c", value: "≈ 12.37 ft" },
            { label: "Plus 3 ft above contact (OSHA)", value: "≈ 15.4 ft" },
            { label: "Buy a 16-ft extension ladder", value: "next nominal size up" },
          ]}
        />
        <p>
          Ladders are sold by nominal length, not working length. A 16-ft
          extension ladder collapsed and extended is shorter than 16 ft
          because the sections overlap. Read the working-height label on the
          rail before you buy. OSHA fatality data lists falls from ladders
          as the third-leading construction killer. Three extra feet of
          ladder costs $40. A ride to the ER costs more.
        </p>
      </Section>

      <Section id="baseball" title="4. Throwing from third to first base">
        <p>
          A regulation MLB diamond has bases 90 feet apart on a perfect
          square. Third to first is the diagonal across the infield. A
          shortstop fielding a slow roller and firing across the diamond
          covers exactly that distance.
        </p>
        <WorkedSteps
          steps={[
            { label: "Side of square", value: "90 ft" },
            { label: "Diagonal²", value: "90² + 90² = 16,200" },
            { label: "Diagonal", value: "√16,200 ≈ 127.28 ft" },
          ]}
        />
        <p>
          So an MLB shortstop&apos;s long throw is about 127 feet. Little
          League plays with 60-ft bases, which gives a 84.85-ft diagonal,
          and most 12-year-olds can make that throw on a line. Scale up
          to MLB and it&apos;s a 40% longer distance. That&apos;s why
          big-league shortstops have arms that scouts grade like sprint
          times.
        </p>
        <p>
          The center-fielder-to-home throw is even longer.
          Straightaway center is 400 feet from home in most parks. Center
          field to the third-base cutoff (about 90 ft up the line) is
          √(400² + 90²) ≈ 410 ft. That&apos;s why the cutoff exists.
        </p>
      </Section>

      <Section id="hanging-tv" title="5. Squaring a wall-mounted picture or TV">
        <p>
          You&apos;ve mounted a wall bracket. Two studs, two lag bolts. You
          want to check that the bracket is square to the floor before you
          hang anything heavy on it. A bubble level works on the top edge,
          but only if the floor is level and the wall is plumb, which in
          older houses neither is.
        </p>
        <p>
          Better: measure the diagonals. If the bracket is a rectangle
          18 in tall by 32 in wide, the diagonal is:
        </p>
        <Formula>
          c = √(18² + 32²) = √(324 + 1024) = √1348 ≈ 36.72 in
        </Formula>
        <p>
          Measure corner-to-corner both ways. If they match within an
          eighth of an inch, the bracket is square. If they don&apos;t,
          loosen the lags, nudge, retighten, remeasure. The same trick
          squares cabinet face frames, picture mats, and the bed frame
          your in-laws gave you. A rectangle is only a rectangle when its
          diagonals are equal.
        </p>
      </Section>

      <Section id="navigation" title="6. Walking the diagonal across a city block">
        <p>
          You&apos;re late and the map says destination is 4 blocks east and
          3 blocks north. Manhattan-distance, it&apos;s 7 blocks. Straight-line,
          it&apos;s √(4² + 3²) = √25 = 5 blocks. A diagonal cut through a park
          or a parking lot saves 2 blocks.
        </p>
        <p>
          That&apos;s a recognizable 3-4-5 triple. Most city walks aren&apos;t
          that clean, but the principle holds: the straight-line distance is
          always less than the sum of the legs. Hikers use the same logic
          when bushwhacking off a switchback trail. Long-distance runners
          tangent the corners on a track because the inside lane is shorter
          by exactly the geometry of a curve.
        </p>
        <p>
          For longer trips where you also need the angle, the{" "}
          <Link href="/trigonometry-calculator">trigonometry calculator</Link>{" "}
          gives you bearing from the same two legs: angle = arctan(opposite ÷
          adjacent). That&apos;s how aircraft compute heading corrections in
          crosswind, and how surveyors lay out property corners from a known
          benchmark.
        </p>
      </Section>

      <Section id="deck-framing" title="7. Framing a deck so the boards run true">
        <p>
          Pretend you&apos;re building a 12 × 16 ft deck. After you&apos;ve
          set the ledger and the two outside posts, you need to verify the
          frame is square before you lock it down. If it&apos;s a parallelogram
          instead of a rectangle, every deck board will telegraph the error
          and the railing posts will lean.
        </p>
        <WorkedSteps
          steps={[
            { label: "Side a", value: "12 ft" },
            { label: "Side b", value: "16 ft" },
            { label: "Expected diagonal", value: "√(12² + 16²) = √400 = 20 ft" },
          ]}
        />
        <p>
          Measure both diagonals across the rim joists. They should both
          read 20 ft 0 in. If one reads 20 ft 1/4 in and the other 19 ft
          3/4 in, push the long-diagonal corner inward until they match.
          The frame is square when the diagonals are equal, which is the
          same property as the picture-bracket check above.
        </p>
        <p>
          Note this is also a Pythagorean triple, 3-4-5 scaled by 4. That&apos;s
          not a coincidence. Carpenters reach for round-number deck and shed
          dimensions exactly because they give exact-foot diagonals and the
          math doesn&apos;t need a calculator at the lumberyard.
        </p>
      </Section>

      <Section id="gps" title="8. How GPS turns satellite signals into a position">
        <p>
          Your phone&apos;s GPS chip listens to signals from at least four
          satellites overhead. Each signal contains a timestamp. The chip
          computes how long the signal took to arrive, multiplies by the
          speed of light, and gets the distance to that satellite.
        </p>
        <p>
          Distance from a known satellite at (x₁, y₁, z₁) to your unknown
          position (x, y, z) is:
        </p>
        <Formula>
          d = √((x−x₁)² + (y−y₁)² + (z−z₁)²)
        </Formula>
        <p>
          That&apos;s Pythagoras in three dimensions. Two squared legs become
          three squared legs. Four satellites give four equations in four
          unknowns (x, y, z, and the clock offset of the receiver), which
          the chip solves a few times per second. Civilian GPS accuracy is
          about 7.8 meters at 95% confidence per the official spec. With
          augmentation services like WAAS it tightens to under a meter.
        </p>
        <p>
          The same formula, scaled differently, lets surveyors triangulate
          a property corner from two known monuments, and lets a basketball
          analytics camera compute a player&apos;s vertical jump from two
          fixed reference points.
        </p>
      </Section>

      <Section id="roof-rafter" title="9. Cutting a roof rafter to the right length">
        <p>
          Roofs are described by <em>pitch</em>: how many inches of rise per
          12 inches of run. A 6/12 roof rises 6 inches for every 12 inches
          horizontal. The rafter that runs from the wall plate to the ridge
          board is the hypotenuse of a right triangle.
        </p>
        <p>
          Say you have a building 24 feet wide with a 6/12 pitch. The run
          (horizontal distance from outside wall to peak) is half the width,
          so 12 ft. The rise at the peak is 12 ft × (6 ÷ 12) = 6 ft. The
          rafter length:
        </p>
        <WorkedSteps
          steps={[
            { label: "Run", value: "12 ft" },
            { label: "Rise", value: "6 ft" },
            { label: "Rafter² ", value: "12² + 6² = 144 + 36 = 180" },
            { label: "Rafter", value: "√180 ≈ 13.42 ft" },
            { label: "Plus overhang (12 in typical)", value: "≈ 14.42 ft" },
            { label: "Order 16-ft 2×8s", value: "next standard length" },
          ]}
        />
        <p>
          Framing crews keep rafter tables on the back of the speed square so
          they don&apos;t do this math on every job, but the tables are
          just the Pythagorean theorem precomputed for common pitches.
          Anything outside 4/12 to 12/12 and you&apos;re back to the
          calculator.
        </p>
      </Section>

      <Section id="shadow" title="10. Measuring the height of a tree (or a flagpole) from its shadow">
        <p>
          This one goes back to Thales in the 6th century BCE and still works.
          You can&apos;t climb a 60-foot oak with a tape measure, but you can
          measure its shadow on the ground and your own shadow at the same
          moment, then use similar triangles.
        </p>
        <p>
          Strictly this is the proportionality theorem, not Pythagoras. But
          to confirm the line-of-sight distance from your eye to the top
          of the tree, or to compute the angle the sun is at, you fall
          back to a² + b² = c². If the tree is 60 ft tall and casts a 36-ft
          shadow:
        </p>
        <Formula>
          line-of-sight = √(60² + 36²) = √(3600 + 1296) = √4896 ≈ 69.97 ft
        </Formula>
        <p>
          Solar engineers use this exact calculation to position panels
          without shading. The shadow length at the winter solstice
          (sun lowest) tells you how far apart to space rows so the
          back row isn&apos;t blocked at noon on December 21st. Same
          right triangle, same formula, billion-dollar industry.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Using a² + b² = c² on a triangle that isn&apos;t a right triangle.",
            fix: "The theorem only holds when one angle is exactly 90°. For other triangles you need the Law of Cosines: c² = a² + b² − 2ab·cos(C). The Pythagorean theorem is the special case where C = 90° and cos(90°) = 0.",
          },
          {
            mistake: "Forgetting to take the square root at the end.",
            fix: "If you computed 9 + 16 = 25, you&apos;ve found c², not c. The side length is √25 = 5. Easy to miss when the legs are clean numbers and the calculator screen still reads 25.",
          },
          {
            mistake: "Mixing units between the legs.",
            fix: "If one leg is in feet and the other in inches, the answer is nonsense. Convert both to the same unit before squaring. Inches × inches gives square inches; feet × feet gives square feet. Mixing them gives neither.",
          },
          {
            mistake: "Squaring then adding, instead of adding then squaring.",
            fix: "Order of operations: square each leg first, then add, then take the root. (a + b)² ≠ a² + b². On a 3-4 triangle, (3+4)² = 49, but 3² + 4² = 25. Wrong by almost 2x.",
          },
          {
            mistake: "Calling the hypotenuse a or b instead of c.",
            fix: "c is always the side opposite the right angle, which is always the longest side of the triangle. If you set up the equation with the hypotenuse as a leg, the answer comes out smaller than your longest side, which is geometrically impossible.",
          },
          {
            mistake: "Trusting the theorem on a curved surface.",
            fix: "Across a backyard, fine. Across a state, you need spherical trig because the earth is curved. The flat-plane formula gets less accurate as distance grows. Surveyors switch to spherical excess corrections past about a mile.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "OSHA 1926.1053: Portable Ladders Standard",
            href: "https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053",
          },
          {
            label: "GPS.gov: Official US Government GPS Accuracy Specification",
            href: "https://www.gps.gov/systems/gps/performance/accuracy/",
          },
          {
            label: "MLB Official Rules: Field Dimensions",
            href: "https://www.mlb.com/glossary/rules/field-dimensions",
          },
          {
            label: "Wolfram MathWorld: Pythagorean Theorem",
            href: "https://mathworld.wolfram.com/PythagoreanTheorem.html",
          },
          {
            label: "NIST: Plimpton 322 (Babylonian Pythagorean Triples)",
            href: "https://www.nist.gov/pml/owm/historic-context-units-measurement",
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
