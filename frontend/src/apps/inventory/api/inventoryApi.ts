import { endpoints } from "../../../config";
import type {
  Inventory,
  StockLocation,
  StockMovement,
  StockTransfer,
  StockCount,
} from "../types/inventory";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body?.detail || JSON.stringify(body) || message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

// --- Inventory ---
export async function getInventory(): Promise<Inventory[]> {
  return handle(await fetch(endpoints.inventory));
}

// --- Stock Locations ---
export async function getLocations(): Promise<StockLocation[]> {
  return handle(await fetch(endpoints.locations));
}

// --- Stock Movements ---
export async function getMovements(): Promise<StockMovement[]> {
  return handle(await fetch(endpoints.movements));
}

// --- Stock Transfers ---
export async function getTransfers(): Promise<StockTransfer[]> {
  return handle(await fetch(endpoints.transfers));
}

export async function createStockTransfer(data: {
  from_location: number;
  to_location: number;
  status?: string;
  notes?: string;
}): Promise<void> {
  return handle(
    await fetch(endpoints.transfers, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

// --- Stock Counts ---
export async function getStockCounts(): Promise<StockCount[]> {
  return handle(await fetch(endpoints.counts));
}

export async function createStockCount(data: {
  location: number;
  notes?: string;
}): Promise<void> {
  return handle(
    await fetch(endpoints.counts, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}
