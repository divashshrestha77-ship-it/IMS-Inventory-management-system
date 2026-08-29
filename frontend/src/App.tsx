import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import ProductsPage from "./apps/products/pages/ProductsPage";
import AddProductPage from "./apps/products/pages/AddProductPage";
import EditProductPage from "./apps/products/pages/EditProductPage";
import ProductDetailPage from "./apps/products/pages/ProductDetailPage";
import CategoriesPage from "./apps/products/pages/CategoriesPage";
import UnitsPage from "./apps/products/pages/UnitsPage";

import InventoryPage from "./apps/inventory/pages/InventoryPage";
import StockLocationsPage from "./apps/inventory/pages/StockLocationsPage";
import StockMovementsPage from "./apps/inventory/pages/StockMovementsPage";
import StockTransfersPage from "./apps/inventory/pages/StockTransfersPage";
import StockCountsPage from "./apps/inventory/pages/StockCountsPage";

function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">I</div>
          <div className="name">Inventory Pro</div>
        </div>

        <div className="nav-section">Products</div>
        <NavLink to="/" end className="nav-link">
          <span className="nav-ico">▤</span> Dashboard
        </NavLink>
        <NavLink to="/products" className="nav-link">
          <span className="nav-ico">▦</span> Products
        </NavLink>
        <NavLink to="/categories" className="nav-link">
          <span className="nav-ico">◈</span> Categories
        </NavLink>
        <NavLink to="/units" className="nav-link">
          <span className="nav-ico">⚖</span> Units
        </NavLink>

        <div className="nav-section">Inventory</div>
        <NavLink to="/inventory" className="nav-link">
          <span className="nav-ico">▣</span> Stock
        </NavLink>
        <NavLink to="/inventory/locations" className="nav-link">
          <span className="nav-ico">⌂</span> Locations
        </NavLink>
        <NavLink to="/inventory/movements" className="nav-link">
          <span className="nav-ico">⇄</span> Movements
        </NavLink>
        <NavLink to="/inventory/transfers" className="nav-link">
          <span className="nav-ico">⇆</span> Transfers
        </NavLink>
        <NavLink to="/inventory/counts" className="nav-link">
          <span className="nav-ico">✓</span> Stock Counts
        </NavLink>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/add" element={<AddProductPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/units" element={<UnitsPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/locations" element={<StockLocationsPage />} />
          <Route path="/inventory/movements" element={<StockMovementsPage />} />
          <Route path="/inventory/transfers" element={<StockTransfersPage />} />
          <Route path="/inventory/counts" element={<StockCountsPage />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
