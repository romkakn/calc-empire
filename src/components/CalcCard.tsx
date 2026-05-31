import Link from "next/link";
import { CategoryIcon } from "./CategoryIcon";
import { CATEGORIES } from "@/lib/site";

// MD3 calculator card — elevated variant with a leading-icon slot.
//
// Anatomy (per https://m3.material.io/components/cards):
//   - Container: surface-container-low at level1 elevation, 12dp corner.
//   - Leading icon: 40dp circle of secondary-container, holding the 22dp
//     CategoryIcon in on-secondary-container tone.
//   - Headline: title-medium, on-surface.
//   - Supporting text: body-small, on-surface-variant.
//   - Category badge: label-small uppercase chip in surface-container-high.
//
// Interaction:
//   - Hover/focus state layer via ::before on the inner Card (on-surface
//     overlay at hover 8% / focus 10%).
//   - hover lifts to elevation level2 (md-elevation-2).
//   - focus-visible: 2px outline on the link, primary tone, 2px offset.

type Props = {
  slug: string;
  title: string;
  description?: string;
  category: string;
  tier?: string;
  /** When the card is on a category page, hide the redundant category badge. */
  hideCategory?: boolean;
};

export function CalcCard({ slug, title, description, category, tier, hideCategory }: Props) {
  const catMeta = CATEGORIES[category];
  const catLabel = catMeta?.label ?? category;
  const aria = description
    ? `${title} — ${description}`
    : `${title} — open the ${catLabel.toLowerCase()} calculator`;

  return (
    <Link
      href={`/${slug}`}
      aria-label={aria}
      className="group block h-full rounded-[var(--md-sys-shape-corner-md)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--md-sys-color-primary)] focus-visible:outline-offset-2"
    >
      <article
        className={[
          "relative overflow-hidden h-full",
          "rounded-[var(--md-sys-shape-corner-md)]",
          "bg-[var(--md-sys-color-surface-container-low)]",
          "text-[var(--md-sys-color-on-surface)]",
          "border border-[var(--md-sys-color-outline-variant)]",
          "shadow-[var(--md-sys-elevation-1)]",
          "transition-shadow duration-[var(--md-sys-motion-duration-short3)]",
          "group-hover:shadow-[var(--md-sys-elevation-2)]",
          "group-focus-visible:shadow-[var(--md-sys-elevation-2)]",
          // State layer applied via ::before — on-surface @ 8% hover / 10% focus
          "before:content-[''] before:absolute before:inset-0 before:rounded-[inherit]",
          "before:bg-[var(--md-sys-color-on-surface)] before:opacity-0",
          "before:transition-opacity before:duration-[var(--md-sys-motion-duration-short3)]",
          "before:pointer-events-none",
          "group-hover:before:opacity-[0.08] group-focus-visible:before:opacity-[0.10]",
        ].join(" ")}
      >
        <div className="relative z-[1] flex items-start gap-3 p-4">
          {/* Leading icon — secondary-container slot, 40dp */}
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
          >
            <CategoryIcon category={category} />
          </span>

          <div className="min-w-0 flex-1">
            <h3 className="md-title-medium text-[var(--md-sys-color-on-surface)] group-hover:text-[var(--md-sys-color-primary)] transition-colors duration-[var(--md-sys-motion-duration-short3)]">
              {title}
            </h3>

            {description ? (
              <p className="md-body-small mt-1 text-[var(--md-sys-color-on-surface-variant)] line-clamp-2">
                {description}
              </p>
            ) : null}

            {!hideCategory || tier ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {!hideCategory ? (
                  <span className="md-label-small uppercase tracking-wide px-2 py-0.5 rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)]">
                    {catLabel}
                  </span>
                ) : null}
                {tier ? (
                  <span className="md-label-small uppercase tracking-wide px-2 py-0.5 rounded-[var(--md-sys-shape-corner-full)] bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]">
                    {tier}-tier
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
