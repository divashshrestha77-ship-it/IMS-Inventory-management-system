export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  cost_price: number;
  is_active: boolean;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  cost_price: number;
  is_active: boolean;
}