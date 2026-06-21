from datetime import date, timedelta

from .weather import fetch_forecast


def test_rejects_past_date():
    assert fetch_forecast("Goa", date.today() - timedelta(days=1), 3) is None


def test_rejects_too_far_future():
    assert fetch_forecast("Goa", date.today() + timedelta(days=30), 3) is None
