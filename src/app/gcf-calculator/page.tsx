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

const SLUG = "gcf-calculator";
const TITLE = "GCF Calculator";
const DESC =
  "Greatest common factor of any number set. Euclidean algorithm shown step by step, with prime-factorisation cross-check.";

const FAQS: FaqItem[] = [
  {
    question: "Is GCF the same as GCD or HCF?",
    answer:
      "Yes. Greatest Common Factor (GCF), Greatest Common Divisor (GCD), and Highest Common Factor (HCF) all name the same number — the largest positive integer that divides every value in your set without a remainder. Textbooks pick a label based on country and grade level.",
  },
  {
    question: "How does the Euclidean algorithm work?",
    answer:
      "Divide the larger number by the smaller and keep the remainder. Replace the pair with (smaller, remainder) and repeat. When the remainder hits zero, the other number is the GCF — and it converges in only a few steps even for big inputs.",
  },
  {
    question: "What is the prime-factorisation method?",
    answer:
      "Break each number into its prime factors, then multiply the primes shared by every number using the lowest exponent that appears. For 12 = 2 squared times 3 and 18 = 2 times 3 squared, the shared primes give 2 times 3 = 6.",
  },
  {
    question: "What are coprime numbers?",
    answer:
      "Two integers are coprime (or relatively prime) when their GCF is 1. For example, 9 and 28 share no prime factors, so gcd(9, 28) = 1. Coprime pairs show up often in fraction reduction and modular arithmetic.",
  },
  {
    question: "How do I find the GCF of three or more numbers?",
    answer:
      "Take the GCF of the first two numbers, then take the GCF of that result with the next number, and keep chaining. The identity gcd(a, b, c) = gcd(gcd(a, b), c) means order does not matter.",
  },
  {
    question: "What is the relationship between GCF and LCM?",
    answer:
      "For any two positive integers, a times b equals gcd(a, b) times lcm(a, b). So once you know the GCF you can read off the LCM with one division: lcm(a, b) = (a times b) divided by gcd(a, b).",
  },
  {
    question: "Where do I actually use a GCF in real life?",
    answer:
      "The most common use is simplifying fractions to lowest terms — divide both numerator and denominator by their GCF. It also shows up when splitting items into equal groups, tiling a rectangle with square tiles, and reducing ratios.",
  },
  {
    question: "Can the GCF be larger than the smallest number in the set?",
    answer:
      "No. The GCF must divide every number in the set, so it cannot exceed the smallest value. The maximum possible GCF equals the smallest number — and that only happens when the smallest number divides all the others.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Greatest Common Factor with Euclidean Steps`,
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
      name: "How to find the greatest common factor with the Euclidean algorithm",
      steps: [
        { name: "List your numbers", text: "Enter two or more positive integers — for example 12, 18, 24." },
        { name: "Run the Euclidean step on a pair", text: "Replace the larger with its remainder mod the smaller. Keep doing this until the remainder hits zero." },
        { name: "Read off the pairwise GCF", text: "When the remainder is zero, the other number is gcd(a, b) for that pair." },
        { name: "Chain across the set", text: "Use gcd(a, b, c) = gcd(gcd(a, b), c) — feed the running result into the next pair until the list is exhausted." },
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

      <Hero title={TITLE} tagline="Find the greatest common factor of any list of integers — with the full Euclidean trace shown step by step.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Find the GCF of 12, 18, and 24 using the Euclidean algorithm."
        steps={[
          { label: "Start with the first pair: gcd(12, 18)", value: "" },
          { label: "18 mod 12", value: "6" },
          { label: "Now gcd(12, 6): 12 mod 6", value: "0" },
          { label: "Remainder is zero, so gcd(12, 18)", value: "6" },
          { label: "Chain in the next number: gcd(6, 24)", value: "" },
          { label: "24 mod 6", value: "0" },
          { label: "Final GCF", value: "6" },
        ]}
        result="gcd(12, 18, 24) = 6. Cross-check with prime factorisation: 12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3 — shared primes at lowest exponents are 2¹ and 3¹, giving 2 × 3 = 6."
      />

      <FormulaExplained
        plainEnglish="The Euclidean algorithm uses a single fact: if a number d divides both a and b, it also divides their remainder a mod b. So you can keep swapping the pair for (smaller, remainder) without changing the GCF — and the remainders shrink fast until one of them is zero."
        formula={
          <span>
            gcd(a, b) = gcd(b, a mod b)
            <br />
            gcd(a, 0) = a
            <br />
            gcd(a, b, c) = gcd(gcd(a, b), c)
            <br />
            a × b = gcd(a, b) × lcm(a, b)
          </span>
        }
        citation={{
          label: "NIST Dictionary of Algorithms and Data Structures — Euclid's algorithm",
          href: "https://xlinux.nist.gov/dads/HTML/euclidalgo.html",
        }}
      />

      <WhenToUse
        scenarios={[
          "You need to simplify a fraction to lowest terms by dividing top and bottom by their GCF.",
          "You're sharing items into equal groups and want the largest group size that works for every quantity.",
          "You're tiling a rectangular area with the largest possible square tile that fits perfectly.",
          "You're a student checking homework on factors, multiples, or modular arithmetic.",
          "You're a teacher building examples that highlight coprime pairs versus pairs that share factors.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Listing every factor of each number by hand.", fix: "That works for small inputs but breaks down fast. The Euclidean algorithm gives the answer in a handful of mod operations for any size." },
          { mistake: "Confusing GCF with LCM.", fix: "GCF is the largest number that divides them all; LCM is the smallest number they all divide into. They satisfy a × b = gcd × lcm." },
          { mistake: "Using negative numbers or zero without care.", fix: "By convention gcd works on absolute values, and gcd(a, 0) = a. Most calculators ignore signs — enter positive integers to stay safe." },
          { mistake: "Assuming gcd(a, b, c) needs a special formula.", fix: "It does not. Chain pairwise: gcd(gcd(a, b), c). Order does not change the result." },
          { mistake: "Treating a shared factor as the greatest factor.", fix: "2 divides both 12 and 18, but 6 does too. The GCF is the largest such divisor, not the first one you spot." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Divisor", definition: "An integer that divides another integer with no remainder. Every divisor of a is a factor of a." },
          { term: "Prime factorisation", definition: "Writing a positive integer as a product of prime powers. Unique up to order, by the fundamental theorem of arithmetic." },
          { term: "Coprime", definition: "Two integers whose only positive common divisor is 1 — equivalently, gcd(a, b) = 1." },
          { term: "Least common multiple (LCM)", definition: "The smallest positive integer that every number in the set divides into. Related to GCF by a × b = gcd × lcm." },
          { term: "Modulo (mod)", definition: "The remainder after integer division. a mod b is what's left of a after subtracting as many full copies of b as possible." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "NIST Dictionary of Algorithms and Data Structures — Euclid's algorithm", href: "https://xlinux.nist.gov/dads/HTML/euclidalgo.html" },
          { label: "Khan Academy — Greatest common factor (factors and multiples)", href: "https://www.khanacademy.org/math/arithmetic/arith-review-multiply-divide/arith-review-gcf-lcm/a/gcf-and-lcm" },
          { label: "OpenStax Prealgebra 2e — Find the greatest common factor", href: "https://openstax.org/books/prealgebra-2e/pages/7-2-find-the-greatest-common-factor-and-least-common-multiple" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["factor-calculator", "fractions-calculator", "long-division-calculator"]} />
    </Container>
  );
}
