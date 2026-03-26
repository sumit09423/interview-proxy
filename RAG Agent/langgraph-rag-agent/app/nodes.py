"""LangGraph nodes for the RAG agent."""

from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from app.config import use_groq
from app.state import RAGState
from app.vectorstore import get_vector_store

_vector_store = None


def _get_vector_store():
    global _vector_store
    if _vector_store is None:
        _vector_store = get_vector_store()
    return _vector_store


def retrieve_node(state: RAGState) -> dict:
    """Fetch relevant documents from vector store."""
    question = state["question"]
    vectorstore = _get_vector_store()
    docs = vectorstore.similarity_search(question, k=3)
    documents = [doc.page_content for doc in docs]
    return {"documents": documents}


def generate_node(state: RAGState) -> dict:
    """Generate answer using LLM with retrieved context."""
    question = state["question"]
    documents = state["documents"]
    context = "\n\n".join(documents)

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a helpful assistant that answers questions based only on the provided context.
If the context does not contain enough information to answer the question, say so.
Do not make up or hallucinate information. Keep answers concise."""),
        ("human", "Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"),
    ])

    if use_groq():
        llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0)
    else:
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    chain = prompt | llm | StrOutputParser()
    answer = chain.invoke({"context": context, "question": question})

    return {"answer": answer}


def final_node(state: RAGState) -> dict:
    """Return the final response (state passthrough)."""
    return state
