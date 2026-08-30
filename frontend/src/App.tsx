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
import StockCountLinesPage from "./apps/inventory/pages/StockCountLinesPage";

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

export type UserRole = "System Admin" | "Inventory Manager" | "Sales Staff";

function TopNavbar({}: { activeRole: UserRole; onRoleChange: (r: UserRole) => void }) {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith("/products")) return "Products Catalog";
    if (path.startsWith("/categories")) return "Categories";
    if (path.startsWith("/units")) return "Units & Measures";
    if (path === "/inventory") return "Inventory & Overview";
    if (path.startsWith("/inventory/locations")) return "Stock Locations";
    if (path.startsWith("/inventory/count-lines")) return "Stock Count Lines";
    if (path.startsWith("/inventory/counts")) return "Stock Counts";
    if (path.startsWith("/inventory/movements")) return "Stock Movements";
    if (path.startsWith("/inventory/transfers")) return "Stock Transfers";
    if (path.startsWith("/purchasing/suppliers")) return "Suppliers Directory";
    if (path.startsWith("/purchasing/orders")) return "Purchase Orders";
    if (path.startsWith("/orders")) return "Orders Overview";
    if (path.startsWith("/customers")) return "Customers Directory";
    if (path.startsWith("/payments")) return "Payment Logs";
    if (path.startsWith("/reports")) return "Analytics & Reports";
    return "Inventory Management Dashboard";
  };

  return (
    <header className="top-navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
          {getPageTitle()}
        </h3>
        <span className="badge badge-blue">API Connected</span>
      </div>

      <div className="top-nav-actions">
        <div className="search-bar">
          <span className="search-ico">🔍</span>
          <input type="text" placeholder="Search product, SKU, or order..." />
        </div>
      </div>
    </header>
  );
}

function Layout() {
  const [activeRole, setActiveRole] = useState<UserRole>("System Admin");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">IMS</div>
          <div>
            <div className="name">Inventory System</div>
            <div className="version">v2.5 Release</div>
          </div>
        </div>

        <div className="nav-section">Products</div>
        
        <NavLink to="/categories" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏷️</span> Categories
        </NavLink>
        <NavLink to="/units" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">⚖️</span> Units
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📦</span> Products
        </NavLink>

        <div className="nav-section">Inventory</div>
        <NavLink to="/inventory" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏢</span> Inventory
        </NavLink>
        <NavLink to="/inventory/locations" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📍</span> Stock Locations
        </NavLink>
        <NavLink to="/inventory/count-lines" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🔢</span> Stock Count Lines
        </NavLink>
        <NavLink to="/inventory/counts" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📋</span> Stock Counts
        </NavLink>
        <NavLink to="/inventory/movements" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">⇄</span> Stock Movements
        </NavLink>
        <NavLink to="/inventory/transfers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🚚</span> Stock Transfers
        </NavLink>

        <div className="nav-section">Purchasing</div>
        <NavLink to="/purchasing/suppliers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🏢</span> Suppliers
        </NavLink>
        <NavLink to="/purchasing/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📋</span> Purchase Orders
        </NavLink>

        <div className="nav-section">Orders</div>
        <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">🛍️</span> Orders
        </NavLink>

        <div className="nav-section">Customers & Payments</div>
        <NavLink to="/customers" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">👥</span> Customers
        </NavLink>
        <NavLink to="/payments" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">💳</span> Payments
        </NavLink>

        <div className="nav-section">Analytics</div>
        <NavLink to="/reports" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-ico">📈</span> Reports & Analytics
        </NavLink>

        <div className="sidebar-footer">
          <div className="user-profile-card">
            <div className="user-avatar">
              {activeRole === "System Admin" ? "SA" : "M"}
            </div>
            <div className="user-info">
              <span className="user-name">Administrator</span>
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
            <Route path="/inventory/count-lines" element={<StockCountLinesPage />} />
            <Route path="/inventory/counts" element={<StockCountsPage />} />
            <Route path="/inventory/movements" element={<StockMovementsPage />} />
            <Route path="/inventory/transfers" element={<StockTransfersPage />} />

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
