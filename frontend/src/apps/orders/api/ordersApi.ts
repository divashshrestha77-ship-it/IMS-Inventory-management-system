import { API_BASE } from "../../../config";
import type { Order } from "../types/orders";

const mockOrders: Order[] = [
  {
    id: 1001,
    order_number: "ORD-SHP-8891",
    channel: "Shopee",
    channel_type: "Online",
    customer_name: "K. Pitchaya S.",
    customer_phone: "+66 89 123 4567",
    created_at: "2026-08-29 14:30",
    status: "Completed",
    payment_status: "Paid",
    total_amount: 3200,
    lines: [
      { id: 1, product_id: 1, product_name: "Wireless Noise-Canceling Earbuds", sku: "1012514", quantity: 1, unit_price: 3200, total_price: 3200 },
    ],
  },
  {
    id: 1002,
    order_number: "ORD-LNE-5521",
    channel: "Line Official",
    channel_type: "Online",
    customer_name: "K. Nuttapong P.",
    created_at: "2026-08-29 16:15",
    status: "Completed",
    payment_status: "Paid",
    total_amount: 4500,
    lines: [
      { id: 2, product_id: 2, product_name: "Pro Ergonomic Desk Chair", sku: "123131", quantity: 1, unit_price: 4500, total_price: 4500 },
    ],
  },
  {
    id: 1003,
    order_number: "ORD-STF-0102",
    channel: "Storefront: Central World",
    channel_type: "Storefront",
    customer_name: "Walk-in Customer",
    created_at: "2026-08-30 11:20",
    status: "Completed",
    payment_status: "Paid",
    total_amount: 1800,
    lines: [
      { id: 3, product_id: 3, product_name: "Mechanical RGB Gaming Keyboard", sku: "987654", quantity: 1, unit_price: 1800, total_price: 1800 },
    ],
  },
  {
    id: 1004,
    order_number: "ORD-POP-0412",
    channel: "Pop-up Store 3",
    channel_type: "Pop-up",
    customer_name: "Pop-up Guest",
    created_at: "2026-08-30 10:45",
    status: "Completed",
    payment_status: "Paid",
    total_amount: 1200,
    lines: [
      { id: 4, product_id: 1, product_name: "Wireless Noise-Canceling Earbuds", sku: "1012514", quantity: 1, unit_price: 1200, total_price: 1200 },
    ],
  },
  {
    id: 1005,
    order_number: "ORD-SHP-8990",
    channel: "Shopee",
    channel_type: "Online",
    customer_name: "K. Thanawat B.",
    created_at: "2026-08-28 09:10",
    status: "Returned",
    payment_status: "Refunded",
    total_amount: 3200,
    notes: "Customer reported wrong size returned via Shopee Express",
    lines: [
      { id: 5, product_id: 1, product_name: "Wireless Noise-Canceling Earbuds", sku: "1012514", quantity: 1, unit_price: 3200, total_price: 3200 },
    ],
  },
];

export async function getOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${API_BASE}/orders/`);
    if (res.ok) return await res.json();
  } catch {
    /* fallback */
  }
  return mockOrders;
}
