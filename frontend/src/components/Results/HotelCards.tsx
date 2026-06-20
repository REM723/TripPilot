import type { Hotel } from '../../api/types';
import { formatInr } from '../../lib/currency';

export function HotelCards({ hotels }: { hotels: Hotel[] }) {
  return (
    <section>
      <h3 className="text-sm font-medium text-ink-muted">Hotels</h3>
      <div className="mt-2 grid gap-3 sm:grid-cols-3">
        {hotels.map((hotel) => (
          <div key={hotel.name} className="flex flex-col gap-2 rounded-xl border border-border bg-surface-raised p-4">
            <div>
              <p className="font-medium text-ink">{hotel.name}</p>
              <p className="text-sm text-ink-muted">{hotel.area}</p>
            </div>
            <p className="text-sm font-semibold text-ink">
              {hotel.nightlyPriceInr !== null ? `${formatInr(hotel.nightlyPriceInr)}/night` : 'Price on request'}
            </p>
            {hotel.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {hotel.amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-surface-sunken px-2 py-0.5 text-xs text-ink-muted">
                    {amenity}
                  </span>
                ))}
              </div>
            )}
            <p className="mt-auto text-xs text-ink-muted">{hotel.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
