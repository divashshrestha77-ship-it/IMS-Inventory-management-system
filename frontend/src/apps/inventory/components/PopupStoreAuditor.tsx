import React, { useState } from "react";

interface AuditLine {
  sku: string;
  name: string;
  systemQty: number;
  countedQty: number;
}

export function PopupStoreAuditor() {
  const [selectedPopup, setSelectedPopup] = useState<string>("Pop-up Store 1 (Mega Bangna)");
  const [auditLines, setAuditLines] = useState<AuditLine[]>([
    { sku: "1012514", name: "Wireless Noise-Canceling Earbuds", systemQty: 150, countedQty: 150 },
    { sku: "123131", name: "Pro Ergonomic Desk Chair", systemQty: 45, countedQty: 45 },
    { sku: "987654", name: "Mechanical RGB Gaming Keyboard", systemQty: 80, countedQty: 78 },
  ]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleQtyChange = (index: number, delta: number) => {
    setAuditLines((prev) => {
      const copy = [...prev];
      copy[index].countedQty = Math.max(0, copy[index].countedQty + delta);
      return copy;
    });
    setIsSubmitted(false);
  };

  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="card" style={{ marginTop: 24, border: "2px solid var(--primary-border)" }}>
      <div className="card-head">
        <div>
          <h3 className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>📱 10 Pop-up Stores Mobile Stock Checker</span>
            <span className="badge badge-blue">Replaces Excel Sheets</span>
          </h3>
          <div className="card-sub">
            Designed for Akkara Bangkok storefront & pop-up sales staff to instantly count physical stock
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmitAudit}>
        <div className="form-group" style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 14, fontWeight: 700 }}>Select Pop-up Location (10 Department Store Outlets)</label>
          <select
            value={selectedPopup}
            onChange={(e) => {
              setSelectedPopup(e.target.value);
              setIsSubmitted(false);
            }}
            style={{ fontWeight: 700, padding: 12, fontSize: 14 }}
          >
            {Array.from({ length: 10 }, (_, i) => `Pop-up Store ${i + 1} (${["Mega Bangna", "Central Ladprao", "Central Embassy", "EmQuartier", "Silom Complex", "Fashion Island", "Central Rama 9", "Siam Discovery", "Central Westgate", "IconSiam Pop-up"][i]})`).map(
              (name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              )
            )}
          </select>
        </div>

        <div className="table-wrap" style={{ marginBottom: 20 }}>
          <table className="data">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>System Stock</th>
                <th style={{ textAlign: "center" }}>Tap Counter (Audited Qty)</th>
                <th>Variance</th>
              </tr>
            </thead>
            <tbody>
              {auditLines.map((line, idx) => {
                const diff = line.countedQty - line.systemQty;
                return (
                  <tr key={line.sku}>
                    <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                      {line.sku}
                    </td>
                    <td style={{ fontWeight: 700 }}>{line.name}</td>
                    <td style={{ fontWeight: 600 }}>{line.systemQty} units</td>
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "var(--bg-muted)", padding: "4px 10px", borderRadius: 10 }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ width: 32, height: 32, padding: 0, fontWeight: 800, fontSize: 16 }}
                          onClick={() => handleQtyChange(idx, -1)}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 18, fontWeight: 800, minWidth: 40, textAlign: "center" }}>
                          {line.countedQty}
                        </span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ width: 32, height: 32, padding: 0, fontWeight: 800, fontSize: 16 }}
                          onClick={() => handleQtyChange(idx, 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      {diff === 0 ? (
                        <span className="badge badge-green">✓ Exact Match</span>
                      ) : (
                        <span className="badge badge-red">{diff > 0 ? `+${diff}` : diff} Discrepancy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="form-actions" style={{ justifyContent: "space-between", alignItems: "center" }}>
          {isSubmitted ? (
            <div className="badge badge-green" style={{ fontSize: 14, padding: "8px 16px" }}>
              ✓ Stock count submitted for {selectedPopup}! Real-time stock updated.
            </div>
          ) : (
            <div className="muted" style={{ fontSize: 13 }}>
              Staff submit updates system stock in near real-time without paper or Excel.
            </div>
          )}
          <button type="submit" className="btn btn-primary">
            Submit Physical Audit ➔
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopupStoreAuditor;
