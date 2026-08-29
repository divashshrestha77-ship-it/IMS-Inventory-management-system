import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { getProduct, updateProduct } from "../api/productApi";
import type { Product, ProductInput } from "../types/product";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        const data = await getProduct(Number(id));
        setProduct(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleSubmit = async (data: ProductInput) => {
    if (!id) return;
    try {
      await updateProduct(Number(id), data);
      alert("Product updated successfully.");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Failed to update product.");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Edit Product</h1>
          <div className="sub">Update product information</div>
        </div>
      </div>

      {loading ? (
        <div className="state">
          <div className="spinner" />
          Loading product...
        </div>
      ) : !product ? (
        <div className="state">
          <div className="state-title">Product not found</div>
        </div>
      ) : (
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          submitText="Update Product"
          onCancel={() => navigate("/products")}
        />
      )}
    </div>
  );
}

export default EditProductPage;
