# Friction Log

Document issues encountered during development. Valuable for feedback and future improvements.

## Template Entry

1. **Issue**: Brief description
   - **Impact**: What was affected
   - **Workaround**: How it was resolved
   - **Suggestion**: Improvement for maintainers

---

## Entries

### 1. OpenAI API key vs Groq key confusion

- **Issue**: User had a Groq API key (`gsk_...`) in `OPENAI_API_KEY`. Error: "Incorrect API key provided: gsk_..."
- **Impact**: Agent failed at embedding step; unclear that the key type was wrong.
- **Workaround**: Added Groq support so the project works with either provider. Documented key formats in README.
- **Suggestion**: LangChain/LangSmith could validate key format and suggest the correct env var (e.g. "This looks like a Groq key; use GROQ_API_KEY").

### 2. OpenAI insufficient_quota (429)

- **Issue**: New OpenAI accounts often hit "You exceeded your current quota" before adding billing.
- **Impact**: Blocked development entirely for users without paid OpenAI access.
- **Workaround**: Implemented Groq + HuggingFace embeddings as a free alternative.
- **Suggestion**: Docs could mention Groq/HuggingFace as a zero-cost path for testing.

### 3. LangSmith evaluate() with local dict data

- **Issue**: Passing `data=[{inputs, outputs}, ...]` to `evaluate()` with `upload_results=True` causes `AttributeError: 'dict' object has no attribute 'dataset_id'`.
- **Impact**: Cannot run evaluation with local JSON and upload to LangSmith in one step.
- **Workaround**: Use `upload_results=False` for local-only eval, or create a dataset via `Client.create_dataset()` + `create_examples()` first, then pass dataset name to `evaluate()`.
- **Suggestion**: Support in-memory examples with upload; or document the two paths (local vs UI) more clearly.

### 4. LangSmith ExperimentResults iteration

- **Issue**: With `upload_results=False`, iterating over `results` fails with `'dict' object has no attribute 'modified_at'`. Result structure differs from documented format.
- **Impact**: Cannot extract scores from the iterator; `to_pandas()` also fails.
- **Workaround**: Implemented manual evaluation fallback that runs the agent and evaluators locally when iterator fails.
- **Suggestion**: Unify result structure for both upload modes, or document the difference.

### 5. HuggingFaceEmbeddings deprecation

- **Issue**: `langchain_community.embeddings.HuggingFaceEmbeddings` is deprecated; LangChain recommends `langchain_huggingface.HuggingFaceEmbeddings`.
- **Impact**: Deprecation warnings in logs.
- **Workaround**: Can switch to `langchain-huggingface` package; not yet done.
- **Suggestion**: Update migration guide and examples to use the new package.

### 6. upload_results parameter in beta

- **Issue**: `LangSmithBetaWarning: 'upload_results' parameter is in beta.`
- **Impact**: Minor; users may wonder if the feature is stable.
- **Suggestion**: Promote to stable or document beta status and expected behavior.

### 7. LangSmith dataset creation on conflict

- **Issue**: `create_dataset(dataset_name="x")` returns 409 when dataset exists; error message varies.
- **Impact**: Scripts that create datasets need to handle "already exists" and fall back to using the existing dataset.
- **Workaround**: Catch 409/duplicate, then `list_datasets(dataset_name=...)` to get the existing dataset.
- **Suggestion**: Provide `get_or_create_dataset()` or similar helper in the SDK.
