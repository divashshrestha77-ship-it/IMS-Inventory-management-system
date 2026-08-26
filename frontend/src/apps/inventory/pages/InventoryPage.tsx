import { useEffect, useMemo, useState } from "react";

import {
  getInventory,
} from "../api/inventoryApi";

import type { Inventory } from "../types/inventory";

import InventoryStats from "../components/InventoryStats";
import InventoryFilters from "../components/InventoryFilters";
import InventoryTable from "../components/InventoryTable";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Inventory[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getInventory();

      setInventory(data);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load inventory. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.product_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.variant_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesLocation =
        !location ||
        item.stock_location_name
          .toLowerCase()
          .includes(location.toLowerCase());

      return Boolean(matchesSearch && matchesLocation);
    });
  }, [inventory, search, location]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Inventory
          </h1>

          <p className="text-sm text-gray-500">
            Monitor stock across all locations and channels.
          </p>
        </div>

        <button
          onClick={loadInventory}
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <InventoryStats inventory={inventory} />

      <InventoryFilters
        search={search}
        location={location}
        onSearchChange={setSearch}
        onLocationChange={setLocation}
      />

      <InventoryTable
        inventory={filteredInventory}
        loading={loading}
      />
    </div>
  );
}