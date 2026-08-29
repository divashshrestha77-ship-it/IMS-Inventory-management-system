import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "../api/categoryApi";
import type { Category } from "../types/product";

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ name });
      setName("");
      loadCategories();
    } catch (error) {
      console.error(error);
      alert("Failed to create category.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories((c) => c.filter((x) => x.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Categories</h1>
          <div className="sub">Organize products into categories</div>
        </div>
      </div>

      <form className="card" onSubmit={handleSubmit}>
        <div className="card-title">Create Category</div>
        <div className="form-grid mt1">
          <div className="form-group">
            <label>Category Name</label>
            <input
              placeholder="e.g. Apparel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit">
            Add Category
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
                <th>Name</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td>{c.name}</td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-link-danger btn-sm"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="table-empty">
                    No categories found.
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

export default CategoriesPage;
