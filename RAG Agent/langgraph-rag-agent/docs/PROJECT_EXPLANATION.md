# Project Explanation — How to Explain This to Other Developers

Use this document when presenting or explaining the LangGraph RAG Agent to other developers. It covers what was built, how it was built, and why.

---

## 1. Elevator Pitch (30 seconds)

**"This is a RAG (Retrieval-Augmented Generation) QA agent built with LangGraph. You ask a question, it retrieves relevant chunks from a knowledge base, and an LLM generates an answer grounded in that context. It supports Groq (free) and OpenAI, and we evaluate it with LangSmith."**

---

## 2. What Problem Does It Solve?

- **Raw LLMs hallucinate** — They make up facts when they don't know the answer.
- **RAG grounds answers** — We first retrieve relevant documents, then the LLM answers only from that context.
- **LangGraph structures the flow** — Instead of a single chain, we have a clear graph: retrieve → generate → final, which is easy to extend (e.g., re-retrieval, routing).

---

## 3. How It Was Developed (Step-by-Step)

### Phase 1: Core RAG Pipeline

1. **State schema** (`app/state.py`) — Defined what flows between nodes: `question`, `documents`, `answer`.
2. **Vector store** (`app/vectorstore.py`) — Loaded `knowledge_base.txt`, chunked it (500 chars, 50 overlap), built a FAISS index with embeddings.
3. **Retrieve node** (`app/nodes.py`) — `similarity_search(question, k=3)` to get top 3 chunks.
4. **Generate node** — LLM prompt: "Answer only from this context. If you don't know, say so."
5. **Graph** (`app/graph.py`) — Wired: `retrieve → generate → final → END`.
6. **Agent interface** (`app/agent.py`) — `run_agent(question)` invokes the graph and returns the answer.
7. **CLI** (`main.py`) — `python main.py "question"` or interactive mode.

### Phase 2: Provider Flexibility

- **Problem**: OpenAI requires billing; Groq keys were mistakenly put in `OPENAI_API_KEY`.
- **Solution**: Added `app/config.py` with `use_groq()`. When `GROQ_API_KEY` is set, use Groq LLM + HuggingFace embeddings (free). Otherwise use OpenAI for both.
- **Result**: Developers can test without paying; production can use OpenAI.

### Phase 3: Evaluation

- **Dataset** (`data/dataset.json`) — Q&A pairs: `{ "question": "...", "answer": "..." }`.
- **Local eval** (`evaluation/run_eval.py`) — Runs agent on each question, compares to expected answer (correctness + relevance), prints scores. No LangSmith key needed.
- **LangSmith UI** (`evaluation/run_eval_ui.py`) — Creates dataset in LangSmith, runs eval, uploads results for dashboard viewing. Needs `LANGCHAIN_API_KEY`.
- **Evaluators**: Correctness (word overlap with expected), Relevance (answer length sanity check).

### Phase 4: Documentation & Developer Experience

- **Architecture** — File-by-file guide.
- **Run guide** — Setup and run commands.
- **FAQ** — Concepts (LangGraph, RAG, FAISS, etc.).
- **Developer Q&A** — Code and logical questions.
- **Friction log** — Issues encountered and workarounds.

---

## 4. Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────┐
│   main.py   │────▶│  run_agent() │────▶│  rag_graph  │────▶│  END    │
│   (CLI)     │     │  (agent.py)  │     │  (graph.py) │     │         │
└─────────────┘     └──────────────┘     └──────┬──────┘     └─────────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌─────────────┐            ┌─────────────┐            ┌─────────────┐
             │  retrieve   │───────────▶│  generate   │───────────▶│   final     │
             │  (FAISS)    │            │  (LLM)      │            │  (passthru) │
             └─────────────┘            └─────────────┘            └─────────────┘
                    │                          │
                    │                          │
                    ▼                          ▼
             knowledge_base.txt          context + question
             (chunked, embedded)          → answer
