const API_URL = "http://127.0.0.1:8000/api/products";


export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  description: string;
  created_at?: string;
  updated_at?: string;
}


export interface ProductInput {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  description: string;
}


// GET PRODUCTS
export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}


// GET SINGLE PRODUCT
export async function getProduct(
  id: number
): Promise<Product> {

  const response = await fetch(`${API_URL}/${id}/`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}


// CREATE PRODUCT
export async function createProduct(
  product: ProductInput
): Promise<Product> {

  const response = await fetch(`${API_URL}/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to create product");
  }

  return response.json();
}


// UPDATE PRODUCT
export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {

  const response = await fetch(`${API_URL}/${id}/`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
}


// DELETE PRODUCT
export async function deleteProduct(
  id: number
): Promise<void> {

  const response = await fetch(`${API_URL}/${id}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }
}