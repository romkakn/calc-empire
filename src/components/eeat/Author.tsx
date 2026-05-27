import { Section } from "./Section";
import { Card } from "../md3/Card";
import { SITE } from "@/lib/site";

export function Author({ reviewerNote }: { reviewerNote?: string }) {
  return (
    <Section id="author" title="Author">
      <Card variant="filled" className="p-4 max-w-prose flex items-center gap-4">
        <span
          aria-hidden
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] md-title-medium"
        >
          {SITE.author.slice(0, 1).toUpperCase()}
        </span>
        <div>
          <p className="md-title-medium">{SITE.author}</p>
          <p className="md-body-small text-[var(--md-sys-color-on-surface-variant)]">
            {/* TODO_VERIFY: replace placeholder bio with real credentials */}
            Author of Calc Empire.
            {reviewerNote ? (
              <>
                {" · Reviewed by "}
                <em>{reviewerNote}</em>{" "}
                {/* TODO_VERIFY: real reviewer for medical / financial / legal */}
              </>
            ) : null}
          </p>
        </div>
      </Card>
    </Section>
  );
}
