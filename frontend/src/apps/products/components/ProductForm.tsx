import { useEffect, useState } from "react";
import type {
  Product,
  ProductInput,
  ProductVariantInput,
  Category,
  Unit,
} from "../types/product";
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

  const [variants, setVariants] = useState<ProductVariantInput[]>(
    initialData?.variants?.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      barcode: v.barcode ?? "",
      selling_price: v.selling_price,
      cost_price: v.cost_price,
      is_active: v.is_active ?? true,
    })) ?? []
  );

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

  const handleAddVariant = () => {
    const count = variants.length + 1;
    const prefix = form.name
      ? form.name.replace(/[^a-zA-Z0-9]/g, "").substring(0, 4).toUpperCase()
      : "VAR";
    const autoSku = `${prefix}-${count}`;

    setVariants((prev) => [
      ...prev,
      {
        name: `Variant ${count}`,
        sku: autoSku,
        barcode: "",
        selling_price: Number(form.cost_price || 0) > 0 ? Number(form.cost_price) * 1.2 : 0,
        cost_price: Number(form.cost_price || 0),
        is_active: true,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariantInput,
    val: string | number | boolean
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: val } : v))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      variants,
    });
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

        {/* Product Variants Section */}
        <div className="variant-section">
          <div className="variant-section-head">
            <div className="variant-section-title">
              <span>◈ Product Variants</span>
              {variants.length > 0 && (
                <span className="variant-badge">{variants.length} added</span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddVariant}
            >
              + Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="muted" style={{ fontSize: 13, fontStyle: "italic" }}>
              No variants added yet. Click "+ Add Variant" above to add size, color, or style options.
            </div>
          ) : (
            variants.map((v, idx) => (
              <div key={idx} className="variant-card">
                <div className="variant-card-header">
                  <span style={{ fontWeight: 600, fontSize: 14 }}>
                    Variant #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn btn-link-danger btn-sm"
                    onClick={() => handleRemoveVariant(idx)}
                  >
                    Remove
                  </button>
                </div>

                <div className="variant-grid">
                  <div className="form-group">
                    <label>Variant Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Red / Large"
                      value={v.name}
                      onChange={(e) =>
                        handleVariantChange(idx, "name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      className="mono"
                      placeholder="e.g. TSH-RED-L"
                      value={v.sku}
                      onChange={(e) =>
                        handleVariantChange(idx, "sku", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Barcode</label>
                    <input
                      type="text"
                      className="mono"
                      placeholder="e.g. 89012345"
                      value={v.barcode || ""}
                      onChange={(e) =>
                        handleVariantChange(idx, "barcode", e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Selling Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={v.selling_price}
                      onChange={(e) =>
                        handleVariantChange(
                          idx,
                          "selling_price",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Cost Price (Rs.)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={v.cost_price}
                      onChange={(e) =>
                        handleVariantChange(
                          idx,
                          "cost_price",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </div>

                  <div className="form-group" style={{ justifyContent: "center" }}>
                    <label className="form-check" style={{ marginTop: 20 }}>
                      <input
                        type="checkbox"
                        checked={v.is_active !== false}
                        onChange={(e) =>
                          handleVariantChange(idx, "is_active", e.target.checked)
                        }
                      />
                      Active variant
                    </label>
                  </div>
                </div>
              </div>
            ))
          )}
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

