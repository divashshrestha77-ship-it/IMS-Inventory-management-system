export interface StockLocation {
  id: number;
  name: string;
  code: string;
  location_type:
    | "STORE"
    | "POPUP"
    | "WAREHOUSE"
    | "ONLINE"
    | "OTHER";
  address?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Inventory {
  id: number;

  product: number;
  product_name: string;

  variant?: number | null;
  variant_name?: string | null;

  stock_location: number;
  stock_location_name: string;

  quantity: number;
  reserved_quantity: number;
  available_quantity: number;

  reorder_level?: number;
  updated_at?: string;
}

export type StockMovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT"
  | "RETURN"
  | "TRANSFER_IN"
  | "TRANSFER_OUT";

export interface StockMovement {
  id: number;

  product: number;
  product_name: string;

  variant?: number | null;
  variant_name?: string | null;

  stock_location: number;
  stock_location_name: string;

  movement_type: StockMovementType;

  quantity: number;

  reference?: string | null;
  reason?: string | null;

  created_by?: number | null;
  created_by_name?: string | null;

  created_at: string;
}

export type StockTransferStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "COMPLETED"
  | "CANCELLED";

export interface StockTransfer {
  id: number;

  reference: string;

  product: number;
  product_name: string;

  variant?: number | null;
  variant_name?: string | null;

  from_location: number;
  from_location_name: string;

  to_location: number;
  to_location_name: string;

  quantity: number;

  status: StockTransferStatus;

  notes?: string | null;

  created_by?: number | null;
  created_by_name?: string | null;

  created_at: string;
  updated_at?: string;
}

export type StockCountStatus =
  | "DRAFT"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface StockCount {
  id: number;

  reference: string;

  stock_location: number;
  stock_location_name: string;

  status: StockCountStatus;

  count_date: string;

  counted_by?: number | null;
  counted_by_name?: string | null;

  notes?: string | null;

  created_at: string;
  updated_at?: string;
}

export interface StockCountLine {
  id: number;

  stock_count: number;

  product: number;
  product_name: string;

  variant?: number | null;
  variant_name?: string | null;

  system_quantity: number;
  counted_quantity: number;
  difference: number;

  notes?: string | null;
}

export interface CreateStockLocationPayload {
  name: string;
  code: string;
  location_type: StockLocation["location_type"];
  address?: string;
  is_active?: boolean;
}

export interface UpdateStockLocationPayload {
  name?: string;
  code?: string;
  location_type?: StockLocation["location_type"];
  address?: string;
  is_active?: boolean;
}

export interface CreateStockMovementPayload {
  product: number;
  variant?: number | null;
  stock_location: number;
  movement_type: StockMovementType;
  quantity: number;
  reference?: string;
  reason?: string;
}

export interface CreateStockTransferPayload {
  product: number;
  variant?: number | null;
  from_location: number;
  to_location: number;
  quantity: number;
  notes?: string;
}

export interface CreateStockCountPayload {
  stock_location: number;
  count_date: string;
  notes?: string;
}

export interface CreateStockCountLinePayload {
  stock_count: number;
  product: number;
  variant?: number | null;
  counted_quantity: number;
  notes?: string;
}