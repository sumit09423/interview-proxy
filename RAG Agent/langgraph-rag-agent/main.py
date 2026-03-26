#!/usr/bin/env python3
"""CLI entry point for the LangGraph RAG Agent."""

import sys
from dotenv import load_dotenv

load_dotenv()

from app.agent import run_agent


def main():
    if len(sys.argv) < 2:
        question = input("Enter your question: ").strip()
    else:
        question = " ".join(sys.argv[1:])

    if not question:
        print("No question provided.")
        sys.exit(1)

    answer = run_agent(question)
    print(answer)


if __name__ == "__main__":
    main()
