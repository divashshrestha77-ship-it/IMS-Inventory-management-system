import { useEffect, useState } from "react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../api/inventoryApi";
import type { StockLocation } from "../types/inventory";

const LOCATION_TYPES = [
  { value: "warehouse", label: "🏢 Warehouse" },
  { value: "store", label: "🏬 Retail Store" },
  { value: "shop", label: "🛍️ Shop" },
  { value: "godown", label: "🏭 Godown" },
  { value: "virtual", label: "☁️ Virtual Channel" },
  { value: "shelf", label: "📐 Shelf" },
  { value: "rack", label: "📦 Rack" },
  { value: "bin", label: "🗑️ Bin" },
  { value: "cold_storage", label: "❄️ Cold Storage" },
  { value: "showroom", label: "✨ Showroom" },
];

export default function StockLocationsPage() {
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal / Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<StockLocation | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    location_type: "warehouse",
    phone: "",
    description: "",
    is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadLocations = async () => {
    setLoading(true);
    try {
      const data = await getLocations();
      setLocations(data || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch stock locations from live API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      location_type: "warehouse",
      phone: "",
      description: "",
      is_active: true,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    setSubmitting(true);
    try {
      const created = await createLocation({
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        location_type: formData.location_type,
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        is_active: formData.is_active,
      });

      setLocations((prev) => [created, ...prev]);
      setIsAddOpen(false);
      resetForm();
      showToast(`Location "${created.name}" (${created.code}) created successfully!`);
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to create location", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation || !formData.name.trim() || !formData.code.trim()) return;

    setSubmitting(true);
    try {
      const updated = await updateLocation(editingLocation.id, {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        location_type: formData.location_type,
        phone: formData.phone.trim(),
        description: formData.description.trim(),
        is_active: formData.is_active,
      });

      setLocations((prev) =>
        prev.map((loc) => (loc.id === editingLocation.id ? { ...loc, ...updated } : loc))
      );
      setEditingLocation(null);
      resetForm();
      showToast(`Location "${updated.name}" updated successfully!`);
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to update location", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setSubmitting(true);
    try {
      await deleteLocation(deleteId);
      setLocations((prev) => prev.filter((l) => l.id !== deleteId));
      showToast("Stock location deleted successfully!");
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to delete stock location", "error");
    } finally {
      setSubmitting(false);
      setDeleteId(null);
    }
  };

  const openEditModal = (loc: StockLocation) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name,
      code: loc.code,
      location_type: loc.location_type || "warehouse",
      phone: loc.phone || "",
      description: loc.description || "",
      is_active: loc.is_active ?? true,
    });
  };

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      (l.location_type && l.location_type.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = locations.filter((l) => l.is_active).length;
  const warehouseCount = locations.filter((l) => l.location_type === "warehouse").length;
  const storeCount = locations.filter(
    (l) => l.location_type === "store" || l.location_type === "shop" || l.location_type === "showroom"
  ).length;

  return (
    <div className="stock-locations-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Stock Locations & Warehouses</h1>
          <div className="sub">
            Manage physical warehouses, retail stores, godowns, and inventory nodes connected to live backend API
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="btn btn-secondary" onClick={loadLocations}>
            🔄 Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
          >
            ➕ Add Location
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Stock Nodes</div>
          <div className="stat-value">{locations.length} Locations</div>
        </div>
        <div className="stat">
          <div className="stat-label">Active Nodes</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {activeCount} Active
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Warehouses / Hubs</div>
          <div className="stat-value">{warehouseCount} Warehouses</div>
        </div>
        <div className="stat">
          <div className="stat-label">Stores & Showrooms</div>
          <div className="stat-value">{storeCount} Outlets</div>
        </div>
      </div>

      {/* Toolbar: Search & View Toggle */}
      <div className="board-toolbar mb4">
        <div className="search-bar" style={{ width: "320px" }}>
          <span className="search-ico">🔍</span>
          <input
            type="text"
            placeholder="Search code, location name, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="view-mode-tabs">
          <button
            className={`tab-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            🌁 Grid Cards
          </button>
          <button
            className={`tab-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            📋 Data Table
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card text-center py8">
          <div className="spinner mb2" />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            Fetching Stock Locations from Live Backend API...
          </p>
        </div>
      ) : filteredLocations.length === 0 ? (
        <div className="card text-center py8">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📍</div>
          <h3>No stock locations found</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            {search ? `No locations matching "${search}"` : "Create your first stock location node to begin tracking inventory!"}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
          >
            ➕ Add Location Node
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="stock-cards-grid">
          {filteredLocations.map((loc) => (
            <div key={loc.id} className="location-stock-card">
              <div>
                <div className="location-card-header">
                  <span className="sku-code">{loc.code}</span>
                  <span className={`badge ${loc.is_active ? "badge-green" : "badge-gray"}`}>
                    {loc.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 800, marginTop: "8px", marginBottom: "4px" }}>
                  📍 {loc.name}
                </h3>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>
                  Type: <strong style={{ textTransform: "capitalize" }}>{loc.location_type || "Warehouse"}</strong>
                  {loc.phone && ` • 📞 ${loc.phone}`}
                </div>
                {loc.description && (
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 16px" }}>
                    {loc.description}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", borderTop: "1px dashed var(--border)", paddingTop: "12px" }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEditModal(loc)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setDeleteId(loc.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Code</th>
                <th>Location Name</th>
                <th>Type</th>
                <th>Phone</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((loc) => (
                <tr key={loc.id}>
                  <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                    {loc.code}
                  </td>
                  <td style={{ fontWeight: 700, fontSize: "15px" }}>
                    📍 {loc.name}
                  </td>
                  <td>
                    <span className="badge badge-blue" style={{ textTransform: "capitalize" }}>
                      {loc.location_type || "Warehouse"}
                    </span>
                  </td>
                  <td className="muted">{loc.phone || "—"}</td>
                  <td className="muted">{loc.description || "—"}</td>
                  <td>
                    <span className={`badge ${loc.is_active ? "badge-green" : "badge-gray"}`}>
                      {loc.is_active ? "Active Node" : "Disabled"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button className="btn btn-secondary btn-xs" onClick={() => openEditModal(loc)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-xs" onClick={() => setDeleteId(loc.id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE LOCATION MODAL */}
      {isAddOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>📍 Add New Stock Location</h3>
              <button className="modal-close" onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Location Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangkok Warehouse, Central Store"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Location Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. WH-01, STR-BKK"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location Type</label>
                    <select
                      value={formData.location_type}
                      onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                    >
                      {LOCATION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +66 2 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      placeholder="Additional details about this stock location node..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group full">
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <span>Active Location Node</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Creating..." : "Save Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LOCATION MODAL */}
      {editingLocation && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>✏️ Edit Stock Location</h3>
              <button className="modal-close" onClick={() => setEditingLocation(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Location Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location Type</label>
                    <select
                      value={formData.location_type}
                      onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                    >
                      {LOCATION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group full">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group full">
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <span>Active Location Node</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingLocation(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId !== null && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3 style={{ color: "var(--danger)" }}>⚠️ Delete Stock Location</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text)" }}>
                Are you sure you want to delete stock location node <strong>#{deleteId}</strong>?
                This action will send a request to your live backend API.
              </p>
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ background: "var(--danger)", color: "#fff" }}
                onClick={confirmDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Yes, Delete Location"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
