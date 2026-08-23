import { useState } from "react";

import type {
  Product,
  ProductFormData,
} from "../types/product";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm = ({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) => {
  const [formData, setFormData] =
    useState<ProductFormData>({
      name: product?.name ?? "",
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      category: product?.category ?? "",
      unit: product?.unit ?? "",
      price: product?.price ?? 0,
      cost_price: product?.cost_price ?? 0,
      is_active: product?.is_active ?? true,
    });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "cost_price"
          ? Number(value)
          : value,
    }));
  };

  const handleStatusChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      is_active: event.target.checked,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border bg-white p-6"
    >
      <h2 className="mb-6 text-xl font-semibold">
        {product
          ? "Edit Product"
          : "Add Product"}
      </h2>

      <div className="grid gap-5 md:grid-cols-2">

        {/* Product Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            SKU
          </label>

          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="Enter SKU"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">
              Select category
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Beverage">
              Beverage
            </option>

            <option value="Electronics">
              Electronics
            </option>
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Unit
          </label>

          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">
              Select unit
            </option>

            <option value="Piece">
              Piece
            </option>

            <option value="Kg">
              Kg
            </option>

            <option value="Liter">
              Liter
            </option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Selling Price
          </label>

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Cost Price */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Cost Price
          </label>

          <input
            type="number"
            name="cost_price"
            value={formData.cost_price}
            onChange={handleChange}
            min="0"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Enter product description"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={handleStatusChange}
          />

          <label className="text-sm">
            Active Product
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          {product
            ? "Update Product"
            : "Create Product"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border px-5 py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;