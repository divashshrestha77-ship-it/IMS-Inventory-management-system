import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getProducts, deleteProduct } from "../api/productApi";
import type { Product } from "../types/product";

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setProducts((c) => c.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const value = search.toLowerCase();
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(value) ||
      p.slug.toLowerCase().includes(value)
  );

  const totalValue = products.reduce((s, p) => s + Number(p.selling_price || 0), 0);
  const totalStock = products.reduce((s, p) => s + Number(p.quantity || 0), 0);
  const activeCount = products.filter((p) => p.is_active).length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <div className="sub">Manage your product catalog</div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/products/add")}>
          + Add Product
        </button>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{products.length}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Active</div>
          <div className="stat-value">{activeCount}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Stock Qty</div>
          <div className="stat-value">{totalStock}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Stock Value</div>
          <div className="stat-value">Rs. {totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-secondary btn-sm" onClick={loadProducts}>
            Refresh
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading products...
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Unit</th>
                  <th>Qty</th>
                  <th>Selling Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {p.slug}
                      </div>
                    </td>
                    <td>{p.category_name}</td>
                    <td>{p.unit_name}</td>
                    <td>{p.quantity}</td>
                    <td>Rs. {Number(p.selling_price || 0).toLocaleString()}</td>
                    <td>
                      {p.is_active ? (
                        <span className="badge badge-green">Active</span>
                      ) : (
                        <span className="badge badge-gray">Inactive</span>
                      )}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-link btn-sm"
                        onClick={() => navigate(`/products/${p.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="btn btn-link btn-sm"
                        onClick={() => navigate(`/products/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-link-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="table-empty">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
