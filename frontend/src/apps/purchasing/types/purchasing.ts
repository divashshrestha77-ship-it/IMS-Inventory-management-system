export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  is_active: boolean;
  lead_time_days: number;
  created_at: string;
}

export interface PurchaseOrderLine {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_cost: number;
  total_amount: number;
}

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_delivery: string;
  status: "Draft" | "Sent" | "Partial" | "Received" | "Cancelled";
  total_cost: number;
  notes: string;
  destination_location_name: string;
  lines: PurchaseOrderLine[];
}
