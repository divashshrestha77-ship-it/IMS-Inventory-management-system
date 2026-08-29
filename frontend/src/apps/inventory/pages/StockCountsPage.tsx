import { useEffect, useState } from "react";
import {
  getStockCounts,
  createStockCount,
  getLocations,
} from "../api/inventoryApi";
import type { StockCount, StockLocation } from "../types/inventory";

function StockCountsPage() {
  const [counts, setCounts] = useState<StockCount[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [c, l] = await Promise.all([getStockCounts(), getLocations()]);
      setCounts(c);
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please select a location.");
      return;
    }
    try {
      await createStockCount({ location: Number(location), notes });
      setLocation("");
      setNotes("");
      loadData();
    } catch (error) {
      console.error(error);
      alert("Unable to create stock count.");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Counts</h1>
          <div className="sub">Record and verify physical stock quantities</div>
        </div>
      </div>

      <form className="card" onSubmit={handleCreate}>
        <div className="card-title">Start Stock Count</div>
        <div className="form-grid mt1">
          <div className="form-group">
            <label>Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="">Select location</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes..."
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Start Stock Count
          </button>
        </div>
      </form>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading stock counts...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>Status</th>
                <th>Counted By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {counts.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td>{c.location_name}</td>
                  <td>
                    <span className="badge badge-amber">{c.status}</span>
                  </td>
                  <td className="muted">{c.counted_by_name || "-"}</td>
                  <td className="muted">{c.notes || "-"}</td>
                </tr>
              ))}
              {counts.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No stock counts found.
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

export default StockCountsPage;
