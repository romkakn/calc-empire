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

const POST = getPostBySlug("how-much-mulch-do-i-need")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "How many cubic feet are in a cubic yard of mulch?",
    answer:
      "27 cubic feet. That&apos;s the conversion every landscaper memorizes. A 2-cu-ft bag therefore takes 13.5 bags to equal one bulk yard, and a 3-cu-ft bag takes 9. The bag size is printed on the front; don&apos;t assume.",
  },
  {
    question: "How deep should mulch be?",
    answer:
      "2 inches for established beds where roots are already happy. 3 inches for a new install or where weeds are the main problem. 4 inches only for aggressive weed suppression on bare soil, and never against tree trunks. Past 4 inches you start suffocating roots.",
  },
  {
    question: "How much area does one cubic yard of mulch cover?",
    answer:
      "At 2 inches deep, one cubic yard covers about 162 square feet. At 3 inches, 108 sq ft. At 4 inches, 81 sq ft. The math is simple: 324 divided by depth-in-inches gives you sq ft per yard.",
  },
  {
    question: "Bulk or bagged: which is cheaper?",
    answer:
      "Bulk wins past roughly 3 cubic yards once you factor in delivery. Bagged mulch runs $3 to $6 per 2-cu-ft bag at Home Depot, which is $40 to $80 per yard equivalent. Bulk delivered runs $30 to $50 per yard depending on region. The break-even moves if you can haul it yourself.",
  },
  {
    question: "When is the best time to mulch?",
    answer:
      "Mid to late spring after the soil has warmed past 60°F. Mulching too early on cold soil delays root growth. A second light top-up in fall protects roots through freeze-thaw. Skip summer mulching during drought; dry mulch wicks moisture out of the soil.",
  },
  {
    question: "Do I need to remove old mulch before adding new?",
    answer:
      "No, in most cases. Rake the old layer flat, break up any crust, and add enough new mulch to bring total depth back to 2 or 3 inches. Only strip and replace if the bed has fungal issues or the buildup already passes 4 inches.",
  },
  {
    question: "Does mulch color matter beyond looks?",
    answer:
      "Mostly cosmetic, but dyed mulches use iron oxide (red) or carbon black (black) bound to recycled wood. The dyes are safe per the Mulch and Soil Council&apos;s certification program. Natural hardwood and pine bark decompose faster and feed the soil; dyed wood lasts longer but adds less nutrition.",
  },
  {
    question: "Why shouldn&apos;t mulch touch tree trunks?",
    answer:
      "A mulch volcano traps moisture against the bark, invites rot and pests, and encourages roots to grow upward into the mulch instead of down into soil. Keep mulch 3 to 6 inches clear of any trunk. The USDA Forest Service has been hammering this point in extension publications for two decades.",
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
        "https://www.fs.usda.gov/managing-land/urban-forests/ctcc",
        "https://extension.umn.edu/planting-and-growing-guides/mulching-landscape",
        "https://www.mulchandsoilcouncil.org/ProductCert/CertProgram.html",
        "https://extension.psu.edu/mulching-landscape-plantings",
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
          2 to 4 inches deep, by the cubic yard &mdash; except when you mean
          cubic feet, and except when the bed is curved. Four steps and a quick
          conversion table get you from a flower-bed sketch to a number the
          landscape-supply yard will actually load on the truck. No wheelbarrow
          guessing.
        </p>
      </header>

      <CTACard
        slug="mulch-calculator"
        label="Skip the math"
        title="Use our Mulch Calculator"
        body="If you&apos;d rather plug in bed dimensions and get a yard count plus a bag count, the calculator does this post&apos;s math in one click. The post is here for the people who want to understand depth choices, the bulk-vs-bag break-even, and why a 3-inch layer is almost never what they actually need."
      />

      <Section id="the-formula" title="The one formula">
        <p>
          Mulch is sold by volume. Bulk yards at landscape-supply yards, cubic
          feet in bags at the big-box store. Every bed, no matter the shape,
          comes down to the same equation that drives our{" "}
          <Link href="/cubic-yard-calculator" className="text-[var(--md-sys-color-primary)] underline underline-offset-4">
            cubic yard calculator
          </Link>
          :
        </p>
        <Formula>
          cubic yards = (length<sub>ft</sub> × width<sub>ft</sub> × depth
          <sub>in</sub> ÷ 12) ÷ 27
        </Formula>
        <p>
          Length times width gives square feet. Multiply by depth in feet (so
          divide inches by 12). Divide by 27 because a cubic yard is 27 cubic
          feet. Keep that 27 in your head and you&apos;ll catch a bad estimate
          from across the driveway.
        </p>
      </Section>

      <Section id="step-by-step" title="Four steps, no calculator">
        <p>Same drill every time. Step one is the one people skip.</p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Measure the bed.</strong> Walk it with a tape. For curved
            beds, break the shape into rectangles and half-circles, or pace the
            longest run and the average width. A 12-foot bed that&apos;s really
            14 feet on pour day is a 17% miss before you&apos;ve done any math.
          </li>
          <li>
            <strong>Pick the depth.</strong> 2 inches on established beds with
            healthy plants. 3 inches on a fresh install or where weeds need
            knocking back. 4 inches for aggressive weed suppression on bare
            soil. Past 4 inches is a fungal-disease story, not a gardening one.
          </li>
          <li>
            <strong>Run the formula.</strong> Length × width × (depth ÷ 12) ÷
            27. Answer is in cubic yards. Round up to the nearest quarter yard
            because that&apos;s how bulk yards sell.
          </li>
          <li>
            <strong>Convert to bags if you&apos;re going bagged.</strong> A
            2-cu-ft bag takes 13.5 to make a yard. A 3-cu-ft bag takes 9. Look
            at the bag size before you do the multiplication; the front of the
            bag tells you everything.
          </li>
        </ol>
      </Section>

      <Section id="examples" title="Three worked examples">
        <p>
          Same formula, three real beds. The third one is where most homeowners
          over-order by a full yard.
        </p>

        <h3 className="md-title-large mt-6">1. A 10 × 4 ft foundation bed at 3 inches</h3>
        <WorkedSteps
          steps={[
            { label: "Area", value: "10 × 4 = 40 sq ft" },
            { label: "Volume in cubic feet", value: "40 × (3 ÷ 12) = 10 ft³" },
            { label: "Volume in cubic yards", value: "10 ÷ 27 ≈ 0.37 yd³" },
            { label: "In 2-cu-ft bags", value: "10 ÷ 2 = 5 bags" },
            { label: "What to order", value: "5 bags (or skip the delivery fee)" },
          ]}
        />
        <p>
          Half a yard isn&apos;t worth a delivery charge. At five bags this is
          one trip to the garden center, $20 to $30, done by lunch. The bulk
          break-even doesn&apos;t arrive until you&apos;re past 3 yards or so.
        </p>

        <h3 className="md-title-large mt-10">2. A 30 × 8 ft perennial border at 3 inches</h3>
        <WorkedSteps
          steps={[
            { label: "Area", value: "30 × 8 = 240 sq ft" },
            { label: "Volume in cubic feet", value: "240 × (3 ÷ 12) = 60 ft³" },
            { label: "Volume in cubic yards", value: "60 ÷ 27 ≈ 2.22 yd³" },
            { label: "In 2-cu-ft bags", value: "60 ÷ 2 = 30 bags" },
            { label: "What to order", value: "2.25 yd³ bulk OR 30 bags" },
          ]}
        />
        <p>
          This is the gray zone. 30 bags at $5 each is $150 plus your trunk
          smells like cedar for a week. 2.25 yards bulk delivered is $75 to
          $115 in most markets, but you need a wheelbarrow and a Saturday. The
          bulk wins on price if you have the equipment, the bags win on
          convenience.
        </p>

        <h3 className="md-title-large mt-10">3. A curved bed around a 20-ft circular patio, 4 ft wide, at 3 inches</h3>
        <p>
          Annular ring (donut shape). Outer radius 14 ft (patio radius 10 + bed
          width 4), inner radius 10 ft. Area is π × (R² − r²).
        </p>
        <WorkedSteps
          steps={[
            { label: "Outer area", value: "π × 14² ≈ 615.75 sq ft" },
            { label: "Inner area", value: "π × 10² ≈ 314.16 sq ft" },
            { label: "Ring area", value: "615.75 − 314.16 ≈ 301.59 sq ft" },
            { label: "Volume in cubic feet", value: "301.59 × (3 ÷ 12) ≈ 75.40 ft³" },
            { label: "Volume in cubic yards", value: "75.40 ÷ 27 ≈ 2.79 yd³" },
            { label: "What to order", value: "3.00 yd³ bulk delivered" },
          ]}
        />
        <p>
          Treating a curved bed as a 28 × 4 rectangle would give you 112 sq ft
          and 1 yard. The real answer is closer to 3. That&apos;s a triple
          undercount, and it&apos;s the most common bagged-mulch nightmare:
          driving back to the store at 6pm because the bed swallowed everything
          you bought.
        </p>
      </Section>

      <Section id="depth" title="How deep, really">
        <p>
          More mulch is not better mulch. Past 3 inches you start trading
          benefits for problems, and past 4 you&apos;re creating an environment
          plants actively dislike. The University of Minnesota Extension and
          Penn State Extension both publish the same depth guidance, and it
          hasn&apos;t shifted in 20 years.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Use case</th>
              <th>Depth</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Established perennial or shrub bed</td>
              <td>2 in</td>
              <td>Roots are happy. Just enough to retain moisture and look finished.</td>
            </tr>
            <tr>
              <td>New install, fresh soil</td>
              <td>3 in</td>
              <td>Weed seeds in the soil need light blocked. Roots aren&apos;t established yet.</td>
            </tr>
            <tr>
              <td>Aggressive weed bed, bare soil</td>
              <td>4 in</td>
              <td>Knocks out crabgrass, bindweed, the persistent stuff. Top of the safe range.</td>
            </tr>
            <tr>
              <td>Around tree trunks</td>
              <td>2 in, kept 3-6 in away from bark</td>
              <td>Mulch volcanoes rot the cambium. Donut shape only.</td>
            </tr>
            <tr>
              <td>Vegetable garden paths</td>
              <td>3-4 in straw or wood chip</td>
              <td>Compresses with foot traffic, suppresses weeds between rows.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          USDA Forest Service has been publishing extension warnings about
          mulch volcanoes since the early 2000s. The damage is real and
          permanent: trees can take 5 to 10 years to show decline, by which
          point the trunk has rotted at ground line.
        </p>
      </Section>

      <Section id="conversion-table" title="Coverage at a glance">
        <p>
          Print this and stick it inside the shed door. Same arithmetic, every
          time:
        </p>
        <Formula>
          square feet per cubic yard = 324 ÷ depth<sub>in</sub>
        </Formula>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Depth</th>
              <th>Sq ft per cu yd</th>
              <th>Sq ft per 2-cu-ft bag</th>
              <th>Bags per yard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 inch</td>
              <td>324</td>
              <td>24</td>
              <td>13.5</td>
            </tr>
            <tr>
              <td>2 inches</td>
              <td>162</td>
              <td>12</td>
              <td>13.5</td>
            </tr>
            <tr>
              <td>3 inches</td>
              <td>108</td>
              <td>8</td>
              <td>13.5</td>
            </tr>
            <tr>
              <td>4 inches</td>
              <td>81</td>
              <td>6</td>
              <td>13.5</td>
            </tr>
          </tbody>
        </table>
        <p>
          The bags-per-yard column is always 13.5 for 2-cu-ft bags because the
          bag size doesn&apos;t change with depth, only the area each bag
          covers. Got 3-cu-ft bags instead? Divide 27 by 3 and you get 9 bags
          per yard.
        </p>
      </Section>

      <Section id="bulk-vs-bag" title="Bulk vs bagged: the break-even">
        <p>
          Two ways to get mulch home. The right answer depends on the volume,
          your vehicle, and whether you can stomach a delivery fee.
        </p>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Bagged (Home Depot, Lowe&apos;s, garden centers)</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> jobs under 3 cubic yards, or anyone
              without truck access.
            </li>
            <li>
              <strong>Price:</strong> $3 to $6 per 2-cu-ft bag depending on
              region and brand. That works out to $40 to $80 per cubic yard,
              before tax.
            </li>
            <li>
              <strong>Pros:</strong> color and type consistency, no delivery
              window, easy to handle.
            </li>
            <li>
              <strong>Cons:</strong> 13.5 bags per yard means a small bed eats
              a whole car trunk. Plastic bag waste piles up.
            </li>
          </ul>
        </Card>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Bulk (landscape-supply yard)</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> 3 cubic yards and up, anyone with a
              pickup or a willing neighbor.
            </li>
            <li>
              <strong>Price:</strong> $30 to $50 per yard for standard hardwood
              or pine. Delivery is $50 to $100 within 15 miles, often waived
              past 5 yards.
            </li>
            <li>
              <strong>Pros:</strong> 30-50% cheaper per yard. No plastic. You
              can order exactly what you need.
            </li>
            <li>
              <strong>Cons:</strong> dumped in a pile on the driveway. Plan a
              tarp underneath and a clear Saturday with a wheelbarrow.
            </li>
          </ul>
        </Card>

        <p className="mt-3">
          Quick break-even check at $5/bag and $40/yard delivered: bagged costs
          $5 × 13.5 = $67.50 per yard, plus your gas. Bulk costs $40 + (delivery
          fee split across your order). At 3 yards with a $75 delivery, bulk is
          ($120 + $75) ÷ 3 = $65 per yard. They&apos;re tied. Order 4+ yards
          and bulk pulls clearly ahead. If you can pick up bulk yourself in a
          pickup, the break-even drops to 1 yard.
        </p>
      </Section>

      <Section id="types" title="Picking the type">
        <p>
          The bag color isn&apos;t the only choice. Mulch type changes how long
          it lasts, what it does to your soil, and what it costs. If you&apos;re
          also pricing out a base layer of stone before mulch, our{" "}
          <Link href="/gravel-calculator" className="text-[var(--md-sys-color-primary)] underline underline-offset-4">
            gravel calculator
          </Link>{" "}
          handles that math the same way.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Type</th>
              <th>Lifespan</th>
              <th>Best for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Shredded hardwood</td>
              <td>1-2 years</td>
              <td>General-purpose beds. Mats well, stays put on slopes.</td>
            </tr>
            <tr>
              <td>Pine bark nuggets</td>
              <td>2-3 years</td>
              <td>Acid-loving plants (azaleas, rhododendrons), slower decay.</td>
            </tr>
            <tr>
              <td>Cedar</td>
              <td>2-4 years</td>
              <td>Insect repellence, light color, but pricier.</td>
            </tr>
            <tr>
              <td>Dyed wood chips</td>
              <td>1-2 years (color)</td>
              <td>Cosmetic consistency. Iron-oxide and carbon-black dyes are MSC-certified.</td>
            </tr>
            <tr>
              <td>Cocoa hulls</td>
              <td>1 year</td>
              <td>High-end beds. Avoid if you have dogs &mdash; theobromine is toxic.</td>
            </tr>
            <tr>
              <td>Straw</td>
              <td>1 growing season</td>
              <td>Vegetable gardens, new-seeded lawns, erosion control.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Avoid &quot;rubber mulch&quot; for anything food-adjacent. EPA studies
          on tire-derived rubber have flagged zinc and PAH leaching as a real
          concern in playground applications, and the data isn&apos;t any
          better for vegetable beds.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Confusing cubic feet with cubic yards.",
            fix: "27 cubic feet equals 1 cubic yard. A bag is cubic feet. Bulk delivery is cubic yards. Order 5 yards when you needed 5 cubic feet and the entire driveway disappears under a mountain of bark.",
          },
          {
            mistake: "Building mulch volcanoes against tree trunks.",
            fix: "Keep mulch 3 to 6 inches away from any trunk. The donut shape is right. The volcano is killing the tree slowly and you won&apos;t notice until year 7.",
          },
          {
            mistake: "Mulching too deep year after year.",
            fix: "If last year&apos;s layer is still 2 inches deep, add 1 inch this year, not 3. Total depth should sit at 2 to 3 inches. Past 4 inches you&apos;re suffocating roots and creating perfect conditions for fungal mats.",
          },
          {
            mistake: "Treating a curved bed as a rectangle.",
            fix: "An annular ring around a patio has way more area than the longest dimension suggests. Use π × (R² − r²) for rings, or break complex shapes into rectangles and half-circles. The undercount on curved beds is typically 30-50%.",
          },
          {
            mistake: "Buying bagged for a 5-yard job.",
            fix: "That&apos;s 67.5 bags. At $5 each, $337. The same volume bulk-delivered is $150 to $200. The only reason to buy 67 bags is if you literally cannot get a bulk delivery to the property.",
          },
          {
            mistake: "Mulching too early in spring.",
            fix: "Wait until soil temperature passes 60°F. Cold mulched soil delays root growth for weeks. The Penn State Extension data is unambiguous on this.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "USDA Forest Service: Urban tree care and mulch guidance",
            href: "https://www.fs.usda.gov/managing-land/urban-forests/ctcc",
          },
          {
            label: "University of Minnesota Extension: Mulching the landscape",
            href: "https://extension.umn.edu/planting-and-growing-guides/mulching-landscape",
          },
          {
            label: "Penn State Extension: Mulching landscape plantings",
            href: "https://extension.psu.edu/mulching-landscape-plantings",
          },
          {
            label: "Mulch and Soil Council: Product certification program",
            href: "https://www.mulchandsoilcouncil.org/ProductCert/CertProgram.html",
          },
          {
            label: "EPA: Tire crumb rubber research and findings",
            href: "https://www.epa.gov/chemical-research/federal-research-recycled-tire-crumb-used-playing-fields",
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
