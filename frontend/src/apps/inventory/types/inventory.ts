export interface StockLocation {
  id: number;
  name: string;
  code: string;
  location_type: string;
  phone: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: number;
  product: number;
  product_name: string;
  location: number;
  location_name: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  inventory: number;
  product: number;
  product_name: string;
  variant: number | null;
  variant_name: string | null;
  location: number;
  location_name: string;
  movement_type: string;
  quantity_change: number;
  reference_type: string;
  reference_id: number | null;
  notes: string;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockTransfer {
  id: number;
  reference_number: string;
  from_location: number;
  from_location_name: string;
  to_location: number;
  to_location_name: string;
  status: string;
  notes: string;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockCount {
  id: number;
  location: number;
  location_name: string;
  status: string;
  notes: string;
  counted_by: number | null;
  counted_by_name: string | null;
  lines: StockCountLine[];
  created_at: string;
  updated_at: string;
}

export interface StockCountLine {
  id: number;
  product: number;
  product_name: string;
  variant: number | null;
  variant_name: string | null;
  system_quantity: number;
  counted_quantity: number;
  difference: number;
  notes: string;
}

export interface CreateStockLocationPayload {
  name: string;
  code: string;
  location_type: string;
  phone?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateStockTransferPayload {
  from_location: number;
  to_location: number;
  status?: string;
  notes?: string;
}

export interface CreateStockCountPayload {
  location: number;
  notes?: string;
}

export interface CreateStockCountLinePayload {
  stock_count: number;
  product: number;
  variant?: number | null;
  counted_quantity: number;
  notes?: string;
}
