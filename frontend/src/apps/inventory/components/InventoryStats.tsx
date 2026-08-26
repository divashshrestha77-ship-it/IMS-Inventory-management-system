import type { Inventory } from "../types/inventory";

interface InventoryStatsProps {
  inventory: Inventory[];
}

export default function InventoryStats({
  inventory,
}: InventoryStatsProps) {
  const totalProducts = new Set(
    inventory.map((item) => item.product)
  ).size;

  const totalQuantity = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalAvailable = inventory.reduce(
    (total, item) => total + item.available_quantity,
    0
  );

  const lowStock = inventory.filter(
    (item) =>
      item.reorder_level !== undefined &&
      item.quantity <= item.reorder_level
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Products
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {totalProducts}
        </h2>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Total Stock
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {totalQuantity}
        </h2>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Available Stock
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          {totalAvailable}
        </h2>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-500">
          Low Stock
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-red-600">
          {lowStock}
        </h2>
      </div>
    </div>
  );
}