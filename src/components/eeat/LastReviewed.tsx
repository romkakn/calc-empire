function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}
function fmt(d: Date): string { return d.toISOString().slice(0, 10); }

export function LastReviewed({ date }: { date: string }) {
  const reviewed = new Date(date);
  const next = addDays(reviewed, 90);
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      <Chip>
        Last reviewed{" "}
        <time dateTime={fmt(reviewed)} className="font-[var(--md-sys-typescale-mono-font)]">
          {fmt(reviewed)}
        </time>
      </Chip>
      <Chip>
        Next review{" "}
        <time dateTime={fmt(next)} className="font-[var(--md-sys-typescale-mono-font)]">
          {fmt(next)}
        </time>
      </Chip>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[var(--md-sys-shape-corner-sm)] border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-low)] px-3 py-1.5 md-label-medium text-[var(--md-sys-color-on-surface-variant)]">
      {children}
    </span>
  );
}
