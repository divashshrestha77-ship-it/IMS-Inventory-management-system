import { API_BASE } from "../../../config";
import type { Payment } from "../types/payments";

const mockPayments: Payment[] = [
  {
    id: 1,
    payment_number: "PAY-2026-901",
    order_number: "ORD-SHP-8891",
    payment_method: "Shopee Pay",
    channel: "Shopee",
    amount: 3200,
    status: "Completed",
    timestamp: "2026-08-29 14:31",
  },
  {
    id: 2,
    payment_number: "PAY-2026-902",
    order_number: "ORD-LNE-5521",
    payment_method: "PromptPay QR",
    channel: "Line Official",
    amount: 4500,
    status: "Completed",
    timestamp: "2026-08-29 16:16",
  },
  {
    id: 3,
    payment_number: "PAY-2026-903",
    order_number: "ORD-STF-0102",
    payment_method: "Credit Card",
    channel: "Storefront: Central World",
    amount: 1800,
    status: "Completed",
    timestamp: "2026-08-30 11:21",
  },
];

export async function getPayments(): Promise<Payment[]> {
  try {
    const res = await fetch(`${API_BASE}/payments/`);
    if (res.ok) return await res.json();
  } catch {
    /* fallback */
  }
  return mockPayments;
}
