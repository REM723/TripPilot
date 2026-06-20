import type { ItineraryDay } from '../api/types';

export function buildItineraryText(destination: string, itinerary: ItineraryDay[]): string {
  const lines: string[] = [`Itinerary for ${destination}`, ''];

  for (const day of itinerary) {
    lines.push(`Day ${day.day}`);
    lines.push(`Morning: ${day.morning}`);
    lines.push(`Afternoon: ${day.afternoon}`);
    lines.push(`Evening: ${day.evening}`);
    lines.push(
      `Meals: Breakfast - ${day.meals.breakfast} | Lunch - ${day.meals.lunch} | Dinner - ${day.meals.dinner}`
    );
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadItinerary(destination: string, itinerary: ItineraryDay[]) {
  const blob = new Blob([buildItineraryText(destination, itinerary)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${destination.replace(/\s+/g, '-').toLowerCase()}-itinerary.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
