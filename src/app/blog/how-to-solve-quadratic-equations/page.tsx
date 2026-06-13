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

const POST = getPostBySlug("how-to-solve-quadratic-equations")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "Which method should I try first on a quadratic?",
    answer:
      "Try factoring for 10 seconds. If the leading coefficient is 1 and you can spot two integers that multiply to c and add to b, you&apos;re done in a line. If nothing jumps out, skip straight to the quadratic formula. Completing the square is rarely the fastest path unless the problem hands you a perfect setup.",
  },
  {
    question: "What does the discriminant actually tell you?",
    answer:
      "The discriminant is b² − 4ac, the part under the square root in the formula. Positive means two real solutions. Zero means one repeated real solution (the parabola just touches the x-axis). Negative means two complex conjugate solutions, no real x-intercepts.",
  },
  {
    question: "Why do some quadratics have complex roots?",
    answer:
      "Because the parabola never crosses the x-axis. Algebraically, b² − 4ac is negative, so you&apos;re taking the square root of a negative number. The solutions come out as a ± bi where i is the imaginary unit. They still exist, just not on the real number line.",
  },
  {
    question: "Can every quadratic be factored over integers?",
    answer:
      "No. A quadratic factors cleanly over integers only when the discriminant is a perfect square. Most random quadratics fail that test. That&apos;s why the quadratic formula exists; it handles every case, integer-friendly or not.",
  },
  {
    question: "Is completing the square ever the fastest method?",
    answer:
      "Rarely for finding roots. It shines when you need vertex form, y = a(x − h)² + k, for graphing or optimization problems. Derive the formula once by completing the square on ax² + bx + c, then keep the formula in your back pocket for actual root-finding.",
  },
  {
    question: "What does the quadratic formula give when a equals 1?",
    answer:
      "It simplifies a bit but still works the same way. With a = 1, the formula becomes x = (−b ± √(b² − 4c)) / 2. The denominator is just 2 instead of 2a. The structure stays identical.",
  },
  {
    question: "Why does the ± symbol show up in the formula?",
    answer:
      "Because a square root has two values. √9 is technically ±3. A quadratic generally has two solutions, so the ± gives you both at once: one from adding the radical, one from subtracting it.",
  },
  {
    question: "Do these methods work on cubic or higher equations?",
    answer:
      "No. Factoring extends to higher degrees by trial, but completing the square and the quadratic formula are quadratic-only. Cubics have their own formula (Cardano&apos;s), quartics too, but quintics and higher have no general algebraic solution (Abel-Ruffini, 1824).",
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
        "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations",
        "https://mathworld.wolfram.com/QuadraticEquation.html",
        "https://www.britannica.com/science/quadratic-equation",
        "https://tutorial.math.lamar.edu/classes/alg/quadraticeqnsi.aspx",
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
          Factoring, completing the square, the quadratic formula. Three
          methods, same answer, very different speeds depending on the equation
          in front of you. This post runs all three through the same three
          problems so you can see which one wins and why, plus what the
          discriminant tells you before you start.
        </p>
      </header>

      <CTACard
        slug="quadratic-formula-calculator"
        label="Skip the algebra"
        title="Use our Quadratic Formula Calculator"
        body="Plug in a, b, c and get both roots, the discriminant, and the vertex in one pass. The post below is for the people who want to know which method to reach for first, and why."
      />

      <Section id="the-setup" title="Three methods, one equation type">
        <p>
          Every quadratic looks the same: ax² + bx + c = 0, with a ≠ 0. Three
          coefficients, two solutions (almost always). You have three tools to
          find those solutions, and they&apos;re wildly different in speed
          depending on what a, b, and c happen to be.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-2">
          <li>
            <strong>Factoring.</strong> Rewrite the quadratic as (px + q)(rx +
            s) = 0 and set each factor to zero. Fast when it works, useless when
            it doesn&apos;t.
          </li>
          <li>
            <strong>Completing the square.</strong> Force the left side into a
            perfect square trinomial, then square-root both sides. Always
            works, almost always slow.
          </li>
          <li>
            <strong>The quadratic formula.</strong> Plug a, b, c into x = (−b ±
            √(b² − 4ac)) / 2a. Always works, mechanical, hard to mess up if you
            keep signs straight.
          </li>
        </ol>
        <p>
          The trick is knowing which to try first. A good rule of thumb: if you
          can&apos;t factor it in 10 seconds, go straight to the formula. Don&apos;t
          burn three minutes hunting for integer pairs that aren&apos;t there.
        </p>
      </Section>

      <Section id="discriminant-first" title="Read the discriminant before you pick a method">
        <p>
          The discriminant is the part of the formula under the radical: b² −
          4ac. Compute it first. It tells you what kind of solutions exist
          before you commit to a method.
        </p>
        <Formula>
          Δ = b² − 4ac
        </Formula>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <strong>Δ &gt; 0:</strong> two distinct real solutions. The parabola
            crosses the x-axis twice. Factoring might work if Δ is also a
            perfect square.
          </li>
          <li>
            <strong>Δ = 0:</strong> one repeated real solution. The parabola
            touches the x-axis at the vertex and bounces off. The equation
            factors as a perfect square.
          </li>
          <li>
            <strong>Δ &lt; 0:</strong> two complex conjugate solutions, a ± bi.
            The parabola never crosses the x-axis. Don&apos;t bother trying to
            factor over integers; you&apos;ll fail.
          </li>
        </ul>
        <p>
          A perfect-square discriminant is the green light for factoring. 25,
          49, 121, 144 - if you see one of those (or any other integer square),
          there&apos;s a clean factor pair waiting. Confirm with our{" "}
          <Link
            href="/square-root-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            square root calculator
          </Link>{" "}
          if the number is awkward.
        </p>
      </Section>

      <Section id="method-1" title="Method 1: Factoring (the fast path when it exists)">
        <p>
          Factoring is the fastest method when it works. For ax² + bx + c = 0
          with a = 1, find two numbers that multiply to c and add to b. Write
          them as (x + m)(x + n) = 0 and set each factor to zero.
        </p>
        <p>
          When a ≠ 1, you use the AC method: multiply a × c, find a factor pair
          of that product that adds to b, then split the middle term and factor
          by grouping. It&apos;s slower than a = 1 but still beats the formula
          if the numbers cooperate.
        </p>
        <h3 className="md-title-large mt-6">Worked example: x² − 5x + 6 = 0</h3>
        <WorkedSteps
          steps={[
            { label: "Identify a, b, c", value: "a = 1, b = −5, c = 6" },
            { label: "Discriminant", value: "(−5)² − 4(1)(6) = 25 − 24 = 1 (perfect square)" },
            { label: "Find m, n", value: "m × n = 6, m + n = −5 → m = −2, n = −3" },
            { label: "Factor", value: "(x − 2)(x − 3) = 0" },
            { label: "Solve each factor", value: "x = 2 or x = 3" },
          ]}
        />
        <p>
          Total time on paper: about 30 seconds. The discriminant told us up
          front that integer factoring would work, and the factor pair fell out
          of mental arithmetic. This is the kind of problem the textbook gives
          you in chapter one. Real equations don&apos;t usually look this nice.
        </p>
      </Section>

      <Section id="method-2" title="Method 2: Completing the square">
        <p>
          Take ax² + bx + c = 0, isolate the constant, divide through by a so
          the coefficient on x² is 1, then add (b/2a)² to both sides. The left
          side is now a perfect square. Square-root both sides and solve for x.
        </p>
        <p>
          It&apos;s mechanical but tedious. The one place it&apos;s genuinely
          useful: converting to vertex form for graphing, since y = a(x − h)² +
          k makes the vertex (h, k) obvious. For pure root-finding, it&apos;s
          almost never the right pick.
        </p>
        <h3 className="md-title-large mt-6">Worked example: x² − 5x + 6 = 0 (same equation)</h3>
        <WorkedSteps
          steps={[
            { label: "Move constant", value: "x² − 5x = −6" },
            { label: "Half of b, squared", value: "(−5/2)² = 25/4" },
            { label: "Add to both sides", value: "x² − 5x + 25/4 = −6 + 25/4 = 1/4" },
            { label: "Perfect square", value: "(x − 5/2)² = 1/4" },
            { label: "Square root", value: "x − 5/2 = ±1/2" },
            { label: "Solve", value: "x = 5/2 ± 1/2 → x = 3 or x = 2" },
          ]}
        />
        <p>
          Same answer, three times the work. If you had to do this on a timed
          exam, you&apos;d lose two minutes to fractions. Save completing the
          square for the cases where you actually need vertex form, or for
          deriving the quadratic formula one time and then trusting it forever.
        </p>
      </Section>

      <Section id="method-3" title="Method 3: The quadratic formula">
        <p>
          The formula is the universal solvent. It works on every quadratic,
          factorable or not, real roots or complex. Memorize it, drill it,
          trust it.
        </p>
        <Formula>
          x = (−b ± √(b² − 4ac)) / 2a
        </Formula>
        <p>
          The ± gives you both roots at once. The radical is the discriminant
          you already computed. The denominator is 2a, not just 2 - a common
          slip on the first attempt. Once you&apos;ve done five of these the
          pattern locks in.
        </p>
        <h3 className="md-title-large mt-6">Worked example: x² − 5x + 6 = 0 (same equation, third time)</h3>
        <WorkedSteps
          steps={[
            { label: "Identify a, b, c", value: "a = 1, b = −5, c = 6" },
            { label: "Discriminant", value: "(−5)² − 4(1)(6) = 1" },
            { label: "Plug in", value: "x = (5 ± √1) / 2 = (5 ± 1) / 2" },
            { label: "Two roots", value: "x = 6/2 = 3 or x = 4/2 = 2" },
          ]}
        />
        <p>
          About 40 seconds, slightly slower than factoring on this softball
          problem but with zero hunting for a factor pair. On a harder
          equation, the formula pulls ahead immediately because the work
          doesn&apos;t change with the coefficients.
        </p>
      </Section>

      <Section id="harder-problem" title="A harder problem where factoring fails">
        <p>
          Try 2x² + 3x − 7 = 0. The discriminant is 9 + 56 = 65, which is not a
          perfect square. Factoring over integers is impossible. So now what?
        </p>
        <h3 className="md-title-large mt-6">Factoring attempt</h3>
        <p>
          You&apos;d look for two numbers that multiply to (2)(−7) = −14 and add
          to 3. The integer pairs of −14 are (1, −14), (−1, 14), (2, −7), (−2,
          7). Sums: −13, 13, −5, 5. None equal 3. Dead end. Move on, don&apos;t
          waste another 30 seconds.
        </p>
        <h3 className="md-title-large mt-6">Quadratic formula attempt</h3>
        <WorkedSteps
          steps={[
            { label: "a, b, c", value: "a = 2, b = 3, c = −7" },
            { label: "Discriminant", value: "3² − 4(2)(−7) = 9 + 56 = 65" },
            { label: "Plug in", value: "x = (−3 ± √65) / 4" },
            { label: "Decimal form", value: "x ≈ (−3 + 8.062) / 4 ≈ 1.266 or x ≈ (−3 − 8.062) / 4 ≈ −2.766" },
          ]}
        />
        <p>
          Done in 40 seconds. The roots are irrational, so you leave them in
          exact form (with the √65) for a math class and convert to decimals
          for a physics or engineering problem. If you need to verify the
          factorization side of things on a similar problem, check our{" "}
          <Link
            href="/factor-calculator"
            className="text-[var(--md-sys-color-primary)] underline underline-offset-4"
          >
            factor calculator
          </Link>{" "}
          for whatever integer the AC method spits out.
        </p>
      </Section>

      <Section id="complex-roots" title="When the discriminant goes negative">
        <p>
          Take x² + 2x + 5 = 0. Discriminant: 4 − 20 = −16. Negative. The
          parabola y = x² + 2x + 5 sits entirely above the x-axis and never
          crosses it, so there are no real roots. But the equation still has
          solutions in the complex numbers.
        </p>
        <WorkedSteps
          steps={[
            { label: "a, b, c", value: "a = 1, b = 2, c = 5" },
            { label: "Discriminant", value: "2² − 4(1)(5) = 4 − 20 = −16" },
            { label: "√Δ", value: "√(−16) = 4i" },
            { label: "Plug in", value: "x = (−2 ± 4i) / 2" },
            { label: "Simplify", value: "x = −1 ± 2i" },
          ]}
        />
        <p>
          Two complex conjugate solutions: −1 + 2i and −1 − 2i. They always
          come in conjugate pairs when the coefficients are real, because the
          ± in the formula flips the sign on the imaginary part. This is
          standard fare in any algebra II or precalc class and the basis for
          impedance calculations in electrical engineering.
        </p>
      </Section>

      <Section id="decision-tree" title="The decision tree (what to try first)">
        <p>
          Here&apos;s the order I actually use, refined over a decade of
          tutoring kids and engineers through quadratics.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Compute the discriminant first.</strong> 10 seconds. Tells
            you whether you&apos;re looking for real or complex roots, and
            whether factoring stands a chance.
          </li>
          <li>
            <strong>If Δ is a perfect square and a = 1, factor.</strong> 30
            seconds. Fastest path when it&apos;s open.
          </li>
          <li>
            <strong>If Δ is a perfect square but a ≠ 1, try the AC method
            once.</strong> 60 seconds max. If the factor pair doesn&apos;t
            appear, abandon and switch.
          </li>
          <li>
            <strong>Otherwise, use the quadratic formula.</strong> 40 seconds,
            works on everything, no guessing.
          </li>
          <li>
            <strong>Use completing the square only for vertex form.</strong>{" "}
            Don&apos;t use it for root-finding unless your homework
            specifically asks for the method.
          </li>
        </ol>
        <p>
          A clean strategy beats raw speed on any one method. The students who
          struggle most with quadratics aren&apos;t bad at algebra; they pick
          the wrong tool and grind through three minutes of work when they
          could&apos;ve been done in 40 seconds.
        </p>
      </Section>

      <Section id="verify" title="How to verify your roots (in 10 seconds)">
        <p>
          Two checks. Both quick, both worth doing on every problem.
        </p>
        <p>
          <strong>Sum and product check.</strong> By Vieta&apos;s formulas, if
          x₁ and x₂ are the roots of ax² + bx + c = 0, then x₁ + x₂ = −b/a and
          x₁ × x₂ = c/a. For x² − 5x + 6 = 0 the roots were 2 and 3. Sum: 5 =
          −(−5)/1 ✓. Product: 6 = 6/1 ✓. Takes five seconds and catches almost
          every arithmetic slip.
        </p>
        <p>
          <strong>Plug-back check.</strong> Substitute one root into the
          original equation and confirm it gives zero. For x = 3: 9 − 15 + 6 =
          0 ✓. Slower than the sum/product check, but it catches sign errors
          the Vieta check can miss.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Dropping the ± when taking a square root.",
            fix: "Every √ in the quadratic formula gives two values. Write the ± explicitly each time so you don&apos;t lose the second root. Half the &quot;wrong answer&quot; problems on exams come from this one slip.",
          },
          {
            mistake: "Forgetting to divide by 2a, not just 2.",
            fix: "The denominator is 2a. When a = 1 it&apos;s just 2, but when a = 3 it&apos;s 6. Write 2a first, then substitute. Don&apos;t shortcut on a problem where a ≠ 1.",
          },
          {
            mistake: "Misreading negative coefficients in the discriminant.",
            fix: "b² − 4ac with negative b is still positive b². (−5)² = 25, not −25. And 4ac picks up a negative sign if c is negative, making the discriminant larger, not smaller.",
          },
          {
            mistake: "Trying to factor for too long.",
            fix: "Set a 60-second timer in your head. If no integer pair appears, switch to the formula. Factoring fails on most random quadratics; that&apos;s the rule, not the exception.",
          },
          {
            mistake: "Treating the equation before it equals zero.",
            fix: "ax² + bx + c = 5 is not in standard form. Subtract 5 from both sides first to get ax² + bx + (c − 5) = 0. The methods only work on the standard form.",
          },
          {
            mistake: "Calling complex roots &quot;no solution&quot;.",
            fix: "A negative discriminant means no real solutions, not no solutions at all. The roots exist in the complex numbers as a ± bi. For most algebra II and beyond, you&apos;re expected to write them out, not skip them.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "Khan Academy: Quadratic functions & equations",
            href: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations",
          },
          {
            label: "Wolfram MathWorld: Quadratic Equation",
            href: "https://mathworld.wolfram.com/QuadraticEquation.html",
          },
          {
            label: "Encyclopedia Britannica: Quadratic Equation",
            href: "https://www.britannica.com/science/quadratic-equation",
          },
          {
            label: "Paul&apos;s Online Notes (Lamar University): Quadratic Equations",
            href: "https://tutorial.math.lamar.edu/classes/alg/quadraticeqnsi.aspx",
          },
          {
            label: "MIT OpenCourseWare: 18.01 Single Variable Calculus (quadratic prerequisites)",
            href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/",
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
