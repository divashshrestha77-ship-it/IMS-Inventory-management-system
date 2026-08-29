import { endpoints } from "../../../config";
import type { Product, ProductInput } from "../types/product";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      message =
        body?.detail || body?.message || JSON.stringify(body) || message;
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

export const getProducts = async (): Promise<Product[]> => {
  return handle(await fetch(endpoints.products));
};

export const getProduct = async (id: number): Promise<Product> => {
  return handle(await fetch(`${endpoints.products}${id}/`));
};

export const createProduct = async (
  data: ProductInput
): Promise<Product> => {
  return handle(
    await fetch(endpoints.products, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
};

export const updateProduct = async (
  id: number,
  data: Partial<ProductInput>
): Promise<Product> => {
  return handle(
    await fetch(`${endpoints.products}${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  return handle(
    await fetch(`${endpoints.products}${id}/`, { method: "DELETE" })
  );
};
