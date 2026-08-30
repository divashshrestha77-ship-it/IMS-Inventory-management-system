import { useEffect, useState } from "react";
import { API_BASE } from "../../../config";
import type { StockCountLine } from "../types/inventory";

const mockCountLines: StockCountLine[] = [
  { id: 1, product: 1, product_name: "Silk Shirt - Navy Blue", variant: 101, variant_name: "Size L / Blue", system_quantity: 100, counted_quantity: 98, difference: -2, notes: "Pop-up Store 1 Audit" },
  { id: 2, product: 2, product_name: "Linen Trousers - Beige", variant: null, variant_name: null, system_quantity: 50, counted_quantity: 50, difference: 0, notes: "Central World Audit" },
  { id: 3, product: 3, product_name: "Wireless Noise-Canceling Earbuds", variant: 102, variant_name: "Black Edition", system_quantity: 200, counted_quantity: 195, difference: -5, notes: "Shopee Buffer Verification" },
];

export default function StockCountLinesPage() {
  const [lines, setLines] = useState<StockCountLine[]>(mockCountLines);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/inventory/count-lines/`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data && data.length > 0) setLines(data);
      })
      .catch(() => {
        /* fallback to mock lines */
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Count Lines</h1>
          <div className="sub">Itemized line audits comparing system stock vs counted stock</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading count lines...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Variant</th>
                <th>System Qty</th>
                <th>Counted Qty</th>
                <th>Difference (Variance)</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.id}>
                  <td className="mono">{l.id}</td>
                  <td style={{ fontWeight: 700 }}>{l.product_name}</td>
                  <td className="muted">{l.variant_name || "—"}</td>
                  <td style={{ fontWeight: 600 }}>{l.system_quantity}</td>
                  <td style={{ fontWeight: 600 }}>{l.counted_quantity}</td>
                  <td>
                    {l.difference === 0 ? (
                      <span className="badge badge-green">0 (Exact)</span>
                    ) : (
                      <span className="badge badge-red">{l.difference} units</span>
                    )}
                  </td>
                  <td className="muted">{l.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
