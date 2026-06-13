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

const POST = getPostBySlug("derivative-vs-integral")!;

const TITLE = POST.title;
const DESC = POST.description;
const SLUG_PATH = `blog/${POST.slug}`;

const FAQS: FaqItem[] = [
  {
    question: "What is the simplest way to tell a derivative from an integral?",
    answer:
      "A derivative answers &apos;how fast is this changing right now?&apos; An integral answers &apos;how much has piled up?&apos; Position to velocity is a derivative. Velocity back to distance is an integral. Same curve, opposite questions.",
  },
  {
    question: "Is integration really the opposite of differentiation?",
    answer:
      "Yes, and that&apos;s the fundamental theorem of calculus. If F is an antiderivative of f, then the integral of f from a to b equals F(b) - F(a). Differentiating F gives you f back. The two operations undo each other up to a constant.",
  },
  {
    question: "Why do indefinite integrals have a + C and derivatives don&apos;t?",
    answer:
      "Because the derivative of any constant is zero. When you reverse the process, you can&apos;t recover which constant was there. The + C just says &apos;any vertical shift of this curve also works.&apos; Definite integrals don&apos;t need it because the constants cancel in the subtraction.",
  },
  {
    question: "When does a function have a derivative but no clean integral?",
    answer:
      "Most of the time, honestly. e^(-x²) has a derivative you can write in one line, but its integral is the error function with no elementary closed form. Engineers use numerical methods (Simpson&apos;s rule, Gaussian quadrature) for those.",
  },
  {
    question: "Do I need limits to understand either one?",
    answer:
      "Limits are the engine underneath both. A derivative is the limit of a difference quotient. A Riemann integral is the limit of a sum of rectangles. If you&apos;re shaky on limits, the limit calculator is a good place to build intuition before tackling these two.",
  },
  {
    question: "Which one shows up more in real engineering work?",
    answer:
      "Depends on the field. Control systems and signal processing lean on derivatives (rates, slopes, transfer functions). Finance, physics, and biology lean on integrals (totals over time, areas, accumulated dose). Most real problems use both inside the same model.",
  },
  {
    question: "Is the derivative of a curve always the slope of its tangent line?",
    answer:
      "At any point where the function is differentiable, yes. At sharp corners (|x| at x=0) or vertical tangents (cube root at x=0), the derivative doesn&apos;t exist even though the curve is continuous. Smooth curves have tangent slopes everywhere.",
  },
  {
    question: "What does a definite integral give me geometrically?",
    answer:
      "Signed area between the curve and the x-axis between two bounds. Above the axis counts positive, below counts negative. If you want unsigned area, integrate the absolute value of the function.",
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
        "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/",
        "https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx",
        "https://mathworld.wolfram.com/FundamentalTheoremsofCalculus.html",
        "https://nrich.maths.org/public/leg.php?code=-68",
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
          One measures change. The other measures accumulation. That&apos;s the
          whole distinction, and most textbooks bury it under three weeks of
          algebra. Here&apos;s the plain-English version, the fundamental theorem
          that ties them together, and five concrete cases from physics,
          finance, biology, and signal work where picking the wrong one wastes a
          whole afternoon.
        </p>
      </header>

      <CTACard
        slug="derivative-calculator"
        label="Just want the answer"
        title="Use our Derivative Calculator"
        body="If you came here to solve a specific f(x) and move on, plug it in. The calculator handles polynomials, trig, exponentials, chain rule, the works. The post below is for understanding why the answer is what it is, and when to reach for the integral side of the coin instead."
      />

      <Section id="same-coin" title="Same coin, two sides">
        <p>
          Drop a marble off a balcony. At 1 second it&apos;s fallen about 16
          feet. At 2 seconds, 64 feet. At 3 seconds, 144 feet. That table is a
          position function: how far the marble has fallen at each moment in
          time.
        </p>
        <p>
          Ask &quot;how fast is the marble moving at t = 2 seconds?&quot; and
          you&apos;re asking for a derivative. The answer is 64 feet per second.
          Differentiate position with respect to time and you get velocity. Same
          curve, new question.
        </p>
        <p>
          Now flip it. Someone hands you a velocity graph and asks how far the
          marble traveled between t = 1 and t = 3. You add up the velocity over
          that window. That&apos;s an integral. The area under the velocity curve
          equals the distance covered. Same physics, opposite operation.
        </p>
        <Formula>
          velocity(t) = d/dt [ position(t) ]&nbsp;&nbsp;&nbsp;
          distance = ∫ velocity(t) dt
        </Formula>
        <p>
          Both operations live on the same function. One peels a layer off
          (derivative), the other adds a layer back (integral). The{" "}
          <Link href="/derivative-calculator">derivative calculator</Link> and
          the <Link href="/integral-calculator">integral calculator</Link> exist
          because the two operations need different machinery, even though
          they&apos;re the same idea seen from opposite ends.
        </p>
      </Section>

      <Section id="fundamental-theorem" title="The fundamental theorem, in plain English">
        <p>
          Calculus has one big theorem at its center. Most students memorize the
          statement, fewer get the feel for what it&apos;s saying.
        </p>
        <Formula>
          ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)&nbsp;&nbsp;where
          F&apos;(x) = f(x)
        </Formula>
        <p>
          Translation: if you want the total accumulation of f between two
          points, you don&apos;t have to add up infinite tiny rectangles. Find
          any function F whose derivative is f, then subtract its values at the
          endpoints. Two function evaluations replace an infinite sum.
        </p>
        <p>
          The reason this works is the central insight: differentiation and
          integration are inverse operations. Smear a function out by
          integrating, then differentiate the result, and you&apos;re back where
          you started. That&apos;s why every basic derivative rule has a mirror
          integral rule, and why an antiderivative table is just a derivative
          table read right to left.
        </p>
        <p>
          The +C on indefinite integrals is the only awkward bit. The derivative
          of any constant is zero, so when you invert the process, you can&apos;t
          recover which constant was there. Definite integrals don&apos;t need
          it because F(b) − F(a) cancels the constant out.
        </p>
      </Section>

      <Section id="five-cases" title="Five real cases where one is obviously the right tool">
        <p>
          Textbooks teach the rules. Practice teaches the choice. Here are five
          situations from different fields where the question itself tells you
          which side of the coin you need.
        </p>

        <h3 className="md-title-large mt-6">1. Physics: position, velocity, acceleration</h3>
        <p>
          A car&apos;s GPS logs position every second. You want the speed at
          mile 12. That&apos;s a derivative. dPosition/dTime gives velocity.
          Differentiate velocity once more and you get acceleration. NASA built
          the Apollo guidance computer around exactly this stack.
        </p>
        <WorkedSteps
          steps={[
            { label: "Position", value: "s(t) = 4.9 t² (meters)" },
            { label: "Velocity", value: "ds/dt = 9.8 t (m/s)" },
            { label: "Acceleration", value: "dv/dt = 9.8 m/s² (gravity)" },
            { label: "At t = 3 s", value: "v = 29.4 m/s, a = 9.8 m/s²" },
          ]}
        />
        <p>
          Flip it: an accelerometer gives you acceleration over time. To
          recover velocity and position, you integrate twice. Inertial
          navigation systems on submarines and aircraft do this in real time
          when GPS isn&apos;t available.
        </p>

        <h3 className="md-title-large mt-10">2. Geometry: area under a curve</h3>
        <p>
          A solar panel&apos;s power output varies through the day. You have a
          curve of watts vs hours. Total energy generated is the area under
          that curve, in watt-hours. That&apos;s a definite integral, and
          it&apos;s how your utility company bills you.
        </p>
        <WorkedSteps
          steps={[
            { label: "Power curve", value: "P(t) = 400 sin(πt/12) watts" },
            { label: "Window", value: "t = 0 to 12 hours" },
            { label: "Energy", value: "∫₀¹² 400 sin(πt/12) dt" },
            { label: "Antiderivative", value: "−(4800/π) cos(πt/12)" },
            { label: "Result", value: "(4800/π) × 2 ≈ 3,056 watt-hours" },
          ]}
        />
        <p>
          A derivative on this same curve would tell you the rate of power
          change at, say, noon (when the sun peaks). Useful for inverter sizing.
          Different question, different tool.
        </p>

        <h3 className="md-title-large mt-10">3. Finance: present value of a cash flow</h3>
        <p>
          A pension promises $50,000 a year for 20 years. What&apos;s it worth
          today at a 5% discount rate? You integrate the discounted cash flow
          over the 20-year window. The continuous-time version is a clean
          integral; the discrete version is its Riemann-sum cousin.
        </p>
        <Formula>
          PV = ∫<sub>0</sub><sup>20</sup> 50,000 e<sup>−0.05 t</sup> dt = (50,000 / 0.05)
          (1 − e<sup>−1</sup>) ≈ $632,121
        </Formula>
        <p>
          Now ask the dual question: at what rate is the present value
          increasing right now if I delay retirement one year? That&apos;s a
          derivative with respect to the time horizon. Actuaries call it the
          marginal value of deferral.
        </p>

        <h3 className="md-title-large mt-10">4. Biology: drug concentration and total exposure</h3>
        <p>
          A patient takes an oral dose. Plasma concentration rises, peaks, then
          decays exponentially. Doctors care about two numbers: the peak (when
          and how high) and the AUC, area under the curve. The peak is found by
          setting the derivative to zero. The AUC is the integral over the
          dosing interval, and the FDA uses it to compare generic drugs to the
          brand name.
        </p>
        <WorkedSteps
          steps={[
            { label: "Concentration model", value: "C(t) = D (e^(−ke t) − e^(−ka t))" },
            { label: "Peak time", value: "set dC/dt = 0 → t_peak = ln(ka/ke)/(ka−ke)" },
            { label: "AUC₀₋∞", value: "∫₀^∞ C(t) dt = D/(ke)" },
            { label: "Bioequivalence band (FDA)", value: "AUC ratio 80% to 125%" },
          ]}
        />
        <p>
          One curve, both questions. Toxicologists run the same play with
          environmental exposure: peak intake matters for acute effects,
          accumulated dose matters for chronic ones.
        </p>

        <h3 className="md-title-large mt-10">5. Signal processing: rates and accumulators</h3>
        <p>
          An EKG trace is voltage over time. Cardiologists look for the QRS
          complex by tracking how fast the voltage is changing, which is the
          derivative of the signal. A sudden spike in dV/dt is the heartbeat. The
          algorithms built into pacemakers literally compute a running
          derivative.
        </p>
        <p>
          Meanwhile, a charge integrator on a particle detector at CERN sums
          the current pulse over a microsecond window to count electrons. The
          total charge collected is the integral of current. Both circuits are
          everywhere in instrumentation, and they&apos;re duals of each other
          at the schematic level: swap a resistor and capacitor and a
          differentiator becomes an integrator.
        </p>
      </Section>

      <Section id="rules-cheat-sheet" title="The rule pairs you actually need">
        <p>
          The rules look like a wall of symbols in a textbook. Read them as
          pairs and they collapse to about six lines you have to memorize. Every
          derivative on the left has a mirror integral on the right.
        </p>
        <table className="md-table mt-3">
          <thead>
            <tr>
              <th>Function</th>
              <th>Derivative</th>
              <th>Integral</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>x<sup>n</sup></td>
              <td>n x<sup>n−1</sup></td>
              <td>x<sup>n+1</sup> / (n+1) + C</td>
            </tr>
            <tr>
              <td>e<sup>x</sup></td>
              <td>e<sup>x</sup></td>
              <td>e<sup>x</sup> + C</td>
            </tr>
            <tr>
              <td>ln(x)</td>
              <td>1/x</td>
              <td>x ln(x) − x + C</td>
            </tr>
            <tr>
              <td>sin(x)</td>
              <td>cos(x)</td>
              <td>−cos(x) + C</td>
            </tr>
            <tr>
              <td>cos(x)</td>
              <td>−sin(x)</td>
              <td>sin(x) + C</td>
            </tr>
            <tr>
              <td>1/x</td>
              <td>−1/x²</td>
              <td>ln|x| + C</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3">
          Power rule covers most of what calculus 1 throws at you. The trig and
          exponential rows handle physics and engineering. Anything more exotic
          (inverse trig, hyperbolic, gamma) is a lookup, not memorization.
          Paul&apos;s Online Math Notes at Lamar University keeps a free
          reference that&apos;s been mirrored on every engineering student&apos;s
          laptop since 2003.
        </p>
      </Section>

      <Section id="when-stuck" title="When you&apos;re stuck: which side am I on?">
        <p>
          Three signals tell you the problem is a derivative:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>The question contains a rate, a slope, or a &quot;per&quot; (miles per hour, dollars per share, deaths per 100,000).</li>
          <li>You want the instantaneous value of something that changes (speed at a moment, marginal cost at a quantity).</li>
          <li>You&apos;re finding a maximum or minimum (set the derivative to zero).</li>
        </ul>
        <p>
          Three signals tell you the problem is an integral:
        </p>
        <ul className="mt-2 list-disc pl-5">
          <li>The question contains a total, an accumulation, or an area.</li>
          <li>You have a rate and need the quantity (velocity to distance, current to charge, flow to volume).</li>
          <li>You want an average value over a range (the integral divided by the range length).</li>
        </ul>
        <p>
          If the wording mixes both (&quot;average rate of growth over the
          decade&quot;), you&apos;ll need both. Compute the integral, divide by
          the time window, and you have the average. If you&apos;re unsure
          whether the function even has a well-defined value at the endpoint,
          back up and check with the <Link href="/limit-calculator">limit calculator</Link>{" "}
          before integrating.
        </p>
      </Section>

      <Section id="numerical" title="When the symbols won&apos;t cooperate">
        <p>
          Real-world functions often don&apos;t have closed-form antiderivatives.
          A normal distribution&apos;s integral is the error function. The
          period of a pendulum at large angles needs an elliptic integral.
          Engineers don&apos;t fight this; they switch to numerical methods.
        </p>
        <ol className="mt-4 list-decimal pl-5 space-y-3">
          <li>
            <strong>Trapezoidal rule.</strong> Approximate the area under the
            curve with trapezoids. Easy to code, fine for smooth functions, error
            shrinks like 1/n².
          </li>
          <li>
            <strong>Simpson&apos;s rule.</strong> Fit parabolas through groups of
            three points. Error shrinks like 1/n⁴. The workhorse of
            engineering libraries.
          </li>
          <li>
            <strong>Gaussian quadrature.</strong> Hand-picked sample points that
            integrate polynomials of high degree exactly. What SciPy&apos;s
            quad() function uses under the hood.
          </li>
          <li>
            <strong>Monte Carlo.</strong> Random sampling. Convergence is slow
            (1/√n), but it scales painlessly into high dimensions, which is
            why finance and physics use it for path integrals.
          </li>
        </ol>
        <p>
          For derivatives the dual problem is numerical differentiation: a
          finite-difference approximation of df/dx using f(x+h) − f(x−h) over
          2h. Pick h too big and the answer is biased. Pick h too small and
          floating-point noise eats the signal. The sweet spot is usually around
          √(machine epsilon), about 10⁻⁸ in double precision.
        </p>
      </Section>

      <CommonMistakes
        items={[
          {
            mistake: "Forgetting + C on an indefinite integral.",
            fix: "Indefinite integrals describe a whole family of curves that differ only by a vertical shift. Leaving off the constant on a homework problem is points off. Forgetting it in a physics derivation can flip a sign in your equations of motion.",
          },
          {
            mistake: "Treating dx as &apos;just notation.&apos;",
            fix: "It looks like notation but it carries units and substitution information. When you do u-substitution, the dx becomes du times the inner derivative. Skipping that step is how integrals come out off by a constant factor.",
          },
          {
            mistake: "Differentiating before checking the function is smooth.",
            fix: "Absolute value, step functions, and piecewise definitions can have corners where the derivative doesn&apos;t exist. Plot the function or check both one-sided limits before quoting a derivative at a tricky point.",
          },
          {
            mistake: "Confusing average rate with instantaneous rate.",
            fix: "Average rate is a difference quotient: [f(b) − f(a)] / (b − a). Instantaneous rate is the derivative at a single point. The mean value theorem says they&apos;re equal somewhere inside the interval, but not necessarily at the endpoints.",
          },
          {
            mistake: "Integrating across a discontinuity without splitting.",
            fix: "If the function blows up inside the integration window (1/x across zero, for example), you can&apos;t just plug into F(b) − F(a). Split the integral at the singularity and treat each piece as an improper integral, or the answer is meaningless.",
          },
          {
            mistake: "Memorizing rules without testing units.",
            fix: "Differentiate position (meters) with respect to time (seconds) and you&apos;d better get m/s. Integrate velocity (m/s) over time (s) and you&apos;d better get meters. Unit checks catch more sign and factor errors than re-deriving the work does.",
          },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          {
            label: "MIT OpenCourseWare: 18.01 Single Variable Calculus",
            href: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/",
          },
          {
            label: "Paul&apos;s Online Math Notes: Derivatives and Integrals (Lamar University)",
            href: "https://tutorial.math.lamar.edu/Classes/CalcI/DerivativeIntro.aspx",
          },
          {
            label: "Wolfram MathWorld: Fundamental Theorems of Calculus",
            href: "https://mathworld.wolfram.com/FundamentalTheoremsofCalculus.html",
          },
          {
            label: "FDA Guidance: Bioequivalence Studies (AUC and Cmax)",
            href: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/bioequivalence-studies-pharmacokinetic-endpoints-drugs-submitted-under-anda",
          },
          {
            label: "NIST Digital Library of Mathematical Functions: Quadrature",
            href: "https://dlmf.nist.gov/3.5",
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
