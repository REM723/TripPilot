import type { Hotel, ItineraryDay, OptionalInclusion, PlanResult, Restaurant, TripInput, WeatherDay } from './types';
import { formatInrInText } from '../lib/currency';

// Swappable client: this file is the only thing that knows the backend's wire
// format (snake_case FastAPI JSON). Everything past this module deals in the
// camelCase types from ./types. Point BASE_URL elsewhere or swap the fetch
// call to target a different backend without touching any component.
const BASE_URL = '/api';

interface BackendHotel {
  name: string;
  type: string;
  price_per_night: number | string;
  highlights: string;
  address: string;
}

interface BackendRestaurant {
  name: string;
  cost_for_two_inr: number;
  location: string;
  cuisine: string;
  rating: number;
  group_suitability: string;
}

interface BackendOptionalInclusion {
  name: string;
  description: string;
  price_inr: number;
}

interface BackendItineraryDay {
  day: number;
  morning: string;
  afternoon: string;
  evening: string;
  meals: { breakfast: string; lunch: string; dinner: string };
}

interface BackendWeatherDay {
  date: string;
  summary: string;
  temp_max: number;
  temp_min: number;
  rain_likely: boolean;
}

interface BackendResponse {
  status: 'ok' | 'budget_too_low' | 'budget_too_high';
  message: string | null;
  minimum_viable_budget: number | null;
  suggested_actions: ('lower_budget' | 'upgrade_experience')[];
  destination: string;
  destination_was_suggested: boolean;
  suggested_destinations: string[];
  cost_breakdown: {
    accommodation: number;
    food: number;
    transport: number;
    attractions: number;
    buffer: number;
    total: number;
    target_range_inr: [number, number];
  };
  hotels: BackendHotel[];
  restaurants: BackendRestaurant[];
  attractions: string[];
  optional_inclusions: BackendOptionalInclusion[];
  itinerary: BackendItineraryDay[];
  weather: BackendWeatherDay[];
  why_this_fits: string;
}

function mapHotel(h: BackendHotel): Hotel {
  return {
    name: h.name,
    nightlyPriceInr: typeof h.price_per_night === 'number' ? h.price_per_night : null,
    area: h.address,
    amenities: h.highlights ? [h.highlights] : [],
    reason: `${h.type} pick within your accommodation budget`,
  };
}

function mapRestaurant(r: BackendRestaurant): Restaurant {
  return {
    name: r.name,
    costForTwoInr: r.cost_for_two_inr,
    location: r.location,
    cuisine: r.cuisine,
    rating: r.rating,
    groupSuitability: r.group_suitability,
  };
}

function mapOptionalInclusion(o: BackendOptionalInclusion): OptionalInclusion {
  return { name: o.name, description: o.description, priceInr: o.price_inr };
}

function mapItineraryDay(d: BackendItineraryDay): ItineraryDay {
  return { day: d.day, morning: d.morning, afternoon: d.afternoon, evening: d.evening, meals: d.meals };
}

function mapWeatherDay(w: BackendWeatherDay): WeatherDay {
  return { date: w.date, summary: w.summary, tempMaxC: w.temp_max, tempMinC: w.temp_min, rainLikely: w.rain_likely };
}

function toRequestBody(input: TripInput) {
  return {
    budget: input.budgetInr,
    adults: input.adults,
    children: input.children,
    days: input.days,
    preferences: input.preferences,
    destination: input.destination || undefined,
    hotel_type: input.hotelType || 'Standard',
    food_preferences: input.foodPreferences ? [input.foodPreferences] : [],
    starting_city: input.startingCity || undefined,
    must_visit_places: input.mustVisitPlaces ?? [],
    mobility_constraints: input.mobilityConstraints || undefined,
    start_date: input.startDate || undefined,
    language: input.language || 'English',
  };
}

export async function requestPlan(input: TripInput): Promise<PlanResult> {
  const res = await fetch(`${BASE_URL}/plan-trip`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toRequestBody(input)),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(
      Array.isArray(detail?.detail) ? detail.detail.join(', ') : 'The planner could not process this request.'
    );
  }

  const data: BackendResponse = await res.json();

  if (data.status === 'budget_too_low') {
    return {
      status: 'budget_too_low',
      message: formatInrInText(data.message ?? 'This budget is too low for a basic trip.'),
      minimumViableBudgetInr: data.minimum_viable_budget,
      destination: data.destination,
      destinationWasSuggested: data.destination_was_suggested,
      suggestedDestinations: data.suggested_destinations,
    };
  }

  if (data.status === 'budget_too_high') {
    return {
      status: 'budget_too_high',
      message: formatInrInText(data.message ?? 'This budget is well above what this trip needs.'),
      suggestedActions: data.suggested_actions,
      destination: data.destination,
      destinationWasSuggested: data.destination_was_suggested,
      suggestedDestinations: data.suggested_destinations,
    };
  }

  return {
    status: 'ok',
    tripSummary: {
      destination: data.destination,
      destinationWasSuggested: data.destination_was_suggested,
      days: input.days,
      adults: input.adults,
      children: input.children,
      preferences: input.preferences,
      totalEstimateInr: data.cost_breakdown.total,
    },
    suggestedDestinations: data.suggested_destinations,
    hotels: data.hotels.map(mapHotel),
    restaurants: data.restaurants.map(mapRestaurant),
    attractions: data.attractions,
    itinerary: data.itinerary.map(mapItineraryDay),
    weather: data.weather.map(mapWeatherDay),
    optionalInclusions: data.optional_inclusions.map(mapOptionalInclusion),
    whyThisFits: formatInrInText(data.why_this_fits),
    budgetBreakdown: {
      accommodation: data.cost_breakdown.accommodation,
      food: data.cost_breakdown.food,
      localTransport: data.cost_breakdown.transport,
      attractions: data.cost_breakdown.attractions,
      buffer: data.cost_breakdown.buffer,
      totalInr: data.cost_breakdown.total,
      targetRangeInr: data.cost_breakdown.target_range_inr,
    },
  };
}
