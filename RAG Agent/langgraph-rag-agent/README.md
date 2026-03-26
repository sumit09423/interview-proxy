# LangGraph RAG Agent

A Retrieval-Augmented QA Agent built with LangGraph, evaluated using LangSmith.

**Documentation:**
- [Project Explanation](docs/PROJECT_EXPLANATION.md) — **How to explain this project** to other developers
- [Developer Q&A](docs/DEVELOPER_QA.md) — Check first for code and logical questions
- [Architecture & File Guide](docs/ARCHITECTURE.md) — How each file was built
- [Run Guide](docs/RUN_GUIDE.md) — How to run the project

## Setup

1. **Create virtual environment**
   ```bash
   cd langgraph-rag-agent
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env:
   # - For testing: GROQ_API_KEY=gsk_... (free, uses Groq + HuggingFace embeddings)
   # - For production: OPENAI_API_KEY=sk-... (uses OpenAI)
   # - LANGCHAIN_API_KEY=lsv2_... (required for run_eval_ui.py)
   ```

## Run the Agent

```bash
python main.py "What is LangGraph?"
```

Or interactive mode:
```bash
python main.py
# Enter your question when prompted
```

## Run Evaluation

**SDK (local results):**
```bash
python evaluation/run_eval.py
```
- Loads `data/dataset.json`, runs agent, prints correctness/relevance
- No `LANGCHAIN_API_KEY` required

**LangSmith UI (upload to dashboard):**
```bash
python evaluation/run_eval_ui.py
```
- Creates dataset in LangSmith, runs evaluation, uploads results
- Requires `LANGCHAIN_API_KEY` in `.env`
- View at [smith.langchain.com](https://smith.langchain.com) → Datasets → rag-agent-eval-dataset → Experiments

## Project Structure

```
langgraph-rag-agent/
├── README.md
├── requirements.txt
├── main.py
├── app/
│   ├── graph.py      # LangGraph workflow
│   ├── agent.py      # Agent interface
│   ├── nodes.py      # retrieve, generate, final nodes
│   ├── state.py      # Graph state schema
│   └── vectorstore.py # FAISS setup
├── data/
│   ├── knowledge_base.txt
│   └── dataset.json
├── evaluation/
│   ├── run_eval.py      # SDK eval (local)
│   └── run_eval_ui.py   # Upload to LangSmith UI
└── docs/
    ├── ARCHITECTURE.md  # File-by-file guide
    └── RUN_GUIDE.md    # How to run
```

## LangSmith

Set these in `.env` for tracing and evaluation:

```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=langgraph-demo
```

View traces, experiments, and evaluation results at [smith.langchain.com](https://smith.langchain.com).

## Provider Selection

| Env var set | LLM | Embeddings |
|-------------|-----|------------|
| `GROQ_API_KEY` | Groq (llama-3.1-8b-instant) | HuggingFace (local) |
| `OPENAI_API_KEY` only | OpenAI (gpt-4o-mini) | OpenAI (text-embedding-3-small) |

Groq is used when `GROQ_API_KEY` is set. Otherwise OpenAI is used. Both can coexist; Groq takes precedence for testing.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `insufficient_quota` (OpenAI) | Use `GROQ_API_KEY` for free testing, or add billing at [platform.openai.com](https://platform.openai.com/account/billing). |
| `AttributeError: 'dict' object has no attribute 'dataset_id'` | Fixed in `run_eval.py` with `upload_results=False` when using local dataset. |

## Friction Log

See `FRICTION_LOG.md` for issues encountered during development.
