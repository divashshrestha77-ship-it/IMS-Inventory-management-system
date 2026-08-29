import { useEffect, useState } from "react";
import { getLocations } from "../api/inventoryApi";
import type { StockLocation } from "../types/inventory";

function StockLocationsPage() {
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocations()
      .then(setLocations)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const types = new Set(locations.map((l) => l.location_type)).size;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Locations</h1>
          <div className="sub">Warehouses, stores and bins</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Locations</div>
          <div className="stat-value">{locations.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Types</div>
          <div className="stat-value">{types}</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading locations...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((l) => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 600 }}>{l.name}</td>
                  <td className="mono">{l.code}</td>
                  <td>{l.location_type}</td>
                  <td className="muted">{l.description || "-"}</td>
                  <td>
                    {l.is_active ? (
                      <span className="badge badge-green">Active</span>
                    ) : (
                      <span className="badge badge-gray">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty">
                    No stock locations found.
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

export default StockLocationsPage;
