import { useEffect, useState } from "react";
import { getLocations } from "../api/inventoryApi";
import type { StockLocation } from "../types/inventory";

const akkaraLocations: StockLocation[] = [
  { id: 1, name: "Central Warehouse Reserve", code: "WH-BKK-01", location_type: "Central Warehouse", phone: "+66 2 111 2222", description: "Main stock reserve & packing hub", is_active: true, created_at: "", updated_at: "" },
  { id: 2, name: "Shopee Online Buffer", code: "ONL-SHP-01", location_type: "Online Shop", phone: "-", description: "Shopee inventory allocation buffer", is_active: true, created_at: "", updated_at: "" },
  { id: 3, name: "Line Official Online Buffer", code: "ONL-LNE-01", location_type: "Online Shop", phone: "-", description: "Line Official inventory buffer", is_active: true, created_at: "", updated_at: "" },
  { id: 4, name: "Storefront: Siam Paragon", code: "STR-PGN-01", location_type: "Storefront", phone: "+66 2 999 1001", description: "Main Storefront 1", is_active: true, created_at: "", updated_at: "" },
  { id: 5, name: "Storefront: Central World", code: "STR-CW-02", location_type: "Storefront", phone: "+66 2 999 1002", description: "Main Storefront 2", is_active: true, created_at: "", updated_at: "" },
  { id: 6, name: "Storefront: IconSiam", code: "STR-ICN-03", location_type: "Storefront", phone: "+66 2 999 1003", description: "Main Storefront 3", is_active: true, created_at: "", updated_at: "" },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: 7 + i,
    name: `Pop-up Store ${i + 1} (${["Mega Bangna", "Central Ladprao", "Central Embassy", "EmQuartier", "Silom Complex", "Fashion Island", "Central Rama 9", "Siam Discovery", "Central Westgate", "IconSiam Pop-up"][i]})`,
    code: `POP-${(i + 1).toString().padStart(2, "0")}`,
    location_type: "Pop-up Store",
    phone: "-",
    description: `Department Store Pop-up ${i + 1}`,
    is_active: true,
    created_at: "",
    updated_at: "",
  })),
];

export default function StockLocationsPage() {
  const [locations, setLocations] = useState<StockLocation[]>(akkaraLocations);

  useEffect(() => {
    getLocations()
      .then((data) => {
        if (data && data.length > 0) setLocations(data);
      })
      .catch(() => {
        /* fallback to akkaraLocations */
      });
  }, []);

  const storefrontsCount = locations.filter((l) => l.location_type === "Storefront").length;
  const popupsCount = locations.filter((l) => l.location_type === "Pop-up Store").length;
  const onlineCount = locations.filter((l) => l.location_type === "Online Shop").length;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Akkara Bangkok Stock Locations</h1>
          <div className="sub">
            15 Omnichannel Stock Nodes: 3 Storefronts, 10 Pop-up Stores, Shopee & Line Official
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">Total Location Nodes</div>
          <div className="stat-value">{locations.length} Locations</div>
        </div>
        <div className="stat">
          <div className="stat-label">Main Storefronts</div>
          <div className="stat-value">{storefrontsCount} Stores</div>
        </div>
        <div className="stat">
          <div className="stat-label">Pop-up Outlets</div>
          <div className="stat-value">{popupsCount} Stores</div>
        </div>
        <div className="stat">
          <div className="stat-label">Online Channels</div>
          <div className="stat-value">{onlineCount} Channels</div>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data">
          <thead>
            <tr>
              <th>Code</th>
              <th>Location Name</th>
              <th>Channel Type</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((l) => (
              <tr key={l.id}>
                <td className="mono" style={{ fontWeight: 700, color: "var(--primary)" }}>
                  {l.code}
                </td>
                <td style={{ fontWeight: 700 }}>{l.name}</td>
                <td>
                  <span
                    className={`badge ${
                      l.location_type === "Storefront"
                        ? "badge-blue"
                        : l.location_type === "Pop-up Store"
                        ? "badge-amber"
                        : l.location_type === "Online Shop"
                        ? "badge-green"
                        : "badge-gray"
                    }`}
                  >
                    {l.location_type}
                  </span>
                </td>
                <td className="muted">{l.description || "—"}</td>
                <td>
                  <span className="badge badge-green">Active Node</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
