# Prompts and Decision Log

This document captures the full AI-prompt strategy for the `InventoryHold` project: what was prompted, how prompts were adjusted, how decisions were taken, and how the implementation plan was structured end-to-end.

## 1) Complete Prompt List by Phase

### Prompt 1: Requirements Decomposition
- **Objective:** Convert assignment text into implementation checklist.
- **Prompt idea:** "Break this assignment into backend, infrastructure, frontend, testing, and documentation deliverables with acceptance checks."
- **Output used:** A traceable spec-first workflow aligned to project deliverables.

### Prompt 2: DDD Architecture Blueprint
- **Objective:** Define clear layer boundaries and responsibilities.
- **Prompt idea:** "Propose a .NET DDD folder structure for WebApi, Domain, Infrastructure, Contracts, and UnitTests with dependencies flowing inward."
- **Output used:** Layered architecture with service-driven domain logic.

### Prompt 3: Domain Lifecycle Rules
- **Objective:** Formalize hold lifecycle and invariants.
- **Prompt idea:** "Define create/release/expire rules for inventory holds including status transitions and edge cases."
- **Output used:** Explicit hold status rules (`Active`, `Released`, `Expired`) and state transition checks.

### Prompt 4: Concurrency and Atomic Stock Safety
- **Objective:** Prevent overselling under concurrent requests.
- **Prompt idea:** "Design an atomic MongoDB stock decrement strategy for concurrent hold creation."
- **Output used:** Conditional MongoDB updates with quantity guard and modified-count validation.

### Prompt 5: API Design and Error Semantics
- **Objective:** Build reliable and reviewer-friendly API contracts.
- **Prompt idea:** "Design `POST /api/holds`, `GET /api/holds/{id}`, `DELETE /api/holds/{id}`, and `GET /api/inventory` with proper HTTP statuses and error payloads."
- **Output used:** Meaningful status codes and consistent JSON error format.

### Prompt 6: Redis Caching Strategy
- **Objective:** Improve read performance without stale data drift.
- **Prompt idea:** "Recommend Redis keys, TTLs, and invalidation strategy for inventory and holds."
- **Output used:** Read-through caching with mutation-aware invalidation/refresh.

### Prompt 7: RabbitMQ Event Topology
- **Objective:** Publish hold lifecycle events for downstream consumers.
- **Prompt idea:** "Design exchange, routing keys, and payload shape for hold-created, hold-released, and hold-expired events."
- **Output used:** Topic exchange model with explicit routing keys and contract-driven payloads.

### Prompt 8: Expiry Behavior Decision
- **Objective:** Choose a practical expiration mechanism for scope/time.
- **Prompt idea:** "Compare background scheduler vs lazy-expiry on reads for this assignment and recommend one."
- **Output used:** Lazy-expiry on read paths with idempotent single-event emission.

### Prompt 9: Unit Test Matrix
- **Objective:** Meet mandatory test coverage with meaningful scenarios.
- **Prompt idea:** "Generate xUnit test cases covering validation, lifecycle, and at least one concurrency/edge condition using mocks."
- **Output used:** Base test matrix later refined manually for correctness.

### Prompt 10: Frontend User Flow Design
- **Objective:** Build required UI capabilities with minimal friction.
- **Prompt idea:** "Design React+TypeScript+Vite flow for inventory dashboard, create hold form, active holds list with countdown, and release confirmation."
- **Output used:** Task-oriented single-page workflow aligned to assignment scope.

### Prompt 11: Frontend Data Synchronization
- **Objective:** Keep UI fresh after create/release actions.
- **Prompt idea:** "Recommend client state/query strategy so inventory and holds update automatically after mutations."
- **Output used:** TanStack Query invalidation pattern for responsive updates.

### Prompt 12: Documentation and Submission Readiness
- **Objective:** Make setup and design review easy for evaluators.
- **Prompt idea:** "Draft README sections for local run, Docker run, env configuration, API summary, and design decisions."
- **Output used:** Structured docs for fast onboarding and traceability.

## 2) How Prompts Were Adjusted During Development

The prompt strategy followed an iterative narrowing pattern:

1. Start broad for discovery:
   - First prompts gathered options and architecture candidates.
2. Narrow to one concern per prompt:
   - Example: isolated prompt for atomic stock update, separate prompt for cache invalidation.
3. Add hard constraints from assignment:
   - .NET 10, DDD layout, Mongo atomic operations, Redis caching, RabbitMQ events, React + TS + Vite.
4. Remove generic outputs:
   - Any advice that mixed layer responsibilities or ignored constraints was discarded.
5. Re-prompt with acceptance criteria:
   - Prompts were reworded to produce testable outcomes, not high-level suggestions.

## 3) How Decisions Were Taken on Prompt Outputs

Each AI suggestion was evaluated with a strict accept/reject/refine gate:

- **Accept** when output:
  - respected architectural boundaries,
  - improved speed without reducing correctness,
  - matched assignment scope.

- **Reject** when output:
  - moved business logic into controllers,
  - introduced non-required complexity,
  - weakened consistency or testability.

- **Refine** when output:
  - was too generic,
  - lacked edge-case handling,
  - did not map clearly to implementation files.

Final acceptance was always based on runtime behavior, tests, and specification fit.

## 4) End-to-End Code Planning Structure

Implementation was planned as a phased execution path:

1. Requirements parsing and checklist mapping.
2. DDD structure and abstraction definition.
3. Domain service implementation for hold lifecycle.
4. Infrastructure adapters (MongoDB, Redis, RabbitMQ).
5. API endpoint wiring and error contract shaping.
6. Frontend implementation and mutation/read synchronization.
7. Unit tests (mocked dependencies, lifecycle + edge conditions).
8. Documentation hardening (`README`, architecture notes, AI usage narrative).

## 5) Final Structural Decisions Used in Codebase

- **WebApi:** HTTP contracts, validation surface, DI composition.
- **Domain:** Core business logic and invariants (`HoldApplicationService`).
- **Infrastructure:** Concrete MongoDB, Redis, RabbitMQ integrations.
- **Contracts:** Shared DTOs and event payload models.
- **UnitTests:** Service-level verification through mocks (no live infra dependency).

This structure was chosen to maximize separation of concerns, testability, and production readability under take-home assignment constraints.

## 6) Human Audit Summary (AI-Assisted, Human-Owned)

- AI was used for drafts, scaffolding, and alternatives.
- Final behavior and architecture were manually reviewed and corrected.
- Edge conditions and final tests were adjusted by human judgment.
- Only output aligned with project constraints was retained.

