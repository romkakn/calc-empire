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

const POST = getPostBySlug("healthy-a1c-level")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What A1C is considered healthy for a non-diabetic adult?",
    answer:
      "Below 5.7%. That maps to an estimated average glucose of about 117 mg/dL. The ADA uses 5.7 to 6.4 for prediabetes and 6.5 and above for diabetes, confirmed on two tests.",
  },
  {
    question: "Is an A1C of 5.6 something to worry about?",
    answer:
      "Technically still normal, but it's the top of the normal band. People who land at 5.5 to 5.6 and have a family history of type 2 often catch a creep upward in the next two to three years. A repeat in 6 to 12 months is a reasonable move.",
  },
  {
    question: "Why is the diabetes target under 7% and not under 6%?",
    answer:
      "Aiming for non-diabetic numbers in someone with diabetes raises hypoglycemia risk, especially on insulin or sulfonylureas. The ADA settled on under 7% because it's where microvascular complications drop sharply without too many lows. Tighter is fine if it's safe to achieve.",
  },
  {
    question: "How long does it take to lower A1C?",
    answer:
      "Red blood cells live about 120 days, so A1C reflects roughly the last 2 to 3 months of glucose. Real changes show up at 3 months. A 1 to 2 point drop is realistic with consistent lifestyle change, medication, or both.",
  },
  {
    question: "Can A1C be wrong?",
    answer:
      "Yes. Anemia, recent blood loss, pregnancy, hemoglobin variants like sickle cell trait, and chronic kidney disease can all shift the number. If your A1C and your fingersticks tell very different stories, ask about fructosamine or a CGM.",
  },
  {
    question: "What A1C target should a 75-year-old aim for?",
    answer:
      "The ADA suggests 7.5 to 8.0 for many older adults, and up to 8.5 for those with complex health issues or limited life expectancy. The reason isn't laziness, it's that severe hypoglycemia in older adults is more dangerous than a slightly higher A1C.",
  },
  {
    question: "Does coffee, stress, or one bad week raise A1C?",
    answer:
      "Not noticeably. A1C is a 3-month rolling average weighted toward the last 30 days. One stressful week or a vacation buffet won't move it much. A 3-month pattern of late-night snacking absolutely will.",
  },
  {
    question: "What's a good A1C during pregnancy?",
    answer:
      "Most guidelines push for under 6.0 to 6.5% during pregnancy, lower than the standard adult target. Fetal exposure to higher glucose raises risks of macrosomia and congenital issues. OB and endocrine teams co-manage this.",
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
        "https://diabetesjournals.org/care/article/47/Supplement_1/S20/153954/2-Diagnosis-and-Classification-of-Diabetes",
        "https://www.cdc.gov/diabetes/diabetes-testing/index.html",
        "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
        "https://diabetesjournals.org/care/article/31/8/1473/24802/Translating-the-A1C-Assay-Into-Estimated-Average",
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
          Under 5.7 is normal. 5.7 to 6.4 is prediabetes. 6.5 is the diabetes
          threshold. The ADA target of under 7% for adults with diabetes is a
          starting point, not a finish line, and the right number for you
          depends on your age, what meds you&apos;re on, and whether you&apos;re
          pregnant. Here&apos;s how the bands actually work, the eAG number
          that maps A1C to a glucose meter reading, and what moves the dial.
        </p>
      </header>

      <CTACard
        slug="a1c-calculator"
        label="Skip the lookup"
        title="Use our A1C Calculator"
        body="Convert between A1C and estimated average glucose, see where your number sits in the ADA bands, and model what a 1-point drop would mean in mg/dL. The post explains why the numbers matter, the calculator does the math."
      />

      <Section id="the-bands" title="The four bands that matter">
        <p>
          A1C, or hemoglobin A1c, measures the percentage of your red blood
          cells with glucose stuck to them. Higher number, more glucose floating
          around, longer it&apos;s been doing that. Red cells live about 120
          days, so the result reflects roughly the last 8 to 12 weeks, weighted
          toward the most recent month.
        </p>
        <p>
          The American Diabetes Association draws three lines. They&apos;ve
          held steady for over a decade and they&apos;re the lines every US lab
          flags against:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Band</th>
              <th>A1C</th>
              <th>Estimated average glucose (mg/dL)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Normal</td>
              <td>Below 5.7%</td>
              <td>Below ~117</td>
            </tr>
            <tr>
              <td>Prediabetes</td>
              <td>5.7 – 6.4%</td>
              <td>117 – 137</td>
            </tr>
            <tr>
              <td>Diabetes</td>
              <td>6.5% or higher</td>
              <td>140+</td>
            </tr>
            <tr>
              <td>ADA general target (adults with diabetes)</td>
              <td>Below 7.0%</td>
              <td>Below ~154</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Source: ADA Standards of Care in Diabetes 2024, Sections 2 and 6.
          Confirmed diagnosis requires two abnormal tests, not one.
        </p>
      </Section>

      <Section id="eag-conversion" title="The eAG conversion: turning a percentage into a meter reading">
        <p>
          Your A1C is a percentage. Your glucose meter shows mg/dL. People get
          confused comparing them. The bridge is estimated average glucose,
          published by Nathan and colleagues in <em>Diabetes Care</em> in 2008
          from the ADAG study. The formula:
        </p>
        <Formula>
          eAG (mg/dL) = 28.7 × A1C − 46.7
        </Formula>
        <p>
          A 7.0% A1C maps to an average glucose of 154 mg/dL. A 6.0% maps to
          126. A 5.5% maps to 111. That&apos;s the number you&apos;d see if a
          continuous glucose monitor averaged every reading for three months.
          Useful for sanity-checking: if your finger sticks average 180 but
          your A1C comes back 6.2, something&apos;s off, probably the meter
          calibration or the lab assay.
        </p>
        <p>
          A few worked rows so you don&apos;t have to do the multiplication:
        </p>
        <WorkedSteps
          steps={[
            { label: "A1C 5.0%", value: "eAG ≈ 97 mg/dL" },
            { label: "A1C 5.7% (prediabetes line)", value: "eAG ≈ 117 mg/dL" },
            { label: "A1C 6.5% (diabetes line)", value: "eAG ≈ 140 mg/dL" },
            { label: "A1C 7.0% (ADA target)", value: "eAG ≈ 154 mg/dL" },
            { label: "A1C 8.0%", value: "eAG ≈ 183 mg/dL" },
            { label: "A1C 9.0%", value: "eAG ≈ 212 mg/dL" },
          ]}
        />
      </Section>

      <Section id="why-7-isnt-magic" title="Why under 7% is not one-size-fits-all">
        <p>
          The under-7 target came out of two trials in the 1990s, DCCT for type
          1 and UKPDS for type 2. Both showed that tighter glucose control
          dropped microvascular complications: retinopathy, neuropathy,
          nephropathy. The benefit curve flattens below 7%, but the
          hypoglycemia curve keeps climbing. That&apos;s the tradeoff.
        </p>
        <p>
          The ADA now publishes individualized targets, not a single number.
          The rough map:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Most non-pregnant adults with diabetes:</strong> below 7.0%.
            Some can safely target 6.5% if they&apos;re newly diagnosed, young,
            and not on hypoglycemia-causing meds.
          </li>
          <li>
            <strong>Pregnancy with pre-existing diabetes:</strong> below 6.0 to
            6.5%. Fetal risk drives the target down.
          </li>
          <li>
            <strong>Older adults, healthy:</strong> 7.0 to 7.5%. Function and
            life expectancy intact, but cushion against lows.
          </li>
          <li>
            <strong>Older adults, complex:</strong> below 8.0%. Multiple
            chronic conditions, moderate cognitive impairment, ADL impairment.
          </li>
          <li>
            <strong>Older adults, very complex / poor health:</strong> below
            8.5%. End-stage chronic illness or moderate-to-severe cognitive
            issues. The goal here is avoiding symptomatic hyperglycemia, not
            hitting a number on a chart.
          </li>
        </ul>
        <p>
          A 78-year-old on a sulfonylurea with one fall in the last year is
          not the same patient as a 32-year-old newly diagnosed with type 2.
          Aiming both at 6.8% would be reckless for one and undertreatment for
          the other.
        </p>
      </Section>

      <Section id="what-moves-a1c" title="What actually moves A1C (and what doesn't)">
        <p>
          Three months of consistent behavior shows up in the next test. A bad
          weekend doesn&apos;t. Here&apos;s a rough sense of how much each
          lever pulls, drawn from trial data and clinical experience.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Lever</th>
              <th>Typical A1C drop</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5 to 10% body weight loss</td>
              <td>0.5 – 1.5 points</td>
              <td>3 – 6 months</td>
            </tr>
            <tr>
              <td>Metformin (first-line med)</td>
              <td>1.0 – 1.5 points</td>
              <td>3 months</td>
            </tr>
            <tr>
              <td>GLP-1 agonist (semaglutide, etc.)</td>
              <td>1.0 – 1.8 points</td>
              <td>3 – 6 months</td>
            </tr>
            <tr>
              <td>SGLT-2 inhibitor</td>
              <td>0.5 – 1.0 points</td>
              <td>3 months</td>
            </tr>
            <tr>
              <td>150 min/week of moderate exercise</td>
              <td>0.5 – 0.7 points</td>
              <td>3 – 6 months</td>
            </tr>
            <tr>
              <td>Cutting sugar-sweetened drinks entirely</td>
              <td>0.3 – 0.5 points</td>
              <td>3 months</td>
            </tr>
            <tr>
              <td>Mediterranean / lower-carb pattern</td>
              <td>0.3 – 1.2 points</td>
              <td>3 – 6 months</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          The levers stack. They don&apos;t add cleanly, but a person who
          loses 7% body weight, walks 30 minutes a day, and stops drinking
          regular soda often sees a 1.5 to 2.5 point drop. That&apos;s the
          difference between 7.8% and 5.6%, which is the difference between a
          diabetes diagnosis and a normal labs page.
        </p>
        <p>
          Things that don&apos;t move A1C much, despite popular belief: one
          stressful week, a vacation, fasting the morning of the test (A1C
          isn&apos;t a fasting test), or drinking water before the blood draw.
          If you&apos;re tracking your overall metabolic picture, our{" "}
          <Link
            href="/water-intake-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            water intake calculator
          </Link>{" "}
          and{" "}
          <Link
            href="/protein-intake-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            protein intake calculator
          </Link>{" "}
          cover two of the other inputs that show up in the same conversation
          but on a different time scale.
        </p>
      </Section>

      <Section id="when-a1c-misleads" title="When A1C lies (and what to do instead)">
        <p>
          A1C is an average across the lifespan of red blood cells. Anything
          that messes with that lifespan messes with the number. Conditions to
          flag for your clinician:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Iron-deficiency anemia.</strong> Falsely raises A1C. Red
            cells stick around longer when production is slow.
          </li>
          <li>
            <strong>Acute blood loss, recent transfusion, hemolysis.</strong>
            {" "}Falsely lowers A1C. Fresh red cells haven&apos;t had time to
            collect glucose.
          </li>
          <li>
            <strong>Hemoglobin variants.</strong> Sickle cell trait, HbC, HbE
            can throw the assay off depending on the lab method. NGSP keeps a
            list of which methods are reliable for which variants.
          </li>
          <li>
            <strong>Chronic kidney disease (stage 4 to 5).</strong> Erythropoietin
            therapy and shortened red cell life skew the result.
          </li>
          <li>
            <strong>Pregnancy.</strong> Red cell turnover speeds up; A1C tends
            to read low in the second and third trimesters.
          </li>
        </ul>
        <p>
          When A1C isn&apos;t trustworthy, the backups are fructosamine (covers
          2 to 3 weeks), a 75-gram oral glucose tolerance test, or a continuous
          glucose monitor for 14 days. Each gives a different slice of the
          same picture.
        </p>
      </Section>

      <Section id="how-often-test" title="How often to test, and what to ask for">
        <p>
          Frequency depends on where you are on the curve.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>No diabetes risk factors, A1C below 5.7:</strong> every 3
            years from age 35, per ADA. Earlier if you have a family history,
            BMI over 25, or non-white ancestry.
          </li>
          <li>
            <strong>Prediabetes (5.7 to 6.4):</strong> annually. This is the
            window where lifestyle change can prevent the diagnosis. The
            Diabetes Prevention Program showed a 58% reduction in progression
            to type 2 with 7% weight loss and 150 min/week of activity.
          </li>
          <li>
            <strong>Diabetes, stable at target:</strong> every 6 months.
          </li>
          <li>
            <strong>Diabetes, above target or recently changed meds:</strong>{" "}
            every 3 months. Less than that and you can&apos;t tell what
            you&apos;re reacting to.
          </li>
        </ol>
        <p>
          When you get the result, ask the lab for the assay method (most US
          labs use NGSP-certified HPLC), and your eAG. The eAG number is
          often more useful day-to-day than the percentage because it&apos;s
          in the same units as your meter. Some health systems print both
          automatically; many still don&apos;t.
        </p>
      </Section>

      <Section id="putting-it-together" title="Putting a target on it">
        <p>
          So what should your number be? Three quick calls.
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>If you don&apos;t have diabetes:</strong> below 5.7%. If
            you&apos;re at 5.5 or 5.6, you&apos;re fine, but the trend matters
            more than the snapshot. Track it.
          </li>
          <li>
            <strong>If you have type 2 diabetes, otherwise healthy, under
            65:</strong> below 7.0%, ideally 6.5% if you can hit it without
            frequent lows.
          </li>
          <li>
            <strong>If you have type 1, or you&apos;re on insulin:</strong>{" "}
            below 7.0% if you can do it without severe hypoglycemia. Time-in-
            range from a CGM is increasingly the better measure here.
          </li>
          <li>
            <strong>If you&apos;re over 65 with multiple conditions:</strong>{" "}
            below 8.0%. The goal is avoiding symptomatic highs and any
            symptomatic lows. The trial data behind tight control doesn&apos;t
            transfer well to frail older adults.
          </li>
          <li>
            <strong>If you&apos;re pregnant or planning:</strong> below 6.0 to
            6.5%, managed jointly by OB and endocrine.
          </li>
        </ul>
        <p>
          One number on its own doesn&apos;t tell the story. Two readings, six
          months apart, both moving the same direction, do. A1C is a slow
          signal. Treat it like one.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Treating 7.0% as a hard pass/fail.",
            fix: "It&apos;s a population target, not a personal one. A 70-year-old with kidney disease at 7.4% is doing fine. A 35-year-old newly diagnosed at 6.8% has room to push lower. Your number lives inside your situation.",
          },
          {
            mistake: "Fasting before the A1C test.",
            fix: "A1C is not a fasting test. The result is a 3-month average; nothing you eat the morning of moves it. Fasting only matters for the glucose tests (FPG, OGTT) often drawn alongside.",
          },
          {
            mistake: "Panicking after one bad result.",
            fix: "ADA requires two abnormal tests to diagnose, drawn separately. One 6.7% reading isn&apos;t a diagnosis. Repeat in 2 to 6 weeks, ideally with a fasting glucose alongside.",
          },
          {
            mistake: "Ignoring A1C because your fingersticks look fine.",
            fix: "Meters sample one moment, A1C samples 90 days. If your A1C is climbing while your morning glucose looks normal, post-meal spikes are probably the problem. A 2-week CGM trial is cheap clarity.",
          },
          {
            mistake: "Chasing a number with aggressive low-carb plus old insulin doses.",
            fix: "Lowering carbs without adjusting insulin or sulfonylureas is the fastest path to a hypoglycemic episode. Lifestyle change and med change need to move together. Get the prescriber involved.",
          },
          {
            mistake: "Assuming every lab uses the same A1C method.",
            fix: "Different methods give slightly different results for the same blood. NGSP-certified labs are within ±0.5%, which sounds small until it sits across the 6.5% line. Stay with the same lab when you can.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "ADA Standards of Care in Diabetes 2024 (Section 2: Diagnosis)",
            href: "https://diabetesjournals.org/care/article/47/Supplement_1/S20/153954/2-Diagnosis-and-Classification-of-Diabetes",
          },
          {
            label: "CDC: All About Your A1C",
            href: "https://www.cdc.gov/diabetes/diabetes-testing/index.html",
          },
          {
            label: "NIDDK: The A1C Test &amp; Diabetes",
            href: "https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test",
          },
          {
            label: "Nathan et al. 2008: Translating the A1C Assay Into eAG (Diabetes Care)",
            href: "https://diabetesjournals.org/care/article/31/8/1473/24802/Translating-the-A1C-Assay-Into-Estimated-Average",
          },
          {
            label: "NGSP: Factors That Interfere With HbA1c Test Results",
            href: "http://www.ngsp.org/factors.asp",
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
