import { useEffect, useState } from "react";

import {
  getStockCounts,
  createStockCount,
} from "../api/inventoryApi";

import type { StockCount } from "../types/inventory";

export default function StockCountsPage() {
  const [counts, setCounts] = useState<StockCount[]>([]);

  const [location, setLocation] = useState("");

  const [countDate, setCountDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);

  const loadCounts = async () => {
    try {
      setLoading(true);

      const data = await getStockCounts();

      setCounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounts();
  }, []);

  const handleCreate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!location) {
      alert("Please select a location.");
      return;
    }

    try {
      await createStockCount({
        stock_location: Number(location),
        count_date: countDate,
        notes,
      });

      alert("Stock count created successfully.");

      setLocation("");
      setNotes("");

      loadCounts();
    } catch (err) {
      console.error(err);

      alert("Unable to create stock count.");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Stock Counts
        </h1>

        <p className="text-sm text-gray-500">
          Record and verify physical stock quantities.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-lg border bg-white p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            Location ID
          </label>

          <input
            type="number"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            placeholder="Location ID"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Count Date
          </label>

          <input
            type="date"
            value={countDate}
            onChange={(event) =>
              setCountDate(event.target.value)
            }
            className="rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Notes
          </label>

          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={3}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Start Stock Count
        </button>
      </form>

      <div className="overflow-x-auto rounded-lg border bg-white">
        {loading ? (
          <div className="p-8 text-center">
            Loading stock counts...
          </div>
        ) : (
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
              </tr>
            </thead>

            <tbody>
              {counts.map((count) => (
                <tr
                  key={count.id}
                  className="border-b last:border-0"
                >
                  <td className="px-4 py-3">
                    {count.reference}
                  </td>

                  <td className="px-4 py-3">
                    {count.stock_location_name}
                  </td>

                  <td className="px-4 py-3">
                    {count.count_date}
                  </td>

                  <td className="px-4 py-3">
                    {count.status}
                  </td>

                  <td className="px-4 py-3">
                    {count.counted_by_name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}