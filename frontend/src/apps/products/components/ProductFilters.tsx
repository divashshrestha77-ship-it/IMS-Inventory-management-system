interface ProductFiltersProps {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const ProductFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: ProductFiltersProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-white p-4 md:flex-row">

      <input
        type="text"
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
        placeholder="Search by product name or SKU..."
        className="flex-1 rounded-md border px-3 py-2"
      />

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="rounded-md border px-3 py-2"
      >
        <option value="all">
          All Status
        </option>

        <option value="active">
          Active
        </option>

        <option value="inactive">
          Inactive
        </option>
      </select>
    </div>
  );
};

export default ProductFilters;