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

const POST = getPostBySlug("target-heart-rate-zones-explained")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What are the five heart rate training zones?",
    answer:
      "Zone 1 is 50 to 60% of max heart rate (recovery), Zone 2 is 60 to 70% (aerobic base), Zone 3 is 70 to 80% (tempo), Zone 4 is 80 to 90% (threshold), and Zone 5 is 90 to 100% (VO2 max). Each zone trains a different physiological system, and most weekly volume should sit in Zones 1 and 2.",
  },
  {
    question: "Why is the Karvonen formula better than 220 minus age?",
    answer:
      "The 220-age formula uses only max heart rate, so it gives the same Zone 2 target to a couch potato and a marathoner of the same age. Karvonen factors in resting heart rate, which captures fitness level. A fit person with a resting HR of 50 hits a higher absolute number for Zone 2 than someone resting at 75, even at the same percentage of effort.",
  },
  {
    question: "How do I calculate my heart rate reserve?",
    answer:
      "Heart rate reserve (HRR) is max heart rate minus resting heart rate. If your max is 185 and your resting HR is 60, your HRR is 125. Karvonen multiplies HRR by the target percentage (say 70%), then adds resting HR back: 0.70 × 125 + 60 = 147.5 beats per minute.",
  },
  {
    question: "How accurate is 220 minus age for max heart rate?",
    answer:
      "The 220-age formula has a standard deviation of about 10 to 12 beats per minute, per Tanaka et al. (2001). That means roughly a third of people are off by more than 12 bpm. Tanaka's revised formula (208 - 0.7 × age) is closer for adults over 40 but still an estimate. A field test or lab test is the only way to know your real max.",
  },
  {
    question: "Which zone burns the most fat?",
    answer:
      "Zone 2 burns the highest percentage of calories from fat (often 60 to 80%), but Zone 4 and 5 burn more total fat per minute because they burn more total calories. For fat loss, total energy expenditure plus diet matters more than zone choice. For aerobic base building, Zone 2 is the right tool.",
  },
  {
    question: "How long should I stay in Zone 2?",
    answer:
      "Endurance athletes typically spend 70 to 80% of weekly training time in Zone 1 and 2, per the polarized training model (Seiler 2010). For a recreational runner that might mean 3 to 4 hours per week of easy aerobic work and 30 to 60 minutes of harder intervals. Sessions of 45 to 90 minutes in Zone 2 build mitochondrial density.",
  },
  {
    question: "Do heart rate zones work for cycling and rowing?",
    answer:
      "Yes, but max heart rate is typically 5 to 10 beats lower in cycling than running, and another 5 lower in swimming. Calculate zones separately for each sport using a sport-specific max. Many cyclists use power zones (based on FTP) alongside HR for better short-interval precision.",
  },
  {
    question: "What heart rate is too high?",
    answer:
      "Sustained heart rates above your true maximum, or sudden spikes far above your normal Zone 5, warrant a check. Symptoms like chest pain, severe shortness of breath, dizziness, or an irregular pulse are reasons to stop and see a clinician. The American Heart Association recommends a medical clearance before high-intensity training if you have known cardiac risk factors.",
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
        "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates",
        "https://pubmed.ncbi.nlm.nih.gov/11153730/",
        "https://pubmed.ncbi.nlm.nih.gov/20861519/",
        "https://www.acsm.org/docs/default-source/files-for-resource-library/exercise-intensity-infographic.pdf",
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
          Two 40-year-olds with the same max heart rate of 180 can have wildly
          different Zone 2 targets. One rests at 48 bpm, runs five days a week,
          and hits Zone 2 around 142. The other rests at 78, sits at a desk, and
          hits the same percentage of effort at 129. Same age, same max, 13-beat
          gap. That gap is what the Karvonen formula catches and what &quot;60
          to 80% of 220-age&quot; misses.
        </p>
      </header>

      <CTACard
        slug="target-heart-rate-calculator"
        label="Skip the math"
        title="Use our Target Heart Rate Calculator"
        body="Plug in your age and resting heart rate. The calculator runs the Karvonen formula and gives you all five zones in beats per minute, no spreadsheet required. The rest of this post is for people who want to know why the numbers look the way they do."
      />

      <Section id="what-the-zones-are" title="The five zones, and what each one builds">
        <p>
          Heart rate zones are bands of intensity. Each one trains a different
          system in your body, and serious training plans deliberately spread
          time across them rather than grinding at one effort. Here are the five
          zones every coaching framework uses, expressed as a percentage of
          maximum heart rate (MHR):
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Zone</th>
              <th>% of MHR</th>
              <th>Feels like</th>
              <th>What it builds</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – Recovery</td>
              <td>50 – 60%</td>
              <td>Conversational, easy walk pace</td>
              <td>Active recovery, blood flow, parasympathetic tone</td>
            </tr>
            <tr>
              <td>2 – Aerobic base</td>
              <td>60 – 70%</td>
              <td>Easy, nose-breathing, can hold a chat</td>
              <td>Mitochondrial density, fat oxidation, capillaries</td>
            </tr>
            <tr>
              <td>3 – Tempo</td>
              <td>70 – 80%</td>
              <td>Comfortably hard, short sentences only</td>
              <td>Aerobic capacity, lactate clearance</td>
            </tr>
            <tr>
              <td>4 – Threshold</td>
              <td>80 – 90%</td>
              <td>Hard, one word at a time</td>
              <td>Lactate threshold, race-pace economy</td>
            </tr>
            <tr>
              <td>5 – VO2 max</td>
              <td>90 – 100%</td>
              <td>All-out, only sustainable in intervals</td>
              <td>VO2 max, neuromuscular power</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          Most weekly volume for endurance athletes should sit in Zones 1 and 2.
          Stephen Seiler&apos;s polarized training research, published across
          decades of work with elite Scandinavian endurance athletes, shows that
          roughly 80% of training time at easy intensity plus 20% at hard
          intensity outperforms the middle-ground &quot;tempo&quot; approach
          that most amateurs default to.
        </p>
      </Section>

      <Section id="why-karvonen" title="Why 220 minus age fails fit people">
        <p>
          The standard textbook target is &quot;60 to 80% of 220 minus your
          age.&quot; Take age 40, max heart rate becomes 180, Zone 2 becomes
          108 to 144 bpm. Plug it into a fitness app and walk out the door.
        </p>
        <p>
          The problem: that calculation treats every 40-year-old as the same
          biological machine. A trained endurance athlete and a sedentary office
          worker, both 40, get the same number. But their cardiovascular
          systems are nothing alike. The athlete has a stronger heart, pumps
          more blood per beat, and runs at a lower resting heart rate. At the
          same percentage of true effort, the athlete&apos;s heart rate sits
          higher than the formula predicts, and the unfit person&apos;s sits
          lower.
        </p>
        <p>
          This shows up in the data. Tanaka et al. (2001) reviewed 351 studies
          and 18,712 subjects to test the 220-age formula. Standard deviation
          on max heart rate landed at 10 to 12 bpm, which means about a third
          of the population is off by more than 12 beats. They proposed a
          revised formula, 208 minus 0.7 × age, which trims the bias for older
          adults but still doesn&apos;t address the fitness-level gap.
        </p>
        <p>
          The fix is to stop treating max heart rate as the only input. Resting
          heart rate carries fitness information that MHR alone doesn&apos;t.
          That&apos;s where Karvonen comes in. If you want the raw number
          without the math, our{" "}
          <Link href="/target-heart-rate-calculator">
            target heart rate calculator
          </Link>{" "}
          uses the Karvonen method by default.
        </p>
      </Section>

      <Section id="karvonen-formula" title="The Karvonen formula, step by step">
        <p>
          Martti Karvonen, a Finnish physiologist, published his method in
          1957. Instead of taking a percentage of max heart rate, Karvonen
          takes a percentage of <em>heart rate reserve</em> (HRR), the gap
          between your max and your resting rate, and adds resting HR back at
          the end.
        </p>
        <Formula>
          target HR = (HR<sub>max</sub> − HR<sub>rest</sub>) × intensity% + HR
          <sub>rest</sub>
        </Formula>
        <p>
          Four steps. The math is sixth-grade arithmetic; the work is honest
          inputs.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Estimate or measure max heart rate.</strong> Tanaka&apos;s
            208 − 0.7 × age is a reasonable starting point. Better: do a
            graded field test (a 5-minute all-out hill repeat after a warmup
            usually gets within 2 to 3 bpm of true max). Our{" "}
            <Link href="/max-heart-rate-calculator">
              max heart rate calculator
            </Link>{" "}
            runs both estimates and shows you the gap.
          </li>
          <li>
            <strong>Measure resting heart rate.</strong> First thing in the
            morning, lying in bed, before coffee or the snooze button. Average
            three mornings to wash out a bad night&apos;s sleep. A chest strap
            beats a wrist optical sensor for accuracy at rest.
          </li>
          <li>
            <strong>Compute heart rate reserve.</strong> HRR = HR<sub>max</sub>
            − HR<sub>rest</sub>. This is the dynamic range your heart actually
            works inside.
          </li>
          <li>
            <strong>Apply the zone percentage to HRR, then add resting back.</strong>{" "}
            Zone 2 lower bound is 60% of HRR plus resting HR. Zone 2 upper
            bound is 70% of HRR plus resting HR. Same logic for every other
            zone.
          </li>
        </ol>
      </Section>

      <Section id="worked-example" title="Worked example: the fit 40-year-old vs the sedentary 40-year-old">
        <p>
          Both are 40. Both have an estimated max heart rate of 187 bpm
          (using 208 − 0.7 × 40). The trained athlete rests at 48 bpm. The
          sedentary office worker rests at 75 bpm.
        </p>

        <h3 className="md-title-large mt-6">Athlete: Zone 2 (60 to 70% HRR)</h3>
        <WorkedSteps
          steps={[
            { label: "HR max", value: "187 bpm" },
            { label: "HR rest", value: "48 bpm" },
            { label: "Heart rate reserve (HRR)", value: "187 − 48 = 139" },
            { label: "Zone 2 lower (60% HRR + rest)", value: "0.60 × 139 + 48 = 131.4" },
            { label: "Zone 2 upper (70% HRR + rest)", value: "0.70 × 139 + 48 = 145.3" },
            { label: "Zone 2 band", value: "131 – 145 bpm" },
          ]}
        />

        <h3 className="md-title-large mt-10">Office worker: Zone 2 (60 to 70% HRR)</h3>
        <WorkedSteps
          steps={[
            { label: "HR max", value: "187 bpm" },
            { label: "HR rest", value: "75 bpm" },
            { label: "Heart rate reserve (HRR)", value: "187 − 75 = 112" },
            { label: "Zone 2 lower (60% HRR + rest)", value: "0.60 × 112 + 75 = 142.2" },
            { label: "Zone 2 upper (70% HRR + rest)", value: "0.70 × 112 + 75 = 153.4" },
            { label: "Zone 2 band", value: "142 – 153 bpm" },
          ]}
        />
        <p>
          Notice what happened. Same age. Same max heart rate. Different Zone 2
          targets by 11 beats on the lower bound and 8 on the upper. The
          straight &quot;60 to 80% of MHR&quot; formula would have given both
          the same band, 112 to 150, which under-prescribes effort for the
          unfit person and overshoots for the athlete on the low end.
        </p>
      </Section>

      <Section id="all-five-zones" title="All five Karvonen zones for that athlete">
        <p>
          Running the full table for the fit 40-year-old (HR<sub>max</sub> 187,
          HR<sub>rest</sub> 48, HRR 139):
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Zone</th>
              <th>% HRR</th>
              <th>Lower (bpm)</th>
              <th>Upper (bpm)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1 – Recovery</td>
              <td>50 – 60%</td>
              <td>118</td>
              <td>131</td>
            </tr>
            <tr>
              <td>2 – Aerobic base</td>
              <td>60 – 70%</td>
              <td>131</td>
              <td>145</td>
            </tr>
            <tr>
              <td>3 – Tempo</td>
              <td>70 – 80%</td>
              <td>145</td>
              <td>159</td>
            </tr>
            <tr>
              <td>4 – Threshold</td>
              <td>80 – 90%</td>
              <td>159</td>
              <td>173</td>
            </tr>
            <tr>
              <td>5 – VO2 max</td>
              <td>90 – 100%</td>
              <td>173</td>
              <td>187</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          The bands narrow at the top because HRR multiplies by smaller
          percentage gaps. A 14-bpm Zone 2 width gives plenty of room for a
          long aerobic run; a 14-bpm Zone 5 width is the difference between
          a 90% effort and a maximal sprint.
        </p>
      </Section>

      <Section id="zone-2-bias" title="Why coaches keep telling you to do more Zone 2">
        <p>
          Talk to any endurance coach in the last decade and Zone 2 comes up
          first. The reason isn&apos;t fashion. Inigo San Millan&apos;s lab
          work, popularized through Peter Attia&apos;s podcast, frames Zone 2
          as the training intensity that drives mitochondrial biogenesis and
          fat oxidation without accumulating much fatigue.
        </p>
        <p>
          Mitochondria are the energy plants of the cell. The more of them you
          have, and the better they work, the more fat you can burn at any
          given pace and the longer you can hold an aerobic effort before
          lactate piles up. Zone 2 is the intensity range where mitochondrial
          machinery sees the strongest training signal without the metabolic
          stress that hard intervals carry.
        </p>
        <p>
          The polarized model that Seiler documented in elite endurance sport
          allocates about 80% of training time to Zone 1 to 2, and 15 to 20% to
          Zone 4 to 5, with very little in Zone 3. The middle zone, tempo, is
          hard enough to fatigue you but not hard enough to drive top-end
          adaptations. Most amateurs spend too much time there because it
          feels productive. It mostly accumulates cost.
        </p>
        <p>
          For someone who also tracks nutrition, the energy and protein side
          of recovery matters as much as the training distribution. Our{" "}
          <Link href="/protein-intake-calculator">protein intake calculator</Link>{" "}
          uses ISSN 2017 evidence-based ranges (1.4 to 2.0 g/kg for active
          adults) and adjusts for training volume.
        </p>
      </Section>

      <Section id="measuring-honestly" title="Getting honest inputs">
        <p>
          The Karvonen formula is only as accurate as the two numbers you feed
          it. The math is trivial; the measurement is where people cheat
          themselves.
        </p>
        <p>
          <strong>Max heart rate.</strong> A graded field test is the gold
          standard short of a lab. After a 15-minute warmup, run 3 to 5 hard
          minutes uphill with a chest strap on. The number you see in the last
          30 seconds is close to your true max for that sport. Repeat it for
          cycling on a stationary trainer if you also ride; expect 5 to 10 bpm
          lower than running. Don&apos;t use a single workout&apos;s peak HR
          unless you were genuinely all-out; submaximal efforts undercount.
        </p>
        <p>
          <strong>Resting heart rate.</strong> Measure the moment you wake up,
          before sitting up. A chest strap or a finger on the carotid for 60
          seconds works better than a wrist watch at the lowest end of the
          scale. Average three to five mornings. Caffeine, alcohol, and a poor
          night&apos;s sleep all spike resting HR by 5 to 15 bpm.
        </p>
        <p>
          <strong>Re-check every few months.</strong> Resting heart rate drops
          as you get fitter. Pat Patterson, a recreational cyclist documented
          in Joe Friel&apos;s coaching work, watched his resting HR fall from
          72 to 51 over two seasons. His Zone 2 band moved with it. Numbers
          you set in March don&apos;t apply in September.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Using 220 − age as if it were measured.",
            fix: "It&apos;s a population average with a 10 to 12 bpm standard deviation per Tanaka et al. (2001). Run the Karvonen formula with a measured resting HR and your zones will be far closer to reality. Field-test or lab-test your max when the stakes matter.",
          },
          {
            mistake: "Treating wrist-watch HR as truth in Zone 2.",
            fix: "Optical wrist sensors drift 5 to 15 bpm during steady-state aerobic work, per multiple peer-reviewed comparisons. If Zone 2 actually matters to your plan, wear a chest strap. The price gap pays for itself in not training in the wrong zone for months.",
          },
          {
            mistake: "Spending the week in Zone 3.",
            fix: "Tempo work feels productive and isn&apos;t. Polarized training (Seiler 2010) puts 80% of time in Zones 1 to 2 and 20% in Zones 4 to 5. Zone 3 should be a small fraction of weekly volume, not the default.",
          },
          {
            mistake: "Using the same zones for running and cycling.",
            fix: "Max heart rate is sport-specific. Running typically runs 5 to 10 bpm higher than cycling at the same RPE. Calculate Karvonen separately per sport with a sport-specific max.",
          },
          {
            mistake: "Setting resting HR once and never updating it.",
            fix: "As you get fitter, resting HR drops. Re-measure every 8 to 12 weeks. A 5-bpm change in resting HR shifts every Karvonen zone, and the old numbers under-prescribe effort.",
          },
          {
            mistake: "Skipping medical clearance with known risk factors.",
            fix: "The American Heart Association recommends a clinician check before high-intensity exercise if you have hypertension, diabetes, prior cardiac events, or family history of sudden cardiac death. Heart rate zones don&apos;t replace that check.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "American Heart Association: Target Heart Rates Chart",
            href: "https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates",
          },
          {
            label: "Tanaka, Monahan, Seals (2001): Age-predicted maximal heart rate revisited",
            href: "https://pubmed.ncbi.nlm.nih.gov/11153730/",
          },
          {
            label: "Seiler (2010): What is best practice for training intensity and duration distribution in endurance athletes?",
            href: "https://pubmed.ncbi.nlm.nih.gov/20861519/",
          },
          {
            label: "ACSM: Exercise Intensity Infographic",
            href: "https://www.acsm.org/docs/default-source/files-for-resource-library/exercise-intensity-infographic.pdf",
          },
          {
            label: "Karvonen, Kentala, Mustala (1957): The effects of training on heart rate",
            href: "https://pubmed.ncbi.nlm.nih.gov/13470504/",
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
