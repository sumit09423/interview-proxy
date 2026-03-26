# LangGraph RAG Agent — Architecture & File Guide

## Overview

RAG agent: retrieve from knowledge base → generate answer with LLM.

## Flow

```
START → retrieve → generate → final → END
```

## Key Files

| File | Purpose |
|------|---------|
| `app/state.py` | State: question, documents, answer |
| `app/config.py` | Groq vs OpenAI selection |
| `app/vectorstore.py` | FAISS + embeddings for knowledge base |
| `app/nodes.py` | retrieve_node, generate_node, final_node |
| `app/graph.py` | LangGraph workflow |
| `app/agent.py` | run_agent(question) |
| `main.py` | CLI entry |

## Data

- `data/knowledge_base.txt` — Source documents
- `data/dataset.json` — Evaluation Q&A pairs
