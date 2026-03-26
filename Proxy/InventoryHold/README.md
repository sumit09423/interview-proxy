# Inventory Hold Microservice

Senior full-stack take-home: temporary **inventory holds** with **.NET** (DDD layout), **MongoDB** (atomic stock updates), **Redis** (read-through cache), **RabbitMQ** (lifecycle events), optional **Docker Compose**, and a **React + TypeScript + Vite** UI.

The authoritative assignment text is in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) (derived from the original PDF).

## Quick Start (Docker - one command)

From the `InventoryHold/` directory, run:

```bash
docker compose up --build
```

This single command starts the full stack (app + MongoDB + Redis + RabbitMQ) and serves both UI and API at:

- http://localhost:5080

To stop everything:

```bash
docker compose down
```

If your Docker setup only supports Compose v1, use:

```bash
docker-compose up --build
```

## Prerequisites

- [.NET SDK 10](https://dotnet.microsoft.com/download) (matches `net10.0` in the `.csproj` files). If you only have the **10.x** runtime from Homebrew, older `net9.0` builds will fail at launch—use SDK 10 or install the [.NET 9 runtime](https://dotnet.microsoft.com/download/dotnet/9.0) alongside it.
- **MongoDB, Redis, and RabbitMQ** running somewhere this machine can reach (local installs, or hosted—see below). The API does not start without them.
- Node.js 20+ for the frontend (`npm`).
- **Docker is optional.** It is only needed if you want the one-command stack in `docker-compose.yml` (useful for reviewers or CI). Everything can run natively.

## Running without Docker (recommended if you have no Docker)

Defaults in [`appsettings.json`](src/InventoryHold.WebApi/appsettings.json) assume **localhost** services:

| Dependency | Default | Notes |
|------------|---------|--------|
| MongoDB | `mongodb://localhost:27017` | Database `inventory_hold` |
| Redis | `localhost:6379` | No password in dev default |
| RabbitMQ | `localhost:5672`, user `guest` / `guest` | Works for **local** connections only (default broker policy) |

### macOS (Homebrew) example

Install and start services in separate terminals (or as background services):

```bash
brew tap mongodb/brew
brew install mongodb-community redis rabbitmq
brew services start mongodb-community
brew services start redis
brew services start rabbitmq
```

- RabbitMQ management UI: http://localhost:15672 — default login is often `guest` / `guest` when connecting from the same machine.
- If your broker uses different credentials, set `RabbitMq__UserName` and `RabbitMq__Password` (see Configuration).

### Windows / Linux

Use your OS package manager or the official installers for [MongoDB](https://www.mongodb.com/try/download/community), [Redis](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/), and [RabbitMQ](https://www.rabbitmq.com/docs/download). Keep ports aligned with `appsettings.json` or override with environment variables.

### Cloud / remote (no local daemons)

Point configuration at hosted instances (examples only—you supply URLs and secrets):

- MongoDB: [Atlas](https://www.mongodb.com/atlas) → set `Mongo__ConnectionString`.
- Redis: e.g. [Upstash](https://upstash.com/) → set `Redis__ConnectionString` to the TLS URL they provide.
- RabbitMQ: e.g. [CloudAMQP](https://www.cloudamqp.com/) → set `RabbitMq__HostName`, port, user, password, and vhost from their dashboard.

### Start the API and UI

1. **API** (from repo root):

   ```bash
   dotnet run --project src/InventoryHold.WebApi/InventoryHold.WebApi.csproj
   ```

   Listens on http://localhost:5080 (see `Properties/launchSettings.json`).

2. **Frontend** (Vite proxies `/api` to port 5080):

   ```bash
   cd frontend && npm install && npm run dev
   ```

   Open http://localhost:5173

If the API exits on startup, confirm the three dependencies are running and that ports match `appsettings.json` (Mongo **27017**, Redis **6379**, AMQP **5672**).

**`Connection refused` on port 27017 (MongoDB):** nothing is listening—start MongoDB before using the API, for example `brew services start mongodb-community` (after `brew install mongodb-community`), or run `docker compose up mongodb` (or the full stack). Default connection string uses **`127.0.0.1`** to avoid some IPv6 `localhost` issues on macOS.

If Mongo (or Redis) is down, startup may still proceed: the product seeder logs a warning instead of crashing, but **API calls will fail** until those services are up.

### Unit tests

**No Docker required** — repositories and messaging are mocked:

```bash
dotnet test
```

## Optional: full stack with Docker Compose

### Install Docker from the terminal (macOS)

With [Homebrew](https://brew.sh):

```bash
brew install --cask docker
```

Then open **Docker Desktop** once from Applications (or run `open -a Docker`) and wait until the whale icon shows “Docker is running”. After that, `docker` and `docker compose` work in the terminal.

**CLI-only alternative (no Docker Desktop UI):** [Colima](https://github.com/abiosoft/colima) provides a Docker-compatible daemon:

```bash
brew install colima docker
colima start
```

### Start the stack

One **`Dockerfile`** builds a **single `app` image**: Node compiles the Vite UI, output is copied into the Web API **`wwwroot`**, and **Kestrel** serves the React app and **`/api/*`** on the same port (no separate nginx/frontend container).

From this directory:

```bash
docker compose up --build
```

Open **http://localhost:5080** for the full UI + API.

(Use `docker-compose up --build` if your Docker install only provides the hyphenated Compose v1 plugin.)

| Service    | URL / port |
|------------|------------|
| **App (UI + API)** | http://localhost:5080 |
| MongoDB    | localhost:27017 |
| Redis      | localhost:6379 |
| RabbitMQ AMQP | localhost:5672 |
| RabbitMQ UI   | http://localhost:15672 (`app` / `app` in Compose) |

Compose uses RabbitMQ user **`app`/`app`** (not `guest`) so the app container can connect to the broker. Local `appsettings.json` still uses `guest` for same-machine dev.

Services use **`restart: unless-stopped`** and **health checks** on MongoDB, Redis, and RabbitMQ so the API starts only after dependencies are ready (avoids immediate crashes). After a machine reboot, start **Docker Desktop** again; containers should come back unless you ran `docker compose down`.

### Containers stopped — common causes

1. **Docker Desktop was quit or the Mac slept** — the engine stops; start Docker again, then `docker compose up -d` from `InventoryHold/`.
2. **The app crashed on startup** — often a race before dependencies were ready (mitigated by health checks above). Inspect: `docker compose ps -a` and `docker compose logs app`.
3. **You ran `docker compose down`** or removed containers in Docker Desktop.
4. **Out of memory** — Docker Desktop → Settings → Resources; increase memory if the API exits with code 137.

**`exec format error` during `docker compose build` (often on `RUN npm install`):** the image CPU arch didn’t match the Linux VM Docker uses to run containers. That often happens on **Apple Silicon** when BuildKit targets `linux/arm64` but the engine is actually **x86_64**. Compose defaults **`DOCKER_PLATFORM=linux/amd64`** so builds match a typical Desktop VM. If your engine is **native arm64** (`docker run --rm alpine uname -m` prints `aarch64` without `--platform`), set **`DOCKER_PLATFORM=linux/arm64`** in `.env` for faster native builds. Then `docker compose build --no-cache` (or `docker builder prune` if stale layers linger). See `.env.example`.

## Configuration

All infrastructure is configurable via **environment variables** (double underscore) or `appsettings.json`. Examples:

| Key | Purpose |
|-----|---------|
| `Mongo__ConnectionString` | MongoDB connection string |
| `Mongo__DatabaseName` | Database name |
| `Redis__ConnectionString` | StackExchange.Redis connection string |
| `RabbitMq__HostName`, `RabbitMq__Port`, `RabbitMq__UserName`, `RabbitMq__Password`, `RabbitMq__VirtualHost` | Broker |
| `RabbitMq__ExchangeName` | Topic exchange for events (default `inventory.events`) |
| `Hold__DefaultDurationMinutes` | Default hold TTL (default `15`) |
| `Cors__AllowedOrigins` | Comma-separated browser origins |

## API summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/inventory` | List products and available quantity (seeded with 6 SKUs on first run) |
| GET | `/api/holds` | List **active** holds (expired holds are transitioned on read and then omitted) |
| POST | `/api/holds` | Create hold; atomically decrements stock; `201` + body |
| GET | `/api/holds/{holdId}` | Get hold; lazy-expire publishes `HoldExpired` once |
| DELETE | `/api/holds/{holdId}` | Release active hold; restores stock; `204` |

Errors return JSON `{ "code", "message" }` with `400` / `404` / `409` as appropriate.

## Design decisions

- **Atomic stock:** `TryDecrementStockAsync` uses MongoDB `UpdateOne` with `QuantityAvailable >= qty` and `$inc`—`ModifiedCount == 0` means insufficient stock or missing SKU.
- **Release safety:** `TryMarkReleasedAsync` requires `Status == Active` and `ExpiresAt > UtcNow` so time-expired rows cannot release inventory twice.
- **Expiry:** **HoldExpired** is emitted when an active hold is read (GET by id or list) and `UtcNow >= ExpiresAt`, idempotent via `ExpiredEventPublished` on the hold document.
- **Redis:** Cache key `inventory:list` (TTL 60s) and `hold:{id}` (TTL 120s). Invalidated or refreshed on create/release/expiry paths that affect reads.
- **RabbitMQ:** Topic exchange `inventory.events`, routing keys `hold.created`, `hold.released`, `hold.expired`. Payloads are JSON matching the types in `InventoryHold.Contracts`.

## Documentation

- [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) — specification checklist from the assignment PDF.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers and flows.
- [AI-USAGE.md](AI-USAGE.md) — required AI steering narrative (fill in with your session specifics before submission).
