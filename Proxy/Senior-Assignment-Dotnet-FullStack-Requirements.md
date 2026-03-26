# Senior Full Stack Engineer Assignment — Requirements Specification

**Source document:** `Senior Assignment - Dotnet Full Stack.pdf`  
**Working title:** Inventory Hold Microservice  
**Purpose:** This document restates the official assignment in a single, navigable specification for implementation and review.

---

## 1. Business context

The **Inventory Hold Microservice** lets a checkout system place **temporary holds** on inventory. When a customer starts checkout, items are held so they cannot be sold to someone else. Holds **expire** after a **configurable** duration (default stated in assignment: **15 minutes**).

This mirrors common e-commerce patterns. The exercise evaluates **full-stack delivery** with **AI-augmented workflows** at production-oriented quality.

### Skills under evaluation

| Area | Expectation |
|------|-------------|
| Backend | .NET **10**, **Domain-Driven Design** layering |
| Data | **MongoDB** with **atomic** operations for concurrency |
| Caching | **Redis** for performance-sensitive reads |
| Messaging | **RabbitMQ** for event-driven communication |
| Ops | **Docker** + **docker-compose** (one-command startup) |
| Frontend | **React** + **TypeScript** (**Vite**) |
| Testing | **nUnit** or **xUnit**, mocks, edge cases |
| AI practice | Deliberate use of AI tools with documented strategy and audit |

---

## 2. Deliverables (submission checklist)

Submit a **GitHub repository** containing:

| Item | Required |
|------|----------|
| Full source code | Yes |
| `Dockerfile` | Yes |
| `docker-compose.yml` | Yes — must start full stack with one command |
| Unit test project | Yes — **mandatory**; solution incomplete without tests |
| `README.md` | Yes — setup instructions and design decisions |
| `AI-USAGE.md` | Yes — **mandatory** (see Section 8) |
| Working startup | `docker-compose up --build` |

**Timeline:** Complete and submit within **2 days** (per assignment).

---

## 3. Infrastructure

### 3.1 One-command environment

```bash
docker-compose up --build
```

### 3.2 Required services

| Service | Role |
|---------|------|
| **.NET API** | Inventory Hold Service |
| **MongoDB** | Persistent store for holds and inventory |
| **Redis** | Caching |
| **RabbitMQ** | Event publishing |

### 3.3 Configuration

- All connections must be **configurable** via **environment variables** and/or **`appsettings.json`**.
- **Do not hardcode** connection strings or broker endpoints in source code.

---

## 4. Solution architecture (DDD layout)

Structure the solution as follows (names may be adjusted if equivalent layers remain clear):

```text
src/
├── InventoryHold.Contracts/     # DTOs, enums, request/response models
├── InventoryHold.Domain/
│   ├── Services/                # Business logic
│   └── Repositories/            # Data access interfaces (abstractions)
├── InventoryHold.Infrastructure/ # MongoDB, Redis, RabbitMQ implementations
├── InventoryHold.WebApi/        # Controllers, DI, Program.cs
└── InventoryHold.UnitTests/     # Unit tests
```

---

## 5. Core API

### 5.1 Endpoints

| Method | Path | Behavior |
|--------|------|----------|
| `POST` | `/api/holds` | Verify stock; **atomically** deduct inventory if sufficient; create hold with configurable expiration (default **15 minutes**); return hold details. |
| `GET` | `/api/holds/{holdId}` | Return hold by ID; handle **expired** holds appropriately; **404** if not found. |
| `DELETE` | `/api/holds/{holdId}` | Release hold and **restore** inventory; handle non-existent, already-released, and **expired** holds. |
| `GET` | `/api/inventory` | Current inventory levels; **seed ≥ 5 products** on application startup. |

### 5.2 Non-functional requirements

- **Concurrency:** Stock changes must be safe under races using appropriate **MongoDB atomic** operations.
- **HTTP semantics:** Meaningful status codes and error bodies — not only `200` and `500`.
- **Modeling:** Document structure, domain models, and rules are **candidate-owned**; reviewers will assess design choices.

---

## 6. Messaging (RabbitMQ)

Publish events on relevant **hold lifecycle** transitions:

| Event | When |
|-------|------|
| **HoldCreated** | Hold successfully placed |
| **HoldReleased** | Customer (or API) releases a hold |
| **HoldExpired** | Hold is detected as expired |

Requirements:

- Payloads must include **enough context** for downstream consumers.
- **Exchange/queue topology** is for the implementer to design and justify (e.g. in README).

---

## 7. Caching (Redis)

- Define a **caching strategy** for **high-frequency read** paths.
- Choose endpoint(s), **TTLs**, and **invalidation/update** rules so cache stays **consistent** after creates/updates/deletes that affect reads.

---

## 8. Unit testing (mandatory)

- Framework: **nUnit** or **xUnit**.
- **Minimum 5 tests.**
- Cover:
  - Validation and error handling
  - Core hold lifecycle
  - At least **one** concurrency or edge-case scenario
- **Mock** repository, cache, and messaging abstractions — tests must **not** require live MongoDB, Redis, or RabbitMQ.

---

## 9. Frontend (React + TypeScript + Vite)

### 9.1 Features

1. **Inventory dashboard** — product name, available quantity  
2. **Create hold** — select products, quantities, place hold  
3. **Active holds list** — status, line items, **time remaining**  
4. **Release hold** — action with **confirmation**

### 9.2 Expectations

- Strong **TypeScript** typing for API contracts  
- **State management** — any reasonable approach; justify in README  
- After mutations (create/release hold), **UI reflects inventory and holds without manual full page refresh**  
- **Loading** states and **user-visible** API errors  

### 9.3 Out of scope (explicit)

- Authentication  
- Routing (not required)  
- Pixel-perfect UI; **CSS framework optional**

### 9.4 Hosting

Frontend may run **outside** Docker (`npm run dev`) **or** be added to **docker-compose** — implementer’s choice.

---

## 10. AI augmentation (`AI-USAGE.md`)

The repository **must** include **`AI-USAGE.md`** describing:

1. **AI strategy** — tools used (e.g. Claude, Cursor, Copilot); how context was shaped; how prompts aligned with the required architecture.  
2. **Human audit** — concrete examples of AI output **accepted** vs **rejected** and **why** (where human judgment improved the result).  
3. **Verification** — how AI assisted tests; how AI-generated code was **validated** as correct.

Evaluation explicitly considers **AI-steering** capability.

---

## 11. Traceability matrix (PDF → implementation)

| PDF section | Primary artifact |
|-------------|------------------|
| docker-compose services | `docker-compose.yml`, `Dockerfile`, config |
| DDD folders | Solution structure under `src/` |
| POST/GET/DELETE holds, GET inventory | `InventoryHold.WebApi` + domain services |
| Atomic MongoDB | Repositories / transactions or findAndModify, etc. |
| RabbitMQ events | Infrastructure publisher + contracts |
| Redis | Cache service + invalidation in mutations |
| Unit tests | `InventoryHold.UnitTests` with mocks |
| React UI | Vite app + typed API client |
| AI narrative | `AI-USAGE.md` |

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| Hold | Temporary reservation of inventory for a checkout session |
| Release | Cancel hold and return quantity to sellable stock |
| Expire | Hold passes end time; behavior must be defined in API and events |

---

*This file is a structured derivative of the PDF assignment for engineering use. If anything conflicts with the PDF, **the PDF wins**.*
