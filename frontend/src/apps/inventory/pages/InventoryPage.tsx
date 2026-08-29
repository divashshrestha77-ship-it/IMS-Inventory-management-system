import { useEffect, useState } from "react";
import { getInventory } from "../api/inventoryApi";
import type { Inventory } from "../types/inventory";

function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInventory()
      .then(setInventory)
      .catch((err) => {
        console.error(err);
        setError("Failed to load inventory.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalStock = inventory.reduce((s, i) => s + Number(i.quantity || 0), 0);
  const locations = new Set(inventory.map((i) => i.location_name)).size;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Inventory</h1>
          <div className="sub">Current stock levels by location</div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Stock Entries</div>
          <div className="stat-value">{inventory.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Quantity</div>
          <div className="stat-value">{totalStock}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Locations</div>
          <div className="stat-value">{locations}</div>
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading inventory...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Location</th>
                <th style={{ textAlign: "right" }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="mono">{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td>{item.location_name}</td>
                  <td style={{ textAlign: "right" }}>
                    <span className="badge badge-blue">{item.quantity}</span>
                  </td>
                </tr>
              ))}
              {inventory.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-empty">
                    No inventory found.
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

export default InventoryPage;
