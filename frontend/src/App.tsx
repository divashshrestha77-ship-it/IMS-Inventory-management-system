import { useState } from "react";

import ProductsPage from "./apps/products/pages/ProductsPage";
import InventoryPage from "./apps/inventory/pages/InventoryPage";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "products" | "inventory"
  >("products");

  return (
    <div>
      {/* Navigation */}
      <nav className="flex gap-2 border-b bg-white p-4">
        <button
          onClick={() => setCurrentPage("products")}
          className={`rounded-md px-4 py-2 ${
            currentPage === "products"
              ? "bg-black text-white"
              : "border bg-white text-black"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setCurrentPage("inventory")}
          className={`rounded-md px-4 py-2 ${
            currentPage === "inventory"
              ? "bg-black text-white"
              : "border bg-white text-black"
          }`}
        >
          Inventory
        </button>
      </nav>

      {/* Pages */}
      {currentPage === "products" && <ProductsPage />}

      {currentPage === "inventory" && <InventoryPage />}
    </div>
  );
}

export default App;