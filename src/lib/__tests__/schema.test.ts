import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  organizationSchema,
  webSiteSchema,
  personSchema,
  softwareApplicationSchema,
  howToSchema,
  faqPageSchema,
  breadcrumbListSchema,
  articleSchema,
  jsonLd,
} from "../schema.ts";

describe("organizationSchema", () => {
  test("has correct @context, @type, and non-empty required fields", () => {
    const s = organizationSchema() as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "Organization");
    assert.ok(typeof s.name === "string" && s.name.length > 0);
    assert.ok(typeof s.url === "string" && s.url.length > 0);
    assert.ok(typeof s.logo === "string" && s.logo.length > 0);
  });
});

describe("webSiteSchema", () => {
  test("has correct @context, @type, and a nested Organization publisher", () => {
    const s = webSiteSchema() as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "WebSite");
    assert.ok(typeof s.name === "string" && s.name.length > 0);
    assert.ok(typeof s.url === "string" && s.url.length > 0);
    assert.ok(typeof s.description === "string" && s.description.length > 0);
    const publisher = s.publisher as Record<string, unknown>;
    assert.equal(publisher["@type"], "Organization");
    assert.ok(typeof publisher.name === "string" && publisher.name.length > 0);
  });
});

describe("personSchema", () => {
  test("has correct @context, @type, non-empty name and url", () => {
    const s = personSchema() as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "Person");
    assert.ok(typeof s.name === "string" && s.name.length > 0);
    assert.ok(typeof s.url === "string" && s.url.length > 0);
  });
});

describe("softwareApplicationSchema", () => {
  test("has correct @context, @type, required fields, and maps category via CATEGORIES", () => {
    const s = softwareApplicationSchema({
      name: "Test Calculator",
      slug: "test-calculator",
      category: "finance",
      description: "A test description.",
    }) as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "SoftwareApplication");
    assert.equal(s.name, "Test Calculator");
    assert.equal(s.description, "A test description.");
    assert.equal(s.applicationCategory, "FinanceApplication");
    assert.ok(typeof s.url === "string" && s.url.includes("/test-calculator"));
    const offers = s.offers as Record<string, unknown>;
    assert.equal(offers["@type"], "Offer");
  });

  test("falls back to WebApplication for an unknown category", () => {
    const s = softwareApplicationSchema({
      name: "Mystery Calculator",
      slug: "mystery-calculator",
      category: "not-a-real-category",
      description: "desc",
    }) as Record<string, unknown>;
    assert.equal(s.applicationCategory, "WebApplication");
  });
});

describe("howToSchema", () => {
  test("has correct @context, @type, and maps each step to a HowToStep", () => {
    const s = howToSchema({
      name: "How to test",
      steps: [
        { name: "Step one", text: "Do the first thing." },
        { name: "Step two", text: "Do the second thing." },
      ],
    }) as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "HowTo");
    assert.equal(s.name, "How to test");
    const steps = s.step as Record<string, unknown>[];
    assert.equal(steps.length, 2);
    for (const [i, step] of steps.entries()) {
      assert.equal(step["@type"], "HowToStep");
      assert.equal(step.name, `Step ${i === 0 ? "one" : "two"}`);
      assert.ok(typeof step.text === "string" && step.text.length > 0);
    }
  });
});

describe("faqPageSchema", () => {
  test("every item becomes a Question with an Answer-typed acceptedAnswer", () => {
    const items = [
      { question: "What is 1+1?", answer: "2" },
      { question: "What is 2+2?", answer: "4" },
      { question: "What is 3+3?", answer: "6" },
    ];
    const s = faqPageSchema(items) as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "FAQPage");
    const mainEntity = s.mainEntity as Record<string, unknown>[];
    assert.equal(mainEntity.length, items.length);
    mainEntity.forEach((q, i) => {
      assert.equal(q["@type"], "Question");
      assert.equal(q.name, items[i].question);
      const accepted = q.acceptedAnswer as Record<string, unknown>;
      assert.equal(accepted["@type"], "Answer");
      assert.equal(accepted.text, items[i].answer);
    });
  });

  test("preserves input order (does not sort or reverse)", () => {
    const items = [
      { question: "Z", answer: "z" },
      { question: "A", answer: "a" },
    ];
    const s = faqPageSchema(items) as Record<string, unknown>;
    const mainEntity = s.mainEntity as Record<string, unknown>[];
    assert.equal(mainEntity[0].name, "Z");
    assert.equal(mainEntity[1].name, "A");
  });
});

describe("breadcrumbListSchema", () => {
  test("itemListElement positions are 1-based and sequential", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Finance", path: "/finance" },
      { name: "Mortgage Recast Calculator", path: "/mortgage-recast-calculator" },
    ];
    const s = breadcrumbListSchema(items) as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "BreadcrumbList");
    const listItems = s.itemListElement as Record<string, unknown>[];
    assert.equal(listItems.length, items.length);
    listItems.forEach((li, i) => {
      assert.equal(li["@type"], "ListItem");
      assert.equal(li.position, i + 1);
      assert.equal(li.name, items[i].name);
    });
    // Explicitly assert 1-based (not 0-based) and strictly sequential.
    assert.deepEqual(
      listItems.map((li) => li.position),
      [1, 2, 3],
    );
  });
});

describe("articleSchema", () => {
  test("has correct @context, @type, and required fields including a Person author", () => {
    const s = articleSchema({
      headline: "How to Test Things",
      slug: "how-to-test-things",
      datePublished: "2026-01-01",
      dateModified: "2026-01-02",
      citations: ["https://example.com/source"],
    }) as Record<string, unknown>;
    assert.equal(s["@context"], "https://schema.org");
    assert.equal(s["@type"], "Article");
    assert.equal(s.headline, "How to Test Things");
    assert.equal(s.datePublished, "2026-01-01");
    assert.equal(s.dateModified, "2026-01-02");
    assert.ok(typeof s.url === "string" && s.url.includes("/how-to-test-things"));
    const author = s.author as Record<string, unknown>;
    assert.equal(author["@type"], "Person");
    assert.deepEqual(s.citation, ["https://example.com/source"]);
  });
});

describe("jsonLd", () => {
  test("a single schema round-trips through JSON.parse to a deep-equal object", () => {
    const schema = organizationSchema();
    const out = jsonLd(schema);
    const parsed = JSON.parse(out);
    assert.deepEqual(parsed, schema);
  });

  test("multiple schemas are wrapped in an array that round-trips", () => {
    const a = organizationSchema();
    const b = webSiteSchema();
    const out = jsonLd(a, b);
    const parsed = JSON.parse(out);
    assert.ok(Array.isArray(parsed));
    assert.equal(parsed.length, 2);
    assert.deepEqual(parsed, [a, b]);
  });
});
