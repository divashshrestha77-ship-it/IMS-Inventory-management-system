interface InventoryFiltersProps {
  search: string;
  location: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

export default function InventoryFilters({
  search,
  location,
  onSearchChange,
  onLocationChange,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 md:flex-row">
      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        className="rounded-md border px-3 py-2 outline-none focus:ring-2"
      />

      <select
        value={location}
        onChange={(event) =>
          onLocationChange(event.target.value)
        }
        className="rounded-md border px-3 py-2 outline-none"
      >
        <option value="">All locations</option>
        <option value="STORE">Stores</option>
        <option value="POPUP">Pop-up Stores</option>
        <option value="WAREHOUSE">Warehouse</option>
        <option value="ONLINE">Online</option>
      </select>
    </div>
  );
}