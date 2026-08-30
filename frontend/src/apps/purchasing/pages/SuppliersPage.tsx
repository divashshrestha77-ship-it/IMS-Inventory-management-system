import { useEffect, useState } from "react";
import { getSuppliers } from "../api/purchasingApi";
import type { Supplier } from "../types/purchasing";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSuppliers()
      .then(setSuppliers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Suppliers & Fabric Vendors</h1>
          <div className="sub">Manage supplier directory & lead times</div>
        </div>
        <button className="btn btn-primary">+ Add Supplier</button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Vendors</div>
          <div className="stat-value">{suppliers.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Active Vendors</div>
          <div className="stat-value">{suppliers.filter((s) => s.is_active).length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Avg Lead Time</div>
          <div className="stat-value">5 Days</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading suppliers...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Code</th>
                <th>Supplier Name</th>
                <th>Contact Person</th>
                <th>Email / Phone</th>
                <th>Lead Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{s.code}</td>
                  <td style={{ fontWeight: 700 }}>{s.name}</td>
                  <td>{s.contact_person}</td>
                  <td>
                    <div>{s.email}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{s.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-amber">{s.lead_time_days} days</span>
                  </td>
                  <td>
                    {s.is_active ? (
                      <span className="badge badge-green">Active</span>
                    ) : (
                      <span className="badge badge-gray">Inactive</span>
                    )}
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
