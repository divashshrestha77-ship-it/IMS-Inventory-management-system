export interface Payment {
  id: number;
  payment_number: string;
  order_number: string;
  payment_method: "PromptPay QR" | "Credit Card" | "Shopee Pay" | "Cash / POS" | "COD";
  channel: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  timestamp: string;
}
