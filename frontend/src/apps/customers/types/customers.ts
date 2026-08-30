export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  preferred_channel: "Shopee" | "Line Official" | "Storefront" | "Pop-up";
  total_orders: number;
  total_spent: number;
  registered_at: string;
}
