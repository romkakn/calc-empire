import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { Hero } from "@/components/eeat/Hero";
import { WorkedExample } from "@/components/eeat/WorkedExample";
import { FormulaExplained } from "@/components/eeat/FormulaExplained";
import { WhenToUse } from "@/components/eeat/WhenToUse";
import { CommonMistakes } from "@/components/eeat/CommonMistakes";
import { RelatedTerms } from "@/components/eeat/RelatedTerms";
import { FAQ } from "@/components/eeat/FAQ";
import { References } from "@/components/eeat/References";
import { Author } from "@/components/eeat/Author";
import { LastReviewed } from "@/components/eeat/LastReviewed";
import { RelatedCalculators } from "@/components/eeat/RelatedCalculators";
import { Calculator } from "./Calculator";
import {
  breadcrumbListSchema, faqPageSchema, howToSchema, jsonLd,
  personSchema, softwareApplicationSchema, type FaqItem,
} from "@/lib/schema";

const SLUG = "factor-calculator";
const TITLE = "Factor Calculator";
const DESC =
  "List every factor and the prime factorisation of any positive integer. Also flags perfect squares and primes.";

const FAQS: FaqItem[] = [
  {
    question: "What's the difference between a factor and a multiple?",
    answer:
      "A factor divides a number evenly with no remainder — 4 is a factor of 12 because 12 / 4 = 3. A multiple is the result of multiplying that number by an integer — 24, 36, and 48 are multiples of 12. Every number is both a factor and a multiple of itself.",
  },
  {
    question: "How do I find the GCF (greatest common factor) of two numbers?",
    answer:
      "List the factors of each number, then pick the largest one they share. For 12 and 18, the shared factors are 1, 2, 3, and 6 — so the GCF is 6. The Euclidean algorithm is faster for large numbers: repeatedly replace the larger value with its remainder mod the smaller, until one is zero.",
  },
  {
    question: "What is prime factorisation and why is it unique?",
    answer:
      "Prime factorisation breaks a number into the prime numbers that multiply to make it — 60 = 2 × 2 × 3 × 5. The Fundamental Theorem of Arithmetic guarantees this decomposition is unique apart from the order of the factors. That uniqueness is what makes prime factorisation so useful in number theory and cryptography.",
  },
  {
    question: "What is a perfect square?",
    answer:
      "A perfect square is an integer that equals another integer multiplied by itself — 1, 4, 9, 16, 25, and so on. A handy test: a number is a perfect square if and only if every exponent in its prime factorisation is even. So 144 = 2^4 × 3^2 is a perfect square, but 360 = 2^3 × 3^2 × 5 is not.",
  },
  {
    question: "What's a perfect number?",
    answer:
      "A perfect number equals the sum of its proper divisors (all factors except itself). 6 is the smallest example: 1 + 2 + 3 = 6. The next ones are 28, 496, and 8,128 — they get rare fast.",
  },
  {
    question: "What are factor pairs?",
    answer:
      "A factor pair is two numbers that multiply to give the original — 360 has factor pairs (1, 360), (2, 180), (3, 120), and so on up to (18, 20). Every factor below the square root has a partner above it, which is why the trial-division algorithm only loops up to sqrt(n).",
  },
  {
    question: "Where do factors show up in everyday math?",
    answer:
      "Simplifying fractions relies on dividing the top and bottom by their GCF — that's how 18 / 24 becomes 3 / 4. Finding common denominators uses the least common multiple, which is built from prime factorisations. Factoring also underpins algebra: pulling out a common factor is often the first move when solving a polynomial.",
  },
  {
    question: "Why does the algorithm only check up to the square root?",
    answer:
      "If n = a × b and a is less than or equal to b, then a is at most sqrt(n). So every factor below sqrt(n) reveals its partner above sqrt(n) for free, and you never need to test integers larger than the square root. That cuts the work from O(n) to O(sqrt(n)).",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Factors, Factor Pairs, Prime Factorisation`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Math", path: "/math" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "math", description: DESC }),
    howToSchema({
      name: "How to find all factors of a number",
      steps: [
        { name: "Enter a positive integer", text: "Use any whole number greater than 0. The calculator accepts inputs into the millions." },
        { name: "Trial-divide up to the square root", text: "For each i from 1 to sqrt(n), if n divided by i has no remainder, both i and n / i are factors." },
        { name: "Sort and deduplicate", text: "Combine each pair, remove duplicates (which only happens when n is a perfect square), and sort ascending." },
        { name: "Read the prime factorisation", text: "Divide out 2s, then 3s, then 5s, and so on until you reach 1. Group repeated primes as exponents." },
      ],
    }),
    faqPageSchema(FAQS),
    breadcrumbListSchema(breadcrumbs),
    personSchema(),
  ];

  return (
    <Container as="article" className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(...schemas) }} />

      <Breadcrumbs items={breadcrumbs} />

      <Hero title={TITLE} tagline="Type any positive integer to see every factor, every factor pair, and the prime factorisation — instantly.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Find every factor and the prime factorisation of 360."
        steps={[
          { label: "sqrt(360) ≈ 18.97 — only test i = 1 to 18", value: "" },
          { label: "Divisors found below sqrt: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18", value: "12 small factors" },
          { label: "Pair each with 360 / i: 360, 180, 120, 90, 72, 60, 45, 40, 36, 30, 24, 20", value: "12 large factors" },
          { label: "Sorted union (24 factors total)", value: "1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 180, 360" },
          { label: "Divide out primes: 360 / 2 / 2 / 2 = 45, then / 3 / 3 = 5, then / 5 = 1", value: "2^3 × 3^2 × 5" },
          { label: "Perfect square test: every exponent even? 3 and 2 and 1 — no", value: "Not a perfect square" },
        ]}
        result="360 has 24 factors. Prime factorisation: 2^3 × 3^2 × 5. Not a perfect square, not prime."
      />

      <FormulaExplained
        plainEnglish="A factor of n is any positive integer that divides n with no remainder. The trick is to loop i from 1 up to sqrt(n) — every divisor below the square root pairs with one above it, so you find all factors in a single pass. Prime factorisation strips out the smallest prime over and over until the number collapses to 1."
        formula={
          <span>
            Factors of n: for i = 1 to floor(sqrt(n)), if n mod i = 0 then push i and n / i.
            <br />
            Prime factorisation: while n &gt; 1, divide by the smallest prime p that fits; record p^k.
            <br />
            Perfect square test: every exponent in the prime factorisation is even.
          </span>
        }
        citation={{
          label: "NIST Dictionary of Algorithms and Data Structures — trial division",
          href: "https://xlinux.nist.gov/dads/HTML/trialDivision.html",
        }}
      />

      <WhenToUse
        scenarios={[
          "You're simplifying a fraction and need the GCF of the numerator and denominator.",
          "You're prepping for a pre-algebra test and want to drill factorisation.",
          "You're helping a kid with homework on multiples, factors, or LCM.",
          "You're checking whether a number is prime before using it in a math problem or puzzle.",
          "You're a teacher generating worked examples for a number-theory unit.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Forgetting that 1 and the number itself count as factors.", fix: "Every positive integer has at least two factors: 1 and itself. Primes have exactly those two." },
          { mistake: "Stopping the loop at n / 2 instead of sqrt(n).", fix: "Looping to n / 2 still works but is much slower. sqrt(n) cuts the work in half by pairing each small factor with its larger partner." },
          { mistake: "Double-counting the square root when n is a perfect square.", fix: "When i × i = n, push i only once. 36 has the factor 6, not 6 twice." },
          { mistake: "Mixing up factors and multiples.", fix: "Factors divide into n. Multiples are built from n. 4 is a factor of 12; 24 is a multiple of 12." },
          { mistake: "Treating 1 as prime.", fix: "1 is neither prime nor composite. The smallest prime is 2." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Divisor", definition: "Another word for factor — an integer that divides n with no remainder." },
          { term: "Prime number", definition: "A positive integer greater than 1 whose only factors are 1 and itself." },
          { term: "Composite number", definition: "A positive integer greater than 1 that has at least one factor other than 1 and itself." },
          { term: "GCF / GCD", definition: "Greatest Common Factor (or Divisor) — the largest integer that divides two or more numbers." },
          { term: "LCM", definition: "Least Common Multiple — the smallest positive integer that two or more numbers all divide into." },
          { term: "Perfect square", definition: "An integer of the form k × k. Equivalently, every exponent in its prime factorisation is even." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST Dictionary of Algorithms and Data Structures — trial division", href: "https://xlinux.nist.gov/dads/HTML/trialDivision.html" },
          { label: "OpenStax Prealgebra 2e — Prime Factorization and the Least Common Multiple", href: "https://openstax.org/books/prealgebra-2e/pages/2-4-find-multiples-and-factors" },
          { label: "Khan Academy — Factors and multiples", href: "https://www.khanacademy.org/math/cc-fourth-grade-math/factors-multiples" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-05-31" />

      <RelatedCalculators slugs={["fractions-calculator", "square-root-calculator", "long-division-calculator"]} />
    </Container>
  );
}
