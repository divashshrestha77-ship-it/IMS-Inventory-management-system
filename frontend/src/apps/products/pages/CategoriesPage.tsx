import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import { getProducts } from "../api/productApi";
import type { Category, Product } from "../types/product";

// Color palette generator for category badges
const CATEGORY_COLORS = [
  { bg: "rgba(99, 102, 241, 0.1)", text: "#4f46e5", border: "rgba(99, 102, 241, 0.3)", icon: "🏷️" },
  { bg: "rgba(16, 185, 129, 0.1)", text: "#059669", border: "rgba(16, 185, 129, 0.3)", icon: "📦" },
  { bg: "rgba(245, 158, 11, 0.1)", text: "#d97706", border: "rgba(245, 158, 11, 0.3)", icon: "✨" },
  { bg: "rgba(236, 72, 153, 0.1)", text: "#db2777", border: "rgba(236, 72, 153, 0.3)", icon: "🛍️" },
  { bg: "rgba(14, 165, 233, 0.1)", text: "#0284c7", border: "rgba(14, 165, 233, 0.3)", icon: "⚡" },
  { bg: "rgba(168, 85, 247, 0.1)", text: "#9333ea", border: "rgba(168, 85, 247, 0.3)", icon: "🎨" },
];

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal / Form States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Submitting States
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [catsData, prodsData] = await Promise.all([
        getCategories(),
        getProducts().catch(() => []),
      ]);
      setCategories(catsData || []);
      setProducts(prodsData || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to load categories from live API", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSubmitting(true);
    try {
      const created = await createCategory({ name: newCatName.trim() });
      setCategories((prev) => [created, ...prev]);
      setNewCatName("");
      setIsAddOpen(false);
      showToast(`Category "${created.name}" added successfully!`);
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to create category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateCategory(editingCategory.id, { name: editName.trim() });
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, ...updated, name: editName.trim() } : c))
      );
      setEditingCategory(null);
      setEditName("");
      showToast("Category updated successfully!");
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to update category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    setSubmitting(true);
    try {
      await deleteCategory(deleteId);
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      showToast("Category deleted successfully!");
    } catch (error: any) {
      console.error(error);
      showToast(error?.message || "Failed to delete category", "error");
    } finally {
      setSubmitting(false);
      setDeleteId(null);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const getProductCountForCat = (catId: number) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <div className="categories-app-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-banner ${toast.type}`}>
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div className="title-area">
          <h1>Product Categories</h1>
          <div className="sub">
            Organize & manage your product catalog taxonomy seamlessly connected to live API
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={loadData}
            title="Refresh from Live API"
          >
            🔄 Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setIsAddOpen(true)}
          >
            ➕ Add New Category
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats">
        <div className="stat">
          <div className="stat-label">
            <span>Total Categories</span>
            <span style={{ fontSize: "18px" }}>🏷️</span>
          </div>
          <div className="stat-value">{categories.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <span>Categorized Products</span>
            <span style={{ fontSize: "18px" }}>📦</span>
          </div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <span>Live Sync Status</span>
            <span style={{ fontSize: "18px" }}>🟢</span>
          </div>
          <div className="stat-value" style={{ fontSize: "16px", color: "var(--success)" }}>
            Render API Online
          </div>
        </div>
      </div>

      {/* Toolbar: Search & View Toggle */}
      <div className="board-toolbar mb4">
        <div className="search-bar" style={{ width: "320px" }}>
          <span className="search-ico">🔍</span>
          <input
            type="text"
            placeholder="Search category name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="view-mode-tabs">
          <button
            className={`tab-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            🌁 Grid View
          </button>
          <button
            className={`tab-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            📋 Table View
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="card text-center py8">
          <div className="spinner mb2" />
          <p style={{ color: "var(--text-muted)", fontWeight: 600 }}>
            Fetching Categories from live Render API...
          </p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="card text-center py8">
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏷️</div>
          <h3>No categories found</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            {search ? `No categories matching "${search}"` : "Get started by adding your first product category!"}
          </p>
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            ➕ Create Category
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="category-cards-grid">
          {filteredCategories.map((cat, idx) => {
            const styleTheme = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const prodCount = getProductCountForCat(cat.id);

            return (
              <div key={cat.id} className="category-card">
                <div className="cat-card-header">
                  <div
                    className="cat-icon-avatar"
                    style={{ background: styleTheme.bg, color: styleTheme.text, borderColor: styleTheme.border }}
                  >
                    {styleTheme.icon}
                  </div>
                  <span className="badge badge-gray">ID: #{cat.id}</span>
                </div>

                <div className="cat-card-body">
                  <h3 className="cat-title">{cat.name}</h3>
                  <div className="cat-meta">
                    <span className="badge badge-blue">
                      📦 {prodCount} {prodCount === 1 ? "Product" : "Products"}
                    </span>
                    {cat.created_at && (
                      <span className="cat-date">
                        Added {new Date(cat.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="cat-card-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingCategory(cat);
                      setEditName(cat.name);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteId(cat.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Linked Products</th>
                <th>Created At</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => {
                const prodCount = getProductCountForCat(cat.id);
                return (
                  <tr key={cat.id}>
                    <td className="mono" style={{ fontWeight: 700 }}>
                      #{cat.id}
                    </td>
                    <td style={{ fontWeight: 700, fontSize: "15px" }}>
                      🏷️ {cat.name}
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {prodCount} Products
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                      {cat.created_at
                        ? new Date(cat.created_at).toLocaleString()
                        : "N/A"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => {
                            setEditingCategory(cat);
                            setEditName(cat.name);
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-xs"
                          onClick={() => setDeleteId(cat.id)}
                        >
                          🗑️ Delete
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

      {/* CREATE CATEGORY MODAL */}
      {isAddOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>➕ Create New Category</h3>
              <button className="modal-close" onClick={() => setIsAddOpen(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Apparel, Electronics, Beverages..."
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-foot">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-head">
              <h3>✏️ Edit Category</h3>
              <button className="modal-close" onClick={() => setEditingCategory(null)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-foot">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? "Updating..." : "Save Changes"}
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
              <h3 style={{ color: "var(--danger)" }}>⚠️ Delete Category</h3>
              <button className="modal-close" onClick={() => setDeleteId(null)}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: "14px", color: "var(--text)" }}>
                Are you sure you want to delete category <strong>#{deleteId}</strong>?
                This action will send a request to your live backend API and cannot be undone.
              </p>
            </div>
            <div className="modal-foot">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ background: "var(--danger)", color: "#fff" }}
                onClick={confirmDelete}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Yes, Delete Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
