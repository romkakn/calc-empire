import { SITE, SITE_URL, absUrl, CATEGORIES } from "./site";

type SchemaObject = Record<string, unknown>;

export function organizationSchema(): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE_URL,
    logo: absUrl("/logo.png"),
  };
}

export function personSchema(): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.author,
    url: absUrl(SITE.author_url_path),
    sameAs: [
      // TODO_VERIFY: add Roma's LinkedIn / authoritative profile URLs
    ],
  };
}

export function softwareApplicationSchema(args: {
  name: string;
  slug: string;
  category: string;
  description: string;
}): SchemaObject {
  const cat = CATEGORIES[args.category]?.schemaCategory ?? "WebApplication";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: args.name,
    description: args.description,
    applicationCategory: cat,
    operatingSystem: "Any (browser-based)",
    browserRequirements: "Requires JavaScript",
    url: absUrl(`/${args.slug}`),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

export type HowToStepInput = { name: string; text: string };

export function howToSchema(args: {
  name: string;
  steps: HowToStepInput[];
}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    step: args.steps.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
    })),
  };
}

export type FaqItem = { question: string; answer: string };

export function faqPageSchema(items: FaqItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbListSchema(items: BreadcrumbItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: absUrl(b.path),
    })),
  };
}

export function articleSchema(args: {
  headline: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  citations: string[];
}): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    url: absUrl(`/${args.slug}`),
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    author: { "@type": "Person", name: SITE.author },
    citation: args.citations,
  };
}

export function jsonLd(...schemas: SchemaObject[]): string {
  return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
}
