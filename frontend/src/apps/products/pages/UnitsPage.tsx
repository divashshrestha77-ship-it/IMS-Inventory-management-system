import { useEffect, useState } from "react";
import { getUnits, createUnit, deleteUnit } from "../api/unitApi";
import type { Unit } from "../types/product";

function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUnits = async () => {
    try {
      const data = await getUnits();
      setUnits(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createUnit({ name, is_active: true });
      setName("");
      loadUnits();
    } catch (error) {
      console.error(error);
      alert("Failed to create unit.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this unit?")) return;
    try {
      await deleteUnit(id);
      setUnits((c) => c.filter((x) => x.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Units</h1>
          <div className="sub">Units of measurement for products</div>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="card-title">Create Unit</div>
        <div className="form-grid mt1">
          <div className="form-group">
            <label>Unit Name</label>
            <input
              placeholder="e.g. Piece"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Add Unit
          </button>
        </div>
      </form>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Unit</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id}>
                  <td className="mono">{u.id}</td>
                  <td>{u.name}</td>
                  <td>
                    {u.is_active ? (
                      <span className="badge badge-green">Active</span>
                    ) : (
                      <span className="badge badge-gray">Inactive</span>
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-link-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {units.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-empty">
                    No units found.
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

export default UnitsPage;
