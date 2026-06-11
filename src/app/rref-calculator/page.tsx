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

const SLUG = "rref-calculator";
const TITLE = "RREF Calculator";
const DESC =
  "Row-reduce any matrix to reduced row echelon form. Step-by-step Gauss-Jordan with pivot tracking and rank.";

const FAQS: FaqItem[] = [
  {
    question: "What is the difference between RREF and REF?",
    answer:
      "Row echelon form (REF) requires every leading entry of a non-zero row to sit to the right of the leading entry above it, with zeros below each pivot. Reduced row echelon form (RREF) adds two more rules: every pivot must equal 1, and every entry above each pivot must also be zero. RREF is unique for a given matrix; REF is not.",
  },
  {
    question: "What is a pivot column?",
    answer:
      "A pivot column is any column of the RREF matrix that contains a leading 1. Each pivot column corresponds to a basic variable in the linear system. The number of pivot columns equals the rank of the matrix.",
  },
  {
    question: "What are free variables?",
    answer:
      "Free variables correspond to non-pivot columns in the RREF of an augmented matrix. They can take any value, and the basic variables are expressed in terms of them. If a system has free variables, it has infinitely many solutions.",
  },
  {
    question: "How do I tell if a system has a unique, infinite, or no solution?",
    answer:
      "Row-reduce the augmented matrix. If a row reads [0 0 ... 0 | c] with c non-zero, the system has no solution. If every column except the last is a pivot column, the solution is unique. If any non-augmented column lacks a pivot, the system has infinitely many solutions.",
  },
  {
    question: "What is an augmented matrix?",
    answer:
      "An augmented matrix is the coefficient matrix of a linear system with the constant vector appended as the last column, usually separated by a vertical bar. Row-reducing it directly reveals the solution set without rewriting equations between steps.",
  },
  {
    question: "How do I solve a linear system with RREF?",
    answer:
      "Build the augmented matrix from the system, apply Gauss-Jordan elimination to reach RREF, then read the solution off the rows. Pivot columns give the value of each basic variable; non-pivot columns mark free variables that parameterize the solution.",
  },
  {
    question: "What is the rank of a matrix?",
    answer:
      "The rank is the number of pivot columns in the RREF, which equals the dimension of the column space and the row space. Rank tells you the maximum number of linearly independent rows or columns. For a square matrix, full rank means it is invertible.",
  },
  {
    question: "Why is RREF unique but REF is not?",
    answer:
      "REF leaves room for choice: pivot values can be any non-zero number, and entries above pivots are not constrained. RREF pins both down by forcing pivots to 1 and zeroing the entries above them. Given any starting matrix, all valid sequences of row operations land on the same RREF.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Step-by-Step Gauss-Jordan`,
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
      name: "How to row-reduce a matrix to RREF",
      steps: [
        { name: "Pick a matrix size", text: "Choose dimensions that match your system or problem — anywhere from 2x2 to 4x4 (square or augmented)." },
        { name: "Enter the entries", text: "Type each coefficient into its cell. For an augmented matrix, the last column holds the constants." },
        { name: "Run Gauss-Jordan", text: "For each pivot column: scale the pivot row so the pivot equals 1, then subtract multiples of that row from every other row to zero out the rest of the column." },
        { name: "Read the solution", text: "Pivot columns give basic variable values; non-pivot columns mark free variables. A row of zeros equal to a non-zero constant means no solution." },
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

      <Hero title={TITLE} tagline="Reduce any 2x2 to 4x4 matrix to reduced row echelon form, with every Gauss-Jordan step shown.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="Reduce the 2x3 matrix [[1, 2, 3], [2, 3, 4]] to RREF by hand to check the calculator's steps."
        steps={[
          { label: "Start", value: "[[1, 2, 3], [2, 3, 4]]" },
          { label: "R2 → R2 − 2·R1 (zero out column 1 below the pivot)", value: "[[1, 2, 3], [0, −1, −2]]" },
          { label: "R2 → −1·R2 (scale pivot to 1)", value: "[[1, 2, 3], [0, 1, 2]]" },
          { label: "R1 → R1 − 2·R2 (zero out column 2 above the pivot)", value: "[[1, 0, −1], [0, 1, 2]]" },
          { label: "Pivot columns", value: "1 and 2 — rank 2" },
        ]}
        result="RREF is [[1, 0, −1], [0, 1, 2]]. Read as a system: x = −1 + free, y = 2 — both columns 1 and 2 are pivots, so x and y are basic variables; column 3 represents the constant side."
      />

      <FormulaExplained
        plainEnglish="Gauss-Jordan elimination drives every pivot to 1 and clears every other entry in each pivot column using three legal row operations: swap two rows, scale a row by a non-zero number, or add a multiple of one row to another. The end state is RREF — a canonical form that is the same no matter what order you reduce in."
        formula={
          <span>
            For each pivot column j (left to right):
            <br />
            1. Find a row with a non-zero entry in column j — swap it into pivot position.
            <br />
            2. Scale that row so the pivot entry equals 1.
            <br />
            3. For every other row i, replace R<sub>i</sub> with R<sub>i</sub> − a<sub>ij</sub>·R<sub>pivot</sub>.
          </span>
        }
        citation={{
          label: "MIT OCW 18.06 — Linear Algebra, Strang (lectures on elimination and RREF)",
          href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You are solving a system of linear equations and want the solution set, not just one solution.",
          "You need to check whether a set of vectors is linearly independent.",
          "You are computing the rank of a matrix or the dimension of a subspace.",
          "You are finding a basis for the null space, column space, or row space.",
          "You are verifying homework or studying for a linear algebra exam.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Stopping at REF instead of RREF.", fix: "RREF requires pivots equal to 1 AND zeros above each pivot — not just below. Keep going until both conditions hold." },
          { mistake: "Forgetting to zero entries above the pivot.", fix: "Gauss-Jordan eliminates upward and downward from every pivot. If you only clear below, you have REF." },
          { mistake: "Reading the augmented column as a coefficient.", fix: "When solving a system, the last column holds constants, not a variable. Pivot in that column means inconsistent system." },
          { mistake: "Counting a zero row as a pivot.", fix: "Only non-zero rows contribute pivots. Zero rows sit at the bottom and represent redundancy." },
          { mistake: "Treating a non-pivot column as no solution.", fix: "A non-pivot column in the coefficient block means a free variable, which gives infinitely many solutions — not zero solutions." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "Pivot", definition: "The leading 1 in a row of RREF. Its column is a pivot column." },
          { term: "Row operation", definition: "Swap two rows, scale a row by a non-zero number, or add a multiple of one row to another." },
          { term: "Rank", definition: "Number of pivot columns in RREF. Equals the dimension of the column space." },
          { term: "Free variable", definition: "Variable tied to a non-pivot column in the coefficient block. Takes any value." },
          { term: "Augmented matrix", definition: "Coefficient matrix with the constant vector appended as the last column." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          { label: "MIT OpenCourseWare 18.06 — Linear Algebra (Strang)", href: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
          { label: "Khan Academy — Matrix row operations and RREF", href: "https://www.khanacademy.org/math/linear-algebra/vectors-and-spaces/matrices-elimination/v/matrices-reduced-row-echelon-form-1" },
          { label: "Gilbert Strang — Introduction to Linear Algebra (Wellesley-Cambridge Press)", href: "https://math.mit.edu/~gs/linearalgebra/" },
        ]}
      />

      <Author />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["linear-equation-calculator", "linear-regression-calculator", "interpolation-calculator"]} />
    </Container>
  );
}
