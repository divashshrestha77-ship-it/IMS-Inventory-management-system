import { useState } from "react";

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<"channel" | "shopee_returns" | "popup_variance">("channel");

  // Sample data representing SQL view aggregations
  const channelStockSummary = [
    { channel: "3 Storefronts (Paragon, CW, IconSiam)", stockQty: 4850, value: 9700000, status: "Normal" },
    { channel: "10 Pop-up Stores (Department Stores)", stockQty: 3200, value: 6400000, status: "Check Required" },
    { channel: "Shopee Online Buffer", stockQty: 1500, value: 3000000, status: "Synced" },
    { channel: "Line Official Online Buffer", stockQty: 950, value: 1900000, status: "Synced" },
    { channel: "Central Warehouse Reserve", stockQty: 8400, value: 16800000, status: "Optimal" },
  ];

  const shopeeReturnsAudit = [
    { returnId: "RET-SHP-001", sku: "1012514", productName: "Wireless Noise-Canceling Earbuds", orderId: "ORD-SHP-8990", returnReason: "Wrong size requested", itemCondition: "Unopened / Like New", actionTaken: "Restocked to Online Inventory", restockedBy: "Online Admin", date: "2026-08-28" },
    { returnId: "RET-SHP-002", sku: "123131", productName: "Pro Ergonomic Desk Chair", orderId: "ORD-SHP-8712", returnReason: "Customer changed mind", itemCondition: "Slight box damage", actionTaken: "Sent to Warehouse Inspection", restockedBy: "Online Admin", date: "2026-08-25" },
  ];

  const popupDiscrepancies = [
    { popupName: "Pop-up Store 1 (Mega Bangna)", systemQty: 320, auditedQty: 318, variance: -2, status: "Minor Variance", lastCount: "2026-08-29" },
    { popupName: "Pop-up Store 2 (Central Ladprao)", systemQty: 280, auditedQty: 280, variance: 0, status: "Verified", lastCount: "2026-08-30" },
    { popupName: "Pop-up Store 3 (Central Embassy)", systemQty: 410, auditedQty: 405, variance: -5, status: "Under Review", lastCount: "2026-08-28" },
    { popupName: "Pop-up Store 4 (EmQuartier)", systemQty: 350, auditedQty: 350, variance: 0, status: "Verified", lastCount: "2026-08-30" },
    { popupName: "Pop-up Store 5 (Silom Complex)", systemQty: 290, auditedQty: 289, variance: -1, status: "Verified", lastCount: "2026-08-29" },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Reporting Services & SQL View Analytics</h1>
          <div className="sub">
            Executive report insights for Akkara Bangkok Management & Department Heads
          </div>
        </div>
      </div>

      <div className="board-toolbar" style={{ marginBottom: 24 }}>
        <div className="view-mode-tabs">
          <button
            className={`tab-btn ${activeReport === "channel" ? "active" : ""}`}
            onClick={() => setActiveReport("channel")}
          >
            📊 Omnichannel Stock Summary
          </button>
          <button
            className={`tab-btn ${activeReport === "shopee_returns" ? "active" : ""}`}
            onClick={() => setActiveReport("shopee_returns")}
          >
            🛍️ Shopee Returns Audit
          </button>
          <button
            className={`tab-btn ${activeReport === "popup_variance" ? "active" : ""}`}
            onClick={() => setActiveReport("popup_variance")}
          >
            🏪 10 Pop-ups Variance Log
          </button>
        </div>
      </div>

      {activeReport === "channel" && (
        <div>
          <div className="stats">
            <div className="stat">
              <div className="stat-label">Total Multi-Channel Stock</div>
              <div className="stat-value">18,900 Units</div>
            </div>
            <div className="stat">
              <div className="stat-label">Total Stock Valuation</div>
              <div className="stat-value">฿37,800,000</div>
            </div>
            <div className="stat">
              <div className="stat-label">Active Channel Nodes</div>
              <div className="stat-value">15 Nodes</div>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Sales Channel Category</th>
                  <th>Total Stock Qty</th>
                  <th>Estimated Valuation</th>
                  <th>Data Integrity Status</th>
                </tr>
              </thead>
              <tbody>
                {channelStockSummary.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{item.channel}</td>
                    <td style={{ fontWeight: 700 }}>{item.stockQty.toLocaleString()} units</td>
                    <td className="mono">฿{item.value.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${item.status === "Synced" || item.status === "Normal" || item.status === "Optimal" ? "badge-green" : "badge-amber"}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeReport === "shopee_returns" && (
        <div>
          <div className="card">
            <h3>Shopee Return Restocking Audit Log</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Prevents stock discrepancies by verifying Shopee return records against physical inventory.
            </p>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Return Ref</th>
                    <th>Product & SKU</th>
                    <th>Shopee Order</th>
                    <th>Return Reason</th>
                    <th>Condition</th>
                    <th>Action Taken</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {shopeeReturnsAudit.map((r) => (
                    <tr key={r.returnId}>
                      <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                        {r.returnId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{r.productName}</div>
                        <div className="mono muted" style={{ fontSize: 12 }}>SKU: {r.sku}</div>
                      </td>
                      <td className="mono">{r.orderId}</td>
                      <td>{r.returnReason}</td>
                      <td>
                        <span className="badge badge-amber">{r.itemCondition}</span>
                      </td>
                      <td>
                        <span className="badge badge-green">{r.actionTaken}</span>
                      </td>
                      <td className="muted">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeReport === "popup_variance" && (
        <div>
          <div className="card">
            <h3>10 Pop-up Stores Stock Audit & Excel Discrepancy Elimination</h3>
            <p className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
              Compares system inventory against app-submitted stock checks by Akkara Bangkok sales staff.
            </p>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Pop-up Store</th>
                    <th>System Expected Qty</th>
                    <th>Staff Audited Qty</th>
                    <th>Variance (Delta)</th>
                    <th>Audit Status</th>
                    <th>Last Check Date</th>
                  </tr>
                </thead>
                <tbody>
                  {popupDiscrepancies.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700 }}>{p.popupName}</td>
                      <td style={{ fontWeight: 600 }}>{p.systemQty} units</td>
                      <td style={{ fontWeight: 600 }}>{p.auditedQty} units</td>
                      <td>
                        {p.variance === 0 ? (
                          <span className="badge badge-green">0 (Exact)</span>
                        ) : (
                          <span className="badge badge-red">{p.variance} units</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${p.status === "Verified" ? "badge-green" : "badge-amber"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="muted">{p.lastCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
