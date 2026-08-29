import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProduct } from "../api/productApi";
import type { Product } from "../types/product";

function ProductDetailPage() {
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
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  return (
    <div>
      <div className="page-head">
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate("/products")}>
            ← Back to Products
          </button>
        </div>
        {product && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            Edit Product
          </button>
        )}
      </div>

      {loading ? (
        <div className="state">
          <div className="spinner" />
          Loading...
        </div>
      ) : !product ? (
        <div className="state">
          <div className="state-title">Product not found</div>
        </div>
      ) : (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">{product.name}</div>
              <div className="card-sub mono">{product.slug}</div>
            </div>
            {product.is_active ? (
              <span className="badge badge-green">Active</span>
            ) : (
              <span className="badge badge-gray">Inactive</span>
            )}
          </div>

          <div className="stats">
            <div className="stat">
              <div className="stat-label">Category</div>
              <div className="stat-value" style={{ fontSize: 18 }}>
                {product.category_name}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Unit</div>
              <div className="stat-value" style={{ fontSize: 18 }}>
                {product.unit_name}
              </div>
            </div>
            <div className="stat">
              <div className="stat-label">Quantity</div>
              <div className="stat-value">{product.quantity}</div>
            </div>
            <div className="stat">
              <div className="stat-label">Selling Price</div>
              <div className="stat-value">Rs. {product.selling_price}</div>
            </div>
          </div>

          <div className="mt2" style={{ color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text)" }}>Cost:</strong> Rs.{" "}
            {product.cost_price} &nbsp;·&nbsp;{" "}
            <strong style={{ color: "var(--text)" }}>Discount:</strong>{" "}
            {product.discount_percentage ?? 0}%
          </div>

          {product.description && (
            <p className="mt2 muted">{product.description}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
