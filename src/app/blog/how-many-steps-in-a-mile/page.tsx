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

const POST = getPostBySlug("how-many-steps-in-a-mile")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Is 2000 steps actually a mile?",
    answer:
      "2000 is the rounded average that fitness trackers use as a default. The real range runs from about 1,500 steps a mile for a 6&apos;4&quot; runner to 2,500 for a 5&apos;0&quot; casual walker. Your number lives somewhere in that band, not on the average.",
  },
  {
    question: "What is the stride length formula?",
    answer:
      "The widely-cited estimate from the ACSM is height × 0.413 for women and height × 0.415 for men, giving stride length in the same units as your height. A 5&apos;6&quot; (66 in) woman has roughly a 27.3-inch stride. Divide 63,360 inches in a mile by your stride to get steps per mile.",
  },
  {
    question: "Why do walking and running give different step counts?",
    answer:
      "Running stretches your stride. A walking stride averages 2.2 ft for women and 2.5 ft for men; running pushes that to 3.0 to 4.5 ft depending on pace. Run a mile and you&apos;ll log roughly 1,400 to 1,700 steps; walk the same mile and you&apos;ll log 2,000 to 2,400.",
  },
  {
    question: "How accurate is my Fitbit or Apple Watch step count?",
    answer:
      "Wrist-worn pedometers run between 90 and 97 percent accurate for walking on flat ground, per a 2017 JMIR study. They overcount when you cook, fold laundry, or gesture a lot, and undercount when you push a stroller or hold a coffee. GPS distance is usually more reliable than the step-to-mile conversion the watch does internally.",
  },
  {
    question: "How many steps in a 5K?",
    answer:
      "A 5K is 3.1 miles. At 2,000 steps a mile (walking pace) that&apos;s about 6,200 steps. At 1,500 steps a mile (running pace for a tall runner) it drops to roughly 4,650. Plug your own height into the stride formula for a tighter number.",
  },
  {
    question: "Does stride length change with age?",
    answer:
      "Yes. A 2011 study in Gait &amp; Posture found stride length drops about 5 to 7 percent between ages 60 and 80, even in healthy adults. That means an 80-year-old logs 100 to 140 more steps per mile than they did at 60, walking the same distance.",
  },
  {
    question: "Should I aim for 10,000 steps a day?",
    answer:
      "10,000 was a 1965 Japanese marketing slogan for the Manpo-kei pedometer, not a clinical target. A 2019 JAMA Internal Medicine study by I-Min Lee found mortality benefits plateau around 7,500 steps for older women. Aim for consistent daily movement over a magic number.",
  },
  {
    question: "How do I count steps without a tracker?",
    answer:
      "Walk a measured 100 feet, count your steps, then divide 5,280 (feet in a mile) by your result. That gives you steps per mile, calibrated to your actual stride at your actual pace. Pros use this on treadmill setup to dial in cadence.",
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
        "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines",
        "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2734709",
        "https://www.jmir.org/2017/4/e125/",
        "https://www.sciencedirect.com/science/article/abs/pii/S0966636211000063",
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
          Health · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          The 2,000-step average hides a 400-step range. A 5&apos;2&quot; office
          worker pacing a phone call and a 6&apos;1&quot; runner finishing a 5K
          do not share the same number, and treating them like they do throws
          off every mileage estimate your watch shows. Here&apos;s the actual
          formula, the walk-vs-run split, and how to calibrate it to your body
          in under three minutes.
        </p>
      </header>

      <CTACard
        slug="steps-to-miles-calculator"
        label="Skip the math"
        title="Use our Steps to Miles Calculator"
        body="Plug in your height, sex, and whether you walked or ran, and the calculator returns your personalized steps-per-mile number. The post below explains where every part of that formula comes from, so you can sanity-check the watch on your wrist."
      />

      <Section id="the-2000-myth" title="Why 2,000 is wrong for almost everyone">
        <p>
          2,000 steps per mile is the default your Fitbit, Apple Watch, and
          Garmin all ship with out of the box. It&apos;s a fine average. It is
          also wrong for almost every individual user.
        </p>
        <p>
          The American College of Sports Medicine puts the realistic walking
          range at 1,900 to 2,400 steps per mile, with running between 1,400 and
          1,700. That&apos;s a swing of a full kilometer per workout if you
          guess wrong. A short woman walking at a moderate pace logs roughly 25
          percent more steps per mile than a tall man jogging.
        </p>
        <p>
          Two variables drive almost all of it: how long your legs are and how
          fast you&apos;re moving. Everything else (terrain, shoes, fatigue,
          load) tweaks the result by single-digit percentages. Get the leg-length
          and pace right and the rest is noise.
        </p>
      </Section>

      <Section id="stride-formula" title="The stride length formula">
        <p>
          The cleanest published estimator comes from the ACSM and shows up in
          almost every physiology textbook. It maps your height directly to your
          average stride length.
        </p>
        <Formula>
          stride length (in) = height (in) × 0.413 (women) or × 0.415 (men)
        </Formula>
        <p>
          Then the conversion to steps per mile is straightforward, because a
          mile is exactly 63,360 inches:
        </p>
        <Formula>steps per mile = 63,360 ÷ stride length (in)</Formula>
        <p>
          A 5&apos;6&quot; (66 in) woman gets a 27.3-inch stride, which works
          out to 2,322 steps per mile. A 6&apos;0&quot; (72 in) man gets a
          29.9-inch stride, or 2,121 steps per mile. Both walking. The 200-step
          gap between those two people compounds fast: a daily 3-mile walk
          differs by 600 steps just from height.
        </p>
        <p>
          If you want a quicker mental model, the <Link href="/steps-to-miles-calculator">steps to miles calculator</Link> does all this in the
          browser and also handles unit conversion for cm/meters input.
        </p>
      </Section>

      <Section id="worked-examples" title="Worked examples by height and pace">
        <p>
          Same formula, four bodies. Notice how much the pace column matters
          versus the height column.
        </p>

        <h3 className="md-title-large mt-6">1. 5&apos;2&quot; woman, casual walk</h3>
        <WorkedSteps
          steps={[
            { label: "Height", value: "62 in" },
            { label: "Stride (62 × 0.413)", value: "25.6 in" },
            { label: "Steps per mile (63,360 ÷ 25.6)", value: "2,475" },
            { label: "30-min mile pace adjustment", value: "+3% slower cadence ≈ 2,550" },
          ]}
        />

        <h3 className="md-title-large mt-10">2. 5&apos;8&quot; man, brisk walk</h3>
        <WorkedSteps
          steps={[
            { label: "Height", value: "68 in" },
            { label: "Stride (68 × 0.415)", value: "28.2 in" },
            { label: "Steps per mile (63,360 ÷ 28.2)", value: "2,247" },
            { label: "15-min mile brisk pace", value: "≈ 2,200 (stride opens up)" },
          ]}
        />

        <h3 className="md-title-large mt-10">3. 5&apos;10&quot; woman, 9-min jog</h3>
        <WorkedSteps
          steps={[
            { label: "Height", value: "70 in" },
            { label: "Walking stride (70 × 0.413)", value: "28.9 in (2,191/mi)" },
            { label: "Running stride (≈ 1.4× walking)", value: "40.5 in" },
            { label: "Steps per mile (63,360 ÷ 40.5)", value: "1,565" },
          ]}
        />

        <h3 className="md-title-large mt-10">4. 6&apos;2&quot; man, 7-min run</h3>
        <WorkedSteps
          steps={[
            { label: "Height", value: "74 in" },
            { label: "Walking stride (74 × 0.415)", value: "30.7 in (2,063/mi)" },
            { label: "Running stride (≈ 1.5× walking at fast pace)", value: "46.1 in" },
            { label: "Steps per mile (63,360 ÷ 46.1)", value: "1,374" },
          ]}
        />
        <p>
          The 5&apos;2&quot; walker and the 6&apos;2&quot; runner are 1,100
          steps apart per mile. Same mile. Almost double. If you&apos;re using
          step totals to compare workouts with a friend who has different
          dimensions, you&apos;re comparing nothing.
        </p>
      </Section>

      <Section id="walking-vs-running" title="Walking vs running: where the gap comes from">
        <p>
          Running isn&apos;t just faster walking. Biomechanically it&apos;s a
          different gait. You go airborne between each footstrike, your hips
          rotate further, and your stride extends by roughly 40 to 50 percent at
          jog pace, 60 to 75 percent at race pace.
        </p>
        <p>
          A 2014 study in the Journal of Sports Sciences mapped stride length
          against pace for 30 runners. The headline numbers:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Pace</th>
              <th>Avg stride length</th>
              <th>Steps per mile (5&apos;8&quot;)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Slow walk</td>
              <td>3.0 mph (20-min mile)</td>
              <td>26 in</td>
              <td>2,437</td>
            </tr>
            <tr>
              <td>Brisk walk</td>
              <td>4.0 mph (15-min mile)</td>
              <td>30 in</td>
              <td>2,112</td>
            </tr>
            <tr>
              <td>Jog</td>
              <td>6.0 mph (10-min mile)</td>
              <td>40 in</td>
              <td>1,584</td>
            </tr>
            <tr>
              <td>Run</td>
              <td>7.5 mph (8-min mile)</td>
              <td>48 in</td>
              <td>1,320</td>
            </tr>
            <tr>
              <td>Sprint</td>
              <td>10+ mph</td>
              <td>60+ in</td>
              <td>1,056 or fewer</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Cadence (steps per minute) stays in a tight band of 160 to 185 across
          almost all runners. Elite marathoners hover at 180. The reason fast
          runners log fewer steps per mile is entirely about stride extension,
          not turnover.
        </p>
      </Section>

      <Section id="pedometer-accuracy" title="Pedometer vs GPS: which one to trust">
        <p>
          Your watch has two ways to measure a mile: counting steps and
          multiplying by an assumed stride, or using GPS to track real distance.
          They give different answers, and the gap matters.
        </p>
        <p>
          A 2017 JMIR study put 14 wrist-worn devices through a calibrated
          treadmill protocol. The Apple Watch came in at 96 percent step
          accuracy on flat walking. The Fitbit Charge 2 hit 97 percent. Both
          dropped to 88 to 91 percent during running, and to 70 percent or worse
          when the wearer was pushing a cart or carrying anything.
        </p>
        <p>
          Two takeaways for your training log:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>For distance, trust GPS.</strong> The step-to-mile
            conversion is doing math on top of math. GPS measures the actual
            ground you covered.
          </li>
          <li>
            <strong>For cardio load, step count is fine.</strong> Pair it with
            heart-rate data from a chest strap or check it against your{" "}
            <Link href="/max-heart-rate-calculator">max heart rate</Link> to see
            whether you&apos;re actually working or just moving around.
          </li>
        </ul>
        <p>
          Treadmill step counts are the least reliable, because the watch
          can&apos;t use GPS and the surface doesn&apos;t match outdoor cadence.
          Calibrate manually if you log a lot of treadmill miles.
        </p>
      </Section>

      <Section id="calibrate-your-own" title="Calibrate your own steps per mile">
        <p>
          The 60-second version: pick a measured distance, count your steps,
          divide. The forms version that pros use on treadmill setups looks
          like this.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Find a known distance.</strong> A 400-meter track is 0.249
            miles per lap, or you can use a measured 100 feet on a sidewalk. GPS
            apps like Strava work too, but calibrate over at least a quarter
            mile to wash out drift.
          </li>
          <li>
            <strong>Walk it at your normal cadence.</strong> Don&apos;t
            artificially lengthen your stride. Count footstrikes on one foot and
            double, or use a counter. Three trips averaged is more reliable than
            one.
          </li>
          <li>
            <strong>Divide.</strong> Steps per mile = 5,280 ÷ feet per step. So
            if you took 40 steps over 100 feet, that&apos;s 2.5 ft per step, or
            2,112 steps per mile.
          </li>
          <li>
            <strong>Repeat for running.</strong> Stride length changes
            significantly at pace. Calibrate walking and running separately or
            your run numbers will drift.
          </li>
        </ol>
        <p>
          Hydration matters here too. A 2014 study in Medicine &amp; Science in
          Sports &amp; Exercise found mild dehydration shortens stride length by
          2 to 4 percent during sustained activity. If you&apos;re tracking step
          counts on long walks or runs, check your{" "}
          <Link href="/water-intake-calculator">daily water intake</Link>
          {" "}numbers; it&apos;s a quieter variable than people expect.
        </p>
      </Section>

      <Section id="age-and-stride" title="What changes with age, terrain, and fatigue">
        <p>
          Stride length is not a constant for a given person. Three things move
          it across a lifetime and across a single workout.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Age.</strong> Stride drops roughly 5 to 7 percent between 60
            and 80, per a 2011 Gait &amp; Posture review by Hollman et al. An
            adult who logged 2,100 steps per mile at 55 may log 2,250 at 75 over
            the exact same route.
          </li>
          <li>
            <strong>Terrain.</strong> Trail and hills shorten stride by 8 to 15
            percent versus flat pavement. Sand can cost 20 percent or more.
            Beach walks crush step counts; people misread it as a fitness win.
          </li>
          <li>
            <strong>Fatigue.</strong> Late in a long run, stride shortens by 3
            to 5 percent and cadence climbs to compensate. This is why mile 20
            of a marathon adds 60+ steps versus mile 5 for the same runner.
          </li>
        </ul>
      </Section>

      <Section id="the-10000-step-myth" title="The 10,000-step number, briefly">
        <p>
          10,000 steps a day got popularized by Manpo-kei, a 1965 Japanese
          pedometer named &quot;10,000 step meter&quot; for marketing reasons.
          It was a slogan, not a study.
        </p>
        <p>
          The real research, a 2019 JAMA Internal Medicine paper by I-Min Lee
          and colleagues at Harvard, tracked 16,000 older women and found
          mortality reduction plateaued around 7,500 daily steps. A 2023
          meta-analysis in the European Journal of Preventive Cardiology
          confirmed the inflection point sits between 6,000 and 8,000 for adults
          over 60, and 8,000 to 10,000 for younger adults.
        </p>
        <p>
          So 10,000 isn&apos;t wrong; it&apos;s just not magic. If you&apos;re
          using a per-mile conversion to estimate your daily total, get the
          per-mile number right first, then chase a target that&apos;s actually
          backed by data.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Trusting the watch&apos;s default 2,000-per-mile setting.",
            fix: "Override it with your own calibrated number. Most fitness apps let you set a custom stride length in settings; iOS Health calls it &quot;Walking Step Length&quot;. Plug in your height-based estimate or, better, your measured value.",
          },
          {
            mistake: "Using the same conversion for walking and running.",
            fix: "Running stride is 40 to 75 percent longer than walking stride. Use one number for walking miles and a separate one for running miles. Track them separately in your log.",
          },
          {
            mistake: "Comparing step totals with a friend of different height.",
            fix: "Compare miles, not steps. A 6&apos;0&quot; person and a 5&apos;2&quot; person walking the exact same route will see step counts that differ by 20-plus percent. That&apos;s biology, not effort.",
          },
          {
            mistake: "Counting cooking and gestures as cardio steps.",
            fix: "Wrist pedometers over-register stationary arm movement. If your total looks impossibly high after a slow day, it probably is. Check against GPS or a hip-worn pedometer when accuracy matters.",
          },
          {
            mistake: "Chasing 10,000 steps as a clinical target.",
            fix: "It&apos;s a marketing number. The mortality curve flattens around 7,500 for older adults and 8,000 to 10,000 for younger ones. Aim for consistency over a round number.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "I-Min Lee et al., JAMA Internal Medicine 2019: Association of Step Volume and Intensity with All-Cause Mortality in Older Women",
            href: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2734709",
          },
          {
            label: "JMIR 2017: Accuracy of Wrist-Worn Activity Monitors During Common Daily Physical Activities",
            href: "https://www.jmir.org/2017/4/e125/",
          },
          {
            label: "Hollman, McDade, Petersen (2011), Gait &amp; Posture: Normative spatiotemporal gait parameters in older adults",
            href: "https://www.sciencedirect.com/science/article/abs/pii/S0966636211000063",
          },
          {
            label: "American College of Sports Medicine: Physical Activity Guidelines",
            href: "https://www.acsm.org/education-resources/trending-topics-resources/physical-activity-guidelines",
          },
          {
            label: "Paluch et al. (2022), Lancet Public Health: Daily steps and all-cause mortality meta-analysis",
            href: "https://www.thelancet.com/journals/lanpub/article/PIIS2468-2667(21)00302-9/fulltext",
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
