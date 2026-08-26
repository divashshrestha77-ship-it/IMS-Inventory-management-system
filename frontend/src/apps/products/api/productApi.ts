const API_URL = "http://127.0.0.1:8000/api/products";

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  description: string;
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}