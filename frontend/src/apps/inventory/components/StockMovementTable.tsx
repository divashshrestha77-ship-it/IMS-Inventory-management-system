import type { StockMovement } from "../types/inventory";

interface StockMovementTableProps {
  movements: StockMovement[];
  loading: boolean;
}

export default function StockMovementTable({
  movements,
  loading,
}: StockMovementTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading stock movements...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              Product
            </th>

            <th className="px-4 py-3 text-left">
              Variant
            </th>

            <th className="px-4 py-3 text-left">
              Location
            </th>

            <th className="px-4 py-3 text-left">
              Movement Type
            </th>

            <th className="px-4 py-3 text-right">
              Quantity
            </th>

            <th className="px-4 py-3 text-left">
              Reference
            </th>

            <th className="px-4 py-3 text-left">
              Reason
            </th>

            <th className="px-4 py-3 text-left">
              Date
            </th>
          </tr>
        </thead>

        <tbody>
          {movements.map((movement) => (
            <tr
              key={movement.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                {movement.product_name}
              </td>

              <td className="px-4 py-3">
                {movement.variant_name || "-"}
              </td>

              <td className="px-4 py-3">
                {movement.stock_location_name}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {movement.movement_type}
                </span>
              </td>

              <td className="px-4 py-3 text-right">
                {movement.quantity}
              </td>

              <td className="px-4 py-3">
                {movement.reference || "-"}
              </td>

              <td className="px-4 py-3">
                {movement.reason || "-"}
              </td>

              <td className="px-4 py-3">
                {new Date(
                  movement.created_at
                ).toLocaleString()}
              </td>
            </tr>
          ))}

          {movements.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-8 text-center text-gray-500"
              >
                No stock movements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}