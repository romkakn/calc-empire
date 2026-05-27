import { Section } from "./Section";
import { SITE } from "@/lib/site";

export function Author({
  reviewerNote,
}: {
  reviewerNote?: string;
}) {
  return (
    <Section id="author" title="Author">
      <p className="max-w-prose">
        Written by <strong>{SITE.author}</strong>.{" "}
        {/* TODO_VERIFY: replace placeholder bio with real credentials */}
      </p>
      {reviewerNote ? (
        <p className="mt-2 max-w-prose text-sm text-[var(--color-on-surface-variant)]">
          Reviewed by: <em>{reviewerNote}</em>{" "}
          {/* TODO_VERIFY: add real reviewer for medical / legal / financial pages */}
        </p>
      ) : null}
    </Section>
  );
}
