import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left">
              Product
            </th>

            <th className="px-4 py-3 text-left">
              SKU
            </th>

            <th className="px-4 py-3 text-left">
              Category
            </th>

            <th className="px-4 py-3 text-left">
              Unit
            </th>

            <th className="px-4 py-3 text-left">
              Price
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
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="font-medium">
                  {product.name}
                </div>

                <div className="text-sm text-gray-500">
                  {product.description}
                </div>
              </td>

              <td className="px-4 py-3">
                {product.sku}
              </td>

              <td className="px-4 py-3">
                {product.category}
              </td>

              <td className="px-4 py-3">
                {product.unit}
              </td>

              <td className="px-4 py-3">
                Rs. {product.price}
              </td>

              <td className="px-4 py-3">
                {product.is_active ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                    Inactive
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(product)}
                  className="mr-3 text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(product.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;