import { useState } from "react";

interface ReturnItem {
  id: string;
  orderNumber: string;
  sku: string;
  productName: string;
  customerName: string;
  returnReason: string;
  quantity: number;
  returnDate: string;
  status: "Pending Inspection" | "Restocked" | "Damaged";
}

export function ShopeeReturnManager() {
  const [returns, setReturns] = useState<ReturnItem[]>([
    {
      id: "SHP-RET-101",
      orderNumber: "ORD-SHP-8990",
      sku: "1012514",
      productName: "Wireless Noise-Canceling Earbuds",
      customerName: "K. Thanawat B.",
      returnReason: "Customer ordered wrong color",
      quantity: 1,
      returnDate: "2026-08-29",
      status: "Pending Inspection",
    },
    {
      id: "SHP-RET-102",
      orderNumber: "ORD-SHP-7721",
      sku: "123131",
      productName: "Pro Ergonomic Desk Chair",
      customerName: "K. Malee C.",
      returnReason: "Slight box dent upon delivery",
      quantity: 1,
      returnDate: "2026-08-28",
      status: "Pending Inspection",
    },
  ]);

  const [toast, setToast] = useState<string | null>(null);

  const handleAction = (id: string, action: "Restocked" | "Damaged") => {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    const msg =
      action === "Restocked"
        ? `✓ Approved & Restocked SKU to Online Inventory!`
        : `⚠️ Item marked as damaged / written-off.`;
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="card-head">
        <div>
          <h3 className="card-title">🛍️ Shopee Online Return Processor</h3>
          <div className="card-sub">
            Verify returned packages from Shopee & restore inventory to prevent stock loss
          </div>
        </div>
        <span className="badge badge-amber">
          {returns.filter((r) => r.status === "Pending Inspection").length} Pending Return Items
        </span>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Shopee Order</th>
              <th>Product / SKU</th>
              <th>Customer & Reason</th>
              <th>Qty</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Restock Action</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id}>
                <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {r.id}
                </td>
                <td className="mono">{r.orderNumber}</td>
                <td>
                  <div style={{ fontWeight: 700 }}>{r.productName}</div>
                  <div className="mono muted" style={{ fontSize: 12 }}>SKU: {r.sku}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{r.returnReason}</div>
                </td>
                <td style={{ fontWeight: 700 }}>{r.quantity}</td>
                <td>
                  {r.status === "Pending Inspection" ? (
                    <span className="badge badge-amber">⏳ Pending Check</span>
                  ) : r.status === "Restocked" ? (
                    <span className="badge badge-green">✓ Restocked</span>
                  ) : (
                    <span className="badge badge-red">❌ Damaged</span>
                  )}
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  {r.status === "Pending Inspection" ? (
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAction(r.id, "Restocked")}
                      >
                        ✓ Restock to Inventory
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleAction(r.id, "Damaged")}
                      >
                        Mark Damaged
                      </button>
                    </div>
                  ) : (
                    <span className="muted" style={{ fontSize: 12 }}>Action Complete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <div className="toast-banner">{toast}</div>}
    </div>
  );
}

export default ShopeeReturnManager;
