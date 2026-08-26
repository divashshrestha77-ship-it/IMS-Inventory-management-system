import { useEffect, useState } from "react";

import {
  getProducts,
  deleteProduct,
} from "../api/productApi";

import type {
  Product,
} from "../api/productApi";


export default function ProductsPage() {
  // Store products from Django API
  const [products, setProducts] = useState<Product[]>([]);

  // Loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Error state
  const [error, setError] = useState<string>("");

  // Search state
  const [search, setSearch] = useState<string>("");


  // ==============================
  // GET PRODUCTS FROM DJANGO
  // ==============================
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch (err) {
      console.error(err);

      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };


  // ==============================
  // DELETE PRODUCT
  // ==============================
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      // Remove deleted product from UI
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );

    } catch (err) {
      console.error(err);

      alert("Failed to delete product.");
    }
  };


  // ==============================
  // LOAD PRODUCTS WHEN PAGE OPENS
  // ==============================
  useEffect(() => {
    loadProducts();
  }, []);


  // ==============================
  // SEARCH PRODUCTS
  // ==============================
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText)
    );
  });


  // ==============================
  // LOADING
  // ==============================
  if (loading) {
    return (
      <div
        style={{
          padding: "30px",
          fontSize: "18px",
        }}
      >
        Loading products...
      </div>
    );
  }


  // ==============================
  // PAGE
  // ==============================
  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >

      {/* PAGE HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
            }}
          >
            Products
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#666",
            }}
          >
            Manage your products and inventory
          </p>
        </div>


        <button
          onClick={loadProducts}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>

      </div>


      {/* ERROR MESSAGE */}
      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}


      {/* SEARCH */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >

        <input
          type="text"
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px 12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />

      </div>


      {/* PRODUCT COUNT */}
      <div
        style={{
          marginBottom: "15px",
          color: "#555",
        }}
      >
        Showing {filteredProducts.length} of{" "}
        {products.length} products
      </div>


      {/* NO PRODUCTS */}
      {filteredProducts.length === 0 ? (

        <div
          style={{
            padding: "30px",
            textAlign: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          No products found.
        </div>

      ) : (

        /* PRODUCT TABLE */
        <div
          style={{
            overflowX: "auto",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >

            <thead>

              <tr>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Product Name
                </th>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  SKU
                </th>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Price
                </th>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Quantity
                </th>

                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {product.id}
                  </td>


                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {product.name}
                  </td>


                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {product.sku}
                  </td>


                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Rs. {product.price}
                  </td>


                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {product.quantity}
                  </td>


                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      borderBottom: "1px solid #eee",
                    }}
                  >

                    <button
                      onClick={() =>
                        handleDelete(product.id)
                      }
                      style={{
                        padding: "7px 12px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}