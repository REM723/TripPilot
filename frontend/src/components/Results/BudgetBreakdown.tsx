import type { BudgetBreakdown as BudgetBreakdownType } from '../../api/types';
import { formatInr } from '../../lib/currency';

const ROWS: { key: keyof Pick<BudgetBreakdownType, 'accommodation' | 'food' | 'localTransport' | 'attractions' | 'buffer'>; label: string; barClass: string }[] = [
  { key: 'accommodation', label: 'Accommodation', barClass: 'bg-accent' },
  { key: 'food', label: 'Food', barClass: 'bg-accent/80' },
  { key: 'localTransport', label: 'Local transport', barClass: 'bg-accent/60' },
  { key: 'attractions', label: 'Attractions', barClass: 'bg-accent/40' },
  { key: 'buffer', label: 'Buffer', barClass: 'bg-accent/25' },
];

export function BudgetBreakdown({ breakdown }: { breakdown: BudgetBreakdownType }) {
  const [min, max] = breakdown.targetRangeInr;
  const fits = breakdown.totalInr >= min && breakdown.totalInr <= max;

  return (
    <section className="rounded-xl border border-border bg-surface-raised p-4">
      <h3 className="text-sm font-medium text-ink-muted">Budget breakdown</h3>

      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-surface-sunken">
        {ROWS.map(({ key, barClass }) => (
          <div
            key={key}
            className={barClass}
            style={{ width: `${(breakdown[key] / breakdown.totalInr) * 100}%` }}
          />
        ))}
      </div>

      <dl className="mt-3 flex flex-col gap-1.5">
        {ROWS.map(({ key, label, barClass }) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <dt className="flex items-center gap-2 text-ink-muted">
              <span className={`h-2 w-2 rounded-full ${barClass}`} />
              {label}
            </dt>
            <dd className="text-ink">{formatInr(breakdown[key])}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 border-t border-border pt-3 text-sm text-ink-muted">
        {fits
          ? `Your estimated total of ${formatInr(breakdown.totalInr)} fits within the typical ${formatInr(min)} to ${formatInr(max)} range for a trip like this.`
          : `Your estimated total is ${formatInr(breakdown.totalInr)}.`}
      </p>
    </section>
  );
}
