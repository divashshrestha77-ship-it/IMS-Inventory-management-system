export interface Category {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Unit {
  id: number;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductVariant {
  id?: number;
  product?: number;
  name: string;
  sku: string;
  barcode?: string;
  selling_price: number;
  cost_price: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  unit: number;
  unit_name: string;
  quantity: number;
  cost_price: number;
  discount_percentage: number;
  selling_price: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariantInput {
  id?: number;
  name: string;
  sku: string;
  barcode?: string;
  selling_price: number;
  cost_price: number;
  is_active?: boolean;
}

export interface ProductInput {
  name: string;
  category: number;
  unit: number;
  quantity?: number;
  cost_price?: number;
  discount_percentage?: number;
  description?: string;
  is_active?: boolean;
  variants?: ProductVariantInput[];
}

