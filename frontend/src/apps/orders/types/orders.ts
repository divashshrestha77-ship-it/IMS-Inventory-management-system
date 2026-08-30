export type SalesChannel =
  | "Shopee"
  | "Line Official"
  | "Storefront: Siam Paragon"
  | "Storefront: Central World"
  | "Storefront: IconSiam"
  | "Pop-up Store 1"
  | "Pop-up Store 2"
  | "Pop-up Store 3"
  | "Pop-up Store 4"
  | "Pop-up Store 5"
  | "Pop-up Store 6"
  | "Pop-up Store 7"
  | "Pop-up Store 8"
  | "Pop-up Store 9"
  | "Pop-up Store 10";

export interface OrderLine {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  channel: SalesChannel;
  channel_type: "Online" | "Storefront" | "Pop-up";
  customer_name: string;
  customer_phone?: string;
  created_at: string;
  status: "Completed" | "Pending" | "Shipped" | "Returned" | "Cancelled";
  payment_status: "Paid" | "Pending" | "Refunded";
  total_amount: number;
  notes?: string;
  lines: OrderLine[];
}
