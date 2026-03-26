"""Graph state schema for the RAG agent."""

from typing import TypedDict


class RAGState(TypedDict):
    """Shared state across LangGraph nodes."""

    question: str
    documents: list[str]
    answer: str
