import type { StockLocation } from "../types/inventory";

interface StockLocationTableProps {
  locations: StockLocation[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export default function StockLocationTable({
  locations,
  loading,
  onDelete,
}: StockLocationTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading stock locations...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="min-w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Code
            </th>

            <th className="px-4 py-3 text-left">
              Type
            </th>

            <th className="px-4 py-3 text-left">
              Address
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {locations.map((location) => (
            <tr
              key={location.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium">
                {location.name}
              </td>

              <td className="px-4 py-3">
                {location.code}
              </td>

              <td className="px-4 py-3">
                {location.location_type}
              </td>

              <td className="px-4 py-3">
                {location.address || "-"}
              </td>

              <td className="px-4 py-3">
                {location.is_active ? (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                    Inactive
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(location.id)}
                  className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {locations.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-gray-500"
              >
                No stock locations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}