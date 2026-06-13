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

const POST = getPostBySlug("how-to-measure-room-for-flooring")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "How much extra flooring should I buy?",
    answer:
      "Add 10% for straight-lay vinyl plank, laminate, and most carpet. Add 10 to 15% for tile and standard hardwood. Add 15 to 20% for diagonal layouts, herringbone, chevron, and sheet vinyl with pattern repeat. Add 5% on top of any of those for transitions and future repairs.",
  },
  {
    question: "Do I measure by square feet or square yards?",
    answer:
      "Tile, vinyl, laminate, and hardwood are sold by the square foot. Carpet is sold by the square yard in the US (1 sq yd = 9 sq ft) and almost always by the linear foot off a 12-foot roll. Convert carefully: a 12 by 15 ft room is 180 sq ft, which is 20 sq yd of carpet.",
  },
  {
    question: "How do I measure an L-shaped room?",
    answer:
      "Split it into two rectangles by drawing a line across the corner. Measure each rectangle separately, calculate its area, and add the two numbers. Never try to subtract a missing corner from the bounding box; you will get it wrong half the time.",
  },
  {
    question: "Should I subtract closets and doorways?",
    answer:
      "No. Always include closets if you want them floored, and never subtract the area under doorways. The flooring runs through the transition. Subtracting saves a few dollars on the order and costs you a return trip when you come up half a box short at the threshold.",
  },
  {
    question: "What is a waste factor and why does it matter?",
    answer:
      "A waste factor is the extra material you order to cover cuts, mistakes, pattern matching, and future repairs. Without it, a 200 sq ft room ordered at exactly 200 sq ft will come up short every single time. The cut-off scraps at walls and around obstacles eat 8 to 15% of every box.",
  },
  {
    question: "Do I need to measure the wall length too?",
    answer:
      "Yes, for baseboards, quarter round, and transition strips. Add the lengths of every wall the floor touches, plus every doorway opening. Order 10% extra on trim, same logic as the flooring itself.",
  },
  {
    question: "How long does it take to measure a room properly?",
    answer:
      "Five to ten minutes per room with a tape measure and a notepad. Add another five if it has bump-outs, an angled wall, or a fireplace hearth. A laser distance meter cuts that in half, but the bottleneck is sketching the floor plan, not the measurement itself.",
  },
  {
    question: "Should I measure before or after demo?",
    answer:
      "Measure twice: once before to estimate and budget, again after demo to confirm. Old flooring hides bowed walls, settled subfloor, and out-of-square corners. The post-demo measurement is the one you order against.",
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
        "https://www.nwfa.org/installation/",
        "https://www.tcnatile.com/products-and-services/handbook.html",
        "https://www.carpet-rug.org/testing/installation-standards/",
        "https://www.thespruce.com/calculate-floor-area-1822660",
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
          Length times width is wrong. It forgets transitions, waste factor, and
          L-shapes. Here&apos;s the four-step method that pros use to size a
          flooring order, the waste numbers by material, and the small list of
          oversights that send people back to the store on install day.
        </p>
      </header>

      <CTACard
        slug="square-footage-calculator"
        label="Skip the math"
        title="Use our Square Footage Calculator"
        body="If you'd rather plug in dimensions and get a number, the calculator handles rectangles, L-shapes, and triangles in one shot. The post below is for people who want to understand the waste factor and catch the mistakes before they cost a return trip to Floor & Decor."
      />

      <Section id="why-lxw-is-wrong" title="Why length times width is wrong">
        <p>
          A 12 by 15 ft bedroom is 180 sq ft. That is the number written on every
          measurement guide and the number that gets people short on install day.
          It assumes the room is a perfect rectangle, the walls are square, the
          installer makes zero cuts, and you will never need a single replacement
          plank for the next 20 years. None of that is true.
        </p>
        <p>
          The real order on a 180 sq ft bedroom with vinyl plank is closer to 200
          sq ft. With herringbone hardwood it&apos;s 215. With diagonal tile it&apos;s
          207. The room didn&apos;t change. The waste factor did, and the
          transition into the hallway did, and the closet you forgot to include
          did.
        </p>
        <p>
          Flooring is sold by the box, and boxes come in fixed coverage: a box of
          luxury vinyl plank covers 23.6 sq ft, a box of 12×24 porcelain tile
          covers 15.5. You can&apos;t buy 0.4 of a box. The math has to land you
          at a whole number of boxes with margin to spare.
        </p>
      </Section>

      <Section id="four-step-method" title="The four-step method pros use">
        <p>
          Every job, every room shape, every material. Same four steps. Skip none
          of them, especially the second.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Sketch the floor plan.</strong> Walk the room with a notepad
            before the tape comes out. Draw the outline. Mark every doorway,
            closet, bump-out, fireplace hearth, and column. The sketch tells you
            how many rectangles you have to measure, and it&apos;s the document
            you hand the installer.
          </li>
          <li>
            <strong>Split irregular shapes into rectangles.</strong> L-shape gets
            one line across the corner: two rectangles. T-shape gets two lines:
            three rectangles. A bump-out is its own rectangle. Measure each one,
            calculate its area in square feet, write the number on the sketch
            next to that rectangle.
          </li>
          <li>
            <strong>Add the rectangles, then add closets and transitions.</strong>
            {" "}Sum the square footage from step 2. Add the closets (they get
            flooring too). Add the area under every doorway and transition strip.
            Most people forget this. A 36-inch doorway with the flooring running
            through is roughly 6 sq ft you owe the installer.
          </li>
          <li>
            <strong>Multiply by the waste factor for your material.</strong>
            {" "}10% for straight-lay vinyl plank, laminate, and carpet. 10-15%
            for tile and standard hardwood. 15-20% for diagonal layouts,
            herringbone, and patterned sheet vinyl. Round up to the next whole
            box.
          </li>
        </ol>
        <p>
          The whole process takes ten minutes per room. The math is fourth-grade
          arithmetic. The discipline is doing all four steps every single time,
          even on a small bathroom that &quot;obviously&quot; needs one box.
        </p>
      </Section>

      <Section id="waste-factors" title="Waste factors by material (the numbers most people get wrong)">
        <p>
          The waste factor exists because cuts at the walls go in the trash, the
          last plank in a row gets ripped to fit, and pattern-matched materials
          throw away the bad-color tiles and the chipped corners. It&apos;s not
          a fudge factor; it&apos;s an accounting line for material that is
          guaranteed to be lost.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Material</th>
              <th>Layout</th>
              <th>Waste factor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Luxury vinyl plank (LVP / SPC)</td>
              <td>Straight, parallel to long wall</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Laminate</td>
              <td>Straight</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Sheet vinyl</td>
              <td>Solid color, no pattern</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Sheet vinyl</td>
              <td>Patterned (repeat &gt; 6 in)</td>
              <td>15-20%</td>
            </tr>
            <tr>
              <td>Porcelain or ceramic tile</td>
              <td>Straight grid</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Porcelain or ceramic tile</td>
              <td>Diagonal or running bond</td>
              <td>15%</td>
            </tr>
            <tr>
              <td>Hardwood (solid or engineered)</td>
              <td>Straight, random length</td>
              <td>10-12%</td>
            </tr>
            <tr>
              <td>Hardwood</td>
              <td>Herringbone or chevron</td>
              <td>15-20%</td>
            </tr>
            <tr>
              <td>Broadloom carpet</td>
              <td>Standard 12 ft roll</td>
              <td>10%</td>
            </tr>
            <tr>
              <td>Carpet tile</td>
              <td>Quarter-turn or ashlar</td>
              <td>5-8%</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          The National Wood Flooring Association recommends 5% over the measured
          area for straight-lay hardwood plus an additional allowance for
          pattern, room shape, and installer experience. Most pros land at 10-15%
          for the combined number. Tile installers working under the TCNA
          Handbook use the same range.
        </p>
        <p>
          One pattern across all materials: the more cuts the layout creates, the
          higher the waste. Diagonal anything starts at 15%. Herringbone, which
          throws away the entire end of every plank to make the V, hits 20% on
          rooms with lots of walls and corners.
        </p>
      </Section>

      <Section id="l-shape-example" title="Worked example: an L-shaped living room">
        <p>
          Most living rooms aren&apos;t simple rectangles. A typical American
          open-plan has a main rectangle plus a dining bump-out, with a closet
          tucked behind a wall. Here&apos;s the math for a real one.
        </p>
        <h3 className="md-title-large mt-6">The room</h3>
        <ul className="mt-2 list-disc pl-5">
          <li>Main rectangle: 14 ft × 18 ft</li>
          <li>Dining bump-out: 8 ft × 10 ft</li>
          <li>Coat closet (off the hallway): 2 ft × 4 ft</li>
          <li>Two doorways (kitchen, hallway): 36 in each</li>
          <li>Material: 7&quot; LVP, straight-lay, parallel to the long wall</li>
        </ul>
        <h3 className="md-title-large mt-6">The math</h3>
        <WorkedSteps
          steps={[
            { label: "Main rectangle", value: "14 × 18 = 252 sq ft" },
            { label: "Dining bump-out", value: "8 × 10 = 80 sq ft" },
            { label: "Closet", value: "2 × 4 = 8 sq ft" },
            { label: "Doorways (3 ft × 0.5 ft × 2)", value: "3 sq ft" },
            { label: "Subtotal floor area", value: "343 sq ft" },
            { label: "Waste factor (10% for straight LVP)", value: "343 × 1.10 = 377.3 sq ft" },
            { label: "Boxes needed (23.6 sq ft/box)", value: "377.3 ÷ 23.6 = 15.99 boxes" },
            { label: "Order", value: "16 boxes (377.6 sq ft total)" },
          ]}
        />
        <p>
          The room measured 332 sq ft on a quick walkthrough. The order is 16
          boxes covering almost 378 sq ft. That&apos;s 46 sq ft of overhead, and
          every square foot of it has a job: cuts at the walls, the rip down the
          last row, two boxes of leftover stock for the next time the dog runs
          into something and gouges a plank.
        </p>
        <p>
          If you&apos;re running tile instead, the same room sizing in our{" "}
          <Link
            href="/square-footage-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            square footage calculator
          </Link>
          {" "}feeds straight into the tile order; just swap the waste factor to
          15% if you&apos;re going diagonal.
        </p>
      </Section>

      <Section id="transitions" title="Transitions, thresholds, and the 5% nobody adds">
        <p>
          The number on the box says coverage area. It does not say anything
          about the strip of flooring you need at every doorway, the quarter-inch
          gap at every wall, or the four feet of flooring that runs under the
          refrigerator and stays hidden forever.
        </p>
        <p>
          Three places where the bare 10% waste factor isn&apos;t enough:
        </p>
        <ol className="mt-2 list-decimal pl-5 space-y-2">
          <li>
            <strong>Doorways with continuous flooring.</strong> If the same
            material runs from one room to the next under a door, add the
            doorway area (typically 3 ft × 0.5 ft = 1.5 sq ft, doubled for both
            sides of the jamb).
          </li>
          <li>
            <strong>Transition strips and reducers.</strong> Where the new floor
            meets a different material (tile to wood, wood to carpet), you need a
            T-molding or reducer. Order one per doorway, plus 6 inches of margin
            on each.
          </li>
          <li>
            <strong>Repair stock for the future.</strong> Set aside one full box
            and store it somewhere dry. Five years in, when a chair drag gouges a
            plank, that box is the only way to get a color-matched repair. Dye
            lots change. Same SKU, three years later, is a different shade.
          </li>
        </ol>
        <p>
          Add another 5% on top of the material waste factor for these three
          categories combined. So a tile job that started at 15% waste should be
          ordered at 20%. A herringbone hardwood at 20% becomes 25%. The cost is
          one extra box on most rooms; the upside is never being the person
          standing at the customer service desk asking if they have any more in
          stock.
        </p>
      </Section>

      <Section id="measuring-tools" title="Tools and technique: tape vs laser vs app">
        <p>
          A 25-foot tape measure, a notepad, and a calculator covers any room
          under 25 ft on a side. Most are. Laser distance meters are the upgrade
          when you do this regularly or when you&apos;re measuring a room that&apos;s
          out of square.
        </p>
        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Tape measure</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> any room under 25 ft, anyone who doesn&apos;t
              do this for a living.
            </li>
            <li>
              <strong>Technique:</strong> measure at floor level, hooked into the
              corner. Read the largest number, not the closest. Write it down
              immediately, before you walk to the next wall.
            </li>
            <li>
              <strong>Gotcha:</strong> baseboards. Measure above or behind them
              to get the actual wall-to-wall distance. The flooring runs to the
              wall, not to the baseboard face.
            </li>
          </ul>
        </Card>
        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Laser distance meter</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> rooms over 25 ft, rooms with obstacles
              in the middle, anyone measuring more than two rooms per year. The
              Bosch GLM 20 runs about $50 and is plenty for a homeowner.
            </li>
            <li>
              <strong>Technique:</strong> set the meter on the floor against one
              wall, aim at the opposite wall, read the number. Hold it steady.
              Don&apos;t aim at a baseboard.
            </li>
            <li>
              <strong>Gotcha:</strong> dark walls and matte black paint absorb
              the laser. Stick a Post-it on the target wall if the reading
              flickers.
            </li>
          </ul>
        </Card>
        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Phone app (Apple Measure, Magicplan)</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> sketching a quick floor plan before the
              real measurements. Magicplan&apos;s LiDAR scan on a newer iPhone
              gets within 2-3% on a clean room.
            </li>
            <li>
              <strong>Watch out:</strong> 2-3% off on a 200 sq ft room is 4 to 6
              sq ft. That&apos;s half a box. Always verify with a tape or laser
              before ordering.
            </li>
          </ul>
        </Card>
      </Section>

      <Section id="carpet-different" title="Carpet is measured differently and that trips people up">
        <p>
          Tile, vinyl, and wood are sold by the square foot. Carpet is sold by
          the square yard, and it&apos;s manufactured on 12-foot-wide rolls.
          Those two facts change the order math.
        </p>
        <p>
          A 13 ft × 15 ft room is 195 sq ft, or about 22 sq yd. But carpet rolls
          come in 12-ft width, which means the room needs a seam (the 13-ft
          dimension doesn&apos;t fit a 12-ft roll without joining two pieces).
          You order the full bolt width on the long dimension: 12 ft × 15 ft =
          180 sq ft of carpet, plus a 13 ft × 3 ft piece to fill the remainder,
          which is actually a 12 ft × 3 ft cut from a separate length. Total:
          about 24 sq yd ordered to floor 22 sq yd.
        </p>
        <p>
          The Carpet & Rug Institute installation standards (CRI-105 for
          residential) cover seam placement, direction of pile, and the standard
          12-ft width assumption. Any reputable carpet retailer figures the
          waste and seam allowance for you, but the principle is worth knowing:
          carpet waste is dictated by roll width, not by cut-off losses. A
          15-foot-wide room wastes nothing; a 13-foot-wide room wastes three
          feet on every linear yard.
        </p>
        <p>
          For carpet tile, the math reverts to the simple square-foot model with
          a 5-8% waste factor depending on layout. Quarter-turn (alternating tile
          direction) is at the low end; monolithic (all same direction) is at the
          higher end because pattern matching is stricter.
        </p>
      </Section>

      <Section id="when-to-add-extras" title="The 'while you're at it' material list">
        <p>
          The flooring is one line on the order. There are four more lines that
          most people forget, and they all have to be measured at the same time.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Underlayment.</strong> For floating floors (LVP, laminate,
            engineered hardwood without glue-down). 100 sq ft rolls. Same square
            footage as the flooring, no waste factor needed because it&apos;s cheap
            and there&apos;s no pattern.
          </li>
          <li>
            <strong>Baseboards or quarter round.</strong> Measure the linear
            feet of every wall the floor touches. Add 10%. If you&apos;re reusing
            old baseboards, you still need quarter round to cover the expansion
            gap at the wall.
          </li>
          <li>
            <strong>Transition strips.</strong> One per doorway, one per
            material change. Standard length is 36 to 78 inches. Count
            doorways, buy that many.
          </li>
          <li>
            <strong>Thinset, grout, and spacers (tile only).</strong> A bag of
            thinset covers 80-100 sq ft for 12&quot; tile, less for larger
            format. Grout coverage is on the back of the bag and varies by tile
            size and joint width. Round up by 10%.
          </li>
        </ul>
        <p>
          For solid hardwood, the{" "}
          <Link
            href="/board-foot-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            board foot calculator
          </Link>
          {" "}is the right tool if you&apos;re buying lumber by the board foot
          instead of pre-finished planks by the box. Most retail hardwood is
          sold by the square foot in cartons; rough lumber from a sawmill is
          board feet. Don&apos;t mix the two unit systems on the same order.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Measuring the bounding box of an L-shape and subtracting.",
            fix: "Split the L into two rectangles, measure each, add them. Subtracting from a bounding box requires both the bounding dimensions and the missing-corner dimensions to be exact; one bad reading throws the whole number off. Two-rectangle addition is self-checking.",
          },
          {
            mistake: "Forgetting to include closets and doorway transitions.",
            fix: "Walk the room once just to count closets and doorways. Add them to the sketch before any tape comes out. A 200 sq ft bedroom with two closets and a doorway is actually 215 sq ft of flooring once you include them.",
          },
          {
            mistake: "Using a 10% waste factor on diagonal or herringbone.",
            fix: "Diagonal layouts start at 15%. Herringbone hits 20% on rooms with lots of corners. The cuts thrown away to make the angle work are real material, and the box at the store knows nothing about your layout.",
          },
          {
            mistake: "Skipping repair stock to save one box.",
            fix: "Set aside one full box for future repairs. Dye lots change between manufacturing runs. The same SKU bought three years apart will not color-match. The cost of one box now is the cost of refloor a room later.",
          },
          {
            mistake: "Measuring once before demo and ordering from that.",
            fix: "Old flooring hides settled subfloor, bowed walls, and out-of-square corners. Measure once before demo for the budget estimate, again after demo for the actual order. The second number is the one that gets sent to the supplier.",
          },
          {
            mistake: "Trusting a phone app's room scan for the final order.",
            fix: "LiDAR scans are 2-3% off on a clean room and worse with obstacles. Two percent of 400 sq ft is 8 sq ft, which is half a box. Use the app to sketch the plan; verify every dimension with a tape or laser before ordering.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "National Wood Flooring Association: Installation Guidelines",
            href: "https://www.nwfa.org/installation/",
          },
          {
            label: "Tile Council of North America: Handbook for Ceramic, Glass, and Stone Tile Installation",
            href: "https://www.tcnatile.com/products-and-services/handbook.html",
          },
          {
            label: "Carpet and Rug Institute: Installation Standards (CRI-105 / CRI-104)",
            href: "https://www.carpet-rug.org/testing/installation-standards/",
          },
          {
            label: "The Spruce: How to Calculate Floor Area",
            href: "https://www.thespruce.com/calculate-floor-area-1822660",
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
