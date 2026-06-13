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

const POST = getPostBySlug("dog-years-real-vs-myth")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Where did the 1 dog year = 7 human years rule come from?",
    answer:
      "Nobody really knows. The earliest published reference is a 13th-century inscription at Westminster Abbey comparing human and dog lifespans, and the 7x ratio shows up in mid-1900s marketing copy for pet food. It was never a scientific claim. It survived because it&apos;s easy to remember and roughly right at one point on the curve.",
  },
  {
    question: "What is the new dog years formula?",
    answer:
      "The 2019 Wang et al. study from UC San Diego, published in Cell Systems, proposed: human age = 16 × ln(dog age) + 31. It comes from comparing DNA methylation patterns (epigenetic clocks) across 105 Labradors and 320 humans. The formula maps the biology, not the calendar.",
  },
  {
    question: "Why is a 1-year-old dog already 31 in human years?",
    answer:
      "At 12 months a dog is sexually mature, near full skeletal size, and behaviorally adolescent. A 7-year-old human child is none of those things. The epigenetic clock confirms what breeders have always known: the first year is compressed development, not gentle childhood.",
  },
  {
    question: "Do small dogs really age slower than big dogs?",
    answer:
      "Yes, and the effect is large. The American Veterinary Medical Association cites lifespan differences of about 5 years between toy breeds (~14-16 yr) and giant breeds (~7-10 yr). A 2013 study in The American Naturalist found every 4.4 lb of body mass cuts roughly 1 month off life expectancy.",
  },
  {
    question: "Why does the new formula make seniors look younger than the 7x rule?",
    answer:
      "Because aging is logarithmic, not linear. The Wang formula gives a 12-year-old dog about 71 human years, while 7x says 84. Epigenetic methylation slows after middle age in both species, so the late-life conversion compresses. Your old retriever isn&apos;t as ancient as the bumper-sticker math suggests.",
  },
  {
    question: "Does the Wang formula work for all breeds?",
    answer:
      "It was derived from Labrador Retrievers. It works well for medium-sized breeds (40-65 lb). For toy breeds and giants, you should adjust using the AVMA size-adjusted chart. The puppy phase is the most variable: a Great Dane at 1 year is closer to a 20-year-old human, a Chihuahua closer to a 15-year-old.",
  },
  {
    question: "What does ln mean in the formula?",
    answer:
      "ln is the natural logarithm, base e (≈ 2.718). On a phone calculator it&apos;s the LN button. For dog age 5: ln(5) ≈ 1.609, so human age ≈ 16 × 1.609 + 31 ≈ 56.7. If your calculator only has log (base 10), multiply that result by 2.303 to convert.",
  },
  {
    question: "Should I use the new formula or the AVMA chart?",
    answer:
      "Use the chart when you need a size-adjusted answer for a specific breed, especially toy or giant. Use the Wang formula when you want one clean number that reflects biological aging for a medium-sized dog. Our calculator does both and lets you pick.",
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
        "https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9",
        "https://www.avma.org/resources-tools/pet-owners/petcare/how-tell-your-pets-age",
        "https://royalsocietypublishing.org/doi/10.1098/rspb.2013.1428",
        "https://www.akc.org/expert-advice/health/how-to-calculate-dog-years-to-human-years/",
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
          Pets · {POST.readingMinutes} min read · Published {POST.datePublished}
        </p>
        <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
          {TITLE}
        </h1>
        <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
          A 1-year-old dog is not 7 in human years. They&apos;re 31. The dog is
          sexually mature, almost full size, and emotionally a teenager who
          hasn&apos;t figured out the couch isn&apos;t lava. In 2019 a team at
          UC San Diego cracked open the conversion with an epigenetic clock and
          handed us a formula that finally matches the biology. Here&apos;s what
          the new math says, why the old 7x rule survived for so long, and how
          breed size bends the curve.
        </p>
      </header>

      <CTACard
        slug="dog-age-calculator"
        label="Skip the math"
        title="Use our Dog Age Calculator"
        body="Plug in your dog&apos;s age (and size, if you want the breed-adjusted answer) and the calculator runs both the Wang 2019 epigenetic formula and the AVMA size-adjusted chart. This post is for the people who want to understand why the 7x rule is wrong and how the new number is built."
      />

      <Section id="the-myth" title="The 7x rule was never science">
        <p>
          The earliest written comparison of dog and human lifespans is a
          1268 inscription on the floor of Westminster Abbey. By the 1950s
          pet-food companies were printing &quot;1 dog year = 7 human years&quot;
          on cans because it gave owners a tidy reason to schedule vet visits.
          No peer review. No epidemiology. No biology. Just clean arithmetic that
          made a 10-year-old Lab feel like a 70-year-old man.
        </p>
        <p>
          The math was always weird if you looked at it. Dogs reach sexual
          maturity at 6 to 12 months. By the 7x rule, that maps to a 4- to
          7-year-old human. Dogs finish skeletal growth by 18 months;
          that&apos;s a 10-year-old child in 7x math. Either dogs are precocious
          beyond belief, or the linear conversion is broken at both ends.
        </p>
        <p>
          It&apos;s broken. We&apos;ve known it&apos;s broken since at least the
          1950s, when vets started publishing size-adjusted lifespan tables. But
          a clean replacement didn&apos;t arrive until DNA methylation gave us
          a way to measure biological age directly.
        </p>
      </Section>

      <Section id="the-formula" title="The 2019 Wang formula">
        <p>
          Tina Wang and colleagues at the UC San Diego School of Medicine ran
          methylation profiles on 105 Labrador Retrievers ranging from
          4 weeks to 16 years, and compared them against published methylation
          data for 320 humans. The patterns lined up logarithmically. The
          conversion they published in Cell Systems is:
        </p>
        <Formula>
          human age = 16 × ln(dog age in years) + 31
        </Formula>
        <p>
          ln is the natural logarithm. On any scientific calculator (or the LN
          button on your phone), it&apos;s one keystroke. The 31 anchors the
          curve at one year: ln(1) = 0, so a 1-year-old dog comes out to
          exactly 31 human years. That&apos;s the number the old 7x rule got
          most wrong, and the new formula gets right by design.
        </p>
        <p>
          What makes it different from the linear myth: the conversion bends.
          Puppies age fast, seniors age slow. Same shape as the human curve, just
          compressed into 12 to 16 calendar years instead of 80.
        </p>
      </Section>

      <Section id="examples" title="What the formula spits out">
        <p>
          Numbers make the bend obvious. Here&apos;s a calendar age plugged into
          the Wang formula at every milestone an owner actually cares about.
        </p>
        <WorkedSteps
          steps={[
            { label: "Dog age 1 yr", value: "16 × ln(1) + 31 = 31 human yr" },
            { label: "Dog age 2 yr", value: "16 × ln(2) + 31 ≈ 42 human yr" },
            { label: "Dog age 3 yr", value: "16 × ln(3) + 31 ≈ 49 human yr" },
            { label: "Dog age 5 yr", value: "16 × ln(5) + 31 ≈ 57 human yr" },
            { label: "Dog age 8 yr", value: "16 × ln(8) + 31 ≈ 64 human yr" },
            { label: "Dog age 10 yr", value: "16 × ln(10) + 31 ≈ 68 human yr" },
            { label: "Dog age 12 yr", value: "16 × ln(12) + 31 ≈ 71 human yr" },
            { label: "Dog age 15 yr", value: "16 × ln(15) + 31 ≈ 74 human yr" },
          ]}
        />
        <p>
          Compare against the 7x rule and the divergence is huge at both ends.
          The old math says a 1-year-old dog is 7 (off by 24 years). It says a
          12-year-old dog is 84 (off by 13). At one specific point in the
          middle, around dog age 4 to 5, the curves cross and the bumper sticker
          gets it almost right. Pure coincidence. That crossover is probably why
          the rule survived as long as it did.
        </p>
        <p>
          If you&apos;re running the math for your own dog, our{" "}
          <Link
            href="/dog-age-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            dog age calculator
          </Link>{" "}
          handles ln() and the size adjustment in one step. For owners of
          growing puppies who care about feeding curves too, the{" "}
          <Link
            href="/puppy-weight-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            puppy weight calculator
          </Link>{" "}
          pairs nicely with this one.
        </p>
      </Section>

      <Section id="why-puppies-age-fast" title="Why the first year is 31 years">
        <p>
          Biological aging isn&apos;t calendar time. It&apos;s the rate at which
          your DNA accumulates methylation marks, your telomeres shorten, your
          cells turn over, and your tissue repair efficiency drops. By every
          one of those measures, a 12-month-old dog has already completed what a
          human takes 30 years to do.
        </p>
        <p>Run through the milestones:</p>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Sexual maturity:</strong> 6 to 12 months for most breeds.
            Humans hit puberty at 11 to 14 and finish reproductive development
            around 18 to 20.
          </li>
          <li>
            <strong>Skeletal maturity:</strong> 10 to 18 months in dogs
            (later for giants). Humans, around age 18 to 25.
          </li>
          <li>
            <strong>Adult brain volume:</strong> roughly 12 months in dogs.
            Humans, late twenties.
          </li>
          <li>
            <strong>Behavioral adolescence:</strong> the &quot;teenage&quot;
            phase that drives owners to puppy class is 6 to 18 months. Roughly
            equivalent to human ages 13 to 18.
          </li>
        </ul>
        <p>
          The Wang formula matches all of that. A 1-year-old dog at 31 human
          years is an adult who&apos;s finished growing, is reproductively
          mature, and is starting to settle into stable behavior patterns. A
          7-year-old child is in second grade. The 7x rule was never even close.
        </p>
      </Section>

      <Section id="size-adjustment" title="Big dogs age faster. Here&apos;s how much">
        <p>
          The Wang formula was built on Labradors, a medium-large breed. It
          doesn&apos;t bake in the size effect. And the size effect is real:
          across breeds, every pound of body mass costs you about a week of life
          expectancy. The exact slope depends on whose dataset you use, but the
          direction is unambiguous.
        </p>
        <p>
          The American Veterinary Medical Association maintains a chart that
          adjusts the conversion by size. Here&apos;s the senior-life portion,
          which is where the size effect hits hardest:
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Dog age</th>
              <th>Small (&lt; 20 lb)</th>
              <th>Medium (21-50 lb)</th>
              <th>Large (51-90 lb)</th>
              <th>Giant (&gt; 90 lb)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>5 yr</td>
              <td>36</td>
              <td>37</td>
              <td>40</td>
              <td>42</td>
            </tr>
            <tr>
              <td>8 yr</td>
              <td>48</td>
              <td>51</td>
              <td>55</td>
              <td>64</td>
            </tr>
            <tr>
              <td>10 yr</td>
              <td>56</td>
              <td>60</td>
              <td>66</td>
              <td>79</td>
            </tr>
            <tr>
              <td>12 yr</td>
              <td>64</td>
              <td>69</td>
              <td>77</td>
              <td>93</td>
            </tr>
            <tr>
              <td>14 yr</td>
              <td>72</td>
              <td>78</td>
              <td>88</td>
              <td>107</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          A 12-year-old Great Dane is biologically closer to 93 than 71. A
          12-year-old Chihuahua is closer to 64. Same calendar number, two very
          different bodies. If your dog is on the heavy end of large, the Wang
          formula will undershoot. If it&apos;s a toy breed, the formula will
          overshoot the senior years.
        </p>
      </Section>

      <Section id="why-the-curve-bends" title="What an epigenetic clock actually measures">
        <p>
          Methylation is the addition of a small chemical tag (a methyl group)
          to specific cytosine bases in DNA. The pattern changes predictably
          with age. By picking a few hundred or few thousand sites that change
          most reliably, researchers built clocks that predict chronological
          age from a blood or tissue sample within a couple of years.
        </p>
        <p>
          The Horvath clock, published in 2013, did this for humans across 51
          tissue types. The Wang clock did it for dogs. Both clocks agree on a
          deep fact: the rate of epigenetic change is fast in early life,
          slows through middle age, and slows further (but doesn&apos;t stop)
          in old age. That&apos;s why the conversion is logarithmic, not linear.
        </p>
        <p>
          The same pattern shows up in other mammals where it&apos;s been
          measured. Mice. Rats. Naked mole rats. Bowhead whales. The
          species-specific scaling is different, but the shape is the same: a
          steep ramp early, a flattening curve at the top.
        </p>
        <p>
          A practical consequence: a senior dog isn&apos;t as ancient as the 7x
          math suggests, but it&apos;s also further from middle age than the
          calendar shows. Diet, joint care, and the right protein-calorie
          balance start mattering earlier than most owners think. The{" "}
          <Link
            href="/protein-intake-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            protein intake calculator
          </Link>{" "}
          tunes targets by body weight and activity level, which is useful when
          a dog crosses the threshold from adult to senior maintenance.
        </p>
      </Section>

      <Section id="when-each-method-fits" title="Wang formula vs AVMA chart: which to use">
        <p>
          Two tools, two jobs. They don&apos;t disagree, they just answer
          slightly different questions.
        </p>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Use the Wang formula when:</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Your dog is medium-sized (roughly 30 to 65 lb), where the
              Labrador-derived curve fits cleanly.
            </li>
            <li>
              You want one clean number for a card, a poster, a vet form.
            </li>
            <li>
              You&apos;re comparing biological aging across species, not picking
              a specific breed&apos;s expected lifespan.
            </li>
          </ul>
        </Card>

        <Card variant="filled" className="mt-4 p-4">
          <h3 className="md-title-large">Use the AVMA size-adjusted chart when:</h3>
          <ul className="mt-2 list-disc pl-5">
            <li>
              Your dog is a toy breed (&lt; 20 lb) or a giant (&gt; 90 lb)
              where the size effect dominates.
            </li>
            <li>
              You&apos;re planning veterinary preventive care that&apos;s tied
              to expected lifespan (joint screening, cardiac workups, senior
              bloodwork).
            </li>
            <li>
              You want to compare expected senior years across breeds
              you&apos;re considering.
            </li>
          </ul>
        </Card>

        <p className="mt-4">
          Our calculator runs both side by side. For a 65-lb Lab the answers
          will be within a year of each other. For a 4-lb Yorkie or a 130-lb
          Mastiff they&apos;ll diverge by a decade in the senior years, and the
          chart wins.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Multiplying dog age by 7.",
            fix: "Stop. The 7x rule is folklore, not biology. At year 1 it&apos;s off by 24 human years in the wrong direction. Use 16 × ln(age) + 31 for medium breeds, or the AVMA chart for toys and giants.",
          },
          {
            mistake: "Calling a 7-year-old large breed &quot;not even middle aged.&quot;",
            fix: "A 7-year-old Great Dane is in the senior third of its expected lifespan. Schedule the bloodwork. Giant breeds compress the entire timeline; the calendar misleads.",
          },
          {
            mistake: "Treating &quot;senior diet&quot; as a fixed calendar age.",
            fix: "Senior nutritional needs kick in by biological age, not the candle count on the cake. A small dog might enter senior at 11. A giant at 5. Match the food to the body, not the birthday.",
          },
          {
            mistake: "Plugging months into the ln() formula as if they were years.",
            fix: "Convert to years first. A 6-month-old puppy is 0.5 years, not 6. ln(0.5) is negative, which gives you 16 × (-0.69) + 31 ≈ 20 human years. That&apos;s the right answer for an adolescent puppy.",
          },
          {
            mistake: "Comparing two dogs by calendar age and ignoring breed.",
            fix: "A 10-year-old Chihuahua and a 10-year-old Newfoundland are not contemporaries. The Newfie is closer to 80 in human years, the Chihuahua closer to 56. Same calendar, different biology.",
          },
          {
            mistake: "Using log instead of ln on a calculator.",
            fix: "Most phones default to log (base 10), not ln (base e). If you only have log, multiply the log() result by 2.303 to get ln. Or just use the LN button if your calculator has it.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Wang et al. (2020): Quantitative Translation of Dog-to-Human Aging by Conserved Remodeling of the DNA Methylome, Cell Systems",
            href: "https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9",
          },
          {
            label: "American Veterinary Medical Association: How to tell your pet&apos;s age in human years",
            href: "https://www.avma.org/resources-tools/pet-owners/petcare/how-tell-your-pets-age",
          },
          {
            label: "Kraus, Pavard, Promislow (2013): The Size-Life Span Trade-Off Decomposed, The American Naturalist",
            href: "https://royalsocietypublishing.org/doi/10.1098/rspb.2013.1428",
          },
          {
            label: "American Kennel Club: How to Calculate Dog Years to Human Years",
            href: "https://www.akc.org/expert-advice/health/how-to-calculate-dog-years-to-human-years/",
          },
          {
            label: "Horvath (2013): DNA methylation age of human tissues and cell types, Genome Biology",
            href: "https://genomebiology.biomedcentral.com/articles/10.1186/gb-2013-14-10-r115",
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
