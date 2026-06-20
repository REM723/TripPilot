export interface TripInput {
  destination?: string;
  adults: number;
  children: number;
  days: number;
  preferences: string[];
  budgetInr: number;
  hotelType?: string;
  foodPreferences?: string;
  mobilityConstraints?: string;
  startingCity?: string;
  mustVisitPlaces?: string[];
}

export interface Hotel {
  name: string;
  nightlyPriceInr: number | null;
  area: string;
  amenities: string[];
  reason: string;
}

export interface Restaurant {
  name: string;
  costForTwoInr: number;
  location: string;
  cuisine: string;
  rating: number;
  groupSuitability: string;
}

export interface OptionalInclusion {
  name: string;
  description: string;
  priceInr: number;
}

export interface ItineraryDay {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  meals: { breakfast: string; lunch: string; dinner: string };
}

export interface TripSummary {
  destination: string;
  destinationWasSuggested: boolean;
  days: number;
  adults: number;
  children: number;
  preferences: string[];
  totalEstimateInr: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  localTransport: number;
  attractions: number;
  buffer: number;
  totalInr: number;
  targetRangeInr: [number, number];
}

export interface FeasiblePlan {
  status: 'ok';
  tripSummary: TripSummary;
  suggestedDestinations: string[];
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: string[];
  itinerary: ItineraryDay[];
  optionalInclusions: OptionalInclusion[];
  budgetBreakdown: BudgetBreakdown;
  whyThisFits: string;
}

export interface BudgetTooLow {
  status: 'budget_too_low';
  message: string;
  minimumViableBudgetInr: number | null;
  destination: string;
  destinationWasSuggested: boolean;
  suggestedDestinations: string[];
}

export interface BudgetTooHigh {
  status: 'budget_too_high';
  message: string;
  suggestedActions: ('lower_budget' | 'upgrade_experience')[];
  destination: string;
  destinationWasSuggested: boolean;
  suggestedDestinations: string[];
}

export type PlanResult = FeasiblePlan | BudgetTooLow | BudgetTooHigh;
