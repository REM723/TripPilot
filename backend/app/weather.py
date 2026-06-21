import json
import urllib.parse
import urllib.request
from datetime import date, timedelta
from typing import List, Optional, TypedDict

# ponytail: stdlib urllib instead of adding requests/httpx for two GET calls.

WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Freezing fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow",
    80: "Light showers", 81: "Showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail",
}
RAIN_CODES = {51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99}


class DayWeather(TypedDict):
    date: str
    summary: str
    temp_max: float
    temp_min: float
    rain_likely: bool


def _get_json(url: str) -> dict:
    with urllib.request.urlopen(url, timeout=8) as resp:
        return json.loads(resp.read())


def fetch_forecast(destination: str, start_date: date, days: int) -> Optional[List[DayWeather]]:
    """Best-effort daily forecast. Returns None if out of range or unavailable."""
    end_date = start_date + timedelta(days=days - 1)
    if start_date < date.today() or (start_date - date.today()).days > 15:
        return None  # outside Open-Meteo's free forecast horizon

    try:
        geo = _get_json(
            "https://geocoding-api.open-meteo.com/v1/search?"
            + urllib.parse.urlencode({"name": destination, "count": 1})
        )
        results = geo.get("results")
        if not results:
            return None
        lat, lon = results[0]["latitude"], results[0]["longitude"]

        forecast = _get_json(
            "https://api.open-meteo.com/v1/forecast?"
            + urllib.parse.urlencode(
                {
                    "latitude": lat,
                    "longitude": lon,
                    "daily": "weathercode,temperature_2m_max,temperature_2m_min",
                    "timezone": "auto",
                    "start_date": start_date.isoformat(),
                    "end_date": end_date.isoformat(),
                }
            )
        )
        daily = forecast["daily"]
    except Exception:
        return None  # ponytail: weather is a bonus, itinerary works fine without it

    return [
        {
            "date": day_str,
            "summary": WEATHER_CODES.get(daily["weathercode"][i], "Unknown"),
            "temp_max": daily["temperature_2m_max"][i],
            "temp_min": daily["temperature_2m_min"][i],
            "rain_likely": daily["weathercode"][i] in RAIN_CODES,
        }
        for i, day_str in enumerate(daily["time"])
    ]
