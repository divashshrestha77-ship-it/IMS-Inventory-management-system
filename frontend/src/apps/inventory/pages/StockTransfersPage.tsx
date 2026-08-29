import { useEffect, useState } from "react";
import {
  getTransfers,
  createStockTransfer,
  getLocations,
} from "../api/inventoryApi";
import type { StockTransfer, StockLocation } from "../types/inventory";

function StockTransfersPage() {
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [t, l] = await Promise.all([getTransfers(), getLocations()]);
      setTransfers(t);
      setLocations(l);
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
    } catch (error) {
      console.error(error);
      alert("Failed to create stock transfer.");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Transfers</h1>
          <div className="sub">Move stock between locations</div>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="card-title">New Transfer</div>
        <div className="form-grid mt1">
          <div className="form-group">
            <label>From Location</label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              required
            >
              <option value="">Select source</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
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
              <option value="">Select destination</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group full">
            <label>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Transfer details..."
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Create Transfer
          </button>
        </div>
      </form>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading transfers...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Reference</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((t) => (
                <tr key={t.id}>
                  <td className="mono">{t.reference_number}</td>
                  <td>{t.from_location_name}</td>
                  <td>{t.to_location_name}</td>
                  <td>
                    <span className="badge badge-blue">{t.status}</span>
                  </td>
                  <td className="muted">{t.notes || "-"}</td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No stock transfers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default StockTransfersPage;
