# LangGraph RAG Agent — System Design & Development Plan

## Overview

This document outlines the system architecture and step-by-step development plan for building a Retrieval-Augmented QA Agent using LangGraph, with LangSmith evaluation.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LANGGRAPH RAG AGENT                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐     ┌─────────────────┐     ┌──────────────┐                │
│   │  User    │────▶│  LangGraph      │────▶│  Evaluation  │                │
│   │  Input   │     │  Agent Pipeline │     │  (LangSmith) │                │
│   └──────────┘     └─────────────────┘     └──────────────┘                │
│                            │                                                │
│                            │                                                │
│   ┌───────────────────────┼───────────────────────┐                        │
│   │                       ▼                       │                        │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│   │  │ retrieve_   │  │ generate_   │  │ final_      │                     │
│   │  │ node        │─▶│ node        │─▶│ node        │                     │
│   │  └──────┬──────┘  └──────┬──────┘  └─────────────┘                     │
│   │         │                │                                              │
│   │         ▼                ▼                                              │
│   │  ┌─────────────┐  ┌─────────────┐                                       │
│   │  │ FAISS       │  │ OpenAI      │                                       │
│   │  │ Vector Store│  │ LLM         │                                       │
│   │  └─────────────┘  └─────────────┘                                       │
│   └───────────────────────────────────────────────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Data Layer

| Component | Purpose | Format |
|-----------|---------|--------|
| `knowledge_base.txt` | Source documents for RAG retrieval | Plain text, one fact per line or paragraph |
| `dataset.json` | Evaluation Q&A pairs (5–10 examples) | JSON array of `{question, answer}` |
| FAISS index | Vector embeddings of knowledge base | Binary file (generated at runtime) |

### 2.2 Core Agent Layer

| Component | Responsibility |
|-----------|----------------|
| **State** (`state.py`) | Defines shared graph state schema |
| **Nodes** (`nodes.py`) | Implements `retrieve_node`, `generate_node`, `final_node` |
| **Graph** (`graph.py`) | Builds LangGraph workflow, wires nodes and edges |
| **Agent** (`agent.py`) | High-level interface to invoke the graph |

### 2.3 Application Layer

| Component | Responsibility |
|-----------|----------------|
| `main.py` | CLI entry point for interactive Q&A |
| `run_eval.py` | Batch evaluation script with LangSmith integration |

### 2.4 External Services

| Service | Role |
|---------|------|
| OpenAI API | Embeddings (text-embedding-3-small) + LLM (gpt-4o-mini or gpt-4o) |
| LangSmith | Tracing, experiments, evaluation metrics |

---

## 3. Data Flow

```
1. User Question
        │
        ▼
2. retrieve_node
   • Load question from state
   • Embed question (OpenAI)
   • Query FAISS for top-k similar chunks
   • Update state: documents = [retrieved chunks]
        │
        ▼
3. generate_node
   • Load question + documents from state
   • Build prompt: question + context
   • Call LLM
   • Update state: answer = LLM response
        │
        ▼
4. final_node
   • Return answer from state
   • (Optional: format for output)
        │
        ▼
5. Response to User
```

---

## 4. State Schema

```python
# TypedDict or Pydantic model
{
    "question": str,      # Input question
    "documents": List[str],  # Retrieved chunks from FAISS
    "answer": str        # Generated answer
}
```

Each node reads from and writes to this shared state.

---

## 5. Development Steps (Phased Plan)

### Phase 1: Project Setup & Data Preparation

| Step | Task | Output |
|------|------|--------|
| 1.1 | Create project structure (folders, empty files) | `langgraph-rag-agent/` with `app/`, `data/`, `evaluation/` |
| 1.2 | Create `requirements.txt` (langgraph, langchain, faiss-cpu, openai, python-dotenv) | Dependencies file |
| 1.3 | Create `.env.example` and document env vars | Config template |
| 1.4 | Write `knowledge_base.txt` with 5–10 facts (LangGraph, LangSmith, LangChain) | Knowledge base |
| 1.5 | Create `dataset.json` with 5–10 Q&A pairs aligned to knowledge base | Evaluation dataset |

### Phase 2: Vector Store & Retrieval

| Step | Task | Output |
|------|------|--------|
| 2.1 | Script to load `knowledge_base.txt`, chunk text | Chunking logic |
| 2.2 | Embed chunks using OpenAI embeddings | Embedding pipeline |
| 2.3 | Build FAISS index and persist (or build at startup) | Vector store |
| 2.4 | Implement `retrieve_node`: embed question → query FAISS → return top-k | Working retrieval |

### Phase 3: LangGraph Agent

