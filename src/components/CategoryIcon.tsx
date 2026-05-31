// Material Symbols-style category icons, drawn as inline SVGs.
//
// Each path is the Outlined / 24dp Material Symbol for its category, used as
// the leading icon on the calculator card per MD3 card anatomy. Rendered as
// currentColor so it inherits the on-secondary-container tone.

type Props = {
  category: string;
  className?: string;
  size?: number;
  ariaHidden?: boolean;
};

const PATHS: Record<string, string> = {
  // payments — Material Symbol "payments"
  finance:
    "M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Zm2 0h12V7H6v10Zm6-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm-5 4v-1h11v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z",
  // bar_chart
  stats: "M4 20V10h3v10H4Zm6.5 0V4h3v16h-3ZM17 20v-7h3v7h-3Z",
  // calculate
  math:
    "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.587-1.412T5 3h14q.825 0 1.413.587T21 5v14q0 .825-.587 1.413T19 21H5Zm0-2h14V5H5v14Zm2-2h3v-2H7v2Zm0-3h3v-2H7v2Zm0-3h10V8H7v3Zm7 6h3v-2h-3v2Zm0-3h3v-2h-3v2Z",
  // favorite (heart)
  health:
    "M12 21q-.35 0-.7-.125t-.625-.375L8.275 18.05Q5.55 15.625 3.775 12.913 2 10.2 2 7.15 2 4.6 3.713 2.8 5.425 1 8 1q1.425 0 2.7.6 1.275.6 2.3 1.7Q14.025 2.2 15.3 1.6 16.575 1 18 1q2.575 0 4.288 1.8Q24 4.6 24 7.15q0 3.05-1.775 5.762Q20.45 15.625 17.725 18.05L15.325 20.5q-.275.25-.625.375T14 21Z",
  // construction (hammer + wrench)
  construction:
    "M13.78 15.3q-.825 0-1.412-.587T11.78 13.3V9.8q0-.225.087-.412t.213-.363l1.625-1.625q.275-.275.7-.275t.7.275l1.625 1.625q.125.175.213.363T17.03 9.8v3.5q0 .825-.587 1.413t-1.412.587h-1.25ZM6.4 21l-1.4-1.4 6.6-6.6q-.3-.825-.1-1.65t.825-1.45q.875-.875 2.012-1.05t2.063.275L13.5 11.15l1.075 1.075 2.825-2.825q.45.95.275 2.075t-1.05 2q-.625.625-1.45.825t-1.65-.1L8 19.6q-.275.275-.7.275T6.4 19.6Z",
  // account_balance_wallet
  payroll:
    "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.587-1.412T5 3h14q.825 0 1.413.587T21 5v3h-2V5H5v14h14v-3h2v3q0 .825-.587 1.413T19 21H5Zm10-4q-.825 0-1.412-.587T13 15v-4q0-.825.587-1.412T15 9h7v8h-7Z",
  // casino (dice)
  betting:
    "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.587-1.412T5 3h14q.825 0 1.413.587T21 5v14q0 .825-.587 1.413T19 21H5Zm2.5-3q.625 0 1.063-.437T9 16.5q0-.625-.437-1.062T7.5 15q-.625 0-1.062.438T6 16.5q0 .625.438 1.063T7.5 18Zm0-9q.625 0 1.063-.438T9 7.5q0-.625-.437-1.062T7.5 6q-.625 0-1.062.438T6 7.5q0 .625.438 1.063T7.5 9ZM12 14q.625 0 1.063-.437T13.5 12.5q0-.625-.437-1.062T12 11q-.625 0-1.062.438T10.5 12.5q0 .625.438 1.063T12 14Zm4.5 4q.625 0 1.063-.437T18 16.5q0-.625-.437-1.062T16.5 15q-.625 0-1.062.438T15 16.5q0 .625.438 1.063T16.5 18Zm0-9q.625 0 1.063-.438T18 7.5q0-.625-.437-1.062T16.5 6q-.625 0-1.062.438T15 7.5q0 .625.438 1.063T16.5 9Z",
  // school (graduation cap)
  education:
    "M12 21 0 14.5l3-1.625V19.5L12 24l9-4.5V12.875L24 14.5 12 21Zm0-5L0 9.5 12 3l12 6.5L12 16Zm0-2.25L19.55 9.5 12 5.25 4.45 9.5 12 13.75Z",
  // pets (paw print)
  pets: "M5 13.5q-.625 0-1.062-.437T3.5 12q0-.625.438-1.062T5 10.5q.625 0 1.063.438T6.5 12q0 .625-.437 1.063T5 13.5Zm3-4q-.625 0-1.062-.437T6.5 8q0-.625.438-1.062T8 6.5q.625 0 1.063.438T9.5 8q0 .625-.437 1.063T8 9.5Zm5 0q-.625 0-1.062-.437T11.5 8q0-.625.438-1.062T13 6.5q.625 0 1.063.438T14.5 8q0 .625-.437 1.063T13 9.5Zm5 0q-.625 0-1.062-.437T16.5 8q0-.625.438-1.062T18 6.5q.625 0 1.063.438T19.5 8q0 .625-.437 1.063T18 9.5ZM6.6 22q-1.075 0-1.838-.825Q4 20.35 4 19.275q0-1.25.738-2.25T6.5 15q.85-.625 1.475-1.387T9.2 12q.55-.875 1.3-1.437T12 10q.75 0 1.5.563T14.8 12q.6.85 1.225 1.613T17.5 15q1.025.025 1.763 1.025T20 19.275q0 1.075-.763 1.9T17.4 22q-1.5 0-2.7-.5T12 21q-1.5 0-2.7.5t-2.7.5Z",
  // article (default fallback)
  articles:
    "M5 21q-.825 0-1.412-.587T3 19V5q0-.825.587-1.412T5 3h14q.825 0 1.413.587T21 5v14q0 .825-.587 1.413T19 21H5Zm0-2h14V5H5v14Zm2-2h10v-2H7v2Zm0-4h10v-2H7v2Zm0-4h10V7H7v2Z",
};

export function CategoryIcon({ category, className = "", size = 22, ariaHidden = true }: Props) {
  const d = PATHS[category] ?? PATHS.articles;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      role={ariaHidden ? undefined : "img"}
      aria-hidden={ariaHidden || undefined}
      focusable="false"
      fill="currentColor"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
