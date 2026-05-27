import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { SITE, absUrl } from "@/lib/site";
import { jsonLd, personSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.author}, the author behind ${SITE.name}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <Container as="article" className="prose-friendly py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(personSchema()) }}
      />
      <h1 className="text-3xl font-semibold tracking-tight">
        About {SITE.author}
      </h1>

      <p className="mt-4 max-w-prose">
        {SITE.name} is a small, opinionated library of calculators. Each one
        shows the formula, walks through a worked example, and links the sources
        we used. The goal: a result you can trust, and enough context to learn
        the math.
      </p>

      <h2 className="mt-8 text-xl font-semibold">How calculators are built</h2>
      <p className="mt-2 max-w-prose">
        Every calculator goes through the same checklist: source-cited formula,
        three worked examples verified by hand, WCAG 2.2 AA accessibility, and a
        review cadence of 90 days. If anything looks off, contact the author.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Author</h2>
      <p className="mt-2 max-w-prose">
        Built by <strong>{SITE.author}</strong>.{" "}
        {/* TODO_VERIFY: replace with real bio + credentials */}
      </p>

      <p className="mt-6 text-sm text-[var(--color-on-surface-variant)]">
        Canonical author page: <a href={absUrl("/about")}>{absUrl("/about")}</a>
      </p>
    </Container>
  );
}
