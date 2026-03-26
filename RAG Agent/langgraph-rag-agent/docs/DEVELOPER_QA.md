# Developer Q&A

A reference for developers. Check this document first when you have code questions or logical questions about the LangGraph RAG Agent.

---

## Setup & Environment

### How do I set up the project from scratch?

Create a virtual environment, install dependencies, and configure `.env`:

```bash
cd langgraph-rag-agent
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` with your API keys. For testing use `GROQ_API_KEY` (free). For production use `OPENAI_API_KEY`.

### Which API key should I use?

Use `GROQ_API_KEY` for free testing (Groq LLM + HuggingFace embeddings). Use `OPENAI_API_KEY` for production (OpenAI LLM + embeddings). If both are set, Groq takes precedence.

### Why do I get `insufficient_quota` from OpenAI?

Your OpenAI account has no billing or quota. Either add billing at platform.openai.com or use `GROQ_API_KEY` for free testing.

---

## Running the Agent

### How do I run the agent with a question?

```bash
python main.py "Your question here"
```

### How do I run in interactive mode?

```bash
python main.py
```

Then type your question when prompted.

### How do I run evaluation locally?

```bash
python evaluation/run_eval.py
```

Uses `data/dataset.json`, no LangSmith key needed.

### How do I run evaluation and upload to LangSmith?

```bash
python evaluation/run_eval_ui.py
```

Requires `LANGCHAIN_API_KEY` in `.env`. Results appear in the LangSmith dashboard.

---

## Code & Architecture

### What is the flow of the RAG agent?

```
START → retrieve → generate → final → END
```

The `retrieve` node fetches relevant chunks from the vector store. The `generate` node uses the LLM to answer based on that context. The `final` node returns the state.

### Where is the graph defined?

In `app/graph.py`. It uses LangGraph's `StateGraph` with nodes: `retrieve`, `generate`, `final`.

### Where is the state schema defined?

In `app/state.py`. The state holds `question`, `documents`, and `answer`.

### How does retrieval work?

`app/nodes.py` → `retrieve_node` calls `vectorstore.similarity_search(question, k=3)` to get the top 3 relevant chunks from the FAISS index.

### Where does the knowledge base come from?

`data/knowledge_base.txt`. The vector store is built from this file. Edit it to add or update content the agent can retrieve.

### How many chunks are retrieved per question?

Three (`k=3` in `retrieve_node`). You can change this in `app/nodes.py`.

### What chunk size is used for the knowledge base?

500 characters with 50 overlap. Defined in `app/vectorstore.py` → `chunk_text()`.

### Where is the FAISS index stored?

- Groq: `data/faiss_index_hf/`
- OpenAI: `data/faiss_index/`

The index is rebuilt if it doesn't exist when you run the agent.

---

## Logical & Design Questions

### Why use LangGraph instead of a simple chain?

LangGraph adds graph-based orchestration, state management, and the ability to add cycles or conditional branches. This project uses a linear flow but is structured for future extensions (e.g., re-retrieval, routing).

### Why FAISS instead of another vector store?

FAISS is fast for local/small datasets and requires no external service. For larger scale, you could swap to Pinecone, Chroma, or similar.

### Why two embedding providers (HuggingFace vs OpenAI)?

Groq is free for testing but doesn't provide embeddings. HuggingFace embeddings run locally. OpenAI provides both LLM and embeddings for a simpler production setup.

### Why is the prompt strict about "only the provided context"?

To reduce hallucination. The agent should not invent facts; it should say "I don't know" when the context is insufficient.

### What is the evaluation dataset format?

`data/dataset.json` is a JSON array of `{ "question": "...", "answer": "..." }` pairs. The evaluator compares the agent's output to these expected answers.

---

## Extending the Project

### How do I add a new node to the graph?

1. Add the node function in `app/nodes.py`.
2. Register it in `app/graph.py` with `graph.add_node("name", node_func)`.
3. Add edges: `graph.add_edge("from_node", "to_node")` or use conditional edges.

### How do I change the LLM or embeddings?

- **LLM**: Edit `app/nodes.py` in `generate_node` (ChatGroq vs ChatOpenAI).
- **Embeddings**: Edit `app/vectorstore.py` in `_get_embeddings()`.

### How do I add more documents to the knowledge base?

Append or edit `data/knowledge_base.txt`. Delete the `data/faiss_index/` or `data/faiss_index_hf/` folder so the index is rebuilt on next run.

### How do I add new evaluation questions?

Add entries to `data/dataset.json` in the format `{ "question": "...", "answer": "..." }`.

---

## Troubleshooting

### AttributeError: 'dict' object has no attribute 'dataset_id'

Use `run_eval.py` (local) instead of `run_eval_ui.py`, or ensure you're using the correct LangSmith client version. The local eval uses `upload_results=False`.

### ModuleNotFoundError or import errors

Ensure the virtual environment is activated and you're in the project root. Run `pip install -r requirements.txt`.

### FAISS index not updating after editing knowledge_base.txt

Delete the `data/faiss_index/` or `data/faiss_index_hf/` directory. The index will be rebuilt on the next run.

### Agent gives wrong or generic answers

Check that the question is covered in `data/knowledge_base.txt`. Increase `k` in `retrieve_node` to retrieve more chunks, or improve the chunking in `vectorstore.py`.

---

## Related Docs

- [FAQ](FAQ.md) — General concepts (LangGraph, RAG, etc.)
- [Architecture](ARCHITECTURE.md) — File-by-file guide
- [Run Guide](RUN_GUIDE.md) — How to run the project
