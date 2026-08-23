import api from "../../../services/api";

import type {
  Product,
  ProductFormData,
} from "../types/product";

// GET PRODUCTS
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get("/products/");
  return response.data;
};

// GET SINGLE PRODUCT
export const getProduct = async (
  id: number
): Promise<Product> => {
  const response = await api.get(`/products/${id}/`);
  return response.data;
};

// CREATE PRODUCT
export const createProduct = async (
  data: ProductFormData
): Promise<Product> => {
  const response = await api.post("/products/", data);
  return response.data;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id: number,
  data: ProductFormData
): Promise<Product> => {
  const response = await api.put(
    `/products/${id}/`,
    data
  );

  return response.data;
};

// DELETE PRODUCT
export const deleteProduct = async (
  id: number
): Promise<void> => {
  await api.delete(`/products/${id}/`);
};