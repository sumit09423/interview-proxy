# Architecture

## Layering

```text
InventoryHold.WebApi        → HTTP, JSON, DI composition
InventoryHold.Domain        → HoldApplicationService, entities, repository/cache/publisher abstractions
InventoryHold.Infrastructure → MongoDB, Redis, RabbitMQ implementations
InventoryHold.Contracts     → DTOs and integration event payloads (shared API + messaging shape)
InventoryHold.UnitTests     → Service tests with mocks
```

## Sequence: create hold

```mermaid
sequenceDiagram
  participant UI
  participant API
  participant Svc as HoldApplicationService
  participant Mongo
  participant Redis
  participant MQ as RabbitMQ
  UI->>API: POST /api/holds
  API->>Svc: CreateHoldAsync
  loop each line
    Svc->>Mongo: TryDecrementStockAsync
  end
  Svc->>Mongo: Create hold document
  Svc->>Redis: invalidate inventory, set hold cache
  Svc->>MQ: publish hold.created
  API-->>UI: 201 hold JSON
```

## Sequence: release hold

```mermaid
sequenceDiagram
  participant UI
  participant API
  participant Svc as HoldApplicationService
  participant Mongo
  participant Redis
  participant MQ as RabbitMQ
  UI->>API: DELETE /api/holds/{id}
  API->>Svc: ReleaseHoldAsync
  Svc->>Mongo: TryMarkReleasedAsync
  loop each line
    Svc->>Mongo: IncrementStockAsync
  end
  Svc->>Redis: invalidate inventory and hold
  Svc->>MQ: publish hold.released
  API-->>UI: 204
```

## Expiry

When a hold is still `Active` in Mongo but `ExpiresAt <= UtcNow`, the next **GET** (by id or via **list**) transitions it to `Expired`, sets `ExpiredEventPublished`, emits **hold.expired** once, and updates cache.

## Frontend

- **Vite** dev server proxies `/api` to the API for local dev.
- **Docker:** one **`app`** container — the Vite build is published into **`wwwroot`** and **Kestrel** serves static files plus **`/api/*`** on the same port.
- **State:** TanStack Query invalidates `inventory` and `holds` after create/release so the UI stays in sync without a full page reload.
