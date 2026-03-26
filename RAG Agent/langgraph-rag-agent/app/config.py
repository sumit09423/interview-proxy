"""Provider configuration: Groq (testing) vs OpenAI (production)."""

import os


def use_groq() -> bool:
    """Use Groq when GROQ_API_KEY is set. Otherwise use OpenAI."""
    return bool(os.getenv("GROQ_API_KEY"))


def get_llm_provider() -> str:
    """Return 'groq' or 'openai' for logging."""
    return "groq" if use_groq() else "openai"
