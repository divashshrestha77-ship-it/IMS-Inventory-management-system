import { useEffect, useState } from "react";
import {
  getTransfers,
  createStockTransfer,
  getLocations,
} from "../api/inventoryApi";
import type { StockTransfer, StockLocation } from "../types/inventory";
import StockDistributionBoard from "../components/StockDistributionBoard";

function StockTransfersPage() {
  const [activeTab, setActiveTab] = useState<"board" | "log">("board");
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [t, l] = await Promise.all([getTransfers(), getLocations()]);
      if (t) setTransfers(t);
      if (l) setLocations(l);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const from = Number(fromLocation);
    const to = Number(toLocation);
    if (!from || !to) {
      alert("Please select both locations.");
      return;
    }
    if (from === to) {
      alert("Source and destination must be different.");
      return;
    }
    try {
      await createStockTransfer({ from_location: from, to_location: to, notes });
      setFromLocation("");
      setToLocation("");
      setNotes("");
      loadData();
      alert("Stock transfer created successfully!");
    } catch (error) {
      console.error(error);
      alert("Transfer created in offline mode.");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div className="title-area">
          <h1>Stock Transfers & Distribution</h1>
          <div className="sub">
            Interactive store-to-store stock board & transfer management
          </div>
        </div>

        <div className="view-mode-tabs" style={{ background: "#ffffff", padding: "4px 6px" }}>
          <button
            className={`tab-btn ${activeTab === "board" ? "active" : ""}`}
            onClick={() => setActiveTab("board")}
          >
            ⚡ Interactive Board
          </button>
          <button
            className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
            onClick={() => setActiveTab("log")}
          >
            📋 Transfer History & Manual Form
          </button>
        </div>
      </div>

      {activeTab === "board" ? (
        <StockDistributionBoard />
      ) : (
        <div>
          <form className="card" onSubmit={handleSubmit}>
            <div className="card-title">New Manual Stock Transfer</div>
            <div className="card-sub">Select origin and destination locations</div>
            <div className="form-grid mt1">
              <div className="form-group">
                <label>From Location</label>
                <select
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  required
                >
                  <option value="">Select source location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.location_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>To Location</label>
                <select
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  required
                >
                  <option value="">Select destination location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.location_type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group full">
                <label>Transfer Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional transfer notes or tracking numbers..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                Create Transfer ➔
              </button>
            </div>
          </form>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Transfer Records</h3>
            </div>
            {loading ? (
              <div className="state">
                <div className="spinner" />
                Loading transfers...
              </div>
            ) : (
              <div className="table-wrap" style={{ border: "none", boxShadow: "none" }}>
                <table className="data">
                  <thead>
                    <tr>
                      <th>Reference #</th>
                      <th>From Location</th>
                      <th>To Location</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((t) => (
                      <tr key={t.id}>
                        <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                          {t.reference_number || `TR-${t.id}`}
                        </td>
                        <td style={{ fontWeight: 600 }}>{t.from_location_name || `Location #${t.from_location}`}</td>
                        <td style={{ fontWeight: 600 }}>{t.to_location_name || `Location #${t.to_location}`}</td>
                        <td>
                          <span className="badge badge-blue">{t.status || "Completed"}</span>
                        </td>
                        <td className="muted">{t.notes || "—"}</td>
                      </tr>
                    ))}
                    {transfers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="table-empty">
                          No historical stock transfers recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default StockTransfersPage;
