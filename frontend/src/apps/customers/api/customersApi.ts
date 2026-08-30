import { API_BASE } from "../../../config";
import type { Customer } from "../types/customers";

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "K. Pitchaya S.",
    email: "pitchaya@gmail.com",
    phone: "+66 89 123 4567",
    preferred_channel: "Shopee",
    total_orders: 14,
    total_spent: 44800,
    registered_at: "2025-11-10",
  },
  {
    id: 2,
    name: "K. Nuttapong P.",
    email: "nuttapong@line.me",
    phone: "+66 81 999 8877",
    preferred_channel: "Line Official",
    total_orders: 8,
    total_spent: 36000,
    registered_at: "2026-01-20",
  },
  {
    id: 3,
    name: "K. Suparat W.",
    email: "suparat@outlook.com",
    phone: "+66 86 555 4321",
    preferred_channel: "Storefront",
    total_orders: 5,
    total_spent: 19500,
    registered_at: "2026-02-14",
  },
];

export async function getCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(`${API_BASE}/customers/`);
    if (res.ok) return await res.json();
  } catch {
    /* fallback */
  }
  return mockCustomers;
}
