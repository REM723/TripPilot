import type { FeasiblePlan } from '../../api/types';
import { BudgetBreakdown } from './BudgetBreakdown';
import { HotelCards } from './HotelCards';
import { ItineraryView } from './ItineraryView';
import { OptionalInclusions } from './OptionalInclusions';
import { RestaurantCards } from './RestaurantCards';
import { TripSummary } from './TripSummary';

export function ResultsView({ plan }: { plan: FeasiblePlan }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <TripSummary summary={plan.tripSummary} />
      <HotelCards hotels={plan.hotels} />
      <RestaurantCards restaurants={plan.restaurants} />
      <ItineraryView destination={plan.tripSummary.destination} itinerary={plan.itinerary} />
      <OptionalInclusions inclusions={plan.optionalInclusions} />
      <BudgetBreakdown breakdown={plan.budgetBreakdown} />
      <section className="rounded-xl border border-accent/30 bg-accent-soft p-4">
        <h3 className="text-sm font-medium text-accent-strong">Why this fits</h3>
        <p className="mt-1 text-sm text-ink">{plan.whyThisFits}</p>
      </section>
    </div>
  );
}
