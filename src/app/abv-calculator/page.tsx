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

const SLUG = "abv-calculator";
const TITLE = "ABV Calculator";
const DESC =
  "Alcohol by volume from original and final gravity. Brewing standard with simple and accurate formulas.";

const FAQS: FaqItem[] = [
  {
    question: "What is specific gravity in brewing?",
    answer:
      "Specific gravity is the density of your wort or beer compared to plain water (which is 1.000). Sugar makes liquid denser than water, so a higher gravity means more sugar dissolved. Yeast eats that sugar during fermentation and turns it into alcohol, which is less dense than water.",
  },
  {
    question: "Refractometer vs hydrometer — which should I use?",
    answer:
      "A hydrometer floats in a sample and reads gravity directly — accurate and cheap, but needs a few ounces of beer. A refractometer reads gravity from a single drop, which is great for pre-fermentation wort. After fermentation, refractometer readings need a correction because alcohol skews the reading.",
  },
  {
    question: "What is OG vs FG?",
    answer:
      "OG is original gravity, taken before yeast is pitched — it tells you how much fermentable sugar is in the wort. FG is final gravity, taken after fermentation finishes — what is left after the yeast ate as much sugar as it could. The drop from OG to FG is what powers the ABV calculation.",
  },
  {
    question: "What does attenuation mean?",
    answer:
      "Attenuation is the percentage of sugar that the yeast converted to alcohol and CO2. If your OG was 1.050 and FG was 1.012, the yeast attenuated about 76% of the sugars. Different yeast strains attenuate differently, which is why FG matters.",
  },
  {
    question: "What is the difference between real and apparent attenuation?",
    answer:
      "Apparent attenuation is what your hydrometer shows, but it under-reads because alcohol is less dense than water and lowers the reading. Real attenuation corrects for alcohol's effect and reflects the true percentage of sugar consumed. Most homebrewers report apparent attenuation since it is easier to measure.",
  },
  {
    question: "When does the accurate ABV formula matter?",
    answer:
      "For typical beers under about 6 to 7% ABV the simple formula (OG minus FG times 131.25) is close enough. For high-gravity beers like barleywines, imperial stouts, and tripels — over 8% ABV — the simple formula drifts low. The accurate formula corrects for the non-linear relationship between sugar drop and alcohol at higher strengths.",
  },
  {
    question: "Why does the simple formula use 131.25?",
    answer:
      "The 131.25 constant comes from the density of pure ethanol and a linear approximation that fits a wide range of normal-strength beers. It works well in the 1.030 to 1.080 OG range. Above that, the assumption that gravity points map linearly to alcohol starts to break down.",
  },
  {
    question: "Does temperature affect gravity readings?",
    answer:
      "Yes. Hydrometers are calibrated to a specific temperature (typically 68 degrees Fahrenheit or 60 degrees Fahrenheit, depending on the unit). A reading taken on hot wort will be artificially low; a reading on chilled wort will be slightly high. Most brewing apps include a temperature correction calculator.",
  },
];

