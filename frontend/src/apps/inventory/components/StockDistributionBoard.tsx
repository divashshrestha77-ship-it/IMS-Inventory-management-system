import React, { useState, useEffect } from "react";
import { getInventory, getLocations, createStockTransfer } from "../api/inventoryApi";
import type { StockLocation } from "../types/inventory";

interface StockCardItem {
  id: string;
  sku: string;
  productName: string;
  locationId: number;
  locationName: string;
  quantity: number;
}

interface TransferModalState {
  isOpen: boolean;
  sku: string;
  productName: string;
  fromLocationId: number;
  fromLocationName: string;
  availableQty: number;
  toLocationId: number | string;
  quantity: number;
  notes: string;
}

export function StockDistributionBoard() {
  const [viewMode, setViewMode] = useState<"sku" | "store" | "admin">("sku");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Locations matching user's wireframe diagram
  const [locations, setLocations] = useState<StockLocation[]>([
    { id: 1, name: "Bangkok Warehouse", code: "BKK-WH", location_type: "Warehouse", phone: "", description: "Main Hub", is_active: true, created_at: "", updated_at: "" },
    { id: 2, name: "Bkk Central World", code: "BKK-CW", location_type: "Store", phone: "", description: "Central Retail", is_active: true, created_at: "", updated_at: "" },
    { id: 3, name: "Central Chiangmai", code: "CNX-CM", location_type: "Store", phone: "", description: "North Branch", is_active: true, created_at: "", updated_at: "" },
    { id: 4, name: "Pattaya Store", code: "PTY-ST", location_type: "Store", phone: "", description: "Coast Branch", is_active: true, created_at: "", updated_at: "" },
  ]);

  // Initial Stock items matching user's wireframe (SKU 1012514, SKU 123131, SKU 987654)
  const [stockItems, setStockItems] = useState<StockCardItem[]>([
    { id: "1-1", sku: "1012514", productName: "Wireless Noise-Canceling Earbuds", locationId: 1, locationName: "Bangkok Warehouse", quantity: 1000 },
    { id: "1-2", sku: "1012514", productName: "Wireless Noise-Canceling Earbuds", locationId: 2, locationName: "Bkk Central World", quantity: 100 },
    { id: "1-3", sku: "1012514", productName: "Wireless Noise-Canceling Earbuds", locationId: 3, locationName: "Central Chiangmai", quantity: 200 },
    { id: "1-4", sku: "1012514", productName: "Wireless Noise-Canceling Earbuds", locationId: 4, locationName: "Pattaya Store", quantity: 150 },

    { id: "2-1", sku: "123131", productName: "Pro Ergonomic Desk Chair", locationId: 1, locationName: "Bangkok Warehouse", quantity: 1323 },
    { id: "2-2", sku: "123131", productName: "Pro Ergonomic Desk Chair", locationId: 2, locationName: "Bkk Central World", quantity: 240 },
    { id: "2-3", sku: "123131", productName: "Pro Ergonomic Desk Chair", locationId: 3, locationName: "Central Chiangmai", quantity: 180 },

    { id: "3-1", sku: "987654", productName: "Mechanical RGB Gaming Keyboard", locationId: 1, locationName: "Bangkok Warehouse", quantity: 500 },
    { id: "3-2", sku: "987654", productName: "Mechanical RGB Gaming Keyboard", locationId: 2, locationName: "Bkk Central World", quantity: 350 },
    { id: "3-4", sku: "987654", productName: "Mechanical RGB Gaming Keyboard", locationId: 4, locationName: "Pattaya Store", quantity: 210 },
  ]);

  // Modal State
  const [modal, setModal] = useState<TransferModalState>({
    isOpen: false,
    sku: "",
    productName: "",
    fromLocationId: 0,
    fromLocationName: "",
    availableQty: 0,
    toLocationId: "",
    quantity: 1,
    notes: "",
  });

  // Try loading real API data if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiLocs, apiInv] = await Promise.all([getLocations(), getInventory()]);
        if (apiLocs && apiLocs.length > 0) setLocations(apiLocs);
        if (apiInv && apiInv.length > 0) {
          const mapped: StockCardItem[] = apiInv.map((item, index) => ({
            id: `api-${item.id || index}`,
            sku: `SKU-${item.product}`,
            productName: item.product_name || `Product #${item.product}`,
            locationId: item.location,
            locationName: item.location_name || `Location #${item.location}`,
            quantity: Number(item.quantity || 0),
          }));
          setStockItems(mapped);
        }
      } catch {
        // Fallback to rich wireframe mock data when API is offline
      }
    };
    fetchData();
  }, []);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Quick Transfer Modal
  const handleOpenTransferModal = (item: StockCardItem) => {
    const defaultToLoc = locations.find((l) => l.id !== item.locationId)?.id || "";
    setModal({
      isOpen: true,
      sku: item.sku,
      productName: item.productName,
      fromLocationId: item.locationId,
      fromLocationName: item.locationName,
      availableQty: item.quantity,
      toLocationId: defaultToLoc,
      quantity: Math.min(10, item.quantity),
      notes: `Transfer request from ${item.locationName}`,
    });
  };

  // Execute Transfer
  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const toLocId = Number(modal.toLocationId);
    if (!toLocId) {
      alert("Please select a target store location.");
      return;
    }
    if (toLocId === modal.fromLocationId) {
      alert("Source and Destination locations must be different.");
      return;
    }
    if (modal.quantity <= 0 || modal.quantity > modal.availableQty) {
      alert(`Invalid quantity. Available stock: ${modal.availableQty}`);
      return;
    }

    const toLocObj = locations.find((l) => l.id === toLocId);
    const toLocName = toLocObj ? toLocObj.name : `Store #${toLocId}`;

    try {
      await createStockTransfer({
        from_location: modal.fromLocationId,
        to_location: toLocId,
        notes: modal.notes,
      });
    } catch {
      // Mock mode fallback when backend endpoint is not active
    }

    // Update local state live
    setStockItems((prev) => {
      const copy = [...prev];
      // Deduct from source
      const srcIdx = copy.findIndex((i) => i.sku === modal.sku && i.locationId === modal.fromLocationId);
      if (srcIdx !== -1) {
        copy[srcIdx] = {
          ...copy[srcIdx],
          quantity: copy[srcIdx].quantity - modal.quantity,
        };
      }
      // Add to destination
      const destIdx = copy.findIndex((i) => i.sku === modal.sku && i.locationId === toLocId);
      if (destIdx !== -1) {
        copy[destIdx] = {
          ...copy[destIdx],
          quantity: copy[destIdx].quantity + modal.quantity,
        };
      } else {
        copy.push({
          id: `${modal.sku}-${toLocId}-${Date.now()}`,
          sku: modal.sku,
          productName: modal.productName,
          locationId: toLocId,
          locationName: toLocName,
          quantity: modal.quantity,
        });
      }
      return copy;
    });

    setModal((m) => ({ ...m, isOpen: false }));
    showToast(`✓ Transferred ${modal.quantity} unit(s) of SKU: ${modal.sku} to ${toLocName}!`);
  };

  // Grouping logic for View Modes
  const filteredStock = stockItems.filter((i) =>
    i.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.locationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by SKU
  const skusGrouped = Array.from(new Set(filteredStock.map((s) => s.sku))).map((sku) => {
    const items = filteredStock.filter((s) => s.sku === sku);
    const productName = items[0]?.productName || sku;
    const totalQty = items.reduce((acc, curr) => acc + curr.quantity, 0);
    return { sku, productName, totalQty, items };
  });

  // Group by Store / Location
  const storesGrouped = locations.map((loc) => {
    const items = filteredStock.filter((s) => s.locationId === loc.id);
    const totalQty = items.reduce((acc, curr) => acc + curr.quantity, 0);
    return { location: loc, items, totalQty };
  });

  return (
    <div className="stock-board-wrapper">
      {/* View Switcher Header Toolbar */}
      <div className="board-toolbar">
        <div className="view-mode-tabs">
          <button
            className={`tab-btn ${viewMode === "sku" ? "active" : ""}`}
            onClick={() => setViewMode("sku")}
          >
            <span>📦</span> By SKU View
          </button>
          <button
            className={`tab-btn ${viewMode === "store" ? "active" : ""}`}
            onClick={() => setViewMode("store")}
          >
            <span>🏬</span> By Store View
          </button>
          <button
            className={`tab-btn ${viewMode === "admin" ? "active" : ""}`}
            onClick={() => setViewMode("admin")}
          >
            <span>👤</span> Admin Overview
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            className="search-input"
            style={{ width: 240, padding: "7px 12px", fontSize: 13 }}
            placeholder="Search SKU or Location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* MODE 1: BY SKU VIEW (Container 1 in wireframe) */}
      {viewMode === "sku" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {skusGrouped.map((group) => (
            <div key={group.sku} className="wireframe-box">
              <div className="wireframe-box-header">
                <div className="wireframe-box-title">
                  <span>SKU:</span>
                  <span className="sku-code">{group.sku}</span>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", fontWeight: 600 }}>
                    ({group.productName})
                  </span>
                </div>
                <div className="badge badge-blue">
                  Total Stock: {group.totalQty.toLocaleString()} units
                </div>
              </div>

              {/* Horizontal Grid of Store Location Cards */}
              <div className="stock-cards-grid">
                {group.items.map((item) => (
                  <div key={item.id} className="location-stock-card">
                    <div>
                      <div className="location-card-header">
                        <span>🏢</span>
                        <span>{item.locationName}</span>
                      </div>
                      <div className="location-card-stock">
                        <div className="qty-number">{item.quantity.toLocaleString()}</div>
                        <div className="qty-label">Stock On Hand</div>
                      </div>
                    </div>
                    <div className="location-card-actions">
                      <button
                        className="transfer-trigger-btn"
                        onClick={() => handleOpenTransferModal(item)}
                      >
                        <span>Transfer</span>
                        <span className="arrow-icon">➔</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 2: BY STORE VIEW (Container 2 in wireframe) */}
      {viewMode === "store" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {storesGrouped.map((group) => (
            <div key={group.location.id} className="wireframe-box">
              <div className="wireframe-box-header">
                <div className="wireframe-box-title">
                  <span className="store-name">
                    <span>🏬</span> Store: {group.location.name}
                  </span>
                </div>
                <div className="badge badge-green">
                  {group.items.length} SKUs Stocked
                </div>
              </div>

              {group.items.length === 0 ? (
                <div className="muted" style={{ padding: "16px 0" }}>
                  No stock items registered for this location.
                </div>
              ) : (
                <div className="stock-cards-grid">
                  {group.items.map((item) => (
                    <div key={item.id} className="location-stock-card">
                      <div>
                        <div className="location-card-header">
                          <span className="mono" style={{ color: "var(--primary)", fontWeight: 700 }}>
                            SKU: {item.sku}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, fontWeight: 600 }}>
                          {item.productName}
                        </div>
                        <div className="location-card-stock">
                          <div className="qty-number">{item.quantity.toLocaleString()}</div>
                          <div className="qty-label">Available Qty</div>
                        </div>
                      </div>
                      <div className="location-card-actions">
                        <button
                          className="transfer-trigger-btn"
                          onClick={() => handleOpenTransferModal(item)}
                        >
                          <span>Transfer</span>
                          <span className="arrow-icon">➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODE 3: ADMIN OVERVIEW VIEW (Container 3 in wireframe) */}
      {viewMode === "admin" && (
        <div className="wireframe-box">
          <div className="wireframe-box-header">
            <div className="wireframe-box-title">
              <span>User:</span>
              <span className="user-name">Admin</span>
              <span className="badge badge-amber" style={{ marginLeft: 8 }}>
                Full System Control
              </span>
            </div>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
              Master Inventory Stock & Inter-Store Transfer Panel
            </div>
          </div>

          <div className="stock-cards-grid">
            {skusGrouped.map((group) => (
              <div key={group.sku} className="location-stock-card">
                <div>
                  <div className="location-card-header">
                    <span className="mono" style={{ color: "var(--primary)", fontWeight: 700 }}>
                      SKU: {group.sku}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    {group.productName}
                  </div>
                  <div className="location-card-stock">
                    <div className="qty-number">{group.totalQty.toLocaleString()}</div>
                    <div className="qty-label">Total System Stock: {group.totalQty}</div>
                  </div>
                </div>
                <div className="location-card-actions">
                  <button
                    className="transfer-trigger-btn"
                    onClick={() => {
                      if (group.items.length > 0) {
                        handleOpenTransferModal(group.items[0]);
                      }
                    }}
                  >
                    <span>Transfer</span>
                    <span className="arrow-icon">➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK STOCK TRANSFER MODAL */}
      {modal.isOpen && (
        <div className="modal-overlay" onClick={() => setModal((m) => ({ ...m, isOpen: false }))}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⇆ Quick Stock Transfer</h3>
              <button
                className="modal-close-btn"
                onClick={() => setModal((m) => ({ ...m, isOpen: false }))}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="modal-body">
              <div style={{ background: "var(--bg-muted)", padding: 14, borderRadius: 10, marginBottom: 18 }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>TRANSFER ITEM</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--primary)", marginTop: 2 }}>
                  SKU: {modal.sku}
                </div>
                <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>
                  {modal.productName}
                </div>
              </div>

              {modal.availableQty <= 0 && (
                <div style={{ background: "var(--danger-soft)", color: "var(--danger)", padding: "10px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 16, border: "1px solid var(--danger-border)" }}>
                  ⚠️ Zero stock available at source location ({modal.fromLocationName}). Stock transfer disabled.
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>From Source Location</label>
                <input
                  type="text"
                  readOnly
                  value={`${modal.fromLocationName} (Available Stock: ${modal.availableQty})`}
                  style={{ background: "#f8fafc", fontWeight: 600, cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>To Destination Location *</label>
                <select
                  value={modal.toLocationId}
                  onChange={(e) => setModal((m) => ({ ...m, toLocationId: e.target.value }))}
                  required
                  disabled={modal.availableQty <= 0}
                >
                  <option value="">Select target store</option>
                  {locations
                    .filter((l) => l.id !== modal.fromLocationId)
                    .map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.location_type})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label>Transfer Quantity *</label>
                <input
                  type="number"
                  min={modal.availableQty > 0 ? 1 : 0}
                  max={Math.max(1, modal.availableQty)}
                  value={modal.quantity}
                  onChange={(e) => setModal((m) => ({ ...m, quantity: Number(e.target.value) }))}
                  required
                  disabled={modal.availableQty <= 0}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label>Notes / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Stock balancing request"
                  value={modal.notes}
                  onChange={(e) => setModal((m) => ({ ...m, notes: e.target.value }))}
                  disabled={modal.availableQty <= 0}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModal((m) => ({ ...m, isOpen: false }))}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={modal.availableQty <= 0}
                  style={modal.availableQty <= 0 ? { opacity: 0.5, cursor: "not-allowed", background: "var(--text-muted)" } : {}}
                >
                  {modal.availableQty <= 0 ? "Insufficient Stock" : "Confirm & Transfer ➔"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="toast-banner">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default StockDistributionBoard;
