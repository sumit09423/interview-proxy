#!/usr/bin/env python3
"""Run evaluation experiments using LangSmith."""

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from langsmith import evaluate
from app.agent import run_agent


def load_dataset(path: str | Path = "data/dataset.json") -> list[dict]:
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Dataset not found: {path}")
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    return [
        {"inputs": {"question": item["question"]}, "outputs": {"answer": item["answer"]}}
        for item in data
    ]


def target_fn(inputs: dict) -> dict:
    return {"answer": run_agent(inputs["question"])}


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


def main():
    dataset_path = Path(__file__).resolve().parent.parent / "data" / "dataset.json"
    data = load_dataset(dataset_path)

    print(f"Running evaluation on {len(data)} examples...")
    results = evaluate(
        target_fn,
        data=data,
        evaluators=[correctness_evaluator, relevance_evaluator],
        experiment_prefix="rag-agent-eval",
        metadata={"project": "langgraph-demo"},
        upload_results=False,
    )

    all_correctness = []
    all_relevance = []
    print("\n--- Evaluation Results ---")
    try:
        for i, result in enumerate(results):
            eval_results = result.get("evaluation_results", {})
            feedback = eval_results.get("results", []) if isinstance(eval_results, dict) else []
            for fb in feedback or []:
                key = getattr(fb, "key", "")
                score = getattr(fb, "score", None)
                if score is not None:
                    score_f = float(score)
                    if "correctness" in str(key).lower():
                        all_correctness.append(score_f)
                    elif "relevance" in str(key).lower():
                        all_relevance.append(score_f)
                    print(f"  Example {i+1} - {key}: {score_f:.2%}")
    except Exception as e:
        print(f"  (Could not iterate: {e})")

    if not all_correctness and not all_relevance:
        print("  Running manual evaluation...")
        for i, item in enumerate(data):
            inputs = item["inputs"]
            ref = item["outputs"]
            out = target_fn(inputs)
            c = correctness_evaluator(inputs, out, ref)
            r = relevance_evaluator(inputs, out, ref)
            all_correctness.append(c)
            all_relevance.append(r)
            print(f"  Example {i+1} - correctness: {c:.2%}, relevance: {r:.2%}")

    if all_correctness:
        print(f"\nAverage Correctness: {sum(all_correctness)/len(all_correctness):.2%}")
    if all_relevance:
        print(f"Average Relevance:   {sum(all_relevance)/len(all_relevance):.2%}")

    print(f"\nExperiment: {getattr(results, 'experiment_name', 'N/A')}")
    print("View traces at https://smith.langchain.com")


if __name__ == "__main__":
    main()
