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

const POST = getPostBySlug("how-much-concrete-do-i-need")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "How much concrete is in one cubic yard?",
    answer:
      "One cubic yard equals 27 cubic feet. Poured at 4 inches thick, it covers about 80 square feet. At 6 inches it covers 54. A yard of standard mix weighs around 4,050 pounds, give or take depending on aggregate.",
  },
  {
    question: "How thick should a concrete slab be?",
    answer:
      "Patios and walkways: 4 inches. Garage floors and driveways: 4 to 6 inches over a compacted gravel base. Heavy-duty driveways (RVs, trucks) or anything in freeze-thaw country: 6 inches with rebar or fiber. Footings depend on the local frost line; check your building code.",
  },
  {
    question: "Bags or ready-mix: when does each make sense?",
    answer:
      "Under one cubic yard, bags from Home Depot or Lowe's are usually cheaper after delivery fees. Above a yard, call a ready-mix plant. The break-even is roughly 40 to 60 bags; past that you're mixing all day and your pour gets cold.",
  },
  {
    question: "How much extra concrete should I order?",
    answer:
      "Add 5% for a clean rectangular pour. Add 10% if the job has curves, multiple thicknesses, or you're new to this. Running short is way worse than running over. A second truck means a cold joint and another delivery fee.",
  },
  {
    question: "What PSI concrete should I use?",
    answer:
      "3,000 PSI handles most residential slabs and walkways. 4,000 PSI for driveways and anything exposed to road salt or freeze-thaw. 4,500 to 5,000 PSI for structural footings, columns, and pool decks. Bag mixes are usually labeled by PSI on the front.",
  },
  {
    question: "How many 60-pound bags equal a cubic yard?",
    answer:
      "About 60 bags of 60-pound mix make one cubic yard. For 80-pound bags, it's around 45. Manufacturers print the per-bag yield on the back. Quikrete 60-lb is 0.45 cu ft per bag.",
  },
  {
    question: "Do I need rebar or wire mesh?",
    answer:
      "For a 4-inch patio with stable subgrade and no vehicles, you can usually skip reinforcement and use fiber-mix or control joints instead. For driveways, garage floors, or anything thicker than 4 inches, add #3 or #4 rebar on 18-inch centers or 6×6 W2.9 mesh.",
  },
  {
    question: "What's the difference between concrete and cement?",
    answer:
      "Cement is the binder, the gray powder. Concrete is cement plus sand, gravel, and water. Ordering cement when you mean concrete is the most common mix-up at the parts counter, and it'll cost you a day.",
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
        "https://www.cement.org/learn",
        "https://www.concretenetwork.com/concrete/howmuch/calculator.htm",
        "https://www.concrete.org/store/productdetail.aspx?ItemID=31819",
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
          Most botched pours start with bad math. Here&apos;s the one formula,
          three worked examples (patio, garage slab, footing), the waste factor
          every pro adds, and the small list of mistakes that cost contractors a
          second truck.
        </p>
      </header>

      <CTACard
        slug="cubic-yard-calculator"
        label="Skip the math"
        title="Use our Cubic Yard Calculator"
        body="If you'd rather just plug in numbers and get an answer, the calculator does the same math this post walks through. The post is here for the people who want to understand what they're ordering, and catch the cost-bleed mistakes before they happen."
      />

      <Section id="the-formula" title="The one formula">
        <p>
          Concrete is sold by volume, almost always cubic yards in the US, cubic
          meters elsewhere. Every job, no matter the shape, comes down to:
        </p>
        <Formula>
          cubic yards = (length<sub>ft</sub> × width<sub>ft</sub> × thickness
          <sub>in</sub> ÷ 12) ÷ 27
        </Formula>
        <p>
          That&apos;s it. Length times width gives you square feet. Multiply by
          thickness in feet (which is why you divide inches by 12). Divide by 27
          because a cubic yard is 27 cubic feet. Memorize that last number and
          you&apos;ll spot a bad estimate from across a parking lot.
        </p>
      </Section>

      <Section id="step-by-step" title="Doing it without a calculator">
        <p>Four steps. Skip none of them, especially step 1.</p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Measure twice.</strong> Walk the job with a tape and write
            numbers down. Eyeballing a slab is how 200-square-foot patios become
            240-square-foot patios on pour day. If the shape isn&apos;t a clean
            rectangle, break it into rectangles and add them up.
          </li>
          <li>
            <strong>Decide the thickness.</strong> Patios, walkways, and shed
            pads: 4 inches. Driveways and garage floors: 4 to 6, with 6 being
            standard if you expect trucks or freeze-thaw cycles. Footings
            depend on your frost line and the local building code; call the
            inspector before you dig.
          </li>
          <li>
            <strong>Plug into the formula.</strong> Length × width ×
            (thickness ÷ 12) ÷ 27. The answer is in cubic yards. Round up to the
            nearest quarter yard, since that&apos;s how the plant sells it.
          </li>
          <li>
            <strong>Add a waste factor.</strong> 5% for a simple rectangle on a
            clean subgrade. 10% if the formwork has angles, the grade is uneven,
            or it&apos;s your first big pour. We&apos;ll talk about why this
            matters more than people think.
          </li>
        </ol>
      </Section>

      <Section id="examples" title="Three worked examples">
        <p>
          Same formula, different jobs. The middle one is where most homeowners
          underestimate.
        </p>

        <h3 className="md-title-large mt-6">1. A 12 × 12 ft patio at 4 inches</h3>
        <WorkedSteps
          steps={[
            { label: "Area", value: "12 × 12 = 144 sq ft" },
            { label: "Volume in cubic feet", value: "144 × (4 ÷ 12) = 48 ft³" },
            { label: "Volume in cubic yards", value: "48 ÷ 27 = 1.78 yd³" },
            { label: "With 5% waste", value: "1.78 × 1.05 ≈ 1.87 yd³" },
            { label: "What to order", value: "2.00 yd³ (round up to plant minimum)" },
          ]}
        />
        <p>
          The plant won&apos;t deliver 1.87. Most have a 1-yard minimum charge
          and round in 0.25 increments. Ask for 2 yards; the extra is cheap
          insurance and the truck driver will appreciate not standing around
          waiting.
        </p>

        <h3 className="md-title-large mt-10">2. A 24 × 24 ft garage slab at 6 inches</h3>
        <WorkedSteps
          steps={[
            { label: "Area", value: "24 × 24 = 576 sq ft" },
            { label: "Volume in cubic feet", value: "576 × (6 ÷ 12) = 288 ft³" },
            { label: "Volume in cubic yards", value: "288 ÷ 27 = 10.67 yd³" },
            { label: "With 5% waste", value: "10.67 × 1.05 ≈ 11.20 yd³" },
            { label: "What to order", value: "11.25 yd³" },
          ]}
        />
        <p>
          A 24-foot square at 6 inches is more than ten times the patio. This is
          where back-of-the-envelope math fails people. They double the room
          dimensions and assume the concrete doubles. It doesn&apos;t. Area
          scales with the square of the side, volume with the cube once
          thickness moves too.
        </p>

        <h3 className="md-title-large mt-10">3. A 36-inch round footing, 4 ft deep</h3>
        <p>
          Footings are circles, not rectangles. The formula gets one extra step:
          area equals π × r². Diameter 36 inches means radius 18 inches, or 1.5
          ft.
        </p>
        <WorkedSteps
          steps={[
            { label: "Radius", value: "18 in = 1.5 ft" },
            { label: "Area", value: "π × 1.5² ≈ 7.07 sq ft" },
            { label: "Volume in cubic feet", value: "7.07 × 4 = 28.27 ft³" },
            { label: "Volume in cubic yards", value: "28.27 ÷ 27 ≈ 1.05 yd³" },
            { label: "With 10% waste (irregular)", value: "1.05 × 1.10 ≈ 1.15 yd³" },
            { label: "What to order", value: "1.25 yd³ or 26 bags of 80-lb mix" },
          ]}
        />
        <p>
          A single pier footing rarely justifies a ready-mix truck. Bags + a
          rented mixer is usually the right call here, unless you have several
          piers on the same day and the cumulative volume crosses a yard.
        </p>
      </Section>

      <Section id="waste-factor" title="Why the waste factor isn't optional">
        <p>
          Concrete shrinks. The drum spins on the way over, hydration starts the
          second water hits the mix, and you lose volume to consolidation when
          the workers run a screed across it. A nominal yard of mix delivered
          and finished covers a little less than the calculator says.
        </p>
        <p>
          That&apos;s before site issues: a soft spot in the subgrade that
          swallows extra material, a corner where the form bulged a quarter inch,
          a wheelbarrow tip that doesn&apos;t make it back into the slab.
        </p>
        <p>
          Five percent absorbs all of that on a normal job. Ten percent is the
          right move when:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>The slab has bump-outs, curves, or two different thicknesses.</li>
          <li>You haven&apos;t poured this volume before.</li>
          <li>You&apos;re using bags and won&apos;t see leftovers as a problem.</li>
          <li>The forecast says rain. Finishers rush, and rushed work runs short.</li>
        </ul>
        <p>
          Coming up half a yard short on a pour costs more than ordering an
          extra full yard. The plant won&apos;t send a half-truck for an
          afterthought delivery, and you&apos;ll get charged a minimum + a cold
          joint where the new mix meets the cured concrete.
        </p>
      </Section>

      <Section id="bags-vs-ready-mix" title="Bags vs ready-mix: picking your delivery method">
        <p>
          Two ways to get concrete to your site. The break-even is around one
          cubic yard, but the right answer depends on more than volume.
        </p>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Bag mix (Quikrete, Sakrete, etc.)</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> footings, small slabs, repairs, anything
              under 1 cubic yard.
            </li>
            <li>
              <strong>Math:</strong> roughly 60 bags of 60-lb mix per yard, or 45
              bags of 80-lb. Check the back of the bag. Manufacturer prints the
              exact yield.
            </li>
            <li>
              <strong>Watch out:</strong> bags weigh a lot. 45 × 80 = 3,600 lb of
              material to move by hand. Rent a powered mixer, or your back will
              file grievances for a week.
            </li>
          </ul>
        </Card>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Ready-mix (concrete truck)</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              <strong>Best for:</strong> slabs, driveways, garages, footings 1
              yard and up.
            </li>
            <li>
              <strong>Minimums:</strong> most plants charge for at least 1 yard,
              some 2. Expect a short-load fee under 5 yards.
            </li>
            <li>
              <strong>Time clock:</strong> the truck gives you 5 to 7 minutes per
              cubic yard on site before the driver starts charging waiting time.
              Be ready when it arrives.
            </li>
            <li>
              <strong>Pumps and chutes:</strong> if the pour is more than 20 feet
              from the curb or uphill, ask about a pump. Wheelbarrowing 6 yards
              is a long, hot afternoon.
            </li>
          </ul>
        </Card>
      </Section>

      <Section id="psi" title="Picking the strength (PSI)">
        <p>
          Concrete comes in strength grades: pounds per square inch the cured
          slab can take before it fails. The plant or the bag asks what PSI you
          want.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Use</th>
              <th>PSI</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Patios, walkways, shed pads</td>
              <td>3,000</td>
              <td>Light loads, no vehicles. Cheapest mix that meets code.</td>
            </tr>
            <tr>
              <td>Driveways, garage floors</td>
              <td>3,500 – 4,000</td>
              <td>Cars, trucks, freeze-thaw cycles in northern climates.</td>
            </tr>
            <tr>
              <td>Pool decks, exterior in salt country</td>
              <td>4,000 – 4,500</td>
              <td>Higher density resists chloride and surface scaling.</td>
            </tr>
            <tr>
              <td>Structural footings, columns, retaining walls</td>
              <td>4,500 – 5,000</td>
              <td>Code minimum is usually 3,000, but 4,500+ is cheap insurance.</td>
            </tr>
            <tr>
              <td>Commercial floors, industrial slabs</td>
              <td>5,000+</td>
              <td>Forklifts, racking, heavy vibration. Spec&apos;d by an engineer.</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Bag mixes are labeled on the front. Quikrete &quot;5,000&quot; is a
          high-strength mix, the standard yellow bag is closer to 4,000 cured at
          28 days. ACI 318 (the American Concrete Institute&apos;s structural
          code) is the reference for anything load-bearing.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Treating thickness as feet when it&apos;s inches.",
            fix: "Always divide thickness in inches by 12 before multiplying. A 4-inch slab is 0.33 feet thick, not 4 feet. That one mix-up has ordered 12× too much concrete more than once.",
          },
          {
            mistake: "Skipping the waste factor on a small pour.",
            fix: "Especially on small pours. A 1.5-yard slab without waste becomes a 1.4-yard slab after consolidation, and now you&apos;re short. Add 5% minimum, every job.",
          },
          {
            mistake: "Confusing area with volume.",
            fix: "Square footage tells you how much surface the slab covers. Cubic yards tells you how much concrete fills it. The plant charges by volume. Get that number right.",
          },
          {
            mistake: "Mixing slab thickness with footing depth.",
            fix: "A 4-inch patio sits on a 4-inch slab. A footing might be 12 to 24 inches deep depending on frost line. Don&apos;t average them; calculate each section separately and add.",
          },
          {
            mistake: "Ordering by what the form holds, not what the slab needs.",
            fix: "Forms overflow if the slab settles, but a slab that sits 3/8 of an inch lower than the form top is fine. Order for the design thickness plus waste, not a brimming form.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Portland Cement Association: How concrete is made",
            href: "https://www.cement.org/learn",
          },
          {
            label: "ConcreteNetwork.com: Concrete coverage chart",
            href: "https://www.concretenetwork.com/concrete/howmuch/calculator.htm",
          },
          {
            label: "American Concrete Institute: ACI 318 Building Code",
            href: "https://www.concrete.org/store/productdetail.aspx?ItemID=31819",
          },
          {
            label: "Quikrete: Bag yield reference",
            href: "https://www.quikrete.com/productlines/concretemix.asp",
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
