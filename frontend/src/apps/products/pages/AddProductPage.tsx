import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productApi";
import type { ProductInput } from "../types/product";

function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: ProductInput) => {
    try {
      await createProduct(data);
      alert("Product created successfully.");
      navigate("/products");
    } catch (error) {
      console.error(error);
      alert("Failed to create product.");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Add Product</h1>
          <div className="sub">Create a new product in the catalog</div>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        submitText="Create Product"
        onCancel={() => navigate("/products")}
      />
    </div>
  );
}

export default AddProductPage;
