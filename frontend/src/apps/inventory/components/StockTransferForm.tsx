import { useState } from "react";

import { createStockTransfer } from "../api/inventoryApi";

interface StockTransferFormProps {
  onSuccess?: () => void;
}

export default function StockTransferForm({
  onSuccess,
}: StockTransferFormProps) {
  const [product, setProduct] = useState("");

  const [fromLocation, setFromLocation] =
    useState("");

  const [toLocation, setToLocation] =
    useState("");

  const [quantity, setQuantity] = useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!product || !fromLocation || !toLocation || !quantity) {
      alert("Please fill all required fields.");
      return;
    }

    if (fromLocation === toLocation) {
      alert(
        "Source and destination locations must be different."
      );
      return;
    }

    try {
      setLoading(true);

      await createStockTransfer({
        product: Number(product),
        from_location: Number(fromLocation),
        to_location: Number(toLocation),
        quantity: Number(quantity),
        notes,
      });

      alert("Stock transfer created successfully.");

      setProduct("");
      setFromLocation("");
      setToLocation("");
      setQuantity("");
      setNotes("");

      onSuccess?.();
    } catch (err) {
      console.error(err);

      alert("Unable to create stock transfer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Product
        </label>

        <input
          type="number"
          value={product}
          onChange={(event) =>
            setProduct(event.target.value)
          }
          placeholder="Product ID"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          From Location
        </label>

        <input
          type="number"
          value={fromLocation}
          onChange={(event) =>
            setFromLocation(event.target.value)
          }
          placeholder="Source location ID"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          To Location
        </label>

        <input
          type="number"
          value={toLocation}
          onChange={(event) =>
            setToLocation(event.target.value)
          }
          placeholder="Destination location ID"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Quantity
        </label>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(event) =>
            setQuantity(event.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
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
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Transfer"}
      </button>
    </form>
  );
}