| Step | Task | Output |
|------|------|--------|
| 3.1 | Define state schema in `state.py` | `RAGState` TypedDict |
| 3.2 | Implement `generate_node`: prompt + LLM call | Answer generation |
| 3.3 | Implement `final_node`: return answer | Response formatting |
| 3.4 | Build graph in `graph.py`: START → retrieve → generate → END | Compiled graph |
| 3.5 | Create `agent.py` wrapper to invoke graph | Agent interface |
| 3.6 | Implement `main.py` CLI (read question, run agent, print answer) | Runnable demo |

### Phase 4: LangSmith Integration

| Step | Task | Output |
|------|------|--------|
| 4.1 | Configure LangSmith tracing (env vars) | Traces in LangSmith UI |
| 4.2 | Ensure all LLM/chain calls are traced | Full trace visibility |
| 4.3 | (Optional) Add custom metadata to traces | Richer debugging |

### Phase 5: Evaluation

| Step | Task | Output |
|------|------|--------|
| 5.1 | Create `run_eval.py`: load dataset, run agent per question | Batch runner |
| 5.2 | Implement correctness evaluator (e.g., LLM-as-judge or string similarity) | Scoring function |
| 5.3 | Implement answer relevance evaluator | Second metric |
| 5.4 | Log runs to LangSmith experiments | Experiment in UI |
| 5.5 | Aggregate and print metrics (correctness, relevance) | Summary output |

### Phase 6: Polish & Demo Readiness

| Step | Task | Output |
|------|------|--------|
| 6.1 | Write README with setup, run, and eval instructions | Documentation |
| 6.2 | Add Friction Log section (template) | Feedback doc |
| 6.3 | Verify checklist: agent, data, eval, config, demo | Sign-off |

---

## 6. Dependency Graph

```
Phase 1 (Setup) ──────────────────────────────────────────────┐
                                                              │
Phase 2 (Vector Store) ◀── depends on Phase 1                 │
        │                                                     │
        ▼                                                     │
Phase 3 (Agent) ◀── depends on Phase 2                        │
        │                                                     │
        ├─────────────────────────────────────────────────────┤
        │                                                     │
        ▼                                                     │
Phase 4 (LangSmith) ◀── depends on Phase 3                    │
        │                                                     │
        ▼                                                     │
Phase 5 (Evaluation) ◀── depends on Phase 3 + 4               │
        │                                                     │
        ▼                                                     │
Phase 6 (Polish) ◀── depends on all above                     │
```

---

## 7. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Vector store | FAISS | Local, no external DB, good for small KB |
| Chunking | Simple (by paragraph or fixed size) | Knowledge base is small; keep it simple |
| LLM | OpenAI (gpt-4o-mini) | Cost-effective, good quality for demo |
| Embeddings | text-embedding-3-small | Fast, cheap, sufficient for retrieval |
| State | TypedDict | Lightweight, matches LangGraph patterns |
| Eval metrics | Correctness + Relevance | Aligns with requirement; use LLM-as-judge or rubric |

---

## 8. File-to-Component Mapping

| File | Phase | Contains |
|------|-------|----------|
| `requirements.txt` | 1 | Dependencies |
| `.env` | 1 | API keys, LangSmith config |
| `data/knowledge_base.txt` | 1 | Source documents |
| `data/dataset.json` | 1 | Eval Q&A pairs |
| `app/state.py` | 3 | State schema |
| `app/nodes.py` | 2, 3 | retrieve, generate, final nodes |
| `app/graph.py` | 3 | Graph definition |
| `app/agent.py` | 3 | Agent wrapper |
| `main.py` | 3 | CLI entry |
| `evaluation/run_eval.py` | 5 | Eval script |

---

## 9. Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| FAISS index not persisted | Rebuild at startup from `knowledge_base.txt` (acceptable for small KB) |
| Eval metrics subjective | Use structured rubric + LLM-as-judge for consistency |
| LangSmith setup friction | Document env vars clearly; provide `.env.example` |
| Chunking too coarse/fine | Start with paragraph-level; tune if retrieval is poor |

---

## 10. Success Criteria

- [ ] `python main.py` answers questions from knowledge base
- [ ] LangSmith shows full trace (retrieve → generate → final)
- [ ] `python evaluation/run_eval.py` runs and prints metrics
- [ ] Correctness and relevance scores visible in LangSmith UI
- [ ] README enables a new developer to run and evaluate in &lt; 15 minutes

---

## Next Step

**Start with Phase 1**: Create the project structure, `requirements.txt`, `.env.example`, `knowledge_base.txt`, and `dataset.json`. Once data is in place, proceed to Phase 2 (vector store and retrieval).
