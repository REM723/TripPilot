import type { Restaurant } from '../../api/types';
import { formatInr } from '../../lib/currency';

export function RestaurantCards({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <section>
      <h3 className="text-sm font-medium text-ink-muted">Restaurants</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {restaurants.map((restaurant) => (
          <div key={restaurant.name} className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4">
            <div>
              <p className="font-medium text-ink">{restaurant.name}</p>
              <p className="text-sm text-ink-muted">{restaurant.location}</p>
            </div>
            <p className="text-sm text-ink">
              {restaurant.cuisine} · {restaurant.rating.toFixed(1)}★
            </p>
            <p className="text-sm font-semibold text-ink">{formatInr(restaurant.costForTwoInr)} for two</p>
            <p className="mt-auto text-xs text-ink-muted">{restaurant.groupSuitability}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
