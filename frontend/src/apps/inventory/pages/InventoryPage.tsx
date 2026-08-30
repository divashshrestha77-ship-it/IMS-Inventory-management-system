import { useEffect, useState } from "react";
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getLocations,
} from "../api/inventoryApi";
import { getProducts } from "../../products/api/productApi";
import type { Inventory, StockLocation } from "../types/inventory";
import type { Product } from "../../products/types/product";

export default function InventoryPage() {
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<StockLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("ALL");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    product: "",
    location: "",
    quantity: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [invData, prodsData, locsData] = await Promise.all([
        getInventory().catch(() => []),
        getProducts().catch(() => []),
        getLocations().catch(() => []),
      ]);
      setInventoryList(invData || []);
      setProducts(prodsData || []);
      setLocations(locsData || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load inventory data from live API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product || !formData.location) return;

    setSubmitting(true);
    try {
      const created = await createInventory({
        product: Number(formData.product),
        location: Number(formData.location),
        quantity: Number(formData.quantity),
      });

      showToast("Inventory record added successfully!");
      setIsAddOpen(false);
      setFormData({ product: "", location: "", quantity: 0 });
      loadData();
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to add inventory record", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    try {
      await updateInventory(editingItem.id, {
        quantity: Number(editQty),
      });

      showToast("Stock quantity updated successfully!");
      setEditingItem(null);
      loadData();
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to update inventory", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setSubmitting(true);
    try {
      await deleteInventory(deleteId);
      setInventoryList((prev) => prev.filter((i) => i.id !== deleteId));
      showToast("Inventory record deleted successfully!");
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to delete inventory record", "error");
    } finally {
      setSubmitting(false);
      setDeleteId(null);
    }
  };

  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      (item.product_name && item.product_name.toLowerCase().includes(search.toLowerCase())) ||
      (item.location_name && item.location_name.toLowerCase().includes(search.toLowerCase())) ||
      String(item.product).includes(search);

    const matchesLoc =
      selectedLocationFilter === "ALL" || String(item.location) === selectedLocationFilter;

    return matchesSearch && matchesLoc;
  });

  const totalQuantity = inventoryList.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);
  const lowStockCount = inventoryList.filter((item) => Number(item.quantity) < 10).length;

  return (
    <div className="inventory-page">
      {/* Toast Banner */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div>
          <h1>Stock Overview & Inventory Levels</h1>
          <div className="sub">
            Real-time stock tracking across physical warehouses, stores, and channels
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="btn btn-secondary" onClick={loadData}>
            🔄 Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            ➕ Add Stock Allocation
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Inventory Entries</div>
          <div className="stat-value">{inventoryList.length} Records</div>
        </div>
        <div className="stat">
          <div className="stat-label">Total Stock Quantity</div>
          <div className="stat-value">{totalQuantity.toLocaleString()} Units</div>
        </div>
        <div className="stat">
          <div className="stat-label">Stock Nodes</div>
          <div className="stat-value">{locations.length} Locations</div>
        </div>
        <div className="stat">
          <div className="stat-label">Low Stock Alerts</div>
          <div className={`stat-value ${lowStockCount > 0 ? "text-danger" : ""}`}>
            {lowStockCount} Items
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Location Filter */}
      <div className="board-toolbar mb4">
        <div className="search-bar" style={{ width: "320px" }}>
          <span className="search-ico">🔍</span>
          <input
            type="text"
            placeholder="Search product or location name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)" }}>
            Filter Location:
          </span>
          <select
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border)" }}
            value={selectedLocationFilter}
            onChange={(e) => setSelectedLocationFilter(e.target.value)}
          >
            <option value="ALL">All Stock Nodes</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card text-center py8">
          <div className="spinner mb2" />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            Fetching inventory levels from live backend API...
          </p>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="card text-center py8">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏢</div>
          <h3>No inventory records found</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            {search ? `No stock items matching "${search}"` : "Add your first stock allocation to begin tracking inventory levels!"}
          </p>
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            ➕ Add Stock Allocation
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Location Node</th>
                <th>Current Stock Quantity</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const qty = Number(item.quantity || 0);
                return (
                  <tr key={item.id}>
                    <td className="mono" style={{ fontWeight: 700 }}>
                      #{item.id}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: "15px" }}>
                      📦 {item.product_name || `Product #${item.product}`}
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        📍 {item.location_name || `Location #${item.location}`}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          qty > 20 ? "badge-green" : qty > 0 ? "badge-amber" : "badge-red"
                        }`}
                        style={{ fontSize: "14px", fontWeight: 800 }}
                      >
                        {qty} units
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {item.updated_at ? new Date(item.updated_at).toLocaleString() : "N/A"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => {
                            setEditingItem(item);
                            setEditQty(qty);
                          }}
                        >
                          ✏️ Update Qty
                        </button>
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => setDeleteId(item.id)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE INVENTORY MODAL */}
      {isAddOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>📦 Add Stock Allocation</h3>
              <button className="modal-close" onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group full">
                    <label>Select Product *</label>
                    <select
                      value={formData.product}
                      onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (SKU: {p.slug || p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Select Stock Location Node *</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Location Node --</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} ({loc.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Stock Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT QUANTITY MODAL */}
      {editingItem && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>✏️ Update Stock Quantity</h3>
              <button className="modal-close" onClick={() => setEditingItem(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <p style={{ margin: "0 0 16px 0", color: "var(--text-muted)", fontSize: "14px" }}>
                  Product: <strong>{editingItem.product_name || `#${editingItem.product}`}</strong>
                  <br />
                  Location: <strong>{editingItem.location_name || `#${editingItem.location}`}</strong>
                </p>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={editQty}
                    onChange={(e) => setEditQty(Number(e.target.value))}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Quantity"}
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
              <h3 style={{ color: "var(--danger)" }}>⚠️ Remove Stock Record</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text)" }}>
                Are you sure you want to remove this stock inventory record <strong>#{deleteId}</strong>?
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
                {submitting ? "Removing..." : "Yes, Remove Record"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
