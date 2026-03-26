# Run Guide

## Setup

```bash
cd langgraph-rag-agent
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: add GROQ_API_KEY or OPENAI_API_KEY
```

## Run Agent

```bash
python main.py "What is LangGraph?"
```

## Run Evaluation

```bash
python evaluation/run_eval.py          # Local
python evaluation/run_eval_ui.py        # Upload to LangSmith (needs LANGCHAIN_API_KEY)
```

