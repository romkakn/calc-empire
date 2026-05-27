import type { ReactNode } from "react";

export function Container({
  children,
  as: As = "div",
  className = "",
}: {
  children: ReactNode;
  as?: "div" | "section" | "main" | "article" | "header" | "footer" | "nav";
  className?: string;
}) {
  return (
    <As className={`mx-auto w-full max-w-3xl px-4 sm:px-6 ${className}`}>
      {children}
    </As>
  );
}
