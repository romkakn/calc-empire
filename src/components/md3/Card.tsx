import type { ElementType, ReactNode } from "react";

type Variant = "elevated" | "filled" | "outlined";

const STYLES: Record<Variant, string> = {
  // M3 elevated card: surface-container-low + level-1 shadow
  elevated:
    "bg-[var(--md-sys-color-surface-container-low)] md-elevation-1 border border-transparent",
  // M3 filled card: surface-container-highest, no shadow
  filled:
    "bg-[var(--md-sys-color-surface-container-highest)] md-elevation-0 border border-transparent",
  // M3 outlined card: surface + outline-variant border, no shadow
  outlined:
    "bg-[var(--md-sys-color-surface)] md-elevation-0 border border-[var(--md-sys-color-outline-variant)]",
};

export function Card({
  variant = "outlined",
  as: As = "div",
  className = "",
  children,
}: {
  variant?: Variant;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <As
      className={[
        // M3 shape: medium (12dp) for cards
        "rounded-[var(--md-sys-shape-corner-md)]",
        "text-[var(--md-sys-color-on-surface)]",
        STYLES[variant],
        className,
      ].join(" ")}
    >
      {children}
    </As>
  );
}
