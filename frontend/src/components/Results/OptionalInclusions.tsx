import type { OptionalInclusion } from '../../api/types';
import { formatInr } from '../../lib/currency';

export function OptionalInclusions({ inclusions }: { inclusions: OptionalInclusion[] }) {
  if (inclusions.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm font-medium text-ink-muted">Optional add-ons</h3>
      <div className="mt-2 divide-y divide-border rounded-xl border border-border bg-surface-raised">
        {inclusions.map((inclusion) => (
          <div key={inclusion.name} className="flex items-start justify-between gap-3 px-4 py-3">
            <div>
              <p className="font-medium text-ink">{inclusion.name}</p>
              <p className="text-sm text-ink-muted">{inclusion.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-surface-sunken px-2.5 py-1 text-xs font-medium text-ink-muted">
              +{formatInr(inclusion.priceInr)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
