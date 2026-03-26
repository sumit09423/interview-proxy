"""LangGraph workflow definition."""

from langgraph.graph import StateGraph, END

from app.state import RAGState
from app.nodes import retrieve_node, generate_node, final_node


def build_graph():
    """Build and compile the RAG agent graph."""
    graph = StateGraph(RAGState)

    graph.add_node("retrieve", retrieve_node)
    graph.add_node("generate", generate_node)
    graph.add_node("final", final_node)

    graph.set_entry_point("retrieve")
    graph.add_edge("retrieve", "generate")
    graph.add_edge("generate", "final")
    graph.add_edge("final", END)

    return graph.compile()


rag_graph = build_graph()
