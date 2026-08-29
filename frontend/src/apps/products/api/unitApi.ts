import { endpoints } from "../../../config";
import type { Unit } from "../types/product";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message = body?.name || JSON.stringify(body) || message;
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

export const getUnits = async (): Promise<Unit[]> => {
  return handle(await fetch(endpoints.units));
};

export const createUnit = async (
  unit: Omit<Unit, "id">
): Promise<Unit> => {
  return handle(
    await fetch(endpoints.units, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(unit),
    })
  );
};

export const deleteUnit = async (id: number): Promise<void> => {
  return handle(
    await fetch(`${endpoints.units}${id}/`, { method: "DELETE" })
  );
};
