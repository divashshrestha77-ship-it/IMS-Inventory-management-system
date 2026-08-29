import { useEffect, useState } from "react";
import { getMovements } from "../api/inventoryApi";
import type { StockMovement } from "../types/inventory";

const typeBadge: Record<string, string> = {
  IN: "badge-green",
  OUT: "badge-red",
  TRANSFER: "badge-blue",
  ADJUSTMENT: "badge-amber",
};

function StockMovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMovements()
      .then(setMovements)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Movements</h1>
          <div className="sub">Every stock in/out/transfer activity</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading movements...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Location</th>
                <th>Movement</th>
                <th style={{ textAlign: "right" }}>Qty</th>
                <th>Reference</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 600 }}>{m.product_name}</td>
                  <td className="muted">{m.variant_name || "-"}</td>
                  <td>{m.location_name}</td>
                  <td>
                    <span className={`badge ${typeBadge[m.movement_type] || "badge-gray"}`}>
                      {m.movement_type}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>{m.quantity_change}</td>
                  <td className="muted">{m.reference_type || "-"}</td>
                  <td className="muted">
                    {new Date(m.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={7} className="table-empty">
                    No stock movements found.
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

export default StockMovementsPage;
