import type { StockCountLine } from "../types/inventory";

interface StockCountLineTableProps {
  lines: StockCountLine[];
  loading: boolean;
}

export default function StockCountLineTable({
  lines,
  loading,
}: StockCountLineTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading count lines...
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

            <th className="px-4 py-3 text-right">
              System Qty
            </th>

            <th className="px-4 py-3 text-right">
              Counted Qty
            </th>

            <th className="px-4 py-3 text-right">
              Difference
            </th>

            <th className="px-4 py-3 text-left">
              Notes
            </th>
          </tr>
        </thead>

        <tbody>
          {lines.map((line) => (
            <tr
              key={line.id}
              className="border-b last:border-0"
            >
              <td className="px-4 py-3">
                {line.product_name}
              </td>

              <td className="px-4 py-3">
                {line.variant_name || "-"}
              </td>

              <td className="px-4 py-3 text-right">
                {line.system_quantity}
              </td>

              <td className="px-4 py-3 text-right">
                {line.counted_quantity}
              </td>

              <td
                className={`px-4 py-3 text-right font-medium ${
                  line.difference < 0
                    ? "text-red-600"
                    : line.difference > 0
                    ? "text-green-600"
                    : "text-gray-600"
                }`}
              >
                {line.difference}
              </td>

              <td className="px-4 py-3">
                {line.notes || "-"}
              </td>
            </tr>
          ))}

          {lines.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-gray-500"
              >
                No count lines found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}