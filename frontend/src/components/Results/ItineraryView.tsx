import { useRef } from 'react';
import type { ItineraryDay, WeatherDay } from '../../api/types';

const BLOCKS: { key: 'morning' | 'afternoon' | 'evening'; label: string; meal: keyof ItineraryDay['meals'] }[] = [
  { key: 'morning', label: 'Morning', meal: 'breakfast' },
  { key: 'afternoon', label: 'Afternoon', meal: 'lunch' },
  { key: 'evening', label: 'Evening', meal: 'dinner' },
];

export function ItineraryView({
  destination,
  itinerary,
  weather = [],
}: {
  destination: string;
  itinerary: ItineraryDay[];
  weather?: WeatherDay[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const weatherByDay = new Map(weather.map((w, i) => [i + 1, w]));

  function handlePrint() {
    // <details> hides closed content via a UA mechanism CSS can't override,
    // so force every day open for the print, then restore what was closed.
    const allDetails = containerRef.current?.querySelectorAll('details') ?? [];
    const closed = Array.from(allDetails).filter((d) => !d.open);
    closed.forEach((d) => (d.open = true));

    const restore = () => {
      closed.forEach((d) => (d.open = false));
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    window.print();
  }

  return (
    <section className="itinerary-print">
      <div className="flex items-center justify-between">
        <h3 className="print:hidden text-sm font-medium text-ink-muted">Day-by-day itinerary</h3>
        <button
          type="button"
          onClick={handlePrint}
          className="print:hidden text-sm font-medium text-accent-strong underline"
        >
          Download itinerary (PDF)
        </button>
      </div>
      <h2 className="hidden print:block print:mb-4 print:text-xl print:font-semibold">Itinerary for {destination}</h2>
      <div ref={containerRef} className="mt-2 flex flex-col gap-2">
        {itinerary.map((day) => {
          const dayWeather = weatherByDay.get(day.day);
          return (
          <details key={day.day} className="rounded-xl border border-border bg-surface-raised" open={day.day === 1}>
            <summary className="itinerary-day-summary cursor-pointer select-none px-4 py-3 font-medium text-ink">
              Day {day.day}
              {dayWeather && (
                <span className="ml-2 text-xs font-normal text-ink-muted">
                  {dayWeather.summary}, {dayWeather.tempMinC}-{dayWeather.tempMaxC}°C
                  {dayWeather.rainLikely ? ' ☔' : ''}
                </span>
              )}
            </summary>
            <div className="flex flex-col gap-3 border-t border-border px-4 py-3">
              {BLOCKS.map(({ key, label, meal }) => (
                <div key={key}>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</p>
                  <p className="text-sm text-ink">{day[key]}</p>
                  {day.meals[meal] && <p className="mt-0.5 text-xs text-ink-muted">Meal: {day.meals[meal]}</p>}
                </div>
              ))}
            </div>
          </details>
          );
        })}
      </div>
    </section>
  );
}
