const prefix = "";

export type HoldStatus = "Active" | "Released" | "Expired";

export type InventoryItem = {
  productId: string;
  name: string;
  quantityAvailable: number;
};

export type HoldLine = {
  productId: string;
  productName: string;
  quantity: number;
};

export type Hold = {
  holdId: string;
  status: HoldStatus;
  items: HoldLine[];
  expiresAt: string;
  createdAt: string;
};

export type ApiError = { code: string; message: string };

type HoldWire = {
  holdId: string;
  status: string;
  items: HoldLine[];
  expiresAt: string;
  createdAt: string;
};

function normalizeStatus(status: string): HoldStatus {
  const value = status.toLowerCase();
  if (value === "active") return "Active";
  if (value === "released") return "Released";
  return "Expired";
}

function mapHoldFromApi(input: HoldWire): Hold {
  return {
    holdId: input.holdId,
    status: normalizeStatus(input.status),
    items: input.items ?? [],
    expiresAt: input.expiresAt,
    createdAt: input.createdAt,
  };
}

async function parseError(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as ApiError;
    return j.message || res.statusText;
  } catch {
    return res.statusText;
  }
}

export async function getInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${prefix}/api/inventory`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { productId: string; name: string; quantityAvailable: number }[];
  return data.map((x) => ({
    productId: x.productId,
    name: x.name,
    quantityAvailable: x.quantityAvailable,
  }));
}

export async function listHolds(): Promise<Hold[]> {
  const res = await fetch(`${prefix}/api/holds`);
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as HoldWire[];
  return data.map(mapHoldFromApi);
}

export async function createHold(
  items: { productId: string; quantity: number }[],
  holdDurationMinutes?: number
): Promise<Hold> {
  const res = await fetch(`${prefix}/api/holds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, holdDurationMinutes }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as HoldWire;
  return mapHoldFromApi(data);
}

export async function releaseHold(holdId: string): Promise<void> {
  const res = await fetch(`${prefix}/api/holds/${holdId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseError(res));
}