export const metadata: Metadata = {
  title: `${TITLE} — Alcohol by Volume from OG and FG`,
  description: DESC,
  alternates: { canonical: `/${SLUG}` },
  openGraph: { title: TITLE, description: DESC, url: `/${SLUG}`, type: "article" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function Page() {
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Health", path: "/health" },
    { name: TITLE, path: `/${SLUG}` },
  ];

  const schemas = [
    softwareApplicationSchema({ name: TITLE, slug: SLUG, category: "health", description: DESC }),
    howToSchema({
      name: "How to calculate ABV from original and final gravity",
      steps: [
        { name: "Record OG", text: "Take a gravity reading of your wort before pitching yeast (e.g., 1.055)." },
        { name: "Record FG", text: "Take a gravity reading after fermentation has completed and stabilized (e.g., 1.012)." },
        { name: "Pick a formula", text: "Use the simple formula for typical beers; switch to the accurate formula above ~8% ABV." },
        { name: "Apply the formula", text: "Simple: ABV = (OG − FG) × 131.25. Accurate: ABV = (76.08 × (OG − FG) / (1.775 − OG)) × (FG / 0.794)." },
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

      <Hero title={TITLE} tagline="Calculate alcohol by volume from your original and final gravity readings — simple or accurate formula, your choice.">
        <Calculator />
      </Hero>

      <WorkedExample
        scenario="A homebrewer measures OG 1.055 before pitching yeast and FG 1.012 once fermentation finishes. What is the ABV?"
        steps={[
          { label: "Simple formula: ABV = (OG − FG) × 131.25", value: "" },
          { label: "OG − FG = 1.055 − 1.012", value: "0.043" },
          { label: "Multiply by 131.25", value: "5.64" },
          { label: "Rounded", value: "5.6% ABV" },
          { label: "Accurate formula for comparison", value: "5.61% ABV" },
        ]}
        result="OG 1.055 / FG 1.012 ≈ 5.6% ABV. At this strength, the simple and accurate formulas agree to within ~0.05%."
      />

      <FormulaExplained
        plainEnglish="Brewing ABV math compares how dense the liquid was before fermentation (OG) and after (FG). Yeast turned sugar into alcohol, so the density dropped. That density drop maps to a predictable amount of alcohol — exactly how much depends on which formula you use."
        formula={
          <span>
            Simple: ABV = (OG − FG) × 131.25
            <br />
            Accurate: ABV = (76.08 × (OG − FG) / (1.775 − OG)) × (FG / 0.794)
            <br />
            Use the accurate formula above ~8% ABV.
          </span>
        }
        citation={{
          label: "American Homebrewers Association — ABV calculation guidance",
          href: "https://www.homebrewersassociation.org/how-to-brew/how-to-calculate-abv/",
        }}
      />

      <WhenToUse
        scenarios={[
          "You just finished fermenting a batch and want to know the strength before packaging.",
          "You are designing a recipe and need to hit a target ABV for a competition style guideline.",
          "You are reading a recipe with OG and FG listed and want to verify the claimed ABV.",
          "You are a beer judge or BJCP student double-checking entry alcohol levels.",
          "You are scaling a recipe up or down and need to see how mash adjustments change ABV.",
        ]}
      />

      <CommonMistakes
        items={[
          { mistake: "Using a refractometer reading post-fermentation without correcting for alcohol.", fix: "Refractometers over-read once alcohol is present. Use a hydrometer for FG or apply a refractometer-with-alcohol correction." },
          { mistake: "Taking a gravity reading on hot wort.", fix: "Liquid expands when hot, so the hydrometer reads low. Cool the sample to your hydrometer's calibration temperature or apply a temp correction." },
          { mistake: "Calling fermentation done after one stable reading.", fix: "Take two identical readings 24–48 hours apart. A single reading can fool you if yeast is just slowing down." },
          { mistake: "Using the simple formula on a 12% imperial stout.", fix: "Above ~8% ABV the simple formula drifts low. Switch to the accurate (Balling-based) formula for high-gravity beers." },
          { mistake: "Forgetting that ABV is by volume, not by weight.", fix: "ABV is what you see on a label. ABW (alcohol by weight) is about 0.79× ABV and is less common outside macro brewing reports." },
        ]}
      />

      <RelatedTerms
        terms={[
          { term: "OG (Original Gravity)", definition: "Specific gravity of the wort before fermentation starts." },
          { term: "FG (Final Gravity)", definition: "Specific gravity of the beer after fermentation finishes." },
          { term: "Attenuation", definition: "Percentage of fermentable sugars converted to alcohol and CO2." },
          { term: "Plato", definition: "Brewing density unit roughly equal to grams of sugar per 100g of wort. Used widely in commercial brewing." },
          { term: "ABW", definition: "Alcohol by weight. ABW ≈ ABV × 0.79. US macro brewers historically reported ABW." },
        ]}
      />

      <FAQ items={FAQS} />

      <References
        items={[
          // TODO_VERIFY: AHA ABV calculation page URL — confirm at publish (https://www.homebrewersassociation.org/how-to-brew/how-to-calculate-abv/)
          { label: "American Homebrewers Association — How to Calculate ABV", href: "https://www.homebrewersassociation.org/how-to-brew/how-to-calculate-abv/" },
          // TODO_VERIFY: BJCP style guidelines current edition (2021) — confirm at publish (https://www.bjcp.org/bjcp-style-guidelines/)
          { label: "Beer Judge Certification Program — Style Guidelines", href: "https://www.bjcp.org/bjcp-style-guidelines/" },
          { label: "Daniels, R. — Designing Great Beers (Brewers Publications)", href: "https://www.brewerspublications.com/products/designing-great-beers-the-ultimate-guide-to-brewing-classic-beer-styles" },
          { label: "American Homebrewers Association — Homebrewing Resources", href: "https://www.homebrewersassociation.org/how-to-brew/" },
        ]}
      />

      <Author reviewerNote="TODO_VERIFY: licensed clinician for ABV-related consumption guidance at publish" />
      <LastReviewed date="2026-06-12" />

      <RelatedCalculators slugs={["water-intake-calculator", "scientific-notation-calculator", "dilution-calculator"]} />
    </Container>
  );
}
