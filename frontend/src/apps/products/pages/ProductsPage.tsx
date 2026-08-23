import { useState } from "react";

import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";
import ProductFilters from "../components/ProductFilters";

import type {
  Product,
  ProductFormData,
} from "../types/product";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Basmati Rice",
      sku: "RICE001",
      description: "Premium basmati rice",
      category: "Food",
      unit: "Kg",
      price: 120,
      cost_price: 100,
      is_active: true,
    },
    {
      id: 2,
      name: "Cooking Oil",
      sku: "OIL001",
      description: "Sunflower cooking oil",
      category: "Food",
      unit: "Liter",
      price: 250,
      cost_price: 220,
      is_active: true,
    },
    {
      id: 3,
      name: "Sugar",
      sku: "SUGAR001",
      description: "White sugar",
      category: "Food",
      unit: "Kg",
      price: 110,
      cost_price: 90,
      is_active: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  // SEARCH + FILTER
  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        product.sku
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all" ||
        (status === "active" &&
          product.is_active) ||
        (status === "inactive" &&
          !product.is_active);

      return matchesSearch && matchesStatus;
    }
  );

  // ADD PRODUCT
  const handleCreate = (
    data: ProductFormData
  ) => {
    const newProduct: Product = {
      id: Date.now(),
      ...data,
    };

    setProducts((previous) => [
      ...previous,
      newProduct,
    ]);

    setShowForm(false);
  };

  // EDIT PRODUCT
  const handleEdit = (
    product: Product
  ) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // UPDATE PRODUCT
  const handleUpdate = (
    data: ProductFormData
  ) => {
    if (!editingProduct) {
      return;
    }

    setProducts((previous) =>
      previous.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              ...data,
            }
          : product
      )
    );

    setEditingProduct(null);
    setShowForm(false);
  };

  // DELETE PRODUCT
  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    setProducts((previous) =>
      previous.filter(
        (product) => product.id !== id
      )
    );
  };

  // ADD BUTTON
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // CANCEL
  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Products
            </h1>

            <p className="text-gray-500">
              Manage your products
            </p>
          </div>

          {!showForm && (
            <button
              onClick={handleAddProduct}
              className="rounded-md bg-blue-600 px-5 py-2 text-white"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* FORM */}

        {showForm ? (
          <ProductForm
            product={editingProduct}
            onSubmit={
              editingProduct
                ? handleUpdate
                : handleCreate
            }
            onCancel={handleCancel}
          />
        ) : (
          <>
            {/* SEARCH + FILTER */}

            <ProductFilters
              search={search}
              status={status}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
            />

            {/* TABLE */}

            <ProductTable
              products={filteredProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;