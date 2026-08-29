import { useEffect, useState } from "react";
import type { Product, ProductInput, Category, Unit } from "../types/product";
import { getCategories } from "../api/categoryApi";
import { getUnits } from "../api/unitApi";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductInput) => void;
  submitText: string;
  onCancel?: () => void;
}

function ProductForm({
  initialData,
  onSubmit,
  submitText,
  onCancel,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

  const [form, setForm] = useState<ProductInput>({
    name: initialData?.name ?? "",
    category: initialData?.category ?? 0,
    unit: initialData?.unit ?? 0,
    quantity: initialData?.quantity ?? 1,
    cost_price: initialData?.cost_price ?? 0,
    discount_percentage: initialData?.discount_percentage ?? 0,
    description: initialData?.description ?? "",
    is_active: initialData?.is_active ?? true,
  });

  useEffect(() => {
    Promise.all([getCategories(), getUnits()])
      .then(([c, u]) => {
        setCategories(c);
        setUnits(u);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "category" || name === "unit"
          ? Number(value)
          : ["quantity", "cost_price", "discount_percentage"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Cotton T-Shirt"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={form.category || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select
            name="unit"
            value={form.unit || ""}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select unit
            </option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cost Price (Rs.)</label>
          <input
            type="number"
            name="cost_price"
            min="0"
            step="0.01"
            value={form.cost_price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Discount %</label>
          <input
            type="number"
            name="discount_percentage"
            min="0"
            max="100"
            step="0.01"
            value={form.discount_percentage}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full">
          <label>Description</label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="Product details..."
          />
        </div>

        <div className="form-group">
          <label className="form-check">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active product
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitText}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
