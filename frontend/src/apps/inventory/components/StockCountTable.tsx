import type { StockCount } from "../types/inventory";

interface StockCountTableProps {
  counts: StockCount[];
  loading: boolean;
}

export default function StockCountTable({
  counts,
  loading,
}: StockCountTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading stock counts...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              Reference
            </th>

            <th className="px-4 py-3 text-left">
              Location
            </th>

            <th className="px-4 py-3 text-left">
              Count Date
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-left">
              Counted By
            </th>

            <th className="px-4 py-3 text-left">
              Notes
            </th>
          </tr>
        </thead>

        <tbody>
          {counts.map((count) => (
            <tr
              key={count.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">
                {count.reference}
              </td>

              <td className="px-4 py-3">
                {count.stock_location_name}
              </td>

              <td className="px-4 py-3">
                {count.count_date}
              </td>

              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {count.status}
                </span>
              </td>

              <td className="px-4 py-3">
                {count.counted_by_name || "-"}
              </td>

              <td className="px-4 py-3">
                {count.notes || "-"}
              </td>
            </tr>
          ))}

          {counts.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-gray-500"
              >
                No stock counts found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}