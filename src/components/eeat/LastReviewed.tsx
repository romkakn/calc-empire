function addDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function LastReviewed({ date }: { date: string }) {
  const reviewed = new Date(date);
  const next = addDays(reviewed, 90);
  return (
    <p className="mt-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2 text-sm text-[var(--color-on-surface-variant)]">
      Last reviewed: <time dateTime={fmt(reviewed)}>{fmt(reviewed)}</time>
      <span aria-hidden> · </span>
      Next review: <time dateTime={fmt(next)}>{fmt(next)}</time>
    </p>
  );
}
