import type { StockTransfer } from "../types/inventory";

interface StockTransferTableProps {
  transfers: StockTransfer[];
  loading: boolean;
}

export default function StockTransferTable({
  transfers,
  loading,
}: StockTransferTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        Loading stock transfers...
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
              Product
            </th>

            <th className="px-4 py-3 text-left">
              Variant
            </th>

            <th className="px-4 py-3 text-left">
              From
            </th>

            <th className="px-4 py-3 text-left">
              To
            </th>

            <th className="px-4 py-3 text-right">
              Quantity
            </th>

            <th className="px-4 py-3 text-left">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {transfers.map((transfer) => (
            <tr
              key={transfer.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                {transfer.reference}
              </td>

              <td className="px-4 py-3">
                {transfer.product_name}
              </td>

              <td className="px-4 py-3">
                {transfer.variant_name || "-"}
              </td>

              <td className="px-4 py-3">
                {transfer.from_location_name}
              </td>

              <td className="px-4 py-3">
                {transfer.to_location_name}
              </td>

              <td className="px-4 py-3 text-right">
                {transfer.quantity}
              </td>

              <td className="px-4 py-3">
                {transfer.status}
              </td>
            </tr>
          ))}

          {transfers.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="p-8 text-center text-gray-500"
              >
                No stock transfers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}