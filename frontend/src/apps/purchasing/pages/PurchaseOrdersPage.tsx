import { useEffect, useState } from "react";
import { getPurchaseOrders } from "../api/purchasingApi";
import type { PurchaseOrder } from "../types/purchasing";

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPurchaseOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Purchase Orders</h1>
          <div className="sub">Track inbound inventory from suppliers</div>
        </div>
        <button className="btn btn-primary">+ Create PO</button>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading purchase orders...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((po) => (
                <tr key={po.id}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {po.po_number}
                  </td>
                  <td style={{ fontWeight: 600 }}>{po.supplier_name}</td>
                  <td>{po.order_date}</td>
                  <td>{po.expected_delivery}</td>
                  <td>
                    {po.status === "Received" ? (
                      <span className="badge badge-green">Received</span>
                    ) : (
                      <span className="badge badge-blue">In Transit ({po.status})</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    ฿{po.total_cost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
