import type { TripSummary as TripSummaryType } from '../../api/types';
import { formatInr } from '../../lib/currency';

export function TripSummary({ summary }: { summary: TripSummaryType }) {
  const travelers = summary.children > 0 ? `${summary.adults} adults, ${summary.children} children` : `${summary.adults} adults`;

  return (
    <section className="rounded-xl border border-border bg-surface-raised p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-ink">{summary.destination}</h2>
        <span className="text-lg font-semibold text-ink">{formatInr(summary.totalEstimateInr)}</span>
      </div>
      <p className="mt-1 text-sm text-ink-muted">
        {summary.days} {summary.days === 1 ? 'day' : 'days'} · {travelers}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {summary.preferences.map((pref) => (
          <span key={pref} className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent-strong">
            {pref}
          </span>
        ))}
      </div>
    </section>
  );
}
