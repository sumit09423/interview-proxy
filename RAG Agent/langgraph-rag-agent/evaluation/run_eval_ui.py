#!/usr/bin/env python3
"""Run evaluation and upload results to LangSmith UI."""

import json
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from langsmith import Client, evaluate
from app.agent import run_agent


DATASET_NAME = "rag-agent-eval-dataset"


def load_dataset(path: Path) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        raw = json.load(f)
    return [
        {"inputs": {"question": item["question"]}, "outputs": {"answer": item["answer"]}}
        for item in raw
    ]


def ensure_dataset(client: Client, examples: list[dict]) -> str:
    created = False
    try:
        dataset = client.create_dataset(
            dataset_name=DATASET_NAME,
            description="RAG agent evaluation - Q&A from knowledge base",
        )
        created = True
    except Exception as e:
        if "409" in str(e) or "already exists" in str(e).lower() or "duplicate" in str(e).lower():
            existing = list(client.list_datasets(dataset_name=DATASET_NAME))
            if existing:
                print(f"Using existing dataset: {DATASET_NAME}")
                return DATASET_NAME
        raise RuntimeError(f"Could not create dataset: {e}") from e

    if created:
        client.create_examples(dataset_id=dataset.id, examples=examples)
        print(f"Created dataset: {DATASET_NAME} with {len(examples)} examples")
    return DATASET_NAME


def correctness_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> float:
    expected = (reference_outputs.get("answer") or "").lower().strip()
    actual = (outputs.get("answer") or "").lower().strip()
    if not expected:
        return 1.0
    expected_words = set(expected.split())
    actual_words = set(actual.split())
    overlap = len(expected_words & actual_words) / len(expected_words) if expected_words else 1.0
    return 1.0 if overlap >= 0.5 else overlap


def relevance_evaluator(inputs: dict, outputs: dict, reference_outputs: dict) -> float:
    answer = (outputs.get("answer") or "").strip()
    question = (inputs.get("question") or "").strip()
    if not answer or not question:
        return 0.0
    return 1.0 if 10 <= len(answer) <= 500 else 0.5


def target_fn(inputs: dict) -> dict:
    return {"answer": run_agent(inputs["question"])}


def main():
    if not os.getenv("LANGCHAIN_API_KEY"):
        print("Error: LANGCHAIN_API_KEY required for UI upload. Add it to .env")
        sys.exit(1)

    dataset_path = Path(__file__).resolve().parent.parent / "data" / "dataset.json"
    if not dataset_path.exists():
        print(f"Dataset not found: {dataset_path}")
        sys.exit(1)

    examples = load_dataset(dataset_path)
    print(f"Loaded {len(examples)} examples")

    client = Client()
    dataset_name = ensure_dataset(client, examples)

    print("Running evaluation (results will upload to LangSmith)...")
    results = evaluate(
        target_fn,
        data=dataset_name,
        evaluators=[correctness_evaluator, relevance_evaluator],
        experiment_prefix="rag-agent-eval",
        metadata={"project": "langgraph-demo"},
        upload_results=True,
    )

    all_correctness = []
    all_relevance = []
    try:
        for result in results:
            er = result.get("evaluation_results", {})
            feedback = er.get("results", []) if isinstance(er, dict) else []
            for fb in feedback or []:
                key = getattr(fb, "key", "")
                score = getattr(fb, "score", None)
                if score is not None:
                    s = float(score)
                    if "correctness" in str(key).lower():
                        all_correctness.append(s)
                    elif "relevance" in str(key).lower():
                        all_relevance.append(s)
    except Exception as e:
        print(f"Note: {e}")

    if all_correctness:
        print(f"\nAverage Correctness: {sum(all_correctness)/len(all_correctness):.2%}")
    if all_relevance:
        print(f"Average Relevance:   {sum(all_relevance)/len(all_relevance):.2%}")

    print(f"\nExperiment: {getattr(results, 'experiment_name', 'N/A')}")
    print("View in LangSmith UI: https://smith.langchain.com")
    print("  -> Datasets -> rag-agent-eval-dataset")
    print("  -> Experiments -> (latest run)")


if __name__ == "__main__":
    main()
