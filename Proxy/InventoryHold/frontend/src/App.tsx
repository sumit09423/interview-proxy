import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createHold,
  getInventory,
  listHolds,
  releaseHold,
  type Hold,
  type InventoryItem,
} from "./api";

function msRemaining(expiresAt: string): number {
  return new Date(expiresAt).getTime() - Date.now();
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}h ${mm}m`;
  }
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

function IconPackage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

export default function App() {
  const qc = useQueryClient();
  const inventoryQuery = useQuery({ queryKey: ["inventory"], queryFn: getInventory });
  const holdsQuery = useQuery({ queryKey: ["holds"], queryFn: listHolds, refetchInterval: 5000 });

  const [lines, setLines] = useState<{ productId: string; quantity: number }[]>([
    { productId: "", quantity: 1 },
  ]);
  const [releaseTarget, setReleaseTarget] = useState<Hold | null>(null);
  const [tick, setTick] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;
    const t = window.setTimeout(() => setShowSuccess(false), 5000);
    return () => window.clearTimeout(t);
  }, [showSuccess]);

  const createMut = useMutation({
    mutationFn: () =>
      createHold(
        lines.filter((l) => l.productId.trim()).map((l) => ({ productId: l.productId.trim(), quantity: l.quantity })),
        undefined
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["holds"] });
      setLines([{ productId: "", quantity: 1 }]);
      setFormError(null);
      setShowSuccess(true);
    },
    onError: () => setFormError(null),
  });

  const releaseMut = useMutation({
    mutationFn: (id: string) => releaseHold(id),
    onSuccess: async () => {
      setReleaseTarget(null);
      await qc.invalidateQueries({ queryKey: ["inventory"] });
      await qc.invalidateQueries({ queryKey: ["holds"] });
    },
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && releaseTarget && !releaseMut.isPending) setReleaseTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [releaseTarget, releaseMut.isPending]);

  const products: InventoryItem[] = inventoryQuery.data ?? [];
  const holds: Hold[] = holdsQuery.data ?? [];

  const maxStock = useMemo(
    () => Math.max(1, ...products.map((p) => p.quantityAvailable), 1),
    [products]
  );

  const activeHolds = useMemo(
    () => holds.filter((h) => h.status === "Active" || h.status === "Expired"),
    [holds]
  );

  const activeOnlyCount = useMemo(() => activeHolds.filter((h) => h.status === "Active").length, [activeHolds]);

  const totalUnits = useMemo(() => products.reduce((s, p) => s + p.quantityAvailable, 0), [products]);

  const lastUpdated = holdsQuery.dataUpdatedAt || inventoryQuery.dataUpdatedAt;
  const lastUpdatedStr = lastUpdated
    ? new Intl.DateTimeFormat(undefined, { timeStyle: "short" }).format(new Date(lastUpdated))
    : "—";

  const copyId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const submitHold = () => {
    const valid = lines.filter((l) => l.productId.trim());
    if (valid.length === 0) {
      setFormError("Choose at least one product to reserve.");
      return;
    }
    for (const l of valid) {
      if (l.quantity < 1) {
        setFormError("Each quantity must be at least 1.");
        return;
      }
      const p = products.find((x) => x.productId === l.productId.trim());
      if (p && l.quantity > p.quantityAvailable) {
        setFormError(`Not enough stock for ${p.name}. Only ${p.quantityAvailable} available.`);
        return;
      }
    }
    setFormError(null);
    createMut.mutate();
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden>
              H
            </div>
            <div className="brand-text">
              <h1>Checkout Holds</h1>
              <p>Reserve stock while customers complete checkout</p>
            </div>
          </div>
          <div className="topbar-meta">
            Data refreshed <strong>{lastUpdatedStr}</strong>
            <br />
            <span>Auto-refresh every 5s</span>
          </div>
        </div>
      </header>

      <main className="main">
        <span className="visually-hidden" aria-hidden>
          {tick}
        </span>
        <section className="intro" aria-labelledby="intro-heading">
          <h2 id="intro-heading">Welcome</h2>
          <p>
            See what&apos;s in stock, temporarily hold items so they aren&apos;t sold twice, and release a hold if the
            customer abandons checkout. Holds expire automatically after the time shown on each card.
          </p>
        </section>

        <div className="stats" role="region" aria-label="Summary">
          <div className="stat-card">
            <div className="label">Products</div>
            <div className="value">{inventoryQuery.isLoading ? "—" : products.length}</div>
            <div className="hint">SKUs in catalog</div>
          </div>
          <div className="stat-card">
            <div className="label">Total units</div>
            <div className="value">{inventoryQuery.isLoading ? "—" : totalUnits.toLocaleString()}</div>
            <div className="hint">Available to sell</div>
          </div>
          <div className="stat-card">
            <div className="label">Open holds</div>
            <div className="value">{holdsQuery.isLoading ? "—" : activeOnlyCount}</div>
            <div className="hint">Active reservations</div>
          </div>
        </div>

        <div className="grid grid-2">
          <section className="panel" aria-labelledby="inv-heading">
            <div className="panel-header">
              <div>
                <h3 id="inv-heading">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <IconPackage /> Catalog inventory
                  </span>
                </h3>
                <p className="sub">Live quantities — updates when you create or release holds.</p>
              </div>
            </div>
            <div className="panel-body">
              {inventoryQuery.isLoading && (
                <>
                  <div className="skeleton skeleton-row" />
                  <div className="skeleton skeleton-row" />
                  <div className="skeleton skeleton-row" />
                </>
              )}
              {inventoryQuery.error && (
                <div className="alert alert-error" role="alert">
                  <span className="alert-icon" aria-hidden>
                    !
                  </span>
                  <div>
                    <strong>Couldn&apos;t load inventory.</strong>
                    <br />
                    {(inventoryQuery.error as Error).message}
                  </div>
                </div>
              )}
              {!inventoryQuery.isLoading && !inventoryQuery.error && products.length === 0 && (
                <div className="empty-state">
                  <p className="title">No products yet</p>
                  <p>Start the API with MongoDB running so the catalog can seed.</p>
                </div>
              )}
              {!inventoryQuery.isLoading && !inventoryQuery.error && products.length > 0 && (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th>Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.productId}>
                          <td className="product-cell">
                            {p.name}
                            {p.quantityAvailable <= 5 && p.quantityAvailable > 0 && (
                              <>
                                {" "}
                                <span className="badge-low">Low</span>
                              </>
                            )}
                          </td>
                          <td>
                            <span className="sku">{p.productId}</span>
                          </td>
                          <td>
                            <div className="stock-cell">
                              <span className="stock-num">{p.quantityAvailable}</span>
                              <div className="stock-bar" title={`${p.quantityAvailable} units`}>
                                <span
                                  style={{
                                    width: `${Math.min(100, (p.quantityAvailable / maxStock) * 100)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <section className="panel" aria-labelledby="hold-form-heading">
            <div className="panel-header">
              <div>
                <h3 id="hold-form-heading">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    <IconCart /> New hold
                  </span>
                </h3>
                <p className="sub">Pick products and quantities. Stock is reserved until the hold expires or you release it.</p>
              </div>
            </div>
            <div className="panel-body">
              <div className="form-stack">
                {lines.map((line, idx) => (
                  <div key={idx} className="line-item">
                    <div className="field">
                      <label htmlFor={`product-${idx}`}>Product</label>
                      <select
                        id={`product-${idx}`}
                        value={line.productId}
                        onChange={(e) => {
                          const v = e.target.value;
                          setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, productId: v } : l)));
                        }}
                      >
                        <option value="">Select a product…</option>
                        {products.map((p) => (
                          <option key={p.productId} value={p.productId}>
                            {p.name} — {p.quantityAvailable} in stock
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor={`qty-${idx}`}>Qty</label>
                      <input
                        id={`qty-${idx}`}
                        className="qty-input"
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => {
                          const q = Math.max(1, Number(e.target.value) || 1);
                          setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, quantity: q } : l)));
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      disabled={lines.length <= 1}
                      onClick={() => setLines((p) => p.filter((_, i) => i !== idx))}
                      aria-label="Remove line"
                      title="Remove line"
                    >
                      <IconTrash />
                    </button>
                  </div>
                ))}
              </div>

              <div className="toolbar">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setLines((p) => [...p, { productId: "", quantity: 1 }])}
                >
                  + Add another product
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={createMut.isPending || products.length === 0}
                  onClick={submitHold}
                >
                  {createMut.isPending ? "Placing hold…" : "Place hold"}
                </button>
              </div>

              {showSuccess && (
                <div className="alert alert-success" role="status">
                  <span className="alert-icon" aria-hidden>
                    ✓
                  </span>
                  <div>
                    <strong>Hold placed.</strong> It appears below with a countdown. Inventory has been updated.
                  </div>
                </div>
              )}

              {(formError || createMut.error) && (
                <div className="alert alert-error" role="alert">
                  <span className="alert-icon" aria-hidden>
                    !
                  </span>
                  <div>{formError ?? (createMut.error as Error).message}</div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="panel" style={{ marginTop: "1.5rem" }} aria-labelledby="holds-heading">
          <div className="panel-header">
            <div>
              <h3 id="holds-heading">
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                  <IconClock /> Your holds
                </span>
              </h3>
              <p className="sub">Active reservations and time left. Expired holds can&apos;t be released — stock returns when the system marks them expired.</p>
            </div>
          </div>
          <div className="panel-body">
            {holdsQuery.isLoading && (
              <>
                <div className="skeleton skeleton-row" style={{ height: 100 }} />
                <div className="skeleton skeleton-row" style={{ height: 100 }} />
              </>
            )}
            {holdsQuery.error && (
              <div className="alert alert-error" role="alert">
                {(holdsQuery.error as Error).message}
              </div>
            )}
            {!holdsQuery.isLoading && !holdsQuery.error && activeHolds.length === 0 && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M20 7h-9M14 17H5M17 17h1a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-1M9 9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" />
                </svg>
                <p className="title">No holds right now</p>
                <p>When you place a hold, it will show up here with a live timer.</p>
              </div>
            )}
            <div className="holds-grid">
              {activeHolds.map((h) => {
                const ms = msRemaining(h.expiresAt);
                const active = h.status === "Active";
                return (
                  <article key={h.holdId} className="hold-card">
                    <div>
                      <div className="hold-top">
                        <span className={`pill pill-${h.status.toLowerCase()}`}>{h.status}</span>
                        <span className="hold-id" title="Hold reference">
                          {h.holdId}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: "0.35rem 0.6rem", fontSize: "0.75rem" }}
                          onClick={() => copyId(h.holdId)}
                          aria-label="Copy hold ID"
                        >
                          <IconCopy /> {copiedId === h.holdId ? "Copied!" : "Copy ID"}
                        </button>
                      </div>
                      <ul className="hold-lines">
                        {h.items.map((i) => (
                          <li key={`${h.holdId}-${i.productId}`}>
                            <strong style={{ color: "var(--text)" }}>{i.productName}</strong> × {i.quantity}
                          </li>
                        ))}
                      </ul>
                      <div className="timer-block">
                        <span className="visually-hidden">Time remaining</span>
                        <div className={`timer ${!active || ms <= 0 ? "expired" : ""}`}>
                          <IconClock />
                          {active && ms > 0 ? formatRemaining(ms) : "No longer active"}
                        </div>
                      </div>
                    </div>
                    <div className="hold-actions">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        disabled={!active || releaseMut.isPending}
                        onClick={() => setReleaseTarget(h)}
                      >
                        Release hold
                      </button>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>
                        Returns items to inventory
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        Checkout Holds · Inventory reservation demo ·{" "}
        <a href="/api/inventory" target="_blank" rel="noreferrer">
          API
        </a>
      </footer>

      {releaseTarget && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => !releaseMut.isPending && setReleaseTarget(null)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="modal-title">Release this hold?</h3>
            <p className="lead">
              We&apos;ll put the items back on the shelf for other customers. This can&apos;t be undone, but you can
              place a new hold if needed.
            </p>
            <ul className="hold-lines" style={{ marginBottom: "1.25rem" }}>
              {releaseTarget.items.map((i) => (
                <li key={i.productId}>
                  {i.productName} × {i.quantity}
                </li>
              ))}
            </ul>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" disabled={releaseMut.isPending} onClick={() => setReleaseTarget(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={releaseMut.isPending}
                onClick={() => releaseMut.mutate(releaseTarget.holdId)}
              >
                {releaseMut.isPending ? "Releasing…" : "Yes, release"}
              </button>
            </div>
            {releaseMut.error && (
              <div className="alert alert-error" style={{ marginTop: "1rem", marginBottom: 0 }} role="alert">
                {(releaseMut.error as Error).message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
