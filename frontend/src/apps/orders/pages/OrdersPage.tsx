import { useEffect, useState } from "react";
import { getOrders } from "../api/ordersApi";
import type { Order } from "../types/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const filtered = channelFilter === "All"
    ? orders
    : orders.filter((o) => o.channel_type === channelFilter || o.channel === channelFilter);

  const totalSales = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const returnedOrders = orders.filter((o) => o.status === "Returned").length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Omnichannel Orders</h1>
          <div className="sub">
            Real-time orders across 3 Storefronts, 10 Pop-up Stores, Shopee & Line Official
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{orders.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Completed Sales</div>
          <div className="stat-value">฿{totalSales.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Online Returns</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>
            {returnedOrders} Orders
          </div>
        </div>
      </div>

      <div className="board-toolbar" style={{ marginBottom: 20 }}>
        <div className="view-mode-tabs">
          {["All", "Online", "Storefront", "Pop-up", "Shopee", "Line Official"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${channelFilter === tab ? "active" : ""}`}
              onClick={() => setChannelFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading orders...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Channel</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Payment</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {o.order_number}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        o.channel === "Shopee"
                          ? "badge-amber"
                          : o.channel === "Line Official"
                          ? "badge-green"
                          : o.channel_type === "Storefront"
                          ? "badge-blue"
                          : "badge-gray"
                      }`}
                    >
                      {o.channel}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{o.customer_name}</td>
                  <td className="muted">{o.created_at}</td>
                  <td>
                    {o.status === "Completed" ? (
                      <span className="badge badge-green">✓ Completed</span>
                    ) : o.status === "Returned" ? (
                      <span className="badge badge-red">↩ Returned</span>
                    ) : (
                      <span className="badge badge-blue">{o.status}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${o.payment_status === "Paid" ? "badge-green" : "badge-red"}`}>
                      {o.payment_status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    ฿{o.total_amount.toLocaleString()}
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
