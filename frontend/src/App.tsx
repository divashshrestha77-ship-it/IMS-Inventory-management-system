import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";

// Products App
import ProductsPage from "./apps/products/pages/ProductsPage";
import AddProductPage from "./apps/products/pages/AddProductPage";
import EditProductPage from "./apps/products/pages/EditProductPage";
import ProductDetailPage from "./apps/products/pages/ProductDetailPage";
import CategoriesPage from "./apps/products/pages/CategoriesPage";
import UnitsPage from "./apps/products/pages/UnitsPage";

// Inventory App
import InventoryPage from "./apps/inventory/pages/InventoryPage";
import StockLocationsPage from "./apps/inventory/pages/StockLocationsPage";
import StockMovementsPage from "./apps/inventory/pages/StockMovementsPage";
import StockTransfersPage from "./apps/inventory/pages/StockTransfersPage";
import StockCountsPage from "./apps/inventory/pages/StockCountsPage";

// Purchasing App
import SuppliersPage from "./apps/purchasing/pages/SuppliersPage";
import PurchaseOrdersPage from "./apps/purchasing/pages/PurchaseOrdersPage";

// Orders App
import OrdersPage from "./apps/orders/pages/OrdersPage";

// Customers App
import CustomersPage from "./apps/customers/pages/CustomersPage";

// Payments App
import PaymentsPage from "./apps/payments/pages/PaymentsPage";

// Reports App
import ReportsPage from "./apps/reports/pages/ReportsPage";

export type AkkaraRole = "Management" | "Online Admin" | "Offline Admin" | "Sales Staff";

function TopNavbar({ activeRole, onRoleChange }: { activeRole: AkkaraRole; onRoleChange: (r: AkkaraRole) => void }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/products")) return "Products Catalog";
    if (path.startsWith("/categories")) return "Categories";
    if (path.startsWith("/units")) return "Units & Measures";
    if (path === "/inventory") return "Stock Overview & Audits";
    if (path.startsWith("/inventory/locations")) return "15 Stock Locations & Outlets";
    if (path.startsWith("/inventory/movements")) return "Stock Movements Log";
    if (path.startsWith("/inventory/transfers")) return "Stock Hub & Store Transfers";
    if (path.startsWith("/inventory/counts")) return "Stock Counts";
    if (path.startsWith("/purchasing/suppliers")) return "Suppliers Directory";
    if (path.startsWith("/purchasing/orders")) return "Purchase Orders";
    if (path.startsWith("/orders")) return "Omnichannel Orders";
    if (path.startsWith("/customers")) return "Customers Directory";
    if (path.startsWith("/payments")) return "Payment Logs";
    if (path.startsWith("/reports")) return "Reporting Services / SQL Views";
    return "Akkara Bangkok Dashboard";
  };

  return (
    <header className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
          {getPageTitle()}
        </h3>
        <span className="badge badge-blue">Akkara Bangkok Live</span>
      </div>

      <div className="top-nav-actions">
        {/* Role Switcher Selector for Trial Users */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-muted)", padding: "4px 8px", borderRadius: 10, border: "1px solid var(--border)" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>ROLE:</span>
          <select
            value={activeRole}
            onChange={(e) => onRoleChange(e.target.value as AkkaraRole)}
            style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: 13, cursor: "pointer", outline: "none" }}
          >
            <option value="Management">👑 Management / Director</option>
            <option value="Online Admin">🛍️ 1 Online Shop Admin (Shopee & Line)</option>
            <option value="Offline Admin">🏢 1 Offline Shop Admin (3 Storefronts & 10 Pop-ups)</option>
            <option value="Sales Staff">🏪 3 Sales Staff (Mobile Stock Checker)</option>
          </select>
        </div>

        <div className="search-bar">
          <span className="search-ico">🔍</span>
          <input type="text" placeholder="Search SKU, order, or pop-up..." />
        </div>
      </div>
    </header>
  );
}

function Layout() {
  const [activeRole, setActiveRole] = useState<AkkaraRole>("Management");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">AKK</div>
          <div>
            <div className="name">Akkara Bangkok</div>
            <div className="version">Omnichannel IMS v2.5</div>
          </div>
        </div>

        <div className="nav-section">Products App</div>
        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📦</span> Products & Variants
        </NavLink>
        <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏷️</span> Categories
        </NavLink>
        <NavLink to="/units" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">⚖️</span> Units
        </NavLink>

        <div className="nav-section">Inventory App</div>
        <NavLink to="/inventory/transfers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">⇆</span> Stock Hub & Transfers
        </NavLink>
        <NavLink to="/inventory" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">▣</span> Stock Overview & Audits
        </NavLink>
        <NavLink to="/inventory/locations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏬</span> 15 Outlets & Locations
        </NavLink>
        <NavLink to="/inventory/movements" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">⇄</span> Stock Movements
        </NavLink>
        <NavLink to="/inventory/counts" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">✓</span> Stock Counts
        </NavLink>

        <div className="nav-section">Purchasing App</div>
        <NavLink to="/purchasing/suppliers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏢</span> Suppliers
        </NavLink>
        <NavLink to="/purchasing/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📋</span> Purchase Orders
        </NavLink>

        <div className="nav-section">Orders App</div>
        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🛍️</span> Omnichannel Orders
        </NavLink>

        <div className="nav-section">Customers & Payments</div>
        <NavLink to="/customers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">👥</span> Customers
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">💳</span> Payments
        </NavLink>

        <div className="nav-section">Reporting Services</div>
        <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📈</span> SQL Views & Analytics
        </NavLink>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              {activeRole === "Management" ? "M" : activeRole === "Online Admin" ? "ON" : activeRole === "Offline Admin" ? "OFF" : "S"}
            </div>
            <div className="user-info">
              <span className="user-name">Khun Fluke</span>
              <span className="user-role">{activeRole}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="main-wrapper">
        <TopNavbar activeRole={activeRole} onRoleChange={setActiveRole} />
        <main className="main">
          <Routes>
            <Route path="/" element={<StockTransfersPage />} />

            {/* Products App */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/add" element={<AddProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/:id/edit" element={<EditProductPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/units" element={<UnitsPage />} />

            {/* Inventory App */}
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/locations" element={<StockLocationsPage />} />
            <Route path="/inventory/movements" element={<StockMovementsPage />} />
            <Route path="/inventory/transfers" element={<StockTransfersPage />} />
            <Route path="/inventory/counts" element={<StockCountsPage />} />

            {/* Purchasing App */}
            <Route path="/purchasing/suppliers" element={<SuppliersPage />} />
            <Route path="/purchasing/orders" element={<PurchaseOrdersPage />} />

            {/* Orders App */}
            <Route path="/orders" element={<OrdersPage />} />

            {/* Customers App */}
            <Route path="/customers" element={<CustomersPage />} />

            {/* Payments App */}
            <Route path="/payments" element={<PaymentsPage />} />

            {/* Reports App */}
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
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