```

**State flows through**: `question` (input) → `documents` (from retrieve) → `answer` (from generate).

---

## 5. Key Design Decisions

| Decision | Why |
|----------|-----|
| **LangGraph over plain LangChain** | Graph structure, explicit state, easy to add cycles or branches later. |
| **FAISS for vector store** | No external service, fast for small datasets, simple setup. |
| **Two providers (Groq + OpenAI)** | Free path for testing; production-ready path with OpenAI. |
| **Strict "only from context" prompt** | Reduces hallucination; agent says "I don't know" when context is insufficient. |
| **Chunk size 500, overlap 50** | Balances context size vs. retrieval precision. |
| **k=3 retrieval** | Enough context for most questions without overwhelming the LLM. |
| **TypedDict for state** | Clear schema, type hints, no magic keys. |

---

## 6. Data Flow (Execution Walkthrough)

1. **User**: `python main.py "What is LangGraph?"`
2. **main.py**: Loads `.env`, calls `run_agent("What is LangGraph?")`.
3. **agent.py**: Creates initial state `{ question, documents=[], answer="" }`, invokes `rag_graph`.
4. **retrieve_node**: FAISS `similarity_search` → 3 chunks from `knowledge_base.txt`.
5. **generate_node**: Builds prompt with context + question, calls LLM (Groq or OpenAI), parses answer.
6. **final_node**: Passes state through (no-op).
7. **agent.py**: Returns `result["answer"]`.
8. **main.py**: Prints the answer.

---

## 7. Challenges We Hit (and How We Solved Them)

| Challenge | Solution |
|-----------|----------|
| **OpenAI quota / Groq key confusion** | Dual provider support; Groq for free testing. |
| **LangSmith evaluate() with local data** | `upload_results=False` for local-only; separate script for LangSmith UI. |
| **ExperimentResults iteration fails** | Manual evaluation fallback when iterator structure differs. |
| **Dataset already exists (409)** | Handle 409, fall back to listing existing dataset. |
| **HuggingFaceEmbeddings deprecation** | Noted in friction log; can migrate to `langchain-huggingface`. |

See `FRICTION_LOG.md` for full details.

---

## 8. File Responsibilities (Quick Reference)

| File | Responsibility |
|------|-----------------|
| `main.py` | CLI entry, loads env, calls agent |
| `app/agent.py` | High-level `run_agent(question)` interface |
| `app/graph.py` | LangGraph workflow definition |
| `app/nodes.py` | retrieve, generate, final node logic |
| `app/state.py` | State schema (TypedDict) |
| `app/config.py` | Groq vs OpenAI selection |
| `app/vectorstore.py` | FAISS setup, chunking, embeddings |
| `data/knowledge_base.txt` | Source content for retrieval |
| `data/dataset.json` | Evaluation Q&A pairs |
| `evaluation/run_eval.py` | Local evaluation |
| `evaluation/run_eval_ui.py` | LangSmith evaluation + upload |

---

## 9. How to Extend (Future Work)

- **Re-retrieval**: If answer confidence is low, loop back to retrieve with a refined query.
- **Routing**: Different node paths for different question types (e.g., factual vs. procedural).
- **Multiple knowledge bases**: Load from multiple files or sources.
- **Streaming**: Stream tokens from the LLM for real-time display.
- **Persistence**: Use Pinecone/Chroma instead of FAISS for larger scale.

---

## 10. Tips for Presenting to Other Developers

1. **Start with the problem** — "LLMs hallucinate; RAG grounds them."
2. **Show the flow** — Draw the graph: retrieve → generate → final.
3. **Demo live** — Run `python main.py "What is LangGraph?"` and show the answer.
4. **Explain provider choice** — "Groq for free testing, OpenAI for production."
5. **Mention evaluation** — "We use LangSmith to measure correctness and relevance."
6. **Point to docs** — Developer Q&A, Architecture, Friction Log for deep dives.
7. **Acknowledge friction** — "We hit some LangSmith API quirks; see FRICTION_LOG.md."

---

## Related Docs

- [Developer Q&A](DEVELOPER_QA.md) — Code and logical questions
- [Architecture](ARCHITECTURE.md) — File-by-file guide
- [Run Guide](RUN_GUIDE.md) — Setup and run commands
- [FAQ](FAQ.md) — Concepts (LangGraph, RAG, etc.)
- [FRICTION_LOG.md](../FRICTION_LOG.md) — Issues and workarounds
