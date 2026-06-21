from typing import Any, List, Optional

from pydantic import BaseModel, Field


class TripRequest(BaseModel):
    budget: int = Field(gt=0, description="Total trip budget in INR")
    adults: int = Field(ge=1)
    children: int = Field(ge=0, default=0)
    days: int = Field(gt=0)
    preferences: List[str] = Field(default_factory=list, description="e.g. Nature, Beaches, Adventure")
    destination: Optional[str] = Field(default=None, description="Leave blank to get a suggestion")
    hotel_type: str = Field(default="Standard", description="Budget / Standard / Luxury")
    food_preferences: List[str] = Field(default_factory=list)
    starting_city: Optional[str] = None
    must_visit_places: List[str] = Field(default_factory=list)
    mobility_constraints: Optional[str] = None
    start_date: Optional[str] = Field(default=None, description="ISO date, e.g. 2026-07-01. Used for weather-aware planning.")
    language: str = Field(default="English", description="Language for AI-generated content, e.g. Hindi, Tamil")


class Hotel(BaseModel):
    name: str
    type: str
    price_per_night: Any
    highlights: str = ""
    address: str = ""


class Restaurant(BaseModel):
    name: str
    cost_for_two_inr: int
    location: str
    cuisine: str
    rating: float
    group_suitability: str


class OptionalInclusion(BaseModel):
    name: str
    description: str
    price_inr: int


class DayMeals(BaseModel):
    breakfast: str
    lunch: str
    dinner: str


class WeatherDay(BaseModel):
    date: str
    summary: str
    temp_max: float
    temp_min: float
    rain_likely: bool


class ItineraryDay(BaseModel):
    day: int
    morning: str
    afternoon: str
    evening: str
    meals: DayMeals


class TripResponse(BaseModel):
    status: str  # "ok" | "budget_too_low" | "budget_too_high"
    message: Optional[str] = None
    minimum_viable_budget: Optional[int] = None
    suggested_actions: List[str] = Field(default_factory=list)

    destination: Optional[str] = None
    destination_was_suggested: bool = False
    suggested_destinations: List[str] = Field(default_factory=list)

    cost_breakdown: dict = Field(default_factory=dict)
    hotels: List[Hotel] = Field(default_factory=list)
    restaurants: List[Restaurant] = Field(default_factory=list)
    attractions: List[str] = Field(default_factory=list)
    optional_inclusions: List[OptionalInclusion] = Field(default_factory=list)
    itinerary: List[ItineraryDay] = Field(default_factory=list)
    weather: List[WeatherDay] = Field(default_factory=list)
    why_this_fits: str = ""
