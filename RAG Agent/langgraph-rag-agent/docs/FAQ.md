# Frequently Asked Questions (FAQ)

This document contains common questions and answers about the LangGraph RAG Agent project. The agent checks this FAQ first before querying the knowledge base.

---

## What is LangGraph?

LangGraph is a framework designed for building stateful multi-step LLM workflows and agents. It extends LangChain by adding graph-based workflow orchestration, allowing you to build agents with cycles and conditional logic.

---

## What is LangSmith?

LangSmith is a developer platform for debugging, testing, monitoring, and evaluating LLM applications. It provides experiment tracking, dataset management, and evaluation tools to improve your LLM applications over time.

---

## What is LangChain?

LangChain is an open-source framework that simplifies building applications using large language models. It was created by Harrison Chase.

---

## What is RAG?

RAG stands for Retrieval-Augmented Generation. It combines retrieval of relevant documents with generative AI to produce accurate, grounded answers. The system first retrieves relevant context from a vector store, then uses an LLM to generate an answer based on that context.

---

## What is FAISS?

FAISS is a library for efficient similarity search and clustering of dense vectors. It is commonly used for vector store retrieval in RAG systems to find documents similar to a user's question.

---

## What are embeddings?

Embeddings are vector representations of text that capture semantic meaning. They enable similarity search across documents by converting text into numerical vectors that can be compared.

---

## How do I run this agent?

Run the agent with a question as an argument: `python main.py "Your question here"`. For interactive mode, run `python main.py` and enter your question when prompted.

---

## How do I run evaluation?

For local evaluation (no LangSmith key needed): `python evaluation/run_eval.py`. To upload results to the LangSmith UI: `python evaluation/run_eval_ui.py` (requires LANGCHAIN_API_KEY).

---

## What providers are supported?

The agent supports Groq (free, for testing) and OpenAI (for production). Set GROQ_API_KEY to use Groq with HuggingFace embeddings, or OPENAI_API_KEY to use OpenAI for both embeddings and the LLM.

---

## Where is the knowledge base stored?

The knowledge base is in `data/knowledge_base.txt`. You can edit this file to add or update content that the agent can retrieve and use when answering questions.
