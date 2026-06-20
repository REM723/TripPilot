from functools import lru_cache

from langchain_groq import ChatGroq

from .config import settings


@lru_cache
def get_llm() -> ChatGroq:
    return ChatGroq(
        temperature=0,
        groq_api_key=settings.groq_api_key,
        model_name=settings.groq_model,
    )
