"""High-level agent interface."""

from app.graph import rag_graph
from app.state import RAGState


def run_agent(question: str) -> str:
    """Run the RAG agent on a question and return the answer."""
    initial_state: RAGState = {
        "question": question,
        "documents": [],
        "answer": "",
    }
    result = rag_graph.invoke(initial_state)
    return result["answer"]
