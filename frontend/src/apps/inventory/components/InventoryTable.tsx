import type { Inventory } from "../types/inventory";

interface InventoryTableProps {
  inventory: Inventory[];
  loading: boolean;
}

export default function InventoryTable({
  inventory,
  loading,
}: InventoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading inventory...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">Product</th>
            <th className="px-4 py-3 text-left">Variant</th>
            <th className="px-4 py-3 text-left">Location</th>
            <th className="px-4 py-3 text-right">Quantity</th>
            <th className="px-4 py-3 text-right">Reserved</th>
            <th className="px-4 py-3 text-right">Available</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => {
            const lowStock =
              item.reorder_level !== undefined &&
              item.quantity <= item.reorder_level;

            return (
              <tr
                key={item.id}
                className="border-b last:border-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {item.product_name}
                </td>

                <td className="px-4 py-3">
                  {item.variant_name || "-"}
                </td>

                <td className="px-4 py-3">
                  {item.stock_location_name}
                </td>

                <td className="px-4 py-3 text-right">
                  {item.quantity}
                </td>

                <td className="px-4 py-3 text-right">
                  {item.reserved_quantity}
                </td>

                <td className="px-4 py-3 text-right font-medium">
                  {item.available_quantity}
                </td>

                <td className="px-4 py-3">
                  {lowStock ? (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                      Low Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            );
          })}

          {inventory.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-gray-500"
              >
                No inventory found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}