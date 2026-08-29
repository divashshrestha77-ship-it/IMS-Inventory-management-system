import { endpoints } from "../../../config";
import type { Category } from "../types/product";

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

export const getCategories = async (): Promise<Category[]> => {
  return handle(await fetch(endpoints.categories));
};

export const createCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  return handle(
    await fetch(endpoints.categories, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
  );
};

export const deleteCategory = async (id: number): Promise<void> => {
  return handle(
    await fetch(`${endpoints.categories}${id}/`, { method: "DELETE" })
  );
};
