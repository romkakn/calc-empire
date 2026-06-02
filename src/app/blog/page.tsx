import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Card } from "@/components/md3/Card";
import { Breadcrumbs } from "@/components/eeat/Breadcrumbs";
import { breadcrumbListSchema, jsonLd } from "@/lib/schema";
import { getAllPostsSortedByDate } from "@/lib/blog";
import { CATEGORIES, SITE } from "@/lib/site";

const TITLE = "Blog — Calc Empire";
const DESC =
  "Plain-English explainers from the calc-empire team. Each post links the calculator that does the math for you.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESC,
  alternates: { canonical: "/blog" },
  openGraph: { title: TITLE, description: DESC, url: "/blog", type: "website", siteName: SITE.name },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
};

export default function BlogIndex() {
  const posts = getAllPostsSortedByDate();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <Container as="section" className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbListSchema(breadcrumbs)) }}
      />

      <Breadcrumbs items={breadcrumbs} />

      <h1 className="md-display-small mt-2 text-[var(--md-sys-color-on-surface)]">
        Blog
      </h1>
      <p className="md-body-large mt-3 max-w-prose text-[var(--md-sys-color-on-surface-variant)]">
        Plain-English explainers from the {SITE.name} team. Every post walks
        through the math, shows worked examples, and links the calculator that
        does the work for you.
      </p>

      {posts.length === 0 ? (
        <Card variant="outlined" className="mt-8 p-4 md-body-medium">
          No posts yet. Check back soon.
        </Card>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 list-none">
          {posts.map((p) => {
            const cat = CATEGORIES[p.category]?.label ?? p.category;
            return (
              <li key={p.slug} className="h-full">
                <Link
                  href={`/blog/${p.slug}`}
                  className="block h-full rounded-[var(--md-sys-shape-corner-md)] focus-visible:outline-none"
                >
                  <Card
                    variant="elevated"
                    className="h-full p-5 transition-shadow duration-[var(--md-sys-motion-duration-short3)] hover:md-elevation-2"
                  >
                    <p className="md-label-medium uppercase tracking-wide text-[var(--md-sys-color-on-surface-variant)]">
                      {cat} · {p.readingMinutes} min read
                    </p>
                    <h2 className="md-title-large mt-2 text-[var(--md-sys-color-on-surface)]">
                      {p.title}
                    </h2>
                    <p className="md-body-medium mt-2 text-[var(--md-sys-color-on-surface-variant)]">
                      {p.excerpt}
                    </p>
                    <p className="md-label-medium mt-4 text-[var(--md-sys-color-primary)]">
                      Read post →
                    </p>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Container>
  );
}
