// Blog post catalog. Each entry generates a sitemap URL, appears on the
// /blog index, and is referenced by the post's page.tsx for shared metadata.
// To add a post: drop a new folder under src/app/blog/<slug>/ with page.tsx,
// then add an entry here.

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** Lead paragraph used on the index card (≤ 200 chars). */
  excerpt: string;
  /** Primary calculator category this post supports. */
  category: "construction" | "finance" | "health" | "math" | "stats" | "payroll" | "betting" | "education" | "pets";
  /** ISO date the post was first published. */
  datePublished: string;
  /** ISO date the post was last reviewed/updated. */
  dateModified: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
  /** Primary keyword (informational). */
  primaryKeyword: string;
  /** Related calculator slugs to cross-link from the post + index card. */
  relatedCalcs: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-much-concrete-do-i-need",
    title: "How Much Concrete Do I Need? (Field Math + 3 Real Examples)",
    description:
      "Order the right amount of concrete the first time. The one formula, three worked examples (patio, garage slab, footing), waste factor, bags vs ready-mix, and the mistakes that cost contractors a second truck.",
    excerpt:
      "Most botched pours start with bad math. Here's the one formula, three real-world walkthroughs, and the waste factor every pro adds before they call the plant.",
    category: "construction",
    datePublished: "2026-05-31",
    dateModified: "2026-05-31",
    readingMinutes: 9,
    primaryKeyword: "how much concrete do i need",
    relatedCalcs: ["cubic-yard-calculator", "gravel-calculator", "square-footage-calculator"],
  },
  {
    slug: "how-to-pay-off-mortgage-faster",
    title: "How to Pay Off Your Mortgage Faster (7 Methods Ranked by Real Savings)",
    description:
      "Seven proven ways to pay off your mortgage faster, ranked by total interest saved on a real $300k example. Plus the one method most homeowners get wrong.",
    excerpt:
      "Biweekly payments, recasts, lump sums, refinancing - which actually saves the most? Ran the numbers on a $300k loan. The ranking will surprise you.",
    category: "finance",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to pay off mortgage faster",
    relatedCalcs: ["mortgage-recast-calculator", "money-market-calculator", "dividend-calculator"],
  },
  {
    slug: "roth-vs-traditional-ira",
    title: "Roth vs Traditional IRA: The Decision Tree That Beats the Tax-Rate Heuristic",
    description:
      "The Roth vs Traditional IRA decision in a tree, not a heuristic. Income phase-outs, RMDs, employer match, conversion ladders, and the math for typical incomes.",
    excerpt:
      "Most guides say \"Roth if your tax rate will be higher later.\" That misses three bigger factors. Run the actual decision tree.",
    category: "finance",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "roth vs traditional ira",
    relatedCalcs: ["ira-calculator", "capital-gains-tax-calculator", "agi-calculator"],
  },
  {
    slug: "how-to-calculate-tip-without-calculator",
    title: "How to Calculate Tip in Your Head (Three Tricks Servers Wish You Knew)",
    description:
      "Three mental-math tricks for calculating tip in your head: move-the-decimal, the double method, and the split-and-add. Works for any percentage.",
    excerpt:
      "Move the decimal, double it, split the bill - all in 5 seconds without pulling out your phone. Three mental-math tricks for 15%, 18%, 20%.",
    category: "finance",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to calculate tip",
    relatedCalcs: ["tip-calculator", "percent-off-calculator", "discount-calculator"],
  },
  {
    slug: "good-401k-balance-by-age",
    title: "What Is a Good 401(k) Balance by Age? (Fidelity Rule + 3 Real Trajectories)",
    description:
      "The Fidelity 401(k) rule of thumb (1x by 30, 10x by 67) compared to real-world trajectories at three income levels. Plus what to do if you are behind.",
    excerpt:
      "Fidelity says 1x salary by 30, 3x by 40, 10x by 67. Useful benchmark or unrealistic? Run the math on three real careers and you decide.",
    category: "finance",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "good 401k balance by age",
    relatedCalcs: ["ira-calculator", "money-market-calculator", "time-value-of-money-calculator"],
  },
  {
    slug: "options-trading-for-beginners",
    title: "Options Trading for Beginners: The Six Things That Actually Matter",
    description:
      "The six things every options beginner needs: calls vs puts, strike, premium, expiration, breakeven, and assignment risk. Two worked trades, no jargon.",
    excerpt:
      "Calls, puts, strikes, premiums, expirations, assignment. Skip the Greek soup. Here is what a new trader needs to know to read one option contract.",
    category: "finance",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "options trading for beginners",
    relatedCalcs: ["options-profit-calculator", "stock-profit-calculator", "dividend-calculator"],
  },
  {
    slug: "how-to-solve-quadratic-equations",
    title: "How to Solve Quadratic Equations (Three Methods Pick the One That Fits)",
    description:
      "Three methods for quadratic equations - factoring, completing the square, the formula - with a decision tree for which is fastest on which problem.",
    excerpt:
      "Factoring, completing the square, quadratic formula. Same answer, three speeds. A decision rule for which to use on a given equation.",
    category: "math",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to solve quadratic equations",
    relatedCalcs: ["quadratic-formula-calculator", "square-root-calculator", "factor-calculator"],
  },
  {
    slug: "derivative-vs-integral",
    title: "Derivative vs Integral: Same Coin, Two Sides (With Five Real Use Cases)",
    description:
      "Derivative vs integral explained without the textbook fog. The fundamental theorem in plain English, plus five real cases where each one is the right tool.",
    excerpt:
      "One measures change. The other measures accumulation. Five real-world cases - velocity, area under a curve, present value, drug dosing, signal processing.",
    category: "math",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "derivative vs integral",
    relatedCalcs: ["derivative-calculator", "integral-calculator", "limit-calculator"],
  },
  {
    slug: "fractions-vs-decimals",
    title: "Fractions vs Decimals: When Each One Wins (Cooking, Measuring, Money)",
    description:
      "When to use fractions vs decimals - recipes, money, measurement, music. Plus three mental-math conversion tricks (the 1/8 rule, doubling, decimal moves).",
    excerpt:
      "Recipes love fractions. Money loves decimals. Construction needs both. A practical guide to which form fits which job and how to convert in your head.",
    category: "math",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "fractions vs decimals",
    relatedCalcs: ["fractions-calculator", "decimal-fraction-converter", "mixed-number-calculator"],
  },
  {
    slug: "pythagorean-theorem-real-world",
    title: "Pythagorean Theorem in Real Life (10 Times You Already Used It Without Knowing)",
    description:
      "Ten real-world uses of the Pythagorean theorem - TV sizing, deck framing, navigation, baseball diamonds, ladder safety. Each with a worked example.",
    excerpt:
      "TV diagonal sizing, hanging a level shelf, the squareness of a deck frame, GPS triangulation. Ten places a^2 + b^2 = c^2 shows up outside the classroom.",
    category: "math",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "pythagorean theorem real world examples",
    relatedCalcs: ["pythagorean-theorem-calculator", "trigonometry-calculator", "square-root-calculator"],
  },
  {
    slug: "how-much-water-should-i-drink",
    title: "How Much Water Should You Actually Drink? (The 8x8 Rule Is Folklore)",
    description:
      "The 8x8 water rule is folklore. What hydration research actually shows: body weight, activity, climate, and the foods that count toward your daily total.",
    excerpt:
      "Eight 8-oz glasses a day is not a research finding - it is a 1945 footnote misread for 80 years. Here is what hydration science actually says.",
    category: "health",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how much water should i drink",
    relatedCalcs: ["water-intake-calculator", "protein-intake-calculator", "max-heart-rate-calculator"],
  },
  {
    slug: "healthy-a1c-level",
    title: "What Is a Healthy A1C Level? (The Bands That Matter and Why 7% Is Not Magic)",
    description:
      "A1C bands explained - normal, prediabetes, diabetes - and why a target of \"under 7\" is not one-size-fits-all. Plus what raises and lowers A1C.",
    excerpt:
      "Under 5.7 is normal, 5.7 to 6.4 is prediabetes, 6.5 is the diabetes threshold. But the ADA target of under 7 is a starting point, not a finish line.",
    category: "health",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "healthy a1c level",
    relatedCalcs: ["a1c-calculator", "protein-intake-calculator", "water-intake-calculator"],
  },
  {
    slug: "how-many-steps-in-a-mile",
    title: "How Many Steps in a Mile? (It Is Not 2000 for You Specifically)",
    description:
      "Steps per mile is not 2000 for everyone. Your height, pace, and stride length set the real number. Plus the formula for walking vs running.",
    excerpt:
      "The 2000 step average hides a 400-step range. Your height, pace, and whether you walk or run all shift the number. Here is yours.",
    category: "health",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how many steps in a mile",
    relatedCalcs: ["steps-to-miles-calculator", "max-heart-rate-calculator", "water-intake-calculator"],
  },
  {
    slug: "target-heart-rate-zones-explained",
    title: "Target Heart Rate Zones Explained (and the Karvonen Method That Actually Works)",
    description:
      "The five training heart rate zones, what each builds (endurance vs threshold vs VO2 max), and the Karvonen formula that personalizes them using resting HR.",
    excerpt:
      "Zones 1 through 5, what each one does to your body, and why the Karvonen formula beats \"60 to 80% of 220-age\" for almost everyone.",
    category: "health",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "target heart rate zones",
    relatedCalcs: ["target-heart-rate-calculator", "max-heart-rate-calculator", "protein-intake-calculator"],
  },
  {
    slug: "how-to-measure-room-for-flooring",
    title: "How to Measure a Room for Flooring (Without Ending Up Two Boxes Short)",
    description:
      "How to measure a room for flooring the right way. Waste factors by material (tile, vinyl, hardwood, carpet), L-shapes, and the transitions people forget.",
    excerpt:
      "Length times width is wrong - it forgets transitions, waste factor, and L-shapes. The four-step method pros use, and the waste numbers by floor type.",
    category: "construction",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to measure a room for flooring",
    relatedCalcs: ["square-footage-calculator", "board-foot-calculator", "cubic-yard-calculator"],
  },
  {
    slug: "how-much-mulch-do-i-need",
    title: "How Much Mulch Do You Need? (Real Math, Not a Guess by Wheelbarrows)",
    description:
      "How much mulch to order, with depth recommendations by use case, conversion from cubic yards to bags, and the cost difference between bulk and bagged.",
    excerpt:
      "2 to 4 inches deep, by the cubic yard - except when you mean cubic feet, and except when the bed is curved. Four steps and a quick conversion table.",
    category: "construction",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how much mulch do i need",
    relatedCalcs: ["mulch-calculator", "cubic-yard-calculator", "gravel-calculator"],
  },
  {
    slug: "how-to-build-stairs-by-code",
    title: "How to Build Stairs by Code (IRC 2024 Limits + Stringer Math)",
    description:
      "Stair building by IRC 2024 code: max riser, min tread, headroom, handrail rules. Plus the stringer math that gets it right the first cut.",
    excerpt:
      "Maximum riser 7.75 inches, minimum tread 10. Headroom 80. Maximum angle 36 degrees. The math for stringer length and the four things inspectors catch.",
    category: "construction",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to build stairs by code",
    relatedCalcs: ["stair-calculator", "board-foot-calculator", "pythagorean-theorem-calculator"],
  },
  {
    slug: "mean-median-mode-when-to-use",
    title: "Mean vs Median vs Mode: When to Use Which (and Why Average Income Lies)",
    description:
      "Mean vs median vs mode in plain English, with five real datasets (income, home prices, test scores, response times, shoe sizes) and which measure fits each.",
    excerpt:
      "Average income is the mean. Typical income is the median. The gap between them tells you about inequality. Five examples for picking the right one.",
    category: "stats",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "mean vs median vs mode",
    relatedCalcs: ["average-calculator", "median-calculator", "standard-deviation-calculator"],
  },
  {
    slug: "understanding-p-value",
    title: "Understanding P-Value (Without the Misinterpretations That Killed Replication)",
    description:
      "What a p-value actually means (and what it does not). Why p < 0.05 is a starting point not a verdict, and how p-hacking broke a generation of research.",
    excerpt:
      "A p-value is not the probability the null is true. It is not the probability your result is real. It is one thing - and that thing is widely misread.",
    category: "stats",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "understanding p-value",
    relatedCalcs: ["p-value-calculator", "z-score-calculator", "standard-deviation-calculator"],
  },
  {
    slug: "how-to-calculate-final-grade",
    title: "How to Calculate Your Final Grade (And the Grade You Need on the Exam)",
    description:
      "Three formulas for final grades: weighted average, target-grade-on-exam, and cumulative GPA. Plus the common mistake of mixing percentages with letter points.",
    excerpt:
      "Term 1 was 85, term 2 was 90, the exam is 20%. Final is 86.5. To hit a 90 you need... let math do it. Three formulas every student should know.",
    category: "education",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "how to calculate final grade",
    relatedCalcs: ["semester-grade-calculator", "weighted-grade-calculator", "cumulative-gpa-calculator"],
  },
  {
    slug: "dog-years-real-vs-myth",
    title: "Dog Years: Why \"1 = 7\" Is Wrong (and What the New Math Says)",
    description:
      "The 7x dog years rule is wrong. The 2019 Wang epigenetic-clock formula explains why puppies age fast and seniors age slow. Plus the breed-size adjustment.",
    excerpt:
      "A 1-year-old dog is not 7 in human years - they are 31. The 2019 epigenetic clock from UCSD finally got the conversion right. Here is what it actually says.",
    category: "pets",
    datePublished: "2026-06-12",
    dateModified: "2026-06-12",
    readingMinutes: 9,
    primaryKeyword: "dog years to human years",
    relatedCalcs: ["dog-age-calculator", "puppy-weight-calculator", "protein-intake-calculator"],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostsSortedByDate(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished),
  );
}
