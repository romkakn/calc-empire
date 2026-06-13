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

const POST = getPostBySlug("how-much-water-should-i-drink")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Where does the 8x8 rule actually come from?",
    answer:
      "It traces back to a 1945 National Research Council Food and Nutrition Board note that said adults need about 1 mL of water per calorie consumed, which works out to roughly 2.5 liters a day. The very next sentence said most of that comes from food. That second sentence got lost, and the first half became folklore.",
  },
  {
    question: "How much water should I actually drink per day?",
    answer:
      "The National Academies set adequate intake at about 3.7 liters (125 oz) total water per day for men and 2.7 liters (91 oz) for women. Roughly 20 percent comes from food. That leaves about 100 oz for men and 73 oz for women from drinks, including coffee and tea.",
  },
  {
    question: "Does coffee count toward my water intake?",
    answer:
      "Yes. The old idea that caffeine dehydrates you was overturned by a 2014 PLOS ONE study showing four cups of coffee a day hydrated as well as water. Caffeine is a mild diuretic only at doses far above what most people drink.",
  },
  {
    question: "Can you drink too much water?",
    answer:
      "Yes, and it kills people every year. Exercise-associated hyponatremia happens when you drink more than the kidneys can excrete, around 0.8 to 1.0 liters per hour. Marathon runners and military recruits have died from over-drinking water. If your pee is clear all day, you are probably overshooting.",
  },
  {
    question: "What color should my urine be?",
    answer:
      "Pale straw or light lemonade. Dark amber means drink more. Clear and colorless means you are likely over-hydrating and diluting electrolytes. The U.S. Army's field hydration chart uses urine color as the primary self-check.",
  },
  {
    question: "Do I need electrolytes or just water?",
    answer:
      "For workouts under 60 minutes in moderate temperatures, water is fine. Past that, or in heat above 80 degrees Fahrenheit, sodium loss starts to matter. The American College of Sports Medicine recommends 300 to 600 mg sodium per liter for endurance work over an hour.",
  },
  {
    question: "Does drinking water help you lose weight?",
    answer:
      "Modestly. A 2010 trial in Obesity showed pre-meal water (500 mL before each meal) led to about 2 kg more weight loss over 12 weeks versus a calorie-matched control. Mechanism is partly satiety, partly replacing calorie drinks.",
  },
  {
    question: "How does altitude or flying affect hydration needs?",
    answer:
      "Cabin humidity on long-haul flights drops to 10 to 20 percent versus 40 to 60 percent indoors at sea level. Add roughly 8 oz of water per hour of flight. Altitude above 8,000 ft also raises water loss through faster breathing and dry air.",
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
        "https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate",
        "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0084154",
        "https://www.acsm.org/docs/default-source/files-for-resource-library/exercise-and-fluid-replacement.pdf",
        "https://pubmed.ncbi.nlm.nih.gov/19661958/",
        "https://www.cdc.gov/healthyweight/healthy_eating/water-and-healthier-drinks.html",
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
          Eight 8-ounce glasses a day is not a research finding. It&apos;s a
          1945 footnote misread for eighty years. The actual number depends on
          what you weigh, how hard you sweat, what the thermometer says
          outside, and what you ate for lunch. Here&apos;s what hydration
          science says when you strip the marketing out.
        </p>
      </header>

      <CTACard
        slug="water-intake-calculator"
        label="Skip the math"
        title="Use our Water Intake Calculator"
        body="Plug in your weight, activity level, and climate. The calculator runs the same formula this post walks through. Post is here for the people who want to know why the number is what it is, and which inputs actually move it."
      />

      <Section id="the-1945-footnote" title="The 1945 footnote that became a billion-dollar myth">
        <p>
          In 1945 the U.S. Food and Nutrition Board of the National Research
          Council published a brief recommendation. Adults, it said, need
          about 1 milliliter of water per calorie of food. For a 2,500-calorie
          diet that&apos;s 2,500 mL, or roughly 2.5 liters. Sound familiar?
          That&apos;s eight 8-ounce glasses. Almost exactly.
        </p>
        <p>
          The same paragraph included a sentence that&apos;s been ignored for
          eight decades: &quot;Most of this quantity is contained in prepared
          foods.&quot; A watermelon is 92% water. An apple is 86%. Even a
          chicken breast is 65%. Subtract food water and the drinking target
          drops by roughly a fifth.
        </p>
        <p>
          The myth got refined in 2002 when Dr. Heinz Valtin published a
          review in the American Journal of Physiology titled &quot;Drink at
          least eight glasses of water a day. Really? Is there scientific
          evidence for &apos;8 × 8&apos;?&quot; His answer: no. He could not
          find a single peer-reviewed source supporting the round number. The
          paper has been cited over 400 times. The advice persists anyway.
        </p>
      </Section>

      <Section id="real-numbers" title="What the National Academies actually recommend">
        <p>
          In 2004 the Institute of Medicine (now the National Academies of
          Sciences) issued Dietary Reference Intakes for water. These are the
          numbers professionals quote. Both are for healthy adults at moderate
          temperatures and activity:
        </p>
        <Formula>
          Men: 3.7 L (125 oz) total water/day &nbsp;·&nbsp; Women: 2.7 L (91 oz) total water/day
        </Formula>
        <p>
          &quot;Total water&quot; includes everything: tap water, sparkling
          water, coffee, tea, juice, milk, soup, and the water locked inside
          food. The Academies estimate food contributes about 20% of that
          total. So the drinking-only target lands at about 100 oz for men and
          73 oz for women. That&apos;s twelve 8-oz glasses for men, nine for
          women, on a normal day with normal food.
        </p>
        <p>
          These are not minimums to avoid death. They&apos;re adequate intakes
          set at the median of what healthy people consume. The body has
          aggressive defenses against under- and over-hydration, and thirst
          works fine in healthy adults under age 65. The number is a target,
          not a prescription.
        </p>
      </Section>

      <Section id="bodyweight-rule" title="The simpler rule: half an ounce per pound">
        <p>
          Clinicians who don&apos;t want to memorize a chart use a body-weight
          rule of thumb. It scales naturally with body size, which the flat
          8&nbsp;×&nbsp;8 rule doesn&apos;t. A 110-lb woman and a 230-lb man
          do not need the same amount of water.
        </p>
        <Formula>
          baseline water (oz/day) = body weight (lb) × 0.5
        </Formula>
        <p>
          A 150-lb adult lands at 75 oz. A 200-lb adult at 100 oz. A 250-lb
          adult at 125 oz. That&apos;s your baseline before exercise, heat, or
          medical conditions. Pair this with the {""}
          <Link
            href="/water-intake-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            water intake calculator
          </Link>{" "}
          if you want to bake in activity and climate automatically.
        </p>

        <h3 className="md-title-large mt-6">Worked example: 180-lb office worker, moderate climate</h3>
        <WorkedSteps
          steps={[
            { label: "Body weight", value: "180 lb" },
            { label: "Baseline", value: "180 × 0.5 = 90 oz" },
            { label: "From food (20%)", value: "≈ 18 oz" },
            { label: "From drinks", value: "≈ 72 oz" },
            { label: "Glasses (8 oz)", value: "9 glasses/day" },
          ]}
        />
      </Section>

      <Section id="exercise-adder" title="Exercise: add 12 to 24 oz per hour">
        <p>
          The American College of Sports Medicine published the most-cited
          guidance on this in their 2007 position stand on exercise and fluid
          replacement. Sweat rates vary wildly. A lean runner in cool weather
          loses about 0.5 L/hour. A heavy-set cyclist in summer heat can lose
          2.5 L/hour. Most people fall between 0.8 and 1.4 L/hour during
          steady cardio.
        </p>
        <p>
          The practical adder for moderate exercise: 12 to 16 oz per hour for
          easy work, 16 to 24 oz per hour for hard work. Past 90 minutes you
          also need sodium, around 300 to 600 mg per liter of fluid. Pure
          water in large volumes without electrolytes is how recreational
          marathoners end up in the medical tent.
        </p>
        <p>
          Want to know if you&apos;re in the right intensity zone where these
          sweat rates apply? Run your numbers through the {""}
          <Link
            href="/max-heart-rate-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            max heart rate calculator
          </Link>{" "}
          to set sensible training zones before you worry about hydration
          math.
        </p>

        <h3 className="md-title-large mt-6">Same 180-lb adult, 45-min run plus 60-min bike</h3>
        <WorkedSteps
          steps={[
            { label: "Baseline (from above)", value: "90 oz" },
            { label: "Run adder", value: "0.75 hr × 20 oz = 15 oz" },
            { label: "Bike adder", value: "1.0 hr × 16 oz = 16 oz" },
            { label: "Total water need", value: "≈ 121 oz/day" },
            { label: "Less food contribution", value: "≈ 97 oz from drinks" },
          ]}
        />
      </Section>

      <Section id="climate-altitude" title="Climate, altitude, and the dry-air tax">
        <p>
          The Institute of Medicine numbers assume a temperate climate around
          22 to 25 degrees Celsius (72 to 77 F) and sea level. Both
          assumptions are violated for huge populations.
        </p>
        <ul className="mt-3 list-disc pl-5">
          <li>
            <strong>Heat above 30 C (86 F):</strong> baseline sweat losses
            rise by 500 to 1000 mL/day even without exercise. Construction and
            outdoor workers in summer routinely need 5 to 6 L/day.
          </li>
          <li>
            <strong>Dry climate (under 30% humidity):</strong> respiratory
            water loss roughly doubles. Phoenix in July, Salt Lake City in
            winter, and pressurized aircraft cabins all qualify.
          </li>
          <li>
            <strong>Altitude over 2,500 m (8,200 ft):</strong> faster
            breathing plus dry air adds about 500 mL/day. Mountaineering
            literature uses 4 L/day as a baseline at high camps.
          </li>
          <li>
            <strong>Cold:</strong> people forget thirst in cold weather
            because they don&apos;t sweat visibly, but ventilation loss is
            still high. Arctic and high-altitude expeditions report
            dehydration as the most common medical issue.
          </li>
        </ul>
      </Section>

      <Section id="food-water" title="The 20 percent that comes from food">
        <p>
          The reason &quot;eight glasses&quot; over-prescribes drinking water
          is food. A normal mixed diet contributes 600 to 1,000 mL of water
          per day. Skip salads and fruit and that drops; eat them and it
          rises. Approximate water content of common foods:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Food</th>
              <th>Water %</th>
              <th>Water in a typical serving</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cucumber, lettuce, celery</td>
              <td>95 – 97%</td>
              <td>~5 oz per cup</td>
            </tr>
            <tr>
              <td>Watermelon, strawberries, cantaloupe</td>
              <td>90 – 92%</td>
              <td>~5 oz per cup</td>
            </tr>
            <tr>
              <td>Orange, apple, grapes</td>
              <td>84 – 88%</td>
              <td>~4 oz per medium fruit</td>
            </tr>
            <tr>
              <td>Yogurt, milk</td>
              <td>87 – 89%</td>
              <td>~7 oz per cup</td>
            </tr>
            <tr>
              <td>Broth-based soup</td>
              <td>92 – 95%</td>
              <td>~7 oz per cup</td>
            </tr>
            <tr>
              <td>Cooked rice, pasta</td>
              <td>65 – 70%</td>
              <td>~3 oz per cup</td>
            </tr>
            <tr>
              <td>Chicken breast, lean beef</td>
              <td>60 – 65%</td>
              <td>~2 oz per 4-oz portion</td>
            </tr>
            <tr>
              <td>Bread, crackers, chips</td>
              <td>2 – 35%</td>
              <td>negligible</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 md-body-small text-[var(--md-sys-color-on-surface-variant)]">
          Values from the USDA FoodData Central database. The point: someone
          eating a Mediterranean-style diet with two pieces of fruit and a
          salad daily can hit the food-water average easily. Someone living on
          bread, chips, and lean meat probably falls short and needs to make
          it up at the tap.
        </p>
      </Section>

      <Section id="caffeine-myth" title="Coffee and tea: the dehydration myth is dead">
        <p>
          For decades dietitians told people to subtract coffee from their
          water tally because caffeine was a diuretic. A 2014 randomized
          crossover trial in PLOS ONE by Killer and colleagues ended that
          rule. They had habitual coffee drinkers consume four mugs (800 mL)
          of coffee a day for three days, then matched the same volume in
          water. Total body water, urine output, and blood markers were
          identical.
        </p>
        <p>
          Caffeine is a mild diuretic above roughly 500 mg in a single dose
          (about five cups of coffee at once) and only in people who
          don&apos;t drink it regularly. Habitual drinkers tolerize within
          days. For practical purposes: coffee, tea, sparkling water, and
          flavored seltzer all count 1-for-1 toward your daily total.
        </p>
        <p>
          What does not count fully: alcohol, which suppresses ADH and
          increases urine output by about 10 mL per gram of ethanol. A
          standard beer (14 g ethanol) costs you roughly 140 mL net of the
          fluid it provides. Two glasses of wine in the evening is a
          measurable dehydration event by morning.
        </p>
      </Section>

      <Section id="overhydration" title="The other failure mode: drinking too much">
        <p>
          Over-drinking water is not a marketing problem. It&apos;s a real
          medical emergency called exercise-associated hyponatremia (EAH).
          When you ingest water faster than your kidneys can excrete it
          (around 0.8 to 1.0 L/hour in a healthy adult), serum sodium drops.
          Below 130 mmol/L you get nausea and confusion. Below 120 you get
          seizures, coma, and sometimes death.
        </p>
        <p>
          Boston Marathon medical data published in the New England Journal of
          Medicine in 2005 found that 13 percent of finishers had measurable
          hyponatremia. The strongest predictor was not heat or pace. It was
          drinking more than 3 liters during the race. Military recruits at
          Fort Benning have died from forced over-drinking during heat-stress
          training. The CDC now warns explicitly against drinking past thirst
          during endurance events.
        </p>
        <p>
          The signal: completely clear urine all day, every day, especially if
          you&apos;re drinking on a schedule rather than when thirsty. Pale
          yellow is the target. Clear means dial it back.
        </p>
      </Section>

      <Section id="who-needs-more" title="Who needs more, who needs less">
        <p>
          The baseline targets are for healthy non-pregnant adults. Several
          groups have meaningfully different needs:
        </p>
        <ul className="mt-3 list-disc pl-5">
          <li>
            <strong>Pregnant women:</strong> add about 300 mL/day (IOM).
            Breastfeeding adds about 700 mL/day to replace milk output.
          </li>
          <li>
            <strong>Adults over 65:</strong> thirst signal blunts with age.
            Drink on schedule, not on cue. CDC data show dehydration is one of
            the top ten reasons for hospital admission in this group.
          </li>
          <li>
            <strong>Kidney stone history:</strong> urology guidelines from the
            American Urological Association recommend producing at least 2.5
            L of urine per day, which usually means 3.0+ L of intake.
          </li>
          <li>
            <strong>Heart failure or advanced kidney disease:</strong> fluid
            restriction is often prescribed, sometimes as low as 1.5 L/day.
            Earn the &quot;ask your doctor&quot; line here. Don&apos;t just
            chase a number.
          </li>
          <li>
            <strong>Hot-environment workers and soldiers:</strong> the U.S.
            Army uses a chart that prescribes up to 1.0 quart per hour during
            heavy work in 90+ F heat, capped at 1.5 quarts per hour and 12
            quarts per day to prevent EAH.
          </li>
        </ul>
        <p>
          Tracking macros alongside hydration? The {""}
          <Link
            href="/protein-intake-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            protein intake calculator
          </Link>{" "}
          pairs well with the water calc for anyone serious about training
          nutrition. Both scale with body weight on the same logic.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Treating 8&times;8 oz as a medical minimum.",
            fix: "It&apos;s not. It&apos;s a misread 1945 footnote. The real adequate intake is 3.7 L for men and 2.7 L for women, including food and all drinks. If you eat fruit and vegetables and drink coffee, you&apos;re probably already close.",
          },
          {
            mistake: "Subtracting coffee and tea from your tally.",
            fix: "Outdated. The 2014 PLOS ONE crossover trial showed coffee hydrates as well as water in habitual drinkers. Count it 1-for-1. Same for tea, seltzer, and flavored sparkling water.",
          },
          {
            mistake: "Aiming for crystal-clear urine.",
            fix: "Pale straw is the target, not clear. Completely clear urine all day is a marker of dilutional hyponatremia risk. The U.S. Army field chart treats clear as a warning sign, not a goal.",
          },
          {
            mistake: "Using the same target on a desk day and a 90-minute workout.",
            fix: "Add 12 to 24 oz per hour of exercise on top of baseline. Past 60 minutes in heat, add sodium too. Plain water in volume without electrolytes during long workouts is the classic hyponatremia setup.",
          },
          {
            mistake: "Drinking on a schedule instead of with meals.",
            fix: "Thirst works in healthy adults under 65. Pair drinks with meals (two glasses with breakfast, two with lunch, two with dinner) and you&apos;ll hit the target without thinking. The exception is older adults, where blunted thirst justifies scheduled intake.",
          },
          {
            mistake: "Counting alcohol as hydration.",
            fix: "Alcohol suppresses antidiuretic hormone and creates a roughly 10 mL net loss per gram of ethanol. A standard beer is a 140 mL deficit. Two glasses of wine puts you behind by morning. Match drinks with water 1-for-1 if you care about next-day function.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "National Academies: Dietary Reference Intakes for Water, Potassium, Sodium, Chloride, and Sulfate (2004)",
            href: "https://nap.nationalacademies.org/catalog/10925/dietary-reference-intakes-for-water-potassium-sodium-chloride-and-sulfate",
          },
          {
            label: "Killer et al., PLOS ONE 2014: No evidence of dehydration with moderate daily coffee intake",
            href: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0084154",
          },
          {
            label: "ACSM Position Stand: Exercise and Fluid Replacement (2007)",
            href: "https://www.acsm.org/docs/default-source/files-for-resource-library/exercise-and-fluid-replacement.pdf",
          },
          {
            label: "Valtin H., American Journal of Physiology 2002: Drink at least eight glasses of water a day. Really?",
            href: "https://journals.physiology.org/doi/full/10.1152/ajpregu.00365.2002",
          },
          {
            label: "CDC: Water and Healthier Drinks",
            href: "https://www.cdc.gov/healthyweight/healthy_eating/water-and-healthier-drinks.html",
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
